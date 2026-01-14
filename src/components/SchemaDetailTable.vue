<template>
  <el-table
    :empty-text="$t(`message['暂无数据']`)"
    :data="attrs"
    class="schema-detail">
    <el-table-column :label="$t(`message['字段名']`)" prop="name">
    </el-table-column>
    <el-table-column :label="$t(`message['类型']`)" prop="type">
    </el-table-column>
    <el-table-column :label="$t(`message['必选']`)" prop="type">
      <template slot-scope="scope">
        <template v-if="$platform.isDefaultEnv()">
          <i v-if="scope.row.required" class="el-icon-success"></i>
          <span v-else>-</span>
        </template>
        <span v-else>{{ scope.row.required | yesOrNo }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t(`message['可多选']`)" prop="multi">
      <template slot-scope="scope">
        <template v-if="$platform.isDefaultEnv()">
          <i v-if="scope.row.multi" class="el-icon-success"></i>
          <span v-else>-</span>
        </template>
        <span v-else>{{ scope.row.multi | yesOrNo }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'schema-detail-table',
  props: {
    attrs: {
      type: Array,
      required: true,
    },
  },
};
</script>
