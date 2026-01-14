<template>
  <div class="llm-demo" v-loading.fullscreen.lock="loading">
    <div class="logo">
      <img src="../../common/images/logo.svg" alt="" />
    </div>
    <div class="form-container">
      <el-form
        ref="conditionForm"
        :model="conditionForm"
        :rules="conditionFormRules"
        inline>
        <el-form-item label="Select rule name:" prop="rule">
          <el-select
            v-model="conditionForm.rule"
            size="mini"
            placeholder="Select rule name"
            @change="changeRule">
            <el-option
              v-for="rule in rules"
              :key="rule"
              :label="rule"
              :value="rule"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Select stock code:" prop="stock">
          <el-select
            v-model="conditionForm.stock"
            size="mini"
            placeholder="Select stock code">
            <el-option
              v-for="code in stock_codes"
              :key="code"
              :label="code"
              :value="code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Select mode:">
          <el-select
            v-model="conditionForm.mode"
            size="mini"
            placeholder="Select mode"
            @change="changeMode">
            <el-option
              v-for="mode in modes"
              :key="mode"
              :label="mode"
              :value="mode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getParagraph">
            Confirm
          </el-button>
          <el-button size="mini" @click="reset">Reset</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="llmDataForm" :model="llmData" :rules="llmDataRules">
        <el-form-item
          v-if="conditionForm.mode === MODEL_TYPE.PLAIN_TEXT"
          label="Paragraph location">
          <el-input
            v-model="llmData.paragraph"
            type="textarea"
            :rows="5"
            autosize
            disabled
            placeholder="paragraph location"></el-input>
        </el-form-item>
        <el-form-item
          v-if="conditionForm.mode === MODEL_TYPE.MULTI_MODAL"
          label=""
          class="el-form-item-upload"
          prop="image">
          <el-upload
            action=""
            drag
            accept="image/*"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="uploadChange">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Upload an image</div>
          </el-upload>
          <div v-if="llmData.imageUrl" class="upload-preview">
            <img :src="llmData.imageUrl" alt="" />
            <p class="image-name">{{ llmData.imageName }}</p>
            <i
              class="el-icon-error"
              title="Remove"
              @click="removeUploadedImage"></i>
          </div>
        </el-form-item>
        <el-form-item
          label="Input prompt"
          :prop="promptInputDisabled ? '' : 'prompt'">
          <el-input
            v-model="llmData.prompt"
            type="textarea"
            :rows="5"
            autosize
            :disabled="promptInputDisabled"
            placeholder="prompt"
            @input="inputChange('prompt')"></el-input>
        </el-form-item>
        <el-form-item
          v-if="conditionForm.mode === MODEL_TYPE.MULTI_MODAL"
          label="Input fields"
          :prop="fieldsInputDisabled ? '' : 'fields'">
          <el-input
            v-model="llmData.fields"
            type="textarea"
            :rows="3"
            :disabled="fieldsInputDisabled"
            placeholder="fields"
            @input="inputChange('fields')"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            size="mini"
            :loading="loading"
            @click="getResult">
            Yes
          </el-button>
        </el-form-item>
        <el-form-item label="Extraction result">
          <pre v-html="llmData.result" class="result"></pre>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  fetchEsgLLMCondition,
  fetchEsgLLMPrompt,
  fetchEsgLLMResult,
  fetchEsgLLMResultWithImage,
} from '@/store/api/hkex.esg-llm.api';

const MODEL_TYPE = {
  PLAIN_TEXT: '纯文本大模型',
  MULTI_MODAL: '多模态大模型',
};

