<template>
  <div class="auth-expired">
    <img src="@/assets/logo.svg" alt="logo" class="logo" />
    <div class="content">
      <h2>授权到期</h2>
      <p>您的系统授权已到期，请联系您的客户经理授权！</p>
      <img src="@/images/auth-expired.svg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'unauthorized-page',
};
</script>

<style lang="scss" scoped>
.auth-expired {
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
  .content {
    width: 400px;
    margin: 0 auto;
    text-align: center;
    h2 {
      color: #303133;
    }
    p {
      margin: 15px 0 25px;
      color: #909399;
    }
    img {
      width: 70%;
    }
  }
}
</style>
