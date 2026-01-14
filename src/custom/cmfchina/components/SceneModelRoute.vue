<template>
  <div class="model-management">
    <section class="top-header">
      <div class="model-info">
        <span>关联模型数:</span>
        <el-tag type="primary" size="mini">
          {{ relationModels.length }}
        </el-tag>
      </div>
      <div class="header-btns">
        <el-button
          type="primary"
          size="small"
          @click="relationDialogVisible = true">
          <i class="fa fa-plus fa-fw"></i>
          关联模型
        </el-button>
      </div>
    </section>

    <section>
      <el-table :data="relationModels" row-key="id" class="has-border">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="模型名称"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column
          prop="created_utc"
          align="center"
          label="创建时间"
          width="160">
          <template slot-scope="scope">
            {{ scope.row.created_utc | datetime }}
          </template>
        </el-table-column>
        <el-table-column prop="enable" align="center" label="启用状态">
          <template slot-scope="scope">
            <span :class="[!scope.row.enable ? '' : 'enabled-text']">
              {{ !scope.row.enable ? '未启用' : '已启用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="370">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.enable"
              type="text"
              size="mini"
              @click="openEnableModelDialog(scope.row.id)">
              启用模型
            </el-button>
            <el-button
              v-if="scope.row.enable"
              type="text"
              size="mini"
              @click="disableModel(scope.row)">
              停用模型
            </el-button>
            <el-button
              :disabled="scope.row.enable"
              type="text"
              size="mini"
              class="button-delete"
              @click="deleteModelRelation(scope.row)">
              删除模型
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

    <el-dialog
      v-if="relationDialogVisible"
      width="400px"
      title="关联模型"
      :visible="true"
      :close-on-click-modal="false"
      @close="closeNewRelationDialog">
      <el-form
        ref="relationForm"
        :model="relationForm"
        :rules="relationFormRules"
        label-position="left"
        label-width="80px">
        <el-form-item label="模型名称" prop="modelId">
          <el-select
            size="small"
            v-model="relationForm.modelId"
            v-loadmore="getMoreModels"
            placeholder="请选择模型名称">
            <el-option
              v-for="(model, index) in models.items"
              :key="index"
              :label="model.name"
              :value="model.id"></el-option>
            <el-option v-if="isLoadingMore" label="" value="">
              <i class="el-icon-loading"></i>
              <span style="margin-left: 10px; color: #999">loading...</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeNewRelationDialog"> 取消 </el-button>
        <el-button type="primary" @click="createModelRelation">
          确定
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="400px"
      title="启用模型"
      :visible.sync="enableModelDialogVisible"
      :close-on-click-modal="false">
      <p class="confirm-tips">确定启用该模型?</p>
      <el-checkbox v-model="modelChecked">
        利用该模型重新预测已有文件
      </el-checkbox>
      <span slot="footer">
        <el-button @click="enableModelDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="enableModel"> 确定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchModels,
  fetchSceneRelationModels,
  sceneRelationModels,
  enableModels,
} from '../../../store/api/cmfchina.api';

export default {
  name: 'model-management',
  props: {
    schemaId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      relationModels: [],
      relationDialogVisible: false,
      enableModelDialogVisible: false,
      modelChecked: true,
      enableModelId: 0,
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      relationForm: {
        modelId: '',
      },
      relationFormRules: {
        modelId: [{ required: true, message: '请选择模型' }],
      },
      isLoadingMore: false,
      models: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
      },
    };
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectDom = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap',
        );
        selectDom.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchRelatedModelList();
      this.getModels();
    },
    async getModels() {
      try {
        const params = {
          page: this.models.pager.page,
          size: this.models.pager.size,
        };
        const res = await fetchModels(params);
        this.models.items = [...this.models.items, ...res.data.items];
        this.models.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getMoreModels() {
      if (
        this.isLoadingMore ||
        this.models.pager.page * this.models.pager.size >=
          this.models.pager.total
      ) {
        return;
      }
      this.isLoadingMore = true;
      this.models.pager.page += 1;
      await this.getModels();
      this.isLoadingMore = false;
    },
    async fetchRelatedModelList() {
      try {
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        const res = await fetchSceneRelationModels(this.schemaId, params);
        this.relationModels = res.data.items;
        this.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleChangePage(page) {
      this.pager.page = page;
      this.fetchRelatedModelList();
    },
    closeNewRelationDialog() {
      this.relationDialogVisible = false;
      this.resetRelationForm();
    },
    async createModelRelation() {
      const isValid = await this.$refs['relationForm']
        .validate()
        .catch(() => {});
      if (!isValid) return;

      try {
        const modelData = {
          schemaId: this.schemaId,
          modelId: this.relationForm.modelId,
        };
        const data = {
          relation: true,
        };
        await sceneRelationModels(modelData, data);
        this.$notify({
          title: '成功',
          message: '关联模型成功',
          type: 'success',
        });
        this.relationDialogVisible = false;
        this.fetchRelatedModelList();
        this.resetRelationForm();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    resetRelationForm() {
      this.relationForm = {
        modelId: '',
      };
    },
    openEnableModelDialog(id) {
      this.enableModelDialogVisible = true;
      this.enableModelId = id;
    },
    async enableModel() {
      try {
        const params = {
          enable: true,
          preset: this.modelChecked,
        };
        await enableModels(this.schemaId, this.enableModelId, params);
        this.$notify({
          title: '成功',
          message: '启用模型成功',
          type: 'success',
        });
        this.fetchRelatedModelList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.enableModelDialogVisible = false;
      }
    },
    async disableModel(row) {
      const { id, name } = row;
      const confirm = await this.$confirm(
        `确定要停用模型 ${name} 吗？`,
        '停用模型',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          const params = {
            enable: false,
          };
          await enableModels(this.schemaId, id, params);
          this.$notify({
            title: '成功',
            message: '停用模型成功',
            type: 'success',
          });
          this.fetchRelatedModelList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async deleteModelRelation(row) {
      const { name, id } = row;
      const confirm = await this.$confirm(
        `确定要删除模型 ${name} 吗？`,
        '删除模型',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          const modelData = {
            schemaId: this.schemaId,
            modelId: id,
          };
          const data = {
            relation: false,
          };
          await sceneRelationModels(modelData, data);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.fetchRelatedModelList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
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
