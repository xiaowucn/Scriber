import VueRouter from 'vue-router';
import _ from 'lodash';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import SZSE from './index';
import LabelFileList from './pages/LabelFileList';
import ModelList from './pages/ModelList';
import IPO from './pages/IPO';
import IPOProject from './pages/IPOProject';
import IPOFileDetails from './pages/IPOFileDetails';
import IPOUser from './pages/IPOUser';

import Compliance from './pages/Compliance';
import ComplianceProject from './pages/ComplianceProject';
import ComplianceDetails from './pages/ComplianceDetails';
import ComplianceRuleSummary from './pages/ComplianceRuleSummary';

import perimeter from '@/perimeters/base.perimeter';

const szseRoutes = [
  {
    path: '/',
    redirect: '/szse/compliance',
  },
  {
    path: '/szse',
    component: SZSE,
    children: [
      {
        path: 'label-file-list',
        name: 'labelFileList',
        component: LabelFileList,
        meta: {
          hideHeader: true,
        },
      },
      {
        path: 'model-list',
        name: 'modelList',
        component: ModelList,
        meta: {
          hideHeader: true,
        },
      },
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
      {
        path: 'compliance',
        name: 'compliance',
        component: Compliance,
        redirect: { name: 'complianceProject' },
        children: [
          {
            path: 'project',
            name: 'complianceProject',
            component: ComplianceProject,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
          {
            path: 'project/:id',
            name: 'complianceDetails',
            component: ComplianceDetails,
            meta: {
              hideHeader: true,
            },
            props: (route) => {
              return {
                fileId: Number(route.params.id),
                qid: Number(route.query.qid),
              };
            },
          },
          {
            path: 'rule-summary',
            name: 'complianceRuleSummary',
            component: ComplianceRuleSummary,
            meta: {
              hideHeader: true,
              showPrivateHeader: true,
            },
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(szseRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;
