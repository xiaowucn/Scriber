<template>
  <div
    v-if="filesOption.length > 0"
    class="side-agreement-bottom-viewer"
    v-loading="!fileInfoReady">
    <el-select
      class="file-select"
      v-model="fileId"
      size="mini"
      @change="handleChangeFile">
      <el-option
        v-for="item in filesOption"
        :key="item.id"
        :label="`${item.version} -- ${item.name}`"
        :value="item.id"></el-option>
    </el-select>
    <file-pdf-viewer-container
      v-if="fileInfoReady"
      :file-id="fileId"
      :file-info="fileInfo"
      :answer-item-map="answerItemMap"
      :readOnly="true"></file-pdf-viewer-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import { getFileInfo } from '@/store/api/detail.api';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { fetchMergedAnswerData } from '@/store/api/rule-audit.api';
import { pdfParseStatus } from '@/store/constants';

export default {
  name: 'SideAgreementComparePdf',
  components: {
    FilePdfViewerContainer,
  },
  props: {
    mainFileId: {
      type: Number,
      required: true,
    },
    treeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      fileId: null,
      qid: null,
      answerItemMap: {},
      fileInfo: {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      },
      fileInfoReady: false,
      filesOption: [],
      question: null,
    };
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    viewDisabled() {
      return (status) => {
        return status === pdfParseStatus.completed;
      };
    },
  },
  watch: {
    fileViewer: {
      handler() {
        const mainFile = this.fileViewer.files.find(
          (item) => item.id === this.mainFileId,
        );
        if (mainFile) {
          const mainFileVersion = mainFile.version;
          const versionStart = mainFileVersion.split('-')[0];
          const contractVersion = `${versionStart}-0`;
          this.filesOption = this.fileViewer.files.filter(
            (item) =>
              item.id !== this.mainFileId &&
              this.viewDisabled(item.pdf_parse_status),
          );
          this.filesOption.sort((a, b) => {
            if (a.version === contractVersion) {
              return -1;
            } else if (b.version === contractVersion) {
              return 1;
            } else {
              return 0;
            }
          });
          if (this.filesOption.length > 0) {
            const defaultFile = this.filesOption[0];
            this.fileId = defaultFile.id;
            this.handleChangeFile();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    handleChangeFile() {
      this.reset();
      const currentFile = this.filesOption.find(
        (item) => item.id === this.fileId,
      );
      this.qid = currentFile.questions[0].id;
      this.fetchFileInfo();
    },
    async fetchFileInfo() {
      try {
        const { data } = await getFileInfo(this.fileId);
        if (data.meta_info && data.meta_info.is_ocr_expired) {
          this.$notify({
            title: this.$t(`message['警告']`),
            message: data.meta_info.ocr_expired_msg,
            type: 'warning',
          });
        }
        const fileInfo = {
          ...this.$route.query,
          fileId: this.fileId,
          fileName: data.name,
        };

        const filePath = [
          { name: '总览', href: '#/citics-tg/projectList' },
        ].concat(
          data.crumbs &&
            data.crumbs.map((path) => ({
              name: path.name,
              href: `#/citics-tg/projectList/${
                this.$route.params.projectId || this.$route.query.projectId
              }/tree/${path.id}`,
            })),
        );

        fileInfo.filePath = filePath;

        const [pageInfo, outline] = await Promise.all([
          this.getFilePageInfo(),
          this.getFileOutline(),
        ]);

        fileInfo.pageInfo = pageInfo;
        fileInfo.outline = outline;

        this.fileInfo = fileInfo;
        this.fileInfoReady = true;
        this.initUserAnswer();
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async initUserAnswer() {
      try {
        const {
          data: { answer_data },
        } = await fetchMergedAnswerData({ fileId: this.fileId });

        let userAnswer = {
          items: answer_data,
        };

        if (userAnswer.items) {
          const allAnswerItems = userAnswer.items;
          this.answerItemMap = allAnswerItems.reduce((obj, item) => {
            obj[item.key] = item;
            return obj;
          }, {});
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getFilePageInfo() {
      const { data } = await fetchFilePageInfo(this.fileId);
      return data;
    },
    async getFileOutline() {
      const { data } = await fetchFileOutline(this.fileId);
      const outline = {
        items: data ? data.children : [],
      };
      const buildOutlines = function (data) {
        data.forEach((item) => {
          if (item.level === 3) {
            item.children = [];
          } else {
            buildOutlines(item.children);
          }
        });
      };
      buildOutlines(outline.items);

      return outline;
    },
    reset() {
      this.fileInfoReady = false;
      this.fileInfo = {
        fileName: '',
        fileId: '',
        filePath: [],
        pageInfo: [],
        outline: [],
      };
      this.answerItemMap = {};
    },
  },
};
</script>
<style lang="scss" scoped>
.side-agreement-bottom-viewer {
  height: 100%;
  position: relative;
  .file-select {
    position: absolute;
    top: 5px;
    left: 240px;
    width: 130px;
    z-index: 10;
  }
}
</style>
