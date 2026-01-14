<template>
  <div class="data-knowledge-popup">
    <el-dialog
      visible
      :title="title"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form
        ref="dataKnowledgeForm"
        label-width="120px"
        :model="dataKnowledgeForm"
        :rules="dataKnowledgeFormRules"
        class="data-knowledge-form">
        <el-form-item label="数据知识名称" prop="name">
          <el-input
            clearable
            ref="nameInput"
            v-model="dataKnowledgeForm.name"
            placeholder="请输入数据知识名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            clearable
            v-model="dataKnowledgeForm.type"
            placeholder="请选择类型">
            <el-option
              v-for="(type, index) in types"
              :key="index"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSumbit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { nafmii as nafmiiApi } from '../../../store/api';

export default {
  name: 'data-knowledge-popup',
  props: {
    current: {
      type: Object,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      dataKnowledgeForm: {
        name: '',
        type: '',
      },
      dataKnowledgeFormRules: {
        name: [{ required: true, validator: this.validateName }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
      },
    };
  },
  created() {
    this.initDataKnowledge();
  },
  mounted() {
    // el-dialog 传入的默认 slot 不会被立即渲染到 DOM 上，需使用 $nextTick 等待 DOM 更新完后才能通过 ref 获取相应组件。
    this.$nextTick(() => {
      this.$refs.nameInput.focus();
    });
  },
  computed: {
    title() {
      return this.isEdit ? '编辑数据知识' : '新建数据知识';
    },
    submitMessage() {
      return this.isEdit ? '数据知识修改成功' : '数据知识新建成功';
    },
  },
  methods: {
    validateName(rule, value, cb) {
      const name = this.dataKnowledgeForm.name.trim();
      if (!name) {
        cb(new Error('数据知识名称不能为空'));
        return;
      }
      cb();
    },
    initDataKnowledge() {
      Object.keys(this.dataKnowledgeForm).forEach((key) => {
        this.dataKnowledgeForm[key] = this.current[key] || '';
      });
    },
    async handleSumbit() {
      const isValid = await this.$refs.dataKnowledgeForm
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          const params = {
            name: this.dataKnowledgeForm.name,
            type: this.dataKnowledgeForm.type,
          };
          if (this.isEdit) {
            await nafmiiApi.updateDataKnowledge(this.current.id, params);
          } else {
            await nafmiiApi.saveDataKnowledge(params);
          }
          this.$notify({
            title: '成功',
            message: this.submitMessage,
            type: 'success',
          });
          this.$emit('fetch-list');
          this.handleClose();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.data-knowledge-popup {
  .data-knowledge-form {
    .el-select {
      width: 100%;
    }
  }
}
</style>
