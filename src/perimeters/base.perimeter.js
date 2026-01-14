import { createPerimeter } from 'vue-kindergarten';
import platformPerimeter from './platform.perimeter';

export default createPerimeter({
  purpose: 'base',

  can: {
    browse() {
      if (this.child.perm) {
        return this.child.perm.includes('browse');
      }
      return false;
    },
    browseSchema() {
      if (this.child.perm) {
        if (platformPerimeter.isCscEnv()) {
          return this.child.perm.includes('manage_mold');
        }
        if (platformPerimeter.isNafmiiEnv()) {
          return this.child.perm.includes('manage_all');
        }
        return this.child.perm.includes('browse');
      }
      return false;
    },
    remark() {
      if (this.child.perm) {
        return this.child.perm.includes('remark');
      }
      return false;
    },
    inspect() {
      if (this.child.perm) {
        return this.child.perm.includes('inspect');
      }
      return false;
    },
    remarkOrInspect() {
      if (this.child.perm) {
        return (
          this.child.perm.includes('remark') ||
          this.child.perm.includes('inspect')
        );
      }
      return false;
    },
    manageProject() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_prj');
      }
      return false;
    },
    manageSchema() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_mold');
      }
      return false;
    },
    manageUser() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_user');
      }
      return false;
    },
    manageModel() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_model');
      }
      return false;
    },
    tableIdentification() {
      if (this.child.perm) {
        return this.child.perm.includes('table_identification');
      }
      return false;
    },
    manageContract() {
      if (this.child.perm) {
        return this.child.perm.includes('ccxi_manage_contract');
      }
      return false;
    },
    stockManagement() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_stock');
      }
      return false;
    },

    // 规则管理 | 自定义规则经办
    customerRuleParticipate() {
      if (this.child.perm) {
        return this.child.perm.includes('customer_rule_participate');
      }
      return false;
    },

    // 自定义规则复核
    customerRuleReview() {
      if (this.child.perm) {
        return this.child.perm.includes('customer_rule_review');
      }
      return false;
    },

    // 研发规则
    developedRuleBrowse() {
      if (this.child.perm) {
        return this.child.perm.includes('developed_rule_browse');
      }
      return false;
    },

    isHkexBusinessAdmin() {
      return this.child.role === 1;
    },

    manageAll() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_all');
      }
      return false;
    },

    manageTask() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_task');
      }
      return false;
    },
    manageLaw() {
      if (this.child.perm) {
        return this.child.perm.includes('manage_law');
      }
      return false;
    },
    // 是否展示文件场景
    showFileScenario() {
      if (this.child.config) {
        return this.child.config.show_file_scenario;
      }
      return false;
    },
  },
});
