import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import Contract from './pages/Contract';
import ContractDetail from './pages/ContractDetail';
import perimeter from '@/perimeters/base.perimeter';

const ccixContractRoutes = [
  {
    path: '/contract',
    name: 'contract',
    component: Contract,
    meta: {
      perimeter,
      perimeterAction: 'browse',
      isPublic: true,
    },
  },
  {
    path: '/contract-detail',
    name: 'contractDetail',
    component: ContractDetail,
    meta: {
      perimeter,
      perimeterAction: 'browse',
      isPublic: true,
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(ccixContractRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
