<template>
  <div>
    <div class="list">
      <h4>合同类型标注总计</h4>
      <ul>
        <li>
          <p>{{ data.sum.file_cnt }}</p>
          <p>文档数</p>
        </li>
        <li>
          <p>{{ data.sum.ai_finish_cnt }}</p>
          <p>分析完成</p>
        </li>
        <li>
          <p>{{ data.sum.err_file_cnt }}</p>
          <p>问题文档数</p>
        </li>
        <li>
          <p>{{ data.sum.err_rule_cnt }}</p>
          <p>不符合规则数</p>
        </li>
        <li>
          <p>{{ data.sum.warning_cnt }}</p>
          <p>报错数</p>
        </li>
        <li>
          <p>{{ data.sum.user_cnt || '-' }}</p>
          <p>用户数</p>
        </li>
      </ul>
    </div>
    <div class="list">
      <h4>{{ tableName }}</h4>
      <el-table :data="data.items">
        <el-table-column prop="g" :label="columnName" key="0"></el-table-column>
        <el-table-column
          v-if="isNotShowColumn"
          prop="department"
          label="部门"
          key="1"></el-table-column>
        <el-table-column
          v-if="isNotShowColumn"
          prop="department_id"
          label="部门号"
          key="2"></el-table-column>
        <el-table-column
          prop="file_cnt"
          label="文档数"
          key="3"
          :sortable="isNeedSortable"></el-table-column>
        <el-table-column
          prop="ai_finish_cnt"
          label="分析完成"
          key="4"
          :sortable="isNeedSortable"></el-table-column>
        <el-table-column
          prop="err_file_cnt"
          label="问题文档数"
          key="5"
          :sortable="isNeedSortable"></el-table-column>
        <el-table-column
          prop="err_rule_cnt"
          label="不符合规则数"
          key="6"
          :sortable="isNeedSortable"></el-table-column>
        <el-table-column
          prop="warning_cnt"
          label="报错数"
          key="7"
          :sortable="isNeedSortable"></el-table-column>
        <el-table-column
          v-if="!isNotShowColumn"
          prop="user_cnt"
          label="用户数"
          key="8"
          :sortable="isNeedSortable"></el-table-column>
        <el-table-column
          v-if="!isNotShowColumn"
          prop="file_del_cnt"
          label="用户删除"
          key="9"
          :sortable="isNeedSortable"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'data-statistics-details',
  props: {
    data: {
      type: Object,
      required: true,
    },
    tableName: {
      type: String,
      default: '每月文档',
    },
    columnName: {
      type: String,
      default: '日期',
    },
    isNotShowColumn: {
      type: Boolean,
      default: true,
    },
    isNeedSortable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getNotShowColumnName(name) {
      return this.notShowColumnNames.find(name);
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  margin: 0 0 20px 0;
  h4 {
    margin: 0 0 10px 0;
    padding: 5px 10px;
    color: #fff;
    background: linear-gradient(to right, #6485e3, #35bbef);
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 2px;
    li {
      flex: 1;
      margin: 0 10px;
      padding: 15px 20px;
      list-style: none;
      border-radius: 5px;
      box-shadow: 0 0 5px #ccc;
      text-align: center;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      p {
        &:first-child {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
  .no-data {
    padding-top: 15px;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }
}
</style>
