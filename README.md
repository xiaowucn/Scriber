# Scriber - 前端项目

## 项目简介

#### 本项目使用 **Node.js**、**Yarn**、**Vite** 作为主要开发工具，请确保版本满足以下要求：

- `node` >= 22.0.0
- `yarn` >= 1.22.0

#### 核心框架

- [Vue.js](https://v2.cn.vuejs.org/) （`2.7.16`）
- [Element-ui](https://element.eleme.cn/) （`2.15.14`）

#### 目录结构

```
./
│
├── dist/                       # 打包输出目录（由 `yarn build` 生成）
├── node_modules/               # 第三方依赖包（由 `yarn install` 自动生成）
├── public/                     # 公共静态资源目录，里面的文件会在构建时直接复制到输出目录
├── src/                        # 源代码目录
│   ├── assets/                 # 静态资源文件（svg、字体等）
│   ├── components/             # 可复用的组件
│   ├── containers/             # 页面视图文件
│   ├── custom/**/              # 客户定制化模块
│   ├── i18n/                   # 国际化配置
│   ├── images/                 # 图片文件
│   ├── mixins/                 # 混入文件
│   ├── perimeters/             # 权限管理模块
│   ├── store/                  # 状态管理模块（如 Vuex）
│   ├── styles/                 # 样式文件目录
│   ├── utils/                  # 工具函数目录
│   ├── App.vue                 # App 根组件
│   ├── main.js                 # 项目入口文件
│   └── router.js               # 路由配置文件
├── static/                     # 静态资源目录（如 favicon 等）
├── tests/                      # 测试文件目录
├── .env.*                      # 环境变量配置文件
├── .gitignore                  # Git 忽略提交的文件规则
├── custom.config.js            # 客户环境自定义配置（定制路由、主题等）
├── index.html                  # 根入口 html 文件
├── package.json                # 配置及依赖管理文件
├── README.md                   # 说明文档
├── vite.config.js              # vite 配置文件
└── yarn.lock                   # Yarn 锁定依赖版本文件
```

## 开发环境

#### 1. 安装依赖

```bash
yarn install
```

#### 2. 启动开发环境

```bash
yarn dev
```

#### 使用 CGS LOGO（默认）

```bash
yarn dev-cgs
```

#### 使用 Paoding LOGO

```bash
yarn dev-cgs-paoding
```

## 生产环境

#### 打包部署

```bash
yarn build
```

#### 构建 CGS LOGO（默认）

```bash
yarn build-cgs
```

#### 构建 Paoding LOGO

```bash
yarn build-cgs-paoding
```
