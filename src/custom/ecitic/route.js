import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import ECITIC from './index';
import POC from './pages/POC';
import POCProject from './pages/POCProject';
import POCProjectDetails from './pages/POCProjectDetails';
import User from '../szse/pages/IPOUser';

import perimeter from '@/perimeters/base.perimeter';
import store from '@/store';

const config = store?.getters['configuration'] || {};

const eciticRoutes = [
  {
    path: '/',
    redirect: () => {
      const config = store.getters['configuration'] || {};
      const defaultPageMap = {
        ecitic_poc: '/ecitic/poc',
        ecitic_th: '/ecitic/shares',
      };
      return defaultPageMap[config.default_page] || '/project';
    },
  },
  {
    path: '/ecitic',
    component: ECITIC,
    children: [
      // 循环购买报告信息抽取
      {
        path: 'poc',
        name: 'poc',
        component: POC,
        redirect: { name: 'pocProject' },
        children: [
          {
            path: 'project',
            name: 'pocProject',
            component: POCProject,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
          {
            path: 'project/:id',
            name: 'pocProjectDetails',
            component: POCProjectDetails,
            meta: {
              hideHeader: true,
            },
            props: (route) => {
              return {
                projectName: route.query.projectName,
                fileId: Number(route.query.fileId),
              };
            },
          },
          {
            path: 'user',
            name: 'user',
            component: User,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
              perimeter,
              perimeterAction: 'manageUser',
            },
          },
        ],
      },

      // 股东股份变更明细提取
      {
        path: 'shares',
        name: 'shares',
        component: POC,
        redirect: { name: 'sharesProject' },
        children: [
          {
            path: 'project',
            name: 'sharesProject',
            component: POCProject,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
          {
            path: 'project/:id',
            name: 'sharesProjectDetails',
            component: POCProjectDetails,
            meta: {
              hideHeader: true,
            },
            props: (route) => {
              return {
                projectName: route.query.projectName,
                fileId: Number(route.query.fileId),
              };
            },
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes: config.only_ecitic_poc
    ? eciticRoutes
    : _.uniqBy(eciticRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
