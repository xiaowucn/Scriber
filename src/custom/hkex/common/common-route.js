import perimeter from '@/perimeters/base.perimeter';

import HKEXEntry from '../index.vue';
import HKEXHome from '../pages/HomePage.vue';
import ReportReview from '../pages/ReportReview.vue';
import ResultAnalysis from '../pages/ResultAnalysis.vue';

export const genCommonRoutes = ({
  moduleName,
  homepageName,
  reportReviewName,
  reportReviewComponent = ReportReview,
  byRuleComponent,
  byIssuerComponent,
}) => {
  return [
    {
      path: '/',
      redirect: 'home',
    },
    {
      path: 'home',
      name: homepageName,
      component: HKEXEntry,
      redirect: 'home/current-securities',
      children: [
        {
          path: 'current-securities',
          name: `${homepageName}CurrentSecurities`,
          component: HKEXHome,
          meta: {
            hideHeader: true,
            autoExpand: true,
          },
        },
      ],
      meta: {
        hideHeader: true,
      },
    },
    {
      path: 'report-review/:qid',
      name: reportReviewName,
      component: reportReviewComponent,
      props: (route) => {
        return {
          fileId: Number(route.query.fileId),
          schemaId: Number(route.query.schemaId),
          qid: Number(route.params.qid),
          rule: route.query.rule,
        };
      },
      meta: {
        perimeter,
        perimeterAction: 'remark||inspect',
        hideHeader: true,
        hideLogout: true,
      },
    },
    {
      path: 'result-analysis',
      component: ResultAnalysis,
      children: [
        {
          path: 'by-rule',
          name: `${moduleName}AnalysisByRule`,
          component: byRuleComponent,
          meta: {
            hideHeader: true,
            autoExpand: true,
          },
        },
        {
          path: 'by-issuer',
          name: `${moduleName}AnalysisByIssuer`,
          component: byIssuerComponent,
          meta: {
            hideHeader: true,
            autoExpand: true,
          },
        },
      ],
    },
  ];
};
