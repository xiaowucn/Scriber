import { AI_PREDICT_STATUS_TEXT_MAP } from '@/store/constants';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { pdfParseStatus } from '@/store/constants';

export default {
  name: 'file-status-mixin',
  data() {
    return {};
  },
  computed: {
    ...mapGetters('citicsTgModule', ['schemas', 'templates']),
    isFileParsing() {
      return (status) => {
        return status === pdfParseStatus.parsing;
      };
    },
    viewDisabled() {
      return (status) => {
        return status !== pdfParseStatus.completed;
      };
    },
  },
  methods: {
    getTemplateName(templates) {
      const getTemplateName = (template) => {
        const templateItem = this.templates.find(
          (item) => item.id === template,
        );
        if (templateItem) {
          return templateItem.name;
        }
        return '';
      };
      return templates.map((item) => getTemplateName(item));
    },

    getSchemaName(file) {
      const getSchemaName = (file) => {
        const schema = this.schemas?.find((item) => item.id === file.mold);
        if (schema) {
          return schema.name;
        }
        return '';
      };
      const questions = file.questions;
      if (questions) {
        if (questions.length === 0) {
          return this.$t(`message['待指定']`);
        }
        if (questions.length === 1) {
          return getSchemaName(questions[0]);
        }
        return questions.length;
      } else {
        return getSchemaName(file);
      }
    },
    getAIPredictionSummaryStatus(file) {
      const questions = file.questions || {};
      if (file.isDir || questions.length === 0) {
        return '-';
      }
      const questionGroups = _.groupBy(questions, 'ai_status');
      return Object.keys(questionGroups)
        .map((key) => {
          const item = {
            text: AI_PREDICT_STATUS_TEXT_MAP[key],
            count: questionGroups[key].length,
            class: `ai-status-${key}`,
          };
          return `<p class="${item.class}">${item.text}: ${item.count}</p>`;
        })
        .join('');
    },
    getPdfParseStatus(status) {
      const pdfParseStatus = this.$options.filters.pdfParseStatus(status);
      return !pdfParseStatus ? '-' : this.$t(`message['${pdfParseStatus}']`);
    },
    goDetail(file) {
      const resolvedPath = this.$router.resolve({
        name: 'fileList',
        params: { treeId: file.rtree_id, projectId: file.pid },
        query: {
          from: 'fullView',
          fileId: file.id,
        },
      });
      if (this.pager) {
        this.setFilePager(1, 0);
      }
      window.open(resolvedPath.href, '_blank');
    },
    handleJumpToRemark(row) {
      const { id } = row;
      const resolvedPath = this.$router.resolve({
        path: `/citics-tg/fileRemark/${id}`,
      });
      window.open(resolvedPath.href, '_blank');
    },
    setFilePager(page, total) {
      let data = {
        page: page,
        size: this.pager.size,
        total: total,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', data);
    },
  },
};
