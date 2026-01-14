import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import ProjectViewer from './pages/ProjectViewer.vue';
import FileViewer from './pages/FileViewer.vue';
import FileDetailViewer from './pages/FileDetailViewer.vue';
import perimeter from '@/perimeters/base.perimeter';

const citicsDCMRoutes = [
  {
    path: '/project',
    name: 'project',
    component: ProjectViewer,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId',
    name: 'projectDetail',
    component: FileViewer,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/fileRemark/:fileId',
    name: 'fileRemark',
    component: FileDetailViewer,
    props: (route) => {
      return {
        fileId: Number(route.params.fileId),
        qid: Number(route.query.qid),
      };
    },
    meta: {
      perimeter,
      perimeterAction: 'remark',
      hideHeader: true,
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(citicsDCMRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
