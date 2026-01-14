<template>
  <div class="login">
    <img src="@/custom/szse/assets/annual-logo-1.png" alt="logo" class="logo" />
    <el-form ref="form" :model="user" :rules="rules">
      <el-form-item prop="name">
        <el-input
          v-model="user.name"
          ref="nameInput"
          placeholder="账户"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="user.password"
          type="password"
          placeholder="密码"
          @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="isLoading"
          :disabled="isLoading"
          type="primary"
          @click="login">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'log-in',
  props: {
    redirect: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      user: {
        name: '',
        password: '',
      },
      rules: {
        name: {
          required: true,
          message: '账户不能为空',
          trigger: 'blur',
        },
        password: {
          required: true,
          message: '密码不能为空',
          trigger: 'blur',
        },
      },
      isLoading: false,
    };
  },
  methods: {
    async login() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) {
        return;
      }
      try {
        this.isLoading = true;
        await this.$store.dispatch('login', this.user);

        this.$notify({
          title: '成功',
          message: '登录成功',
          type: 'success',
        });

        if (this.redirect) {
          this.$router.push(decodeURIComponent(this.redirect));
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('~@/custom/szse/assets/annual-bg.png') no-repeat;
  background-size: cover;

  .el-form {
    margin-top: 60px;
    width: 470px;

    .el-form-item {
      margin-bottom: 40px;
    }
  }

  .el-button {
    width: 100%;
    background: #4b7dd0;
  }
}
</style>
