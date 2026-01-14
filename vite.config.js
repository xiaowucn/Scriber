import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { minify } from 'html-minifier-terser';
import { CopyUnsupportedBrowserVitePlugin } from 'unsupported-browser-plugin';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { GenerateVersionFileVitePlugin } from '@paoding/fe-version-plugin';
import git from 'git-rev-sync';

import {
  getRouterPath,
  getThemePath,
  getVariablesPath,
  getPdfViewer,
} from './custom.config.js';

// 获取LOGO配置的 favicon
const getBrandFavicon = (env) => {
  const brand = env.VITE_BRAND;
  const dist = env.VITE_DIST;

  // 如果不是 CGS 环境，使用原有的 VITE_FAVICON
  if (dist !== 'CGS') {
    return env.VITE_FAVICON;
  }

  // CGS 环境根据brand选择 favicon
  if (brand === 'paoding') {
    return 'favicon.png';
  }

  return env.VITE_FAVICON;
};

// 获取复制文件列表
const getCopyDirList = (env) => {
  const copyDirList = [];
  const dist = env.VITE_DIST;

  // pdf-document-viewer 文件复制
  copyDirList.push({
    src: path.resolve(__dirname, './node_modules/pdf-document-viewer/dist/*'),
    dest: 'static/pdf-document-viewer',
  });

  // GFFUND 特殊处理 - pdf.worker.js polyfill
  if (dist === 'GFFUND') {
    copyDirList.push({
      src: path.resolve(
        __dirname,
        './node_modules/pdf-document-viewer/dist/worker/pdf.worker.js',
      ),
      dest: 'static/pdf-document-viewer/worker',
      transform(content) {
        const polyfillFileContent = fs.readFileSync(
          './node_modules/@paoding/pdf-document-viewer-polyfill/dist/index.js',
          'utf-8',
        );
        return `${polyfillFileContent}\n${content}`;
      },
    });
  }

  // HKEX 特殊处理
  if (dist === 'HKEX') {
    copyDirList.push(
      {
        src: path.resolve(__dirname, './node_modules/pdfjs/web/*'),
        dest: 'static/pdf-document-viewer/web',
      },
      {
        src: path.resolve(__dirname, './src/custom/hkex/static/*'),
        dest: '',
        transform: async (content, targetPath) => {
          if (targetPath.endsWith('.html')) {
            try {
              const minified = await minify(content.toString(), {
                collapseWhitespace: true, // 移除空白字符
                removeComments: true, // 移除注释
                minifyCSS: true, // 压缩内联 CSS
                minifyJS: true, // 压缩内联 JS
              });
              return minified;
            } catch (error) {
              return content; // 出错时返回原内容
            }
          }
          // 非 HTML 文件直接返回原内容
          return content;
        },
      },
    );
  }

  // favicon 复制 - 根据配置使用 favicon
  const favicon = getBrandFavicon(env);
  if (favicon) {
    copyDirList.push({
      src: path.resolve(__dirname, `./static/${favicon}`),
      dest: '',
    });
  }

  return copyDirList;
};

