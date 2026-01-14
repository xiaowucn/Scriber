import Vue from 'vue';
import VueRouter from 'vue-router';
import VueKindergarten from 'vue-kindergarten';

import ElementUI from 'element-ui';
import enLocale from 'element-ui/lib/locale/lang/en';

import { isENLang } from '@/store/constants';

import 'element-ui/lib/theme-chalk/index.css';
import '@fortawesome/fontawesome-free-webfonts';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';

import './styles/global.css';

import echarts from 'echarts/lib/echarts';
import './assets/echarts';

import 'virtual:svg-icons-register';

import SvgFontIcon from './components/SvgFontIcon';
import ThemeIcon from './components/ThemeIcon';

import * as filters from './utils/filters';

import * as directives from './utils/directives';

import VueI18n from 'vue-i18n';
import messages from './i18n';

import { notify } from './utils/reset-elementui.js';

import App from './App.vue';
import router from 'env-router';
import store from './store';
import perimeters from './perimeters';
import { text, style } from './utils/globalDataByEnv';

const platformPerimeter = perimeters.find(
  (item) => item.purpose === 'platform',
);
if (platformPerimeter.isHkexEnv()) {
  import('./custom/hkex/style.scss');
} else if (platformPerimeter.isDefaultEnv()) {
  import('env-element-theme');
  import('./styles/default-style.scss');
  if (platformPerimeter.isNafmiiEnv()) {
    import('./custom/nafmii/styles/style.scss');
  }
  if (platformPerimeter.isCiticsDCMEnv()) {
    import('./custom/citics_dcm/styles/style.scss');
  }
  if (platformPerimeter.isCmfchinaEnv()) {
    import('./custom/cmfchina/styles/style.scss');
  }
}

Vue.use(VueI18n);
Vue.use(ElementUI, {
  locale: import.meta.env.VITE_LANG === 'EN' ? enLocale : null,
});
Vue.use(VueKindergarten, {
  child: () => {
    return {
      ...store.getters.loginUser,
      config: store.getters.configuration,
    };
  },
});
Vue.use(VueRouter);

const i18n = new VueI18n({
  locale: isENLang ? 'en' : 'cn',
  messages,
});

Vue.prototype.i18n = i18n;
Vue.prototype.$notify = notify;
Vue.prototype.$echarts = echarts;
Vue.prototype.$text = text;
Vue.prototype.$style = style;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key]);
});

Vue.component('svg-font-icon', SvgFontIcon);
Vue.component('theme-icon', ThemeIcon);

const handleClick = ElementUI.Button.methods.handleClick;
ElementUI.Button.methods.handleClick = function (...arg) {
  this.$el.blur();
  handleClick.apply(this, arg);
};

(async () => {
  try {
    await store.dispatch('getConfig');
    await store.dispatch('getUserInfo');
  } catch (error) {
    if (error.status_code !== 401) {
      notify({
        title: i18n._vm.messages[i18n._vm['locale']].message['错误'],
        message: error.message,
        type: 'error',
      });
    }
  }

  new Vue({
    i18n,
    router,
    store,
    perimeters,
    render: (h) => h(App),
  }).$mount('#app');
})();
