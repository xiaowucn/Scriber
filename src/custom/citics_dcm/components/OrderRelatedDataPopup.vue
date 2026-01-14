<template>
  <div class="file-related-data-popup">
    <el-dialog
      visible
      :before-close="handleClose"
      :close-on-click-modal="false"
      title="簿记系统申购明细选择">
      <div class="search">
        <search-box
          :searchOptions="searchOptions"
          :filterBy="filterBy"
          :filterValue="filterValue"
          @search="handleSearch" />
      </div>
      <el-table
        class="has-border"
        :border="true"
        :data="orderRelatedData.items"
        v-loading="isLoading">
        <el-table-column label="选择" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              :value="isChecked(scope.row.id)"
              @change="(value) => handleCheckedChange(scope.row, value)" />
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in ORDER_RELATED_TABLE_COLUMN_MAP"
          :key="index"
          :label="item.label"
          align="center">
          <template slot-scope="scope">
            {{ getColumnValue(scope.row.data, item.key) }}
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
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import SearchBox from './SearchBox';
import { citicsDCM as citicsDCMApi } from '@/store/api';
import {
  ORDER_RELATED_LABEL_MAP,
  ORDER_RELATED_TABLE_COLUMN_MAP,
} from '../common/constant';

export default {
  name: 'fileRelatedDataPopup',
  components: { SearchBox },
  props: {
    qid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      orderRelatedData: {},
      checkedOrderIds: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      filterBy: 'investor_name',
      filterValue: '',
      searchOptions: [
        {
          value: 'investor_name',
          label: '订单人',
        },
        {
          value: 'bond_shortname',
          label: '产品名称',
        },
      ],
      isLoading: true,
      ORDER_RELATED_TABLE_COLUMN_MAP,
    };
  },
  created() {
    this.init();
  },
  computed: {
    isChecked() {
      return (id) => this.checkedOrderIds.includes(id);
    },
  },
  methods: {
    getColumnValue(data, key) {
      return data.find((item) => item.key === key)?.value;
    },
    async init() {
      await this.fetchOrderRelatedData();
      this.checkedOrderIds = _.map(
        _.filter(this.orderRelatedData.items, { isAutoRelated: true }),
        'id',
      );
    },
    async fetchOrderRelatedData() {
      try {
        this.isLoading = true;
        let params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        if (this.filterValue) {
          params[this.filterBy] = this.filterValue;
        }
        const { data } = await citicsDCMApi.fetchOrderRelatedData(
          this.qid,
          params,
        );
        this.pager.total = data.total;
        this.orderRelatedData = {
          ...data,
          items: _.map(data.items, (dataItem) => ({
            isAutoRelated: dataItem.has_ref,
            id: dataItem.id,
            data: _.map(ORDER_RELATED_LABEL_MAP, (item) => ({
              ...item,
              value: dataItem[item.key],
            })),
          })),
        };
      } catch (e) {
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async updateOrderRelatedData(orderIds) {
      try {
        const params = { order_ids: orderIds };
        await citicsDCMApi.updateOrderRelatedData(this.qid, params);
        this.$notify({
          title: '成功',
          message: '修改关联成功',
          type: 'success',
        });
        this.resetSearchSelect();
        this.init();
        this.$emit('update');
        this.$emit('close');
      } catch (e) {
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'error',
        });
      }
    },
    handleCheckedChange(row, value) {
      if (value) {
        this.checkedOrderIds.push(row.id);
      } else {
        this.checkedOrderIds = this.checkedOrderIds.filter(
          (item) => item !== row.id,
        );
      }
    },
    handleClose() {
      this.$emit('close');
    },
    handleSubmit() {
      this.updateOrderRelatedData(this.checkedOrderIds);
    },
    handleChangeSize(size) {
      this.pager.size = size;
      this.fetchOrderRelatedData();
    },
    handleChangePage(page) {
      this.pager.page = page;
      this.fetchOrderRelatedData();
    },
    handleSearch(val) {
      const { filterBy, filterValue } = val;
      this.filterBy = filterBy;
      this.filterValue = filterValue;
      this.handleChangePage(1);
    },
    resetSearchSelect() {
      this.filterBy = 'investor_name';
      this.filterValue = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.file-related-data-popup {
  ::v-deep .el-dialog {
    width: 80%;
    max-width: 1000px;
  }
  .search {
    margin-bottom: 14px;
    display: flex;
    justify-content: flex-end;
    ::v-deep .search-container {
      width: 400px;
      .search-btn {
        font-size: 14px;
        height: 32px;
        padding: 0px 18px;
      }
      .pd-icon-search {
        display: none;
      }
      .el-select {
        width: 90px;
        flex-shrink: 0;
        .el-input__inner {
          padding: 0px 15px 0px 8px;
        }
        .el-select__caret {
          display: flex;
          align-items: center;
          justify-content: center;
          &::before {
            line-height: 1;
          }
        }
      }
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  ::v-deep .el-table {
    color: #646464;
    margin-bottom: 20px;
    border-color: #707070 !important;
    &::before {
      background-color: #707070;
    }
    .el-table__body-wrapper {
      max-height: 500px;
      overflow-y: auto;
    }
    th {
      font-weight: 400;
    }
    th,
    td {
      border-color: #707070 !important;
    }
    .cell {
      font-size: 12px;
      line-height: 17px;
    }
    .el-table__cell {
      padding: 9px 0 10px;
    }
    .el-table__header {
      .el-table__cell {
        padding: 3px 0 4px;
        background-color: #eef7f5;
        .cell {
          color: #444;
        }
      }
    }
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      &::after {
        height: 9px;
        left: 5px;
      }
    }
  }
  .el-pagination {
    text-align: center;
    padding: 0px;
  }
}
</style>
