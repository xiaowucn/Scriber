<template>
  <div class="sensitive-words-aside">
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
  name: 'sensitive-words-aside',
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
@import '../variables.scss';

.sensitive-words-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-container {
    padding: 20px;
  }
  .answer-collapse {
    &::v-deep .el-collapse {
      .el-collapse-item {
        &.is-active {
          &.el-collapse-item {
            .el-collapse-item__header {
              &::before {
                background-color: $--color-danger;
              }
            }
          }
        }
        .el-collapse-item__header {
          .title {
            .number {
              color: $--color-danger;
              background: $--color-danger-bg;
            }
          }
        }
        .el-collapse-item__content {
          .answer {
            li {
              .answer-content {
                .text {
                  &:hover {
                    color: $--color-danger;
                  }
                }
              }
              &.is-selected {
                background-color: $--color-danger-bg;
                .answer-content {
                  .text {
                    color: $--color-danger;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
