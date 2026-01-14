<template>
  <el-dialog
    title="修改文档"
    :visible="true"
    width="510px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="closeDialog"
    class="custom-node-dialog">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="left"
      :rules="rules">
      <el-form-item label="文档名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="应用场景" prop="scenario_ids">
        <el-select
          v-model="form.scenario_ids"
          multiple
          filterable
          clearable
          class="type-select">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :value="item.id"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit-law-dialog',
  props: {
    typeOptions: {
      type: Array,
      default: () => [],
    },
    defaultForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        name: '',
        scenario_ids: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入文档名称', trigger: 'blur' },
          {
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur',
          },
        ],
        scenario_ids: [
          { required: true, message: '请选择应用场景', trigger: 'change' },
        ],
      },
    };
  },
  created() {
    this.form = {
      id: this.defaultForm.id,
      name: this.defaultForm.name,
      scenario_ids: this.defaultForm.scenarios.map((item) => item.id),
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    handleCancel() {
      this.closeDialog();
    },
    async handleConfirm() {
      const valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.$emit('confirm', this.form);
    },
  },
};
</script>

<style lang="scss" scoped>
.type-select {
  width: 100%;
}
</style>
