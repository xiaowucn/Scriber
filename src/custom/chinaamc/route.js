import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import Tools from './pages/Tools.vue';

const chinaamcRoutes = [
  {
    path: '/tools',
    name: 'tools',
    component: Tools,
  },
];

const router = new VueRouter({
  routes: _.uniqBy(chinaamcRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
