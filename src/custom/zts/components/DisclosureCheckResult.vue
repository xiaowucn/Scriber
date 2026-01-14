<template>
  <div class="disclosure-check-result">
    <el-header class="disclosure-header check-header" height="50px">
      <span>披露判断</span>
    </el-header>
    <div class="check-content">
      <div v-if="isShowFormulas" class="check-formula">
        <template v-for="(formula, index) in formulas">
          <div class="formula-box" :key="formula.name">
            <label class="label">{{ formula.name }}</label>
            <span class="formula" v-katex v-text="formula.data"></span>
          </div>
          <span
            class="separator"
            :key="index"
            v-if="isShowFormulaSeparator(index)">
            或
          </span>
        </template>
      </div>
      <div class="check-result">
        <label>是否需要披露：</label>
        <span
          class="result"
          :class="{
            'is-disclosure': isDisclosure,
          }">
          {{ isDisclosure ? '是' : '否' }}
        </span>
      </div>
      <div v-if="isShowFormulas" class="check-formula-calculation-result">
        <template v-for="(group, groupIndex) in selectedResultsGroupByLabel">
          <div
            v-for="(result, resultIndex) in group"
            :key="`${groupIndex}-${resultIndex}`"
            class="calculation-result">
            <label class="label">
              {{ formulaLabel(result.label, resultIndex, group.length) }}：
            </label>
            <div
              class="number"
              :class="{
                'is-disclosure': !result.is_compliance,
              }">
              {{ result.reasons.formula_ret }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import VueKatex from '@/utils/katexAutoRender';

export default {
  name: 'disclosure-check-result',
  directives: { katex: VueKatex },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    formulas() {
      return this.detail.selectedRule.formula;
    },
    formulaLabel() {
      return (label, index, length) =>
        `${label}${length > 1 ? `.${index + 1}` : ''}计算结果`;
    },
    selectedResults() {
      return this.detail.results[this.detail.selectedRule.label];
    },
    selectedResultsGroupByLabel() {
      return _.groupBy(this.selectedResults, 'label');
    },
    isDisclosure() {
      return this.detail.disclosures[this.detail.selectedRule.label];
    },
    isShowFormulaSeparator() {
      return (index) => index !== this.formulas.length - 1;
    },
    isShowFormulas() {
      return !_.isEmpty(this.formulas);
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-check-result {
  .check-content {
    padding: 20px;
  }
  .check-formula {
    margin-bottom: 15px;
    > * {
      margin-bottom: 5px;
    }
    .formula-box {
      border-radius: 2px;
      border: 1px solid $--color-primary;
      background-color: $--color-primary-hover;
    }
    .separator {
      width: 16px;
      height: 16px;
      font-size: 12px;
      text-align: center;
      display: inline-block;
      color: $--color-primary;
    }
    .formula-box {
      padding: 8px;
      display: flex;
      align-items: center;
    }
    .label {
      white-space: nowrap;
      margin-right: 15px;
      color: $--color-primary;
    }
    .formula {
      overflow-x: auto;
      &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 0;
        &:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      }
    }
    ::v-deep .katex-display {
      margin: 0;
      padding: 5px 0;
      .katex {
        font: inherit;
        font-size: 12px;
        text-align: left;
      }
      .katex-mathml {
        display: none;
      }
    }
  }
  .check-result {
    font-size: 16px;
    .result {
      &.is-disclosure {
        color: #ff3030;
      }
    }
  }
  .check-formula-calculation-result {
    display: flex;
    flex-wrap: wrap;
    gap: 20px 30px;
    margin-top: 15px;
    .calculation-result {
      display: flex;
      align-items: center;
    }
    .label {
      width: 130px;
      white-space: nowrap;
      color: $--color-primary;
    }
    .number {
      display: flex;
      align-items: center;
      min-width: 40px;
      &.is-disclosure {
        color: #ff3030;
      }
    }
  }
}
</style>
