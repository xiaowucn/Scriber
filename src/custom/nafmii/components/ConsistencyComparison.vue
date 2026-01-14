<template>
  <div class="consistency-comparison">
    <div class="search-container">
      <el-input
        clearable
        size="medium"
        ref="searchInput"
        placeholder="搜索字段"
        v-model="filterValue"
        @clear="handleClear"
        @keyup.enter.native="handleSearch">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-select slot="prepend" v-model="filterBy" @change="changeFilter">
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-input>
    </div>
    <answer-collapse
      ref="answerCollapse"
      :isShowNumber="false"
      :isShowComment="false"
      :answers="answers"
      :getAnswerItemLabel="getAnswerItemLabel"
      :getCollapseItemClass="getCollapseItemClass">
      <template slot="equal" slot-scope="props">
        <span class="equal">{{ props.answer.equal ? '一致' : '不一致' }}</span>
      </template>
      <template slot="notExtract" slot-scope="props">
        <div v-if="props.item.data.length === 0">
          <div class="answer-title">
            <el-tag size="mini" type="info">未提取</el-tag>
          </div>
          <div class="answer-content" @click="removeAllFrames">
            <span class="text">{{ props.item.schema.data.label }}</span>
          </div>
        </div>
      </template>
    </answer-collapse>
  </div>
</template>

<script>
import AnswerCollapse from './AnswerCollapse';

export default {
  name: 'consistency-comparison',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  components: { AnswerCollapse },
  data() {
    return {
      filterBy: 'all',
      filterValue: '',
      searchOptions: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '一致',
          value: true,
        },
        {
          label: '不一致',
          value: false,
        },
      ],
      answers: [],
    };
  },
  created() {
    this.init();
  },
  watch: {
    data() {
      this.init();
    },
  },
  methods: {
    init() {
      this.getAnswers();
    },
    changeFilter() {
      this.filterValue = '';
      this.$refs.searchInput.focus();
      this.handleSearch();
    },
    handleClear() {
      this.handleSearch();
    },
    handleSearch() {
      if (this.filterBy === 'all') {
        this.answers = this.data.filter((item) =>
          item.key.includes(this.filterValue),
        );
      } else {
        this.answers = this.data.filter(
          (item) =>
            item.equal === this.filterBy && item.key.includes(this.filterValue),
        );
      }
    },
    getAnswers() {
      this.answers = this.data;
    },
    removeAllFrames() {
      this.$refs.answerCollapse.resetAnswerItemSelected();
    },
    getCollapseItemClass(answer) {
      return {
        'is-equal': answer.equal,
        'is-not-equal': !answer.equal,
      };
    },
    getAnswerItemLabel({ item }) {
      return item.schema.data.label;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.consistency-comparison {
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-container {
    padding: 20px;

    ::v-deep .el-input {
      .el-input__prefix {
        position: absolute;
        left: 100px;
        padding-left: 5px;
        transform: unset !important;
      }
    }

    ::v-deep .el-select {
      width: 100px;
      .el-input__inner {
        padding: 0 10px;
      }
    }
  }
  .answer-collapse {
    &::v-deep .el-collapse {
      .el-collapse-item {
        &.is-active {
          &.is-equal {
            .title {
              .key {
                color: $--color-primary;
              }
            }
          }
          &.is-not-equal {
            .el-collapse-item__header {
              &::before {
                background-color: $--color-danger;
              }
            }
            .title {
              .key {
                color: $--color-danger;
              }
            }
          }
        }
        &.is-equal {
          .title {
            .equal {
              color: $--color-primary;
            }
          }
        }
        &.is-not-equal {
          .title {
            .equal {
              color: $--color-danger;
            }
          }
        }
      }
    }
  }
}
</style>
