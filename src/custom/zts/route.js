import _ from 'lodash';
import VueRouter from 'vue-router';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import Disclosure from './pages/Disclosure.vue';
import DisclosureDetail from './pages/DisclosureDetail.vue';
import perimeter from '@/perimeters/base.perimeter';

const ztsRoutes = [
  {
    path: '/',
    redirect: '/disclosure',
  },
  {
    path: '/disclosure',
    name: 'disclosure',
    component: Disclosure,
    meta: {
      perimeter,
      perimeterAction: 'browse',
      hideMenuInHeader: true,
    },
  },
  {
    path: '/disclosure/detail/:projectId',
    name: 'disclosureDetail',
    component: DisclosureDetail,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
      hideHeader: true,
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(ztsRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
