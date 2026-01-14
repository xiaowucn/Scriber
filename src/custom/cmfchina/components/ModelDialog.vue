<template>
  <el-dialog visible :before-close="close" :close-on-click-modal="false">
    <span slot="title">
      {{ currentEditId ? '编辑模型' : '新增模型' }}
    </span>
    <el-form ref="form" :rules="rules" :model="modelConfig" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="modelConfig.name"
          placeholder="请输入模型名称"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="modelConfig.address"
          placeholder="请输入模型地址"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input
          v-model="modelConfig.intro"
          placeholder="请输入简介"></el-input>
      </el-form-item>
      <el-form-item label="使用方式" prop="usage">
        <el-input
          v-model="modelConfig.usage"
          type="textarea"
          placeholder="请输入使用方式"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close"> 取消 </el-button>
      <el-button
        type="primary"
        :loading="submitting"
        @click="submitModelConfig">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { createdModels, updateModels } from '../../../store/api/cmfchina.api';
export default {
  name: 'create-model-dialog',
  data() {
    return {
      modelConfig: {
        name: '',
        address: '',
        intro: '',
        usage: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入模型名称',
            trigger: 'blur',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入模型地址',
            trigger: 'blur',
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
  mounted() {
    if (this.currentEditItem) {
      for (let key in this.modelConfig) {
        this.modelConfig[key] = this.currentEditItem[key];
      }
      this.currentEditId = this.currentEditItem.id;
    }
  },
  computed: {
    ...mapGetters(['loginUser']),
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submitModelConfig() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handleSaveModelConfig();
        } else {
          return false;
        }
      });
    },
    async handleSaveModelConfig() {
      try {
        this.submitting = true;
        const data = this.modelConfig;
        if (this.currentEditId) {
          await updateModels(this.currentEditId, data);
        } else {
          await createdModels(data);
        }
        this.$notify({
          title: '成功',
          message: `${this.currentEditId ? '修改' : '新增'}模型成功`,
          type: 'success',
        });
        this.close();
        this.$emit('fetch-list');
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

<style lang="scss" scoped></style>
