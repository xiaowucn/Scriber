<template>
  <div class="model-management">
    <section class="top-header">
      <div class="model-info">
        <span>{{ $t(`message['模型版本总数']`) }}:</span>
        <el-tag type="primary" size="mini">
          {{ modelData.releaseList.length }}
        </el-tag>
      </div>
      <div v-if="!llmMode" class="header-btns">
        <el-button
          type="primary"
          size="small"
          :disabled="!canEditSchemaInMoldManagement"
          @click="newVersionDialogVisible = true">
          <i
            :class="
              $platform.isDefaultEnv() ? 'fa fa-plus fa-fw' : 'el-icon-plus'
            "></i>
          {{ $t(`message['新建版本']`) }}
        </el-button>
        <!-- <el-button type="primary" size="medium" icon="el-icon-download">
          {{ $t(`message['导入']`) }}
        </el-button>
        <el-button type="primary" size="medium" icon="el-icon-upload2">
          {{ $t(`message['导出']`) }}
        </el-button> -->
      </div>
    </section>

    <section class="model-management-table">
      <el-table
        :data="modelData.releaseList"
        row-key="id"
        class="has-border"
        :expand-row-keys="expandRowKeys">
        <el-table-column
          type="expand"
          width="0"
          v-if="!$platform.isDefaultEnv()">
          <tree-list v-if="tree.data" :data="tree.data" slot-scope="scope">
            <div v-if="node !== null" class="node-line" slot-scope="{ node }">
              <div>{{ node.data.label }}</div>
              <div class="node-operate">
                <el-tag
                  v-if="getModelText(node.meta, scope.row.predictors) !== ''"
                  type="primary"
                  size="mini"
                  :disable-transitions="true">
                  {{ getModelText(node.meta, scope.row.predictors) }}
                </el-tag>
                <el-tooltip
                  v-if="
                    node.meta._partType !== 'root' &&
                    !showViewModelButton(scope.row)
                  "
                  effect="dark"
                  :content="$t(`message['提取模式设置']`)"
                  placement="top"
                  transition="none">
                  <el-button
                    type="text"
                    class="fas fa-cog"
                    :disabled="!canEditSchemaInMoldManagement"
                    @click.stop="openModelExtractionConfig(node)"></el-button>
                </el-tooltip>
              </div>
            </div>
          </tree-list>
        </el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column
          v-if="!llmMode"
          prop="name"
          :label="$t(`message['版本名称']`)">
        </el-table-column>
        <el-table-column
          v-if="!llmMode"
          prop="created_time"
          align="center"
          :label="$t(`message['创建时间']`)"
          width="160">
        </el-table-column>
        <el-table-column
          prop="file_count"
          align="center"
          :width="$style.schemaModel.fileCountWidth"
          :label="$t(`message['训练文件基数']`)">
        </el-table-column>
        <el-table-column
          v-if="!llmMode"
          prop="precision"
          align="center"
          :width="$style.schemaModel.precisionWidth"
          :label="$t(`message['最新准确率']`)">
          <template slot-scope="scope">
            {{ scope.row.precision | conversionPercet }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          :label="$t(`message['模型状态']`)">
          <template slot-scope="scope">
            {{ modelTrainingStatus[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="enable"
          align="center"
          :label="$t(`message['启用状态']`)">
          <template slot-scope="scope">
            <span :class="[scope.row.enable === 0 ? '' : 'enabled-text']">{{
              scope.row.enable === 0
                ? $t(`message['未启用']`)
                : $t(`message['已启用']`)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="370"
          class-name="operations"
          :fixed="$features.operationColumnFixed()">
          <template slot-scope="scope">
            <template v-if="!isCustomModel(scope.row)">
              <el-button
                v-if="showViewModelButton(scope.row)"
                type="text"
                size="mini"
                @click="expandRow(scope.row, false)">
                {{ $t(`message['提取模式查看']`) }}
              </el-button>
              <el-button
                v-else-if="!llmMode"
                type="text"
                size="mini"
                :disabled="configModelButtonDisabled(scope.row)"
                @click="expandRow(scope.row, true)">
                {{ $t(`message['提取模式设置']`) }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                :key="`${scope.row.status}-${scope.row.enable}`"
                :disabled="trainingModelButtonDisabled(scope.row)"
                @click="openTrainModelDialog(scope.row)">
                {{ $t(`message['训练模型']`) }}
              </el-button>
              <el-button
                v-if="!llmMode"
                type="text"
                size="mini"
                :disabled="testModelButtonDisabled(scope.row)"
                @click="testModelAccuracy(scope.row.id)">
                {{ $t(`message['查看准确率']`) }}
              </el-button>
            </template>
            <el-button
              v-if="showDevelopModelTestButton(scope.row)"
              type="text"
              size="mini"
              @click="testModelAccuracy(scope.row.id)">
              {{ $t(`message['查看准确率']`) }}
            </el-button>
            <el-button
              v-if="showEnableModelButton(scope.row)"
              type="text"
              size="mini"
              @click="openEnableModelDialog(scope.row.id)">
              {{ $t(`message['启用模型']`) }}
            </el-button>
            <el-button
              v-if="showDisableModelButton(scope.row)"
              type="text"
              size="mini"
              @click="disableModel(scope.row)">
              {{ $t(`message['停用模型']`) }}
            </el-button>
            <el-button
              v-if="showDevelopModelDiffButton(scope.row)"
              type="text"
              size="mini"
              :disabled="scope.row.enable === modelEnableStatus.disabled"
              @click="viewModelDiff(scope.row.id)">
              {{ $t(`message['查看版本差异']`) }}
            </el-button>
            <el-button
              v-if="!isCustomModel(scope.row) && !llmMode"
              :disabled="deleteModelButtonDisabled(scope.row)"
              type="text"
              size="mini"
              class="button-delete"
              @click="deleteModelVersion(scope.row)">
              {{ $t(`message['删除模型']`) }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="handleChangePage"
        :current-page="pager.page"
        :page-size="pager.size"
        :total="pager.total">
      </el-pagination>
    </section>

    <select-folder-popup
      :visible="trainMoldVisible"
      :dialog-title="
        $t(`message['模型管理']`) + '-' + $t(`message['训练模型']`)
      "
      :dialog-title-tips="
        '（' + $t(`message['请确保样本文件已预处理并标注完成']`) + '）'
      "
      :node-text="$t(`message['该文件夹下样本']`)"
      :all-tree-nodes-disabled="trainingMode === trainingModeMap.origin"
      :checked-keys="currentModelVersion.dirs"
      class="select-file-popup"
      :export-action="exportAction"
      export-type="csv"
      :ok-button-disabled="trainingMode !== trainingModeMap.origin"
      @close="closeSelectFolderDialog"
      @update-export-files="trainModel">
      <div slot="subtitle" class="sub-title-container">
        <h4 class="sub-title">{{ $t(`message['选择样本']`) }}</h4>
        <div v-if="showTrainingModeHeader" slot="header" class="sub-options">
          <el-radio-group v-model="trainingMode">
            <el-radio :label="0">{{
              $t(`message['按原有样本范围']`)
            }}</el-radio>
            <el-radio :label="1">{{
              $t(`message['重新选择新样本']`)
            }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="content">
        <p v-if="trainingMode !== trainingModeMap.origin" class="notice-tips">
          {{
            this.$text.schema[
              '不选择范围，将引用该schema的所有文件标注答案进行训练'
            ]
          }}
        </p>
      </div>
    </select-folder-popup>

    <schema-mold-extract-setting
      v-if="modelExtractionSettingDialogVisible"
      :isEdit="isEditMoldExtract"
      :tree="tree"
      :schema="currentSettingSchema"
      :canEditSchema="canEditSchema"
      :getModelText="getModelText"
      :version-id="currentModelVersionId"
      @close="modelExtractionSettingDialogVisible = false"
      @update-model-config-success="
        configUpdated
      "></schema-mold-extract-setting>

    <schema-mold-extraction-config-dialog
      v-if="modelExtractionConfigDialogVisible"
      :model="modelExtractionConfig"
      :version-id="currentModelVersionId"
      @update-model-config-success="configUpdated"
      @close="clodeModelExtractionConfig">
    </schema-mold-extraction-config-dialog>

    <el-dialog
      v-if="newVersionDialogVisible"
      width="400px"
      :title="$t(`message['新建版本']`)"
      :visible="true"
      :close-on-click-modal="false"
      @close="closeNewVersionDialog">
      <el-form
        ref="versionForm"
        :model="versionForm"
        :rules="versionFormRules"
        label-position="left"
        label-width="120px">
        <el-form-item :label="$t(`message['模型版本名称']`)" prop="name">
          <el-input
            size="small"
            v-model="versionForm.name"
            :placeholder="$t(`message['模型版本名称']`)"></el-input>
        </el-form-item>
        <el-form-item label="" prop="copyId">
          <el-checkbox v-model="versionForm.isCopy" slot="label">
            {{ $t(`message['复制已有版本']`) }}
          </el-checkbox>
          <el-select
            size="small"
            v-model="versionForm.copyId"
            :disabled="!versionForm.isCopy"
            :placeholder="$t(`message['选择已有版本']`)">
            <el-option
              v-for="(version, index) in modelData.releaseList"
              :key="index"
              :label="version.name"
              :value="version.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeNewVersionDialog">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button type="primary" @click="createModelVersion">
          {{ $t(`message['确定']`) }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="400px"
      :title="$t(`message['启用模型']`)"
      :visible.sync="enableModelDialogVisible"
      :close-on-click-modal="false">
      <p class="confirm-tips">{{ $t(`message['确定启用该模型']`) }}?</p>
      <el-checkbox v-model="modelChecked">
        {{ $t(`message['利用该模型重新预测已有文件']`) }}
      </el-checkbox>
      <span slot="footer">
        <el-button @click="enableModelDialogVisible = false">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button type="primary" @click="enableModel">
          {{ $t(`message['确定']`) }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import {
  modelTrainingStatusMap,
  modelTrainingStatus,
  modelEnableStatus,
  exportActionMap,
} from '../store/constants';
import SelectFolderPopup from './SelectFolderPopup';
import TreeList from './tree/TreeList';
import SchemaMoldExtractionConfigDialog from './SchemaMoldExtractionConfigDialog';
import SchemaMoldExtractSetting from './SchemaMoldExtractSetting';

export default {
  name: 'model-management',
  components: {
    SelectFolderPopup,
    TreeList,
    SchemaMoldExtractionConfigDialog,
    SchemaMoldExtractSetting,
  },
  props: {
    schemaId: {
      type: Number,
      required: true,
    },
    llmMode: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['canEditSchema'],
  data() {
    return {
      timer: null,
      newVersionDialogVisible: false,
      trainMoldVisible: false,
      enableModelDialogVisible: false,
      customModelType: 20,
      enableModelVid: 0,
      modelChecked: true,
      trainigModel: 0,
      trainigHistroyModelId: null,
      currentModelVersion: {},
      versionForm: {
        name: '',
        isCopy: false,
        copyId: null,
        predictors: [],
      },
      versionFormRules: {
        name: [{ required: true, message: this.$t(`message['名称不能为空']`) }],
        copyId: [{ validator: this.copyVersionValidator }],
      },
      currentModelVersionId: null,
      showTrainingModeHeader: true,
      trainingModeMap: {
        origin: 0,
        new: 1,
      },
      trainingMode: 0,
      modelTrainingStatusMap,
      modelTrainingStatus,
      modelEnableStatus,
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      expandRowKeys: [],
      isEditMoldExtract: true,
      modelExtractionSettingDialogVisible: false,
      currentSettingSchema: {},
      modelExtractionConfigDialogVisible: false,
      modelExtractionConfig: {
        name: '',
        path: [],
        models: [{ name: '' }],
      },
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['schemas', 'tree', 'modelData']),
    exportAction() {
      return exportActionMap.trainingModel;
    },
    canEditSchemaInMoldManagement() {
      if (this.$platform.isNafmiiEnv()) {
        return true;
      }
      return this.canEditSchema();
    },
  },
  created() {
    if (this.$platform.isCiticsTGEnv()) {
      this.modelChecked = false;
    }
    this.init();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async init() {
      await this.fetchModelList();
      if (this.llmMode && this.schemas.model.releaseList.length === 0) {
        await this.$store.dispatch('schemaModule/createModelVersion', {
          schemaId: this.schemaId,
          name: '混合模型',
        });
        this.fetchModelList();
      }
    },
    async fetchModelList() {
      try {
        const res = await this.$store.dispatch(
          'schemaModule/fetchModelReleaseList',
          {
            schemaId: this.schemaId,
            page: this.pager.page,
          },
        );
        this.pager.total = res.total;

        if (
          res.items.some(
            (i) => i.status !== modelTrainingStatusMap.trainingFinished,
          )
        ) {
          clearInterval(this.timer);
          this.timer = setInterval(this.fetchModelList, 10e3);
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    isCustomModel(row) {
      return row.model_type === this.customModelType;
    },
    showDevelopModelTestButton(row) {
      return this.$features.showDevelopModelTest() && this.isCustomModel(row);
    },
    showDevelopModelDiffButton(row) {
      return this.$features.showDevelopModelDiff() && this.isCustomModel(row);
    },
    handleChangePage(page) {
      this.pager.page = page;
      this.fetchModelList();
    },
    resetVersionForm() {
      this.versionForm = {
        name: '',
        isCopy: false,
        copyId: null,
        predictors: [],
      };
    },
    closeNewVersionDialog() {
      this.newVersionDialogVisible = false;
      this.resetVersionForm();
    },
    configModelButtonDisabled(row) {
      return (
        !this.canEditSchemaInMoldManagement ||
        row.status === modelTrainingStatusMap.training ||
        (row.enable === modelEnableStatus.enabled &&
          row.status === modelTrainingStatusMap.trainingFinished)
      );
    },
    trainingModelButtonDisabled(row) {
      return (
        !this.canEditSchemaInMoldManagement ||
        row.status === modelTrainingStatusMap.training ||
        (row.enable === modelEnableStatus.enabled &&
          row.status === modelTrainingStatusMap.trainingFinished)
      );
    },
    testModelButtonDisabled(row) {
      return (
        !this.canEditSchemaInMoldManagement ||
        row.status !== modelTrainingStatusMap.trainingFinished
      );
    },
    deleteModelButtonDisabled(row) {
      return (
        !this.canEditSchemaInMoldManagement ||
        row.status === modelTrainingStatusMap.training ||
        (row.enable === modelEnableStatus.enabled &&
          row.status === modelTrainingStatusMap.trainingFinished)
      );
    },
    showViewModelButton(row) {
      return row.enable === modelEnableStatus.enabled;
    },
    showEnableModelButton(row) {
      return (
        row.enable === modelEnableStatus.disabled &&
        row.status === modelTrainingStatusMap.trainingFinished
      );
    },
    showDisableModelButton(row) {
      return (
        row.enable === modelEnableStatus.enabled &&
        row.status === modelTrainingStatusMap.trainingFinished
      );
    },
    async createModelVersion() {
      const isValid = await this.$refs['versionForm']
        .validate()
        .catch(() => {});
      if (!isValid) return;

      try {
        const modelData = {
          schemaId: this.schemaId,
          name: this.versionForm.name,
        };
        if (this.versionForm.isCopy) {
          const selectedVersion = this.modelData.releaseList.find(
            (v) => v.id === this.versionForm.copyId,
          );
          if (selectedVersion) {
            const { id, predictors } = selectedVersion;
            Object.assign(modelData, {
              predictors,
              copyId: id,
            });
          }
        }
        await this.$store.dispatch(
          'schemaModule/createModelVersion',
          modelData,
        );
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['新建模型版本成功']`),
          type: 'success',
        });
        this.newVersionDialogVisible = false;
        this.fetchModelList();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    closeSelectFolderDialog() {
      this.trainMoldVisible = false;
      this.trainingMode = this.trainingModeMap.origin;
    },
    async trainModel(treeNodes) {
      try {
        let modelData = {
          id: this.currentModelVersionId,
          data: {},
        };
        const ids = treeNodes.map((item) => item.id);
        if (treeNodes.every((i) => i.file_id)) {
          modelData.data.files_ids = ids;
        } else {
          modelData.data.tree_l = ids;
        }
        await this.$store.dispatch('schemaModule/trainModel', modelData);
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['开始训练']`),
          type: 'success',
        });
        this.fetchModelList();
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    async enableModel() {
      try {
        await this.$store.dispatch('schemaModule/enableModel', {
          versionId: this.enableModelVid,
          update: this.modelChecked ? 1 : 0,
          enable: 1,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['启用模型成功']`),
          type: 'success',
        });
        this.fetchModelList();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.enableModelDialogVisible = false;
      }
    },
    async disableModel(row) {
      const { id, name } = row;
      const message = this.llmMode
        ? '确定要停用模型吗？'
        : this.$t(`message['确定要停用模型 "{name}" 吗？']`, { name });
      const confirm = await this.$confirm(
        message,
        this.$t(`message['停用模型']`),
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await this.$store.dispatch('schemaModule/enableModel', {
            versionId: id,
            update: this.modelChecked ? 1 : 0,
            enable: 0,
          });
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(`message['停用模型成功']`),
            type: 'success',
          });
          this.fetchModelList();
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async deleteModelVersion(row) {
      const { id, name } = row;
      const confirm = await this.$confirm(
        this.$t(`message['确定要删除模型 "{name}" 吗？']`, { name }),
        this.$t(`message['删除模型']`),
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await this.$store.dispatch('schemaModule/deleteModelVersion', {
            versionId: id,
          });
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(`message['删除成功']`),
            type: 'success',
          });
          this.fetchModelList();
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    openEnableModelDialog(vid) {
      this.enableModelDialogVisible = true;
      this.enableModelVid = vid;
    },
    openTrainModelDialog(row) {
      const { id, status, predictors } = row;
      this.currentModelVersionId = id;
      if (predictors.length === 0) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['字段均未设置提取模式，不能训练']`),
          type: 'warning',
        });
        return;
      }
      this.currentModelVersion = this.modelData.releaseList.find(
        (i) => i.id === id,
      );
      if (status === this.modelTrainingStatusMap.trainingNotStarted) {
        this.showTrainingModeHeader = false;
        this.trainingMode = this.trainingModeMap.new;
      } else {
        this.showTrainingModeHeader = true;
      }
      this.trainMoldVisible = true;
    },
    testModelAccuracy(vid) {
      this.$router.push({
        name: 'schemaTree',
        query: {
          vid: vid,
        },
      });
    },
    viewModelDiff(vid) {
      this.$router.push({
        name: 'schemaTree',
        query: {
          vid: vid,
          diff_model: true,
        },
      });
    },
    expandRow(row, isEdit) {
      if (this.$platform.isDefaultEnv()) {
        this.currentModelVersionId = row.id;
        this.currentSettingSchema = row;
        this.isEditMoldExtract = isEdit;
        this.modelExtractionSettingDialogVisible = true;
        return;
      }
      const { id } = row;
      if (this.expandRowKeys.length === 0) {
        this.expandRowKeys.push(id);
      } else {
        if (this.expandRowKeys[0] === id) {
          this.expandRowKeys = [];
        } else {
          this.expandRowKeys = [];
          this.expandRowKeys.push(id);
        }
      }
      this.currentModelVersionId = id;
    },
    async configUpdated() {
      await this.fetchModelList();
      this.currentSettingSchema = this.modelData.releaseList.find((item) => {
        return item.id == this.currentModelVersionId;
      });
    },
    openModelExtractionConfig(node) {
      this.modelExtractionConfigDialogVisible = true;
      const currentModelVersion = this.modelData.releaseList.find(
        (i) => i.id === this.currentModelVersionId,
      );
      const path =
        node.meta._deepLabels.length > 1
          ? node.meta._deepLabels.slice(1)
          : node.meta._deepLabels;

      this.modelExtractionConfig.path = path;

      if (currentModelVersion) {
        const predictors = currentModelVersion.predictors || [];
        const currentField = predictors.find(
          (v) => v.path.at(-1) === node.data.label,
        );
        if (currentField) {
          this.modelExtractionConfig = {
            name:
              currentField.models.length > 0 ? currentField.models[0].name : '',
            path,
            models: currentField.models,
          };
        }
      }
    },
    clodeModelExtractionConfig() {
      this.modelExtractionConfigDialogVisible = false;
      this.modelExtractionConfig = {
        path: [],
        models: [{ name: '' }],
      };
    },
    getModelText(node, predictors) {
      if (!predictors) {
        return '';
      }
      const currentPredictor = predictors.find((i) =>
        _.isEqual(i.path, _.tail(node._deepLabels)),
      );
      if (currentPredictor && currentPredictor.models.length > 0) {
        const model = this.schemas.allPredictModelClass.find(
          (i) => i.value === currentPredictor.models[0].name,
        );
        return model ? model.label : '';
      }
      return '';
    },
    copyVersionValidator(rule, value, callback) {
      if (!this.versionForm.isCopy) {
        callback();
      }
      if (!value) {
        callback(this.$t(`message['选择已有版本']`));
      }
      callback();
    },
  },
};
</script>
<style lang="scss" scoped>
.model-management {
  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 30px;
    .model-info {
      display: flex;
      align-items: center;
      .el-tag {
        margin-left: 10px;
      }
    }
    .header-btns {
      .end-span {
        color: #606266;
        margin-right: 10px;
      }
    }
  }
  .el-table {
    .el-button--text {
      color: #5252ff;
      &:hover {
        color: blue;
      }
      &.is-disabled {
        color: #c0c4cc;
      }
    }
    .enabled-text {
      color: #409eff;
    }
    .button-delete {
      color: #f56c6c;
      &:hover {
        &:not(.is-disabled) {
          color: #ff3434;
        }
      }
    }
    ::v-deep .el-table__expand-column {
      .el-table__expand-icon {
        display: none;
      }
    }
  }
  .el-pagination {
    margin: 20px auto;
    text-align: center;
  }
  .select-file-popup {
    .sub-title-container {
      display: flex;
      align-items: center;
      .sub-title {
        position: relative;
        display: inline-block;
        margin: 10px 40px 10px 20px;
        &::before {
          position: absolute;
          top: 3px;
          left: -10px;
          content: '';
          width: 4px;
          height: 13px;
          background: #409eff;
        }
      }
      .sub-options {
        .el-radio {
          margin-right: 15px;
        }
      }
    }
    .notice-tips {
      margin: 10px;
      color: #ce6e6e;
    }
  }
  .schema-tree-list {
    .node-operate {
      display: flex;
      align-items: center;
      padding-right: 10px;
      .el-tag {
        margin: 0 30px;
      }
    }
  }
  ::v-deep .el-dialog__body {
    padding: 10px 20px;
    .el-form {
      .el-checkbox {
        font-weight: normal;
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
      .el-select {
        width: 100%;
      }
    }
    .el-radio {
      .el-radio__input {
        vertical-align: -2px;
      }
      .el-radio__label {
        padding-left: 5px;
      }
    }
    .confirm-tips {
      margin-bottom: 30px;
    }
  }
}
</style>
