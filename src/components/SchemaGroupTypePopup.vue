<template>
  <el-dialog
    v-if="current"
    :visible="true"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :before-close="closeDialog">
    <el-form
      ref="schemaTypeForm"
      :model="current"
      :rules="rules"
      label-width="80px">
      <el-form-item :label="$t(`message['名称']`)" prop="label">
        <el-input ref="nameInput" v-model="current.label"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">{{ $t(`message['取消']`) }}</el-button>
      <el-button type="primary" @click="saveEidt">
        {{ $t(`message['确定']`) }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'schema-group-type-popup',
  props: {
    openedFromTree: {
      type: Boolean,
      default: false,
    },
    groupTypeName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      current: null,
      rules: {
        label: [{ validator: this.groupTypeValidator, required: true }],
      },
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['tree', 'schemaTypes']),
    dialogTitle() {
      if (this.current.oldLabel) {
        return this.$t(`message['编辑组合类型']`);
      }
      return this.$t(`message['新增组合类型']`);
    },
  },
  methods: {
    openDialog(oldName = '') {
      if (oldName) {
        this.current = {
          oldLabel: oldName,
          label: oldName,
        };
      } else {
        this.current = {
          oldLabel: '',
          label: this.groupTypeName,
        };
      }
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    closeDialog() {
      this.current = null;
    },
    groupTypeValidator(rule, value, callback) {
      if (this.current === null) {
        return;
      }
      const label = value.trim();
      if (!label) {
        return callback(new Error(this.$t(`message['名称不能为空']`)));
      }
      if (this.current.oldLabel !== label) {
        const index = this.schemaTypes.findIndex((t) => t.label === label);
        if (index !== -1) {
          return callback(
            new Error(
              this.$t(`message['已有名称为"{label}"的类型']`, { label: label }),
            ),
          );
        }
      }
      callback();
    },
    async saveEidt() {
      const isValid = await this.$refs['schemaTypeForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        const { label, oldLabel } = this.current;
        if (this.openedFromTree) {
          this.$parent.createSchemaType(label);
          this.closeDialog();
          return;
        }
        if (label !== oldLabel) {
          await this.$store.dispatch('schemaModule/persistSchemaType', {
            label,
            oldLabel,
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
        this.closeDialog();
      }
    },
  },
};
</script>
