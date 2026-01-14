<template>
  <div v-if="canViewProject" class="project-details" v-loading="isLoading">
    <div ref="pdfViewerContainer" class="pdf-viewer-container">
      <file-pdf-viewer
        v-if="fileInfoReady"
        ref="fileViewer"
        :defaultPageScale="-1"
        :fileId="fileId"
        :fileInfo="fileInfo"
        :answerItemMap="answerItemMap"></file-pdf-viewer>

      <div class="add-ons">
        <el-tooltip effect="dark" content="查看AI推荐" placement="top">
          <el-button type="text" size="mini" :loading="aiAnswerLoading">
            <img
              v-show="currentAnswerSchemaPath"
              :src="aiIconSrc"
              alt=""
              :class="['ai-icon', aiAnswerLoading ? 'disabled' : '']"
              @click="showPredictPosition" />
          </el-button>
        </el-tooltip>
      </div>

      <remark-predict-position
        v-if="this.predictPosition.result.length > 0"
        ref="predictPosition"
        :answerItemMap="answerItemMap"
        answerVersion=""
        :showGeneralPositionTitle="false"
        :showPrecisePosition="false"
        customTitle="位置推荐"></remark-predict-position>
    </div>

    <div
      v-if="answer"
      ref="answerResultsContainer"
      class="results"
      v-loading="loading">
      <div class="operate-btns">
        <span v-if="isPocSystem" class="answer-confirmed-count"
          >已核对：{{ answerCount.confirmed }}/{{ answerCount.total }}</span
        >
        <el-tooltip
          effect="dark"
          content="若数据已核对并保存，将导出核对后结果，未核对部分为原始提取结果"
          placement="top">
          <el-button
            size="mini"
            plain
            :loading="exportLoading"
            @click="exportExcelFile">
            导出Excel
          </el-button>
        </el-tooltip>
      </div>
      <el-tabs v-model="activeAnswerType">
        <el-tab-pane label="提取结果" name="json_ai"></el-tab-pane>
      </el-tabs>
      <div class="tabs-content">
        <el-tabs
          type="border-card"
          tab-position="bottom"
          class="tabs-bottom"
          v-model="currentTab"
          @tab-click="answerTabClicked">
          <data-sheet
            v-if="isPocSystem"
            :answer="answer"
            @save-editing-answer="saveEditingAnswer"
            @remove-answer-text="removeAnswerText"
            @answer-value-selected="answerValueSelected"
            @save-answer="saveAnswer"
            @add-answer-item-group="addAnswerItemGroup"
            @remove-answer-item-group="removeAnswerItemGroup"></data-sheet>
          <data-sheet-2
            v-if="isSharesSystem"
            :answer="answer"
            @save-editing-answer="saveEditingAnswer"
            @remove-answer-text="removeAnswerText"
            @answer-value-selected="answerValueSelected"
            @save-answer="saveAnswer"></data-sheet-2>
        </el-tabs>
      </div>
    </div>
  </div>
  <el-empty v-else description="您无权查看该项目"></el-empty>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import FilePdfViewer from '@/components/remark/FilePdfViewerContainer';
import RemarkPredictPosition from '@/components/remark/FileRemarkPredictPosition';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/ecitic.api';
import {
  fetchProjectDetails,
  saveProjectDetails,
} from '@/store/api/ecitic.api';
import EventBus from '@/components/remark/remark-tree/EventBus';
import answerTableMixin from '../mixins/answerTableMixin';
import AiIcon from '@/images/ai-icon.svg';
import DataSheet from '../components/DataSheet';
import DataSheet2 from '../components/DataSheet2';
import { ECITIC_ENV_SYSTEM } from '@/store/constants';

