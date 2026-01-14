<template>
  <div>
    <el-form
      ref="configForm"
      :model="configForm"
      :rules="configFormRules"
      label-position="left"
      label-width="80px">
      <el-form-item label="提取模式:" class="mode">
        <el-select
          v-model="configForm.name"
          size="small"
          placeholder="请选择提取模式"
          clearable
          :disabled="configSelectDisabled"
          @change="setCurrentExtractionMode">
          <el-option
            v-for="(item, index) in allModelClasses"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <div v-if="showConfigTips" class="config-tips">
          <i class="el-icon-warning-outline"></i>
          提取模式与父级不一致，将影响提取效果，请知悉
        </div>
        <el-popover
          v-if="isShowHelper"
          placement="bottom-end"
          width="555"
          popper-class="mold-config-helper"
          trigger="hover">
          <ul>
            <li v-for="(item, index) in allModelClasses" :key="index">
              <strong>{{ item.label }}:</strong>
              <span>{{ item.data.doc }}</span>
            </li>
          </ul>
          <el-button type="text" size="mini" slot="reference">帮助</el-button>
        </el-popover>
      </el-form-item>
      <template v-if="currentExtractionMode">
        <el-form-item label="">
          <div class="doc">
            <span>{{ currentExtractionMode.data.doc }}</span>
            <template
              v-if="!isShowHelper && currentExtractionMode.value !== 'auto'">
              <el-button
                type="text"
                size="mini"
                @click="handleShowExample(currentExtractionMode.value)">
                示例
              </el-button>
            </template>
          </div>
        </el-form-item>
        <el-form-item
          v-if="showSelectPrimaryKey"
          :label="currentExtractionMode.primaryKeyConfig.desc">
          <el-checkbox-group
            v-model="currentExtractionMode.primaryKeyConfig.checked">
            <el-checkbox
              v-for="item in currentExtractionMode.primaryKeyConfig.children"
              :key="item.data.label"
              :label="item.data.label">
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="showAdvancedSettings" label="高级设置:">
          <ul class="config-list">
            <li
              v-for="(config, index) in currentExtractionMode.configList"
              :key="index">
              <template v-if="config.name !== 'kv_directions'">
                <div class="title">
                  <el-checkbox v-model="config.checked">
                    <span>{{ config.desc }}</span>
                  </el-checkbox>
                  <el-input
                    v-if="config.need_input"
                    v-model="config.input"
                    :disabled="!config.checked"
                    size="mini"
                    placeholder=""></el-input>
                  <el-radio-group
                    v-model="config.input"
                    :disabled="!config.checked">
                    <el-radio
                      v-for="(item, index) in config.enum"
                      :label="item"
                      :key="index">
                      {{ enumMap[item] }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <el-input
                  v-if="config.need_reg"
                  type="textarea"
                  v-model="config.regs"
                  :disabled="!config.checked"
                  placeholder="输入正则表达式，多条请通过换行区分">
                </el-input>
              </template>
              <template v-if="config.name === 'kv_directions'">
                <div class="title">
                  <span>{{ config.desc }}</span>
                  <i
                    class="el-icon-question icon-example"
                    title="示例"
                    @click="handleShowExample('kv_directions')">
                  </i>
                  <el-checkbox-group v-model="config.checked_options">
                    <el-checkbox
                      v-for="(option, index) in config.options"
                      :key="index"
                      :label="option"
                      :disabled="kvDirectionsOptionDisabled(config, option)">
                      {{ kvDirectionsOptionMap[option] }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <span class="tips">（提示：请选择至少一个数据结构）</span>
                </div>
                <el-input
                  v-if="model.children.length === 0"
                  type="textarea"
                  v-model="config.neglect_regs"
                  :disabled="
                    config.checked_options.length !== config.options.length
                  "
                  placeholder="输入忽略的提取值，多个值请通过换行区分">
                </el-input>
                <span
                  v-if="
                    model.children.length > 0 &&
                    config.checked_options.length === config.options.length
                  "
                  class="tips">
                  请在组合类型子项上设置忽略提取答案的正则表达式,
                  <i class="link" @click="gotoFirstFieldConfigSettings">跳转</i>
                </span>
              </template>
            </li>
          </ul>
        </el-form-item>
      </template>
    </el-form>

    <el-dialog
      v-if="exampleModelKey"
      width="1000px"
      class="model-config-example-dialog"
      :visible="true"
      append-to-body>
      <el-button
        icon="el-icon-close"
        circle
        size="mini"
        class="close-example-btn"
        @click="exampleModelKey = ''"></el-button>
      <img :src="exampleImageSrc" class="example-img" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'schema-mold-extraction-config',
  props: {
    model: {
      type: Object,
      required: true,
    },
    versionId: {
      type: Number,
      required: true,
    },
    predictors: {
      type: Array,
      required: false,
      default: () => [],
    },
    isShowHelper: {
      type: Boolean,
      default: false,
    },
    fieldType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      configForm: {
        name: '',
        path: [],
        models: [],
      },
      configFormRules: {
        name: [{ required: true, message: '名称不能为空' }],
      },
      currentExtractionMode: {},
      currentExtractionModeCloned: null,
      parentModelConfig: null,
      configSelectDisabled: false,
      showConfigTips: false,
      enumMap: {
        PARAGRAPH: '段落',
        TABLE: '表格',
      },
      kvDirectionsOptionMap: {
        left_and_right: '左右结构',
        up_and_down: '上下结构',
      },
      exampleModelKey: '',
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('schemaModule', ['schemas']),
    allModelClasses() {
      const allModels = _.clone(this.schemas.allPredictModelClass);
      allModels.forEach((model) => {
        model.configList = [];
        Object.keys(model.data).forEach((key) => {
          const ignoredKeys = [
            'doc',
            'name',
            'config_key',
            'sub_primary_key',
            '__config',
          ];

          if (model.value === 'custom_table_kv') {
            ignoredKeys.push('neglect_regs');
          }

          const mode = model.data[key];

          if (key === 'sub_primary_key') {
            model.allow_select_primary_key =
              model.data.__config.allow_select_primary_key;
            model.primaryKeyConfig = {
              desc: mode.desc,
              children: this.model.children,
              checked: this.configForm.sub_primary_key || [],
            };
          }

          if (!ignoredKeys.includes(key)) {
            const configObj = {
              name: key,
              desc: mode.desc,
              value: mode.default,
              checked: this.getConfigCheckedStatus(key),
              input: this.getConfigInput(key),
              enum: mode.enum,
              regs: this.getConfigRegs(key),
              need_input: !!mode.need_input,
              need_reg: !!mode.need_reg,
            };

            if (key === 'kv_directions') {
              Object.assign(configObj, {
                options: mode.options,
                checked_options:
                  this.getParentNodeConfig().kv_directions ||
                  this.getConfigInput(key) ||
                  mode.default,
                neglect_regs: this.getConfigRegs('neglect_regs'),
              });
            }

            model.configList.push(configObj);
          }
        });
      });
      return allModels;
    },
    kvDirectionsOptionDisabled() {
      return (config, option) => {
        return (
          this.getParentNodeConfig().kv_directions?.length > 0 ||
          (config.checked_options.length === 1 &&
            config.checked_options[0] === option)
        );
      };
    },
    showSelectPrimaryKey() {
      const type = this.fieldType ?? this.model.meta._type.type;
      return (
        type === 'group' && this.currentExtractionMode.allow_select_primary_key
      );
    },
    showAdvancedSettings() {
      return (
        this.currentExtractionMode.value !== 'config_in_code' &&
        this.currentExtractionMode.configList.length > 0
      );
    },
    exampleImageSrc() {
      if (!this.exampleModelKey) {
        return '';
      }
      return new URL(`../images/${this.exampleModelKey}.png`, import.meta.url)
        .href;
    },
    isModified() {
      return !_.isEqual(
        this.currentExtractionModeCloned,
        this.currentExtractionMode,
      );
    },
  },
  watch: {
    model() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.configForm = {
        name: this.model.name,
        ...this.model,
      };

      const parentModelConfig = this.predictors.find((i) =>
        _.isEqual(i.path, _.tail(this.model.meta._parent)),
      );
      this.parentModelConfig = parentModelConfig;
      if (parentModelConfig) {
        this.configForm.name = parentModelConfig.models[0]?.name || '';
      }

      this.setConfigSelectDisabled();
      this.setShowConfigTips();
      this.setCurrentExtractionMode(this.configForm.name);
      this.currentExtractionModeCloned = _.cloneDeep(
        this.currentExtractionMode,
      );
    },
    handleShowExample(key) {
      this.exampleModelKey = key;
    },
    setCurrentExtractionMode(name) {
      const allModes = _.cloneDeep(this.allModelClasses);
      const mode = allModes.find((i) => i.value === name);
      if (name === 'auto') {
        mode.configList.forEach((item) => {
          if (!(item.need_input || !_.isEmpty(item.enum) || item.need_reg)) {
            item.checked = _.isNil(item.input) ? item.value : !!item.input;
          }
        });
      }
      this.currentExtractionMode = mode;
      this.setShowConfigTips();
    },
    setConfigSelectDisabled() {
      if (!this.configuration.allow_different_models) {
        this.configSelectDisabled = !_.isNil(this.parentModelConfig);
        return;
      }
      this.configSelectDisabled = false;
    },
    setShowConfigTips() {
      if (this.configForm.name === '' || _.isNil(this.parentModelConfig)) {
        this.showConfigTips = false;
        return;
      }
      this.showConfigTips =
        this.configForm.name !== this.parentModelConfig.models[0].name;
    },
    getConfigCheckedStatus(key) {
      if (this.configForm.models.length === 0) {
        return false;
      }
      const modelItem = this.configForm.models[0][key];
      if (!modelItem) {
        return false;
      } else {
        return !Array.isArray(modelItem) ? modelItem !== '' : true;
      }
    },
    getConfigInput(key) {
      if (this.configForm.models.length === 0) {
        return '';
      }
      const modelItem = this.configForm.models[0][key];
      return modelItem;
    },
    getConfigRegs(key) {
      if (this.configForm.models.length === 0) {
        return '';
      }
      const modelItem = this.configForm.models[0][key];
      if (!Array.isArray(modelItem)) {
        return '';
      } else {
        return modelItem.join('\n');
      }
    },
    getParentNodeConfig() {
      const parentModelConfig = this.predictors.find((i) =>
        _.isEqual(i.path, _.tail(this.model.meta._parent)),
      );
      if (!parentModelConfig) {
        return {};
      }
      return (
        parentModelConfig.models.find(
          (i) => i.name === this.currentExtractionMode.value,
        ) || {}
      );
    },
    async saveModelConfig({ needNotify = true } = {}) {
      const isValid = await this.$refs['configForm'].validate();
      if (!isValid) {
        return;
      }
      try {
        const modelConfig = {
          predictors: {
            path: this.model.path,
          },
        };
        if (!this.currentExtractionMode) {
          modelConfig.predictors.models = [];
        } else {
          const modeItem = {
            name: this.configForm.name,
          };
          const primaryKeyConfig = this.currentExtractionMode.primaryKeyConfig;

          if (primaryKeyConfig) {
            modelConfig.predictors.sub_primary_key = primaryKeyConfig.checked;
          }
          const checkedModeOptions = this.currentExtractionMode.configList;
          for (let i = 0; i < checkedModeOptions.length; i++) {
            const option = checkedModeOptions[i];
            let value = option.checked;
            if (option.need_input || !_.isEmpty(option.enum)) {
              if (option.checked) {
                if (
                  !option.input ||
                  (_.isString(option.input) && !option.input.trim())
                ) {
                  this.$notify({
                    title: this.$t(`message['错误']`),
                    message: `请${option.need_input ? '输入' : '选择'}${
                      option.desc
                    }`,
                    type: 'error',
                  });
                  return;
                }
                value = option.input;
              } else {
                value = option.value;
              }
            } else if (option.need_reg) {
              if (option.checked) {
                if (
                  !option.regs ||
                  (_.isString(option.regs) && !option.regs.trim())
                ) {
                  this.$notify({
                    title: this.$t(`message['错误']`),
                    message: `请输入${option.desc}`,
                    type: 'error',
                  });
                  return;
                }
                value = option.regs.split('\n');
              } else {
                value = option.value;
              }
            }

            if (option.name === 'kv_directions') {
              value = option.checked_options;
              Object.assign(modeItem, {
                neglect_regs:
                  option.neglect_regs !== ''
                    ? option.neglect_regs.split('\n')
                    : [],
              });
            }

            Object.assign(modeItem, { [option.name]: value });
          }
          modelConfig.predictors.models = [modeItem];
        }
        await this.$store.dispatch('schemaModule/updateModelConfig', {
          versionId: this.versionId,
          data: modelConfig,
        });
        if (needNotify) {
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(`message['模型配置更新成功']`),
            type: 'success',
          });
        }
        this.$refs['configForm'].resetFields();
        this.$emit('confirm');
        this.currentExtractionModeCloned = _.cloneDeep(
          this.currentExtractionMode,
        );
        return true;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    gotoFirstFieldConfigSettings() {
      this.$emit('goto-first-field-settings', this.model.children[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  padding-right: 10px;
  .el-form-item {
    &.mode {
      ::v-deep .el-form-item__content {
        .el-select {
          margin-right: 10px;
        }
        .config-tips {
          display: inline-block;
          padding: 0 5px;
          line-height: 20px;
          font-size: 12px;
          color: #333;
          border-radius: 3px;
          border: 1px solid #f00;
          background-color: #ff00001c;
          i {
            color: #f00;
          }
        }
      }
    }
    .doc {
      line-height: 24px;
      color: #999;
      .el-button {
        margin-left: 5px;
      }
    }
    .config-list {
      li {
        list-style: none;
        .title {
          display: flex;
          align-items: center;
          padding: 11px 0;
          .el-checkbox {
            display: flex;
            ::v-deep .el-checkbox__input {
              margin-top: 2px;
            }
            ::v-deep .el-checkbox__label {
              white-space: normal;
            }
          }
          .el-input {
            width: 80px;
            ::v-deep .el-input__inner {
              height: 24px;
              line-height: 24px;
            }
          }
          .el-radio-group {
            margin-left: 20px;
            .el-radio {
              margin-right: 10px;
              font-weight: normal;
            }
          }
          .el-checkbox-group {
            display: flex;
            align-items: center;
            margin-left: 10px;
            .el-checkbox {
              margin-right: 10px;
            }
          }
          .icon-example {
            margin-left: 3px;
            cursor: pointer;
            &:hover {
              color: $--color-primary;
            }
          }
          .tips {
            color: #999;
          }
        }
        .el-textarea {
          vertical-align: top;
        }
        .sub-fields {
          padding-left: 20px;
        }
        .tips {
          color: #f14f4f;
          .link {
            color: $--color-primary;
            text-decoration: underline;
            font-style: normal;
            cursor: pointer;
          }
        }
      }
    }
  }
  .el-form-item__content {
    display: flex;
    .regex-tips {
      color: red;
    }
  }
  .help-infos {
    padding: 0;
    li {
      list-style: none;
    }
  }
}
</style>
<style lang="scss">
.mold-config-helper {
  ul {
    max-height: 300px;
    overflow: auto;
    padding: 0;
    li {
      display: flex;
      align-items: baseline;
      padding: 10px 0;
      list-style: none;
      font-size: 13px;
      border-bottom: 1px solid #ebeef5;
      &:nth-child(odd) {
        background: #fafafa;
      }
      > strong {
        min-width: 120px;
        margin-right: 10px;
      }
    }
  }
}
.model-config-example-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  .close-example-btn {
    position: absolute;
    top: -14px;
    right: -14px;
    font-size: 18px;
    border: none;
    box-shadow: 0 2px 4px 0 #0000001a;
    padding: 5px;
    .el-icon-close {
      font-weight: 900;
    }
  }
  .example-img {
    width: 100%;
  }
}
</style>
