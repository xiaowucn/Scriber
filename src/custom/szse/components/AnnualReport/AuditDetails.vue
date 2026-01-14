<template>
  <div class="audit-details">
    <div class="audit-details-header">
      <div>
        <el-button type="primary" size="mini" @click="openAllQuiry"
          >查看问询函</el-button
        >
        <span class="project-rating">评级：{{ projectInfo.rating || '' }}</span>
      </div>
      <div>
        <el-button type="primary" size="mini" @click="openPreviewDialog"
          >提交初审</el-button
        >
        <el-button type="primary" size="mini" @click="submitReview"
          >复核</el-button
        >
      </div>
    </div>
    <div class="audit-details-content">
      <audit-summary
        :projectInfo="projectInfo"
        :auditSummary="auditSummary"
        @refresh-project="$emit('refresh-project')"></audit-summary>
      <div class="audit-details-filter">
        <el-select
          v-model="auditDetailsFilter.type"
          size="mini"
          @change="handleAuditDetailsFilterChanged">
          <el-option label="按章节" value="chapter"></el-option>
          <el-option label="按规则" value="rule"></el-option>
        </el-select>
        <div
          v-if="auditDetailsFilter.type === 'chapter'"
          class="chapter-select">
          <i
            class="el-icon-arrow-left"
            @click="selectPreviousChapterOption"></i>
          <el-select
            v-model="auditDetailsFilter.chapter"
            size="mini"
            placeholder="请选择章节">
            <el-option
              v-for="item in chapterOptions"
              :key="item.index"
              :label="item.title"
              :value="item.index"></el-option>
          </el-select>
          <i class="el-icon-arrow-right" @click="selectNextChapterOption"></i>
        </div>
        <span>（共计：{{ auditDetailsFiltered.length }}条）</span>
      </div>
      <el-collapse
        v-model="auditItemActived"
        accordion
        @change="handleAuditItemActived"
        class="audit-details-list">
        <el-collapse-item
          v-for="item in auditDetailsFiltered"
          :key="item.id"
          :name="item.id"
          class="list-item">
          <template slot="title">
            <div
              class="audit-item-title"
              :class="
                item.is_compliance === true
                  ? 'is-compliance'
                  : item.is_compliance === false
                    ? 'no-compliance'
                    : ''
              ">
              <div>
                <i class="square"></i>
                <span v-text="item.chapter_title"></span>
                <el-tag class="tag" size="mini">{{ item.tag }}</el-tag>
              </div>
              <div>
                <span>是否关注</span>
                <span
                  class="attention-flag"
                  @click.stop="
                    updateAuditItemInfo(item.id, {
                      is_attention: !item.is_attention,
                    })
                  ">
                  <i v-if="item.is_attention" class="attention-icon"></i>
                </span>
                <el-button type="text" @click.stop="checkChapterQuiry(item.id)"
                  >问询</el-button
                >
              </div>
            </div>
          </template>
          <div class="audit-item-content">
            <p class="content" v-text="item.rule"></p>
            <div class="compliance-result">
              <div class="compliance-result-row">
                <div>
                  <span class="title">AI审核结果:</span>
                  <span class="result">{{
                    item.is_compliance_ai ? '合规' : '不合规'
                  }}</span>
                </div>
                <div>
                  <span class="title">用户确认:</span>
                  <el-radio-group
                    :value="item.is_compliance"
                    size="mini"
                    class="result">
                    <el-radio
                      :label="true"
                      @change="
                        updateAuditItemInfo(item.id, {
                          is_compliance: true,
                        })
                      "
                      >合规</el-radio
                    >
                    <el-radio
                      :label="false"
                      @change="
                        updateAuditItemInfo(item.id, {
                          is_compliance: false,
                        })
                      "
                      >不合规</el-radio
                    >
                  </el-radio-group>
                </div>
              </div>
              <div
                v-if="item.sub_items.length === 0"
                class="compliance-result-row">
                <manual-remark
                  :labels="item.labels || []"
                  :isActived="item.id === auditItemActived"
                  @update-labels="updateAuditItemLabels"></manual-remark>
                <el-button
                  type="text"
                  size="mini"
                  :disabled="!item.qid || !item.schema_path"
                  @click="checkAIPredcition(item)"
                  >AI位置定位</el-button
                >
              </div>
            </div>
            <ol v-if="item.sub_items" class="sub-list">
              <li
                v-for="(subItem, index) in item.sub_items"
                :key="subItem.id"
                class="sub-list-item">
                <audit-sub-item-detail
                  :auditSubItem="subItem"
                  :index="index"
                  :isActived="subItem.id === auditSubItemActived"
                  :class="subItem.id === auditSubItemActived ? 'active' : ''"
                  @active-audit-sub-item="handleAuditSubItemActived"
                  @check-sub-quiry="(value) => $emit('check-sub-quiry', value)"
                  @check-extra-file="(file) => $emit('check-extra-file', file)"
                  @check-ai-prediction="checkAIPredcition"
                  @refresh-audit-details="$emit('refresh-audit-details')" />
              </li>
            </ol>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      title="提交初审"
      :visible.sync="previewDialogVisible"
      width="340px"
      top="30vh"
      :close-on-click-modal="false">
      <el-form
        ref="previewForm"
        :model="previewForm"
        :rules="{
          rating: { required: true, message: '请选择评级', trigger: 'blur' },
        }"
        label-width="80px">
        <el-form-item label="评级结果" prop="rating">
          <el-select
            v-model="previewForm.rating"
            size="small"
            placeholder="请选择评级">
            <el-option value="A" label="A"></el-option>
            <el-option value="B" label="B"></el-option>
            <el-option value="C" label="C"></el-option>
            <el-option value="D" label="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="closePreviewDialog">取消</el-button>
          <el-button type="primary" size="small" @click="submitPreview"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import AuditSummary from '@/custom/szse/components/AnnualReport/AuditSummary';
