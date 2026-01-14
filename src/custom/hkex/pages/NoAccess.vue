<template>
  <div class="permission-denied">
    <img src="../common/images/no-access.svg" alt="" />
    <p>Sorry, you are currently without access to the system.</p>
    <div class="btns">
      <router-link to="/login">
        <el-button type="text" size="">Return to the Login Page</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'permission-denied',
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.permission-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -10%;
  img {
    width: 200px;
  }
  p {
    margin-top: 20px;
    font-size: 16px;
    color: #989fb0;
  }
  .btns {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    .el-button {
      color: $--color-primary;
      text-decoration: underline;
      &:hover {
        opacity: 0.85;
      }
    }
  }
}
</style>
