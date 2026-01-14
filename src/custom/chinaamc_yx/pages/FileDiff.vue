<template>
  <div class="diff-container">
    <div class="pdf-viewer-wrapper">
      <pdf-viewer
        ref="pdfViewer"
        :file-id="fileId"
        @task-files-fetched="onTaskFilesFetched">
      </pdf-viewer>
    </div>

    <diff-answer-aside
      diff-mode="file"
      :answers="diffList"
      :loading="loading"
      :files="files"
      :current-diff-item="currentDiffItem"
      @tab-clicked="onTabClicked"
      @view-diff="viewDiff">
    </diff-answer-aside>
  </div>
</template>

<script>
import PdfViewer from '../components/PdfViewer.vue';
import DiffAnswerAside from '../components/DiffAnswerAside.vue';
import { fetchFileCompareAnswer } from '@/store/api/chinaamc_yx.api';

export default {
  name: 'file-diff',
  components: {
    PdfViewer,
    DiffAnswerAside,
  },
  data() {
    return {
      loading: false,
      diffList: [
        {
          label: '提取检查',
          subTabs: [
            {
              id: 1,
              name: '',
              class: '',
              children: [],
            },
          ],
        },
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
      files: [],
      currentDiffItem: {
        key: '',
      },
    };
  },
  computed: {
    taskId() {
      return Number(this.$route.params.taskId);
    },
    fileId() {
      return Number(this.$route.params.fileId);
    },
    pdfViewerContainer() {
      return this.$refs.pdfViewer.$refs.pdfViewerContainer;
    },
    currentPageItems() {
      return (item) => {
        const { page, size } = item.pager;
        const start = (page - 1) * size;
        const end = page * size;
        return item.items.filter((m) => m.data.length).slice(start, end);
      };
    },
    currentPageEmptys() {
      return (item) => {
        return item.items.filter((m) => m.data.length === 0);
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getFileCompareAnswer();
    },
    async getFileCompareAnswer() {
      try {
        this.loading = true;
        const res = await fetchFileCompareAnswer(this.taskId, this.fileId);
        const answers = res.data.answer;
        this.diffList.forEach(() => {
          this.diffList[0].subTabs[0].children = this.convertDiffResults(
            answers.filter((answer) => answer.items.length === 1),
          );
          this.diffList[1].subTabs.forEach((subTab) => {
            subTab.children = this.convertDiffResults(
              answers.filter(
                (answer) =>
                  answer.items.length > 1 && answer.equal === subTab.equal,
              ),
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
    changePage(page, obj) {
      obj.pager.page = page;
    },
    onTabClicked() {
      this.reset();
    },
    handleCollapseChange(items) {
      items.forEach((item) => {
        item.pager.page = 1;
      });
    },
    viewDiff({ item, dataIndex = 0 }) {
      if (item.data.length === 0) {
        this.reset();
        return;
      }

      this.currentDiffItem.key = item.key;
      const answerItemOptions = {
        index: 0,
        schemaNode: null,
        schema: { data: { label: item.schema.data.label } },
        data: item.data[dataIndex],
        detail: [],
      };
      this.pdfViewerContainer.selectAnswerItem(answerItemOptions);
    },
    onTaskFilesFetched(files) {
      this.files = files;
    },
    reset() {
      this.currentDiffItem = { key: '' };
      this.pdfViewerContainer?.resetWidgets();
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
  }
}
</style>
