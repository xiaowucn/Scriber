<template>
  <el-dialog
    title="变更记录"
    width="600px"
    :visible="true"
    :close-on-click-modal="false"
    @close="close">
    <div class="rule-audit-changelog">
      <ul class="navs">
        <li
          v-for="(log, index) in logs"
          :key="index"
          :class="{ active: index === logIndex }"
          @click="LogItemClicked(index)">
          <template v-if="index === 0 && logs.length > 1">
            当前审核结果
          </template>
          <template v-if="index === logs.length - 1">AI审核结果</template>
          <template v-if="index > 0 && index < logs.length - 1">
            {{ log.updated_utc | datetime }}
          </template>
        </li>
      </ul>
      <div class="content">
        <p class="name">
          <span>
            <template v-if="!logs[logIndex].is_ai_result">
              变更用户：<span :title="logs[logIndex].user_name">
                {{ logs[logIndex].user_name }}
              </span>
            </template>
          </span>
          <span>{{ logs[logIndex].updated_utc | datetime }}</span>
        </p>
        <p v-if="showAuditResultItem">
          审核结果：
          <template v-if="logs[logIndex].is_ai_result">
            {{ auditResultText(logs[logIndex].is_compliance_ai) }}
          </template>
          <template v-else>
            {{ auditResultText(logs[logIndex].is_compliance_from) }}
            →
            {{ auditResultText(logs[logIndex].is_compliance_to) }}
          </template>
        </p>
        <template v-if="logs[logIndex].is_compliance_ai !== true">
          <p v-if="logs[logIndex].user_reasons.length > 0">
            <span>{{ isLlmReview ? '判定依据：' : '不通过原因：' }}</span>
            <span class="reasons">
              <span
                v-for="(reason, index) in logs[logIndex].user_reasons"
                :key="index">
                {{ reason }}
              </span>
            </span>
          </p>
          <p v-if="logs[logIndex].suggestion">
            修改意见：{{ logs[logIndex].suggestion }}
          </p>
        </template>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" size="small" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'rule-audit-changelog',
  props: {
    logs: {
      type: Array,
      default: () => [],
    },
    isLlmReview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      logIndex: 0,
    };
  },
  computed: {
    showAuditResultItem() {
      const log = this.logs[this.logIndex];
      if (log.is_ai_result) {
        return true;
      }
      return (
        !log.is_ai_result && log.is_compliance_from !== log.is_compliance_to
      );
    },
    auditResultText() {
      return (result) => {
        switch (result) {
          case null:
            return '不适用';
          case true:
            return '合规';
          case false:
            return '不合规';
          default:
            return '';
        }
      };
    },
    // 判断是否为一致性检查
    isConsistencyCheck() {
      const log = this.logs[this.logIndex];
      // 根据 rule_type 判断，template 类型为一致性检查
      return log.rule_type === 'template';
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    LogItemClicked(index) {
      this.logIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    padding-bottom: 15px;
  }
  .el-dialog__body {
    padding: 0;
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    padding: 15px 20px;
  }
  .rule-audit-changelog {
    display: flex;
    .navs {
      max-height: 40vh;
      overflow-y: auto;
      padding: 10px 0;
      border-right: 1px solid #ececec;
      li {
        padding: 10px 20px;
        list-style: none;
        cursor: pointer;
        &.active,
        &:hover {
          background: #eef8ff;
        }
      }
    }
    .content {
      width: 60%;
      padding: 10px 20px;
      > p {
        display: flex;
        align-items: baseline;
        max-height: 52px;
        overflow-y: auto;
        margin: 5px 0;
        padding: 5px;
        background: #f8f8f8;
        border: 1px solid #ececec;
        border-radius: 4px;
        color: #8c8c8c;
        &.name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          color: #333;
          > span {
            &:first-child {
              max-width: 200px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .reasons {
          flex: 1;
          > span {
            display: block;
          }
        }
      }
    }
  }
}
</style>
