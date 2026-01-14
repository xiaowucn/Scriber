<template>
  <el-dialog
    :visible="true"
    :width="isEdit ? '1150px' : '540px'"
    top="10vh"
    :close-on-click-modal="false"
    @close="close">
    <div class="title" slot="title">
      <span>提取模式{{ isEdit ? '设置' : '查看' }}</span>
    </div>
    <div class="setting-container">
      <tree-list v-if="tree.data" :data="tree.data">
        <div v-if="node !== null" class="node-line" slot-scope="{ node }">
          <div class="label">{{ node.data.label }}</div>
          <div class="node-operate">
            <el-tag
              v-if="getModelText(node.meta, schema.predictors) !== ''"
              type="primary"
              size="mini"
              :disable-transitions="true">
              {{ getModelText(node.meta, schema.predictors) }}
            </el-tag>
            <el-tooltip
              v-if="
                node.meta._partType !== 'root' &&
                node.meta._parent.length < 3 &&
                !showViewModelButton(schema)
              "
              effect="dark"
              :content="$t(`message['提取模式设置']`)"
              placement="top"
              transition="none">
              <el-button
                type="text"
                :disabled="!canEditSchemaInMoldExtractSetting"
                @click.stop="openModelExtractionConfig(node)">
                <svg-font-icon
                  :name="isActive(node) ? 'setting-fill' : 'setting'"
                  :size="20"
                  :color="isActive(node) ? '' : '#606266'"></svg-font-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </tree-list>
      <template v-if="isEdit">
        <div class="setting-config" v-if="modelExtractionConfig">
          <span class="mode-title">{{ modeTitle }}</span>
          <schema-mold-extraction-config
            ref="config"
            class="config-content"
            :model="modelExtractionConfig"
            :versionId="versionId"
            :predictors="predictors"
            @confirm="handleAfterSave"
            @goto-first-field-settings="openModelExtractionConfig">
          </schema-mold-extraction-config>
          <div class="operation-buttons">
            <el-button @click="modelExtractionConfig = null">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
          </div>
        </div>
        <div v-else class="setting-config nodata">
          <img src="../images/no-model-setting.svg" class="no-data" />
          <span>点击左侧“设置”按钮，选取提取模式</span>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import TreeList from './tree/TreeList';
import { modelEnableStatus } from '../store/constants';
import { mapGetters } from 'vuex';
import SchemaMoldExtractionConfig from './SchemaMoldExtractionConfig.vue';
export default {
  components: { TreeList, SchemaMoldExtractionConfig },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
    versionId: {
      type: Number,
      required: true,
    },
    tree: {
      type: Object,
      default: () => ({}),
    },
    schema: {
      type: Object,
      default: () => ({}),
    },
    canEditSchema: {
      type: Function,
    },
    getModelText: {
      type: Function,
    },
  },
  data() {
    return {
      predictors: [],
      modelExtractionConfig: null,
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['schemas', 'modelData']),
    modeTitle() {
      if (!this.modelExtractionConfig) {
        return '';
      }
      return this.modelExtractionConfig.path.join('/');
    },
    canEditSchemaInMoldExtractSetting() {
      if (this.$platform.isNafmiiEnv()) {
        return true;
      }
      return this.canEditSchema();
    },
  },
  methods: {
    showViewModelButton(row) {
      return row.enable === modelEnableStatus.enabled;
    },
    isActive(node) {
      if (!this.modelExtractionConfig) {
        return false;
      }
      const path =
        node.meta._deepLabels.length > 1
          ? node.meta._deepLabels.slice(1)
          : node.meta._deepLabels;

      return _.isEqual(this.modelExtractionConfig.path, path);
    },
    openModelExtractionConfig(node) {
      const currentModelVersion = this.modelData.releaseList.find(
        (i) => i.id === this.versionId,
      );
      const path =
        node.meta._deepLabels.length > 1
          ? node.meta._deepLabels.slice(1)
          : node.meta._deepLabels;

      const primaryKeys = node.children.map((child) => child.data.label);

      this.modelExtractionConfig = {
        name: '',
        path: path,
        models: [{ name: '' }],
        meta: node.meta,
        children: node.children,
        sub_primary_key: primaryKeys,
      };

      if (currentModelVersion) {
        const predictors = currentModelVersion.predictors || [];
        const currentField = predictors.find((v) =>
          _.isEqual(v.path, _.tail(node.meta._deepLabels)),
        );
        this.predictors = predictors;
        if (currentField) {
          this.modelExtractionConfig = {
            ...this.modelExtractionConfig,
            name:
              currentField.models.length > 0 ? currentField.models[0].name : '',
            models: currentField.models,
            sub_primary_key: currentField.sub_primary_key || primaryKeys,
          };
        }
      }
    },
    handleConfirm() {
      this.$refs.config.saveModelConfig();
    },
    handleAfterSave() {
      this.$emit('update-model-config-success');
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .node-label {
  margin-left: 5px;
  .node-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      flex: unset;
      display: inline-block;
      max-width: 497px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .node-operate {
      display: flex;
      align-items: center;
      line-height: 1;
      margin-left: 15px;
      .el-tag {
        margin-right: 15px;
      }
      .el-button--text {
        padding: 0;
      }
    }
  }
}
.mode-title {
  color: $--color-primary;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 10px;
}
.setting-container {
  position: relative;
  display: flex;
  .schema-tree-list {
    width: 500px;
    height: 575px;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 10px;
    box-sizing: border-box;
  }
  .setting-config {
    width: 600px;
    height: 575px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(0, 0, 0, 0.06);
    margin-left: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    &.nodata {
      align-items: center;
      justify-content: center;
      .no-data {
        width: 142px;
        margin-bottom: 10px;
      }
    }
    .config-content {
      flex: 1;
      overflow-y: auto;
    }
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
    .operation-buttons {
      display: flex;
      justify-content: flex-end;
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
