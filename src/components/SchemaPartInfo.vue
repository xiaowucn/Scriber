<template>
  <el-dialog
    v-if="current"
    :visible="true"
    :width="width"
    class="schema-part-info-wrapper"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div slot="title">
      {{ $text.schema[!this.isEdit ? '新增Schema' : '编辑Schema'] }}
    </div>
    <el-form
      ref="schemaPartForm"
      v-if="partType === 'root'"
      :rules="schemaRules || rules"
      :model="current"
      @submit.native.prevent
      label-width="120px">
      <el-form-item :label="$text.schema['Schema名称']" prop="name">
        <el-input ref="schemaNameInput" v-model="current.name" />
      </el-form-item>
      <el-form-item
        v-if="isShowSchemaSelector"
        :label="$text.schema['Schema类型']"
        prop="type">
        <p class="form-item-tips">请选择类型，选择后将不允许更改</p>
        <el-radio-group v-model="current.moldType">
          <el-radio :label="0" border>
            <img
              src="../images/schema-type-normal.svg"
              alt="复杂长文档信息抽取" />
            <div>
              <h5>复杂长文档信息抽取</h5>
              <p>适用于合同、公告等篇幅较长、版式不一的长文档</p>
              <p>* 提取字段支持多层级嵌套</p>
            </div>
          </el-radio>
          <el-radio :label="1" border>
            <img src="../images/schema-type-kv.svg" alt="固定版式文档KV抽取" />
            <div>
              <h5>固定版式文档KV抽取</h5>
              <p>适用于表单、票据等固定模板的文档，提取key、value信息</p>
              <p>* 提取字段支持单层级</p>
            </div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="$features.supportSchemaAlias()"
        :label="$text.schema['Schema别名']"
        prop="alias">
        <el-input v-model="current.alias" />
      </el-form-item>
      <el-form-item
        v-if="$features.supportBusinessGroup()"
        class="group-select-wrapper"
        prop="group_ids"
        label="业务组">
        <el-select
          v-model="current.group_ids"
          clearable
          filterable
          multiple
          placeholder="请选择业务组">
          <el-option
            v-for="(label, index) in groups"
            :key="index"
            :label="label.name"
            :value="label.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="$features.supportLLMExtract()" label="大模型">
        <el-select
          v-model="current.model_name"
          clearable
          placeholder="请选择大模型">
          <el-option
            v-for="(item, index) in schemas.llm.list"
            :key="index"
            :label="item.model"
            :value="item.model">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-else-if="partType === 'top'">
      <el-form
        ref="schemaPartForm"
        :model="current"
        :rules="rules"
        @submit.native.prevent>
        <el-form-item :label="$text.schema['Schema名称']" prop="name">
          <el-input
            ref="schemaNameInput"
            :data-index="current._index"
            v-model="current.name" />
        </el-form-item>
        <el-form-item
          v-if="$features.supportSchemaAlias()"
          :label="$text.schema['Schema别名']"
          prop="alias">
          <el-input :data-index="current._index" v-model="current.alias" />
        </el-form-item>
        <el-form-item
          v-if="$features.supportBusinessGroup()"
          class="group-select-wrapper"
          prop="group_ids"
          label="业务组">
          <el-select
            v-model="current.group_ids"
            clearable
            filterable
            multiple
            placeholder="请选择业务组">
            <el-option
              v-for="(label, index) in groups"
              :key="index"
              :label="label.name"
              :value="label.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <transition-group name="el-zoom-in-top">
        <schema-part-info-column
          ref="subSchemaPartForm"
          :key="`attr-${index}`"
          :validators="columnValidators"
          :alias-required="aliasRequired"
          v-for="(attr, index) in current.attrs"
          :types="current.types"
          :mold-type="current.mold_type"
          :partColumn.sync="current.attrs[index]"
          @update:partColumn="updatePartColumn"
          @select-type-action="selectTypeAction">
          <div slot="node-right">
            <el-button
              @click="removeSchemaPartColumn(index)"
              :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
              circle
              size="small">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </div>
        </schema-part-info-column>
      </transition-group>
      <el-row class="btn-group-wrapper">
        <el-button
          @click="appendAttrTo(current.attrs, partType)"
          :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
          circle
          size="small">
          <theme-icon name="add" icon-class="el-icon-plus"></theme-icon>
        </el-button>
      </el-row>
    </div>
    <div v-else-if="partType === 'normal'">
      <el-form ref="schemaPartForm" :model="current" @submit.native.prevent>
        <el-form-item :label="$t(`message['类型名称']`)">
          <el-input :value="current.name" :readonly="true" />
        </el-form-item>
        <el-form-item
          v-if="$features.supportSchemaAlias()"
          :label="$t(`message['类型别名']`)">
          <el-input :value="current.alias" :readonly="true" />
        </el-form-item>
      </el-form>
      <transition-group name="el-zoom-in-top">
        <schema-part-info-column
          ref="subSchemaPartForm"
          v-for="(attr, index) in current.attrs"
          :key="`attr-normal-${index}}`"
          :validators="columnValidators"
          :alias-required="aliasRequired"
          :types="current.types"
          :mold-type="current.mold_type"
          :partColumn.sync="current.attrs[index]"
          @update:partColumn="updatePartColumn"
          @select-type-action="selectTypeAction">
          <div slot="node-right">
            <el-button
              @click="removeSchemaPartColumn(index)"
              :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
              size="small">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </div>
        </schema-part-info-column>
      </transition-group>
      <el-row class="btn-group-wrapper" v-if="current.attrs">
        <el-button
          @click="appendAttrTo(current.attrs, 'normal')"
          :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
          circle
          size="small">
          <theme-icon name="add" icon-class="el-icon-plus"></theme-icon>
        </el-button>
      </el-row>
    </div>
    <span slot="footer">
      <el-button @click="handleClose">{{ $t(`message['取消']`) }}</el-button>
      <el-button
        :disabled="isLoading"
        :loading="isLoading"
        type="primary"
        @click="persistSchema"
        >{{ $t(`message['确定']`) }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import SchemaPartInfoColumn from './SchemaPartInfoColumn';
import { getCounterGenerate } from '../utils';
import { SCHEMA_TYPE } from '../store/constants';

export default {
  name: 'schema-part-info',
  components: {
    SchemaPartInfoColumn,
  },
  props: {
    schemaRules: {
      type: Object,
    },
    schemaPart: {
      type: Object,
    },
    groups: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    aliasRequired: {
      type: Boolean,
      default: false,
    },
    validators: {
      type: Object,
      default: () => ({
        name: () => ({}),
        type: () => ({}),
      }),
    },
    width: {
      type: String,
      default: '90%',
    },
  },
  data() {
    const self = this;
    const subNameValidatorGen = (ctx) => {
      return (rule, value, callback) => {
        const name = value.trim();
        const oldName = ctx.oldState.name.trim();
        if (name === '') {
          return callback(new Error(self.$t(`message['名称不能为空']`)));
        } else if (name === oldName) {
          return callback();
        } else {
          const len = this.current.attrs.filter(
            (attr) => attr.name === name,
          ).length;
          if (len > 1) {
            return callback(
              new Error(self.$t(`message['名称“{name}”已被占用']`, { name })),
            );
          }
          callback();
        }
      };
    };
    const subTypeValidatorGen = () => {
      return (rule, type, callback) => {
        if (!type) {
          return;
        }
        type = type.trim();
        if (type === '') {
          return callback(new Error(self.$t(`message['类型不能为空']`)));
        } else {
          const typeIndexInPath = this.schemaPart._path
            .filter((itm) => itm !== 'text')
            .findIndex((itm) => itm === type);
          if (typeIndexInPath !== -1) {
            return callback(
              new Error(self.$t(`message['类型不能和上级节点相同']`)),
            );
          }
        }
        callback();
      };
    };
    const aliasValidatorGen = () => {
      return (rule, value, callback) => {
        const alias = value.trim();
        if (alias === '') {
          if (this.aliasRequired) {
            return callback(new Error(self.$t(`message['别名不能为空']`)));
          }
          return callback();
        }
        const len = this.current.attrs.filter(
          (attr) => attr.alias === alias,
        ).length;
        if (len > 1) {
          return callback(
            new Error(self.$t(`message['别名“{alias}”已被占用']`, { alias })),
          );
        }
        callback();
      };
    };
    return {
      current: null,
      partType: '',

      columnValidators: {
        name: subNameValidatorGen,
        type: subTypeValidatorGen,
        alias: aliasValidatorGen,
      },
      oldState: {
        name: '',
        type: '',
        alias: '',
      },
      getCounter: getCounterGenerate(),
      SCHEMA_TYPE,
    };
  },
  watch: {
    schemaPart(newVal) {
      if (newVal) {
        this.oldState.name = this.schemaPart.name;
        this.oldState.alias = this.schemaPart.alias;
        this.current = _.cloneDeep(this.schemaPart);
        this.partType = this.schemaPart.partType;
        if (this.$features.supportBusinessGroup()) {
          if (!this.current.group_ids) {
            this.$set(this.current, 'group_ids', []);
          }
          if (this.groups.length === 1) {
            this.$set(this.current, 'group_ids', [this.groups[0].id]);
          }
        }
        this.$nextTick(() => {
          this.$refs.schemaNameInput?.focus();
        });
      }
    },
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('schemaModule', ['schemas']),
    isEdit() {
      return this.current.name && this.current._index;
    },
    isShowSchemaSelector() {
      return !!this.configuration.enable_kv_schema;
    },
    rules() {
      return {
        name: [{ validator: this.validators.name(this), required: true }],
        alias: [
          {
            validator: this.validators.alias(this),
            required: this.aliasRequired,
          },
        ],
        group_ids: [
          { required: true, message: '请选择业务组', trigger: 'change' },
        ],
      };
    },
  },
  methods: {
    handleClose() {
      this.$emit('close-part-info');
      if (this.$refs['schemaPartForm']) {
        this.$refs['schemaPartForm'].clearValidate();
      }
      this.current = null;
    },
    async persistSchema() {
      // this.partType === 'root' or others...
      const isValid = await this.validate();
      // current 修改的信息
      if (isValid) {
        this.$emit('persist-schema-part', { current: this.current });
        this.current = null;
      }
    },
    async validate() {
      let isValidResults = [];
      try {
        isValidResults = await Promise.all([
          ...(this.$refs['subSchemaPartForm'] || []).map((sub) =>
            sub.validate(),
          ),
          this.$refs['schemaPartForm'].validate(),
        ]);
      } catch (err) {
        return false;
      }
      return isValidResults.every((itm) => itm);
    },
    appendAttrTo(list, type) {
      if (type === 'top') {
        list.push({
          _index: this.getCounter(),
          name: '',
          alias: '',
          required: false,
          multi: true,
          type: '文本',
        });
      } else if (type === 'normal') {
        list.push({
          _index: this.getCounter(),
          name: '',
          alias: '',
          required: false,
          multi: true,
          type: '文本',
        });
      }
    },
    removeSchemaPartColumn(index) {
      this.current.attrs.splice(index, 1);
    },
    updatePartColumn(data) {
      this.$emit('update-part-column', data);
    },
    selectTypeAction(action, data) {
      this.$emit('select-type-action', action, data);
    },
  },
};
</script>

<style scoped lang="scss">
.schema-part-info-wrapper {
  min-width: 1210px;
  .form-item-tips {
    color: #909399;
  }
  .el-form {
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
  .el-radio-group {
    width: 100%;
    ::v-deep .el-radio {
      display: flex;
      align-items: center;
      height: auto;
      margin: 10px 0;
      padding: 10px;
      .el-radio__label {
        display: flex;
        align-items: center;
        padding-left: 20px;
        > img {
          width: 55px;
          height: 71px;
          margin-right: 20px;
        }
        h5 {
          margin: 8px 0;
          font-size: 16px;
          font-weight: normal;
        }
        p {
          line-height: 22px;
          color: #909399;
        }
      }
      &.is-checked {
        p {
          color: #409eff;
        }
      }
    }
  }
}
.btn-group-wrapper {
  text-align: right;
}
.el-row {
  margin: 15px 0;
}
</style>
