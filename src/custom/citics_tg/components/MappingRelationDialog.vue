<template>
  <el-dialog visible :before-close="close" :close-on-click-modal="false">
    <span slot="title">{{
      currentEditId
        ? $t(`message['编辑映射关系']`)
        : $t(`message['新增映射关系']`)
    }}</span>
    <el-form
      ref="form"
      :model="mappingRelationShip"
      :rules="rules"
      label-width="80px">
      <el-form-item :label="$t(`message['参数分类']`)" prop="category">
        <el-cascader
          v-model="mappingRelationShip.category"
          :options="categoryOptions"
          :props="categoryProps"
          :placeholder="$t(`message['请选择参数分类']`)"
          separator="-"
          @change="handleChangeCategory"></el-cascader>
      </el-form-item>
      <el-form-item :label="$t(`message['参数名称']`)" prop="label">
        <el-select
          :placeholder="$t(`message['请选择参数名称']`)"
          v-model="mappingRelationShip.label">
          <el-option
            v-for="item in paraValuesOption"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`message['映射名称']`)" prop="group_name">
        <el-input
          v-model="mappingRelationShip.group_name"
          :placeholder="$t(`message['请输入映射名称']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['映射值']`)" prop="to_value">
        <el-input
          v-model="mappingRelationShip.to_value"
          :placeholder="$t(`message['请输入映射值']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['参数值']`)" prop="values">
        <div class="tags-list-box">
          <el-tag
            :key="tag"
            v-for="tag in mappingRelationShip.values"
            closable
            :disable-transitions="false"
            :title="tag"
            @close="handleDeleteParamTextTag(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ {{ $t(`message['请输入参数值']`) }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">
        {{ $t(`message['取消']`) }}
      </el-button>
      <el-button
        type="primary"
        :loading="submitting"
        @click="submitMappingRelation">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import {
  removeLastLevelChildren,
  getFirstChildNodePath,
  convertObjectTreeToArray,
} from '../common/utils';
import {
  fetchSchemaItems,
  createParaMapping,
  editParaMapping,
} from '@/store/api/citics-tg.api';
export default {
  name: 'mapping-relation-dialog',
  data() {
    return {
      mappingRelationShip: {
        category: [],
        label: '',
        group_name: '',
        values: [],
        to_value: '',
      },
      rules: {
        category: [
          {
            required: true,
            message: this.$t(`message['请选择参数分类']`),
            trigger: 'change',
          },
        ],
        label: [
          {
            required: true,
            message: this.$t(`message['请选择参数名称']`),
            trigger: 'change',
          },
        ],
        group_name: [
          {
            required: true,
            message: this.$t(`message['请输入映射名称']`),
            trigger: 'blur',
          },
        ],
        values: [
          {
            required: true,
            message: this.$t(`message['请输入参数值']`),
            trigger: 'blur',
          },
        ],
        to_value: [
          {
            required: true,
            message: this.$t(`message['请输入映射值']`),
            trigger: 'blur',
          },
        ],
      },
      selectedParamClassify: null,
      selectedParamValue: null,
      inputVisible: false,
      inputValue: '',
      categoryOptions: [],
      categoryProps: {
        label: 'value',
        expandTrigger: 'hover',
      },
      paraValuesOption: [],

      currentEditId: null,
      submitting: false,
      schemaItemsArray: [],
      schemaItems: {},
    };
  },
  props: {
    currentEditItem: {
      type: Object,
      default: () => {},
    },
  },
  async created() {
    await this.handleGetSchemaItems();
    if (this.currentEditItem) {
      const { category, label, group_name, to_value, values } =
        this.currentEditItem;
      this.mappingRelationShip = {
        category,
        label,
        group_name,
        to_value,
        values,
      };
      this.currentEditId = this.currentEditItem.id;
      this.handleChangeCategory(category);
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async handleGetSchemaItems() {
      try {
        const params = {
          for_convert: true,
        };
        const res = await fetchSchemaItems(params);
        this.schemaItems = res.data;
        this.schemaItemsArray = convertObjectTreeToArray(res.data);
        this.categoryOptions = removeLastLevelChildren(
          _.cloneDeep(this.schemaItemsArray),
        );
        if (!this.currentEditId) {
          const defaultPath = getFirstChildNodePath(this.categoryOptions);
          this.mappingRelationShip.category = defaultPath;
          this.handleChangeCategory(defaultPath);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async submitMappingRelation() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSaveMappingRelation();
        } else {
          return false;
        }
      });
    },

    async handleSaveMappingRelation() {
      try {
        this.submitting = true;
        let { category, label } = this.mappingRelationShip;
        category = category.join('-');
        const data = {
          ...this.mappingRelationShip,
          category,
          field: `${category}-${label}`,
        };
        if (this.currentEditId) {
          await editParaMapping(this.currentEditId, data);
        } else {
          await createParaMapping(data);
        }
        this.$notify({
          title: '成功',
          message: `${this.currentEditId ? '修改' : '新增'}映射关系成功`,
          type: 'success',
        });
        this.close();
        this.$emit('fetchList');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitting = false;
      }
    },

    handleDeleteParamTextTag(tag) {
      this.mappingRelationShip.values.splice(
        this.mappingRelationShip.values.indexOf(tag),
        1,
      );
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.mappingRelationShip.values.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    handleChangeCategory(path) {
      let currentNode = this.schemaItems;
      path.forEach((key) => {
        if (currentNode[key]) {
          currentNode = currentNode[key];
        } else {
          return null;
        }
      });
      this.paraValuesOption = Object.keys(currentNode);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select,
.el-cascader {
  width: 100%;
}
.tags-list-box {
  width: calc(100% - 20px);
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 5px 10px;
  .el-input {
    width: 126px;
  }
  .el-tag {
    position: relative;
    margin-right: 10px;
    padding-right: 20px;
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: -11.5px;
    ::v-deep .el-tag__close {
      position: absolute;
      right: 3px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
