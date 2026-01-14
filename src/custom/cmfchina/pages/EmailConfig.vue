<template>
  <div class="mail-config" v-loading="loading">
    <div class="page-header">
      <el-button size="medium" type="primary" @click="dialogVisible = true">
        <i class="fa fa-plus fa-fw"></i>
        新增邮箱配置
      </el-button>
      <search-box :search-data="searchOptions" @search="search"></search-box>
    </div>

    <el-table
      ref="table"
      height="auto"
      :data="emailConfigList"
      @sort-change="handleSortChange">
      <el-table-column
        prop="id"
        align="center"
        label="ID"
        width="80"></el-table-column>
      <el-table-column prop="account" align="center" label="账户">
      </el-table-column>
      <el-table-column
        prop="host"
        align="center"
        label="服务器地址"></el-table-column>
      <el-table-column prop="project_name" align="center" label="项目">
        <template slot-scope="scope">
          {{ scope.row.project_name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="mold_name" align="center" label="场景">
        <template slot-scope="scope">
          {{ scope.row.mold_name || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="user_name"
        align="center"
        label="创建人"></el-table-column>
      <el-table-column
        prop="created_utc"
        align="center"
        label="创建时间"
        sortable="custom"
        width="170">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_utc"
        align="center"
        label="修改时间"
        sortable="custom"
        width="170">
        <template slot-scope="scope">
          {{ scope.row.updated_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="editMailConfig(scope.row)">
              <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="deleteEmailConfig(scope.row)">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>

    <el-dialog
      v-if="dialogVisible"
      visible
      :close-on-click-modal="false"
      @close="closeDialog">
      <span slot="title">
        {{ emailConfigForm.id ? '编辑' : '新增' }}邮箱配置
      </span>
      <el-form
        ref="emailConfigForm"
        :rules="formRules"
        :model="emailConfigForm"
        label-width="100px">
        <el-form-item label="服务器地址" prop="host">
          <el-input
            v-model="emailConfigForm.host"
            placeholder="请输入服务器地址">
          </el-input>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model="emailConfigForm.account" placeholder="请输入账户">
          </el-input>
        </el-form-item>
        <el-form-item v-if="emailConfigForm.id" label="更新授权密码">
          <el-switch v-model="shouldUpdatePassword"></el-switch>
        </el-form-item>
        <el-form-item
          v-if="showPasswordFormItem"
          :label="`${shouldUpdatePassword ? '新授权密码' : '授权密码'}`"
          prop="password">
          <el-input
            v-model="emailConfigForm.password"
            type="password"
            placeholder="请输入授权密码">
          </el-input>
        </el-form-item>
        <el-form-item label="项目" prop="pid">
          <el-select
            v-model="emailConfigForm.pid"
            clearable
            filterable
            :popper-append-to-body="false"
            placeholder="请选择项目">
            <el-option
              v-for="project in projects"
              :key="project.id"
              :value="project.id"
              :label="project.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景" prop="mold_id">
          <el-select
            v-model="emailConfigForm.mold_id"
            clearable
            filterable
            :popper-append-to-body="false"
            placeholder="请选择场景">
            <el-option
              v-for="mold in molds"
              :key="mold.id"
              :label="mold.name"
              :value="mold.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { getSortParams } from '../../../utils';
import { fetchProjects } from '../../../store/api/project.api';
import {
  createEmailConfig,
  updateEmailConfig,
  deleteEmailConfig,
  fetchEmailConfigList,
} from '../../../store/api/cmfchina.api';
import SearchBox from '../components/SearchBox';

export default {
  name: 'email-config',
  components: {
    SearchBox,
  },
  data() {
    return {
      emailConfigList: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      dialogVisible: false,
      projects: [],
      molds: [],
      emailConfigForm: {
        id: null,
        host: '',
        account: '',
        password: '',
        pid: null,
        mold_id: null,
      },
      shouldUpdatePassword: false,
      formRules: {
        host: [
          {
            required: true,
            message: '请输入服务器地址',
            trigger: ['blur', 'change'],
          },
        ],
        account: [
          {
            required: true,
            message: '请输入账户',
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change'],
          },
        ],
      },
      searchOptions: {
        dateOptions: [
          {
            label: '创建时间',
            value: 'created_utc',
          },
          {
            label: '修改时间',
            value: 'updated_utc',
          },
        ],
      },
      searchParams: {},
      sortParams: {},
      loading: false,
      submitLoading: false,
    };
  },
  computed: {
    showPasswordFormItem() {
      if (this.emailConfigForm.id) {
        return this.shouldUpdatePassword;
      }
      return true;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getMailConfigList();
      this.getProjects();
      this.getMolds();
    },
    async getMailConfigList() {
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
          ...this.searchParams,
          ...this.sortParams,
        };
        const res = await fetchEmailConfigList(params);
        this.emailConfigList = res.data.items;
        this.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async getProjects() {
      try {
        const params = {
          page: 1,
          size: 9999,
        };
        const res = await fetchProjects(params);
        this.projects = res.data.items;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getMolds() {
      try {
        const data = await this.$store.dispatch('schemaModule/fetchAllSchemas');
        this.molds = data.items;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    search(params) {
      this.searchParams = params;
      this.pager.page = 1;
      this.getMailConfigList();
    },
    submit() {
      if (!this.emailConfigForm.id) {
        this.createEmailConfig();
      } else {
        this.updateEmailConfig();
      }
    },
    async createEmailConfig() {
      const valid = await this.$refs.emailConfigForm.validate().catch(() => {});
      if (!valid) {
        return;
      }

      try {
        this.submitLoading = true;
        const data = _.omitBy(this.emailConfigForm, (v) => {
          return v === null || v === '';
        });
        await createEmailConfig(data);
        this.$notify({
          title: '成功',
          message: '新增邮箱配置成功',
          type: 'success',
        });
        this.closeDialog();
        this.pager.page = 1;
        this.getMailConfigList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitLoading = false;
      }
    },
    async updateEmailConfig() {
      const valid = await this.$refs.emailConfigForm.validate().catch(() => {});
      if (!valid) {
        return;
      }

      try {
        this.submitLoading = true;
        const ignoredFields = this.shouldUpdatePassword
          ? ['id']
          : ['id', 'password'];
        let data = _.omit(this.emailConfigForm, ignoredFields);
        data = _.omitBy(data, (v) => {
          return v === null || v === '';
        });
        await updateEmailConfig(this.emailConfigForm.id, data);
        this.$notify({
          title: '成功',
          message: '修改邮箱配置成功',
          type: 'success',
        });
        this.closeDialog();
        this.getMailConfigList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitLoading = false;
      }
    },
    async deleteEmailConfig(row) {
      const confirm = await this.$confirm('是否删除该邮箱配置？', '提示').catch(
        () => {},
      );
      if (confirm === 'confirm') {
        try {
          await deleteEmailConfig(row.id);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.pager.page = 1;
          this.getMailConfigList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    handleChangePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = page;
      this.getMailConfigList();
    },
    handleChangeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = 1;
      this.pager.size = size;
      this.getMailConfigList();
    },
    handleSortChange({ prop, order }) {
      this.sortParams = getSortParams(prop, order);
      this.getMailConfigList();
    },
    editMailConfig(row) {
      this.dialogVisible = true;
      const currentMailConfig = _.cloneDeep(row);
      this.emailConfigForm = {
        id: currentMailConfig.id,
        host: currentMailConfig.host,
        account: currentMailConfig.account,
        password: currentMailConfig.password,
        pid: currentMailConfig.pid,
        mold_id: currentMailConfig.mold_id,
      };
    },
    closeDialog() {
      this.dialogVisible = false;
      this.emailConfigForm = {
        id: null,
        host: '',
        account: '',
        password: '',
        pid: null,
        mold_id: null,
      };
      this.shouldUpdatePassword = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.mail-config {
  .page-header {
    display: flex;
    justify-content: space-between;
  }
  .el-form {
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
