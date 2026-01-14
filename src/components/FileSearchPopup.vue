<template>
  <div>
    <el-button icon="el-icon-search" size="small" @click="handleSearchClick">{{
      $t(`message['文件搜索']`)
    }}</el-button>
    <el-dialog
      :title="$t(`message['文件搜索']`)"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="closeDialog">
      <el-radio-group v-model="filterVal" @change="changeFilter">
        <el-radio label="filename">{{ $t(`message['文件名']`) }}</el-radio>
        <el-radio label="fileid">{{ $t(`message['文件ID']`) }}</el-radio>
        <el-radio label="username">{{ $t(`message['标注用户']`) }}</el-radio>
      </el-radio-group>
      <div class="search-file-content">
        <el-input
          v-model.trim="searchVal"
          :placeholder="CONDITIONS[filterVal]"
          @keyup.enter.native="searchFile"
          ref="searchInput">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t(`message['取消']`) }}</el-button>
        <el-button type="primary" @click="searchFile">{{
          $t(`message['确定']`)
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'file-search-popup',
  data() {
    return {
      dialogVisible: false,
      filterVal: 'filename',
      searchVal: '',
      CONDITIONS: {
        filename: this.$t(`message['请输入文件名']`),
        fileid: this.$t(`message['请输入文件ID']`),
        username: this.$t(`message['请输入标注用户']`),
      },
    };
  },
  methods: {
    handleSearchClick() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    validateSearchVal() {
      if (!this.searchVal) {
        this.$notify({
          title: this.$t(`message['警告']`),
          message: this.$t(`message['输入不能为空']`),
          type: 'warning',
        });
        return false;
      } else if (this.filterVal === 'fileid') {
        let reg = /^[0-9]*$/;
        if (!reg.test(this.searchVal)) {
          this.$notify({
            title: this.$t(`message['警告']`),
            message: this.$t(`message['请输入数字']`),
            type: 'warning',
          });
          return false;
        }
      }
      return true;
    },
    searchFile() {
      if (!this.validateSearchVal()) {
        return;
      }
      this.dialogVisible = false;
      const routeParams = {
        name: 'fileSearch',
        query: {
          [this.filterVal]: this.searchVal,
        },
      };
      this.$router.push(routeParams);
    },
    changeFilter() {
      this.searchVal = '';
      this.$refs.searchInput.focus();
    },
  },
};
</script>

<style scoped>
.search-file-content {
  margin-top: 25px;
}
</style>
