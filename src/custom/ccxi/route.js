import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import ProjectDetail from '@/components/ProjectDetail';
import perimeter from '@/perimeters/base.perimeter';

const ccxiRoutes = [
  {
    path: '/ccxi/project/:projectName/tree/:dirVersion',
    name: 'ccxiProjectDetail',
    component: ProjectDetail,
    props: (route) => ({
      projectId: route.params.projectName,
      dirId: route.params.dirVersion,
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
      isPublic: true,
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(ccxiRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
