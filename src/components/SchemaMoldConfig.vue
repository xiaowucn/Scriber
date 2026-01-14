<template>
  <el-dialog
    :visible="visible"
    width="500px"
    :close-on-click-modal="false"
    @close="close">
    <span slot="title" class="el-dialog__title"
      >{{ dialogTitle }} 提取模式设置</span
    >
    <div>
      <el-form ref="configForm" :model="configForm" :rules="configFormRules">
        <el-form-item label="设置该字段的提取模式为" prop="name">
          <el-select
            v-model="configForm.selectedModel"
            size="mini"
            placeholder="请选择提取模式">
            <el-option
              v-for="(item, index) in allPredictModelClass"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-popover
            placement="bottom-end"
            width="350"
            popper-class="mold-config-helper"
            trigger="hover">
            <ul>
              <li v-for="(item, index) in allPredictModelClass" :key="index">
                <strong>{{ item.label }}:</strong>
                <span>{{ item.data.doc }}</span>
              </li>
            </ul>
            <el-button type="text" size="mini" slot="reference">帮助</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-show="showAPIAddress"
          label="API地址"
          label-width="80px"
          prop="apiAddress">
          <el-input
            size="mini"
            v-model="configForm.apiAddress"
            placeholder="请输入API地址"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="visible = false">{{
        $t(`message['取消']`)
      }}</el-button>
      <el-button type="primary" @click="saveModelConfig">{{
        $t(`message['确定']`)
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'schema-mold-config',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    const validateUrl = (rule, value, callback) => {
      const reg = /^(http|https):\/\/.*/i;
      if (value === '') {
        callback(new Error('请输入API地址'));
      } else {
        if (!reg.test(value)) {
          callback(new Error('API地址格式不正确'));
        } else {
          callback();
        }
      }
    };
    return {
      visible: true,
      modelConfigTemplate: '',
      showAPIAddress: false,
      configForm: {
        selectedModel: '',
        apiAddress: '',
      },
      configFormRules: {
        apiAddress: [{ validator: validateUrl, trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('schemaModule', ['schemas']),
    isShowModelAbroad() {
      return !!this.configuration.model_abroad;
    },
    allPredictModelClass() {
      let modelClasses = _.clone(this.schemas.allPredictModelClass);
      if (!this.isShowModelAbroad) {
        const index = modelClasses.findIndex(
          (item) => item.value === 'remote_call',
        );
        if (index !== -1) {
          modelClasses.splice(index, 1);
        }
      }
      return modelClasses;
    },
    dialogTitle() {
      return this.model.fullPath.join('-');
    },
  },
  watch: {
    'configForm.selectedModel'() {
      const selectedModel = this.allPredictModelClass.find(
        (item) => item.value === this.configForm.selectedModel,
      );
      if (selectedModel) {
        this.showAPIAddress = selectedModel.value === 'remote_call';
        this.modelConfigTemplate = JSON.stringify(selectedModel.data.template);
      }
    },
  },
  created() {
    if (this.model.name) {
      this.configForm = {
        selectedModel: this.model.name.model,
        apiAddress: this.model.name.api,
      };
    }
  },
  methods: {
    async saveModelConfig() {
      let modelConfig = JSON.parse(this.modelConfigTemplate);
      const fullPath = _.clone(this.model.fullPath);
      fullPath.shift();
      modelConfig.path = fullPath;
      if (this.showAPIAddress) {
        const isValid = await this.$refs['configForm'].validate();
        if (!isValid) {
          return;
        }
        modelConfig.api = this.configForm.apiAddress;
      }
      this.$emit('modify-model-config', modelConfig);
      this.close();
    },
    close() {
      this.$emit('close');
      this.selectedModel = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item__content {
    .el-select {
      width: 53%;
      margin-right: 20px;
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
  margin-top: 5px;
  ul {
    max-height: 200px;
    overflow: auto;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      padding: 10px 0;
      list-style: none;
      border-bottom: 1px solid #ebeef5;
      &:nth-child(odd) {
        background: #fafafa;
      }
      > strong {
        min-width: 90px;
        margin-right: 10px;
      }
    }
  }
}
</style>
