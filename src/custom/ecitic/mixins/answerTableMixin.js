import _ from 'lodash';
import EventBus from '@/components/remark/remark-tree/EventBus';
import { exportProjectDetails } from '@/store/api/ecitic.api';
import { downloadFileByBlob } from '@/utils';

export default {
  name: 'answer-table-mixin',
  data() {
    return {
      ANSWER_STATUS: {
        UNCONFIRMED: 0,
        CONFIRMED: 1,
      },
      currentAnswerCellSubValueIndex: 1,
      selectedCellKeyPath: [],
    };
  },
  filters: {
    getAIParseStatus(status) {
      switch (status) {
        case -1:
          return '不需要预测';
        case 0:
          return '排队中';
        case 1:
          return '预测中';
        case 2:
          return '预测失败';
        case 3:
          return '已提取';
        case 4:
          return '未绑定模型, 不预测';
        default:
          return '排队中';
      }
    },
    getComplianceAIParseStatus(status) {
      switch (status) {
        case -1:
          return '不需要预测';
        case 0:
          return '排队中';
        case 1:
          return '预测中';
        case 2:
          return '预测失败';
        case 3:
          return '已完成';
        case 4:
          return '未绑定模型, 不预测';
        default:
          return '排队中';
      }
    },
    getAIParseProgress(status) {
      switch (status) {
        case -1:
          return 0;
        case 0:
          return 10;
        case 1:
          return 60;
        case 2:
          return 0;
        case 3:
          return 100;
        case 4:
          return 0;
        default:
          return 0;
      }
    },
    getFillInStatus(status) {
      switch (status) {
        case 0:
          return '待填报';
        case 1:
          return '填报中';
        case 2:
          return '已提交';
        default:
          return '-';
      }
    },
  },
  methods: {
    getAnswerItem(path) {
      return _.get(this.answer, path, {}) || {};
    },
    setAnswerItem(answer, path) {
      const newAnswer = _.cloneDeep(this.answer);
      _.set(newAnswer, path, {
        ...answer,
        manual: true,
      });
      this.answer = newAnswer;
    },
    answerItemSelected({ key, path }) {
      this.selectedCellKeyPath = path;
      const answerItem = this.getAnswerItem(path);
      let boxes = [];
      if (answerItem.data && answerItem.data.length > 0) {
        answerItem.data.forEach((item) => {
          boxes.push(...item.boxes);
        });
      }
      const boxesData = {
        boxes,
        manual: answerItem.manual,
        text: answerItem.text,
      };
      this.$emit('answer-value-selected', { key, path });
      EventBus.$emit('answer-item-selected', {
        schemaNode: key,
        schema: {
          data: {
            label: key,
          },
        },
        data: boxesData,
      });
    },
    editAnswerText(path) {
      const text = this.getAnswerItem(path).text || '';
      this.isEditing = true;
      this.editingText = text;
      this.$nextTick(() => {
        this.$refs.editInput[0].focus();
      });
    },
    saveEditingAnswer({ editedAnswer, path }) {
      this.$emit('save-editing-answer', { editedAnswer, path });
    },
    clearAnswerText({ path }) {
      this.$emit('remove-answer-text', { path });
    },
    saveAnswer(answerIndex) {
      this.$emit('save-answer', answerIndex);
    },
    shouldShowNextCellIcon(path) {
      const answerItem = this.getAnswerItem(path);
      if (answerItem && answerItem.data) {
        return path === this.currentAnswerKeyPath && answerItem.data.length > 1;
      }
      return false;
    },
    showNextCellWidget() {
      const currentAnswerItem = this.getAnswerItem(this.currentAnswerKeyPath);
      const boxesTotal = currentAnswerItem.data.length;
      const nodeLabel = this.$parent.currentAnswerKey;
      EventBus.$emit('answer-item-selected', {
        schemaNode: nodeLabel,
        schema: {
          data: {
            label: nodeLabel,
          },
        },
        data: currentAnswerItem.data[this.currentAnswerCellSubValueIndex],
      });
      if (this.currentAnswerCellSubValueIndex === boxesTotal - 1) {
        this.currentAnswerCellSubValueIndex = 0;
      } else {
        this.currentAnswerCellSubValueIndex += 1;
      }
    },
    scrollToNextAnswerSection() {
      const allStatus = Object.values(this.answerStatus[this.currentTab]);
      const answerTabs = this.$parent.answerTabs;
      if (
        allStatus.every((status) => status === this.ANSWER_STATUS.CONFIRMED)
      ) {
        const currentTab = answerTabs.find(
          (tab) => tab.name === this.currentTab,
        );
        if (currentTab.index < answerTabs.length - 1) {
          const nextTab = answerTabs[currentTab.index + 1];
          this.$parent.setAnswerTabs(nextTab);
        }
      }
      const nextAnswerItemDom =
        this.$refs.answerContent.querySelectorAll('.unconfirmed')[0];
      if (nextAnswerItemDom) {
        nextAnswerItemDom.scrollIntoView({ behavior: 'smooth' });
      }
    },
    addAnswerItemGroup(path) {
      const answerGroup = _.cloneDeep(this.getAnswerItem(path)[1]);
      if (answerGroup) {
        answerGroup[0].forEach((answer) => {
          answer[1] = { ...answer[1], data: [], text: '' };
        });
        this.$emit('add-answer-item-group', {
          path,
          newAnswerItem: answerGroup[0],
        });
      }
    },
    async removeAnswerItemGroup(path) {
      const result = await this.$confirm('确定要删除一组吗？', '提示').catch(
        () => {},
      );
      if (result === 'confirm') {
        this.$emit('remove-answer-item-group', { path });
      }
    },
    async exportExcel({ qid, file_id }, target) {
      try {
        target.exportLoading = true;
        const res = await exportProjectDetails(qid, {
          answer_type: 'xlsx',
          file_id,
        });
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        target.exportLoading = false;
      }
    },
  },
};
