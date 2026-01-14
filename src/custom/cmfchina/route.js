import _ from 'lodash';
import VueRouter from 'vue-router';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import Panorama from './pages/Panorama';
import Project from '../../containers/Project';
import Schema from '@/containers/Schema';
import CustomRules from '../../containers/CustomRules';
import FileSearch from '@/containers/FileSearch';
import FileFiled from './pages/FileFiled';
import Model from './pages/Model';
import ModelList from './pages/ModelList';
import ModelUse from './pages/ModelUse';
import StatisticalEvaluation from './pages/StatisticalEvaluation';
import PermissionManagement from './pages/PermissionManagement';
import BusinessGroupManagement from './pages/BusinessGroupManagement.vue';
import EmailConfig from './pages/EmailConfig';

import perimeter from '@/perimeters/base.perimeter';
import store from '../../store';
import { MENU_ROUTES } from './common/constant';

const cmfchinaRoutes = [
  {
    path: '/',
    redirect: () => getRedirectPath(),
  },
  {
    path: '/panorama',
    name: 'panorama',
    component: Panorama,
    meta: {
      keepAlive: true,
      perimeter,
      perimeterAction: 'para',
    },
  },
  {
    path: '/project',
    name: 'project',
    component: Project,
    meta: {
      perimeter,
      perimeterAction: 'prj',
    },
  },
  {
    path: '/custom-rules',
    name: 'custom-rules',
    component: CustomRules,
    meta: {
      perimeter,
      perimeterAction: 'rule',
    },
  },
  {
    path: '/search',
    name: 'fileSearch',
    component: FileSearch,
    props: (route) => {
      return {
        projectId: Number(route.query.projectId),
        treeId: Number(route.query.treeId),
      };
    },
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/schema',
    name: 'schema',
    component: Schema,
    meta: {
      perimeter,
      perimeterAction: 'scene',
    },
  },
  {
    path: '/filed',
    name: 'fileFiled',
    component: FileFiled,
    meta: {
      perimeter,
      perimeterAction: 'classification',
    },
  },
  {
    path: '/model',
    name: 'model',
    component: Model,
    redirect: '/model/list',
    children: [
      {
        path: 'list',
        name: 'modelList',
        component: ModelList,
        meta: {
          perimeter,
          perimeterAction: 'model',
        },
      },
      {
        path: 'use/:id',
        name: 'modelUse',
        component: ModelUse,
        props: (route) => {
          return {
            modelId: Number(route.params.id),
          };
        },
        meta: {
          perimeter,
          perimeterAction: 'model',
        },
      },
    ],
  },
  // {
  //   path: '/dataPermissions',
  //   name: 'dataPermissions',
  //   meta: {},
  // },
  {
    path: '/statisticalEvaluation',
    name: 'statisticalEvaluation',
    component: StatisticalEvaluation,
    meta: {
      perimeter,
      perimeterAction: 'stat',
    },
  },
  {
    path: '/permissionManagement',
    name: 'permission-management',
    component: PermissionManagement,
    meta: {
      perimeter,
      perimeterAction: 'super_admin',
    },
  },
  {
    path: '/businessGroupManagement',
    name: 'businessGroupManagement',
    component: BusinessGroupManagement,
    meta: {
      perimeter,
      perimeterAction: 'group',
    },
  },
  {
    path: '/emailConfig',
    name: 'emailConfig',
    component: EmailConfig,
    meta: {
      perimeter,
      perimeterAction: 'email',
    },
  },
];

const getRedirectPath = () => {
  const loginUser = store.getters['loginUser'];
  const paramPerms = loginUser.param_perms;

  if (paramPerms.includes('prj')) {
    return '/project';
  }

  let name = '';
  const matchedRoute = MENU_ROUTES.find((item) => {
    return paramPerms.includes(item.perm);
  });
  if (matchedRoute) {
    name = matchedRoute.name;
  }
  return `/${name}`;
};

const router = new VueRouter({
  routes: _.uniqBy(cmfchinaRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
