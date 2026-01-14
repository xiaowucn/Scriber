<template>
  <button class="go-back" type="button" @click="$emit('go-back')">
    <i class="el-icon-back"></i>
    <span>Back</span>
  </button>
</template>
<script>
export default {
  name: 'GoBack',
};
</script>
<style scoped lang="scss">
.go-back {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 8px;
  padding: 3px 8px;
  border: 1px solid #c0c0c0;
  white-space: nowrap;
  font-size: 12px;
  background-color: #f9f9fa;
  cursor: pointer;

  &:hover {
    background-color: #ededed;
  }
}
</style>
