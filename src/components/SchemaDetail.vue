<template>
  <div style="height: auto" class="schema-detail-container">
    <div>
      <div class="title">
        <h4>
          <svg-font-icon
            v-if="$platform.isDefaultEnv()"
            name="schema"
            :size="20"></svg-font-icon>
          <i v-else class="el-icon-document"></i>
          {{ $t(`message['顶级Schema']`) }}
        </h4>
        <svg-font-icon
          v-if="$platform.isDefaultEnv()"
          name="next"
          :size="8"></svg-font-icon>
        <h5>
          {{ scm.top.name }}
          <span class="field-num">
            ({{ $t(`message['字段数']`) }}: {{ scm.top.orders.length }})
          </span>
        </h5>
      </div>
      <schema-detail-table :attrs="scm.top.attrs"></schema-detail-table>
    </div>
    <div :key="index" v-for="(normal, index) in scm.normals">
      <div class="title">
        <h4>
          <svg-font-icon
            v-if="$platform.isDefaultEnv()"
            name="schema"
            :size="20"></svg-font-icon>
          <i v-else class="el-icon-document"></i>
          {{ $t(`message['子Schema']`) }}
        </h4>
        <h5>
          {{ normal.name }}
          <span class="field-num">
            ({{ $t(`message['字段数']`) }}: {{ normal.orders.length }})
          </span>
        </h5>
      </div>
      <schema-detail-table :attrs="normal.attrs"></schema-detail-table>
    </div>
  </div>
</template>

<script>
import SchemaDetailTable from './SchemaDetailTable';
import { schemaToEntity } from '../utils';

export default {
  name: 'schema-detail',
  components: {
    SchemaDetailTable,
  },
  props: {
    schemas: {
      type: Object,
      required: true,
    },
  },
  computed: {
    scm() {
      return schemaToEntity(this.schemas);
    },
  },
};
</script>

<style lang="scss" scoped>
h4 {
  & + div {
    margin-left: 1em;
  }
  .el-icon-document {
    margin-right: 0.2em;
  }
}
h5 {
  margin: 0.3em 0 0 1.2em;
  font-size: 1em;
  .field-num {
    margin-left: 10px;
    color: #f56c6b;
  }
}
</style>
