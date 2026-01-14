import { hkexReportType } from '@/store/constants.js';
import { genCommonRoutes } from '../../common/common-route';

import HKEXEntry from '../../index.vue';

import ByRule from './ByRule.vue';
import ByIssuer from './ByIssuer.vue';
import DirectorList from './DirectorList.vue';

export default {
  path: hkexReportType.agm.modulePath,
  name: hkexReportType.agm.moduleName,
  component: HKEXEntry,
  redirect: '/',
  children: [
    ...genCommonRoutes({
      moduleName: hkexReportType.agm.moduleName,
      homepageName: hkexReportType.agm.homeRouterName,
      reportReviewName: hkexReportType.agm.reportReviewRouterName,
      byRuleComponent: ByRule,
      byIssuerComponent: ByIssuer,
    }),
    {
      path: 'director-list',
      name: 'directorList',
      component: DirectorList,
      meta: {
        hideHeader: true,
        hideLeftMenu: true,
      },
    },
  ],
};
