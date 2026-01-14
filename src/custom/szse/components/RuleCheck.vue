<template>
  <div class="rule-container">
    <div class="summary">
      <span>审核结果:</span>
      <span class="compliance"
        >合规: {{ ruleSummary.compliance_count }}/{{
          ruleSummary.total_count
        }}</span
      >
      <span class="non-compliance"
        >不合规: {{ ruleSummary.non_compliance_count }}/{{
          ruleSummary.total_count
        }}</span
      >
      <span
        >合规评分:
        {{
          (ruleSummary.compliance_count / ruleSummary.total_count)
            | conversionPercet
        }}</span
      >
    </div>
    <el-collapse
      accordion
      class="rule-result-list"
      @change="collapseChangeHandler">
      <el-collapse-item
        v-for="(item, index) in ruleList"
        :key="index"
        :name="index">
        <div
          v-if="item.rules"
          slot="title"
          class="title"
          :class="getComplianceComment(item.rules[0]).className">
          <div class="name">
            <span :title="item.name">{{ item.name }}</span>
            <el-tooltip
              v-if="item.rules[0].detail.description"
              effect="dark"
              placement="bottom"
              popper-class="rule-tooltip">
              <div
                slot="content"
                v-html="item.rules[0].detail.description"></div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <span class="comment">{{
            getComplianceComment(item.rules[0]).comment
          }}</span>
        </div>
        <div
          v-for="(ruleItem, ruleIndex) in item.rules"
          :key="ruleIndex"
          class="rule-item"
          :class="[ruleItem.selected ? 'selected' : '']"
          @click="ruleItemClick(ruleItem)">
          <div
            v-if="ruleIndex === 0"
            class="sub-rule-title"
            :class="[
              ruleItem.result === complianceStatus.compliance
                ? 'is-right'
                : 'is-wrong',
            ]">
            <span class="name">
              <span>{{ ruleItem.second_rule }}: {{ ruleItem.comment }}</span>
              <span
                v-if="ruleItem.detail.comment_annotation"
                class="comment-annotation">
                （{{ ruleItem.detail.comment_annotation }}）
              </span>
            </span>
            <div class="manual-confirm">
              <span>人工确认:</span>
              <el-select
                :value="ruleItem.audit_status || ''"
                size="mini"
                placeholder="请选择"
                @change="updateRuleStatus($event, ruleItem)">
                <el-option
                  v-for="item in complianceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div
            v-else
            class="sub-rule-item-container"
            :class="[
              ruleItem.result === disclosureStatus.inTime
                ? 'is-right'
                : 'is-wrong',
            ]">
            <h4>【事项{{ ruleIndex }}】</h4>
            <div>
              <div
                v-for="(subRuleItem, subRuleIndex) in ruleItem.detail.sub_cols"
                :key="subRuleIndex"
                class="sub-rule-item">
                <span>{{ subRuleItem.second_rule }}:</span>
                <span
                  :class="subRuleItem.schema_cols.length > 0 ? 'clickable' : ''"
                  @click.stop="ruleItemClick(subRuleItem)">
                  {{ subRuleItem.comment }}
                  <span
                    v-if="subRuleItem.detail.comment_annotation"
                    class="comment-annotation">
                    （{{ subRuleItem.detail.comment_annotation }}）
                  </span>
                </span>
              </div>
            </div>
            <div class="extra-sub-rule-item-list">
              <div
                v-for="(subRuleItem, subRuleIndex) in ruleItem.detail
                  .extra_cols"
                :key="`${subRuleIndex}-extra`"
                class="sub-rule-item extra-sub-rule-item">
                <span>{{ subRuleItem.second_rule }}:</span>
                <span v-if="subRuleItem.comment_pos.file_id === undefined">{{
                  subRuleItem.comment
                }}</span>
                <el-button
                  v-else
                  type="text"
                  @click.stop="openExtraDocument(subRuleItem)"
                  >{{ subRuleItem.comment }}</el-button
                >
              </div>
            </div>
            <div class="ai-disclosure-list">
              <div class="sub-rule-item">
                <span class="name">AI判定:</span>
                <span class="ai-comment">{{
                  ruleItem.result | getDisclosureStatus
                }}</span>
                <div class="manual-confirm">
                  <span>人工确认:</span>
                  <el-select
                    :value="ruleItem.audit_status || ''"
                    size="mini"
                    placeholder="请选择"
                    @change="updateRuleStatus($event, ruleItem)">
                    <el-option
                      v-for="item in disclosureOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      value-key="label">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { updateFileRuleStatus } from '@/store/api/szse.api';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  data() {
    return {
      ruleSummary: {},
      ruleList: [],
      complianceStatus: {
        compliance: 0, // 合规
        noncompliance: 1, // 不合规
      },
      complianceAuditStatus: {
        compliance: 10, // 合规（人工确认）
        noncompliance: 11, // 不合规（人工确认）
      },
      disclosureStatus: {
        inTime: 20, // 及时披露
        delay: 21, // 未及时披露
        none: 22, // 未披露
      },
      complianceOptions: [
        {
          label: '合规',
          value: 10,
        },
        {
          label: '不合规',
          value: 11,
        },
      ],
      disclosureOptions: [
        {
          label: '及时披露',
          value: 20,
        },
        {
          label: '未及时披露',
          value: 21,
        },
        {
          label: '未披露',
          value: 22,
        },
      ],
    };
  },
  filters: {
    getDisclosureStatus(status) {
      switch (status) {
        case 20:
          return '及时披露';
        case 21:
          return '未及时披露';
        case 22:
          return '未披露';
        default:
          return '-';
      }
    },
  },
  computed: {
    ...mapGetters('ruleCheckModule', ['fileRuleResult']),
  },
  watch: {
    fileRuleResult() {
      this.ruleList = _.cloneDeep(this.fileRuleResult);
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchFileRuleSummary();
      this.fetchFileRuleResult();
    },
    async fetchFileRuleResult() {
      try {
        await this.$store.dispatch(
          'ruleCheckModule/fetchFileRuleResult',
          this.$route.params.id,
        );
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchFileRuleSummary() {
      try {
        const res = await this.$store.dispatch(
          'ruleCheckModule/fetchFileRuleSummary',
          this.$route.params.id,
        );
        this.ruleSummary = res.data;
      } catch (error) {
        console.log(error.message);
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
    openExtraDocument(data) {
      this.$emit('open-extra-document', data.comment_pos);
    },
    async updateRuleStatus(val, item) {
      try {
        await updateFileRuleStatus(item.id, { audit_status: val });
        this.$notify({
          title: '成功',
          message: '人工确认成功',
          type: 'success',
        });
        this.fetchFileRuleSummary();
        this.fetchFileRuleResult();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
        });
      }
    },
    getComplianceComment(item) {
      if (item.audit_status === 0) {
        return {
          className:
            item.result === this.complianceStatus.noncompliance
              ? 'is-wrong'
              : 'is-right',
          comment: item.comment,
        };
      } else if (item.audit_status === this.complianceAuditStatus.compliance) {
        return {
          className: 'is-right',
          comment: '合规',
        };
      } else if (
        item.audit_status === this.complianceAuditStatus.noncompliance
      ) {
        return {
          className: 'is-wrong',
          comment: '不合规',
        };
      }
    },
    collapseChangeHandler(index) {
      const subRuleItem = this.ruleList[index].rules.find((rule) => {
        return rule.schema_cols.length > 0;
      });
      if (subRuleItem) {
        this.ruleItemClick(subRuleItem);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$--color-title-bg: #f5f5f5;
$--color-right-text: #1ec350;
$--color-wrong-text: #fd7f45;
$--color-right-bg: #dfece3;
$--color-wrong-bg: #e5dce2;
$--color-right-bg-hover: #cae8d3;
$--color-wrong-bg-hover: #f1d9ea;

.rule-container {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  .summary {
    position: sticky;
    top: 0;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    background: #fff;
    z-index: 999;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #e2e2e2;
    font-size: 14px;
    font-weight: 500;
    color: #444;
    > span {
      margin-right: 30px;
    }
    .compliance {
      color: $--color-right-text;
    }
    .non-compliance {
      color: $--color-wrong-text;
    }
  }
  .rule-result-list {
    border-top: none;
    .el-collapse-item {
      margin: 5px 0;
      list-style: none;
      ::v-deep div[role='tab'] {
        position: sticky;
        top: 40px;
        z-index: 1;
      }
      ::v-deep .el-collapse-item__header {
        border-bottom: none;
        background: $--color-title-bg;
      }
      ::v-deep .el-collapse-item__content {
        padding: 5px;
        background: $--color-title-bg;
      }
      .title {
        display: flex;
        justify-content: space-between;
        position: relative;
        width: calc(100% - 21px);
        margin: 10px 0;
        padding: 0 10px;
        font-weight: 500;
        background: $--color-title-bg;
        box-sizing: border-box;
        .name {
          width: 90%;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 4px;
            height: 100%;
            background: #409eff;
          }
        }
        .comment {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            top: 22px;
            left: -10px;
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }
        }
        i {
          margin-left: 5px;
          color: #9e9e9e;
        }
      }
      .rule-item {
        margin: 3px 0;
        color: #444;
        background: #f6f6f6;
        cursor: pointer;
        &:first-child {
          margin-top: 0;
        }
        &.selected {
          .is-right {
            background: $--color-right-bg-hover;
          }
          .is-wrong {
            background: $--color-wrong-bg-hover;
          }
        }
        &:hover {
          background: #f1f1f1;
        }
        .sub-rule-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin-top: -7px;
          padding: 15px 10px 15px 20px;
          background: $--color-title-bg;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -5px;
            width: 4px;
            height: 100%;
            background: #409eff;
          }
          &.is-right {
            &::before {
              background: $--color-right-text;
            }
          }
          &.is-wrong {
            &::before {
              background: $--color-wrong-text;
            }
          }
          .name {
            font-weight: bold;
            &::before {
              content: '';
              position: absolute;
              top: 24px;
              left: 10px;
              display: block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
            }
            .comment-annotation {
              color: #7e7e7e;
            }
          }
        }
        .sub-rule-item-container {
          padding: 15px 20px;
          .sub-rule-item {
            position: relative;
            display: flex;
            align-items: baseline;
            padding: 5px 5px 5px 8px;
            font-size: 14px;
            > span {
              &:nth-child(1) {
                width: 35%;
              }
              &:nth-child(2) {
                width: 65%;
                cursor: default;
                &.clickable {
                  &:hover {
                    cursor: pointer;
                    color: #409eff;
                  }
                }
              }
            }
            &:first-child {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
              margin: 0;
              > span {
                &::before {
                  content: '';
                  position: absolute;
                  top: 19px;
                  left: 18px;
                  display: block;
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                }
              }
            }
            .comment-annotation {
              color: #7e7e7e;
            }
          }
          .extra-sub-rule-item-list {
            padding: 15px 10px 0 10px;
            .extra-sub-rule-item {
              padding: 10px 0;
              &:first-child {
                border-top: 1px dashed #c7c7c7;
              }
              .el-button {
                width: 65%;
                padding: 0;
                white-space: normal;
                text-align: left;
                line-height: 22px;
                font-weight: normal;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          .ai-disclosure-list {
            position: relative;
            .sub-rule-item {
              > span:first-child {
                padding-left: 15px;
                box-sizing: border-box;
                &::before {
                  content: '';
                  position: absolute;
                  top: 14px;
                  left: 10px;
                  display: block;
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                }
              }
              .manual-confirm {
                position: absolute;
                right: 0;
              }
            }
          }
        }
      }
    }
  }
  .manual-confirm {
    display: flex;
    align-items: center;
    color: #6d6d6d;
    font-size: 13px;
    .el-select {
      width: 110px;
      margin-left: 10px;
      ::v-deep .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
      ::v-deep .el-input__icon {
        line-height: 24px;
      }
    }
  }
  .is-right {
    background: $--color-right-bg;
    &:hover {
      background: $--color-right-bg-hover;
    }
    &.selected {
      background: $--color-right-bg-hover;
    }
    .name {
      color: $--color-right-text;
      &::before {
        background: $--color-right-text !important;
      }
    }
    .comment {
      color: $--color-right-text;
      &::before {
        background: $--color-right-text;
      }
    }
    .ai-comment {
      color: $--color-right-text;
    }
  }
  .is-wrong {
    background: $--color-wrong-bg;
    &:hover {
      background: $--color-wrong-bg-hover;
    }
    &.selected {
      background: $--color-wrong-bg-hover;
    }
    .name {
      color: $--color-wrong-text;
      &::before {
        background: $--color-wrong-text !important;
      }
    }
    .comment {
      color: $--color-wrong-text;
      &::before {
        background: $--color-wrong-text;
      }
    }
    .ai-comment {
      color: $--color-wrong-text;
    }
  }
}
</style>

<style lang="scss">
.rule-tooltip {
  width: 40%;
  line-height: 20px;
  white-space: pre-wrap;
}
</style>
