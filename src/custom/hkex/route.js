import _ from 'lodash';
import VueRouter from 'vue-router';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import perimeter from '@/perimeters/base.perimeter';
import store from '@/store';

import { USER_PLATFORM } from '../../store/constants';

import HKEXEntry from './index';
import HKEX from './pages/index';

import QR_ROUTES from './pages/qr/route';
import AR_ROUTES from './pages/ar/route';
import ESG_ROUTES from './pages/esg/route';
import CG_ROUTES from './pages/cg/route';
import AGM_ROUTES from './pages/agm/route';
import POLL_ROUTES from './pages/poll/route';

import USER_ROUTE from './pages/user/route';

import CompanyInfoUpdater from './pages/CompanyInfoUpdater';
import NoAccess from './pages/NoAccess';

const HKEX_NO_ACCESS_PATH = '/hkex/no-access';

const hkexRoutes = [
  {
    path: '/',
    redirect: '/hkex',
  },
  {
    path: '/hkex',
    component: HKEXEntry,
    children: [
      {
        path: '/',
        component: HKEX,
        redirect: () => getRedirectPath(),
        meta: {
          hideHeader: true,
        },
        children: [
          QR_ROUTES,
          AR_ROUTES,
          ESG_ROUTES,
          CG_ROUTES,
          AGM_ROUTES,
          POLL_ROUTES,
          USER_ROUTE,
          {
            path: 'company-info-updater',
            name: 'companyInfoUpdater',
            component: CompanyInfoUpdater,
            meta: {
              perimeter,
              perimeterAction: 'stockManagement',
              hideHeader: true,
            },
          },
          {
            path: 'no-access',
            name: 'noAccess',
            component: NoAccess,
            meta: {
              hideHeader: true,
              hideLeftMenu: true,
            },
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(hkexRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(routerBeforeEachHook);

router.beforeEach(defaultRouterBeforeHook);

function routerBeforeEachHook(to, from, next) {
  const user = store.getters['loginUser'];
  if (user.platform !== USER_PLATFORM.AZURE) {
    next();
    return;
  }
  const { modules, allowedModules } = getModules();
  const modulePath = to.path.split('/')[2];
  const currentModule = modules[modulePath];
  const noAccess =
    to.path.startsWith('/hkex') &&
    !to.path.startsWith('/hkex/user') &&
    allowedModules.indexOf(currentModule) === -1 &&
    to.path !== HKEX_NO_ACCESS_PATH;
  if (noAccess) {
    next(HKEX_NO_ACCESS_PATH);
    return;
  }
  if (allowedModules.length > 0 && to.path === HKEX_NO_ACCESS_PATH) {
    next(from.fullPath);
    return;
  }
  next();
}

function getRedirectPath() {
  const { modules, allowedModules } = getModules();
  const redirectPath = Object.keys(modules).find(
    (key) => allowedModules.indexOf(modules[key]) !== -1,
  );
  return redirectPath || HKEX_NO_ACCESS_PATH;
}

function getModules() {
  const allModules = store.getters['configuration'].page_modules || {};
  const allowedModules = store.getters['loginUser'].page_module || [];
  const modules = convertObjectKey(allModules);
  return { modules, allowedModules };
}

function convertObjectKey(object) {
  const newObject = {};
  for (const key in object) {
    const newKey = key.toLowerCase().replace(/\s+/g, '-');
    newObject[newKey] = object[key];
  }
  return newObject;
}

export default router;
