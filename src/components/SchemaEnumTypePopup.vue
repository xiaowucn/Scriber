<template>
  <el-dialog
    v-if="current"
    :visible="true"
    class="enum-type-wrapper"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :before-close="closeDialog">
    <div>
      <el-form ref="enumName" :rules="enumNameRules" :model="current">
        <el-form-item :label="$t(`message['枚举名称']`)" prop="name">
          <el-input ref="nameInput" v-model="current.name"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        class="enum-form"
        ref="enumValues"
        :key="index"
        v-for="(enumValue, index) in current.attrs"
        :model="enumValue"
        :rules="enumValueRules"
        :inline="true">
        <div class="enum-values">
          <el-form-item :label="$t(`message['枚举值']`)" prop="name">
            <el-input v-model="enumValue.name" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t(`message['设为默认']`)" prop="isDefault">
            <el-switch
              v-model="enumValue.isDefault"
              @change="setDefaultValue($event, index)"></el-switch>
          </el-form-item>
        </div>
        <div class="enum-handle">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="removeEnumValue(index)">
          </el-button>
        </div>
      </el-form>
      <el-button size="small" icon="el-icon-plus" @click="addEnumValue">
        {{ $t(`message['新增枚举值']`) }}
      </el-button>
      <el-checkbox
        v-model="current.isMultiSelect"
        class="enum-multi-select"
        @change="changeEnumMultiSelect">
        {{ $t(`message['支持枚举多选']`) }}
      </el-checkbox>
    </div>
    <span slot="footer">
      <el-button @click="closeDialog">{{ $t(`message['取消']`) }}</el-button>
      <el-button
        :disabled="tree.isLoading"
        :loading="tree.isLoading"
        type="primary"
        @click="persistSchema">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'schema-enum-type-popup',
  props: {
    openedFromTree: {
      type: Boolean,
      default: false,
    },
    enumTypeName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      current: null,
      enumNameRules: {
        name: [{ required: true, validator: this.enumNameValidator }],
      },
      enumValueRules: {
        name: [{ required: true, validator: this.enumValueValidator }],
      },
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['tree', 'schemaTypes']),
    dialogTitle() {
      if (this.current.oldName) {
        return this.$t(`message['编辑枚举类型']`);
      }
      return this.$t(`message['新增枚举类型']`);
    },
  },
  methods: {
    openDialog(oldName = '') {
      if (oldName) {
        const index = this.schemaTypes.findIndex((t) => t.label === oldName);
        const { label, values, isMultiSelect } = this.schemaTypes[index];
        this.current = {
          oldName,
          ..._.cloneDeep({
            name: label,
            attrs: values,
            isMultiSelect: isMultiSelect,
          }),
        };
      } else {
        this.current = {
          oldName,
          name: this.enumTypeName,
          attrs: [],
          isMultiSelect: false,
        };
      }
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    closeDialog() {
      this.clearValidate();
      this.current = null;
    },
    /**
     * 校验方法
     */
    async validate() {
      const results = await Promise.all([
        this.$refs['enumName'].validate(),
        ...(this.$refs['enumValues'] || []).map(($el) => $el.validate()),
      ]);
      return results.every((r) => r);
    },
    /**
     * 清空表单校验结果
     */
    clearValidate() {
      // clearValidate
      [this.$refs['enumName'], ...(this.$refs['enumValues'] || [])].map(
        ($el) => {
          $el.clearValidate();
        },
      );
    },
    enumNameValidator(rule, value, callback) {
      value = value.trim();
      if (!value) {
        callback(this.$t(`message['名称不能为空']`));
      }
      if (value !== this.current.oldName) {
        const index = this.schemaTypes.findIndex((t) => t.label === value);
        if (index !== -1) {
          return callback(
            this.$t(`message['已有名称为"{value}"的类型']`, { value: value }),
          );
        }
      }
      callback();
    },
    /**
     * 枚举值校验
     */
    enumValueValidator(rule, value, callback) {
      // 不能为空，不能重复
      value = value.trim();
      if (!value) {
        return callback(this.$t(`message['枚举值不能为空']`));
      }
      const sameValueList = this.current.attrs.filter(
        (attr) => attr.name.trim() === value,
      );
      if (sameValueList.length > 1) {
        return callback(this.$t(`message['枚举值不能重复']`));
      }
      callback();
    },

    async persistSchema() {
      const isValid = await this.validate().catch(() => {});
      if (isValid) {
        const enumType = this.current;
        if (this.openedFromTree) {
          const full = _.cloneDeep(this.tree.full);
          full.data.schemaTypes.push({
            label: enumType.name,
            values: enumType.attrs,
            isMultiSelect: enumType.isMultiSelect,
          });
          this.$store.commit('schemaModule/SET_FULLSCHEMA_DATA', full);
          this.$parent.createSchemaType(enumType.name);
          this.closeDialog();
          return;
        }
        await this.$store.dispatch('schemaModule/persistSchemaEnum', {
          enumType,
          callback: (error) => {
            if (error) {
              this.$notify({
                title: this.$t(`message['错误']`),
                message: error.message,
                type: 'error',
              });
            } else {
              this.$notify({
                title: this.$t(`message['成功']`),
                message: this.$t(`message['类型修改成功']`),
                type: 'success',
              });
              this.closeDialog();
            }
          },
        });
      }
    },
    /**
     * 新增枚举值
     */
    addEnumValue() {
      this.current.attrs.push({
        name: '',
        isDefault: false,
      });
    },
    /**
     * 删除枚举值
     */
    removeEnumValue(index) {
      this.current.attrs.splice(index, 1);
    },
    /**
     * 设置默认值
     */
    setDefaultValue(isSelected, index) {
      if (this.current.isMultiSelect) {
        this.current.attrs[index].isDefault = isSelected;
      } else {
        for (let i = 0; i < this.current.attrs.length; i++) {
          this.current.attrs[i].isDefault = false;
        }
        this.current.attrs[index].isDefault = isSelected;
      }
    },
    changeEnumMultiSelect(value) {
      if (!value) {
        for (let i = 0; i < this.current.attrs.length; i++) {
          this.current.attrs[i].isDefault = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.enum-form {
  display: flex;
  justify-content: space-between;
  .enum-handle {
    .el-button {
      margin-top: 5px;
    }
  }
}
.enum-multi-select {
  margin-left: 123px;
}
</style>
