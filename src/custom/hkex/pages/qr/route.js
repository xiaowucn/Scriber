import { hkexReportType } from '@/store/constants.js';
import { genCommonRoutes } from '../../common/common-route';

import HKEXEntry from '../../index.vue';

import ReportReview from './ReportReviewLayout.vue';
import AdditionalDocument from './AdditionalDocument.vue';
import ByRule from './ByRule.vue';
import ByIssuer from './ByIssuer.vue';

export default {
  path: hkexReportType.qr.modulePath,
  name: hkexReportType.qr.moduleName,
  component: HKEXEntry,
  redirect: '/',
  children: [
    ...genCommonRoutes({
      moduleName: hkexReportType.qr.moduleName,
      homepageName: hkexReportType.qr.homeRouterName,
      reportReviewName: hkexReportType.qr.reportReviewRouterName,
      reportReviewComponent: ReportReview,
      byRuleComponent: ByRule,
      byIssuerComponent: ByIssuer,
    }),
    {
      path: 'report-review/:qid/additional-document',
      name: 'resultsAnnouncementAdditionalDocument',
      component: AdditionalDocument,
      meta: {
        hideHeader: true,
        hideLogout: true,
        hideLeftMenu: true,
      },
    },
  ],
};
