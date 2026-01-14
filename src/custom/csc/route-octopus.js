import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import FileRemark from '@/containers/FileRemark';

const cscOctopusRoutes = [
  {
    path: '/csc-octopus/project/remark/:qid',
    name: 'octopus-remark',
    component: FileRemark,
    props: (route) => {
      return {
        fileId: Number(route.query.fileId),
        schemaId: Number(route.query.schemaId),
        qid: Number(route.params.qid),
        projectId: Number(route.query.projectId),
        treeId: Number(route.query.treeId),
        from: 'octopus',
      };
    },
    meta: {
      hideHeader: true,
      noAuth: true,
    },
  },
];

const router = new VueRouter({
  routes: _.uniqBy(cscOctopusRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
