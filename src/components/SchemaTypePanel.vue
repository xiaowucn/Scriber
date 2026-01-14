<template>
  <div class="type-panel">
    <el-header class="type-header">
      <el-button
        size="small"
        type="primary"
        :disabled="!canEditSchema()"
        @click="openEnumTypePopup()">
        <i
          :class="
            $platform.isDefaultEnv()
              ? 'fa fa-plus fa-fw'
              : 'el-icon-circle-plus'
          "></i>
        {{ $t(`message['新增枚举类型']`) }}
      </el-button>
      <el-button
        size="small"
        type="primary"
        :disabled="!canEditSchema()"
        @click="openGroupTypePopup()">
        <i
          :class="
            $platform.isDefaultEnv()
              ? 'fa fa-plus fa-fw'
              : 'el-icon-circle-plus'
          "></i>
        {{ $t(`message['新增组合类型']`) }}
      </el-button>
    </el-header>
    <el-table
      size="medium"
      :stripe="!$platform.isDefaultEnv()"
      :data="types"
      class="has-border">
      <el-table-column
        prop="label"
        :label="$t(`message['类型名称']`)"
        :min-width="$style.schemaType.nameMinWidth">
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t(`message['类型']`)"
        :width="$style.schemaType.typeWidth"
        :min-width="$style.schemaType.typeMinWidth">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'basic'">{{
            $t(`message['基本类型']`)
          }}</span>
          <span v-else-if="scope.row.type === 'enum'">{{
            $t(`message['枚举类型']`)
          }}</span>
          <span v-else>{{ $t(`message['组合类型']`) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="180"
        :fixed="$features.operationColumnFixed()"
        class-name="operations">
        <div v-if="scope.row.type !== 'basic'" slot-scope="scope">
          <template v-if="scope.row.type === 'enum'">
            <el-tooltip
              effect="dark"
              :content="$t(`message['编辑枚举类型']`)"
              placement="top">
              <el-button
                @click="openEnumTypePopup(scope.row.label)"
                :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                size="small"
                circle
                :disabled="!canEditSchema()">
                <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
          </template>
          <template v-if="scope.row.type === 'group'">
            <el-tooltip
              effect="dark"
              :content="$t(`message['编辑组合类型']`)"
              placement="top">
              <el-button
                @click="openGroupTypePopup(scope.row.label)"
                :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                size="small"
                circle
                :disabled="!canEditSchema()">
                <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
          </template>
          <el-tooltip
            effect="dark"
            :content="$t(`message['删除']`)"
            placement="top">
            <el-button
              @click="removeSchemaType(scope.row)"
              :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
              size="small"
              circle
              :disabled="removeSchemaTypeButtonDisabled(scope.row)">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <schema-enum-type-popup ref="enumType"></schema-enum-type-popup>
    <schema-group-type-popup ref="groupType"> </schema-group-type-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SchemaEnumTypePopup from './SchemaEnumTypePopup';
import SchemaGroupTypePopup from './SchemaGroupTypePopup';
import { tree2list } from '../utils';

export default {
  name: 'schema-type-panel',
  components: {
    SchemaEnumTypePopup,
    SchemaGroupTypePopup,
  },
  props: {
    types: {
      type: Array,
      default: () => [],
    },
  },
  inject: ['canEditSchema'],
  data() {
    return {
      schemaType: null,
      schemaBasicTypeRule: {
        label: [
          { validator: this.schemaBasicTypeNameValidator, required: true },
        ],
      },
      enumType: null,
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['schemas', 'schemaTypes', 'tree']),
    typePopupVisible() {
      return this.schemaType !== null;
    },
  },
  watch: {
    typePopupVisible(val) {
      if (val) {
        this.schemaType.oldLabel = this.schemaType.label;
      }
    },
  },
  created() {
    this.$store.dispatch('schemaModule/fetchTreeData');
  },
  methods: {
    removeSchemaTypeButtonDisabled(row) {
      if (!this.canEditSchema()) {
        return true;
      }
      const typeList = tree2list(this.tree.data.children);
      return typeList.some((item) => item.data.type === row.label);
    },
    async removeSchemaType(row) {
      const { type, label } = row;
      const result = await this.$confirm(
        this.$t(`message['确定删除"{name}"吗？']`, { name: label }),
        this.$t(`message['提示']`),
      ).catch(() => {});
      if (result === 'confirm') {
        this.$emit('remove-schema-type', { type, label });
      }
    },
    schemaBasicTypeNameValidator(rule, value, callback) {
      if (this.schemaType === null) {
        return;
      }
      const label = value.trim();
      if (!label) {
        return callback(new Error(this.$t(`message['名称不能为空']`)));
      }
      if (this.schemaType.oldLabel !== label) {
        const index = this.types.findIndex((t) => t.label === label);
        if (index !== -1) {
          return callback(
            new Error(
              this.$t(`message['已有名称为"{label}"的类型']`, { label: label }),
            ),
          );
        }
      }
      callback();
    },
    openEnumTypePopup(oldName = '') {
      this.$refs['enumType'].openDialog(oldName);
    },
    openGroupTypePopup(oldName = '') {
      this.$refs['groupType'].openDialog(oldName);
    },
  },
};
</script>
<style lang="scss" scoped>
.operations {
  .el-button--text {
    padding: 0;
  }
}
</style>
