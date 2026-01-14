<template>
  <div class="login-wrapper">
    <img v-if="isShowLogo" src="@/assets/logo.svg" alt="logo" class="logo" />
    <div class="login-form-wrapper">
      <h1 class="login-title">{{ $t(`message['登录']`) }}</h1>
      <el-form
        ref="form"
        :model="user"
        status-icon
        :rules="rules"
        label-position="top"
        label-width="50px"
        class="login-form">
        <el-form-item :label="$t(`message['用户名']`)" prop="name">
          <el-input v-model="user.name" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t(`message['密码']`)" prop="password">
          <el-input
            v-model="user.password"
            type="password"
            clearable
            @keyup.enter.native="login"></el-input>
        </el-form-item>
        <div class="login-button">
          <el-link
            v-if="this.$features.supportLoginWithMicrosoftAD()"
            :underline="false"
            :href="ssoLoginUrl">
            <el-button plain class="button-login-with-microsoft">
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1452"
                width="15"
                height="15">
                <path
                  d="M0 0h486.592v486.592H0z"
                  fill="#F25022"
                  p-id="1453"></path>
                <path
                  d="M537.408 0H1024v486.592H537.408z"
                  fill="#7FBA00"
                  p-id="1454"></path>
                <path
                  d="M0 537.408h486.592V1024H0z"
                  fill="#00A4EF"
                  p-id="1455"></path>
                <path
                  d="M537.408 537.408H1024V1024H537.408z"
                  fill="#FFB900"
                  p-id="1456"></path>
              </svg>
              Login with Microsoft AD
            </el-button>
          </el-link>
          <el-button type="primary" :loading="isLoading" @click="login">
            {{ $t(`message['登录']`) }}</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login-page',
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
        name: [
          {
            required: true,
            message: this.$t(`message['用户名不能为空']`),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$t(`message['密码不能为空']`),
            trigger: 'blur',
          },
        ],
      },
      isLoading: false,
    };
  },
  computed: {
    isShowLogo() {
      return !this.$platform.isCustomerEnv();
    },
    ssoLoginUrl() {
      const ssoUrl = 'api/v2/saml/sso';
      if (this.redirect) {
        return `${ssoUrl}?redirect=${encodeURIComponent(this.redirect)}`;
      }
      return ssoUrl;
    },
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
          title: this.$t(`message['成功']`),
          message: this.$t(`message['登录成功！']`),
          type: 'success',
        });
        if (this.redirect) {
          this.$router.push(decodeURIComponent(this.redirect));
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
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

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  flex-flow: column;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #fbfbfb;

  .logo {
    width: 150px;
    position: fixed;
    top: 20px;
    left: 60px;
  }

  .login-form-wrapper {
    margin: 0 auto;
    width: 400px;
    border: 1px solid #e4e4e4;
    box-shadow: 0 4px 12px 0 rgba(89, 87, 90, 0.08);
    border-radius: 4px;

    .login-title {
      margin: 0;
      color: #3e3f42;
      padding: 20px 30px;
      font-size: 20px;
      font-weight: 500;
      border-bottom: 1px solid #eaedf3;
    }
  }

  .login-form {
    padding: 30px 30px 20px 30px;

    ::v-deep .el-form-item__label {
      padding: 0;
      color: #9ea0a5;
    }

    .login-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 50px;
      .el-link {
        flex: 1;
        margin-right: 30px;
      }
      .el-button {
        flex: 1;
        &.el-button--primary {
          background: #1b9ebc;
          border-color: #1b9ebc;
        }
        &.button-login-with-microsoft {
          ::v-deep > span {
            display: flex;
            align-items: center;
            svg {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
