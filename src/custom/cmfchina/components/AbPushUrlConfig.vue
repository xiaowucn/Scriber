<template>
  <div class="diff-address-config">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="AB比对推送地址:" prop="url">
        <el-input
          v-model="form.url"
          size="medium"
          clearable
          placeholder="请输入AB比对推送地址">
        </el-input>
      </el-form-item>
      <el-form-item label="是否使用大模型:" prop="use_llm">
        <el-radio-group v-model="form.use_llm">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提示词:" :prop="form.use_llm ? 'prompt' : 'empty'">
        <el-input
          v-model="form.prompt"
          type="textarea"
          :rows="5"
          :disabled="!form.use_llm"
          placeholder="请输入提示词">
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          size="medium"
          :loading="isSubmitting"
          @click="submit">
          保存
        </el-button>
        <el-link
          type="primary"
          href="api/v2/cmfchina/push-example"
          download="推送样例.json"
          target="_blank">
          推送样例json文件
        </el-link>
        <el-link
          type="primary"
          href="api/v2/cmfchina/callback-example"
          download="回调样例.json"
          target="_blank">
          回调样例json文件
        </el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchAbPushUrl, saveAbPushUrl } from '../../../store/api/cmfchina.api';

export default {
  name: 'ab-push-url-config',
  props: {
    schemaId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: {
        url: '',
        use_llm: false,
        prompt: '',
      },
      rules: {
        url: [
          {
            required: true,
            message: '请输入地址',
            trigger: ['blur', 'change'],
          },
        ],
        use_llm: [
          {
            required: true,
            message: '请选择是否使用大模型',
            trigger: ['blur', 'change'],
          },
        ],
        prompt: [
          {
            required: true,
            message: '请输入提示词',
            trigger: ['blur', 'change'],
          },
        ],
      },
      isSubmitting: false,
    };
  },
  computed: {
    pushUrl() {
      return 'api/v1/plugins/cmfchina/push_url';
    },
    callbackUrl() {
      return 'api/v1/plugins/cmfchina/callback_url';
    },
  },
  watch: {
    $route() {
      this.$refs.form.resetFields();
      this.getAbPushUrl();
    },
    'form.use_llm'(val) {
      if (!val) {
        this.form.prompt = '';
        this.$refs.form.clearValidate('prompt');
      }
    },
  },
  created() {
    this.getAbPushUrl();
  },
  methods: {
    async getAbPushUrl() {
      try {
        const res = await fetchAbPushUrl(this.schemaId);
        this.form = res || {
          url: '',
          use_llm: false,
          prompt: '',
        };
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async submit() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (valid) {
        try {
          this.isSubmitting = true;
          await saveAbPushUrl(this.schemaId, this.form);
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
          });
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.isSubmitting = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.diff-address-config {
  padding: 20px;
  .el-form {
    .el-button {
      margin-right: 20px;
    }
    .el-link {
      margin: 0 10px;
      text-decoration: underline;
      &::after {
        display: none;
      }
    }
  }
}
</style>
