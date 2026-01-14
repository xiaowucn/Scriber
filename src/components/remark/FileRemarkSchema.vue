<template>
  <div>
    <tree-list :data="treeData">
      <div v-if="node !== null" class="node-line" slot-scope="{ node }">
        <div>
          <span>{{ node.data.label }}</span>
          <schema-tree-node-type
            v-if="node.data.type"
            :type="node.data.type"
            :types="allSchemaTypes"></schema-tree-node-type>
        </div>
      </div>
    </tree-list>
  </div>
</template>

<script>
import TreeList from '../tree/TreeList';
import SchemaTreeNodeType from '../SchemaTreeNodeType';
import { getAllTypesFromEntity } from '../../utils';

export default {
  name: 'file-remark-schema',
  components: {
    TreeList,
    SchemaTreeNodeType,
  },
  props: {
    treeData: {
      type: Object,
      required: true,
    },
    entity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      allSchemaTypes: null,
    };
  },
  created() {
    this.allSchemaTypes = getAllTypesFromEntity(this.entity);
  },
};
</script>
