<template>
  <div class="annual-report-audit">
    <div class="document-viewer">
      <file-viewer
        v-if="fileInfo"
        :fileId="projectInfo.fid"
        :fileInfo="fileInfo"
        :showGoBackButton="true"
        :showMarkTool="!showExtraFile"
        :markable="fileViewerMarkable"></file-viewer>
      <dl v-if="projectInfo && fileInfo" class="project-basic-info">
        <dt>公司代码:</dt>
        <dd>{{ projectInfo.company.code }}</dd>
        <dt>公司名称:</dt>
        <dd>{{ projectInfo.company.name }}</dd>
        <dt>报告年份:</dt>
        <dd>{{ projectInfo.period_year }}</dd>
        <dt>当前状态:</dt>
        <dd>{{ projectStatus }}</dd>
      </dl>
      <prediction-position
        v-if="showAIPrediction"
        class="prediction-position"
        :auditItem="aiPredictionAuditItem"
        @close="closeAIPrediction"></prediction-position>
    </div>
    <div class="audit-result">
      <all-quiry
        v-if="showAllQuiry"
        :projectID="projectID"
        @check-quiry="checkAuditItemQuiry"
        @check-sub-quiry="checkAuditSubItemQuiry"
        @close="resetAuditList"></all-quiry>
      <audit-item-quiry
        v-else-if="showAuditItemQuiry"
        :auditItem="auditItemActived"
        @open-all-quiry="checkAllQuiry"
        @close="closeQuiry"></audit-item-quiry>
      <audit-sub-item-quiry
        v-else-if="showAuditSubItemQuiry"
        :auditSubItem="auditSubItemActived"
        @close="closeQuiry"></audit-sub-item-quiry>
      <extra-file
        v-else-if="showExtraFile"
        :file="extraFile"
        :projectInfo="projectInfo"
        :auditSummary="auditSummary"
        @close="resetAuditList"
        @refresh-project="getProjectInfo"></extra-file>
      <audit-details
        v-if="projectInfo"
        v-show="showAuditDetails"
        :projectInfo="projectInfo"
        :auditDetails="auditDetails"
        :auditSummary="auditSummary"
        @select-audit-item="selectAuditItem"
        @select-audit-sub-item="selectSubAuditItem"
        @check-quiry="checkAuditItemQuiry"
        @check-sub-quiry="checkAuditSubItemQuiry"
        @check-extra-file="checkExtraFile"
        @check-ai-prediction="checkAIPrediction"
        @open-all-quiry="checkAllQuiry"
        @refresh-project="getProjectInfo"
        @refresh-audit-details="getAuditDetails"
        :getAuditDetails="getAuditDetails"></audit-details>
    </div>
  </div>
</template>
<script>
import FileViewer from '@/custom/szse/components/AnnualReport/FileViewer';
import AuditDetails from '@/custom/szse/components/AnnualReport/AuditDetails';
import AuditItemQuiry from '@/custom/szse/components/AnnualReport/AuditItemQuiry';
import AuditSubItemQuiry from '@/custom/szse/components/AnnualReport/AuditSubItemQuiry';
import AllQuiry from '@/custom/szse/components/AnnualReport/AllQuiry';
import ExtraFile from '@/custom/szse/components/AnnualReport/ExtraFile';
import PredictionPosition from '@/custom/szse/components/AnnualReport/PredictionPosition';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import {
  fetchProjectInfo,
  fetchProjectAuditDetails,
} from '@/store/api/szse-annual.api';

