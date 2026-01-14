import _ from 'lodash';
import { saveAnswerStatus } from '@/store/api/szse.api';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'answer-table-mixin',
  data() {
    return {
      ANSWER_STATUS: {
        UNCONFIRMED: 0,
        CONFIRMED: 1,
      },
      currentAnswer: {},
      currentAnswerCellSubValueIndex: 0,
      formulaData: [],
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
      return _.get(this.originAnswer, path, {}) || {};
    },
    answerKeySelected(key, path, name) {
      this.$emit('answer-key-selected', { key, path, name });
    },
    answerItemSelected(key, path, name) {
      const answerItem = this.getAnswerItem(path);
      this.currentAnswerCellSubValueIndex = 0;
      this.currentAnswer = answerItem.data ? answerItem.data[0] : {};
      this.formulaData = this.setFormulaData(answerItem.formula);
      this.$emit('answer-item-selected', { key, answerItem, path, name });
      this.$emit('answer-key-selected', { key, path, name });
    },
    editAnswerText(path) {
      const text = this.getAnswerItem(path).text || '';
      this.$emit('edit-answer-text', { path, text });
      this.isEditing = true;
      this.editingText = text;
      this.$nextTick(() => {
        this.$refs.editInput[0].focus();
      });
    },
    saveEditingAnswer() {
      const editedAnswer = {
        data: [{ boxes: [] }],
        text: this.editingText,
        manual: true,
      };
      this.$emit('save-editing-answer', { editedAnswer });
      this.isEditing = false;
      this.editingText = '';
    },
    clearAnswerText(path) {
      this.$emit('clear-answer-text', { path });
    },
    isComputedValue(cell) {
      return cell.data && cell.data.length > 1;
    },
    showComputedWarningIcon(cells) {
      return cells.some((cell) => cell.data.data && cell.data.data.length > 1);
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
      this.currentAnswer = currentAnswerItem;
      const boxesTotal = currentAnswerItem.data.length;
      const nodeLabel = this.$parent.currentAnswerKey;
      if (
        boxesTotal > 1 &&
        this.currentAnswerCellSubValueIndex === boxesTotal - 1
      ) {
        this.currentAnswerCellSubValueIndex = 0;
      } else {
        this.currentAnswerCellSubValueIndex += 1;
      }
      const currentAnswerItemBoxesData =
        currentAnswerItem.data[this.currentAnswerCellSubValueIndex];
      this.currentAnswer = currentAnswerItemBoxesData;
      EventBus.$emit('answer-item-selected', {
        schemaNode: nodeLabel,
        schema: {
          data: {
            label: nodeLabel,
          },
        },
        data: currentAnswerItemBoxesData,
      });
    },
    setFormulaData(data) {
      if (!data) {
        return [];
      }
      const formulas = [];
      formulas.push(data);
      data.forEach((i) => {
        const subFormula = i.data.formula;
        if (subFormula) {
          formulas.push(subFormula);
        }
      });
      return formulas;
    },
    closeFormulaCard() {
      this.formulaData = [];
    },
    async confirmToSaveAnswer(key) {
      try {
        const path = `[${this.currentTab}][0][${key}]`;
        const data = {
          field: key,
          field_data: this.getAnswerItem(path),
          status: 1,
        };
        await saveAnswerStatus(this.$route.query.questionId, data);
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
        });
        await this.$parent.getAnswer();
        await this.$nextTick();
        this.scrollToNextAnswerSection();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
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
    addAnswerItemGroup(orders, item) {
      const path = `['${this.currentTab}'][0]['${item.name}']`;
      const newAnswerItem = {};
      for (const order of orders) {
        newAnswerItem[order] = {};
      }
      this.$emit('add-answer-item-group', { path, newAnswerItem });
    },
    async removeAnswerItemGroup(item) {
      const result = await this.$confirm('确定要删除一组吗？', '提示').catch(
        () => {},
      );
      if (result === 'confirm') {
        const path = `['${this.currentTab}'][0]['${item.name}']`;
        this.$emit('remove-answer-item-group', { path });
      }
    },
  },
};
