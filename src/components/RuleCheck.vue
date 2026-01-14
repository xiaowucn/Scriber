<template>
  <div class="container">
    <div class="rule-container">
      <div class="select-rule">
        <span>规则选择：</span>
        <el-select
          v-model="rule"
          size="mini"
          placeholder="请选择规则"
          @change="selectChange">
          <el-option label="全部规则" value="all">全部规则</el-option>
          <el-option
            v-for="(item, index) in fileRules"
            :key="index"
            :label="item"
            :value="item"></el-option>
        </el-select>
      </div>
      <ul class="rule-result-list">
        <li v-for="(item, index) in ruleList" :key="index">
          <h4>{{ item.name }}</h4>
          <div class="manual-confirm">
            <span>人工确认:</span>
            <el-select
              :value="item.rules[0].audit_status || ''"
              size="mini"
              placeholder="请选择"
              @change="updateRuleResults($event, item.rules[0])">
              <el-option
                v-for="item in auditStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div
            v-for="(item, index) in item.rules"
            :key="index"
            :class="[
              'rule-item',
              item.selected ? 'selected' : '',
              getComplianceStatus(item.result) ===
              complianceStatus.noncompliance
                ? 'is-wrong'
                : '',
            ]"
            @click="ruleItemClick(item)">
            <template v-if="item.detail.sub_cols.length === 0">
              <h5 class="rule-name" :title="item.second_rule">
                {{ index === 0 ? 'AI判断：' : '' }} {{ item.second_rule }}
              </h5>
              <p class="comment">
                <span>{{ item.comment }}</span>
                <i
                  v-if="
                    getComplianceStatus(item.result) ===
                      complianceStatus.compliance && item.comment !== '是'
                  "
                  class="fa fa-check-circle"></i>
                <i
                  v-if="
                    getComplianceStatus(item.result) ===
                    complianceStatus.noncompliance
                  "
                  class="fa fa-times-circle"></i>
                <i
                  v-if="
                    getComplianceStatus(item.result) ===
                    complianceStatus.uncertain
                  "
                  class="fa fa-info-circle"></i>
              </p>
            </template>
            <el-collapse v-else v-model="collapseActiveNames">
              <el-collapse-item :name="index">
                <template slot="title">
                  <h5 class="rule-name" :title="item.second_rule">
                    {{ item.second_rule }}
                  </h5>
                  <p class="comment">
                    <span v-html="item.comment" :title="item.comment"></span>
                    <i
                      v-if="
                        getComplianceStatus(item.result) ===
                          complianceStatus.compliance && item.comment !== '是'
                      "
                      class="fa fa-check-circle"></i>
                    <i
                      v-if="
                        getComplianceStatus(item.result) ===
                        complianceStatus.noncompliance
                      "
                      class="fa fa-times-circle"></i>
                  </p>
                </template>
                <div
                  v-for="(subItem, subIndex) in item.detail.sub_cols"
                  :key="subIndex"
                  class="sub-comment"
                  :class="
                    getComplianceStatus(subItem.result) ===
                    complianceStatus.noncompliance
                      ? 'is-wrong'
                      : ''
                  ">
                  <span
                    :title="subItem.second_rule"
                    :class="subItem.detail.position.data ? 'clickable' : ''"
                    @click.stop="ruleItemClick(subItem)">
                    {{ subItem.second_rule }}：
                  </span>
                  <span
                    :title="subItem.comment"
                    :class="subItem.detail.position.data ? 'clickable' : ''"
                    @click.stop="ruleItemClick(subItem)"
                    >{{ subItem.comment }}</span
                  >
                  <span v-if="subItem.detail.percentage"
                    >占比：{{ subItem.detail.percentage }}</span
                  >
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import EventBus from './remark/remark-tree/EventBus';
import {
  updatePocRuleResults,
  fetchPocAuditStatusMap,
} from '@/store/api/sse.api';

