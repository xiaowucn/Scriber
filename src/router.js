import { Base64 } from 'js-base64';
import VueRouter from 'vue-router';
import store from '@/store';
import { createSandbox, HeadGoverness } from 'vue-kindergarten';

import Project from './containers/Project';
import FileHistory from './containers/FileHistory';
import Schema from './containers/Schema';
import User from './containers/User';
import SchemaTree from './containers/SchemaTree';
import FileRemark from './containers/FileRemark';
import LogIn from './components/LogIn';
import AuthExpired from './containers/AuthExpired';
import NotFound from './components/NotFound';
import FileSearch from './containers/FileSearch';
import FormExtraction from './components/FormExtraction';
import Tag from './containers/Tag';
import CustomRules from './containers/CustomRules.vue';
import SwitchCustomRules from './containers/SwitchCustomRules.vue';

import { EventBus } from './utils';
import perimeter from './perimeters/base.perimeter';
import userPerimeter from './perimeters/user.perimeter';
import platformPerimeter from './perimeters/platform.perimeter';
import { checkPermission, parseQueryFromBase64EncodedUrl } from './utils';
import { permissionsForPageList, USER_PLATFORM } from '@/store/constants';
import {
  checkUnsubmitAnswer as hkexCheckUnsubmitAnswer,
  redirectToSSO,
} from './custom/hkex/common/utils';

const isProdEnv = import.meta.env.PROD;

function setCCXINormalUserRouter(router, { to, next }) {
  if (userPerimeter.isCcxiNormalUser() && !router.meta.isPublic) {
    next({ name: '404', replace: true, path: to.path });
  }
}

function setHKEXUserRouter(user, { to, next }) {
  if (
    platformPerimeter.isHkexEnv() &&
    user.platform === USER_PLATFORM.AZURE &&
    !to.query._from
  ) {
    next({
      path: to.path,
      query: { ...to.query, _from: 'sso' },
      replace: true,
    });
  }
}

function setCiticsTgRouter(router, { to, next }) {
  if (
    !userPerimeter.isCiticsTgCustomUser() &&
    userPerimeter.isCiticsTgNormalUser() &&
    to.redirectedFrom === '/'
  ) {
    next('/project');
    return;
  }
  if (!userPerimeter.isCiticsTgCustomUser() && router.meta.isCustom) {
    next({ name: '404', replace: true, path: to.path });
    return;
  }
  if (
    !userPerimeter.isCiticsTgNormalUser() &&
    !router.meta.isCustom &&
    router.name !== '404'
  ) {
    next({ name: '404', replace: true, path: to.path });
    return;
  }
  next();
}

class RouteGoverness extends HeadGoverness {
  guard(action, user, { to, next }) {
    if (checkPermission(action, this.isAllowed.bind(this))) {
      EventBus.$emit('route-to', { path: to.path });
      next();
    } else {
      if (platformPerimeter.isCscEnv()) {
        const { path } = permissionsForPageList.find(
          (list) => list.permission === user.perm[0],
        );
        next(path);
        return;
      }

      if (platformPerimeter.isCmfchinaEnv()) {
        const paramPerms = user.param_perms || [];
        const perms = [...paramPerms, 'browse', 'remark', 'inspect'];
        if (!perms.includes(to.meta.perimeterAction) && to.path !== '/404') {
          next({ name: '404', replace: true, path: to.path });
          return;
        }
        next();
        return;
      }

      next({ name: '404', replace: true, path: to.path });
    }
  }
}

