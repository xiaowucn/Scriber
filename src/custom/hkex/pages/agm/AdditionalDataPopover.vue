<template>
  <div
    class="agm-additional-data-popover"
    v-loading.lock="loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="summary">
      <div class="item">
        <label>Last updated:</label>
        <span>{{ formatDate(meta.created_utc) || '-' }}</span>
      </div>
      <div class="item">
        <label>Last Year's AGM Convening Date:</label>
        <span>{{ formatDate(meta.last_convening_date) || '-' }}</span>
      </div>
      <div class="item">
        <label>Current Year's AGM Convening Date:</label>
        <span>{{ formatDate(meta.convening_date) || '-' }}</span>
      </div>
    </div>
    <div v-if="directors.length > 0" class="list">
      <ul>
        <li v-for="(item, index) in directors" :key="index">
          <p class="name">{{ item.english_name }} {{ item.chinese_name }}</p>
          <p class="capacity">{{ item.capacity }}</p>
          <p class="date">
            {{ formatDate(item.appointment_date) }}
            until
            {{ formatDate(item.resignation_date) || '-' }}
          </p>
        </li>
      </ul>
      <el-pagination
        v-if="pager.total > pager.size"
        small
        layout="prev, pager, next"
        :current-page="pager.page"
        :page-size="pager.size"
        :total="pager.total"
        @current-change="changePage"
        @size-change="changeSize">
      </el-pagination>
    </div>
    <div v-else class="empty">No Data</div>
  </div>
</template>

<script>
import { date } from '@/utils/filters';
import { fetchAgmMeta, fetchAgmDirectors } from '@/store/api/hkex.api';

export default {
  name: 'agm-additional-data-popover',
  data() {
    return {
      loading: false,
      meta: {},
      directors: [],
      pager: {
        page: 1,
        size: 5,
        total: 0,
      },
    };
  },
  watch: {
    $route() {
      this.reset();
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getAgmMeta();
      if (this.meta.convening_date && this.meta.last_convening_date) {
        this.getDirectors();
      }
    },
    async getAgmMeta() {
      try {
        this.loading = true;
        const { fileId } = this.$route.query;
        const res = await fetchAgmMeta(fileId);
        this.meta = res;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async getDirectors() {
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          page_size: this.pager.size,
          stock_code: this.meta.stock_code,
          last_convening_date: this.formatDate(this.meta.last_convening_date),
          current_convening_date: this.formatDate(this.meta.convening_date),
        };
        const res = await fetchAgmDirectors(params);
        this.directors = res.items;
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
    changePage(page) {
      this.pager.page = page;
      this.getDirectors();
    },
    changeSize(size) {
      this.pager.size = size;
      this.getDirectors();
    },
    formatDate(datetime) {
      if (!datetime) {
        return '';
      }
      return date(new Date(datetime).getTime());
    },
    reset() {
      this.meta = {};
      this.directors = [];
      this.pager = {
        page: 1,
        size: 5,
        total: 0,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.agm-additional-data-popover {
  .summary {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ffffff2e;
    .item {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
      color: #d5d5d5;
    }
    label {
      color: #43d6dd;
    }
  }
  .list {
    max-height: 60vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #606060;
      border-radius: 5px;
      &:hover {
        background-color: #6f6f6f;
      }
    }
    &::-webkit-scrollbar-track {
      display: none;
    }
    ul {
      padding-left: 13px;
      li {
        position: relative;
        margin: 5px 0;
        color: #43d6dd;
        list-style: none;
        &::before {
          content: '';
          position: absolute;
          top: 6px;
          left: -10px;
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #43d6dd;
        }
        .name {
          font-size: 12px;
          color: #fff;
        }
        .capacity {
          font-size: 12px;
          color: #b8b8b8;
        }
        .date {
          font-size: 12px;
          color: #d5d5d5;
        }
      }
    }
    .el-pagination {
      ::v-deep button {
        color: #fff;
        background-color: #222;
        &:disabled {
          color: #8b8b8b;
        }
      }
      ::v-deep .el-pager {
        li {
          background-color: #222;
          color: #d5d5d5;
          &.active {
            color: #43d6dd;
          }
        }
      }
    }
  }
  .empty {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
}
</style>
