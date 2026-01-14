<template>
  <el-dialog
    :visible="true"
    width="700px"
    :close-on-click-modal="false"
    @close="close">
    <span slot="title" class="el-dialog__title">
      提取模式设置: {{ dialogTitle }}
    </span>
    <schema-mold-extraction-config
      ref="config"
      :model="model"
      :versionId="versionId"
      :isShowHelper="true"
      @confirm="handleAfterSave"></schema-mold-extraction-config>
    <span slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SchemaMoldExtractionConfig from './SchemaMoldExtractionConfig.vue';
export default {
  name: 'schema-mold-extraction-config-dialog',
  components: { SchemaMoldExtractionConfig },
  props: {
    model: {
      type: Object,
      required: true,
    },
    versionId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dialogTitle() {
      return this.model.path.join('/');
    },
  },
  methods: {
    handleConfirm() {
      this.$refs.config.saveModelConfig();
    },
    handleAfterSave() {
      this.$emit('update-model-config-success');
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    &.mode {
      ::v-deep .el-form-item__content {
        display: flex;
        .el-select {
          margin-right: 10px;
        }
      }
    }
    .doc {
      line-height: 24px;
    }
    .config-list {
      li {
        list-style: none;
        .title {
          display: flex;
          align-items: center;
          .el-checkbox {
            margin-right: 5px;
          }
          .el-input {
            width: 80px;
            ::v-deep .el-input__inner {
              height: 24px;
              line-height: 24px;
            }
          }
          .el-radio-group {
            margin-left: 20px;
            .el-radio {
              margin-right: 10px;
              font-weight: normal;
            }
          }
        }
        .el-textarea {
          vertical-align: top;
        }
      }
    }
  }
  .el-form-item__content {
    display: flex;
    .regex-tips {
      color: red;
    }
  }
  .help-infos {
    padding: 0;
    li {
      list-style: none;
    }
  }
}
</style>
<style lang="scss">
.mold-config-helper {
  ul {
    max-height: 300px;
    overflow: auto;
    padding: 0;
    li {
      display: flex;
      align-items: baseline;
      padding: 10px 0;
      list-style: none;
      font-size: 13px;
      border-bottom: 1px solid #ebeef5;
      &:nth-child(odd) {
        background: #fafafa;
      }
      > strong {
        min-width: 120px;
        margin-right: 10px;
      }
    }
  }
}
</style>
