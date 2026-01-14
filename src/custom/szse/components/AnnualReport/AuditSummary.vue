<template>
  <div class="audit-details-summary">
    <div class="summary-data">
      <div class="summary-data-item">
        <div>
          <span class="summary-data-title">人工审核结果:</span>
          <ul>
            <li class="is-compliance">
              <span>合规</span
              ><span
                >{{ auditSummary.isComplianceCount }}/{{
                  auditSummary.auditTotal
                }}</span
              >
            </li>
            <li class="no-compliance">
              <span>不合规</span
              ><span
                >{{ auditSummary.noComplianceCount }}/{{
                  auditSummary.auditTotal
                }}</span
              >
            </li>
            <li class="unaudited">
              <span>未审核</span
              ><span
                >{{ auditSummary.unauditedCount }}/{{
                  auditSummary.auditTotal
                }}</span
              >
            </li>
          </ul>
        </div>
        <div>
          <span>是否追踪此报告</span>
          <span
            class="track-flag"
            @click="updateProjectInfo({ is_track: !projectInfo.is_track })">
            <i v-if="projectInfo.is_track" class="track-icon"></i>
          </span>
        </div>
      </div>
      <div class="summary-data-item">
        <span class="summary-data-title">附加的行业规则:</span>
        <el-tag v-for="item in projectInfo.tag" :key="item" size="mini">{{
          item
        }}</el-tag>
      </div>
    </div>
  </div>
</template>
<script>
import { updateProjectInfo } from '@/store/api/szse-annual.api';

export default {
  name: 'szse-annual-report-audit-summary',
  props: {
    projectInfo: {
      type: Object,
      require: true,
    },
    auditSummary: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    async updateProjectInfo(data) {
      try {
        await updateProjectInfo(this.projectInfo.id, data);
        this.$emit('refresh-project');
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.track-icon {
  display: block;
  width: 12px;
  height: 12px;
  background: url('~@/custom/szse/assets/track.svg') no-repeat;
  background-size: contain;
}

.audit-details-summary {
  display: flex;
  flex-flow: row;
  padding: 16px 24px;
  background: white;

  .summary-data {
    flex: 1;
    display: flex;
    flex-flow: column;
    row-gap: 10px;
  }

  .summary-data-item {
    display: flex;
    flex-flow: row;
    align-items: center;

    &:first-of-type {
      justify-content: space-between;

      & > div {
        display: flex;
        flex-flow: row;
        align-items: center;
      }
    }

    .summary-data-title {
      width: 130px;
    }

    ul {
      display: flex;
      flex-flow: row;
      align-items: center;
      column-gap: 30px;
      list-style: square;
      list-style-position: inside;

      li {
        & > span:first-of-type {
          margin-left: -5px;
          margin-right: 10px;
        }

        &.is-compliance {
          color: #5094ee;
        }

        &.no-compliance {
          color: #f56c6c;
        }
      }
    }

    .track-flag {
      display: inline-block;
      margin-left: 10px;
      padding: 1px;
      width: 16px;
      height: 16px;
      background: #f8f8f8;
      border: 1px solid #e5e9f0;
      cursor: pointer;
    }
  }
}
</style>
