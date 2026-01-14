<template>
  <div class="search-container">
    <el-input
      ref="searchInput"
      size="mini"
      :placeholder="searchBy === 'field' ? '搜索字段' : '搜索答案'"
      v-model="searchText"
      clearable
      @keydown.native.enter="handleKeyEnter"
      @input="input"
      @clear="clear">
      <el-select
        v-if="showPrepend"
        v-model="searchBy"
        slot="prepend"
        size="mini"
        class="search-by-select"
        @change="handleSearchByChange">
        <el-option
          v-for="item in searchByOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div v-if="showAppend" slot="append" class="operator">
        <span class="num">{{ currentIndex }}/{{ total }}</span>
        <span class="arrow">
          <i class="el-icon-arrow-up" @click="navigate('prev')"></i>
          <i class="el-icon-arrow-down" @click="navigate('next')"></i>
        </span>
        <el-button
          size="mini"
          icon="el-icon-search"
          class="search-btn"
          @click="search"></el-button>
      </div>
    </el-input>
    <el-button
      v-if="showSearchButton"
      type="primary"
      size="mini"
      class="search-btn-outer"
      @click="search"
      >搜 索</el-button
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';
import EventBus from './remark-tree/EventBus';
import { SEARCH_TYPE } from '@/store/constants';

