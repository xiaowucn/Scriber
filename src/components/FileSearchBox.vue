<template>
  <div class="search-container">
    <el-select
      size="medium"
      v-model="filterBy"
      :placeholder="$t(`message['请选择']`)"
      @change="changeFilter">
      <el-option
        v-for="(item, index) in searchOptions"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input
      ref="searchInput"
      size="medium"
      clearable
      class="filter-input"
      v-model.trim="filterValue"
      @clear="handleSearchFiles"
      @keypress.enter.native="handleSearchFiles">
    </el-input>
    <el-button
      type="primary"
      class="search-btn"
      size="mini"
      @click="handleSearchFiles">
      <svg-font-icon name="search" :size="20"></svg-font-icon>
      {{ $t(`message['搜索']`) }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'file-search-box',
  data() {
    return {
      filterBy: 'fileid',
      filterValue: '',
      searchOptions: [
        {
          value: 'fileid',
          label: '文件ID',
        },
        {
          value: 'filename',
          label: '文件名',
        },
        {
          value: 'username',
          label: '标注用户',
        },
      ],
    };
  },
  created() {
    const { fileid, filename, username } = this.$route.query;
    if (fileid) {
      this.filterBy = 'fileid';
      this.filterValue = fileid;
    } else if (filename) {
      this.filterBy = 'filename';
      this.filterValue = filename;
    } else if (username) {
      this.filterBy = 'username';
      this.filterValue = username;
    }
  },
  methods: {
    validateSearchVal() {
      if (this.filterBy === 'fileid') {
        let reg = /^[0-9]*$/;
        if (!reg.test(this.filterValue)) {
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
    handleSearchFiles() {
      if (!this.validateSearchVal()) {
        return;
      }
      if (!this.filterValue) {
        this.$emit('clear');
        return;
      }
      const routeParams = {
        name: 'fileSearch',
        query: {
          [this.filterBy]: this.filterValue,
        },
      };
      this.$router.push(routeParams);
    },
    changeFilter() {
      this.filterValue = '';
      this.$refs.searchInput.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.search-container {
  display: flex;
  align-items: center;

  ::v-deep .filter-input {
    .el-input__inner {
      border-radius: 0;
    }
  }

  ::v-deep .el-select {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: transparent;
      &:focus {
        border-right: 1px solid $--color-primary;
      }
    }
  }

  ::v-deep .search-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 16px;
    font-weight: 400;
    padding: 7px 26px;
    > span {
      display: flex;
      align-items: center;
    }
  }

  .pd-icon-search {
    margin-right: 7px;
  }
}
</style>