export default {
  name: 'project-details',
  mixins: [answerTableMixin],
  components: {
    FilePdfViewer,
    RemarkPredictPosition,
    DataSheet,
    DataSheet2,
  },
  props: {
    system: {
      type: String,
      default: ECITIC_ENV_SYSTEM.POC.name,
    },
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      canViewProject: true,
      isLoading: false,
      loading: false,
      projectName: '',
      fileInfo: {
        fileName: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      fileInfoReady: false,
      answerItemMap: {},
      activeAnswerType: 'json_ai',
      currentTab: '',
      currentAnswerKey: '',
      lastAnswerKey: '',
      currentAnswerKeyPath: '',
      currentAnswerSchemaPath: '',
      answer: null,
      answerStatus: {},
      originAnswer: null,
      originSchema: {},
      defaultSchemaPath: {},
      aiAnswerLoading: false,
      aiIconSrc: AiIcon,
      exportLoading: false,
      page: 0,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['predictPosition']),
    pdfViewer() {
      return this.$refs.fileViewer;
    },
    isPocSystem() {
      return this.system === ECITIC_ENV_SYSTEM.POC.name;
    },
    isSharesSystem() {
      return this.system === ECITIC_ENV_SYSTEM.SHARES.name;
    },
    answerCount() {
      if (this.answer) {
        let total = 0;
        let confirmed = 0;
        this.answer.forEach((answer) => {
          total++;
          const status = answer[0].fill_status;
          if (status === this.ANSWER_STATUS.CONFIRMED) {
            confirmed++;
          }
        });
        return {
          confirmed,
          total,
        };
      }
      return {
        confirmed: 0,
        total: 0,
      };
    },
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
    EventBus.$on('create-answer-item', this.handleCreateAnswerItem);
    EventBus.$on('page-change', this.handlePageChange);
  },
  beforeDestroy() {
    EventBus.$off('create-answer-item', this.handleCreateAnswerItem);
    EventBus.$on('page-change', this.handlePageChange);
    this.resetPredictPosition();
  },
  methods: {
    async init() {
      try {
        this.isLoading = true;
        const { projectName } = this.$route.query;
        this.projectName = projectName;
        await this.getAnswer();
        if (this.canViewProject) {
          await this.getFileInfo();
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    setAnswerTabs(tab) {
      this.currentTab = tab.name;
    },
    async getFileInfo() {
      const [pageInfo, outline] = await Promise.all([
        this.getFilePageInfo(),
        this.getFileOutline(),
      ]);
      if (pageInfo && pageInfo[0]) {
        this.fileThumbnailHeight =
          (160 * pageInfo[0].height) / pageInfo[0].width;
      }

      this.fileInfo = {
        ...this.fileInfo,
        pageInfo,
        outline,
        ...this.$route.query,
      };

      this.fileInfoReady = true;
    },
    async getFilePageInfo() {
      try {
        const filePageInfoRes = await fetchFilePageInfo(this.fileId);
        const pageInfo = filePageInfoRes.data;

        return pageInfo;
      } catch (error) {
        console.error(error);
        return [
          {
            page: 0,
            width: 595,
          },
        ];
      }
    },
    async getFileOutline() {
      try {
        const fileOutlineRes = await fetchFileOutline(this.fileId);
        const outline = {
          items: fileOutlineRes.data ? fileOutlineRes.data.children : [],
        };

        return outline;
      } catch (error) {
        console.error(error);
        return { items: [] };
      }
    },
    async getAnswer() {
      try {
        this.loading = true;
        const params = {
          answer_type: 'json',
          file_id: this.fileId,
        };
        if (this.isSharesSystem) {
          Object.assign(params, { page: this.page });
        }
        const res = await fetchProjectDetails(this.$route.params.id, params);
        this.canViewProject = true;
        this.answer = res.data;
        this.originAnswer = _.cloneDeep(this.answer);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
        if (error.status_code === 403) {
          this.canViewProject = false;
        }
      } finally {
        this.loading = false;
      }
    },
    async saveAnswer(answerIndex) {
      try {
        this.loading = true;
        const answerData = _.cloneDeep(this.answer);
        if (this.isPocSystem) {
          answerData[answerIndex][0].fill_status = this.ANSWER_STATUS.CONFIRMED;
        }
        if (this.isSharesSystem) {
          answerData.pages[this.page].fill_status =
            this.ANSWER_STATUS.CONFIRMED;
        }
        await saveProjectDetails(this.$route.params.id, { data: answerData });
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
        });
        await this.getAnswer();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    saveEditingAnswer({ editedAnswer, path }) {
      this.setAnswerItem(editedAnswer, path);
    },
    removeAnswerText({ path }) {
      let removedAnswer = this.getAnswerItem(path);
      removedAnswer = {
        ...removedAnswer,
        data: [],
        text: '',
      };
      this.setAnswerItem(removedAnswer, path);
      this.pdfViewer.resetWidgets();
    },
    answerValueSelected({ key, path }) {
      this.currentAnswerKey = key;
      this.currentAnswerKeyPath = path;
      const selectedAnswerItem = this.getAnswerItem(path);
      this.currentAnswerSchemaPath = selectedAnswerItem.schema_path;
      if (!selectedAnswerItem.text) {
        this.autoShowPredictPosition(key);
      } else {
        this.lastAnswerKey = key;
      }
      this.resetPredictPosition();
    },
    handleCreateAnswerItem(data) {
      const answer = {
        data: [{ boxes: data.boxes }],
        text: data.boxes.map((item) => item.text).join(''),
      };
      this.setAnswerItem(answer, this.currentAnswerKeyPath);
    },
    answerTabClicked(tab) {
      this.setAnswerTabs(tab);
      this.resetTabsData();
    },
    resetTabsData() {
      this.currentAnswerKey = '';
      this.lastAnswerKey = '';
      this.currentAnswerKeyPath = '';
      this.currentAnswerSchemaPath = '';
      this.resetPredictPosition();
      EventBus.$emit('remove-all-frames');
      EventBus.$emit('reset-node-selected');
    },
    async exportExcelFile() {
      const downloadExcel = () =>
        this.exportExcel(
          { qid: this.$route.params.id, file_id: this.fileId },
          this,
        );

      if (this.isPocSystem) {
        if (this.answerCount.confirmed < this.answerCount.total) {
          const confirm = await this.$confirm(
            '有数据尚未核对，请确认是否导出？',
            '提示',
            {
              confirmButtonText: '导出',
              cancelButtonText: '取消',
              customClass: 'szse-ipo-message-box',
            },
          ).catch(() => {});
          if (confirm === 'confirm') {
            downloadExcel();
          }
        } else {
          downloadExcel();
        }
      }
      if (this.isSharesSystem) {
        if (this.checkAnswerHasModified()) {
          await this.saveAnswer();
        }
        downloadExcel();
      }
    },
    goback() {
      this.$router.push({ name: 'pocProject' });
    },
    async showPredictPosition() {
      try {
        if (!this.currentAnswerSchemaPath) {
          return;
        }
        this.aiAnswerLoading = true;
        const qid = this.$route.params.id;
        const data = {
          key: this.currentAnswerSchemaPath,
          qid,
          label: this.currentAnswerKey,
        };
        await this.$store.dispatch('remarkModule/predictPosition', data);
        if (this.predictPosition.result.length === 0) {
          this.$notify({
            title: '提示',
            message: '暂无预测结果',
          });
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.aiAnswerLoading = false;
      }
    },
    resetPredictPosition() {
      this.$store.commit('remarkModule/SET_PREDICT_POSITION', []);
    },
    async autoShowPredictPosition(key) {
      await this.showPredictPosition();
      await this.$nextTick();
      if (this.lastAnswerKey === this.currentAnswerKey) {
        this.resetPredictPosition();
        return;
      }
      this.lastAnswerKey = key;
      if (this.$refs.predictPosition) {
        const firstPredictPositionDom =
          this.$refs.predictPosition.$el.querySelector('.position-item');
        if (firstPredictPositionDom) {
          firstPredictPositionDom.click();
        }
      }
    },
    addAnswerItemGroup({ path, newAnswerItem }) {
      const originAnswerItemGroup = this.getAnswerItem(path);
      originAnswerItemGroup[1].push(newAnswerItem);
    },
    removeAnswerItemGroup({ path }) {
      const originAnswerItemGroup = this.getAnswerItem(path);
      originAnswerItemGroup[1].pop();
    },
    handlePageChange: _.debounce(async function () {
      if (this.isSharesSystem) {
        if (this.checkAnswerHasModified() && !this.loading) {
          await this.saveAnswer();
        }
        this.resetTabsData();
        this.page = this.pdfViewer ? this.pdfViewer.pageNumber - 1 : 0;
        this.getAnswer();
      }
    }, 200),
    checkAnswerHasModified() {
      if (!this.answer.pages[this.page]) {
        return false;
      }
      return !_.isEqual(
        this.answer.pages[this.page],
        this.originAnswer.pages[this.page],
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../szse/styles/szse-ipo.common.scss';
@import '../../szse/styles/reset-pdf-viewer.scss';

.project-details {
  display: flex;
  height: 100vh;
  .header {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    .title {
      margin: 0 40px;
      color: #6a6a6a;
    }
    .el-tag {
      margin: 0 10px;
      background: #4e99f7;
      color: #fff;
    }
  }
  .pdf-viewer-container {
    position: relative;
    width: 50%;
    min-width: auto;
  }
  .file-pdf-viewer-container {
    ::v-deep .document-viewer-toolbar .toolbar-back {
      display: block;
    }
    ::v-deep .scale-operation {
      left: 100px;
      right: initial;
    }
  }
  .predicted-answer-wrapper {
    position: absolute;
    top: 50px;
    width: 305px;
    right: 15px;
    z-index: 999;
    ::v-deep .predicted-answer-name {
      .label {
        color: #4e99f7;
      }
    }
    ::v-deep .check-more {
      display: none;
    }
  }
  .add-ons {
    position: absolute;
    top: 5px;
    right: 15px;
    z-index: 999;
    .el-button {
      padding: 0;
      ::v-deep .el-icon-loading {
        position: absolute;
        top: 9px;
        left: 13px;
        z-index: 999;
      }
      .ai-icon {
        width: 28px;
        height: 28px;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
        &.disabled {
          opacity: 0.2;
        }
      }
    }
  }
  .results {
    position: relative;
    width: 50%;
    padding: 0 15px 50px 15px;
    box-sizing: border-box;
    ::v-deep .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
    .tabs-content {
      height: calc(100% - 4px);
      overflow-y: auto;
    }
    .operate-btns {
      position: absolute;
      top: 5px;
      right: 15px;
      display: flex;
      align-items: center;
      z-index: 1;
      .answer-confirmed-count {
        margin-right: 20px;
        font-size: 14px;
        color: #6b6b6b;
      }
      .adjust-height-icon {
        width: 20px;
        height: 20px;
        margin-left: 20px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .export-btn {
      margin-right: 20px;
      padding: 5px 15px;
      z-index: 2;
      border: 1px solid $primary-color;
      color: $primary-color;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 3px;
      &:hover {
        opacity: 0.8;
      }
    }
    .tabs-bottom {
      box-sizing: border-box;
      border: none;
      box-shadow: none;
    }
    ::v-deep .el-tabs__header {
      &.is-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
    ::v-deep .el-tabs__content {
      overflow: initial;
      padding: 0;
    }
  }
}
.el-empty {
  height: 100vh;
  padding-bottom: 10%;
}
</style>
