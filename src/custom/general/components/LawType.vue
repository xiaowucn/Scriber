<template>
  <el-dialog
    title="应用场景"
    :visible="true"
    width="510px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="closeDialog"
    class="law-type-dialog">
    <el-form
      ref="form"
      :model="form"
      label-width="70px"
      :rules="rules"
      @submit.native.prevent>
      <el-form-item label="场景名称" prop="name">
        <el-input v-model.trim="form.name"></el-input>
        <el-button type="text" @click="handleAddClick" class="add-btn">
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <div class="type-list">
      <el-tag
        class="type-item"
        v-for="item in types"
        :key="item.id"
        type="info"
        effect="dark"
        disable-transitions
        closable
        @close="handleDelete(item)">
        {{ item.name }}
      </el-tag>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'law-type',
  props: {
    typeOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入场景名称', trigger: 'blur' },
          {
            max: 30,
            message: '超出最大长度，请重新输入',
            trigger: 'blur',
          },
          { validator: this.validateName, trigger: 'blur' },
        ],
      },
      types: [],
    };
  },
  watch: {
    typeOptions: {
      handler() {
        this.updateTypes();
      },
      immediate: true,
    },
  },
  methods: {
    validateName(rule, value, callback) {
      const name = value.trim();
      if (name === '') {
        callback(new Error('请输入场景名称'));
        return;
      }
      if (this.types.find((item) => item.name === name)) {
        callback(new Error('场景名称已存在'));
        return;
      }
      callback();
    },
    async handleAddClick() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) {
        return;
      }
      this.$emit('add', this.form.name);
    },
    resetForm() {
      this.form.name = '';
    },
    updateTypes() {
      if (this.typeOptions.length > this.types.length) {
        this.form.name = '';
      }
      this.types = this.typeOptions;
    },

    handleDelete(item) {
      this.$emit('delete', item.id);
    },

    closeDialog() {
      this.$emit('close');
    },
    handleClose() {
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form {
  .el-form-item__label::before {
    display: none;
  }
  .el-form-item__content {
    display: flex;
    align-items: center;

    .add-btn {
      margin-left: 10px;
    }
  }
}
.type-list {
  height: 100px;
  padding: 20px 10px 20px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: auto;
}
.type-item {
  position: relative;
  margin-bottom: 15px;
  border-radius: 10px;
  margin-right: 10px;
  background-color: #0aacff !important;
  border-color: #0aacff !important;
  &:hover {
    ::v-deep .el-tag__close {
      display: block;
    }
  }

  ::v-deep .el-tag__close {
    position: absolute;
    right: -10px;
    top: -10px;
    color: #ffffff;
    background-color: $--color-primary;
    display: none;
  }
}
</style>
