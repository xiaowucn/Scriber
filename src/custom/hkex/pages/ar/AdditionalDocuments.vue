<template>
  <div class="detail-wapper" v-if="ruleDocData">
    <div v-if="ruleDocData.result.items.length > 0" class="document-container">
      <el-container class="rule-detail-container">
        <el-aside width="55%" class="rule-aside" v-if="isNotPdfFile">
          <h2 class="rule-title">Supplementary Announcements</h2>
          <div class="rule-document">
            <div>
              <button class="first-document" @click="lastDocument">
                <i class="el-icon-d-arrow-left"></i>
              </button>
              <div ref="documentList" class="document-list">
                <ul :style="documentListPosition">
                  <li v-for="(doc, index) in ruleMergeData.items" :key="index">
                    <button
                      :class="[
                        'rule-btn',
                        ruleDocDataIndex === index ? 'rule-btn-active' : '',
                      ]"
                      @click="selectRuleDoc(index, doc)">
                      {{ Number(doc.release_time) | date }}
                    </button>
                  </li>
                </ul>
              </div>
              <button class="last-document" @click="nextDocument">
                <i class="el-icon-d-arrow-right"></i>
              </button>
            </div>
            <div class="rule-pdf">
              <pdf-viewer
                v-if="documentData"
                ref="pdfViewer"
                :key="ruleDocDataIndex"
                :document-data="documentData"
                :annotation-disabled="true"></pdf-viewer>
            </div>
          </div>
        </el-aside>
        <el-main class="rule-main" width="45%">
          <h2 class="rule-title">Detailed Information</h2>
          <div>
            <div v-for="item in ruleDocData.result.items" :key="item">
              <span class="rule-merge-detail-title">{{
                item | capitalize | converter
              }}</span>
              <div>
                <el-table
                  v-if="ruleDocData.result[item].records.length > 0"
                  :data="ruleDocData.result[item].records"
                  :show-overflow-tooltip="true"
                  style="width: 100%">
                  <el-table-column
                    v-for="key in ruleDocData.result[item].headers"
                    :key="key"
                    :prop="key"
                    :label="key | capitalize"
                    :render-header="ruleMergeTeableHead"
                    :label-class-name="key.startsWith('_') ? 'th-hide' : ''"
                    :align="key.startsWith('_') ? 'left' : 'center'"
                    :min-width="key === 'url' ? '300px' : '140px'">
                    <template slot-scope="scope">
                      <a
                        v-if="key === 'url'"
                        :href="scope.row[key]"
                        :title="scope.row[key]"
                        download
                        >{{ scope.row[key] }}</a
                      >
                      <span v-else>{{ scope.row[key] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-else>
                  <img
                    v-for="index in ruleDocData.result[item].index"
                    :key="index"
                    :src="fetchRuleMergeImgUrl(ruleDocData.file_id, index)"
                    alt=""
                    class="rule-merge-detail-img" />
                </div>
                <el-button
                  size="mini"
                  class="button-hkex button-annotation"
                  :disabled="annotateBtnDisabled"
                  @click="startAnnotate"
                  >Manual Tagging</el-button
                >
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <div
      class="document-download-list"
      v-else-if="ruleDocData.result.items.length < 1">
      <div>
        <button class="first-document" @click="lastDocument">
          <i class="el-icon-d-arrow-left"></i>
        </button>
        <div ref="documentList" class="document-list">
          <ul :style="documentListPosition">
            <li v-for="(doc, index) in ruleMergeData.items" :key="index">
              <button
                :class="[
                  'rule-btn',
                  ruleDocDataIndex === index ? 'rule-btn-active' : '',
                ]"
                @click="selectRuleDoc(index, doc)">
                {{ Number(doc.release_time) | date }}
              </button>
            </li>
          </ul>
        </div>
        <button class="last-document" @click="nextDocument">
          <i class="el-icon-d-arrow-right"></i>
        </button>
      </div>
      <div class="rule-pdf">
        <pdf-viewer
          v-if="documentData"
          ref="pdfViewer"
          :key="ruleDocDataIndex"
          :document-data="documentData"
          :annotation-disabled="true"></pdf-viewer>
        <a
          v-else
          :href="ruleDocData.url"
          class="excel-file-download"
          target="_blank"
          rel="noopener noreferrer">
          {{ ruleDocData.url }}
          <i class="el-icon-download"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchRuleMergeImgUrl,
  fetchRuleDocumentUrl,
} from '@/store/api/hkex.question.api';
import { mapGetters } from 'vuex';
import { isENLang } from '@/store/constants';

