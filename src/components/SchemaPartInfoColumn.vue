<template>
  <el-row>
    <el-col :span="22">
      <el-form
        @keydown.enter.native="onEnterHandle"
        @keydown.esc.native="onEscHandle"
        :model="partColumn"
        :inline="true"
        :size="isShowInPopup ? 'medium' : 'mini'"
        :rules="columnFormRule"
        ref="subForm"
        class="part-column-form">
        <el-form-item :label="$t(`message['字段名称']`)" prop="name">
          <el-input
            ref="name-input"
            :value="partColumn.name"
            @input="(value) => updatePartColumnProp('name', value)"></el-input>
        </el-form-item>
        <el-form-item
          v-if="$features.supportSchemaAlias()"
          :label="$t(`message['字段别名']`)"
          prop="alias">
          <el-input
            :value="partColumn.alias"
            @input="(value) => updatePartColumnProp('alias', value)"></el-input>
        </el-form-item>
        <el-form-item :label="$t(`message['字段类型']`)" prop="type">
          <el-select
            v-if="moldType === 1"
            :value="partColumn.type"
            @change="(value) => updatePartColumnProp('type', value)"
            placeholder="请选择类型">
            <el-option
              v-for="(item, index) in types"
              :key="index"
              :value="item.label"></el-option>
          </el-select>
          <el-autocomplete
            v-else
            :value="partColumn.type"
            :fetch-suggestions="querySearch"
            @select="selectType($event, partColumn)">
            <template slot-scope="{ item }">
              <template v-if="item.type">
                <span class="label">{{ item.value }}</span>
                <el-tag
                  size="mini"
                  type="info"
                  :color="typeMap[item.type].color">
                  {{ typeMap[item.type].text }}
                </el-tag>
              </template>
              <template v-if="item.action">
                <span class="action">
                  <i class="el-icon-circle-plus"></i>{{ item.label }}
                </span>
              </template>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t(`message['必须标注']`)">
          <el-switch
            :value="partColumn.required"
            @change="
              (value) => updatePartColumnProp('required', value)
            "></el-switch>
        </el-form-item>
        <el-form-item :label="$t(`message['可标注多项']`)">
          <el-switch
            :value="partColumn.multi"
            @change="
              (value) => updatePartColumnProp('multi', value)
            "></el-switch>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="2" class="node-right-wrapper">
      <slot name="node-right"></slot>
    </el-col>
  </el-row>
</template>

<script>
import { SCHEMA_TYPE_ACTION } from '../store/constants';

export default {
  name: 'schema-part-info-column',
  props: {
    partColumn: {
      type: Object,
      required: true,
    },
    isShowInPopup: {
      type: Boolean,
      default: true,
    },
    types: {
      type: Array,
      default: () => [],
    },
    moldType: {
      type: Number,
      default: 0,
    },
    validators: {
      type: Object,
    },
    aliasRequired: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object, // 用于绑定在组件上的任何参数
    },
    autofocus: {
      // 名称输入框是否自动获得焦点
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.oldState.name = this.partColumn.name;
    this.oldState.alias = this.partColumn.alias;
    if (this.validators) {
      if (this.validators.name) {
        Object.assign(this.columnFormRule, {
          name: [{ validator: this.validators.name(this), required: true }],
        });
      }
      if (this.validators.type) {
        Object.assign(this.columnFormRule, {
          type: [{ validator: this.validators.type(this), required: true }],
        });
      }
      if (this.validators.alias) {
        Object.assign(this.columnFormRule, {
          alias: [
            {
              validator: this.validators.alias(this),
              required: this.aliasRequired,
            },
          ],
        });
      }
    } else {
      Object.assign(this.columnFormRule, {
        name: [{ required: true }],
        type: [{ required: true }],
        alias: [{ required: this.aliasRequired }],
      });
    }
  },
  mounted() {
    if (this.autofocus) {
      this.$refs['name-input'].$el.querySelector('input').focus();
    }
  },
  data() {
    return {
      oldState: {
        name: '',
      },
      columnFormRule: {},
      typeMap: {
        basic: {
          text: '基本',
          color: '#a09f9f',
        },
        enum: {
          text: '枚举',
          color: '#6066f0',
        },
        group: {
          text: '组合',
          color: '#1bbc53',
        },
      },
    };
  },
  methods: {
    validate() {
      return this.$refs['subForm'].validate();
    },
    querySearch(queryString, cb) {
      const types = this.types.map((type) => ({
        value: type.label,
        type: type.type,
      }));
      const actions = [
        {
          label: this.$t(`message['新增枚举类型']`),
          action: SCHEMA_TYPE_ACTION.ADD_ENUM,
        },
        {
          label: this.$t(`message['新增组合类型']`),
          action: SCHEMA_TYPE_ACTION.ADD_GROUP,
        },
      ];
      cb([...types, ...actions]);
    },
    selectType(type, data) {
      this.updatePartColumnProp('type', type.value);

      if (type.action) {
        this.$emit('select-type-action', type.action, data);
      }
    },
    getTypes() {
      return this.types;
    },
    onEnterHandle(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      this.$emit('part-enter');
    },
    onEscHandle(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      this.$emit('part-esc');
    },
    updatePartColumnProp(key, value) {
      this.$emit('update:partColumn', { ...this.partColumn, [key]: value });
    },
  },
};
</script>

<style lang="scss" scoped>
.node-right-wrapper {
  text-align: right;
  ::v-deep .el-button--text {
    padding: 0;
  }
}
.part-column-form {
  height: auto !important;
}
.el-form-item {
  margin-bottom: 13px !important;
}
::v-deep .el-input {
  width: 200px;
}
</style>
<style lang="scss">
.el-autocomplete-suggestion {
  .el-autocomplete-suggestion__list {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-tag {
        color: #fff;
      }
      .action {
        width: 100%;
        border-top: 1px solid #ccc;
        i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
