<template>
  <div class="file-details" v-loading="isLoading">
    <div class="header">
      <el-button type="text" icon="el-icon-back" @click="goback">
        返回
      </el-button>
      <h4 class="title">{{ this.projectName }}</h4>
    </div>

    <div
      ref="pdfViewerContainer"
      class="pdf-viewer-container"
      :style="`height: calc(100vh - ${resultsAreaHeight + 58}px)`">
      <file-pdf-viewer
        v-if="fileInfoReady"
        ref="fileViewer"
        :fileId="fileId"
        :fileInfo="fileInfo"
        :answerItemMap="answerItemMap"></file-pdf-viewer>
    </div>

    <remark-predict-position
      v-if="this.predictPosition.result.length > 0"
      ref="predictPosition"
      :answerItemMap="answerItemMap"
      answerVersion=""
      :showGeneralPositionTitle="false"
      :showPrecisePosition="false"
      customTitle="位置推荐">
    </remark-predict-position>

    <div class="divider" ref="divider" title="按住可拖拽" v-drag></div>

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

    <div
      ref="answerResultsContainer"
      class="results"
      :style="`height: ${resultsAreaHeight}px`">
      <div class="operate-btns">
        <span class="answer-confirmed-count"
          >已核对：{{ answerCount.confirmed }}/{{ answerCount.total }}</span
        >
        <el-tooltip
          effect="dark"
          content="若数据已核对并保存，将导出核对后结果，未核对部分为原始提取结果"
          placement="top">
          <el-button size="mini" plain @click="exportExcel"
            >导出Excel</el-button
          >
        </el-tooltip>
        <!-- <el-tooltip
          effect="dark"
          content="提交填报时，请确认各组数据正确并保存"
          placement="top"
        >
          <div>
            <el-button
              type="primary"
              size="mini"
              class="submit-btn"
              :disabled="answerCount.confirmed < answerCount.total"
              @click="submitAnswer"
              >提交填报</el-button
            >
          </div>
        </el-tooltip> -->
        <el-tooltip
          v-for="(item, index) in panelHeightScaleOptions"
          :key="index"
          v-show="item.show"
          effect="dark"
          :content="item.title"
          placement="top">
          <img
            :src="item.icon"
            alt=""
            class="adjust-height-icon"
            @click="setPanelHeightScale(item.scale, item.offset)" />
        </el-tooltip>
      </div>
      <div @click="answerResultsHeaderClicked">
        <el-tabs v-model="activeAnswerType">
          <el-tab-pane label="提取结果" name="json_ai"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="tabs-content">
        <component
          :is="sheetComponent"
          :origin-answer="answer"
          :origin-schema="originSchema"
          :answer-status="answerStatus"
          :current-tab="currentTab"
          :current-answer-key-path="currentAnswerKeyPath"
          @answer-item-selected="answerItemSelected"
          @answer-key-selected="answerKeySelected"
          @edit-answer-text="editAnswerText"
          @save-editing-answer="saveEditingAnswer"
          @clear-answer-text="clearAnswerText"
          @add-answer-item-group="addAnswerItemGroup"
          @remove-answer-item-group="removeAnswerItemGroup"></component>
        <el-tabs
          type="border-card"
          tab-position="bottom"
          class="tabs-bottom"
          v-model="currentTab"
          @tab-click="answerTabClicked">
          <el-tab-pane
            v-for="(item, index) in answerTabs"
            :key="index"
            :label="item.name"
            :name="item.name"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import FilePdfViewer from '@/components/remark/FilePdfViewerContainer';
import RemarkPredictPosition from '@/components/remark/FileRemarkPredictPosition';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { fetchAnswer, submitAnswer } from '@/store/api/szse.api';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { baseURL } from '@/store/api/http';
import answerTableMixin from '../mixins/answerTableMixin';
import PanelMinimizeIcon from '../assets/minimize.svg';
import PanelCenterIcon from '../assets/center.svg';
import PanelMaximizeIcon from '../assets/maximize.svg';
import AiIcon from '@/images/ai-icon.svg';

