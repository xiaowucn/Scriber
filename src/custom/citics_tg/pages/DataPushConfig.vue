<template>
  <div class="citics-tg-page data-push-config">
    <el-button
      v-if="isCiticsTgAllow('push_add')"
      class="list-header"
      size="medium"
      type="primary"
      @click="pushConfigDialogVisible = true">
      <i class="fa fa-plus fa-fw"></i>
      {{ $t(`message['新增推送']`) }}
    </el-button>
    <el-table
      class="has-border"
      :empty-text="$t(`message['暂无数据']`)"
      :data="dataPushConfigItems"
      v-loading="isLoading">
      <el-table-column
        prop="id"
        label="ID"
        width="70"
        align="center"></el-table-column>
      <el-table-column
        prop="template_name"
        :label="$t(`message['模板名称']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="system"
        :label="$t(`message['系统名称']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="function"
        :label="$t(`message['功能名称']`)"
        align="center"></el-table-column>
      <el-table-column
        class-name="ellipsis-column"
        prop="email"
        :label="$t(`message['邮件地址']`)"
        align="center">
        <template slot-scope="scope">
          <p :title="scope.row.email" class="cell">{{ scope.row.email }}</p>
        </template>
      </el-table-column>
      <el-table-column
        class-name="ellipsis-column"
        prop="push_address"
        :label="$t(`message['回调地址']`)"
        align="center">
        <template slot-scope="scope">
          <p :title="scope.row.push_address" class="cell">
            {{ scope.row.push_address }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="enabled"
        :label="$t(`message['自动推送']`)"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="!isCiticsTgAllow('push_edit')"
            @change="handleCloseAutoPush(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="uname"
        :label="$t(`message['创建人']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="created_utc"
        :label="$t(`message['创建时间']`)"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="150"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip
              effect="dark"
              :content="$t(`message['编辑']`)"
              placement="top">
              <el-button
                v-if="isCiticsTgAllow('push_edit')"
                circle
                size="small"
                type="text"
                @click="handleEditPushConfig(scope.row)">
                <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="$t(`message['删除']`)"
              placement="top">
              <el-button
                v-if="isCiticsTgAllow('push_del')"
                circle
                size="small"
                type="text"
                @click="handleDeletePushConfig(scope.row)">
                <theme-icon
                  name="delete"
                  icon-class="el-icon-delete"></theme-icon>
              </el-button>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50, 100]"
      :total="pager.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange">
    </el-pagination>
    <push-config-dialog
      v-if="pushConfigDialogVisible"
      :current-edit-item="currentEditItem"
      @close="handleCloseDialog"
      @fetchList="getDataPushConfigs"></push-config-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import PushConfigDialog from '../components/PushConfigDialog.vue';
import {
  fetchPushConfigs,
  deletePushConfig,
  editPushConfig,
} from '@/store/api/citics-tg.api';
import { isCiticsTgAllow } from '../common/utils';
export default {
  name: 'citics-tg-data-push',
  components: { PushConfigDialog },
  data() {
    return {
      isLoading: false,
      dataPushConfigItems: [],
      pushConfigDialogVisible: false,
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      currentEditItem: null,
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
  },
  mounted() {
    this.getDataPushConfigs();
  },
  methods: {
    isCiticsTgAllow,
    async getDataPushConfigs() {
      try {
        this.isLoading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        const res = await fetchPushConfigs(params);
        this.dataPushConfigItems = res.data.items;
        this.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },

    handleEditPushConfig(row) {
      this.currentEditItem = _.cloneDeep(row);
      this.pushConfigDialogVisible = true;
    },

    handleDeletePushConfig(row) {
      this.$confirm('确认删除推送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deletePushConfig(row.id);
        })
        .catch(() => {});
    },

    async deletePushConfig(id) {
      try {
        await deletePushConfig(id);
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
        });
        if (this.dataPushConfigItems.length === 1 && this.pager.page !== 1) {
          this.pager.page -= 1;
        }
        this.getDataPushConfigs();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    handleCloseDialog() {
      this.pushConfigDialogVisible = false;
      this.currentEditItem = null;
    },

    handleCurrentPageChange(val) {
      this.pager.page = val;
      this.getDataPushConfigs();
    },

    handleSizeChange(val) {
      this.pager.size = val;
      this.pager.page = 1;
      this.getDataPushConfigs();
    },

    async handleCloseAutoPush(row) {
      try {
        const { id, template_id, system, email, push_address, enabled } = row;
        const data = {
          template: template_id,
          system,
          function: row.function,
          email,
          push_address,
          enabled,
          uid: this.loginUser.id,
        };
        await editPushConfig(id, data);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
