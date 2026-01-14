<template>
  <div class="diff-container" v-loading="loading">
    <div class="pdf-viewer-wrapper">
      <pdf-viewer
        ref="pdfViewer"
        @task-files-fetched="onTaskFilesFetched"></pdf-viewer>

      <div
        v-if="diffFile.show"
        ref="pdfViewerPopup"
        class="pdf-viewer-popup"
        v-drag>
        <div class="file-name">
          {{ diffFile.name }}
          <i class="el-icon-close" @click="diffFile.show = false"></i>
        </div>
        <pdf-viewer
          ref="pdfViewerDiff"
          :file-id="diffFile.id"
          @page-rendered="onPageRendered"></pdf-viewer>
      </div>
    </div>

    <diff-answer-aside
      diff-mode="task"
      :answers="diffList"
      :loading="loading"
      :files="files"
      :current-diff-item="currentDiffItem"
      :get-file-info="getFileInfo"
      @tab-clicked="onTabClicked"
      @view-diff="viewDiff"
      @view-sample="viewSample">
    </diff-answer-aside>
  </div>
</template>

<script>
import PdfViewer from '../components/PdfViewer.vue';
import DiffAnswerAside from '../components/DiffAnswerAside.vue';
import {
  fetchTaskCompareAnswer,
  fetchFileSamples,
} from '@/store/api/chinaamc_yx.api';
import { fetchQuestion } from '@/store/api/remark.api';

