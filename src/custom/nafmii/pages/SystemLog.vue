<template>
  <div class="system-log-container">
    <div class="page-header system-log-header">
      <system-log-search-box
        @search="searchSystemLog"
        :defaultFilterTime="defaultFilterTime" />
      <div class="header-operations">
        <el-button
          size="medium"
          type="primary"
          @click="openSystemLogExportPopup">
          导出日志
        </el-button>
      </div>
    </div>
    <div class="system-log-list">
      <el-table
        height="auto"
        class="has-border"
        style="width: 100%"
        v-loading="isLoading"
        :data="systemLogs">
        <el-table-column
          label="时间"
          prop="created_utc"
          min-width="140"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column
          label="用户"
          prop="user_name"
          min-width="100"
          align="center" />
        <el-table-column
          label="用户ID"
          prop="user"
          min-width="80"
          align="center" />
        <el-table-column
          label="功能菜单"
          prop="menu"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.menu || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            {{ getSystemLogType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          label="对象"
          prop="subject"
          min-width="120"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.subject || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            {{ getSystemLogStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="IP地址"
          prop="ip"
          min-width="100"
          align="center" />
        <el-table-column
          label="浏览器版本"
          prop="client"
          min-width="100"
          align="center" />
        <el-table-column
          align="center"
          width="100"
          label="操作"
          class-name="operations"
          :fixed="$features.operationColumnFixed()">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="openSystemLogPopup(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pager.total > 0"
        background
        :layout="paginationLayout"
        :page-sizes="[10, 20, 50]"
        :current-page="pager.page"
        :page-size="pager.size"
        :total="pager.total"
        @current-change="handleChangePage"
        @size-change="handleChangeSize">
      </el-pagination>
    </div>
    <system-log-popup
      v-if="isShowSystemLogPopup"
      :current="currentSystemLog"
      @close="closeSystemLogPopup" />
    <system-log-export-popup
      v-if="isShowSystemLogExportPopup"
      @close="closeSystemLogExportPopup" />
  </div>
</template>

<script>
import SystemLogPopup from '../components/SystemLogPopup';
import SystemLogExportPopup from '../components/SystemLogExportPopup';
import SystemLogSearchBox from '../components/SystemLogSearchBox';
import { nafmii as nafmiiApi } from '../../../store/api';
import { getPaginationLayout } from '../../../utils/pagination';
import { getSystemLogType, getSystemLogStatus } from '../common/utils';
import dayjs from 'dayjs';

export default {
  name: 'system-log-page',
  components: {
    SystemLogPopup,
    SystemLogExportPopup,
    SystemLogSearchBox,
  },
  data() {
    return {
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      isLoading: false,
      systemLogs: [],
      currentSystemLog: {},
      searchParams: {},
      isShowSystemLogPopup: false,
      isShowSystemLogExportPopup: false,
      defaultFilterTime: [],
    };
  },
  created() {
    const now = dayjs();
    this.defaultFilterTime = [now.subtract(1, 'month'), now.endOf('day')];
    this.init();
  },
  computed: {
    paginationLayout() {
      return getPaginationLayout();
    },
  },
  methods: {
    getSystemLogType,
    getSystemLogStatus,
    init() {
      this.searchParams = {
        start: this.defaultFilterTime[0].unix(),
        end: this.defaultFilterTime[1].unix(),
      };
      this.fetchSystemLogList();
    },
    async fetchSystemLogList() {
      try {
        this.isLoading = true;
        let params = {
          page: this.pager.page,
          size: this.pager.size,
          ...this.searchParams,
        };
        const res = await nafmiiApi.fetchSystemLog(params);
        this.systemLogs = res.data.items;
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
    handleChangePage(page) {
      const pager = {
        ...this.pager,
        page: page,
      };
      this.pager = pager;
      this.fetchSystemLogList();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.pager,
        page: 1,
        size: size,
      };
      this.pager = pager;
      this.fetchSystemLogList();
    },
    searchSystemLog(params) {
      this.searchParams = params;
      this.handleChangePage(1);
    },
    openSystemLogPopup(row) {
      this.currentSystemLog = row;
      this.isShowSystemLogPopup = true;
    },
    closeSystemLogPopup() {
      this.isShowSystemLogPopup = false;
    },
    openSystemLogExportPopup() {
      this.isShowSystemLogExportPopup = true;
    },
    closeSystemLogExportPopup() {
      this.isShowSystemLogExportPopup = false;
    },
  },
};
</script>