import PdfViewer from '../../components/PdfViewer.vue';

export default {
  name: 'additional-documents',
  components: {
    PdfViewer,
  },
  props: {
    stockCode: {
      type: String,
      required: true,
    },
    reportYear: {
      type: String,
      required: true,
    },
    rule: {
      type: String,
      required: true,
    },
    yearEnd: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      documentData: null,
      ruleDocDataIndex: 0,
      documentDisplaysNum: 0,
      annotateBtnDisabled: true,
      pdfjsOptions: {
        disableAutoSetTitle: true,
        disableStream: true,
        disableAutoFetch: true,
        locale: isENLang ? 'en-US' : 'zh-CN',
      },
    };
  },
  computed: {
    ...mapGetters('hkexModule/reportReviewModule', ['ruleMergeData']),
    ruleDocData() {
      if (this.ruleMergeData.items) {
        return this.ruleMergeData.items[this.ruleDocDataIndex];
      }
      return undefined;
    },
    documentListPosition() {
      if (this.ruleDocDataIndex > this.documentDisplaysNum) {
        return {
          left: `-${
            120 * (this.ruleDocDataIndex - this.documentDisplaysNum)
          }px`,
        };
      } else {
        return {
          left: '0px',
        };
      }
    },
    isNotPdfFile() {
      if (this.ruleDocData) {
        let url = this.ruleDocData.url.toLowerCase();
        if (!url) {
          url = '';
        }
        return url.endsWith('pdf');
      }
      return undefined;
    },
  },
  filters: {
    capitalize(str) {
      const newStr = str.split('_').join(' ');
      return newStr
        .toLowerCase()
        .replace(/( |^)[a-z]/g, (str) => str.toUpperCase());
    },
    converter(str) {
      if (str === 'Share Purchase Report') {
        return 'Share Repurchases Reports';
      }
      return str;
    },
  },
  async created() {
    await this.getRuleMergeDetailData();
    this.setAnnotationBtnDisabled(
      this.ruleMergeData.items[this.ruleDocDataIndex],
    );
    this.fetchPDFDocument();
  },
  mounted() {
    if (this.isNotPdfFile) {
      this.documentDisplaysNum = Math.floor(
        this.$refs.documentList.clientWidth / 120 - 1,
      );
    }
  },
  destroyed() {
    this.ruleDocDataIndex = 0;
  },
  methods: {
    fetchRuleMergeImgUrl,
    fetchRuleDocumentUrl,
    ruleMergeTeableHead(h, { column }) {
      const content = column.label.replace('Number', '#');
      return h(
        'el-tooltip',
        {
          attrs: {
            'popper-class': 'rule-merge-table-head-tooltip',
            effect: 'dark',
            content: content,
            placement: 'top',
          },
        },
        [
          h(
            'span',
            {
              class: 'rule-merge-header',
            },
            content,
          ),
        ],
      );
    },
    async fetchPDFDocument() {
      try {
        const docUrl = this.ruleMergeData.items[this.ruleDocDataIndex].url;
        if (!docUrl.endsWith('.pdf')) {
          return;
        }
        this.documentData = null;
        const res = await this.$store.dispatch(
          'hkexModule/reportReviewModule/fetchPDFDocument',
          {
            url: docUrl,
          },
        );
        this.documentData = new Uint8Array(res.data);
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },
    async getRuleMergeDetailData() {
      try {
        await this.$store.dispatch(
          'hkexModule/reportReviewModule/getRuleMergeDetailData',
          {
            stockCode: this.stockCode,
            reportYear: this.reportYear,
            rule: this.rule,
            yearEnd: this.yearEnd,
          },
        );
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    selectRuleDoc(index, doc) {
      if (this.ruleDocDataIndex === index) {
        return;
      }
      this.ruleDocDataIndex = index;
      this.setAnnotationBtnDisabled(doc);
      this.fetchPDFDocument();
    },
    setAnnotationBtnDisabled(doc) {
      const {
        marked_file_id,
        marked_project_id,
        marked_tree_id,
        marked_mold_id,
        marked_question_id,
      } = doc;
      if (
        marked_file_id &&
        marked_project_id &&
        marked_tree_id &&
        marked_mold_id &&
        marked_question_id
      ) {
        this.annotateBtnDisabled = false;
      } else {
        this.annotateBtnDisabled = true;
      }
    },
    startAnnotate() {
      const {
        marked_file_id,
        marked_project_id,
        marked_tree_id,
        marked_mold_id,
        marked_question_id,
        marked_file_name,
      } = this.ruleDocData;
      const questionUrl = this.$router.resolve({
        name: 'remark',
        params: { qid: marked_question_id },
        query: {
          treeId: marked_tree_id,
          fileId: marked_file_id,
          schemaId: marked_mold_id,
          projectId: marked_project_id,
          fileName: marked_file_name,
        },
      });
      window.open(questionUrl.href, '_blank');
    },
    getDocName(url) {
      let tempArr = url.split(/\//g);
      return tempArr[tempArr.length - 1];
    },
    nextDocument() {
      if (this.ruleDocDataIndex < this.ruleMergeData.items.length - 1) {
        this.ruleDocDataIndex++;
        this.fetchPDFDocument();
      }
    },
    lastDocument() {
      if (this.ruleDocDataIndex > 0) {
        this.ruleDocDataIndex--;
        this.fetchPDFDocument();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';

.detail-wapper {
  height: 100vh;
  text-align: center;
  overflow: auto;
  .document-container {
    height: 100%;
    .rule-detail-container {
      height: 100%;
    }
  }
}
.rule-title {
  color: $--color-black-light;
  margin: 15px 0;
  padding-bottom: 15px;
  border: none;
  border-bottom: 1px solid $--color-blue-light;
}
.rule-aside {
  border-right: 2px solid $--color-primary;
  margin: 0 auto;
}
.rule-main {
  margin: 0;
  padding: 0 20px;
  .rule-merge-detail-title {
    display: block;
    margin: 10px 0;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    color: $--color-black-light;
  }
  .button-annotation {
    position: absolute;
    top: 17px;
    right: 20px;
  }
}
.rule-document,
.document-download-list {
  height: calc(100% - 90px);
  position: relative;
  .document-list {
    width: calc(100% - 70px);
    height: 30px;
    margin: 0 35px;
    overflow: hidden;
    position: relative;
  }
  ul {
    margin: 0;
    padding: 0;
    display: inline-block;
    white-space: nowrap;
    position: absolute;
    top: 0;
    left: 0;
    li {
      display: inline-block;
      list-style: none;
    }
  }
  .rule-btn {
    color: $--color-blue-light;
    border: 1px solid $--color-blue-light;
    background-color: $--color-white;
    border-radius: 5px;
    outline: none;
    width: 120px;
    height: 30px;
    cursor: pointer;
  }
  .rule-btn-active {
    background-color: $--color-primary;
    color: $--color-white;
    border: 1px solid $--color-primary;
  }
  .last-document,
  .first-document {
    position: absolute;
    top: 0;
    right: 0;
    text-align: right;
    width: 30px;
    height: 30px;
    border: none;
    i {
      display: inline-block;
      font-size: 30px;
      cursor: pointer;
      background-color: $--color-primary;
      color: $--color-white;
      border-radius: 5px 5px 0 0;
    }
  }
  .first-document {
    top: 0;
    left: 0;
  }
  img {
    width: 30px;
  }
  .rule-pdf {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 55px;
    ::v-deep .toolbar {
      display: none;
    }
    ::v-deep .viewerContainer {
      top: 0;
    }
  }
}
.rule-merge-detail-img {
  width: 100%;
}
.excel-file-download {
  display: block;
  font-size: 15px;
  text-align: center;
  padding: 55px 0 0 0;
  color: $--color-grey;
  text-decoration: none;
}
.document-download-list {
  margin: 10px auto;
  width: 50%;
  height: calc(100% - 70px);
  .rule-pdf {
    height: 100%;
  }
}
::v-deep .el-table {
  .th-hide {
    display: none;
  }
  .cell {
    > :is(a) {
      text-decoration: none;
      color: $--color-black-light;
      &:hover {
        text-decoration: underline;
        color: $--color-primary;
      }
    }
  }
}
</style>
