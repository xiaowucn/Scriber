import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import SSE from './index';
import Poc from './pages/Poc';
import PocProject from './pages/PocProject';
import PocDetails from './pages/PocDetails';
import PocRuleSummary from './pages/PocRuleSummary';
import PocRuleSummaryDetails from './pages/PocRuleSummaryDetails';

const sseRoutes = [
  {
    path: '/',
    redirect: '/sse/poc',
  },
  {
    path: '/sse',
    component: SSE,
    children: [
      {
        path: 'poc',
        name: 'poc',
        component: Poc,
        redirect: { name: 'pocProject' },
        children: [
          {
            path: 'project',
            name: 'pocProject',
            component: PocProject,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
          {
            path: 'project/:qid',
            name: 'pocDetails',
            component: PocDetails,
            meta: {
              hideHeader: true,
            },
            props: (route) => {
              return {
                qid: Number(route.params.qid),
                projectId: Number(route.query.projectId),
                treeId: Number(route.query.treeId),
                fileId: Number(route.query.fileId),
                fileName: route.query.fileName,
              };
            },
          },
          {
            path: 'rule-summary',
            name: 'pocRuleSummary',
            component: PocRuleSummary,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
          {
            path: 'rule-summary-details',
            name: 'pocRuleSummaryDetails',
            component: PocRuleSummaryDetails,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
            props: (route) => {
              return {
                reportYear: Number(route.query.reportYear),
                ruleResult: Number(route.query.ruleResult),
                rule: Number(route.query.rule),
              };
            },
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(sseRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
