import _ from 'lodash';
import { mapGetters } from 'vuex';
import {
  questionStatus,
  questionStatusNames,
  pdfParseStatus,
  hkexReportType,
} from '@/store/constants';

import {
  hkexQuestion as hkexQuestionApi,
  hkexRule as hkexRuleApi,
} from '@/store/api';
import { getNafmiiTaskType } from '../../custom/nafmii/common/utils';

export default {
  name: 'FileMarkableMixin',
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters('userModule', ['users']),
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('remarkModule', ['currentAnswerUserId']),
    ...mapGetters('tagModule', ['tags']),
  },
  data() {
    return {};
  },
  methods: {
    viewHistory(file) {
      this.$router.push({
        name: 'fileHistory',
        params: { fileId: file.id },
      });
    },
    goDetail(file) {
      this.$router.push({
        name: 'projectDetail',
        params: { treeId: file.tree_id, projectId: file.pid || file.project },
        query: {
          from: 'search',
          fileId: file.id,
        },
      });
      this.setFilePager(1, 0);
    },
    setFilePager(page, total) {
      let data = {
        page: page,
        size: this.pager.size,
        total: total,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', data);
    },
    isShowCompareButton(row) {
      return (
        this.$isAllowed('remarkOrInspect') &&
        row.question_status === 2 &&
        row.qid &&
        this.$platform.isHkexEnv()
      );
    },
    getIsConflictQuestion(question) {
      return question.question_status === questionStatusNames.conflict;
    },
    async compareAnswer(qid) {
      try {
        await hkexQuestionApi.compareAnswer(qid);
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['比较完成']`),
          type: 'success',
        });
        this.fetchFileListByStatus();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },

    /**
     * 标注文件
     * @param {Object} file question对象
     * @param {String} routerType vue-router导航类型，可选值: push、replace
     * @param {String} name vue-router导航名称，默认值: remark
     */
    async previewFileByRemark(file, routerType = 'push', name = 'remark') {
      if (!this.$isAllowed('remark')) {
        return;
      }

      const fileValid = this.checkRemarkFileValid(file);
      if (!fileValid) {
        return;
      }

      const { qid } = this.getFileSchema(file);
      const query =
        await this.getRemarkAndremarkAndInspectFileCommonQuery(file);
      let listQuery = this.$route.query;
      const routeParams = {
        name,
        params: { qid },
        query: {
          ...listQuery,
          ...query,
        },
      };

      if (this.$platform.isNafmiiEnv()) {
        routeParams.query.from = 'label';
      }

      if (routerType === 'replace') {
        this.$router.replace(routeParams);
      } else {
        this.$router.push(routeParams);
      }
    },

    /**
     * 审核文件
     * @param {Object} file question对象
     */
    async previewFileByInspect(
      file,
      routerType = 'push',
      notProjectFile = false,
    ) {
      if (!this.$isAllowed('inspect')) {
        return;
      }

      const fileValid = this.checkRemarkFileValid(file);
      if (!fileValid) {
        return;
      }

      const { qid } = this.getFileSchema(file);
      const { task_type } = file;
      const query =
        await this.getRemarkAndremarkAndInspectFileCommonQuery(file);

      let type;
      let from;
      let listQuery = this.$route.query;
      if (this.$platform.isNafmiiEnv()) {
        type = getNafmiiTaskType(file.task_types);
        if (this.$route.name === 'projectDetail') {
          from = 'file';
        }
        if (this.$route.name === 'task' || this.$route.query?.from === 'task') {
          from = 'task';
        }
      }

      const routeParams = {
        name: 'inspect',
        params: { qid },
        query: {
          ...listQuery,
          ...query,
          task_type,
          type,
          from,
        },
      };
      if (notProjectFile) {
        routeParams.query.notProjectFile = true;
      }

      if (this.$platform.isCmfchinaEnv()) {
        const fileSuffix = (file.name.split('.').pop() || '').toLowerCase();
        routeParams.query.fileSuffix = fileSuffix;
      }

      if (routerType === 'replace') {
        this.$router.replace(routeParams);
      } else {
        this.$router.push(routeParams);
      }
    },

    /**
     * 使用新版标注页面打开合规审核页面
     * @param {Object} file question对象
     */
    async previewFileByRuleCheck(file) {
      if ([pdfParseStatus.completed].indexOf(file.pdf_parse_status) === -1) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['该文档正在处理中']`),
          type: 'warning',
        });

        return;
      }

      let { question_status } = file;
      let routeParams = {
        name: 'pocDetails',
        params: { qid: file.questions[0].id },
        query: {
          projectId: file.pid,
          treeId: file.tree_id,
          fileId: file.id,
          fileName: file.name,
        },
      };
      if (this.type === 'conflictFiles') {
        routeParams.query.isConflictType = true;
      }
      switch (question_status) {
        case questionStatusNames.feedback:
        case questionStatusNames.identical:
        case questionStatusNames.confirmed: {
          const fileStatus = this.$t(
            `message['${questionStatus[question_status]}']`,
          );
          const confirmed = await this.$confirm(
            this.$t(
              `message['文件处于"{status}"状态，标记，是否以只读形式打开？']`,
              { status: fileStatus },
            ),
          ).catch(() => {});
          if (confirmed === 'confirm') {
            Object.assign(routeParams.query, {
              readonly: 'readonly',
            });
            this.$router.push(routeParams);
          }
          return;
        }
        case questionStatusNames.conflict: {
          routeParams.query.readonly = 'readonly';
          break;
        }
      }
      this.$router.push(routeParams);
    },

    isHkexTagBtn(row) {
      return (
        this.$isAllowed('remarkOrInspect') &&
        row.mold &&
        row.has_review &&
        this.$platform.isHkexEnv()
      );
    },

    async getFirstRuleName(dt) {
      try {
        const res = await hkexRuleApi.fetchRules({ dt });
        return res.data[0].rule;
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.message,
          type: 'error',
        });
      }
    },

    getDocType(mold) {
      const MOLD_TO_DOC_TYPE = [
        {
          mold: [5, 15, 18, 22, 35],
          doc_type: 'ar', // 年报
        },
        {
          mold: [24],
          doc_type: 'qr',
          rule: 'ratio', // 业绩公告-Ratio
        },
        {
          mold: [26],
          doc_type: 'qr',
          rule: 'disclosure', // 业绩公告-Disclosure
        },
        {
          mold: [1, 2, 31, 32],
          doc_type: 'esg', // ESG
        },
        {
          mold: [28],
          doc_type: 'cg', // CG
        },
        {
          mold: [33, 37],
          doc_type: 'agm', // AGM
        },
        {
          mold: [34, 38],
          doc_type: 'poll', // POLL
        },
      ];
      const currentType = MOLD_TO_DOC_TYPE.find((item) =>
        item.mold.includes(mold),
      );
      return {
        doc_type: currentType?.doc_type || '',
        doc_rule: currentType?.rule || '',
      };
    },

    async previewHkexFile(row, file) {
      const { doc_type, doc_rule } = this.getDocType(row.mold);
      try {
        const params = {
          doc_type,
        };
        const response = await hkexQuestionApi.fetchQuestionMeta(
          row.id,
          params,
        );
        if (response.data.length === 0) {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: this.$t(`message['该公司已退市']`),
            type: 'warning',
          });
          return;
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }

      const { mold } = row;
      const { id: file_id, question_status } = file;

      const routeParams = {
        name: '',
        params: { qid: row.id },
        query: {
          fileId: file_id,
          schemaId: mold,
          rule: '',
        },
      };
      let name = '';
      let rule = '';
      if (doc_type === 'ar') {
        name = hkexReportType.ar.reportReviewRouterName;
        rule = await this.getFirstRuleName('ar');
      }
      if (doc_type === 'esg') {
        name = hkexReportType.esg.reportReviewRouterName;
        rule = await this.getFirstRuleName('esg');
      }
      if (doc_type === 'cg') {
        name = hkexReportType.cg.reportReviewRouterName;
        rule = await this.getFirstRuleName('cg');
      }
      if (doc_type === 'agm') {
        name = hkexReportType.agm.reportReviewRouterName;
        rule = await this.getFirstRuleName('agm');
      }
      if (doc_type === 'poll') {
        name = hkexReportType.poll.reportReviewRouterName;
        rule = await this.getFirstRuleName('poll');
      }
      if (doc_type === 'qr' && doc_rule === 'disclosure') {
        name = hkexReportType.qr.reportReviewRouterName;
        routeParams.params.qid = file.qid;
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchAnnouncementRules',
        );
        rule = res.data[0].rule;
      }
      if (doc_type === 'qr' && doc_rule === 'ratio') {
        name = hkexReportType.qr.reportReviewRouterName;
        routeParams.params.qid = file.qid;
        const res = await this.$store.dispatch(
          'hkexModule/ruleModule/fetchAnnouncementRatioRules',
        );
        routeParams.query.ratio = res.data[0].rule;
      }
      routeParams.name = name;
      routeParams.query.rule = rule;

      if (
        question_status > questionStatusNames.completed &&
        question_status !== questionStatusNames.conflict
      ) {
        const fileStatus = this.$t(
          `message['${questionStatus[question_status]}']`,
        );
        const confirmed = await this.$confirm(
          this.$t(
            `message['文件处于"{status}"状态，标记，是否以只读形式打开？']`,
            { status: fileStatus },
          ),
        ).catch(() => {});
        if (confirmed === 'confirm') {
          Object.assign(routeParams.query, {
            readonly: 'readonly',
          });
          this.$router.push(routeParams);
        }
        return;
      }
      if (question_status === questionStatusNames.conflict) {
        routeParams.query.readonly = 'readonly';
      }
      if (name) {
        this.$router.push(routeParams);
      }
    },
    async fetchAllSchemas() {
      try {
        await this.$store.dispatch('schemaModule/fetchAllSchemas');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    getDirSchemaNames(dir) {
      const names = dir.default_molds.map((mold) =>
        this.getSchemaName({ mold }),
      );
      return names;
    },
    getSchemaName(file) {
      const getSchemaName = (file) => {
        const schema = this.schemas.items.find((item) => item.id === file.mold);
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
    getFileTagName(tags) {
      const tag = this.tags.find((tag) => tag.id === tags[0]);
      if (tag) {
        return tag.name;
      }
      return '';
    },
    getMetaName(row) {
      if (this.$features.showMetaName()) {
        if (row.meta) {
          return row.meta.name;
        }
        return '';
      }
      return row.name;
    },
    showRemarkAnswerBtn(row) {
      return (
        !this.$isAllowed('inspect') &&
        this.$isAllowed('remark') &&
        row.questions &&
        row.questions.length === 1
      );
    },
    showInspectAnswerBtn(row) {
      if (this.$platform.isNafmiiEnv()) {
        return this.$isAllowed('inspect') && row.questions;
      }
      if (this.$isAllowed('showFileScenario') && row.task_type === 'judge') {
        return this.$isAllowed('inspect');
      }
      return (
        this.$isAllowed('inspect') && row.questions && row.questions.length >= 1
      );
    },

    checkCanModifyAnswer() {
      if (this.$platform.isCiticsDCMEnv()) {
        return false;
      }
      if (
        this.$platform.isHkexEnv() &&
        this.currentAnswerUserId > 0 &&
        this.currentAnswerUserId !== this.loginUser.id
      ) {
        this.$notify({
          title: this.$t(`message['警告']`),
          message: this.$t(`message['请不要在其他用户下进行标注操作']`),
          type: 'warning',
        });
        return false;
      }
      return true;
    },

    getFileSchema(file) {
      const { qid, mold } = file;
      if (!_.isNil(qid) && !_.isNil(mold)) {
        return { qid, mold };
      }
      if (
        (this.$platform.isNafmiiEnv() || file.task_type === 'judge') &&
        file.questions.length === 0
      ) {
        return { qid: -1, mold: -1 };
      }

      const firstMold = [...(file.molds || file.mold_list)].sort(
        (a, b) => a - b,
      )[0];
      const question = file.questions.find((item) => item.mold === firstMold);
      if (!question) {
        const { id, mold } = file.questions[0];
        return { qid: id, mold };
      }
      return { qid: question.id, mold: firstMold };
    },

    checkRemarkFileValid(file) {
      const { qid, mold } = this.getFileSchema(file);

      if (_.isNil(mold)) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['该文档尚未指定schema']`),
          type: 'warning',
        });
        return false;
      }

      if (_.isNil(qid)) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['该文档正在处理中']`),
          type: 'warning',
        });
        return false;
      }

      if (this.$platform.isNafmiiEnv()) {
        // 5 解析失败
        // 51 解析异常
        if (
          [pdfParseStatus.failed, pdfParseStatus.exception].indexOf(
            file.pdf_parse_status,
          ) !== -1
        ) {
          this.$notify({
            title: this.$t(`message['提示']`),
            message: '文件解析异常，请重新识别或联系运维人员处理',
            type: 'warning',
          });
          return false;
        }
      }

      // 4 解析完成
      // 8 ocr过期
      if (
        [pdfParseStatus.completed, pdfParseStatus.ocr_expired].indexOf(
          file.pdf_parse_status,
        ) === -1
      ) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['该文档正在处理中']`),
          type: 'warning',
        });
        return false;
      }

      return true;
    },

    async getRemarkAndremarkAndInspectFileCommonQuery(file) {
      const { mold } = this.getFileSchema(file);
      const { id, tree_id, pid, project, question_status } = file;
      const query = {
        projectId: pid || project || 0,
        treeId: tree_id,
        fileId: id,
        schemaId: mold,
      };

      if (this.type === 'conflictFiles') {
        query.isConflictType = true;
      }

      switch (question_status) {
        case questionStatusNames.feedback:
        case questionStatusNames.identical:
        case questionStatusNames.confirmed: {
          const fileStatus = this.$t(
            `message['${questionStatus[question_status]}']`,
          );
          const confirmed = await this.$confirm(
            this.$t(
              `message['文件处于"{status}"状态，标记，是否以只读形式打开？']`,
              { status: fileStatus },
            ),
          ).catch(() => {});
          if (confirmed === 'confirm') {
            Object.assign(query, {
              readonly: 'readonly',
            });
          }
          break;
        }
        case questionStatusNames.conflict: {
          query.readonly = 'readonly';
          break;
        }
      }

      return query;
    },
  },
};
