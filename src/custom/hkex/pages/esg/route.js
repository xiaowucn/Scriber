import { hkexReportType } from '@/store/constants.js';
import { genCommonRoutes } from '../../common/common-route';

import HKEXEntry from '../../index.vue';

import ByRule from './ByRule.vue';
import ByIssuer from './ByIssuer.vue';
import LLMDemo from './LLMDemo.vue';

export default {
  path: hkexReportType.esg.modulePath,
  name: hkexReportType.esg.moduleName,
  component: HKEXEntry,
  redirect: '/',
  children: [
    ...genCommonRoutes({
      moduleName: hkexReportType.esg.moduleName,
      homepageName: hkexReportType.esg.homeRouterName,
      reportReviewName: hkexReportType.esg.reportReviewRouterName,
      byRuleComponent: ByRule,
      byIssuerComponent: ByIssuer,
    }),
    {
      path: 'llm-demo',
      name: 'llmDemo',
      component: LLMDemo,
      meta: {
        hideHeader: true,
      },
    },
  ],
};
