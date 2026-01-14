<template>
  <div class="user user-container">
    <div class="page-header user-header">
      <nafmii-user-search-box
        v-if="showNafmiiUserSearchBox"
        @search="handleSearchFiles">
      </nafmii-user-search-box>
      <el-button
        v-if="!$platform.isCscEnv()"
        size="medium"
        type="primary"
        @click="openUserPopup">
        <i
          :class="
            $platform.isDefaultEnv()
              ? 'fa fa-plus fa-fw'
              : 'el-icon-circle-plus'
          "></i>
        {{ $t(`message['新增用户']`) }}
      </el-button>
      <div class="search-container" v-if="!showNafmiiUserSearchBox">
        <el-select
          size="medium"
          v-model="filterBy"
          :placeholder="$t(`message['请选择']`)">
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
    </div>
    <el-table
      v-bind="
        $style.user.tableHeight ? { height: $style.user.tableHeight } : {}
      "
      v-loading="users.isLoading"
      :class="{ 'user-table-csc': $platform.isCscEnv() }"
      class="has-border"
      :data="users.items">
      <el-table-column width="150" prop="id" label="ID"></el-table-column>
      <el-table-column
        prop="name"
        :label="$t(`message['用户名']`)"
        min-width="200"></el-table-column>
      <el-table-column
        prop="note"
        :label="$t(`message['备注']`)"
        min-width="200"></el-table-column>
      <el-table-column
        prop="expired_utc"
        :label="$t(`message['到期时间']`)"
        min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.expired_utc">
            {{ scope.row.expired_utc | date }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="permission"
        :label="$t(`message['权限']`)"
        min-width="440">
        <template slot-scope="scope">
          <div class="permission-list">
            <el-tag
              size="medium"
              v-for="perm in getPermissionTags(scope.row.permission || [])"
              :key="perm.key">
              {{ perm.label }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        :fixed="$features.operationColumnFixed()"
        width="150"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="$t(`message['编辑']`)"
            placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
              size="small"
              circle
              @click="editUser(scope.row)">
              <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="$t(`message['删除']`)"
            placement="top">
            <el-button
              circle
              @click="deleteUser(scope.row.id)"
              :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
              size="small"
              :disabled="
                scope.row.id === userRole.isAdmin ||
                scope.row.id === loginUser.id
              ">
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
      :layout="paginationLayout"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <user-popup
      v-if="users.current"
      :current="users.current"
      @persist-user="persistUser"
      @close="closeUserPopup">
    </user-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { userRole, dayTime } from '@/store/constants';
import { getPaginationLayout } from '@/utils/pagination';
import UserPopup from '@/components/UserPopup';
import NafmiiUserSearchBox from '../custom/nafmii/components/NafmiiUserSearchBox.vue';

export default {
  name: 'user-page',
  components: {
    UserPopup,
    NafmiiUserSearchBox,
  },
  data() {
    return {
      userRole,
      filterBy: 'name',
      filterValue: '',
      searchOptions: [
        {
          value: 'name',
          label: this.$t(`message['用户名']`),
        },
        {
          value: 'note',
          label: this.$t(`message['备注']`),
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['configuration', 'loginUser']),
    ...mapGetters('userModule', [
      'users',
      'userPermissions',
      'pager',
      'params',
    ]),
    showNafmiiUserSearchBox() {
      return this.$platform.isNafmiiEnv();
    },
    paginationLayout() {
      return getPaginationLayout();
    },
  },
  created() {
    this.init();
    this.fetchUsers();
  },
  methods: {
    init() {
      const { name, note } = this.params;
      if (name) {
        this.filterBy = 'name';
        this.filterValue = name;
      } else if (note) {
        this.filterBy = 'note';
        this.filterValue = note;
      }
    },
    async fetchUsers() {
      try {
        this.$store.commit('userModule/SET_LOADING', true);
        await this.$store.dispatch('userModule/fetchUsers');
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('userModule/SET_LOADING', false);
      }
    },
    handleSearchFiles(searchData) {
      let params;
      if (this.$platform.isNafmiiEnv()) {
        params = { ...searchData };
      } else {
        params = { [this.filterBy]: this.filterValue };
      }
      this.$store.commit('userModule/SET_USER_PARAMS', params);
      this.$store.commit('userModule/SET_USER_PAGER', {
        page: 1,
        size: 10,
        total: 0,
      });
      this.fetchUsers();
    },
    getPermissionTags(perms) {
      const list = [];

      perms.forEach((item) => {
        const existedItem = this.userPermissions.find(
          (perm) => perm.value === item.perm,
        );
        if (existedItem) {
          list.push(existedItem);
        } else {
          list.push({ value: item.perm, label: item.perm });
        }
      });
      return list.sort((a, b) => a.value - b.value);
    },
    openUserPopup() {
      this.$store.commit('userModule/SET_EMPTY_USER');
    },
    closeUserPopup() {
      this.$store.commit('userModule/SET_CUR_USER', null);
    },
    editUser(row) {
      this.$store.commit('userModule/SET_CUR_USER', {
        id: row.id,
        name: row.name,
        note: row.note,
        expired_utc: row.expired_utc
          ? (row.expired_utc - dayTime) * 1000
          : null,
        password: '',
        permission: (row.permission || []).map((e) => e.perm),
      });
    },
    async persistUser({ userData }) {
      try {
        await this.$store.dispatch('userModule/persistUser', {
          userData,
        });
        this.closeUserPopup();
        let tip = this.$t(`message['用户修改成功']`);
        if (userData.id === -1) {
          tip = this.$t(`message['用户新建成功']`);
        }
        this.$notify({
          title: this.$t(`message['成功']`),
          message: tip,
          type: 'success',
        });
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    handleChangePage(page) {
      let data = {
        ...this.pager,
        page: page,
        size: this.pager.size,
      };
      this.$store.commit('userModule/SET_USER_PAGER', data);
      this.fetchUsers();
    },
    handleChangeSize(size) {
      let data = {
        ...this.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('userModule/SET_USER_PAGER', data);
      this.fetchUsers();
    },
    async deleteUser(id) {
      try {
        await this.$confirm(
          this.$t(`message['是否删除该用户?']`),
          this.$t(`message['提示']`),
          {
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
  },
};
</script>

<style lang="scss" scoped>
.user {
  padding: 0 20px;
  height: calc(100% - 61px);
  overflow-y: auto;
  .user-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-container {
    display: flex;
    align-items: center;

    ::v-deep .filter-input {
      .el-input__inner {
        border-radius: 0;
      }
    }

    ::v-deep .el-select {
      width: 210px;
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
  .el-tag {
    margin: 5px 0;
    &:not(:last-of-type) {
      margin-right: 10px;
    }
  }
  .el-tag:not(:last-of-type) {
    margin-right: 10px;
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
  .user-table-csc {
    margin-top: 20px;
  }
}
</style>
