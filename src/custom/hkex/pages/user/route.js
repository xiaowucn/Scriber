import perimeter from '@/perimeters/base.perimeter';

import User from './User.vue';
import UserManagement from './UserManagement.vue';
import AuditTrail from './AuditTrail.vue';
import RuleManagement from './RuleManagement.vue';

export default {
  path: 'user',
  name: 'user',
  component: User,
  children: [
    {
      path: '/',
      redirect: 'management',
    },
    {
      path: 'management',
      name: 'userManagement',
      component: UserManagement,
      meta: {
        hideHeader: true,
        perimeter,
        perimeterAction: 'isHkexBusinessAdmin',
      },
    },
    {
      path: 'audit-trail',
      name: 'auditTrail',
      component: AuditTrail,
      meta: {
        hideHeader: true,
        perimeter,
        perimeterAction: 'isHkexBusinessAdmin',
      },
    },
    {
      path: 'rule-management',
      name: 'ruleManagement',
      component: RuleManagement,
      meta: {
        hideHeader: true,
        perimeter,
        perimeterAction: 'isHkexBusinessAdmin',
      },
    },
  ],
};
