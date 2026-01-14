<template>
  <div class="audit-sub-item" @click="activeAuditSubItem">
    <div class="header">
      <div>
        <span class="sub-title">事项{{ index + 1 }}:</span>
        <el-button
          v-if="!showContentOnly"
          type="text"
          size="mini"
          :disabled="!auditSubItem.qid || !auditSubItem.schema_path"
          @click="checkAIPredcition"
          >AI位置定位</el-button
        >
      </div>
      <div v-if="!showContentOnly">
        <span>是否关注</span>
        <span
          class="attention-flag"
          @click.stop="
            updateAuditSubItemInfo({
              is_attention: !auditSubItem.is_attention,
            })
          ">
          <i v-if="auditSubItem.is_attention" class="attention-icon"></i>
        </span>
        <el-button type="text" @click.stop="checkQuiry">问询</el-button>
      </div>
    </div>
    <div class="details">
      <ul v-if="auditSubItem.items" class="node-list">
        <li
          v-for="node in auditSubItem.items"
          :key="node.key"
          class="node-list-item">
          <span class="node-key">{{ node.key }}:</span>
          <span class="node-content">{{ node.content }}</span>
        </li>
      </ul>
      <manual-remark
        v-if="!showContentOnly"
        :labels="auditSubItem.labels || []"
        :isActived="isActived"
        @update-labels="
          (labels) => updateAuditSubItemInfo({ labels })
        "></manual-remark>
    </div>
    <extra-file-list
      v-if="!showContentOnly && auditSubItem.ext_reports"
      :list="auditSubItem.ext_reports"
      @check-extra-file="
        (file) => $emit('check-extra-file', file)
      "></extra-file-list>
    <div v-if="!showContentOnly && auditSubItem" class="public-selector">
      <div>
        <span class="label">AI判断:</span>
        <span class="ai-result">{{
          auditSubItem.is_publish_ai ? '及时披露' : '未披露'
        }}</span>
      </div>
      <div>
        <span class="label">用户确认:</span>
        <el-select
          size="mini"
          :value="auditSubItem.is_publish"
          @change="(is_publish) => updateAuditSubItemInfo({ is_publish })">
          <el-option label="及时披露" :value="true"></el-option>
          <el-option label="未披露" :value="false"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import ManualRemark from '@/custom/szse/components/AnnualReport/ManualRemark';
import ExtraFileList from '@/custom/szse/components/AnnualReport/ExtraFileList';
import { updateProjectAuditSubItemInfo } from '@/store/api/szse-annual.api';

export default {
  components: {
    ManualRemark,
    ExtraFileList,
  },
  name: 'szse-annual-report-sub-audit-item-detail',
  props: {
    auditSubItem: {
      type: Object,
      require: true,
    },
    index: {
      type: Number,
      require: true,
    },
    isActived: {
      type: Boolean,
      require: true,
    },
    showContentOnly: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    activeAuditSubItem() {
      this.$emit('active-audit-sub-item', this.auditSubItem.id);
    },
    checkAIPredcition() {
      this.$emit('check-ai-prediction', this.auditSubItem);
    },
    checkQuiry() {
      this.$emit('check-sub-quiry', {
        id: this.auditSubItem.id,
        parentId: this.auditSubItem.result_id,
      });
    },
    async updateAuditSubItemInfo(data) {
      try {
        await updateProjectAuditSubItemInfo(this.auditSubItem.id, data);
        this.$emit('refresh-audit-details');
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

.audit-sub-item {
  padding: 8px 16px;
  background: #f8f8f8;
  font-size: 14px;
  font-size: 13px;
  color: #333333;
  border: 1px solid transparent;

  .header {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    height: 40px;

    > div {
      display: flex;
      flex-flow: row;
      align-items: center;
    }

    .sub-title {
      font-weight: bold;
      color: #333333;
      width: 111px;
    }
  }

  .details {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: flex-end;

    .node-list {
      list-style: none;

      .node-list-item {
        &:not(:last-of-type) {
          margin-bottom: 4px;
        }

        &::before {
          content: '\2022';
          display: inline-block;
          width: 1em;
          color: #5094ee;
        }

        .node-key {
          display: inline-block;
          min-width: 100px;
          white-space: nowrap;
          color: #666666;
        }

        .node-content {
          display: inline-block;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }

  .public-selector {
    display: flex;
    flex-flow: row;
    column-gap: 50px;
    margin-top: 10px;
    padding: 0 8px;

    & > div {
      display: flex;
      flex-flow: row;
      align-items: center;
      column-gap: 10px;

      .label {
        font-size: 14px;
        color: #333333;
      }

      .ai-result {
        font-size: 14px;
        color: #418bed;
      }

      .el-select {
        width: 100px;
      }
    }
  }
}
</style>
