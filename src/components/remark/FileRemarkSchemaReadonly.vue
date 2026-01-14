<template>
  <el-tree :data="treeDataFormat" default-expand-all node-key="key">
    <div slot-scope="{ node }" class="tree-node">
      <span>{{ node.data.data.label }}</span>
      <el-tag
        size="mini"
        :type="
          node.data.children && node.data.children.length > 0 ? 'success' : ''
        "
        >{{ node.data.data.type }}</el-tag
      >
    </div>
  </el-tree>
</template>
<script>
export default {
  name: 'FileRemarkSchemaReadonly',
  props: {
    treeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    treeDataFormat() {
      return [].concat(this.treeData).map(function addProps(item) {
        // item.label = item.data.label;
        item.key = item.meta._nodeIndex;

        item.children.map(addProps);

        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-node {
  font-size: 14px;

  span:first-of-type {
    margin-right: 8px;
  }
}

::v-deep .el-tree-node__content {
  height: 32px;
}
</style>
