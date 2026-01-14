import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import CiticsTg from './index.vue';
import SysFullView from './pages/SystemFullView.vue';
import ProjectList from './pages/ProjectList.vue';
import TemplateManage from './pages/TemplateManage.vue';
import DataPushConfig from './pages/DataPushConfig.vue';
import ParamMapConfig from './pages/ParamMapConfig.vue';
import ProductResults from './pages/ProductResults.vue';
import AccuracyStatistics from './pages/AccuracyStatistics.vue';
import PushRecord from './pages/PushRecord.vue';
import FileDetail from './pages/FileDetail.vue';

const citicsTGRoutes = [
  {
    path: '/',
    redirect: '/citics-tg/sysFullView',
  },
  {
    path: '/citics-tg',
    name: 'citicsTG',
    component: CiticsTg,
    meta: {
      isCustom: true,
    },
    children: [
      {
        path: 'sysFullView',
        name: 'sysFullView',
        component: SysFullView,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'projectList',
        name: 'projectList',
        component: ProjectList,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'projectList/:projectId/tree/:treeId',
        name: 'fileList',
        component: ProjectList,
        props: (route) => {
          return {
            projectId: Number(route.params.projectId),
            treeId: Number(route.params.treeId),
          };
        },
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'templateManage',
        name: 'templateManage',
        component: TemplateManage,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'dataPushConfig',
        name: 'dataPushConfig',
        component: DataPushConfig,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'paramMapConfig',
        name: 'paramMapConfig',
        component: ParamMapConfig,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'fileRemark/:fileId',
        name: 'fileRemark',
        component: FileDetail,
        props: (route) => {
          return {
            fileId: Number(route.params.fileId),
          };
        },
        meta: {
          hideHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'fileCompare/:fileId',
        name: 'fileCompare',
        component: FileDetail,
        props: (route) => {
          return {
            fileId: Number(route.params.fileId),
          };
        },
        meta: {
          hideHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'productResults',
        name: 'productResults',
        component: ProductResults,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'accuracyStatistics',
        name: 'accuracyStatistics',
        component: AccuracyStatistics,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
      {
        path: 'pushRecord',
        name: 'pushRecord',
        component: PushRecord,
        meta: {
          customHeader: true,
          isCustom: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(citicsTGRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
