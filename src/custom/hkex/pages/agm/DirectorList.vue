<template>
  <div class="director-container" v-loading.fullscreen="loading">
    <div class="header">
      <div class="info">
        <section>
          <h2>List of Directors</h2>
          <span class="updated-time"
            >(Last updated: {{ meta.last_updated | datetime }})</span
          >
        </section>
        <section>
          <h4>
            Stock Code: <span class="value">{{ meta.stock_code }}</span>
          </h4>
          <h4>
            <p>
              Last AGM Convening Date:
              <span class="value">
                {{ formatDate(meta.last_convening_date) }}
              </span>
              <el-tooltip
                v-if="meta.dummy_last_convening_date"
                effect="dark"
                content="Auto-generated based on current AGM"
                placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p>
              Current AGM Convening Date:
              <span class="value">{{ formatDate(meta.convening_date) }}</span>
            </p>
          </h4>
        </section>
      </div>
      <div class="filter">
        <el-radio-group
          v-model="filterMode"
          size="mini"
          @change="changeFilterMode">
          <el-radio-button label="long_term_ined">
            INED with a term of not less than 9 years
          </el-radio-button>
          <el-radio-button label="new_director">New Directors</el-radio-button>
        </el-radio-group>
        <div class="director-type">
          <span class="label">Director Type</span>
          <el-select
            v-model="filter.capacity"
            size="mini"
            placeholder="Please select a director type"
            @change="changeDirectorType">
            <el-option
              v-for="type in directorTypes"
              :key="type"
              :label="type"
              :value="type">
            </el-option>
          </el-select>
        </div>
        <el-button type="info" size="mini" @click="resetFilter">
          Reset
        </el-button>
      </div>
    </div>
    <el-table :data="directors">
      <el-table-column
        prop="english_company"
        label="List Company's English Name"
        align="center"></el-table-column>
      <el-table-column
        prop="stock_code"
        label="Stock Code"
        align="center"></el-table-column>
      <el-table-column
        prop="english_name"
        label="Director's English Name"
        align="center"></el-table-column>
      <el-table-column
        prop="chinese_name"
        label="Director's Chinese Name"
        align="center"></el-table-column>
      <el-table-column
        prop="capacity"
        label="Capacity"
        align="center"></el-table-column>
      <el-table-column
        prop="position"
        label="Position"
        align="center"></el-table-column>
      <el-table-column
        prop="appointment_date"
        label="Appointment Date"
        align="center">
        <template slot-scope="{ row }">
          {{ formatDate(row.appointment_date) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="resignation_date"
        label="Resignation Date"
        align="center">
        <template slot-scope="{ row }">
          {{ formatDate(row.resignation_date) }}
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
  </div>
</template>

<script>
import _ from 'lodash';
import { date } from '@/utils/filters';
import { fetchAgmMeta, fetchAgmDirectors } from '@/store/api/hkex.api';

export default {
  name: 'agm-director-list',
  data() {
    return {
      loading: false,
      filterMode: '',
      directorTypes: [
        'Alternate Director',
        'Executive Director',
        'Independent Non Executive Director',
        'Non Executive Director',
      ],
      meta: {},
      filter: {
        capacity: '',
      },
      directors: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getAgmMeta();
      this.getDirectors();
    },
    async getAgmMeta() {
      try {
        const { fileId } = this.$route.query;
        const res = await fetchAgmMeta(fileId);
        this.meta = res;
      } catch (error) {
        this.$notify({
          title: 'Error',
        });
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
          capacity: this.filter.capacity,
        };
        if (this.filterMode === 'long_term_ined') {
          Object.assign(params, {
            long_term_ined: true,
          });
        } else if (this.filterMode === 'new_director') {
          Object.assign(params, {
            new_director: true,
          });
        }
        const res = await fetchAgmDirectors(_.omitBy(params, (v) => !v));
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
    formatDate(datetime) {
      if (!datetime) {
        return '';
      }
      return date(new Date(datetime).getTime());
    },
    changeFilterMode() {
      if (this.filterMode === 'long_term_ined') {
        this.filter.capacity = '';
      }
      this.pager.page = 1;
      this.getDirectors();
    },
    resetFilter() {
      this.filterMode = '';
      this.filter.capacity = '';
      this.pager.page = 1;
      this.getDirectors();
    },
    changeDirectorType(type) {
      if (this.filterMode === 'long_term_ined') {
        this.filterMode = '';
      }
      this.filter.capacity = type;
      this.pager.page = 1;
      this.getDirectors();
    },
    changePage(page) {
      this.pager.page = page;
      this.getDirectors();
    },
    changeSize(size) {
      this.pager.size = size;
      this.getDirectors();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';

.director-container {
  padding: 0 20px;
  overflow: auto;
  .header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    min-height: 100px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    .info {
      section {
        display: flex;
        align-items: baseline;
        &:last-child {
          margin-top: 20px;
        }
        h2 {
          color: $--color-primary;
          margin-right: 10px;
        }
        h4 {
          color: #10416c;
          margin-right: 30px;
          p {
            &:last-child {
              margin-top: 10px;
            }
          }
          .value {
            color: #e62742;
          }
          .el-tooltip {
            margin-left: 3px;
            color: $--color-primary;
          }
        }
        .updated-time {
          color: #7f7f7f;
        }
      }
    }
    .filter {
      display: flex;
      align-items: center;
      .el-radio-group {
        margin-right: 20px;
        ::v-deep .el-radio-button__inner {
          border-radius: 0%;
        }
      }
      .director-type {
        display: flex;
        align-items: center;
        margin-right: 20px;
        &.disabled {
          opacity: 0.4;
        }
        .label {
          height: 28px;
          line-height: 28px;
          padding: 0 10px;
          background-color: $--color-primary;
          color: #fff;
        }
        .el-select {
          width: 270px;
          ::v-deep .el-input__inner {
            border-radius: 0;
            border-color: $--color-primary;
          }
          ::v-deep .el-select__caret {
            color: $--color-primary;
          }
        }
      }
      .el-button {
        border-radius: 0;
      }
    }
  }
  ::v-deep .el-table {
    overflow: initial;
    &.el-table--border {
      border: 1px solid #d9d9d9;
      border-top: none;
    }
    .el-table__header-wrapper {
      position: sticky;
      top: 135px;
      z-index: 1;
    }
    tr {
      th {
        background-color: $--color-primary;
        &.el-table__cell {
          border-top: 1px solid #d9d9d9;
        }
        .cell {
          color: #fff;
        }
      }
      .cell {
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: 100%;
        word-break: break-word;
      }
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
