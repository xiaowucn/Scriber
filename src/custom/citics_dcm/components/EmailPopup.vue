<template>
  <div class="email-popup">
    <el-dialog
      visible
      :before-close="handleClose"
      :close-on-click-modal="false"
      title="邮箱信息">
      <el-form
        ref="emailForm"
        :model="emailForm"
        :rules="emailFormRules"
        label-width="70px">
        <el-form-item prop="email" label="邮箱：">
          <el-input
            v-model="emailForm.email"
            type="text"
            clearable
            placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input
            v-model="emailForm.password"
            type="password"
            clearable
            autocomplete="new-password"
            placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { citicsDCM as citicsDCMApi } from '@/store/api';

export default {
  name: 'emailPopup',
  props: {
    emailProjectId: {
      type: [String, Number],
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      emailForm: {
        email: '',
        password: '',
      },
      emailFormRules: {
        email: { validator: this.validateEmail, trigger: 'blur' },
        password: { validator: this.validatePassword, trigger: 'blur' },
      },
    };
  },
  created() {
    this.initEmail();
  },
  methods: {
    initEmail() {
      this.emailForm.email = this.emailAddress;
    },
    validateEmail(rule, value, cb) {
      const reg = /.+@citics\.com$/;
      if (!value.trim()) {
        cb(new Error('邮箱不能为空'));
      } else if (!reg.test(value.trim())) {
        cb(new Error('请输入正确的邮箱'));
      } else {
        cb();
      }
    },
    validatePassword(rule, value, cb) {
      if (!value.trim()) {
        cb(new Error('密码不能为空'));
      } else {
        cb();
      }
    },
    handleClose() {
      this.$emit('close');
    },
    async handleSubmit() {
      const isValid = await this.$refs['emailForm'].validate().catch(() => {});
      if (isValid) {
        try {
          const params = {
            email_address: this.emailForm.email,
            email_password: this.emailForm.password,
          };
          await citicsDCMApi.updateProject(this.emailProjectId, params);
          this.$notify({
            title: '成功',
            message: '邮箱配置成功',
            type: 'success',
          });
          this.$emit('close');
          this.$emit('fetch-projects');
        } catch (e) {
          this.$notify({
            title: '提示',
            message: e.message,
            type: 'error',
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.email-popup {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding-left: 30px;
      padding-right: 50px;
    }
  }
}
</style>
