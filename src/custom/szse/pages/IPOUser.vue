<template>
  <div class="user">
    <div class="page-header">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="openUserPopup">
        {{ $t(`message['新增用户']`) }}
      </el-button>
    </div>
    <el-table :data="users.items">
      <el-table-column width="300" prop="id" label="ID"></el-table-column>
      <el-table-column
        prop="name"
        :label="$t(`message['用户名']`)"></el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="$t(`message['编辑']`)"
            placement="top">
            <el-button
              circle
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="editUser(scope.row)">
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="$t(`message['删除']`)"
            placement="top">
            <el-button
              circle
              size="small"
              type="danger"
              icon="el-icon-delete"
              :disabled="
                scope.row.id === userRole.isAdmin ||
                scope.row.id === loginUser.id
              "
              @click="deleteUser(scope.row.id)">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleChangePage"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total">
    </el-pagination>

    <div v-if="userPopupVisible" class="user-popup">
      <el-dialog visible :close-on-click-modal="false" @close="closeUserPopup">
        <span slot="title"><i class="fa fa-user fa-fw"></i> {{ mode }}</span>
        <el-form ref="userForm" :model="user" :rules="rules" label-width="90px">
          <el-form-item :label="$t(`message['用户名']`)" prop="name">
            <el-input
              v-model="user.name"
              ref="nameInput"
              :disabled="user.id === userRole.isAdmin"></el-input>
          </el-form-item>
          <el-form-item :label="$t(`message['密码']`)" prop="password">
            <el-input
              v-model="user.password"
              ref="passwordInput"
              type="password"
              autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeUserPopup">
            {{ $t(`message['取消']`) }}
          </el-button>
          <el-button type="primary" @click="updateUser">
            {{ $t(`message['确定']`) }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { userRole } from '@/store/constants';

export default {
  name: 'ipo-user',
  data() {
    return {
      user: {
        id: -1,
        name: '',
        password: '',
      },
      rules: {
        name: [{ required: true, validator: this.validateName }],
        password: [{ required: true, validator: this.validatePassword }],
      },
      userRole,
      userPopupVisible: false,
    };
  },
  computed: {
    ...mapGetters(['configuration', 'loginUser']),
    ...mapGetters('userModule', ['users', 'pager']),
    mode() {
      const mode = this.user.id === -1 ? '新增用户' : '修改用户';
      return this.$t(`message['${mode}']`);
    },
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      try {
        this.$store.dispatch('userModule/fetchUsers');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    openUserPopup() {
      this.userPopupVisible = true;
    },
    closeUserPopup() {
      this.userPopupVisible = false;
      this.resetUserForm();
    },
    resetUserForm() {
      this.user = {
        id: -1,
        name: '',
        password: '',
      };
    },
    editUser(row) {
      this.userPopupVisible = true;
      this.user.id = row.id;
      this.user.name = row.name;
    },
    validateName(rule, value, cb) {
      const name = this.user.name.trim();
      if (!name) {
        cb(new Error(this.$t(`message['用户名不能为空']`)));
        return;
      }
      const index = this.users.items.findIndex((e) => {
        return e.id !== this.user.id && e.name === name;
      });
      if (index !== -1) {
        cb(new Error(this.$t(`message['用户名不能重复']`)));
        return;
      }
      cb();
    },
    validatePassword(rule, value, cb) {
      const password = this.user.password.trim();
      const reg = /^.{6,}$/;
      if (this.user.id === -1) {
        if (password === '') {
          cb(new Error(this.$t(`message['密码不能为空']`)));
          return;
        }
        if (!reg.test(password)) {
          cb(new Error(this.$t(`message['密码需要至少6位字符']`)));
          return;
        }
      }
      cb();
    },
    async updateUser() {
      const isValid = await this.$refs['userForm'].validate();
      if (!isValid) {
        return;
      }
      try {
        const userData = {
          id: this.user.id,
          name: this.user.name,
        };
        if (this.user.password !== '') {
          userData.password = this.user.password;
        }
        await this.$store.dispatch('userModule/persistUser', {
          userData,
        });
        let tip = this.$t(`message['用户修改成功']`);
        if (userData.id === -1) {
          tip = this.$t(`message['用户新建成功']`);
        }
        this.$notify({
          title: this.$t(`message['成功']`),
          message: tip,
          type: 'success',
        });
        this.closeUserPopup();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteUser(id) {
      try {
        await this.$confirm(
          this.$t(`message['是否删除该用户?']`),
          this.$t(`message['提示']`),
          {
            customClass: 'szse-ipo-message-box',
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );
        await this.$store.dispatch('userModule/deleteUser', { id });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['用户删除成功']`),
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    handleChangePage(page) {
      const data = {
        page: page,
        size: this.pager.size,
        total: this.pager.total,
      };
      this.$store.commit('userModule/SET_USER_PAGER', data);
      this.fetchUsers();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/szse-ipo.common.scss';

.user {
  padding: 0 20px;
  .el-pagination {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