import BasicFinancialData from '../components/IPOFileDetailsSheet/BasicFinancialData';
import BasicProjectData from '../components/IPOFileDetailsSheet/BasicProjectData';
import ContactDetails from '../components/IPOFileDetailsSheet/ContactDetails';
import IssuerDetails from '../components/IPOFileDetailsSheet/IssuerDetails';
import ProductDetails from '../components/IPOFileDetailsSheet/ProductDetails';

export default {
  name: 'file-details',
  mixins: [answerTableMixin],
  components: {
    FilePdfViewer,
    RemarkPredictPosition,
    BasicFinancialData,
    BasicProjectData,
    ContactDetails,
    IssuerDetails,
    ProductDetails,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  directives: {
    drag(el, bindings, vnode) {
      el.onmousedown = () => {
        const winHeight = document.documentElement.clientHeight;
        const HeaderHeight = 90,
          FooterHeight = 100,
          DividerHeight = 4;
        document.onmousemove = (e) => {
          if (e.pageY <= HeaderHeight || e.pageY > winHeight - FooterHeight) {
            return;
          }
          vnode.context.resultsAreaHeight =
            winHeight - e.clientY - DividerHeight;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
        };
      };
    },
  },
  watch: {
    '$route.query.fillInStatus'(val) {
      this.fillInStatus = Number(val);
    },
  },
  data() {
    return {
      isLoading: false,
      projectName: '',
      fileStatus: '',
      fillInStatus: '',
      fileInfo: {
        fileName: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      fileInfoReady: false,
      fileThumbnailVisible: false,
      answerItemMap: {},
      resultsAreaHeight: 400,
      activeAnswerType: 'json_ai',
      answerTabs: [],
      currentTab: '',
      sheetComponent: '',
      currentAnswerKey: '',
      lastAnswerKey: '',
      currentAnswerKeyPath: '',
      currentAnswerSchemaPath: '',
      answer: {},
      answerStatus: {},
      originAnswer: {},
      originSchema: {},
      defaultSchemaPath: {},
      aiAnswerLoading: false,
      aiIconSrc: AiIcon,
      panelHeightScale: 0.5,
      MIN: {
        SCALE: 0,
        OFFSET: 80,
      },
      CENTER: {
        SCALE: 0.5,
        OFFSET: 0,
      },
      MAX: {
        SCALE: 1,
        OFFSET: -95,
      },
      exportExcelUrl: `${baseURL}/plugins/szse/json_answer/${this.$route.query.questionId}?export_excel=1`,
      BASIC_FINANCIAL_DAtA: '财务基础数据',
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['predictPosition']),
    answerCount() {
      const answerStatus = this.answerStatus;
      if (answerStatus) {
        let total = 0;
        let confirmed = 0;
        for (const key in answerStatus) {
          if (key !== this.BASIC_FINANCIAL_DAtA) {
            continue;
          }
          for (const subKey in answerStatus[key]) {
            const status = answerStatus[key][subKey];
            total++;
            if (status === this.ANSWER_STATUS.CONFIRMED) {
              confirmed++;
            }
          }
        }
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
    panelHeightScaleOptions() {
      return [
        {
          icon: PanelMinimizeIcon,
          title: '缩小面板',
          scale: this.MIN.SCALE,
          offset: this.MIN.OFFSET,
          show: [this.CENTER.SCALE, this.MAX.SCALE].includes(
            this.panelHeightScale,
          ),
        },
        {
          icon: PanelCenterIcon,
          title: '居中面板',
          scale: this.CENTER.SCALE,
          offset: this.CENTER.OFFSET,
          show: [this.MIN.SCALE, this.MAX.SCALE].includes(
            this.panelHeightScale,
          ),
        },
        {
          icon: PanelMaximizeIcon,
          title: '放大面板',
          scale: this.MAX.SCALE,
          offset: this.MAX.OFFSET,
          show: [this.MIN.SCALE, this.CENTER.SCALE].includes(
            this.panelHeightScale,
          ),
        },
      ];
    },
  },
  created() {
    this.init();
    EventBus.$on('create-answer-item', this.handleCreateAnswerItem);
  },
  beforeDestroy() {
    EventBus.$off('create-answer-item', this.handleCreateAnswerItem);
    this.$refs.pdfViewerContainer.removeEventListener(
      'dblclick',
      this.fileViewerDbClickedHandler,
    );
    this.resetPredictPosition();
  },
  mounted() {
    this.$refs.pdfViewerContainer.addEventListener(
      'dblclick',
      this.fileViewerDbClickedHandler,
    );
  },
  methods: {
    async init() {
      try {
        const { projectName, fileStatus, fillInStatus } = this.$route.query;
        this.projectName = projectName;
        this.fileStatus = Number(fileStatus);
        this.fillInStatus = Number(fillInStatus);
        await this.getFileInfo();
        await this.getAnswer();
        this.answerTabs = [
          {
            index: 0,
            name: this.BASIC_FINANCIAL_DAtA,
            sheetCompontent: 'BasicFinancialData',
          },
        ];
        this.setAnswerTabs(this.answerTabs[0]);
        this.resetPanelHeight();
      } catch (error) {
        console.error(error);
      }
    },
    getAnswerTabs() {
      if (this.originSchema && this.originSchema.schemas) {
        const sheetCompontents = [
          'BasicProjectData',
          'ContactDetails',
          'BasicFinancialData',
          'ProductDetails',
          'IssuerDetails',
        ];
        const orders = this.originSchema.schemas[0].orders;
        return orders.map((order, orderIndex) => {
          return {
            index: orderIndex,
            name: order,
            sheetCompontent: sheetCompontents[orderIndex],
          };
        });
      }
      return [];
    },
    setAnswerTabs(tab) {
      this.currentTab = tab.name;
      this.sheetComponent = this.answerTabs[tab.index].sheetCompontent;
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
        this.isLoading = true;
        const res = await fetchAnswer(
          this.$route.query.questionId,
          this.activeAnswerType,
        );
        this.answer = _.cloneDeep(res.data.json_answer);
        this.answerStatus = _.cloneDeep(res.data.answer_status);
        this.originAnswer = _.cloneDeep(res.data.json_answer);
        this.originSchema = _.cloneDeep(res.data.json_schema);
        this.defaultSchemaPath = res.data.default_schema_path;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    answerKeySelected({ key, path }) {
      this.currentAnswerKeyPath = path;
      this.currentAnswerSchemaPath = this.getAnswerSchemaPath(path);
      EventBus.$emit('schema-node-selected', {
        model: {
          data: {
            label: key,
          },
          meta: {
            _deepIndex: [0],
            _deepLabels: [key],
          },
          children: [],
        },
      });
    },
    answerItemSelected({ key, answerItem, path, name }) {
      this.currentAnswerKey = key;
      if (path && name) {
        this.currentAnswerKeyPath = path;
        this.currentAnswerSchemaPath = this.getAnswerSchemaPath(path);
      }
      const boxesData = {
        boxes: answerItem.data ? answerItem.data[0].boxes : [],
        manual: answerItem.manual,
        text: answerItem.text,
      };
      EventBus.$emit('answer-item-selected', {
        schemaNode: key,
        schema: {
          data: {
            label: key,
          },
        },
        data: boxesData,
      });
      if (!key.startsWith('项目') && !answerItem.data) {
        this.autoShowPredictPosition(key);
      } else {
        this.lastAnswerKey = key;
      }
      this.resetPredictPosition();
    },
    getAnswerItem(path) {
      return _.get(this.answer, path, {});
    },
    setAnswerItem(answer) {
      const newAnswer = _.cloneDeep(this.answer);
      _.set(newAnswer, this.currentAnswerKeyPath, {
        ...answer,
        manual: true,
      });
      this.answer = newAnswer;
    },
    getAnswerSchemaPath(path) {
      const currentAnswer = this.getAnswerItem(path);
      let schemaPath = '';
      if (currentAnswer) {
        schemaPath = currentAnswer.schema_path;
      }
      if (!schemaPath) {
        const keyPath = path.replace(/\[\d+\]/g, '');
        schemaPath = _.get(this.defaultSchemaPath, keyPath, '');
      }
      return schemaPath;
    },
    handleCreateAnswerItem(data) {
      const answer = {
        data: [{ boxes: data.boxes }],
        text: data.boxes.map((item) => item.text).join(''),
      };
      this.setAnswerItem(answer);

      if (!this.currentAnswerKey.startsWith('项目') && !answer.data) {
        this.autoShowPredictPosition(this.currentAnswerKey);
      } else {
        this.lastAnswerKey = this.currentAnswerKey;
      }
      this.resetPredictPosition();

      if (this.panelHeightScale === 0) {
        this.panelHeightScale = 0.5;
        this.resetPanelHeight();
      }
    },
    clearAnswerText({ path }) {
      _.set(this.answer, path, {});
      this.$refs.fileViewer.resetWidgets();
    },
    editAnswerText({ path }) {
      this.currentAnswerKeyPath = path;
    },
    saveEditingAnswer({ editedAnswer }) {
      this.setAnswerItem(editedAnswer);
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
    async submitAnswer() {
      const confirm = await this.$confirm('确定要提交吗？', '提示').catch(
        () => {},
      );
      if (confirm === 'confirm') {
        try {
          await submitAnswer(this.$route.query.questionId, {
            data: {
              json_answer: this.answer,
              json_schema: this.originSchema,
              answer_status: this.answerStatus,
            },
          });
          this.$notify({
            title: '成功',
            message: '答案提交成功',
            type: 'success',
          });
          this.$router.replace({
            name: 'fileDetails',
            params: this.$route.params,
            query: Object.assign({}, this.$route.query, { fillInStatus: 2 }),
          });
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async exportExcel() {
      const downExcel = () => {
        const link = document.createElement('a');
        link.href = this.exportExcelUrl;
        link.click();
      };
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
          downExcel();
        }
      } else {
        downExcel();
      }
    },
    goback() {
      this.$router.push({ name: 'ipoProject' });
    },
    setPanelHeightScale(scale, offset) {
      this.panelHeightScale = scale;
      this.resetPanelHeight(offset);
    },
    resetPanelHeight(offset = 0) {
      const windowHeight = document.body.clientHeight;
      this.resultsAreaHeight = windowHeight * this.panelHeightScale + offset;
    },
    async showPredictPosition() {
      try {
        if (!this.currentAnswerSchemaPath) {
          return;
        }
        this.aiAnswerLoading = true;
        const { questionId: qid } = this.$route.query;
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
      this.setPanelHeightScale(this.MIN.SCALE, this.MIN.OFFSET);
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
    fileViewerDbClickedHandler() {
      this.setPanelHeightScale(this.MIN.SCALE, this.MIN.OFFSET);
    },
    answerResultsHeaderClicked() {
      if (this.panelHeightScale === 0) {
        this.panelHeightScale = 0.5;
        this.resetPanelHeight();
      }
    },
    addAnswerItemGroup({ path, newAnswerItem }) {
      const originAnswerItemGroup = _.get(this.answer, path);
      originAnswerItemGroup.push(newAnswerItem);
    },
    removeAnswerItemGroup({ path }) {
      const originAnswerItemGroup = _.get(this.answer, path);
      originAnswerItemGroup.pop();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/szse-ipo.common.scss';
@import '../styles/reset-pdf-viewer.scss';
.file-details {
  height: 100vh;
  overflow: hidden;
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
    transition: all 0.5s;
    ::v-deep .scale-operation {
      right: 200px !important;
    }
  }
  .predicted-answer-wrapper {
    position: absolute;
    top: 100px;
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
  .divider {
    width: 100%;
    height: 1px;
    padding: 1px 0;
    border-top: 1px solid #ccc;
    &:hover {
      cursor: ns-resize;
      border-color: #409eff;
    }
  }
  .add-ons {
    position: absolute;
    top: 55px;
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
    height: 300px;
    padding: 0 15px 50px 15px;
    box-sizing: border-box;
    transition: all 0.5s;
    ::v-deep .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
    .tabs-content {
      height: 100%;
      overflow-y: auto;
      padding-bottom: 40px;
      box-sizing: border-box;
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
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      border: none;
      box-shadow: none;
      z-index: 1;
      ::v-deep .el-tabs__content {
        display: none;
      }
    }
  }
}
</style>

<style lang="scss">
.cell-formula-popper {
  .formula {
    display: flex;
    align-items: center;
    .item {
      display: flex;
      flex-flow: column;
      margin: 0 5px;
      text-align: center;
      line-height: 24px;
      .value {
        font-size: 12px;
        &.active {
          color: #409eff;
        }
      }
    }
  }
}
</style>