export default {
  name: 'file-remark-tree-nodes-searcher',
  props: {
    showPrepend: {
      type: Boolean,
      default: true,
    },
    showAppend: {
      type: Boolean,
      default: true,
    },
    showSearchButton: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    EventBus.$on('node-arrow-click', this.highlightCurrentSearchNodes);
  },
  beforeDestroy() {
    EventBus.$off('node-arrow-click', this.highlightCurrentSearchNodes);
    this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', {});
  },
  data() {
    return {
      searchText: '',
      currentIndex: 0,
      total: 0,
      searchBy: SEARCH_TYPE.field,
      isInitialKeyEnter: true,
      searchByOptions: [
        {
          label: '字段',
          value: SEARCH_TYPE.field,
        },
        {
          label: '答案',
          value: SEARCH_TYPE.answer,
        },
      ],
    };
  },
  computed: {
    ...mapGetters('remarkModule', [
      'originalTreeData',
      'answerTreeFilter',
      'keywordMatches',
    ]),
  },
  watch: {
    '$route.query.schemaKey': {
      immediate: true,
      handler() {
        this.searchText = this.$route.query.schemaKey;
        this.search();
      },
    },
  },
  methods: {
    handleSearchByChange() {
      if (this.searchText) {
        this.highlightTreeNodes(
          this.searchBy === SEARCH_TYPE.field
            ? SEARCH_TYPE.answer
            : SEARCH_TYPE.field,
          '',
        );
        this.searchText = '';
        this.search();
      }
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    async search() {
      await RemarkTreeLoading.start();
      EventBus.$emit('before-search-answer-tree-fields');
      this.$store.commit('remarkModule/SET_KEYWORD_MATCHES', []);
      this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', {
        ...this.answerTreeFilter,
        keyword: this.searchText,
        searchBy: this.searchBy,
      });
      await this.$nextTick();
      this.total = this.keywordMatches.length;
      this.currentIndex = 0;
      if (this.total > 0) {
        this.navigate('next');
      } else {
        this.highlightTreeNodes(this.searchBy, this.searchText);
      }
      RemarkTreeLoading.close();
    },
    handleKeyEnter() {
      if (this.isInitialKeyEnter) {
        this.search();
        this.isInitialKeyEnter = false;
      } else {
        this.navigate('next');
      }
    },
    input() {
      if (this.searchText === '') {
        this.search();
      }
      this.isInitialKeyEnter = true;
    },
    clear() {
      this.isInitialKeyEnter = true;
      this.search();
    },
    async highlightCurrentSearchNodes() {
      await this.$nextTick();
      this.highlightTreeNodes(this.searchBy, this.searchText);
      const currentMatch = this.keywordMatches[this.currentIndex - 1];
      if (!currentMatch) {
        return;
      }
      const { answerUuid, answerIndex } = currentMatch;
      this.setAnswerNodeActiveAndScroll(answerUuid, answerIndex);
    },
    async highlightTreeNodes(searchBy, searchText) {
      const tree = this.$parent.$el.querySelector('.remark-tree-list');
      if (!tree) {
        return;
      }
      const keywordSelector =
        searchBy === SEARCH_TYPE.field ? '.answer-name' : '.answer-text';
      let nodes = tree.querySelectorAll(keywordSelector);
      const reg = /<\/?span[^>]*>/gi;
      Array.from(nodes).forEach((node) => {
        node.innerHTML = node.innerHTML.replace(reg, '');
        if (searchText === '') return;
        node.innerHTML = node.innerText.replace(
          searchText,
          `<span class="highlight">${searchText}</span>`,
        );
      });
    },
    navigate(direction) {
      const atFirst = this.currentIndex <= 1;
      const atLast = this.currentIndex >= this.total;

      if (direction === 'next') {
        this.currentIndex = atLast ? 1 : this.currentIndex + 1;
      } else {
        this.currentIndex = atFirst ? this.total : this.currentIndex - 1;
      }

      const currentMatch = this.keywordMatches[this.currentIndex - 1];
      const { treeItemIndex, treeItemUuid, answerUuid, answerIndex, level } =
        currentMatch;
      const page = Math.ceil((treeItemIndex + 1) / 10);

      if (level === 1) {
        this.highlightTreeNodes(this.searchBy, this.searchText);
        this.setAnswerNodeActiveAndScroll(answerUuid, answerIndex);
      } else {
        EventBus.$emit('highlight-change', page, treeItemUuid, () => {
          this.highlightTreeNodes(this.searchBy, this.searchText);
          this.setAnswerNodeActiveAndScroll(answerUuid, answerIndex);
        });
      }
    },
    scrollTo(node) {
      node.scrollIntoView({
        block: 'center',
      });
    },
    setAnswerNodeActiveAndScroll(answerUuid, answerIndex) {
      const tree = this.$parent.$el.querySelector('.remark-tree-list');
      if (!tree) {
        return;
      }
      const node = tree.querySelector(
        `[data-uuid="${answerUuid}"][data-index="${answerIndex}"]  > .highlight`,
      );
      const keywordSelector =
        this.searchBy === SEARCH_TYPE.field ? '.answer-name' : '.answer-text';
      const nodes = document.querySelectorAll(
        `${keywordSelector} > .highlight`,
      );
      Array.from(nodes).forEach((node) => {
        node.classList.remove('active');
      });

      node.classList.add('active');
      this.scrollTo(node);
    },

    /**
     * 递归过滤树节点，但保留原树结构，即符合条件节点的父路径上所有节点不管是否符合条件都保留
     * @param {Array} nodes 要过滤的节点
     * @param {Function} predicate 过滤条件，符合条件的节点保留
     * @return 过滤后的树
     */
    filterTree(nodes, predicate) {
      if (!(nodes && nodes.length)) {
        return;
      }
      const newChildren = [];
      for (const node of nodes) {
        const subs = this.filterTree(node.children, predicate);
        if ((subs && subs.length) || predicate(node)) {
          node.children = subs ? subs : [];
          newChildren.push(node);
        }
      }
      return newChildren.length ? newChildren : [];
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  z-index: 3;
  background: #fff;

  ::v-deep .search-by-select {
    width: 70px;
    .el-input__inner {
      padding-left: 10px;
    }
  }
  .operator {
    color: #777;
    .arrow {
      padding-left: 10px;
      cursor: pointer;

      i {
        padding: 0 5px;
        height: 18px;
        line-height: 18px;
        font-weight: bold;
        &:hover {
          background: #fff;
        }
      }
    }
    .search-btn {
      margin-left: 0;
    }
  }
  .search-btn-outer {
    margin-left: 10px;
  }
}
</style>
