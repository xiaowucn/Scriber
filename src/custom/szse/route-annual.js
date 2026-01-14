import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import SZSE from './index';
import LogIn from './pages/AnnualReport/Login';
import Home from './pages/AnnualReport/Home';
import Audit from './pages/AnnualReport/Audit';

const szseAnnualRoutes = [
  {
    path: '/',
    redirect: '/szse/annual',
  },
  {
    path: '/login',
    name: 'szse-annual-login',
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
        path: 'annual',
        name: 'szse-annual-home',
        component: Home,
      },
      {
        path: 'audit/:projectID',
        name: 'szse-annual-audit',
        component: Audit,
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(szseAnnualRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