export default {
  data() {
    return {
      rule: 'all',
      ruleList: [],
      isAnswerItemSelected: false,
      errorDialogVisible: false,
      errorForm: {
        message: '',
      },
      rules: {
        message: [
          { required: true, message: '请输入报错信息', trigger: 'blur' },
        ],
      },
      fid: null,
      ruleResultId: null,
      complianceStatus: {
        compliance: 'COMPLIANCE', // 合规
        noncompliance: 'NON_COMPLIANCE', // 不合规
        uncertain: 'UNCERTAIN', // 待分析
      },
      auditStatusOptions: [],
    };
  },
  computed: {
    ...mapGetters('ruleCheckModule', ['fileRules', 'fileRuleResult']),
    ...mapGetters('detailModule', ['fileViewer']),
    collapseActiveNames() {
      return this.ruleList[0].rules.map((rule, index) => index);
    },
  },
  watch: {
    fileRuleResult() {
      this.ruleList = _.cloneDeep(this.fileRuleResult);
    },
  },
  created() {
    this.fetchFileRuleResult();
    this.getAuditStatusMap();
  },
  beforeDestroy() {
    this.$store.commit('ruleCheckModule/SET_SELECTED_RULE_NAME', 'all');
  },
  methods: {
    async fetchFileRuleResult() {
      try {
        await this.$store.dispatch(
          'ruleCheckModule/fetchFileRuleResult',
          this.$route.query.fileId,
        );
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    selectChange(key) {
      if (key == 'all') {
        this.ruleList = _.cloneDeep(this.fileRuleResult);
      } else {
        const rules = _.cloneDeep(this.fileRuleResult);
        this.ruleList = rules.filter((rule) => rule.name === key);
      }
      this.$store.commit('ruleCheckModule/SET_SELECTED_RULE_NAME', key);
    },
    async answerItemSelected({ model }) {
      const answerKey = model.answer.key;
      for (let i = 0; i < this.ruleList.length; i++) {
        const rules = this.ruleList[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            const schemas = [];
            rule.schema_cols.forEach((schema) => {
              schemas.push(schema.replace(/\s+/g, ''));
            });
            const schema = schemas.find((schema) => schema === answerKey);
            this.$set(rule, 'selected', false);
            if (schema) {
              this.$set(rule, 'selected', true);
            }
          }
        }
      }
      await this.$nextTick();
      this.scrollIntoView();
    },
    scrollIntoView() {
      const ruleItemDom = document.querySelector(
        '.rule-result-list > li .selected',
      );
      if (ruleItemDom) {
        ruleItemDom.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    },
    ruleItemClick(ruleItem) {
      for (let i = 0; i < this.ruleList.length; i++) {
        const rules = this.ruleList[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            this.$set(rule, 'selected', false);
            if (ruleItem.id === rule.id) {
              this.$set(rule, 'selected', true);
            }
          }
        }
      }
      EventBus.$emit('rulecheck-item-selected', ruleItem);
    },
    showLabelInfo(info) {
      const labelInfo = this.convertStrToJSON(info);
      if (labelInfo.some((item) => item.includes('与模板有差异'))) {
        return true;
      }
      return false;
    },
    getTemplateDiffName(info) {
      console.log(info.split('：')[1]);
      return info.split('：')[1];
    },
    convertStrToJSON(str) {
      if (str === undefined) {
        return [];
      }
      try {
        return JSON.parse(str);
      } catch (error) {
        return [str];
      }
    },
    async updateRuleResults(status, item) {
      try {
        const data = { audit_status: status };
        await updatePocRuleResults(item.id, data);
        this.$notify({
          title: '成功',
          message: '人工确认成功',
          type: 'success',
        });
        this.fetchFileRuleResult();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getAuditStatusMap() {
      const res = await fetchPocAuditStatusMap();
      this.auditStatusOptions = res.data;
      const uncertainOptionIndex = this.auditStatusOptions.findIndex(
        (item) => item.key === this.complianceStatus.uncertain,
      );
      if (uncertainOptionIndex !== -1) {
        this.auditStatusOptions.splice(uncertainOptionIndex, 1);
      }
    },
    getComplianceStatus(status) {
      if (status === 10 || status === 11) {
        return 'COMPLIANCE';
      } else if (status === 20 || status === 21 || status === 22) {
        return 'NON_COMPLIANCE';
      } else if (status === 30) {
        return 'UNCERTAIN';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding: 10px 15px;
  overflow: hidden;
  .select-rule {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    background: #fff;
    .el-select {
      flex: 1;
    }
    ::v-deep .el-checkbox__label {
      padding-left: 5px;
    }
  }
  .rule-result-list {
    li {
      list-style: none;
      h4 {
        position: relative;
        margin: 10px 0;
        padding-left: 7px;
        font-weight: 500;
        &::before {
          position: absolute;
          top: 4px;
          left: 0;
          content: '';
          width: 4px;
          height: 15px;
          background: #409eff;
        }
      }
      .manual-confirm {
        display: flex;
        align-items: center;
        margin: 15px 0;
        padding-left: 6px;
        font-size: 14px;
        > span {
          width: 80px;
        }
        .el-select {
          width: 100%;
          margin-left: 10px;
        }
      }
      .rule-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;
        padding: 10px;
        background: #f6f6f6;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          background: #f1f1f1;
        }
        .rule-name {
          width: 70%;
          font-size: 14px;
          font-weight: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .comment {
          font-size: 14px;
          > span {
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .fa-times-circle {
            color: #d22727;
          }
          .fa-check-circle {
            color: #66af10;
          }
          .fa-info-circle {
            color: #f19313;
          }
        }
        &.selected {
          border: 1px solid #67af11;
        }
        &.is-wrong {
          background: #fff4f4;
          &:hover {
            background: #fff0f0;
          }
          &.selected {
            border: 1px solid #f56d6d;
          }
        }
        .el-collapse {
          width: 100%;
          border: none;
          ::v-deep .el-collapse-item__header {
            border: none;
            background: transparent;
            .el-collapse-item__arrow {
              margin: 0 0 0 10px;
            }
            .rule-name {
              width: 50%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .comment {
              width: 50%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              > span {
                display: inline-block;
                margin-right: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              i {
                margin: 0;
              }
            }
          }
          ::v-deep .el-collapse-item__wrap {
            background: transparent;
            .sub-comment {
              display: flex;
              margin: 10px 0;
              &.is-wrong {
                color: #d22727;
              }
              > span {
                width: 100% / 3;
                cursor: default;
                &:nth-child(1) {
                  width: 30%;
                  margin-right: 20px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                &:nth-child(2) {
                  width: 40%;
                  word-break: break-word;
                }
                &:nth-child(3) {
                  width: 30%;
                }
                &.clickable {
                  &:hover {
                    cursor: pointer;
                    color: #409eff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
