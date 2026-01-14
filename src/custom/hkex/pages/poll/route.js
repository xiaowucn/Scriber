import { hkexReportType } from '@/store/constants.js';
import { genCommonRoutes } from '../../common/common-route';

import HKEXEntry from '../../index.vue';

import ByRule from '../agm/ByRule.vue';
import ByIssuer from '../agm/ByIssuer.vue';

export default {
  path: hkexReportType.poll.modulePath,
  name: hkexReportType.poll.moduleName,
  component: HKEXEntry,
  redirect: '/',
  children: [
    ...genCommonRoutes({
      moduleName: hkexReportType.poll.moduleName,
      homepageName: hkexReportType.poll.homeRouterName,
      reportReviewName: hkexReportType.poll.reportReviewRouterName,
      byRuleComponent: ByRule,
      byIssuerComponent: ByIssuer,
    }),
  ],
};
