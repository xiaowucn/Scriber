<template>
  <el-dialog
    :title="currentRule ? '更新文档明细' : '新增文档明细'"
    :visible="true"
    width="700px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="closeDialog">
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
        :rules="rules">
        <el-form-item label="文档名称">
          <el-input :value="lawName" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用场景" prop="scenario_ids">
          <el-select
            multiple
            v-model="form.scenario_ids"
            placeholder=""
            style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文档内容" prop="content">
          <el-input
            type="textarea"
            v-model.trim="form.content"
            :rows="4"
            placeholder="请输入详细的文档内容"
            style="width: 100%"></el-input>
          <template v-if="currentRule && existsCheckPoints.length > 0">
            <div>
              修改文档内容后，请确认是否重新生成审核规则：
              <el-radio-group v-model="form.update_check_points">
                <el-radio :label="true" :disabled="!isEditedRuleContent"
                  >是</el-radio
                >
                <el-radio :label="false" :disabled="!isEditedRuleContent"
                  >否</el-radio
                >
              </el-radio-group>
            </div>
            <div class="display-check-points">
              <div class="display-check-points-title">
                当前文档相关的审核规则ID:
              </div>
              <div>{{ existsCheckPoints.join('，') }}</div>
            </div>
          </template>
        </el-form-item>
        <el-form-item v-if="!isTemplate" label="提取Prompt" prop="prompt">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.prompt"
            placeholder="根据文档内容，在基金合同中提取关联度较高的原文内容，请输出对应的原文，按照段落顺序，从上到下换行输出"
            style="width: 100%"></el-input>
          <p class="tips">
            提示：通过优化Prompt，可以显著提升合同内容提取的精确度，有利于提升合同审核的准确率；若留空不填，系统将默认采用预设的Prompt来帮助您。
          </p>
        </el-form-item>
        <el-form-item v-if="!isTemplate" label="提取关键词">
          <div class="keywords-controls">
            <div class="keywords-buttons">
              <el-button
                type="text"
                size="medium"
                :loading="keywordsLoading"
                :disabled="!form.content"
                @click="handleAutoAnalysis">
                自动分析
              </el-button>
              <el-button type="text" size="medium" @click="handleAddKeyword">
                新增关键词
              </el-button>
            </div>
            <div class="match-mode-controls">
              <el-radio-group v-model="form.match_all" size="small">
                <el-radio :label="false">任意匹配</el-radio>
                <el-radio :label="true">完全匹配</el-radio>
              </el-radio-group>
              <el-tooltip
                effect="dark"
                placement="top"
                popper-class="match-mode-tooltip">
                <div slot="content" class="tooltip-content">
                  匹配方式会影响最终提取结果<br />
                  任意匹配：提取的片段命中关键词中一个就算有效片段<br />
                  完全匹配：提取的片段需要命中所有关键词才算有效片段
                </div>
                <i class="el-icon-question match-mode-tip"></i>
              </el-tooltip>
            </div>
          </div>

          <div class="type-list">
            <el-tag
              class="type-item"
              v-for="text in form.keywords"
              :key="text"
              type="info"
              effect="dark"
              disable-transitions
              closable
              @close="handleDeleteTag(text)">
              <tooltip-over
                :content="text"
                :width="120"
                justifyContent="center"></tooltip-over>
            </el-tag>
          </div>
          <p class="tips">
            提示：关键词主要指文档中提到的核心内容，增加提取的关键词有利于进一步提升合同内容提取的精确度。
          </p>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import TooltipOver from '../components/TooltipOver.vue';
import { laws as lawsApi } from '@/store/api';

export default {
  name: 'add-law-rule-dialog',
  components: {
    TooltipOver,
  },
  props: {
    lawName: {
      type: String,
      required: true,
    },
    currentRule: {
      type: [Object, null],
      default: () => {},
    },
    typeOptions: {
      type: Array,
      default: () => [],
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isEditedRuleContent() {
      return this.currentRule && this.currentRule.content !== this.form.content;
    },
  },
  watch: {
    isEditedRuleContent() {
      if (this.isEditedRuleContent) {
        this.form.update_check_points = false;
      } else {
        this.form.update_check_points = null;
      }
    },
  },
  data() {
    return {
      form: {
        scenario_ids: [],
        content: '',
        keywords: [],
        prompt: '',
        match_all: false,
      },
      rules: {
        scenario_ids: [
          { required: true, message: '请选择应用场景', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入文档内容', trigger: 'blur' },
        ],
      },
      existsCheckPoints: [],
      keywordsLoading: false,
    };
  },
  methods: {
    async init() {
      if (this.currentRule) {
        this.form = {
          scenario_ids: this.currentRule.scenarios.map((item) => item.id),
          content: this.currentRule.content,
          keywords: this.currentRule.keywords,
          prompt: this.currentRule.prompt,
          match_all: this.currentRule.match_all,
          update_check_points: null,
        };
        try {
          const { exists_ids } = await lawsApi.getCheckPointsExistsIdsByRule(
            this.currentRule.id,
          );
          this.existsCheckPoints = exists_ids;
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    async handleAutoAnalysis() {
      try {
        this.keywordsLoading = true;
        const { keywords } = await lawsApi.getRuleKeywords({
          content: this.form.content,
        });
        this.form.keywords = Array.from(
          new Set([...this.form.keywords, ...keywords]),
        );
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.keywordsLoading = false;
      }
    },
    handleAddKeyword() {
      this.$prompt('请输入关键词', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '请输入内容';
          }
          if (this.form.keywords.includes(value)) {
            return '关键词已存在';
          }
        },
      })
        .then(({ value }) => {
          this.form.keywords.push(value);
        })
        .catch(() => {});
    },
    handleDeleteTag(text) {
      this.form.keywords = this.form.keywords.filter((item) => item !== text);
    },
    handleCancel() {
      this.closeDialog();
    },
    async handleConfirm() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) {
        return;
      }
      if ('update_check_points' in this.form) {
        this.form.update_check_points = Boolean(this.form.update_check_points);
      }

      this.$emit('confirm', this.form);
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.type-list {
  max-height: 105px;
  padding: 10px;

  overflow: auto;
  .type-item {
    position: relative;
    margin-bottom: 15px;
    border-radius: 10px;
    & + .type-item {
      margin-left: 10px;
    }
    &:hover {
      ::v-deep .el-tag__close {
        display: block;
      }
    }

    ::v-deep .el-tag__close {
      position: absolute;
      right: -10px;
      top: -10px;
      color: #ffffff;
      background-color: $--color-primary;
      display: none;
    }
  }
}
.tips {
  margin-top: 5px;
  line-height: 18px;
  color: #b14435;
}
.display-check-points {
  display: flex;
  column-gap: 20px;
  .display-check-points-title {
    flex-shrink: 0;
  }
}

.keywords-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .keywords-buttons {
    display: flex;
    gap: 0;
  }

  .match-mode-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .match-mode-tip {
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss">
.match-mode-tooltip {
  &.el-tooltip__popper {
    max-width: 300px;

    .tooltip-content {
      line-height: 1.5;
      white-space: nowrap;
    }
  }
}
</style>