import AuditSubItemDetail from '@/custom/szse/components/AnnualReport/AuditSubItemDetail';
import ManualRemark from '@/custom/szse/components/AnnualReport/ManualRemark';
import {
  submitPreviewProject,
  submitReviewProject,
  updateProjectAuditItemInfo,
  updateProjectInfo,
} from '@/store/api/szse-annual.api';
import { EventBus } from '@/utils';

export default {
  name: 'szse-annual-report-audit-details',
  components: {
    AuditSummary,
    AuditSubItemDetail,
    ManualRemark,
  },
  props: {
    projectInfo: {
      type: Object,
      require: true,
    },
    auditDetails: {
      type: Array,
      require: true,
    },
    auditSummary: {
      type: Object,
      require: true,
    },
    getAuditDetails: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      auditDetailsFilter: {
        type: 'chapter',
        chapter: 'all',
      },
      previewDialogVisible: false,
      previewForm: {
        rating: '',
      },
      auditItemActived: '',
      auditSubItemActived: '',
    };
  },
  computed: {
    chapterOptions() {
      const options = [{ index: 'all', title: '全部' }];
      this.auditDetails.forEach((item) => {
        if (!options.some((op) => op.index === item.top_chapter_index)) {
          options.push({
            index: item.top_chapter_index,
            title: item.top_chapter_title,
          });
        }
      });

      return _.sortBy(options, 'index');
    },
    auditDetailsFiltered() {
      let list = this.auditDetails;

      if (this.auditDetailsFilter.type === 'chapter') {
        list = _.sortBy(list, 'chapter_index');

        if (this.auditDetailsFilter.chapter !== 'all') {
          list = list.filter(
            (item) =>
              item.top_chapter_index === this.auditDetailsFilter.chapter,
          );
        }
      }
      if (this.auditDetailsFilter.type === 'rule') {
        list = _.sortBy(list, 'id');
      }

      return list;
    },
  },
  methods: {
    handleAuditDetailsFilterChanged() {
      this.auditDetailsFilter.chapter = 'all';
    },
    selectPreviousChapterOption() {
      const chapterOptionSelectedIndex = this.chapterOptions.findIndex(
        (item) => item.index === this.auditDetailsFilter.chapter,
      );
      if (chapterOptionSelectedIndex > 0) {
        this.auditDetailsFilter.chapter =
          this.chapterOptions[chapterOptionSelectedIndex - 1].index;
      }
    },
    selectNextChapterOption() {
      const chapterOptionSelectedIndex = this.chapterOptions.findIndex(
        (item) => item.index === this.auditDetailsFilter.chapter,
      );
      if (chapterOptionSelectedIndex < this.chapterOptions.length - 1) {
        this.auditDetailsFilter.chapter =
          this.chapterOptions[chapterOptionSelectedIndex + 1].index;
      }
    },
    handleAuditItemActived(id) {
      this.auditSubItemActived = '';
      this.renderAuditItemBlock();
      this.$emit('select-audit-item', id);
    },
    handleAuditSubItemActived(id) {
      this.auditSubItemActived = id;
      this.renderAuditSubItemBlock();
      this.$emit('select-audit-sub-item', id);
    },
    openAllQuiry() {
      this.$emit('open-all-quiry');
    },
    checkChapterQuiry(id) {
      this.$emit('check-quiry', id);
    },
    checkAIPredcition(item) {
      this.$emit('check-ai-prediction', item);
    },
    openPreviewDialog() {
      this.previewForm = {
        rating: '',
      };
      this.previewDialogVisible = true;
    },
    closePreviewDialog() {
      this.previewDialogVisible = false;
    },
    async submitPreview() {
      await this.$refs.previewForm.validate();

      try {
        await submitPreviewProject(this.projectInfo.id, this.previewForm);
        this.closePreviewDialog();
        this.$emit('refresh-project');

        this.$notify({
          title: '提示',
          message: '提交成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async submitReview() {
      try {
        await submitReviewProject(this.projectInfo.id);
        this.$emit('refresh-project');

        this.$notify({
          title: '提示',
          message: '提交成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    async updateAuditItemInfo(id, data) {
      try {
        await updateProjectAuditItemInfo(id, data);
        this.$emit('refresh-audit-details');
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
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
    async updateAuditItemLabels(labels) {
      const auditItem = this.auditDetails.find(
        (item) => item.id === this.auditItemActived,
      );
      if (!auditItem) {
        return;
      }

      try {
        await updateProjectAuditItemInfo(auditItem.id, {
          labels,
        });
        this.$emit('refresh-audit-details');
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    renderAuditItemBlock() {
      const auditItem = this.auditDetails.find(
        (item) => item.id === this.auditItemActived,
      );

      if (auditItem && auditItem.outlines) {
        this.updateHighlightBlocks(auditItem.outlines);
      }
    },
    renderAuditSubItemBlock() {
      const auditItem = this.auditDetails.find(
        (item) => item.id === this.auditItemActived,
      );

      if (auditItem) {
        const auditSubItem = auditItem.sub_items.find(
          (item) => item.id === this.auditSubItemActived,
        );

        if (auditSubItem && auditSubItem.outlines) {
          this.updateHighlightBlocks(auditSubItem.outlines);
        }
      }
    },
    updateHighlightBlocks(outlines) {
      const blocks = [];

      Object.keys(outlines).forEach((page) => {
        outlines[page].forEach((outline) => {
          blocks.push({
            type: 'rect',
            page: Number(page),
            outline,
            needJump: true,
          });
        });
      });

      EventBus.$emit('update-file-viewer-blocks', blocks);
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.audit-details {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

.audit-details-header {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 20px;
  background: white;
  border-left: 1px solid #e9e9e9;

  .project-rating {
    margin-left: 20px;
    font-size: 14px;
  }
}

.audit-details-content {
  flex: 1;
  display: flex;
  flex-flow: column;
  row-gap: 10px;
  margin: 10px 0 10px 10px;
  padding-right: 10px;
  overflow: auto;
}

.audit-details-filter {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: white;

  .chapter-select {
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 5px;

    i {
      cursor: pointer;
    }
  }
}

.audit-details-list {
  .list-item {
    &:not(:first-of-type) {
      margin-top: 10px;
    }
  }

  .audit-item-title {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    width: 100%;
    font-weight: normal;

    > div {
      display: flex;
      flex-flow: row;
      align-items: center;
    }

    .square {
      display: inline-block;
      margin-right: 10px;
      width: 5px;
      height: 5px;
      background: #666666;
    }

    .tag {
      margin-left: 20px;
    }

    &.is-compliance {
      .square {
        background: #5094ee;
      }
    }

    &.no-compliance {
      .square {
        background: #f56c6c;
      }
    }
  }
}

.audit-item-content {
  padding: 8px 24px 0 24px;

  .content {
    margin: 0;
    padding: 4px 8px;
    width: 100%;
    background: #edf5ff;
    border-radius: 4px;
    font-size: 12px;
    color: #418bed;
  }

  .compliance-result {
    display: flex;
    flex-flow: column;

    .compliance-result-row {
      display: flex;
      flex-flow: row;
      padding: 8px;

      > div {
        display: flex;
        flex-flow: row;
        align-items: center;

        &:first-of-type {
          width: 240px;
        }
      }
    }

    .title {
      margin-right: 10px;
      color: #666666;
    }

    .result {
      color: #418bed;
      font-size: 14px;

      ::v-deep .el-radio__label {
        color: #418bed;
        font-weight: normal;
      }
    }

    .el-button {
      font-size: 14px;
    }

    .el-radio-group {
      .el-radio:first-of-type {
        margin-right: 10px;
      }
    }
  }

  .sub-list {
    list-style: none;

    .sub-list-item {
      &:not(:first-of-type) {
        margin-top: 10px;
      }
    }
  }

  .audit-sub-item {
    &.active {
      border-color: #418bed;
    }
  }
}
</style>
