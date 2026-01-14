<template>
  <div class="file-remark-diff-wrapper">
    <div class="file-remark-container" v-loading="diffAnswerTreeLoading">
      <div class="file-viewer">
        <file-pdf-viewer-container
          v-if="viewerReady"
          ref="fileViewerRemarkDiff"
          :fileId="fileId"
          :answerItemMap="answerItemMap"
          :fileInfo="fileInfo"
          :is-diff-mode="true"></file-pdf-viewer-container>
      </div>
      <div class="remark-answer-panel">
        <answer-source-select v-if="fileId" :file-id="fileId" />
        <div class="file-remark-aside read-only-remark-aside">
          <file-remark-answer
            v-if="Object.keys(this.currentSchema).length > 0"
            :schema="currentSchema"
            :schemaId="schemaId"
            :answerItemMap="answerItemMap"
            :mergedTreeData="diffMergedTreeData"
            :showDiffMarks="false"
            ref="remarkAnswer">
          </file-remark-answer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import FileRemarkAnswer from '@/components/remark/FileRemarkAnswer';
import { getFileInfo } from '@/store/api/detail.api';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';
import {
  fetchCompareDataById,
  compareQuestion,
} from '@/store/api/citics-tg.api';
import AnswerSourceSelect from './AnswerSourceSelect.vue';
import { EventBus } from '@/utils';

