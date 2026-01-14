import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import perimeter from '@/perimeters/base.perimeter';
import ContractTypeSettings from './pages/ContractTypeSettings';
import DataStatistics from './pages/DataStatistics';
import ExportErrors from './pages/ExportErrors';
import RuleTemplate from './pages/RuleTemplate';

const htRoutes = [
  {
    path: '/ht/contract-type-settings',
    name: 'contractTypeSettings',
    component: ContractTypeSettings,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/ht/data-statistics',
    name: 'dataStatistics',
    component: DataStatistics,
    meta: {
      perimeter,
      perimeterAction: 'manageUser',
    },
  },
  {
    path: '/ht/export-errors',
    name: 'exportErrors',
    component: ExportErrors,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/ht/rule-template',
    name: 'ruleTemplate',
    component: RuleTemplate,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(htRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
