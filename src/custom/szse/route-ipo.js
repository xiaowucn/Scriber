import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import SZSE from './index';
import IPO from './pages/IPO';
import IPOProject from './pages/IPOProject';
import IPOFileDetails from './pages/IPOFileDetails';
import IPOUser from './pages/IPOUser';
import LogIn from '@/components/LogIn';
import NotFound from '@/components/NotFound';

import perimeter from '@/perimeters/base.perimeter';
import store from '@/store';

const szseIpoRoutes = [
  {
    path: '/',
    redirect: '/szse/ipo',
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn,
    props: (router) => ({
      redirect: router.query.redirect,
    }),
    meta: {
      hideHeader: true,
    },
  },
  {
    path: '/szse',
    component: SZSE,
    children: [
      {
        path: 'ipo',
        name: 'ipo',
        component: IPO,
        redirect: { name: 'ipoProject' },
        children: [
          {
            path: 'project',
            name: 'ipoProject',
            component: IPOProject,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
          {
            path: 'project/:id',
            name: 'fileDetails',
            component: IPOFileDetails,
            meta: {
              hideHeader: true,
            },
            props: (route) => {
              return {
                projectName: route.query.projectName,
                fileId: Number(route.query.fileId),
                questionId: Number(route.query.questionId),
                pdfParseStatus: Number(route.query.pdfParseStatus),
                fillInStatus: Number(route.query.fillInStatus),
              };
            },
          },
          {
            path: 'user',
            name: 'ipoUser',
            component: IPOUser,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
              perimeter,
              perimeterAction: 'manageUser',
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    name: '404',
    component: NotFound,
    meta: {
      hideHeader: true,
    },
  },
];

const config = store.getters['configuration'];

const router = new VueRouter({
  routes: config.only_szse_ipo
    ? szseIpoRoutes
    : _.uniqBy(szseIpoRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
