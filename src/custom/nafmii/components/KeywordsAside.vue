<template>
  <div class="keywords-aside">
    <div class="search-container">
      <el-input
        clearable
        size="medium"
        ref="searchInput"
        v-model="searchValue"
        placeholder="搜索字段"
        @clear="handleClear"
        @keyup.enter.native="handleSearch">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <answer-collapse
      :answers="answers"
      :selectedType="selectedType"
      :getAnswerItemLabel="getAnswerItemLabel"
      @update-answers="handleUpdateAnswers" />
  </div>
</template>

<script>
import AnswerCollapse from './AnswerCollapse';

export default {
  name: 'keywords-aside',
  props: {
    data: {
      type: Array,
      required: true,
    },
    selectedType: {
      type: String,
      required: false,
    },
  },
  components: { AnswerCollapse },
  data() {
    return {
      searchValue: '',
      answers: [],
    };
  },
  watch: {
    data() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getAnswers();
    },
    handleClear() {
      this.handleSearch();
    },
    handleSearch() {
      this.answers = this.data.filter((item) =>
        item.key.includes(this.searchValue),
      );
    },
    getAnswers() {
      this.answers = this.data;
    },
    getAnswerItemLabel({ answer }) {
      return answer.key;
    },
    handleUpdateAnswers(answers, type) {
      this.$emit('update-answers', answers, type);
    },
  },
};
</script>

<style lang="scss" scoped>
.keywords-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-container {
    padding: 20px;
  }
}
</style>
