import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import DevelopedRules from '../general/pages/DevelopedRules';
import Tools from './pages/Tools.vue';
import Laws from './pages/Laws.vue';
import LawRules from './pages/LawRules.vue';
import Cleanfile from '../cgs/pages/Cleanfile.vue';

import perimeter from '@/perimeters/base.perimeter';

const generalRoutes = [
  {
    path: '/developed-rules',
    name: 'developed-rules',
    component: DevelopedRules,
    meta: {
      perimeter,
      perimeterAction: 'developedRuleBrowse',
    },
  },
  {
    path: '/laws',
    name: 'laws',
    component: Laws,
    meta: {
      perimeter,
      perimeterAction: 'manageLaw',
    },
  },
  {
    path: '/laws/:rankId/rules',
    name: 'lawRules',
    component: LawRules,
    props: (route) => ({
      rankId: Number(route.params.rankId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'manageLaw',
    },
  },
  {
    path: '/tools',
    name: 'tools',
    component: Tools,
  },
  {
    path: '/project/:projectId/tree/:treeId/cleanfiles/:fileId',
    name: 'cleanfile',
    component: Cleanfile,
    meta: {
      hideHeader: true,
    },
    props: (route) => ({
      fileId: Number(route.params.fileId),
    }),
  },
];

const router = new VueRouter({
  routes: _.uniqBy(generalRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
