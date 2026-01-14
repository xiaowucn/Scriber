<template>
  <el-table :data="records" :empty-text="$t(`message['暂无数据']`)">
    <el-table-column
      prop="uid"
      :label="$t(`message['用户ID']`)"></el-table-column>
    <el-table-column
      prop="name"
      :label="$t(`message['用户名']`)"></el-table-column>
    <el-table-column
      prop="action"
      :label="$t(`message['操作类型']`)"
      :formatter="actionFormatter"></el-table-column>
    <el-table-column prop="action_time" :label="$t(`message['操作时间']`)">
      <template slot-scope="scope">
        <span class="action-time">{{ scope.row.action_time | datetime }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'FileHistoryList',
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  methods: {
    actionFormatter(row, column, cellValue) {
      if (cellValue === 2) {
        return this.$t(`message['打开文档']`);
      }
      if (cellValue === 3) {
        return this.$t(`message['提交答案']`);
      }
    },
  },
};
</script>

<style scoped>
.action-time {
  font-family: monospace;
}
</style>
