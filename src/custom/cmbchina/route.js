import _ from 'lodash';
import VueRouter from 'vue-router';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import Index from './Index.vue';
import Audit from './pages/Audit.vue';
import AuditTest from './pages/AuditTest.vue';

const cmbchinaRoutes = [
  {
    path: '/cmbchina',
    name: 'cmbchina',
    component: Index,
    meta: {
      hideHeader: true,
    },
    children: [
      {
        path: 'files/:fileId/audit',
        name: 'audit',
        component: Audit,
        meta: {
          hideHeader: true,
        },
        props: (route) => ({
          fileId: Number(route.params.fileId),
        }),
      },
      {
        path: 'files/:fileId/audit-test',
        name: 'audit',
        component: AuditTest,
        meta: {
          hideHeader: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(cmbchinaRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
