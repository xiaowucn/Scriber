import { hkexReportType } from '@/store/constants.js';
import { genCommonRoutes } from '../../common/common-route';

import HKEXEntry from '../../index.vue';

import ByRule from './ByRule.vue';
import ByIssuer from './ByIssuer.vue';

export default {
  path: hkexReportType.cg.modulePath,
  name: hkexReportType.cg.moduleName,
  component: HKEXEntry,
  redirect: '/',
  children: [
    ...genCommonRoutes({
      moduleName: hkexReportType.cg.moduleName,
      homepageName: hkexReportType.cg.homeRouterName,
      reportReviewName: hkexReportType.cg.reportReviewRouterName,
      byRuleComponent: ByRule,
      byIssuerComponent: ByIssuer,
    }),
  ],
};
