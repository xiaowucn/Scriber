<template>
  <el-dialog visible :before-close="close" :close-on-click-modal="false">
    <span slot="title">
      {{
        currentEditId ? $t(`message['编辑项目']`) : $t(`message['新增项目']`)
      }}
    </span>
    <el-form ref="form" :model="project" :rules="rules" label-width="80px">
      <el-form-item :label="$t(`message['项目名称']`)" prop="name">
        <el-input
          v-model="project.name"
          :placeholder="$t(`message['请输入项目名称']`)"></el-input>
      </el-form-item>
      <el-form-item
        class="mold-select-wrapper"
        :label="$t(`message['产品类型']`)"
        prop="meta.product_type">
        <el-select
          clearable
          :disabled="!canChangeProductType"
          :placeholder="$t(`message['请选择产品类型']`)"
          v-model="project.meta.product_type">
          <el-option
            v-for="item in productTypes"
            :key="item"
            :label="item"
            :value="item"></el-option>
        </el-select>
        <p v-if="!canChangeProductType" class="form-custom-tips">
          {{ $t(`message['提示']`) }}：
          {{ $t(`message['产品类型已关联项目中的模型，不能被修改']`) }}。
        </p>
      </el-form-item>
      <el-form-item :label="$t(`message['产品名称']`)" prop="meta.product_name">
        <el-input
          v-model="project.meta.product_name"
          :placeholder="$t(`message['请输入产品名称']`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`message['产品代码']`)" prop="meta.product_num">
        <el-input
          v-model="project.meta.product_num"
          :placeholder="$t(`message['请输入产品代码']`)"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">
        {{ $t(`message['取消']`) }}
      </el-button>
      <el-button type="primary" :loading="submitting" @click="persistProject">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveProject, updateProject } from '@/store/api/project.api';
import { fetchAllFiles } from '@/store/api/file.api';
export default {
  name: 'create-project-dialog',
  data() {
    return {
      project: {
        name: '',
        meta: {
          product_type: '',
          product_name: '',
          product_num: '',
        },
      },
      submitting: false,
      rules: {
        name: [
          {
            required: true,
            message: this.$t(`message['请输入项目名称']`),
            trigger: 'blur',
          },
        ],
        'meta.product_type': [
          {
            required: true,
            message: this.$t(`message['请选择产品类型']`),
            trigger: 'change',
          },
        ],
        'meta.product_name': [
          {
            required: true,
            message: this.$t(`message['请输入产品名称']`),
            trigger: 'blur',
          },
        ],
        'meta.product_num': [
          {
            required: true,
            message: this.$t(`message['请输入产品代码']`),
            trigger: 'blur',
          },
        ],
      },
      currentEditId: null,
      canChangeProductType: true,
    };
  },
  props: {
    currentEditItem: {
      type: Object,
      default: () => {},
    },
    productTypes: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    if (this.currentEditItem) {
      for (let key in this.project) {
        this.project[key] = this.currentEditItem[key];
      }
      this.currentEditId = this.currentEditItem.id;
      this.fetchCurrentProjectFile();
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    persistProject() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSaveProject();
        } else {
          return false;
        }
      });
    },
    async handleSaveProject() {
      try {
        this.submitting = true;
        if (this.currentEditId) {
          await updateProject(this.currentEditId, this.project);
        } else {
          const data = { ...this.project, visible: false };
          await saveProject(data);
        }
        this.$notify({
          title: '成功',
          message: `${this.currentEditId ? '修改' : '新增'}项目成功`,
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
    async fetchCurrentProjectFile() {
      try {
        const res = await fetchAllFiles(this.currentEditId);
        if (res.data.total > 0) {
          this.canChangeProductType = false;
        } else {
          this.canChangeProductType = true;
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.form-custom-tips {
  font-size: 12px;
  color: #f56c6c;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  left: 0;
  top: 100%;
}
.folder-perm-tips {
  margin-left: 5px;
  color: #f56c6c;
}
</style>
