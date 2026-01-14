<template>
  <div v-if="showRatio" class="significant-investment-ratio">
    <p v-if="showOperation" class="operation">
      {{ ratios[0] && ratios[0].name }} ratio:
      <el-tooltip
        effect="dark"
        content="Copy answer to C2.1.1、C2.2.1、C2.3、C2.4、C2.5、C2.6、C2.7"
        placement="left">
        <el-button
          v-if="showCopyAnswerButton"
          type="primary"
          size="mini"
          :disabled="copyAnswerButtonDisabled"
          @click="copyAnswer">
          Copy answer to
        </el-button>
      </el-tooltip>
    </p>
    <div class="formulas" ref="formulas">
      <p
        v-for="(ratio, index) in ratios"
        :key="index"
        :class="[
          'formula-info',
          `formula-${index}`,
          index === ratioIndex ? 'active' : '',
        ]"
        v-katex
        v-text="ratio.formula_info"
        @click="ratioClicked(ratio, index)"></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';
import VueKatex from '@/utils/katexAutoRender';
import { fetchRatio4Info } from '@/store/api/hkex.api';

const SUPPORTED_SCHEMA_IDS = [18, 29];

export default {
  name: 'significant-investment-ratio',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    showOperation: {
      type: Boolean,
      default: true,
    },
  },
  directives: { katex: VueKatex },
  data() {
    return {
      ratios: [],
      ratioIndex: -1,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['mergedTreeData']),
    fid() {
      return this.$route.query.fileId;
    },
    schemaId() {
      return Number(this.$route.query.schemaId);
    },

    rule() {
      return this.$route.query.rule;
    },
    showRatio() {
      return this.show || SUPPORTED_SCHEMA_IDS.includes(this.schemaId);
    },
    showCopyAnswerButton() {
      return this.schemaId !== 29;
    },
    copyAnswerButtonDisabled() {
      return this.ratios.some((ratio) => ratio.red_flag);
    },
  },
  watch: {
    fid() {
      this.init();
    },
    schemaId() {
      this.init();
    },
    rule() {
      this.ratioIndex = -1;
    },
    mergedTreeData() {
      this.hideSchemaFields();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.showRatio) {
        await this.fetchRatio4Info();
        this.hideSchemaFields();
        this.$emit('data-ready', this.ratios);
      }
    },
    async fetchRatio4Info() {
      try {
        const res = await fetchRatio4Info(this.$route.query.fileId);
        this.ratios = res.data;
        this.bindEvent();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    bindEvent() {
      this.$nextTick(() => {
        this.ratios.forEach((ratio, index) => {
          const formulasRef = this.$refs.formulas;
          if (!formulasRef) {
            return;
          }
          const mords = formulasRef.querySelectorAll(`.formula-${index} .mord`);
          const result = Array.from(mords).find(
            (item) => item.innerText === ratio.ratio_str,
          );
          if (result) {
            result.classList.add('result');
            result.addEventListener('click', () => {
              this.showBoxes(ratio);
            });
          }
        });
      });
    },
    ratioClicked(ratio, index) {
      this.ratioIndex = index;
      this.showBoxes(ratio);
    },
    showBoxes(ratio) {
      const boxes = [];
      ratio.sections.forEach((sec) => {
        sec.items.forEach((item) => {
          for (const [k, v] of Object.entries(item)) {
            if (!v) {
              return;
            }
            boxes.push({
              box: v.box,
              page: v.page,
              text: v.text,
              label: k,
            });
          }
        });
      });
      this.$emit('show-boxes', boxes);
      EventBus.$emit('answer-item-selected', {
        schemaNode: null,
        schema: { data: { label: null } },
        data: { boxes },
      });
    },
    copyAnswer() {
      const rules = [
        'C2.1.1',
        'C2.2.1',
        'C2.3',
        'C2.4',
        'C2.5',
        'C2.6',
        'C2.7',
      ];
      const treeData = this.mergedTreeData[0];
      const items = treeData.children.filter((child) => {
        return rules.includes(child.data.label);
      });
      const answerItems = [];

      items.forEach((item) => {
        item.children.forEach((child) => {
          answerItems.push({
            key: `["${treeData.data.label}:0","${item.data.label}:0","${child.data.label}:0"]`,
            data: [],
            value: 'Negative Statement',
            manual: true,
            schema: {
              data: child.data,
            },
          });
        });
      });

      answerItems.forEach((answer) => {
        EventBus.$emit('sync-remark-answer', {
          schemaNode: answer.key,
          answer,
        });
      });
      EventBus.$emit('answer-item-updated', answerItems);
      this.$nextTick(() => {
        const C2_1_el = this.$parent.$refs['remarkAnswer'].$el.querySelector(
          '.answer-name[title="C2.1.1"]',
        );
        C2_1_el.scrollIntoView({ behavior: 'smooth' });
      });
    },
    hideSchemaFields() {
      if (Number(this.$route.query.schemaId) === 18) {
        const hiddenFileds = [
          'C1.1',
          'C1.2',
          'C2.1',
          'C2.2',
          'C6',
          'C7.4',
          'C3',
          'C4.1',
          'C4.2',
          'C4.3',
          // 'C5',
        ];
        hiddenFileds.forEach((field) => {
          setTimeout(() => {
            const el = this.$parent.$refs['remarkAnswer'].$el.querySelector(
              `.answer-name[title="${field}"]`,
            );
            if (el) {
              el.closest('.answer-item').style.display = 'none';
            }
          }, 0);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.significant-investment-ratio {
  margin: 0 15px 10px 15px;
  padding: 10px;
  background-color: #00edff52;
  border-radius: 4px;
  .el-button {
    padding: 3px 7px;
  }
  .operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .el-button {
      .copy-icon {
        display: block;
        width: 18px;
        height: 18px;
        background-size: 100% 100%;
        background-image: url(../common/images/icon-ratio-ai.svg);
      }
    }
  }
  .formulas {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 10px;
    overflow-x: auto;
    font-size: 12px;
    .formula-info {
      padding: 0 10px;
      border-radius: 4px;
      background-color: #2fd6e6;
    }
    ::v-deep .katex {
      text-align: left;
      .result {
        color: #fff;
        background-color: #ff0000;
        cursor: pointer;
      }
    }
    &::-webkit-scrollbar {
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #9b9b9b;
      border-radius: 5px;
      &:hover {
        background-color: #6f6f6f;
      }
    }
    &::-webkit-scrollbar-track {
      display: none;
    }
  }
}
</style>
