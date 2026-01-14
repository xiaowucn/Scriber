<template>
  <div class="audit-trail-container">
    <div class="audit-trail" v-loading="loading">
      <header>
        <h2>User Management</h2>
      </header>
      <div class="header">
        <el-button
          type="text"
          icon="el-icon-back"
          class="btn-back"
          @click="back">
          Back
        </el-button>
        <el-form ref="form" inline :model="form" :rules="formRules">
          <el-form-item label="Date Range">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item prop="start">
                  <el-date-picker
                    ref="datePickerStart"
                    type="date"
                    size="mini"
                    placeholder="Start date"
                    value-format="timestamp"
                    v-model="form.start"
                    :picker-options="startDatePickerOptions"
                    @change="() => changeDate('start')">
                  </el-date-picker>
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
                    v-model="form.end"
                    :picker-options="endDatePickerOptions"
                    @change="() => changeDate('end')">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="User" label-width="60px">
            <el-select
              size="mini"
              placeholder="Please select user"
              v-model="form.user_id"
              v-loadmore="getMoreUsers"
              filterable
              remote
              :remote-method="searchUsers"
              @change="changeUser">
              <el-option key="" label="All Users" :value="null"> </el-option>
              <el-option
                v-for="user in users.items"
                :key="user.id"
                :label="user.name"
                :value="user.id">
              </el-option>
              <el-option v-if="isLoadingMore" label="" value="">
                <i class="el-icon-loading"></i>
                <span style="margin-left: 10px; color: #999">loading...</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btns">
            <el-button
              type="primary"
              size="mini"
              class="button-hkex fas fa-download"
              :loading="downloadActivityLogsLoading"
              @click="downloadActivityLogs">
              Download Activity Log
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="statistics">
        <div
          v-for="item in statistics"
          :key="item.name"
          :class="['item', item.type]">
          <p class="name">{{ item.label }}</p>
          <p class="value">{{ item.count }}</p>
        </div>
      </div>

      <div>
        <el-table border stripe :data="logs.items">
          <el-table-column prop="action_time" label="Time" min-width="90">
            <template slot-scope="scope">
              {{ scope.row.action_time | datetime }}
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="Username"></el-table-column>
          <el-table-column
            prop="department"
            label="Department"></el-table-column>
          <el-table-column
            prop="role"
            label="Role"
            min-width="90"></el-table-column>
          <el-table-column
            prop="op_type"
            label="Operation type"></el-table-column>
          <el-table-column
            prop="op_detail"
            label="Detailed operation"
            min-width="200px"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :current-page="logs.pager.page"
          :page-size="logs.pager.size"
          :page-sizes="[10, 20, 50]"
          :total="logs.pager.total"
          @current-change="changePage"
          @size-change="changeSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { endTimestampOffset } from '@/store/constants';
import { downloadFileByBlob } from '@/utils';
import {
  fetchAuditTrailLogs,
  downloadActivityLog,
  fetchAuditTrailActiveUsers,
  fetchAuditTrailStatistics,
} from '@/store/api/hkex.api';

const THREE_MONTHS_MILLISECONDS = 3 * 30 * 24 * 60 * 60 * 1000;

