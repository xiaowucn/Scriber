<template>
  <div class="disclosure-consistency">
    <el-collapse accordion v-model="activeName" class="consistency-list">
      <el-collapse-item
        class="consistency-item"
        v-for="(result, index) in selectedResults"
        :name="index"
        :key="index">
        <template slot="title">
          <div class="header">
            <label class="label">{{ result.label }}</label>
            <span
              class="result"
              :class="{
                'is-consistency': !result.is_compliance,
              }">
              {{ result.is_compliance ? '一致' : '不一致' }}
            </span>
          </div>
        </template>
        <div class="content">
          <div class="answer-list">
            <template v-for="(result, resultIndex) in answerResults(result)">
              <disclosure-answer-item
                :answerItem="result"
                :answerName="result.doc_type"
                :answerDocType="result.doc_type"
                :answerLabel="result.name"
                :answerUpdatedName="`${result.doc_type}${result.name}`"
                :fileId="fileId(result.doc_type)"
                :key="resultIndex" />
            </template>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DisclosureAnswerItem from './DisclosureAnswerItem';

export default {
  name: 'disclosure-consistency',
  components: { DisclosureAnswerItem },
  data() {
    return {
      activeName: 0,
    };
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    selectedResults() {
      return this.detail.results[this.detail.selectedRule.label];
    },

    resultTree() {
      const selectedTreeData =
        this.detail.mergedTreeData[this.detail.selectedRule.label];
      const resultTree = selectedTreeData.reduce((acc, group) => {
        group.data.childrenGroup[0].forEach((item) => {
          const getResultChildren = (node, name) => {
            if (node.childrenGroup) {
              const label = node.data.label;
              node.childrenGroup[0].forEach((child) =>
                getResultChildren(child, label),
              );
            } else {
              const label = name
                ? `${name}-${node.data.label}`
                : `${node.data.label}`;
              acc[label] = acc[label] || [];
              acc[label].push({
                ...node,
                name: label,
                doc_type: group.doc_type,
              });
            }
          };
          getResultChildren(item);
        });
        return acc;
      }, {});
      return resultTree;
    },

    fileId() {
      return (doc_type) =>
        this.detail.files.find((item) => item.doc_type === doc_type).id;
    },

    answerResults() {
      return (result) => this.resultTree[result.label];
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-consistency {
  ::v-deep .el-collapse {
    .el-collapse-item__header,
    .el-collapse-item__wrap {
      padding: 0 20px;
      background-color: transparent;
    }
    .el-collapse-item__header {
      &.is-active {
        position: relative;
        z-index: 2;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
      }
    }
    .el-collapse-item__arrow {
      transform: rotate(-90deg);
      &.is-active {
        transform: rotate(90deg);
      }
    }
  }
  .consistency-item {
    .header {
      flex: 1;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .label {
      font-size: 16px;
      white-space: nowrap;
    }
    .result {
      color: #fff;
      height: 24px;
      width: 50px;
      margin-right: 8px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $--color-primary;
      &.is-consistency {
        background-color: #ff3030;
      }
    }
  }
}
</style>
