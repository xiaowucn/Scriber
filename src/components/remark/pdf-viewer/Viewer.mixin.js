import EventBus from '../remark-tree/EventBus';

export default {
  data() {
    return {
      nodeSelected: null,
      nodeAnswerSelected: null,
      isSelectedAll: false,
    };
  },
  created() {
    EventBus.$on('answer-item-selected', this.selectAnswerItem);
    EventBus.$on('schema-node-selected', this.selectSchemaNode);
    EventBus.$on('rule-item-selected', this.selectRuleItem);
    EventBus.$on('reset-node-selected', this.resetNodeSelected);
    EventBus.$on('select-all-frames', this.showAllAnswerBoxes);
    EventBus.$on('remove-all-frames', this.hideAllAnswerBoxes);
    EventBus.$on('predict-position-item', this.showPredictPosition);
    EventBus.$on('set-widget-types', this.setWidgetTypes);
    document.addEventListener('keydown', this.keyDownListener);
  },
  beforeDestroy() {
    EventBus.$off('answer-item-selected', this.selectAnswerItem);
    EventBus.$off('schema-node-selected', this.selectSchemaNode);
    EventBus.$off('rule-item-selected', this.selectRuleItem);
    EventBus.$off('reset-node-selected', this.resetNodeSelected);
    EventBus.$off('select-all-frames', this.showAllAnswerBoxes);
    EventBus.$off('remove-all-frames', this.hideAllAnswerBoxes);
    EventBus.$off('predict-position-item', this.showPredictPosition);
    EventBus.$off('set-widget-types', this.setWidgetTypes);
    document.removeEventListener('keydown', this.keyDownListener);
  },
  methods: {
    resetNodeSelected() {
      this.nodeSelected = null;
      this.nodeAnswerSelected = null;
    },
  },
};