export const defaultRoutes = [
  {
    path: '/',
    redirect: '/project',
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: {
      perimeter,
      perimeterAction: 'manageUser',
    },
  },
  {
    path: '/project',
    name: 'project',
    component: Project,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/search',
    name: 'fileSearch',
    component: FileSearch,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/tree/:treeId',
    name: 'projectDetail',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
      treeId: Number(route.params.treeId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/answeredFiles',
    name: 'projectAnsweredFiles',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/file/:fileId/history',
    name: 'fileHistory',
    component: FileHistory,
    props: (route) => ({
      fileId: Number(route.params.fileId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/allFiles',
    name: 'projectAllFiles',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/taggedFiles',
    name: 'projectTaggedFiles',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/conflictFiles',
    name: 'projectConflictFiles',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/schema',
    name: 'projectSchema',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/:projectId/tree/:treeId/recycleFiles',
    name: 'projectRecycleFiles',
    component: Project,
    props: (route) => ({
      projectId: Number(route.params.projectId),
      treeId: Number(route.params.treeId),
    }),
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/project/remark/:qid',
    name: 'remark',
    component: FileRemark,
    props: (route) => {
      return {
        fileId: Number(route.query.fileId),
        schemaId: Number(route.query.schemaId),
        qid: Number(route.params.qid),
        projectId: Number(route.query.projectId),
        treeId: Number(route.query.treeId),
        isConflictType: route.query.isConflictType,
        showSchemaTree: true,
      };
    },
    meta: {
      perimeter,
      perimeterAction: 'remark',
      isPublic: true,
      hideHeader: true,
    },
  },
  {
    path: '/project/inspect/:qid',
    name: 'inspect',
    component: FileRemark,
    props: (route) => {
      return {
        fileId: Number(route.query.fileId),
        schemaId: Number(route.query.schemaId),
        qid: Number(route.params.qid),
        projectId: Number(route.query.projectId),
        treeId: Number(route.query.treeId),
        isConflictType: route.query.isConflictType,
        showSchemaTree: true,
      };
    },
    meta: {
      perimeter,
      perimeterAction: 'inspect',
      isPublic: true,
      hideHeader: true,
    },
  },
  {
    path: '/detail/:base64EncodedString',
    name: 'inspectBase64Encoded',
    component: FileRemark,
    props: (route) => {
      const base64EncodedString = route.params.base64EncodedString;
      return {
        qid: Number(
          Base64.decode(base64EncodedString).match(/\/inspect\/(\d+)/)?.[1],
        ),
        ...parseQueryFromBase64EncodedUrl(base64EncodedString),
      };
    },
    meta: {
      perimeter,
      perimeterAction: 'inspect',
      isPublic: true,
      hideHeader: true,
    },
  },
  {
    path: '/schema',
    name: 'schema',
    component: Schema,
    meta: {
      perimeter,
      perimeterAction: 'browseSchema',
    },
  },
  {
    path: '/schema/:schemaId',
    redirect: '/schema/:schemaId/tree',
    meta: {
      perimeter,
      perimeterAction: 'browseSchema',
    },
  },
  {
    path: '/schema/:schemaId/:panelType',
    name: 'schemaTree',
    component: SchemaTree,
    props: (route) => ({
      schemaId: Number(route.params.schemaId),
      panelType: route.params.panelType,
      moldType: route.query.moldType,
    }),
    meta: {
      perimeter,
      perimeterAction: 'browseSchema',
    },
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
    path: '/extraction',
    name: 'extraction',
    component: FormExtraction,
    meta: {
      perimeter,
      perimeterAction: 'tableIdentification',
    },
  },
  {
    path: '/tag',
    name: 'tag',
    component: Tag,
    meta: {
      perimeter,
      perimeterAction: 'browse',
    },
  },
  {
    path: '/auth-expired',
    name: 'authExpired',
    component: AuthExpired,
    meta: {
      hideHeader: true,
    },
  },
  {
    path: '/custom-rules',
    name: 'custom-rules',
    component: CustomRules,
    meta: {
      perimeter,
      perimeterAction: 'customerRuleParticipate',
    },
  },
  {
    path: '/switch-custom-rules',
    name: 'switch-custom-rules',
    component: SwitchCustomRules,
    meta: {
      perimeter,
      perimeterAction: 'showFileScenario',
    },
  },
  {
    path: '/404',
    name: '404',
    alias: '*',
    component: NotFound,
    meta: {
      hideHeader: true,
    },
  },
];

export const defaultRouterBeforeHook = async (to, from, next) => {
  const config = store.getters.configuration;
  const systemAuthExpired = store.getters['systemAuthExpired'];
  const user = store.getters['loginUser'];
  // 系统授权到期
  if (systemAuthExpired) {
    if (to.path !== '/auth-expired') {
      next(`/auth-expired`);
    } else {
      next();
    }
    return;
  }

  if (platformPerimeter.isHkexEnv()) {
    if (hkexCheckUnsubmitAnswer()) {
      return;
    }
  }

  if (!user.perm && to.path !== '/login') {
    const queryItems = Object.keys(to.query);
    const queryStr = queryItems.reduce((a, b) => {
      return a + b + '=' + to.query[b] + '&';
    }, '?');

    // 白名单路由做一次静默登录
    if (to.meta.noAuth) {
      if (platformPerimeter.isCscOctopusEnv()) {
        await store.dispatch('login', {
          name: import.meta.env.VITE_DEFAULT_USER_NAME,
          password: import.meta.env.VITE_DEFAULT_USER_PASSWORD,
        });
      }
      next();
      return;
    }

    if (config.trident_url && isProdEnv && location.hostname !== 'localhost') {
      if (config.client_name === 'guosen') {
        const origin = encodeURIComponent(`/${location.hash}`);
        window.location.href = `${location.origin}/api/v1/guosen/sso-login?origin=${origin}&app=scriber`;
        return;
      }
      window.location.href = config.trident_url;
    } else {
      const redirect = encodeURIComponent(to.path + queryStr);
      if (platformPerimeter.isHkexEnv()) {
        if (redirectToSSO()) {
          return;
        }
        next();
      }

      next(`/login?redirect=${redirect}`);
    }
  } else {
    for (let i = 0; i < to.matched.length; i++) {
      const router = to.matched[i];
      const perimeter = router.meta.perimeter;
      const action = router.meta.perimeterAction;

      if (platformPerimeter.isCiticsTGEnv()) {
        if (perimeter) {
          const sandbox = createSandbox(user, {
            governess: new RouteGoverness(),
            perimeters: [perimeter],
          });
          sandbox.guard(action, user, { to, from, next });
        } else {
          EventBus.$emit('route-to', { path: to.path });
          next();
        }
        setCiticsTgRouter(router, { to, next });
      } else if (perimeter) {
        // showFileScenario比较特殊，在config中存值
        const sandbox = createSandbox(
          { ...user, config: config },
          {
            governess: new RouteGoverness(),
            perimeters: [perimeter],
          },
        );
        sandbox.guard(action, user, { to, from, next });
        setCCXINormalUserRouter(router, { to, next });
      } else {
        EventBus.$emit('route-to', { path: to.path });
        next();
      }

      setHKEXUserRouter(user, { to, next });
    }
  }
};

const router = new VueRouter({
  routes: defaultRoutes,
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
