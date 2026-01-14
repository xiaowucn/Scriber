<template>
  <div>
    <component
      :is="rulesComponent"
      :show-full-test="showFullTest"
      @update-show-full-test="handleUpdateShowFullTest">
      <template slot="operater">
        <div class="switch-custom-rules-operater">
          <div
            class="tab-button"
            :class="{
              active: rulesComponent === COMPONENT_NAME.CUSTOM_RULES,
            }"
            @click="changeTab(COMPONENT_NAME.CUSTOM_RULES)">
            <svg-font-icon
              name="custom-rule"
              :color="
                rulesComponent === COMPONENT_NAME.CUSTOM_RULES
                  ? '#3673F3'
                  : '#797575'
              "
              :size="22"></svg-font-icon>
            系统规则
          </div>
          <div
            class="tab-button"
            :class="{
              active: rulesComponent === COMPONENT_NAME.MODEL_RULES,
            }"
            @click="changeTab(COMPONENT_NAME.MODEL_RULES)">
            <svg-font-icon
              name="model-rule"
              :color="
                rulesComponent === COMPONENT_NAME.MODEL_RULES
                  ? '#3673F3'
                  : '#797575'
              "
              :size="22"></svg-font-icon>
            大模型规则
          </div>
        </div>
      </template>
    </component>
  </div>
</template>
<script>
import CustomRules from './CustomRules.vue';
import ModelRules from '@/custom/general/pages/ModelRules.vue';
const RULE_TYPE = {
  SYSTEM: 'system',
  MODEL: 'model',
};

const COMPONENT_NAME = {
  CUSTOM_RULES: 'CustomRules',
  MODEL_RULES: 'ModelRules',
};

const QUERY_PARAM = {
  RULE_TYPE: 'ruleType',
  SHOW_FULL_TEST: 'showFullTest',
};

const SHOW_FULL_TEST_VALUE = {
  TRUE: 'true',
  FALSE: 'false',
};

export default {
  name: 'switch-custom-rules',
  components: {
    CustomRules,
    ModelRules,
  },
  data() {
    return {
      RULE_TYPE,
      COMPONENT_NAME,
      QUERY_PARAM,
      SHOW_FULL_TEST_VALUE,
      rulesComponent: COMPONENT_NAME.CUSTOM_RULES,
      showFullTest: false,
    };
  },

  created() {
    this.initFromQuery();
  },

  watch: {
    '$route.query': {
      handler() {
        this.initFromQuery();
      },
      deep: true,
    },
  },

  methods: {
    initFromQuery() {
      const {
        [QUERY_PARAM.RULE_TYPE]: ruleType,
        [QUERY_PARAM.SHOW_FULL_TEST]: showFullTest,
      } = this.$route.query;

      // 设置规则类型
      if (ruleType === RULE_TYPE.SYSTEM) {
        this.rulesComponent = COMPONENT_NAME.CUSTOM_RULES;
      } else if (ruleType === RULE_TYPE.MODEL) {
        this.rulesComponent = COMPONENT_NAME.MODEL_RULES;
      } else {
        // 默认显示系统规则
        this.rulesComponent = COMPONENT_NAME.CUSTOM_RULES;
      }

      // 设置是否显示完整测试
      this.showFullTest = showFullTest === SHOW_FULL_TEST_VALUE.TRUE;
    },

    changeTab(component) {
      this.rulesComponent = component;

      const ruleType =
        component === COMPONENT_NAME.CUSTOM_RULES ? '' : RULE_TYPE.MODEL;
      const query = {};
      if (ruleType) {
        query[QUERY_PARAM.RULE_TYPE] = ruleType;
      }
      if (component === COMPONENT_NAME.MODEL_RULES && this.showFullTest) {
        query[QUERY_PARAM.SHOW_FULL_TEST] = SHOW_FULL_TEST_VALUE.TRUE;
      }

      this.$router.replace({ query });
    },

    handleUpdateShowFullTest(showFullTest) {
      this.showFullTest = showFullTest;

      const query = {
        [QUERY_PARAM.RULE_TYPE]:
          this.rulesComponent === COMPONENT_NAME.CUSTOM_RULES
            ? RULE_TYPE.SYSTEM
            : RULE_TYPE.MODEL,
      };

      if (showFullTest) {
        query[QUERY_PARAM.SHOW_FULL_TEST] = SHOW_FULL_TEST_VALUE.TRUE;
      }

      this.$router.replace({ query });
    },
  },
};
</script>
<style lang="scss" scoped>
.switch-custom-rules-operater {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .tab-button {
    font-size: 14px;
    padding: 6px 12px;
    border: 1px solid #9a9a9a;
    display: flex;
    align-items: center;
    column-gap: 6px;
    cursor: pointer;
    &:first-child {
      border-radius: 6px 0 0 6px;
      border-right: none;
    }
    &:last-child {
      border-radius: 0 6px 6px 0;
    }
    &.active {
      color: #316ec5;
      border: 1px solid #316ec5;
      background-color: rgba(49, 110, 197, 0.16);
    }
  }
}
</style>