// 获取插件列表
const getPlugins = (env) => {
  const gitCommit = git.long();
  const favicon = getBrandFavicon(env);

  const defaultPlugins = [
    vue(),
    vueJsx(), // 添加 Vue 2 JSX 支持
    createHtmlPlugin({
      entry: 'src/main.js',
      inject: {
        data: {
          env: env.VITE_DIST,
          title: env.VITE_TITLE,
          favicon: favicon ? `./${favicon}` : '',
          git: {
            branch: git.branch(),
            short: git.short(),
            long: gitCommit,
            date: git
              .date()
              .toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          },
        },
      },
      // 启用 HTML 压缩（生产环境自动启用）
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    createSvgIconsPlugin({
      // 使用与 svg.font.config.js 相同的路径
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg-icons')],
      // 使用与原配置兼容的 symbolId 格式
      symbolId: 'pd-icon-[name]',
    }),
    viteStaticCopy({
      silent: false,
      targets: getCopyDirList(env),
    }),
    {
      name: 'remove-emails-from-node-modules-code',
      enforce: 'post',
      transform(code, id) {
        // 移除 node_modules 依赖包源码注释中的邮箱地址
        if (/node_modules\/.*\.[jt]s$/.test(id)) {
          return code.replace(
            /(\/\*[\s\S]*?\*\/|\/\/.*)/g, // 匹配所有注释
            (comment) =>
              comment.replace(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
                '',
              ),
          );
        }
        return code;
      },
    },
    CopyUnsupportedBrowserVitePlugin(),
  ];

  // 特定环境的插件
  if (env.VITE_DIST === 'HKEX') {
    defaultPlugins.push(
      // HKEX 环境需要额外的版本文件生成
      GenerateVersionFileVitePlugin(gitCommit),
    );
  }

  return defaultPlugins;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const dist = env.VITE_DIST;

  return {
    base: env.VITE_PUBLIC_PATH || './',
    assetsDir: 'static',
    envPrefix: 'VITE_', // 配置环境变量前缀
    plugins: getPlugins(env),

    // 依赖优化配置 - 处理 @paoding-label/vue-image-viewer 兼容性
    optimizeDeps: {
      include: [
        'core-js',
        '@paoding-label/vue-image-viewer',
        'pdf-document-viewer',
        'echarts',
        'katex',
        'lodash',
        'dayjs',
        'element-ui',
      ],
      exclude: [
        '@paoding-label/image-viewer', // 可能有兼容性问题的依赖
        'handsontable',
      ],
    },

    // 路径解析配置
    resolve: {
      alias: [
        { find: /^~@/, replacement: path.resolve(__dirname, './src') },
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: /^~/, replacement: '' },
        { find: 'vue', replacement: 'vue/dist/vue.esm.js' },
        {
          find: 'env-router',
          replacement: getRouterPath(dist),
        },
        {
          find: 'env-element-theme',
          replacement: getThemePath(dist),
        },
        {
          find: 'env-pdf-viewer',
          replacement: getPdfViewer(),
        },
      ],
      extensions: ['.js', '.jsx', '.vue', '.json'],
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${getVariablesPath(dist)}";`,
          quietDeps: true, // 忽略依赖（如 element-ui 等）中的 deprecated 警告
          silenceDeprecations: [
            'legacy-js-api',
            'slash-div',
            'color-functions',
          ],
        },
      },
    },

    // 开发服务器配置
    server: {
      port: '8080',
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
        },
      },
      compress: false,
    },

    // esbuild 配置
    esbuild:
      env.NODE_ENV === 'production'
        ? {
            pure: ['console.log', 'console.info'],
            drop: ['debugger'],
          }
        : {},

    // 构建配置
    build: {
      sourcemap: Boolean(env.VITE_ENABLE_ERROR_TRACK),
      commonjsOptions: {
        include: [/vue-image-viewer/, /pdf-document-viewer/, /node_modules/],
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            let extType = info[info.length - 1];

            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            ) {
              extType = 'media';
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'img';
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts';
            }

            return `static/${extType}/[name]-[hash][extname]`;
          },
          // 手动分包配置
          manualChunks: {
            'vendor-vue': [
              'vue',
              'vue-router',
              'vuex',
              'vue-i18n',
              'vue-kindergarten',
            ],
            'vendor-element-ui': ['element-ui'],
            'vendor-vue-components': ['@wchbrad/vue-easy-tree', 'vuedraggable'],
            'vendor-echarts': ['echarts'],
            'vendor-pdf-viewer': [
              'pdf-document-viewer',
              '@paoding/prediction-tools',
            ],
            'vendor-spreadsheet': [
              'xlsx',
              'x-data-spreadsheet/dist/xspreadsheet.js',
            ],
            'vendor-utils': [
              'axios',
              'qs',
              'dayjs',
              'uuid',
              'blueimp-md5',
              'js-base64',
              'cryptjs',
              'chrono-node',
              'lodash',
              'katex',
            ],
          },
        },
      },
    },
  };
});
