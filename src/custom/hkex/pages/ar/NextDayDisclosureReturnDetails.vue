<template>
  <el-container class="nddr-details">
    <el-aside width="60%">
      <h3 class="title">Next Day Disclosure Returns</h3>
      <div class="pdf-container">
        <div class="nav">
          <span class="date">{{ $route.query.date }}</span>
        </div>
        <pdf-viewer
          v-if="documentData"
          ref="pdfViewer"
          :document-data="documentData"
          :disable-viewer-toolbar="true"
          :annotation-disabled="true"
          @page-rendered="onPageRendered">
        </pdf-viewer>
      </div>
    </el-aside>
    <el-main width="40%" v-loading="loading">
      <h3 class="title">Detailed Information</h3>
      <div class="answer">
        <ul>
          <li v-for="(item, index) in answer.items" :key="index">
            <p class="label">{{ item.label }}</p>
            <div class="data">
              <p
                v-for="(d, idx) in item.data"
                :key="idx"
                :class="[
                  'text',
                  answerItemDataIndex === `${index}-${idx}` ? 'active' : '',
                ]"
                @click="clickAnswerItem(item, index, d, idx)">
                {{ d.text || d.boxes.map((box) => box.text).join('') }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import PdfViewer from '../../components/PdfViewer.vue';
import ReportReviewMixin from '../../mixins/ReportReview.mixin';
import { fetchSchema } from '@/store/api/schema.api';
import { fetchQuestion } from '@/store/api/remark.api';

export default {
  name: 'nddr-details',
  components: {
    PdfViewer,
  },
  mixins: [ReportReviewMixin],
  data() {
    return {
      fid: null,
      qid: null,
      mid: null,
      loading: false,
      documentData: null,
      answer: {
        items: [],
      },
      answerItemDataIndex: '',
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.setReportInfo(this.$route.query);
      this.getPdfFile();
      this.getAnswer();
    },
    setReportInfo(report) {
      this.fid = report.fid;
      this.qid = report.qid;
      this.mid = report.mid;
    },
    async getPdfFile() {
      try {
        this.documentData = null;
        const res = await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchPDFDocument',
          {
            url: `/plugins/fileapi/file/${this.fid}/pdf`,
          },
        );
        this.documentData = new Uint8Array(res.data);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getAnswer() {
      try {
        this.loading = true;
        const schemaRes = await fetchSchema(this.mid);
        const answerRes = await fetchQuestion(this.qid);
        const answerItems = answerRes.data.answer.userAnswer.items;
        this.answer.items = schemaRes.data.data.schemas[0].orders.map(
          (item) => {
            const data =
              answerItems.find((d) => d.schema.data.label === item)?.data || [];
            return {
              label:
                item === 'Aggregate price paid'
                  ? 'Aggregate price paid $'
                  : item,
              data: data,
            };
          },
        );
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    clickAnswerItem(item, index, data, dataIndex) {
      this.clearAnnotations();
      const boxesData = {
        boxes: data.boxes,
        tags: [item.label],
        type: 'wireframe',
      };
      this.jumpToAnswerData(boxesData);
      this.answerItemDataIndex = `${index}-${dataIndex}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';

.nddr-details {
  padding: 0;
  .title {
    padding: 15px 0;
    text-align: center;
    color: #555;
    font-size: 18px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-aside {
    overflow: initial;
    border-right: 2px solid $--color-primary;
    .pdf-container {
      height: calc(100% - 95px);
      .nav {
        display: flex;
        justify-content: center;
        padding: 8px 15px;
        border-bottom: 1px solid #ebeef5;
        .date {
          padding: 5px 15px;
          background-color: #1499a4;
          border-color: #1499a4;
          border-radius: 4px;
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
  .el-main {
    padding: 0;
    .answer {
      padding: 20px;
      ul {
        padding: 0;
        li {
          margin-bottom: 20px;
          list-style: none;
          .label {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
            color: #555;
          }
          .data {
            .text {
              margin: 5px 0;
              padding: 10px;
              border: 1px solid $--color-primary;
              border-radius: 4px;
              color: #888;
              cursor: pointer;
              &.active,
              &:hover {
                background-color: rgba($--color-primary, 0.1);
              }
            }
          }
        }
      }
    }
  }
}
</style>
