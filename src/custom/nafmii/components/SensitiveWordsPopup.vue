<template>
  <div class="sensitive-words-popup">
    <el-dialog
      visible
      :title="title"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form
        ref="sensitiveWordsForm"
        label-width="100px"
        :model="sensitiveWordsForm"
        :rules="sensitiveWordsFormRules"
        class="sensitive-words-form">
        <el-form-item label="敏感词" prop="name">
          <el-input
            clearable
            ref="nameInput"
            v-model="sensitiveWordsForm.name"
            placeholder="请输入敏感词"></el-input>
        </el-form-item>
        <el-form-item label="敏感词类型" prop="type">
          <el-select
            clearable
            v-model="sensitiveWordsForm.type"
            placeholder="请选择敏感词类型">
            <el-option
              v-for="(type, index) in types"
              :key="index"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属系统" prop="system">
          <el-select
            v-model="sensitiveWordsForm.system"
            :clearable="isShowSystemClearable"
            placeholder="请选择归属系统"
            @change="handleSelectChange">
            <el-option
              v-for="(system, index) in systems"
              :key="index"
              :label="system.label"
              :value="system.value">
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
  name: 'sensitive-words-popup',
  props: {
    current: {
      type: Object,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
    systems: {
      type: Array,
      required: true,
    },
    generalSystemValue: {
      type: Number,
      required: false,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      sensitiveWordsForm: {
        name: '',
        type: '',
        system: '',
      },
      sensitiveWordsFormRules: {
        name: [{ required: true, validator: this.validateName }],
        type: [
          { required: true, message: '敏感词类型不能为空', trigger: 'change' },
        ],
      },
    };
  },
  created() {
    this.initSensitiveWords();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.nameInput.focus();
    });
  },
  computed: {
    title() {
      return this.isEdit ? '编辑敏感词' : '新建编辑敏感词';
    },
    submitMessage() {
      return this.isEdit ? '敏感词修改成功' : '敏感词新建成功';
    },
    isShowSystemClearable() {
      return this.sensitiveWordsForm.system !== this.generalSystemValue;
    },
  },
  methods: {
    validateName(rule, value, cb) {
      const name = this.sensitiveWordsForm.name.trim();
      if (!name) {
        cb(new Error('敏感词不能为空'));
        return;
      }
      cb();
    },
    initSelectedSystem() {
      this.sensitiveWordsForm.system = this.generalSystemValue;
    },
    initSensitiveWords() {
      Object.keys(this.sensitiveWordsForm).forEach((key) => {
        this.sensitiveWordsForm[key] = this.current[key] || '';
      });
      if (!this.sensitiveWordsForm.system) {
        this.initSelectedSystem();
      }
    },
    async handleSumbit() {
      const isValid = await this.$refs.sensitiveWordsForm
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          const params = {
            name: this.sensitiveWordsForm.name,
            sys_id: this.sensitiveWordsForm.system,
            type_id: this.sensitiveWordsForm.type,
          };
          if (this.isEdit) {
            await nafmiiApi.updateSensitiveWords(this.current.id, params);
          } else {
            await nafmiiApi.saveSensitiveWords(params);
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
    handleSelectChange(value) {
      if (!value) {
        this.initSelectedSystem();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.sensitive-words-popup {
  .sensitive-words-form {
    .el-select {
      width: 100%;
    }
  }
}
</style>
