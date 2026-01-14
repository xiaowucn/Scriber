import { hkexReportType } from '@/store/constants.js';
import { genCommonRoutes } from '../../common/common-route';

import HKEXEntry from '../../index.vue';

import ByRule from './ByRule.vue';
import ByIssuer from './ByIssuer.vue';
import AdditionalDocuments from './AdditionalDocuments.vue';
import FundraisingActivity from './FundraisingActivity.vue';
import NextDayDisclosureReturn from './NextDayDisclosureReturn.vue';
import NextDayDisclosureReturnDetails from './NextDayDisclosureReturnDetails.vue';

export default {
  path: hkexReportType.ar.modulePath,
  name: hkexReportType.ar.moduleMenuName,
  component: HKEXEntry,
  redirect: '/',
  children: [
    ...genCommonRoutes({
      moduleName: hkexReportType.ar.moduleName,
      homepageName: hkexReportType.ar.homeRouterName,
      reportReviewName: hkexReportType.ar.reportReviewRouterName,
      byRuleComponent: ByRule,
      byIssuerComponent: ByIssuer,
    }),
    {
      path: 'additional-documents',
      name: 'additionalDocuments',
      component: AdditionalDocuments,
      props: (route) => {
        return {
          fileId: Number(route.query.fileId),
          schemaId: Number(route.query.schemaId),
          qid: Number(route.query.qid),
          projectId: Number(route.query.projectId),
          stockCode: route.query.stockCode,
          reportYear: route.query.reportYear,
          rule: route.query.rule,
          yearEnd: route.query.yearEnd,
        };
      },
      meta: {
        hideHeader: true,
      },
    },
    {
      path: 'fundraising-activity',
      name: 'fundraisingActivity',
      component: FundraisingActivity,
      props: (route) => {
        return {
          fileId: Number(route.query.fileId),
          schemaId: Number(route.query.schemaId),
          qid: Number(route.query.qid),
        };
      },
      meta: {
        hideHeader: true,
        hideLeftMenu: true,
      },
    },
    {
      path: 'next-day-disclosure-return',
      name: 'nextDayDisclosureReturn',
      component: NextDayDisclosureReturn,
      props: (route) => {
        return {
          stockCode: route.query.stockCode,
          reportYear: route.query.reportYear,
        };
      },
      meta: {
        hideHeader: true,
        hideLeftMenu: true,
      },
    },
    {
      path: 'next-day-disclosure-return-details',
      name: 'nextDayDisclosureReturnDetails',
      component: NextDayDisclosureReturnDetails,
      props: (route) => {
        return {
          fid: Number(route.query.fid),
          qid: Number(route.query.qid),
          mid: Number(route.query.mid),
        };
      },
      meta: {
        hideHeader: true,
        hideLeftMenu: true,
      },
    },
  ],
};