export default {
  name: 'audit-trail',
  data() {
    return {
      loading: false,
      form: {
        start: '',
        end: '',
        user_id: null,
      },
      formRules: {
        start: [{ required: true, message: 'Please select start date' }],
        end: [{ required: true, message: 'Please select end date' }],
      },
      startDatePickerOptions: {
        disabledDate: (time) => {
          const endTime = new Date(this.form.end).getTime();
          if (!this.form.end) {
            return time.getTime() > new Date().getTime();
          }
          return (
            time.getTime() > endTime ||
            time.getTime() > new Date().getTime() ||
            time.getTime() < endTime - THREE_MONTHS_MILLISECONDS
          );
        },
      },
      endDatePickerOptions: {
        disabledDate: (time) => {
          const startTime = new Date(this.form.start).getTime();
          if (!this.form.start) {
            return time.getTime() > new Date().getTime();
          }
          return (
            time.getTime() < startTime ||
            time.getTime() > new Date().getTime() ||
            time.getTime() > startTime + THREE_MONTHS_MILLISECONDS
          );
        },
      },
      isLoadingMore: false,
      users: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
      },
      statistics: [],
      logs: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
      },
      downloadActivityLogsLoading: false,
    };
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectDom = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap',
        );
        selectDom.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.setDefaultDate();
      this.getUsers();
      this.getLogs();
      this.getStatistics();
    },
    setDefaultDate() {
      this.form.start = new Date(
        new Date().getTime() - THREE_MONTHS_MILLISECONDS,
      ).setHours(0, 0, 0, 0);
      this.form.end = new Date().setHours(0, 0, 0, 0);
    },
    back() {
      this.$router.push({ name: 'userManagement' });
    },
    async getUsers(query) {
      try {
        const params = _.omitBy(
          {
            from_date: this.form.start ? this.form.start / 1000 : '',
            to_date: this.form.end
              ? (this.form.end + endTimestampOffset) / 1000
              : '',
            q: query,
            page: this.users.pager.page,
            page_size: this.users.pager.size,
          },
          (v) => v === null || v === '',
        );
        const res = await fetchAuditTrailActiveUsers(params);
        this.users.items = [...this.users.items, ...res.items];
        this.users.pager.total = res.total;
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
    async searchUsers(query) {
      this.users.pager.page = 1;
      this.users.items = [];
      this.getUsers(query);
    },
    async getMoreUsers() {
      if (
        this.isLoadingMore ||
        this.users.pager.page * this.users.pager.size >= this.users.pager.total
      ) {
        return;
      }
      this.isLoadingMore = true;
      this.users.pager.page += 1;
      await this.getUsers();
      this.isLoadingMore = false;
    },
    async getLogs() {
      try {
        this.loading = true;
        const params = _.omitBy(
          {
            from_date: this.form.start ? this.form.start / 1000 : '',
            to_date: this.form.end
              ? (this.form.end + endTimestampOffset) / 1000
              : '',
            user_id: this.form.user_id,
            page: this.logs.pager.page,
            page_size: this.logs.pager.size,
          },
          (v) => v === null || v === '',
        );
        const res = await fetchAuditTrailLogs(params);
        this.logs.items = res.items;
        this.logs.pager.total = res.total;
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
    async getStatistics() {
      try {
        const params = _.omitBy(
          {
            from_date: this.form.start ? this.form.start / 1000 : '',
            to_date: this.form.end
              ? (this.form.end + endTimestampOffset) / 1000
              : '',
            user_id: this.form.user_id,
          },
          (v) => v === null || v === '',
        );
        const res = await fetchAuditTrailStatistics(params);
        const types = {
          user: 'user',
          review: 'review',
          answer: 'answer',
          export: 'export',
        };
        this.statistics = res.items.map((item) => {
          const labelLower = item.label.toLowerCase();
          const type =
            types[Object.values(types).find((t) => labelLower.includes(t))];
          return {
            ...item,
            type,
          };
        });
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    changeDate(type) {
      if (type === 'start' && this.form.start && !this.form.end) {
        this.$refs.datePickerEnd.focus();
        return;
      }
      if (type === 'end' && this.form.end && !this.form.start) {
        this.$refs.datePickerStart.focus();
        return;
      }
      this.users.pager.page = 1;
      this.logs.pager.page = 1;
      this.users.items = [];
      this.getUsers();
      this.getStatistics();
      this.getLogs();
    },
    changeUser() {
      this.logs.pager.page = 1;
      this.getStatistics();
      this.getLogs();
    },
    changePage(page) {
      this.logs.pager.page = page;
      this.getLogs();
    },
    changeSize(size) {
      this.logs.pager.page = 1;
      this.logs.pager.size = size;
      this.getLogs();
    },
    async downloadActivityLogs() {
      const isValid = await this.$refs['form'].validate();
      if (!isValid) {
        return;
      }

      try {
        this.downloadActivityLogsLoading = true;
        const params = _.omitBy(
          {
            time_start: this.form.start ? this.form.start / 1000 : '',
            time_end: this.form.end
              ? (this.form.end + endTimestampOffset) / 1000
              : '',
            user_id: this.form.user_id,
          },
          (v) => v === null || v === '',
        );
        const res = await downloadActivityLog(params);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.downloadActivityLogsLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';
.audit-trail-container {
  overflow: auto;
  .audit-trail {
    min-width: 1024px;
    margin: 32px 0;
    padding: 0 32px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-back {
        color: $--color-primary;
        ::v-deep .el-icon-back {
          font-weight: bold;
        }
      }
      .el-form {
        .el-form-item {
          margin-bottom: 0;
          &.btns {
            margin: 0 0 0 50px;
            .el-button {
              &::before {
                margin-right: 5px;
                vertical-align: 1px;
                font-size: 10px;
              }
            }
          }
          .el-select {
            width: 200px;
            ::v-deep .el-select__caret:first-child::before {
              content: '\e6e1';
            }
            ::v-deep .is-focus {
              .el-select__caret:first-child {
                transform: rotateZ(0deg);
              }
            }
          }
          .el-date-editor {
            width: 160px;
          }
          .date-separator {
            text-align: center;
          }
        }
      }
    }
    .statistics {
      display: flex;
      gap: 20px;
      margin: 30px 0;
      .item {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        flex: 1;
        padding: 15px;
        border: 1px solid #eaedf3;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        .name {
          margin-bottom: 10px;
          line-height: 20px;
          color: #606266;
        }
        .value {
          font-size: 16px;
        }
        &.user {
          color: #5188e1;
        }
        &.review {
          color: #f6ab2f;
        }
        &.answer {
          color: #34aa44;
        }
        &.export {
          color: #6758f3;
        }
      }
    }
    .el-table {
      overflow: initial;
      z-index: 0;
      ::v-deep .el-table__header-wrapper {
        position: sticky;
        top: 0;
        z-index: 1;
      }
      ::v-deep tr {
        th {
          .cell {
            justify-content: flex-start;
          }
        }
        td {
          .cell {
            padding: 2px 12px;
          }
        }
      }
    }
    .el-pagination {
      margin: 20px 0 0 0;
      text-align: center;
    }
  }
}
</style>
