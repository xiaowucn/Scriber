<template>
  <div class="file-search">
    <div v-if="$platform.isCgsEnv()">
      <span>基金管理人名称</span>
      <el-input
        size="mini"
        clearable
        v-model.trim="search.manager_name"
        @keydown.enter.native="handleSearchFiles"></el-input>
    </div>
    <div v-if="$platform.isCgsEnv()">
      <span>产品名称</span>
      <el-input
        size="mini"
        clearable
        v-model.trim="search.product_name"
        @keydown.enter.native="handleSearchFiles"></el-input>
    </div>
    <div>
      <el-input
        ref="searchInput"
        size="mini"
        clearable
        v-model.trim="filterValue"
        @keydown.enter.native="handleSearchFiles">
        <el-select
          v-model="filterBy"
          slot="prepend"
          placeholder="请选择"
          @change="changeFilterBy">
          <el-option
            v-for="(item, index) in searchOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-input>
    </div>
    <div>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-search"
        @click="handleSearchFiles"></el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { EventBus } from '@/utils';

export default {
  name: 'file-search',
  props: {
    currentTab: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      search: {
        manager_name: '',
        product_name: '',
      },
      additionalSearch: {},
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
      timer: null,
    };
  },
  created() {
    this.init();
    EventBus.$on('after-reparse-file', this.handleAfterReparseFile);
    EventBus.$on('filter-files-by-condition', this.filterFilesByCondition);
  },
  beforeDestroy() {
    EventBus.$off('after-reparse-file', this.handleAfterReparseFile);
    EventBus.$off('filter-files-by-condition', this.filterFilesByCondition);
    clearInterval(this.timer);
  },
  methods: {
    init() {
      const query = this.$route.query;
      if (!_.isEmpty(query)) {
        const { manager_name, product_name } = query;
        if (manager_name) {
          this.search.manager_name = manager_name;
        }
        if (product_name) {
          this.search.product_name = product_name;
        }
        const currentSearchOption = this.searchOptions.find((option) => {
          return Object.keys(this.$route.query).find((i) => i === option.value);
        });
        if (currentSearchOption) {
          this.filterBy = currentSearchOption.value;
          this.filterValue = this.$route.query[this.filterBy];
        }
      }
    },
    handleSearchFiles() {
      this.searchFiles();
    },
    async searchFiles() {
      try {
        if (this.filterBy === 'fileid' && !/^[0-9]*$/.test(this.filterValue)) {
          this.$notify({
            title: '提示',
            message: '文件ID请输入数字',
            type: 'info',
          });
          return;
        }
        const projectId = this.$route.params.projectId;
        const params = _.omitBy(
          {
            ...this.search,
            [this.filterBy]: this.filterValue,
            ...this.additionalSearch,
          },
          (v) => ['', 'ALL'].includes(v),
        );

        if (this.currentTab === 'projectRecycleFiles') {
          EventBus.$emit('filter-recycle-files-by-condition', params);
          return;
        }

        if (projectId) {
          await this.$store.dispatch('fileModule/fetchFilesByStatus', {
            projectId: this.$route.params.projectId,
            query: params,
          });
          this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', params);
          EventBus.$emit('after-search-files');
        } else {
          const query = _.omit(params, ['page', 'size']);
          if (_.isEmpty(query)) {
            this.$emit('clear');
            return;
          }
          const routeParams = {
            name: 'fileSearch',
            query,
          };
          this.$router.push(routeParams);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleAfterReparseFile() {
      const hasFilterValue = [
        this.search.manager_name,
        this.search.product_name,
        this.filterValue,
      ].some((v) => v !== '');
      if (hasFilterValue) {
        this.searchFiles();
        this.timer = setInterval(() => {
          this.searchFiles();
        }, 180e3);
      } else {
        this.$store.dispatch('detailModule/fetchFileList');
      }
    },
    filterFilesByCondition({ field, value }) {
      this.additionalSearch = { ...this.additionalSearch, [field]: value };
      this.searchFiles();
    },
    changeFilterBy() {
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.file-search {
  display: flex;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    margin-left: 15px;
    color: #777;
    font-size: 14px;
    .el-input {
      flex: 1;
      margin-left: 10px;
      ::v-deep .el-input-group__prepend {
        min-width: 55px;
      }
      ::v-deep .el-input-group__append {
        .el-button--primary {
          background-color: #409eff;
          border-radius: 0 4px 4px 0;
          color: #fff;
          &:hover {
            background: #66b1ff;
          }
        }
      }
    }
    > .el-select {
      margin-left: 10px;
    }
  }
}
</style>
