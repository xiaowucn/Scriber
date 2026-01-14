<template>
  <div class="disclosure-rule-list">
    <el-header class="disclosure-header rule-header" height="50px">
      <span>披露规则</span>
    </el-header>
    <div class="rule-content">
      <div class="rule-list">
        <ul>
          <li
            v-for="(rule, index) in rules"
            :key="index"
            @click="changeDisclosureRule(index)"
            :class="{
              'is-active': selectedRuleIndex === index,
              'is-disclosure': detail.disclosures[rule.label],
            }">
            <span>{{ formattedIndex(index + 1) }}</span>
            <span class="label">{{ rule.label }}</span>
          </li>
        </ul>
      </div>
      <div class="rule-description">
        <label class="label">规则描述：</label>
        <span class="description">{{ detail.selectedRule.description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'disclosure-rule-list',
  data() {
    return {
      selectedRuleIndex: 0,
    };
  },
  props: {
    answerResults: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['rules', 'detail']),

    currentRule() {
      return this.detail.selectedRule.label;
    },
    formattedIndex() {
      return (index) => String(index).padStart(2, '0');
    },
  },
  methods: {
    init() {
      this.changeDisclosureRule(0);
    },
    changeDisclosureRule(index) {
      if (!_.isEmpty(this.answerResults)) {
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `<span class="highlight-message">${this.currentRule}</span>有数据修改，请保存数据`,
          type: 'warning',
        });
        return;
      }
      this.selectedRuleIndex = index;
      this.$store.commit(
        'ztsDisclosureModule/SET_DETAIL_SELECTED_RULE',
        this.rules[index],
      );
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-rule-list {
  ul {
    li {
      list-style: none;
    }
  }
  .rule-content {
    padding: 0 20px;
  }
  .rule-list {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 20px;
    }
    li {
      min-height: 28px;
      border-radius: 2px;
      border: 1px solid $--color-primary;
      display: flex;
      align-items: center;
      padding: 0px 15px;
      cursor: pointer;
      width: 100px;
      &.is-active {
        color: #ffffff;
        background-color: $--color-primary;
      }
    }
    li.is-disclosure {
      color: #ff3030;
      border: 1px solid #ff3030;
      &.is-active {
        color: #ffffff;
        background-color: #ff3030;
      }
    }
    .label {
      white-space: nowrap;
      margin-left: 10px;
    }
  }
  .rule-description {
    display: flex;
    padding: 10px 0px;
    .label {
      font-weight: 500;
      white-space: nowrap;
    }
    .description {
      white-space: pre-wrap;
    }
  }
}
</style>