export default {
  name: 'file-remark-diff',
  components: {
    FilePdfViewerContainer,
    FileRemarkAnswer,
    AnswerSourceSelect,
  },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    schemaId: {
      type: Number,
      required: true,
    },
    compareRecordId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      diffAnswerTreeLoading: false,
      answerItemMap: {},
      answerVersion: '',
      fileInfo: {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      fileId: null,
      viewerReady: false,
      extractCompareResults: null,
      ganYiCompareResults: null,
      qid: null,
      std_qid: null,
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'originSchema',
      'currentSchema',
      'answer',
      'diffAnswer',
      'diffMergedTreeData',
    ]),
    ...mapGetters('detailModule', ['fileViewer']),
  },
  watch: {
    currentSchema: {
      handler() {
        if (Object.keys(this.currentSchema).length > 0) {
          this.init();
        }
      },
    },
    diffAnswer: {
      handler() {
        this.initAnswerMap();
      },
      deep: true,
    },
  },
  mounted() {
    EventBus.$on('handle-update-answer-type', this.handleChangeDiffResult);
  },
  async beforeDestroy() {
    this.$store.commit('remarkModule/SET_REMARK_DIFF_OPEN_STATUS', false);
    EventBus.$off('handle-update-answer-type', this.handleChangeDiffResult);
  },
  methods: {
    async init() {
      this.reset();
      try {
        this.$store.commit('remarkModule/SET_REMARK_DIFF_OPEN_STATUS', true);
        this.diffAnswerTreeLoading = true;
        await RemarkTreeLoading.start();
        await this.fetchQuestion(this.compareRecordId);
        await this.getFileInfo();
        await this.initAnswerMap();
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.viewerReady = true;
        this.diffAnswerTreeLoading = false;
        RemarkTreeLoading.close();
        this.$store.commit('remarkModule/SET_ERROR_TIPS', []);
      }
    },
    async getFileInfo() {
      const [{ filePath, name }, pageInfo, outline] = await Promise.all([
        this.getFilePath(),
        this.getFilePageInfo(),
        this.getFileOutline(),
      ]);

      this.fileInfo = {
        ...this.$route.query,
        fileId: this.fileId,
        fileName: name,
        filePath,
        pageInfo,
        outline,
      };
    },
    async getFilePath() {
      try {
        const { data } = await getFileInfo(this.fileId);
        if (data.meta_info && data.meta_info.is_ocr_expired) {
          this.$notify({
            title: this.$t(`message['警告']`),
            message: data.meta_info.ocr_expired_msg,
            type: 'warning',
          });
        }
        const filePath = [
          { name: '总览', href: '#/citics-tg/projectList' },
        ].concat(
          data.crumbs &&
            data.crumbs.map((path) => ({
              name: path.name,
              href: `#/citics-tg/projectList/${this.projectId}/tree/${path.id}`,
            })),
        );

        return { filePath, name: data.name };
      } catch (error) {
        console.error(error);
        return [];
      }
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
    async fetchQuestion(compareRecordId) {
      const res = await fetchCompareDataById(compareRecordId);
      const results = res.data.items;
      const { std_fid, qid, std_qid } = results[0];
      this.fileId = std_fid;
      this.qid = qid;
      this.std_qid = std_qid;
      results.forEach((item) => {
        if (item.external_source) {
          this.ganYiCompareResults = item;
        } else {
          this.extractCompareResults = item;
        }
      });
      this.setDiffData(this.extractCompareResults);
    },

    handleChangeDiffResult(value) {
      if (value === 1) {
        this.setDiffData(this.extractCompareResults);
      } else {
        this.setDiffData(this.ganYiCompareResults);
      }
    },

    async setDiffData(data) {
      const { answer, std_answer } = data;
      const diffAnswer = this.initAnswerMapData(answer);
      const standardAnswer = this.initAnswerMapData(std_answer);
      this.$store.commit('remarkModule/SET_DIFF_ANSWER', {
        items: standardAnswer,
      });
      this.$store.commit('remarkModule/SET_CUSTOM_FIELD_ANSWER', {
        items: diffAnswer.filter((item) => item.custom),
      });
      this.$store.commit('remarkModule/SET_DIFF_CUSTOM_FIELD_ANSWER', {
        items: standardAnswer.filter((item) => item.custom),
      });
      this.$store.commit('remarkModule/SET_USER_ANSWER', {
        items: diffAnswer,
      });
      await this.initAnswerMap();
    },
    initAnswerMapData(questionInfo) {
      let answer = {
        items: [],
        version: '2.2',
      };
      let customFieldAnswer = {
        version: '2.2',
        items: [],
      };
      if (questionInfo && questionInfo.custom_field) {
        customFieldAnswer = questionInfo.custom_field;
      }

      if (questionInfo) {
        answer = questionInfo.userAnswer;
      }

      let userAnswer = cloneDeep(answer);
      userAnswer.items = userAnswer.items.filter((item) => item !== null);

      userAnswer.items.forEach((item) => {
        if (typeof item.manual === 'undefined') {
          item.manual = false;
        }
      });

      if (userAnswer.items) {
        const allAnswerItems = userAnswer.items.concat(customFieldAnswer.items);
        return allAnswerItems;
      }
      return {};
    },
    reset() {
      this.viewerReady = false;
      this.fileInfo = {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      };
    },
    async initAnswerMap() {
      await this.$store.dispatch('remarkModule/initAnswerTree');
      await this.$store.dispatch('remarkModule/initAnswerTree', true);
      this.answerItemMap = this.diffAnswer.items.reduce((obj, item) => {
        obj[item.key] = item;
        return obj;
      }, {});
    },
    async reloadDiffAnswer() {
      try {
        this.diffAnswerTreeLoading = true;
        const res = await compareQuestion(this.qid, {
          standard_qid: this.std_qid,
        });
        const compareRecordId = res.data.id;
        const { name, params, query } = this.$route;
        const newQuerys = { ...query, compareRecordId };
        this.$router.replace({
          name,
          params,
          query: newQuerys,
        });
        await this.fetchQuestion(compareRecordId);
        await this.initAnswerMap();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.diffAnswerTreeLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-remark-diff-wrapper {
  display: flex;
  flex-flow: column;
  height: 40vh;
  border-top: 1px solid #eaedf3;
  ::v-deep .file-remark-aside {
    padding-top: 10px;
    border-left: 1px solid #eaedf3;
    .remark-tree-list {
      .answer-item {
        pointer-events: none;
        .user-answer-wrapper {
          pointer-events: auto;
        }
        .icon-placeholder {
          pointer-events: auto;
        }
      }
    }
  }
  .file-remark-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .file-viewer {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
  .remark-answer-panel {
    width: 40%;
    display: flex;
    flex-direction: column;
    ::v-deep .answer-source-select {
      margin-left: 10px;
      margin-top: 10px;
    }
  }
  .file-remark-aside {
    padding-bottom: 10px;
    overflow: hidden;
    flex: 1;
    ::v-deep .v-modal {
      z-index: 10000 !important;
    }
    &.read-only-remark-aside {
      ::v-deep .user-answer-wrapper {
        border-color: $--color-primary-border !important;
        &.is-add {
          border-color: rgb(212, 212, 2) !important;
        }
      }
      ::v-deep .remark-tree-list {
        .first-node .second-node.add-answer {
          .answer-name {
            color: rgb(212, 212, 2) !important;
          }
        }
        .answer-item.add-answer .node-sticky {
          .answer-name {
            color: rgb(212, 212, 2) !important;
          }
        }
      }
    }
  }
}
</style>