export default {
  name: 'esg-llm-demo',
  data() {
    return {
      MODEL_TYPE,
      rules: [],
      stock_codes: [],
      modes: [MODEL_TYPE.PLAIN_TEXT, MODEL_TYPE.MULTI_MODAL],
      condition: {},
      conditionForm: {
        stock: '',
        rule: '',
        mode: MODEL_TYPE.PLAIN_TEXT,
      },
      llmData: {
        paragraph: '',
        image: null,
        imageUrl: '',
        imageName: '',
        prompt: '',
        fields: '',
        result: '',
      },
      conditionFormRules: {
        stock: [
          {
            required: true,
            message: 'Please select stock code',
            trigger: 'change',
          },
        ],
        rule: [
          {
            required: true,
            message: 'Please select rule name',
            trigger: 'change',
          },
        ],
      },
      llmDataRules: {
        image: [
          {
            required: true,
            message: 'Please upload an image',
            trigger: 'change',
          },
        ],
        prompt: [
          { required: true, message: 'Please input prompt', trigger: 'change' },
        ],
        fields: [
          { required: true, message: 'Please input fields', trigger: 'change' },
        ],
      },
      promptInputDisabled: false,
      fieldsInputDisabled: false,
      loading: false,
    };
  },
  created() {
    this.getCondition();
  },
  methods: {
    async getCondition() {
      try {
        const res = await fetchEsgLLMCondition();
        this.condition = res.result;
        this.rules = Object.keys(res.result);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getParagraph() {
      const isValid = await this.$refs.conditionForm.validate();
      if (!isValid) {
        return;
      }

      try {
        const res = await fetchEsgLLMPrompt(this.conditionForm);
        this.llmData.paragraph = res.data_message;
        this.llmData.prompt = res.prompt;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getResult() {
      const isValid = await this.$refs.llmDataForm.validate();
      if (!isValid) {
        return;
      }

      try {
        this.loading = true;
        let res = {};
        if (this.conditionForm.mode === MODEL_TYPE.PLAIN_TEXT) {
          const params = {
            data_message: this.llmData.paragraph,
            prompt: this.llmData.prompt,
          };
          res = await fetchEsgLLMResult(params);
        } else {
          const formData = new FormData();
          formData.append('image', this.llmData.image);
          formData.append('prompt', this.llmData.prompt);
          formData.append('fields', this.llmData.fields);
          res = await fetchEsgLLMResultWithImage(formData);
        }
        this.llmData.result = res.result;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    uploadChange(file) {
      this.llmData.image = file.raw;
      this.llmData.imageUrl = URL.createObjectURL(file.raw);
      this.llmData.imageName = file.name;
    },
    removeUploadedImage() {
      this.llmData.imageUrl = '';
      this.llmData.imageName = '';
    },
    changeRule(rule) {
      this.stock_codes = this.condition[rule];
      this.conditionForm.stock = '';
    },
    changeMode(mode) {
      this.reset();
      this.conditionForm.mode = mode;
    },
    inputChange(type) {
      console.log(type);
      if (type === 'prompt') {
        this.promptInputDisabled = false;
        if (this.llmData.prompt === '') {
          this.fieldsInputDisabled = false;
        } else {
          this.fieldsInputDisabled = true;
        }
        this.$refs.llmDataForm.clearValidate('fields');
      } else {
        this.fieldsInputDisabled = false;
        if (this.llmData.fields === '') {
          this.promptInputDisabled = false;
        } else {
          this.promptInputDisabled = true;
        }
        this.$refs.llmDataForm.clearValidate('prompt');
      }
    },
    reset() {
      this.conditionForm = {
        year: '',
        stock: '',
        rule: '',
        mode: MODEL_TYPE.PLAIN_TEXT,
      };
      this.llmData = {
        paragraph: '',
        image: null,
        imageUrl: '',
        imageName: '',
        prompt: '',
        fields: '',
      };
      this.$refs.conditionForm.clearValidate();
      this.$refs.llmDataForm.clearValidate();
    },
  },
};
</script>

<style lang="scss" scoped>
.llm-demo {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  .logo {
    padding: 5px 0 15px;
    border-bottom: 1px solid #dcdfe6;
    img {
      width: 80px;
    }
  }
  .el-button--primary {
    background-color: #003465;
    border-color: #003465;
    &:hover {
      opacity: 0.8;
    }
  }
  .form-container {
    padding: 10px 0;
    .el-textarea {
      ::v-deep textarea {
        min-height: 150px !important;
        max-height: 300px !important;
      }
    }
    .el-form-item-upload {
      ::v-deep .el-form-item__content {
        display: flex;
        .upload-preview {
          position: relative;
          height: 178px;
          margin-left: 50px;
          border: 1px solid #d9d9d9;
          img {
            height: 100%;
          }
          .image-name {
            line-height: 0;
            font-size: 12px;
            text-align: center;
          }
          .el-icon-error {
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 18px;
            color: #ff0000;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .result {
      min-height: 100px;
      margin-top: 40px;
      padding: 10px;
      color: #606266;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      line-height: 24px;
      white-space: pre-wrap;
    }
  }
}
</style>
