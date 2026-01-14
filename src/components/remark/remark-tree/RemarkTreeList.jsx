import Vue from 'vue';
import RemarkTreeItem from './RemarkTreeItem.jsx';
import './RemarkTree.scss';
import EventBus from './EventBus';
import _ from 'lodash';
import { mapGetters } from 'vuex';

const TreeList = Vue.component('remark-tree-list', {
  // eslint-disable-next-line no-unused-vars
  render: function (h) {
    // display tree's level.1 start
    const children = this.children.map((child, index) => (
      <remark-tree-item
        key={index}
        depth={0}
        props={{ model: child }}
        selectedAnswerId={this.selectedAnswerId}
        selectedSchemaNode={this.selectedSchemaNode}
        parentVisible={true}
        parentOpened={true}
        allAnswerCollapsed={this.allAnswerCollapsed}
        updateAllAnswerCollapsed={this.updateAllAnswerCollapsed}
        showDiffMarks={this.showDiffMarks}
        checkFirstLevelNodeOpen={this.checkFirstLevelNodeOpen}
        removeAnswerFn={this.removeAnswer}
      />
    ));
    return (
      <div class="remark-tree-list">
        <ul data-depth={0}>{children}</ul>
      </div>
    );
  },
  components: {
    RemarkTreeItem,
  },
  props: {
    children: {
      type: Array,
      required: true,
    },
    allAnswerCollapsed: {
      type: Boolean,
      required: false,
    },
    updateAllAnswerCollapsed: {
      type: Function,
      required: true,
    },
    showDiffMarks: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedAnswerId: '',
      selectedSchemaNode: '',
      selectedSchemaNodeIsCustom: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['remarkTab']),
  },
  watch: {
    remarkTab() {
      this.resetNodeSelected();
    },
  },
  created() {
    EventBus.$on('schema-node-selected', this.nodeSelected);
    EventBus.$on('answer-item-selected', this.answerItemSelected);
  },
  beforeDestroy() {
    EventBus.$off('schema-node-selected', this.nodeSelected);
    EventBus.$off('answer-item-selected', this.answerItemSelected);
  },
  methods: {
    removeAnswer(index, key) {
      const selectedIndex = Number(this.selectedAnswerId.split(':').at(-1));
      if (this.selectedSchemaNode !== key) {
        return;
      }
      if (index === selectedIndex) {
        this.selectedAnswerId = '';
      } else if (index < selectedIndex) {
        this.selectedAnswerId =
          this.selectedSchemaNode + ':' + (selectedIndex - 1);
      }
    },
    nodeSelected({ key, model }) {
      this.selectedSchemaNode = key;
      // this.selectedAnswerId = '';
      this.selectedSchemaNodeIsCustom = !!model.meta.custom;
    },
    resetNodeSelected() {
      this.selectedAnswerId = '';
      this.selectedSchemaNode = '';
    },
    answerItemSelected({ schemaNode, index, data, target = {} }) {
      const schemaNodeArray = JSON.parse(schemaNode) || [];
      const schemaNodeEndString =
        schemaNodeArray[schemaNodeArray.length - 1] || '';
      let pairIndex;
      if (schemaNodeEndString.includes('拆分')) {
        pairIndex = !_.isNil(data?.pair_index) ? data.pair_index : null;
      } else {
        pairIndex = index;
      }
      let selectIndex = index;
      if (target.showDiffMarks) {
        if (!this.showDiffMarks) {
          selectIndex = pairIndex;
        }
      } else {
        if (this.showDiffMarks) {
          selectIndex = pairIndex;
        }
      }
      if (selectIndex === null) {
        return;
      }
      this.selectedAnswerId = schemaNode + ':' + selectIndex;
      this.selectedSchemaNode = '';
    },
    checkFirstLevelNodeOpen() {
      const maxCount = 100;

      let answerCount = 0;
      this.$children.forEach(function getCount(item) {
        if (item.visible && item.schemaAnswer) {
          answerCount += item.schemaAnswer.data.length;
        }
        if (item.$children.length > 0) {
          item.$children.forEach(getCount);
        }
      });

      return answerCount <= maxCount;
    },
  },
});

export default TreeList;
