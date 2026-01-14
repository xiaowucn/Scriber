<template>
  <div class="user-management" v-loading="loading">
    <header>
      <h2>User Management</h2>
      <div class="top">
        <div>
          <el-button
            v-if="showAddUserButton"
            type="primary"
            size="mini"
            class="button-hkex fas fa-user-plus"
            @click="addUser">
            Add User
          </el-button>
          <el-button
            type="primary"
            size="mini"
            class="button-hkex fas fa-download"
            :loading="exportUsersLoading"
            @click="exportUsers">
            Export User List
          </el-button>
          <el-button
            type="primary"
            size="mini"
            class="button-hkex fas fa-file"
            @click="gotoAuditTrail">
            Audit Trail
          </el-button>
        </div>
        <el-input
          size="mini"
          v-model="searchText"
          :placeholder="`Please input ${searchBy === 'id' ? 'id' : 'username'}`"
          clearable
          @input="handleSearchInput"
          @clear="searchUsers"
          @keyup.enter.native="searchUsers">
          <el-select
            v-model="searchBy"
            slot="prepend"
            placeholder="Please select"
            @change="changeSearchBy">
            <el-option
              v-for="(item, index) in searchByOptions"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUsers"></el-button>
        </el-input>
      </div>
    </header>

    <el-table border stripe :data="users" @sort-change="changeSort">
      <el-table-column
        width="150"
        prop="id"
        label="ID"
        align="center"
        sortable="custom"
        :sort-orders="sortOrders">
        <template slot="header" slot-scope="{}">
          ID
          <i
            :class="[
              filter.order_by === 'id' && filter.desc === 0
                ? 'el-icon-caret-top'
                : 'el-icon-caret-bottom',
              filter.order_by === 'id' ? 'active' : '',
            ]"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="Username"
        align="center"
        sortable="custom"
        :sort-orders="sortOrders">
        <template slot="header" slot-scope="{}">
          Username
          <i
            :class="[
              filter.order_by === 'name' && filter.desc === 0
                ? 'el-icon-caret-top'
                : 'el-icon-caret-bottom',
              filter.order_by === 'name' ? 'active' : '',
            ]"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="department"
        label="Department"
        align="center"
        sortable="custom"
        :sort-orders="sortOrders">
        <template slot="header" slot-scope="{}">
          Department
          <i
            :class="[
              filter.order_by === 'department' && filter.desc === 0
                ? 'el-icon-caret-top'
                : 'el-icon-caret-bottom',
              filter.order_by === 'department' ? 'active' : '',
            ]"></i>
        </template>
        <template slot-scope="scope">
          {{ getUserDepartment(scope.row.department) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email"
        align="center"
        sortable="custom"
        :sort-orders="sortOrders">
        <template slot="header" slot-scope="{}">
          Email
          <i
            :class="[
              filter.order_by === 'email' && filter.desc === 0
                ? 'el-icon-caret-top'
                : 'el-icon-caret-bottom',
              filter.order_by === 'email' ? 'active' : '',
            ]"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="Role"
        align="center"
        sortable="custom"
        :sort-orders="sortOrders">
        <template slot="header" slot-scope="{}">
          Role
          <i
            :class="[
              filter.order_by === 'role' && filter.desc === 0
                ? 'el-icon-caret-top'
                : 'el-icon-caret-bottom',
              filter.order_by === 'role' ? 'active' : '',
            ]"></i>
        </template>
        <template slot-scope="scope">
          {{ hkexUserRole[scope.row.role] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        align="center"
        sortable="custom"
        :sort-orders="sortOrders">
        <template slot="header" slot-scope="{}">
          Status
          <i
            :class="[
              filter.order_by === 'status' && filter.desc === 0
                ? 'el-icon-caret-top'
                : 'el-icon-caret-bottom',
              filter.order_by === 'status' ? 'active' : '',
            ]"></i>
        </template>
        <template slot-scope="scope">
          {{ hkexUserStatus[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column
        label="Operation"
        class-name="operation"
        width="250"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="fas fa-lock operation-btn"
            @click="openResetPasswordDialog(scope.row)">
            Reset Password
          </el-button>
          <el-button
            type="text"
            class="fas fa-edit operation-btn"
            @click="editUser(scope.row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50]"
      :total="pager.total"
      @current-change="changePage"
      @size-change="changeSize">
    </el-pagination>

    <el-dialog
      v-if="userDialogVisible"
      :visible="true"
      :title="userDialogTitle"
      width="520px"
      :close-on-click-modal="false"
      @close="closeUserDialog">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userFormRules"
        label-width="90px">
        <el-form-item label="Username" prop="name">
          <el-input
            size="mini"
            v-model="userForm.name"
            placeholder="Username"
            :disabled="isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            size="mini"
            v-model.trim="userForm.email"
            placeholder="Email"
            :disabled="isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role" :required="userFormItemRequired">
          <el-select
            size="mini"
            v-model="userForm.role"
            placeholder="Please select a role"
            :disabled="isEditMode && isOwnUser"
            @change="changeUserRole">
            <el-option
              v-for="(role, index) in userRoles"
              :key="index"
              :label="role.label"
              :value="role.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="Status"
          prop="status"
          :required="userFormItemRequired">
          <el-select
            size="mini"
            v-model="userForm.status"
            placeholder="Please select a status"
            :disabled="isEditMode && isOwnUser">
            <el-option
              v-for="(status, index) in userStatus"
              :key="index"
              :label="status.label"
              :value="status.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showModules" label="Modules">
          <el-checkbox-group
            v-model="userForm.page_module"
            class="modules-checkbox">
            <el-checkbox
              v-for="module in modules"
              :key="module.value"
              :label="module.value"
              :disabled="module.disabled">
              {{ module.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="!isEditMode" label="">
          <p class="tips">
            Password will be sent to the user email upon confirmation.
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="el-footer">
        <el-button @click="closeUserDialog">Cancel</el-button>
        <el-button type="primary" @click="updateUser">OK</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="resetPasswordDialogVisible"
      :visible="true"
      title="Reset Password"
      width="520px"
      :close-on-click-modal="false"
      @close="closeResetPasswordDialog">
      <div class="tips">
        A new password will be sent to the user email (
        <a :href="`mailto: ${userForm.email}`">{{ userForm.email }}</a>
        ) upon confirmation.
      </div>
      <div slot="footer" class="el-footer">
        <el-button @click="closeResetPasswordDialog">Cancel</el-button>
        <el-button type="primary" @click="resetUserPassword">Reset</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="downloadActivityLogDialogVisible"
      title="Download Activity Log"
      :visible="true"
      width="520px"
      :close-on-click-modal="false"
      @close="closeDownloadActivityLogDialog">
      <el-form
        ref="downloadActivityLogForm"
        :model="downloadActivityLogForm"
        :rules="downloadActivityLogFormRules"
        label-width="120px">
        <el-form-item label="Date Range" required>
          <el-col :span="11">
            <el-form-item prop="start">
              <el-date-picker
                ref="datePickerStart"
                type="date"
                size="mini"
                placeholder="Start date"
                value-format="timestamp"
                v-model="downloadActivityLogForm.start"
                :picker-options="startDatePickerOptions"
                @change="() => changeDate('start')"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="date-separator" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="end">
              <el-date-picker
                ref="datePickerEnd"
                type="date"
                size="mini"
                placeholder="End date"
                value-format="timestamp"
                v-model="downloadActivityLogForm.end"
                :picker-options="endDatePickerOptions"
                @change="() => changeDate('end')"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="el-footer">
        <el-button @click="closeDownloadActivityLogDialog">Cancel</el-button>
        <el-button
          type="primary"
          :loading="downloadActivityLogLoading"
          @click="downloadActivityLog">
          Download
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { downloadFileByBlob } from '@/utils';
import {
  hkexUserRole,
  hkexUserStatus,
  endTimestampOffset,
  USER_PLATFORM,
  HKEX_USER_ROLE,
} from '@/store/constants';

export default {
  name: 'user-management',
  data() {
    return {
      hkexUserRole,
      hkexUserStatus,
      loading: false,
      exportUsersLoading: false,
      searchText: '',
      searchBy: 'id',
      searchByOptions: [
        {
          value: 'id',
          label: 'By ID',
        },
        {
          value: 'name',
          label: 'By Username',
        },
      ],
      userRoles: [
        {
          value: 1,
          label: 'Business Admin',
        },
        {
          value: 2,
          label: 'General User',
        },
      ],
      userStatus: [
        {
          value: 1,
          label: 'Active',
        },
        {
          value: 2,
          label: 'Inactive',
        },
      ],
      users: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      filter: {
        order_by: 'id',
        desc: 1,
      },
      resetPasswordDialogVisible: false,
      isEditMode: false,
      userDialogVisible: false,
      userDialogTitle: 'Add User',
      userForm: {
        id: null,
        name: '',
        email: '',
        role: '',
        status: 1,
        page_module: [],
        default_page_modules: [],
      },
      userFormRules: {
        name: [{ required: true, validator: this.validateUsername }],
        email: [{ required: true, validator: this.validateEmail }],
        role: [{ required: true, message: 'Please select a role' }],
        status: [{ required: true, message: 'Please select a status' }],
      },
      modules: [],
      sortOrders: ['ascending', 'descending'],
      downloadActivityLogDialogVisible: false,
      downloadActivityLogLoading: false,
      downloadActivityLogForm: {
        start: '',
        end: '',
      },
      downloadActivityLogFormRules: {
        start: [{ required: true, message: 'Please select start date' }],
        end: [{ required: true, message: 'Please select end date' }],
      },
      startDatePickerOptions: {
        disabledDate: (time) => {
          const endTime = new Date(this.downloadActivityLogForm.end).getTime();
          if (!this.downloadActivityLogForm.end) {
            return time.getTime() > new Date().getTime();
          }
          return (
            time.getTime() > endTime || time.getTime() > new Date().getTime()
          );
        },
      },
      endDatePickerOptions: {
        disabledDate: (time) => {
          const startTime = new Date(
            this.downloadActivityLogForm.start,
          ).getTime();
          return (
            time.getTime() < startTime || time.getTime() > new Date().getTime()
          );
        },
      },
    };
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    isOwnUser() {
      return this.userForm.id === this.loginUser.id;
    },
    userFormItemRequired() {
      return !this.isOwnUser;
    },
    showAddUserButton() {
      return this.loginUser.platform !== USER_PLATFORM.AZURE;
    },
    showModules() {
      return this.isEditMode && this.userForm.platform === USER_PLATFORM.AZURE;
    },
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        this.loading = true;
        const res = await this.$store.dispatch(
          'hkexModule/fetchUsers',
          _.omitBy(
            {
              page: this.pager.page,
              size: this.pager.size,
              ...this.filter,
              [this.searchBy]: this.searchText,
            },
            (v) => v === null || v === '',
          ),
        );
        this.users = res.items;
        this.pager.total = res.total;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    setUserModules() {
      const { page_modules } = this.configuration;
      this.modules = Object.keys(page_modules).map((key) => {
        const disabled =
          this.userForm.role === HKEX_USER_ROLE.BUSINESS_ADMIN
            ? true
            : this.userForm.default_page_modules.includes(page_modules[key]);
        return {
          label: key,
          value: page_modules[key],
          disabled: disabled,
        };
      });
    },
    handleSearchInput(val) {
      if (this.searchBy === 'id') {
        this.searchText = val.replace(/\D/g, '');
      }
    },
    changeSearchBy() {
      this.searchText = '';
      this.searchUsers();
    },
    changeUserRole(role) {
      if (!this.showModules) {
        return;
      }

      if (role === HKEX_USER_ROLE.BUSINESS_ADMIN) {
        this.modules.forEach((module) => {
          module.disabled = true;
        });
        this.userForm.page_module = Object.values(
          this.configuration.page_modules,
        );
      } else {
        const userDefaultPageModules = this.userForm.default_page_modules;
        this.modules.forEach((module) => {
          if (!userDefaultPageModules.includes(module.value)) {
            module.disabled = false;
          }
        });
        this.userForm.page_module = userDefaultPageModules;
      }
    },
    searchUsers() {
      this.pager.page = 1;
      this.getUsers();
    },
    addUser() {
      this.isEditMode = false;
      this.userDialogTitle = 'Add User';
      this.openUserDialog();
    },
    getUserDepartment(value) {
      const { departments } = this.configuration;
      const entry = Object.entries(departments).find(([, v]) => v === value);
      return entry ? entry[0] : '';
    },
    editUser(row) {
      this.userForm = _.clone(row);
      this.setUserModules();
      this.isEditMode = true;
      this.userDialogTitle = 'Edit User';
      this.openUserDialog();
    },
    async updateUser() {
      const isValid = await this.$refs['userForm'].validate();
      if (isValid) {
        try {
          const { id, name, email, role, status, page_module } = this.userForm;
          if (this.isEditMode) {
            const data = { email, role, status };
            if (this.showModules) {
              data.page_module = page_module;
            }
            await this.$store.dispatch('hkexModule/editUser', { id, data });
          } else {
            const data = { name, email, role, status };
            await this.$store.dispatch('hkexModule/addUser', data);
            this.pager.page = 1;
            this.filter = {
              order_by: 'id',
              desc: 1,
            };
          }

          this.$notify({
            title: 'Success',
            message: `${
              !this.isEditMode ? 'Create' : 'Update'
            } user successfully.`,
            type: 'success',
          });

          this.closeUserDialog();
          this.getUsers();
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async resetUserPassword() {
      try {
        const { id } = this.userForm;
        const data = { id, data: { password: 'reset' } };
        await this.$store.dispatch('hkexModule/editUser', data);
        this.$notify({
          title: 'Success',
          message: `Reset user password successfully.`,
          type: 'success',
        });
        this.closeResetPasswordDialog();
        if (this.loginUser.id === id) {
          await this.$store.dispatch('logout');
          this.$router.push({ name: 'login' });
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    openResetPasswordDialog(row) {
      const { id, name, email, role, status } = row;
      this.userForm = {
        id,
        name,
        email,
        role,
        status,
      };
      if (!this.userForm.email) {
        this.$notify({
          title: 'Warning',
          message: 'Please complete the email.',
          type: 'warning',
        });
        return;
      }
      this.resetPasswordDialogVisible = true;
    },
    closeResetPasswordDialog() {
      this.resetPasswordDialogVisible = false;
      this.resetUserForm();
    },
    openUserDialog() {
      this.userDialogVisible = true;
    },
    closeUserDialog() {
      this.userDialogVisible = false;
      this.resetUserForm();
    },
    changePage(page) {
      this.pager.page = page;
      this.getUsers();
    },
    changeSize(size) {
      this.pager.page = 1;
      this.pager.size = size;
      this.getUsers();
    },
    changeSort({ prop, order }) {
      this.pager.page = 1;
      this.filter = {
        order_by: prop,
        desc: order ? (order === 'descending' ? 1 : 0) : null,
      };
      this.getUsers();
    },
    resetUserForm() {
      this.userForm = {
        ...this.userForm,
        id: null,
        name: '',
        email: '',
        role: '',
        status: 1,
        page_module: [],
      };
    },
    validateUsername(rule, value, cb) {
      const name = this.userForm.name;
      if (!name) {
        cb(new Error('Please enter the username'));
        return;
      }
      cb();
    },
    validateEmail(rule, value, cb) {
      const email = this.userForm.email;
      const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!email) {
        cb(new Error('Please enter the email'));
        return;
      }
      if (!reg.test(email)) {
        cb(new Error('Email format is incorrect'));
        return;
      }
      cb();
    },
    async exportUsers() {
      try {
        this.exportUsersLoading = true;
        const res = await this.$store.dispatch('hkexModule/exportUsers');
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.exportUsersLoading = false;
      }
    },
    changeDate(type) {
      if (
        type === 'start' &&
        this.downloadActivityLogForm.start &&
        !this.downloadActivityLogForm.end
      ) {
        this.$refs.datePickerEnd.focus();
      }
      if (
        type === 'end' &&
        this.downloadActivityLogForm.end &&
        !this.downloadActivityLogForm.start
      ) {
        this.$refs.datePickerStart.focus();
      }
    },
    openDownloadActivityLogDialog() {
      this.downloadActivityLogDialogVisible = true;
    },
    closeDownloadActivityLogDialog() {
      this.downloadActivityLogDialogVisible = false;
      this.downloadActivityLogForm = {
        start: '',
        end: '',
      };
    },
    async downloadActivityLog() {
      const isValid = await this.$refs['downloadActivityLogForm'].validate();
      if (isValid) {
        try {
          this.downloadActivityLogLoading = true;
          const { start, end } = this.downloadActivityLogForm;
          const res = await this.$store.dispatch(
            'hkexModule/downloadActivityLog',
            {
              time_start: start / 1000,
              time_end: (end + endTimestampOffset) / 1000,
            },
          );
          await downloadFileByBlob(res);
          this.closeDownloadActivityLogDialog();
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.downloadActivityLogLoading = false;
        }
      }
    },
    gotoAuditTrail() {
      this.$router.push({ name: 'auditTrail' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';

.user-management {
  margin: 32px 0;
  padding: 0 32px;
  overflow: auto;
  header {
    position: sticky;
    top: 0;
    z-index: 1;
    margin-bottom: 0;
    background-color: #fff;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    .el-button {
      font-size: 14px;
      &::before {
        font-size: 12px;
        vertical-align: 1px;
      }
    }
    .el-input {
      width: 400px;
      ::v-deep > .el-input__inner {
        border: 1px solid #dcdfe6;
        &:focus {
          border: 1px solid $--color-blue;
        }
      }
      ::v-deep .el-input--suffix {
        width: 125px;
      }
    }
  }
  ::v-deep .el-table {
    overflow: initial;
    z-index: 0;
    .el-table__header-wrapper {
      position: sticky;
      top: 88px;
      z-index: 1;
    }
    .el-table__body-wrapper {
      overflow: hidden;
    }
    th {
      padding: 10px 0;
      .cell {
        display: flex;
        align-items: center;
        i[class^='el-icon-'] {
          color: #76b9be;
          &.active {
            color: #fff;
          }
        }
      }
      .caret-wrapper {
        display: none;
      }
    }
    td {
      padding: 5px 10px;
    }
    .operation {
      .el-button {
        margin: 0 10px;
        > span {
          font-weight: normal;
        }
        &.operation-btn::before {
          font-size: 12px;
          vertical-align: 1px;
          color: $--color-primary;
        }
      }
    }
  }
  .el-pagination {
    margin: 20px 0 0 0;
    text-align: center;
  }
  ::v-deep .el-dialog {
    .el-dialog__body {
      .el-form {
        .el-input,
        .el-select {
          width: 100%;
        }
        .date-separator {
          text-align: center;
        }
        .modules-checkbox {
          display: flex;
          flex-flow: column;
          .el-checkbox {
            .el-checkbox__label {
              vertical-align: -1px;
            }
            &.is-checked {
              &.is-disabled {
                .el-checkbox__input {
                  border-color: $--color-blue;
                  color: $--color-blue;
                }
                .el-checkbox__label {
                  color: $--color-blue;
                }
              }
            }
          }
        }
      }
      .tips {
        line-height: 22px;
        color: $--color-primary;
        :is(a) {
          color: #3f9eff;
        }
      }
    }
    .el-dialog__footer {
      .el-footer {
        text-align: center;
        .el-button {
          padding: 8px 30px;
          border-radius: 0;
        }
      }
    }
  }
}
</style>
