<template>
  <el-dialog visible :before-close="close" :close-on-click-modal="false">
    <span slot="title">
      {{
        currentEditId ? $t(`message['编辑模板']`) : $t(`message['新增模板']`)
      }}
    </span>
    <el-form ref="form" :model="template" :rules="rules" label-width="80px">
      <el-form-item :label="$t(`message['模板名称']`)" prop="name">
        <el-input
          v-model="template.name"
          :placeholder="$t(`message['请输入模板名称']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['业务组']`)" prop="business_group">
        <el-select
          :placeholder="$t(`message['请选择业务组']`)"
          v-model="template.business_group">
          <el-option
            v-for="item in businessGroups"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`message['文档分类']`)" prop="mold">
        <el-select
          :placeholder="$t(`message['请选择文档分类']`)"
          v-model="template.mold"
          @change="handleMoldchange">
          <el-option
            v-for="item in schemas"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`message['参数选择']`)" prop="fields">
        <div class="tree-box" v-loading="schemaItemsLoading">
          <el-tree
            ref="tree"
            :data="schemaItemsArray"
            :props="defaultProps"
            default-expand-all
            show-checkbox
            node-key="key"
            :empty-text="$t(`message['请先选择文档分类']`)"
            :default-checked-keys="template.fields"
            @check="handleTreeNodeSelect"></el-tree>
        </div>
      </el-form-item>
      <el-form-item class="checkbox-wrapper">
        <el-checkbox v-model="template.is_default">{{
          $t(`message['默认模板']`)
        }}</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">
        {{ $t(`message['取消']`) }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="submitTemplate">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { convertObjectTreeToArray } from '../common/utils';
import { fetchSchemaItems } from '@/store/api/citics-tg.api';
import { createTemplate, editTemplate } from '@/store/api/citics-tg.api';
export default {
  name: 'create-template-dialog',
  data() {
    return {
      template: {
        name: '',
        business_group: '',
        mold: '',
        fields: [],
        is_default: false,
      },
      defaultProps: {
        children: 'children',
        label: 'value',
      },
      isDefaultTemplate: false,
      schemaItemsArray: [],
      schemaItemsLoading: false,
      rules: {
        name: [
          {
            required: true,
            message: this.$t(`message['请输入模板名称']`),
            trigger: 'blur',
          },
        ],
        business_group: [
          {
            required: true,
            message: this.$t(`message['请选择业务组']`),
            trigger: 'change',
          },
        ],
        mold: [
          {
            required: true,
            message: this.$t(`message['请选择文档分类']`),
            trigger: 'change',
          },
        ],
        fields: [
          {
            required: true,
            message: this.$t(`message['请选择参数']`),
            trigger: 'change',
          },
        ],
      },
      submitting: false,
      currentEditId: null,
    };
  },
  props: {
    currentEditItem: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    if (this.currentEditItem) {
      const { id, business_group, fields, is_default, mold, name } =
        this.currentEditItem;
      const currentMoldId = this.schemas.find((item) => item.name === mold)?.id;
      this.handleMoldchange(currentMoldId);
      this.template = {
        business_group,
        fields,
        is_default,
        mold: currentMoldId,
        name,
      };
      this.currentEditId = id;
    }
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('citicsTgModule', ['schemas', 'businessGroups']),
  },
  methods: {
    close() {
      this.$emit('close');
    },

    async handleMoldchange(val) {
      if (!val) {
        return;
      }
      try {
        this.schemaItemsLoading = true;
        const params = {
          mold: val,
        };
        const res = await fetchSchemaItems(params);
        this.schemaItemsArray = convertObjectTreeToArray(res.data);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.schemaItemsLoading = false;
      }
    },

    handleTreeNodeSelect() {
      this.template.fields = this.$refs.tree.getCheckedKeys(true);
      this.$refs.form.validateField('fields');
    },

    submitTemplate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSaveTemplate();
        } else {
          return false;
        }
      });
    },
    async handleSaveTemplate() {
      try {
        this.submitting = true;
        const data = {
          ...this.template,
          uid: this.loginUser.id,
        };
        if (this.currentEditId) {
          await editTemplate(this.currentEditId, data);
        } else {
          await createTemplate(data);
        }
        this.$notify({
          title: '成功',
          message: `${this.currentEditId ? '修改' : '新增'}模板成功`,
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
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.tree-box {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  max-height: calc(50vh - 250px);
  overflow-y: auto;
}

.checkbox-wrapper {
  margin-bottom: 0;
  .el-checkbox {
    float: right;
  }
  ::v-deep .el-form-item__content {
    line-height: 20px;
  }
}
</style>
