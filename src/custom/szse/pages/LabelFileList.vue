<template>
  <div class="szse-label-file-list" v-loading="loading">
    <div class="banner">
      <h4>标注文件列表</h4>
      <div class="filter-options">
        <div class="filter">
          <span>筛选：</span>
          <el-select
            v-model="filterMoldId"
            placeholder="请选择"
            size="mini"
            @change="getFileList">
            <el-option
              v-for="item in molds"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="search">
          <span>查找：</span>
          <el-input
            placeholder="文件名称"
            size="mini"
            v-model="filterText"
            @keyup.enter.native="getFileList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getFileList"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <el-table :data="files">
      <el-table-column
        prop="id"
        label="文件ID"
        align="center"
        width="80"></el-table-column>
      <el-table-column
        prop="file_name"
        label="文件名称"
        align="center"></el-table-column>
      <el-table-column
        prop="mold_name"
        label="所属任务"
        align="center"></el-table-column>
      <el-table-column
        prop="created_utc"
        label="上传时间"
        align="center"></el-table-column>
      <el-table-column
        prop="mark_users"
        label="标注人员"
        align="center"></el-table-column>
      <el-table-column
        prop="progress"
        label="标注进度"
        align="center"></el-table-column>
      <el-table-column prop="status" label="标注状态" align="center">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_utc"
        label="标注更新时间"
        align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="openFileDetails(scope.row)"
            >查看</el-button
          >
          <!-- <el-button type="text" class="btn-delete" @click="deleteFile(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="changePage"></el-pagination>
  </div>
</template>

<script>
import { questionStatus } from '@/store/constants';
import { fetchSZSELabelFiles } from '@/store/api/file.api';
import { fetchAllSchema } from '@/store/api/schema.api';

export default {
  name: 'SZSE-label-file-list',
  data() {
    return {
      loading: true,
      pager: {
        page: 1,
        size: 20,
      },
      files: [],
      molds: [],
      filterText: '',
      filterMoldId: null,
    };
  },
  filters: {
    getStatus(status) {
      return questionStatus[status];
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getFileList();
      this.getAllSchemas();
    },
    async getAllSchemas() {
      const res = await fetchAllSchema();
      const molds = res.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      this.molds = [{ id: 0, name: '全部' }].concat(molds);
    },
    async getFileList() {
      try {
        this.loading = true;
        const query = Object.assign({}, this.pager, {
          mold: this.filterMoldId || 0,
          filename: this.filterText,
        });
        const res = await fetchSZSELabelFiles(query);
        const data = res.data;
        this.files = data.items;
        this.pager = {
          page: data.page,
          size: data.size,
          total: data.total,
        };
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.pager.page = page;
      this.getFileList();
    },
    openFileDetails(file) {
      const { id, tree_id, mold_id, qid, file_name } = file;
      const routeParams = {
        name: 'remark',
        params: { qid: qid },
        query: {
          treeId: tree_id,
          fileId: id,
          schemaId: mold_id,
          projectId: qid,
          fileName: file_name,
        },
      };
      const { href } = this.$router.resolve(routeParams);
      window.open(href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.szse-label-file-list {
  padding: 20px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    h4 {
      font-size: 14px;
      color: #666;
    }
    .filter-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .filter {
        margin-right: 30px;
      }
      .search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          width: 60px;
        }
      }
    }
  }
  .el-alert {
    margin-bottom: 10px;
  }
  ::v-deep .el-table {
    th {
      background: #f6f7fb;
    }
    .cell {
      .el-tag {
        position: relative;
        min-width: 80px;
        border-radius: 15px;
        line-height: 24px;
        &::before {
          content: '';
          position: absolute;
          top: 9px;
          left: 8px;
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #409eff;
        }
        &.el-tag--success {
          &::before {
            background: #67c23a;
          }
        }
      }
    }
  }
  ::v-deep .el-input-group__append {
    background-color: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
  }
  .btn-delete {
    color: #f56c6c;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
