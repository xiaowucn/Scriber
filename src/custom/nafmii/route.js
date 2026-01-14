import _ from 'lodash';
import VueRouter from 'vue-router';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import SensitiveWords from './pages/SensitiveWords';
import DataKnowledge from './pages/DataKnowledge';
import DataKnowledgeDetail from './pages/DataKnowledgeDetail';
import SystemLog from './pages/SystemLog';
import Task from './pages/Task';
import perimeter from '@/perimeters/base.perimeter';

const nafmiiRoutes = [
  {
    path: '/sensitive-words',
    name: 'sensitiveWords',
    component: SensitiveWords,
    meta: {
      perimeter,
      perimeterAction: 'manageAll',
    },
  },
  {
    path: '/data-knowledge',
    name: 'dataKnowledge',
    component: DataKnowledge,
    meta: {
      perimeter,
      perimeterAction: 'manageAll',
    },
  },
  {
    path: '/data-knowledge/:dataKnowledgeId',
    name: 'dataKnowledgeDetail',
    component: DataKnowledgeDetail,
    props: (route) => ({
      dataKnowledgeId: Number(route.params.dataKnowledgeId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'manageAll',
    },
  },
  {
    path: '/system-log',
    name: 'systemLog',
    component: SystemLog,
    meta: {
      perimeter,
      perimeterAction: 'manageAll',
    },
  },
  {
    path: '/task',
    name: 'task',
    component: Task,
    meta: {
      perimeter,
      perimeterAction: 'manageTask',
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(nafmiiRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