export default {
  name: 'szse-annual-report-audit',
  components: {
    FileViewer,
    AuditDetails,
    AuditItemQuiry,
    AuditSubItemQuiry,
    AllQuiry,
    ExtraFile,
    PredictionPosition,
  },
  data() {
    return {
      projectInfo: null,
      fileInfo: null,
      auditDetails: [],
      auditItemActived: null,
      auditSubItemActived: null,
      showAllQuiry: false,
      showAuditItemQuiry: false,
      showAuditSubItemQuiry: false,
      showExtraFile: false,
      extraFile: null,
      showAIPrediction: false,
      aiPredictionAuditItem: null,
      fileViewerMarkable: false,
      checkQuiryFromAllQuiry: false,
    };
  },
  computed: {
    projectID() {
      return Number(this.$route.params.projectID);
    },
    projectStatus() {
      if (this.projectInfo) {
        switch (this.projectInfo.status) {
          case 'pretreatment':
            return '待预审';
          case 'review':
            return '预审完成';
          case 'done':
            return '复审完成';
        }
      }

      return '';
    },
    auditSummary() {
      let isComplianceCount = 0;
      let noComplianceCount = 0;
      let unauditedCount = 0;
      const auditTotal = this.auditDetails.length;

      this.auditDetails.forEach((item) => {
        if (item.is_compliance === true) {
          isComplianceCount++;
        } else if (item.is_compliance === false) {
          noComplianceCount++;
        } else {
          unauditedCount++;
        }
      });

      return {
        isComplianceCount,
        noComplianceCount,
        unauditedCount,
        auditTotal,
      };
    },
    showAuditDetails() {
      return !(
        this.showAllQuiry ||
        this.showAuditItemQuiry ||
        this.showAuditSubItemQuiry ||
        this.showExtraFile
      );
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      await Promise.all([this.getProjectInfo(), this.getAuditDetails()]);
      await this.getFileInfo();
    },
    async getProjectInfo() {
      try {
        const { data } = await fetchProjectInfo(this.projectID);
        this.projectInfo = data;
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getFileInfo() {
      try {
        const [pageInfoRes, outlineRes] = await Promise.all([
          fetchFilePageInfo(this.projectInfo.fid),
          fetchFileOutline(this.projectInfo.fid),
        ]);

        this.fileInfo = {
          fileId: this.projectInfo.fid,
          filePath: [],
          pageInfo: pageInfoRes.data,
          outline: {
            items: outlineRes.data ? outlineRes.data.children : [],
          },
        };
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getAuditDetails() {
      try {
        const { data } = await fetchProjectAuditDetails(this.projectID);
        this.auditDetails = data;

        if (this.auditItemActived) {
          this.auditItemActived = this.auditDetails.find(
            (item) => item.id === this.auditItemActived.id,
          );

          if (this.auditSubItemActived) {
            this.auditSubItemActived = {
              ...this.auditSubItemActived,
              ...this.auditItemActived.sub_items[
                this.auditSubItemActived.index
              ],
            };
          }
        }
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    selectAuditItem(id) {
      this.auditItemActived = this.auditDetails.find((item) => item.id === id);

      const canMarkLabel =
        this.auditItemActived && this.auditItemActived.sub_items.length === 0;
      this.fileViewerMarkable = canMarkLabel;
    },
    selectSubAuditItem(id) {
      if (this.auditItemActived) {
        const auditSubItemIndex = this.auditItemActived.sub_items.findIndex(
          (item) => item.id === id,
        );

        this.auditSubItemActived = {
          index: auditSubItemIndex,
          ...this.auditItemActived.sub_items[auditSubItemIndex],
        };

        this.fileViewerMarkable = true;
      }
    },
    checkAllQuiry() {
      this.resetAuditList();
      this.showAllQuiry = true;
    },
    checkAuditItemQuiry(id) {
      this.checkQuiryFromAllQuiry = this.showAllQuiry;
      this.resetAuditList();

      this.selectAuditItem(id);
      this.showAuditItemQuiry = true;
    },
    checkAuditSubItemQuiry({ id, parentId }) {
      this.checkQuiryFromAllQuiry = this.showAllQuiry;
      this.resetAuditList();

      this.selectAuditItem(parentId);
      this.selectSubAuditItem(id);
      this.showAuditSubItemQuiry = true;
    },
    checkExtraFile(file) {
      this.resetAuditList();
      this.extraFile = file;
      this.showExtraFile = true;
    },
    checkAIPrediction(item) {
      this.resetAuditList();
      this.aiPredictionAuditItem = item;
      this.showAIPrediction = true;
    },
    closeAIPrediction() {
      this.showAIPrediction = false;
      this.aiPredictionAuditItem = null;
    },
    closeQuiry() {
      this.resetAuditList();
      if (this.checkQuiryFromAllQuiry) {
        this.showAllQuiry = true;
      }
    },
    resetAuditList() {
      this.showAllQuiry = false;
      this.showAuditItemQuiry = false;
      this.showAuditSubItemQuiry = false;
      this.showExtraFile = false;
    },
  },
};
</script>
<style lang="scss" scoped>
$menu-height: 65px;

* {
  box-sizing: border-box;
}

::v-deep .attention-icon {
  display: block;
  width: 12px;
  height: 12px;
  background: url('~@/custom/szse/assets/attention.svg') no-repeat;
  background-size: contain;
}

::v-deep .attention-flag {
  display: inline-block;
  margin: 0 10px;
  padding: 1px;
  width: 16px;
  height: 16px;
  background: #f8f8f8;
  border: 1px solid #e5e9f0;
  cursor: pointer;
}

.annual-report-audit {
  display: flex;
  flex-flow: row;
  width: 100vw;
  height: calc(100vh - #{$menu-height});
  overflow: hidden;
  background: #f0f2f5;
  font-size: 14px;
  color: #666666;
}

.document-viewer {
  flex: 1;
  overflow: hidden;
  position: relative;

  .project-basic-info {
    position: absolute;
    top: 10px;
    right: 16px;
    z-index: 200;
    display: flex;
    flex-flow: row;
    align-items: center;

    dt {
      margin-left: 10px;
      margin-right: 4px;
    }

    dd {
      color: #4b7dd0;
    }
  }

  ::v-deep .image-viewer-header {
    .header-pagebar {
      display: none;
    }
  }
}

.audit-result {
  flex: 1;
  overflow: hidden;
}

.prediction-position {
  position: absolute;
  top: 50px;
  right: 8px;
  width: 500px;
  z-index: 230;
}
</style>