export default {
  name: 'task-diff',
  components: {
    PdfViewer,
    DiffAnswerAside,
  },
  data() {
    return {
      loading: false,
      files: [],
      diffFile: {
        show: false,
        id: null,
        name: '',
      },
      diffList: [
        {
          label: '一致性比对检查',
          subTabs: [
            {
              id: 1,
              name: '一致',
              class: 'green',
              equal: true,
              children: [],
            },
            {
              id: 2,
              name: '不一致',
              class: 'red',
              equal: false,
              children: [],
            },
          ],
        },
      ],
      currentDiffItem: {
        key: '',
      },
    };
  },
  directives: {
    drag: {
      inserted: (target) => {
        target.onmousedown = (e) => {
          const disX = e.clientX - target.offsetLeft;
          const disY = e.clientY - target.offsetTop;
          document.onmousemove = (e) => {
            target.style.left = e.clientX - disX + 'px';
            target.style.top = e.clientY - disY + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
          return false;
        };
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getTaskCompareAnswer();
    },
    async getTaskCompareAnswer() {
      try {
        this.loading = true;
        const res = await fetchTaskCompareAnswer(this.$route.params.taskId);
        const answers = res.data.consistency_answer;
        this.diffList.forEach(() => {
          this.diffList[0].subTabs.forEach((subTab) => {
            subTab.children = this.convertDiffResults(
              answers.filter((answer) => answer.equal === subTab.equal),
            );
          });
        });
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
    convertDiffResults(list) {
      return list.map((item) => {
        item.items = item.items.map((item) => {
          return {
            ...item,
            dataIndex: 0,
          };
        });
        return {
          ...item,
          pager: {
            page: 1,
            size: 6,
            total: item.items.length,
          },
        };
      });
    },
    onTabClicked() {
      this.reset();
    },
    handleCollapseChange(items) {
      items.forEach((item) => {
        item.pager.page = 1;
      });
    },
    changePage(page, obj) {
      obj.pager.page = page;
    },
    getFileInfo(fid) {
      return this.files.find((file) => file.id === fid) || {};
    },
    onPageRendered() {
      const pdfViewerContainer =
        this.$refs.pdfViewerDiff.$refs.pdfViewerContainer;
      const answerItem = this.convertAnswerItem(
        this.currentDiffItem,
        this.currentDiffItem.dataIndex,
      );
      pdfViewerContainer?.selectAnswerItem(answerItem);
    },
    convertAnswerItem(answer, dataIndex = 0) {
      return {
        index: 0,
        schemaNode: null,
        schema: { data: { label: answer.schema.data.label } },
        data: answer.data[dataIndex],
      };
    },
    onTaskFilesFetched(files) {
      this.files = files;
    },
    async viewDiff({ mainFile, item, dataIndex }) {
      this.currentDiffItem = item;
      const pdfViewerContainer = this.$refs.pdfViewer.$refs.pdfViewerContainer;
      const answerItem = this.convertAnswerItem(item, dataIndex);

      if (item.data.length === 0) {
        this.reset();
        return;
      }

      if (mainFile.fid === item.fid) {
        this.diffFile.show = false;
        pdfViewerContainer.selectAnswerItem(answerItem);
        return;
      }

      if (this.diffFile.id !== item.fid) {
        this.diffFile.show = false;
      }
      await this.$nextTick();
      this.diffFile.id = item.fid;
      this.diffFile.name = this.getFileInfo(item.fid)?.name;
      this.diffFile.show = true;

      await this.$nextTick();
      const pdfViewerDiffContainer =
        this.$refs.pdfViewerDiff.$refs.pdfViewerContainer;
      pdfViewerDiffContainer?.selectAnswerItem(answerItem);
    },
    async viewSample({ item }) {
      try {
        const res = await fetchFileSamples();
        const schema = JSON.parse(item.key)[0].split(':')[0];
        const { fid, qid } = res.data[schema];

        if (this.diffFile.id !== fid) {
          this.diffFile.show = false;
          await this.$nextTick();
        }

        this.diffFile.id = fid;
        this.diffFile.name = `${
          this.getFileInfo(item.fid).file_type
        } - 范文文档`;
        this.diffFile.show = true;
        await this.$nextTick();
        this.$refs.pdfViewerPopup.classList.add('view-sample-popup');

        const { data } = await fetchQuestion(qid);
        const answerItem = data.answer.userAnswer.items.find(
          (i) => i.key === item.key,
        );
        if (answerItem) {
          this.currentDiffItem = answerItem;
          this.$refs.pdfViewerDiff.$refs.pdfViewerContainer?.selectAnswerItem(
            this.convertAnswerItem(answerItem),
          );
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    reset() {
      this.currentDiffItem = { key: '' };
      this.diffFile.show = false;
      const pdfViewerContainer = this.$refs.pdfViewer.$refs.pdfViewerContainer;
      pdfViewerContainer?.resetWidgets();
    },
  },
};
</script>

<style lang="scss" scoped>
.diff-container {
  display: flex;
  height: 100vh;
  .pdf-viewer-wrapper {
    position: relative;
    flex: 3;
    ::v-deep .document-viewer-toolbar {
      .toolbar-fileinfo {
        display: none;
      }
    }
    .pdf-viewer-popup {
      position: absolute;
      bottom: 30px;
      left: 20px;
      width: calc(100% - 40px);
      height: 50%;
      z-index: 2000;
      box-shadow: 0px 0px 10px #7a7a7a;
      &.view-sample-popup {
        ::v-deep .pdf-document-viewer {
          background-color: #dfeddc;
        }
      }
      .file-name {
        position: absolute;
        top: 0;
        z-index: 1;
        left: 100px;
        width: calc(100% - 140px);
        padding: 10px 20px;
        text-align: center;
        color: #0090c0;
        font-size: 14px;
        border-bottom: 1px solid #ececec;
        background-color: #fff;
        cursor: move;
        .el-icon-close {
          float: right;
          margin-top: 2px;
          cursor: pointer;
          font-size: 16px;
          &:hover {
            background-color: #ff4949;
            color: #fff;
          }
        }
      }
      ::v-deep .document-viewer-toolbar {
        .left {
          > button:not(.toolbar-chapter),
          > span {
            display: none;
          }
        }
        .middle,
        .right {
          display: none;
        }
      }
      ::v-deep .draw-widget-switch {
        display: none;
      }
    }
  }
  .diff-aside {
    ::v-deep > .el-tabs {
      > .el-tabs__header {
        display: none;
      }
    }
  }
}
</style>
