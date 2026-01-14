<template>
  <div class="schema-mold-training">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12" class="mold-info">
            <span
              >模型版本总数：
              <el-tag type="primary" size="mini"
                >{{ modelData.releaseList.length }}
              </el-tag>
            </span>
          </el-col>
          <el-col :span="12" class="training-button">
            <el-button
              type="primary"
              size="medium"
              icon="fa fa-cube"
              @click="visible = true">
              训练模型
            </el-button>
          </el-col>
        </el-row>
        <select-folder-popup
          :visible="visible"
          :dialog-title="
            isExtractionModelType ? '提取模型-训练模型' : '选择训练模型文件范围'
          "
          dialog-title-tips="（请确保样本文件已预处理并标注完成）"
          node-text="该文件夹下样本"
          @close="visible = false"
          @update-export-files="trainMold">
          <div slot="subtitle" class="sub-title-wrapper">
            <h4 v-if="isExtractionModelType" class="sub-title">选择样本范围</h4>
          </div>
          <div slot="content">
            <p class="tips">
              不选择范围，将引用该schema的所有文件标注答案进行训练
            </p>
            <div v-if="isExtractionModelType">
              <div class="sub-title-wrapper">
                <h4 class="sub-title">提取模式设置</h4>
                <span class="sub-title-tips"
                  >（需要在Schema树页面设置字段的提取模式）</span
                >
              </div>
              <el-radio-group v-model="trainigModel">
                <el-radio :label="0">按Schema字段处设置模式提取</el-radio>
                <el-radio :label="1">
                  <span class="select-label">按历史版本的模式提取</span>
                  <el-select
                    v-model="trainigHistroyModelId"
                    size="mini"
                    placeholder="请选择"
                    :disabled="trainigModel === 0">
                    <el-option
                      v-for="(item, index) in modelData.historyPredictors"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </select-folder-popup>
      </el-header>
      <el-main>
        <el-table :data="modelData.releaseList" style="width: 100%">
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column
            prop="created_time"
            align="center"
            label="模型版本（训练时间）">
          </el-table-column>
          <el-table-column
            prop="file_count"
            align="center"
            label="训练文件基数">
          </el-table-column>
          <el-table-column prop="precision" align="center" label="最新准确率">
            <template slot-scope="scope">
              {{ scope.row.precision | conversionPercet }}
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="模型状态">
          </el-table-column>
          <el-table-column prop="enable" align="center" label="启用状态">
            <template slot-scope="scope">
              <span v-if="scope.row.enable === 0">未启用</span>
              <span v-else class="model-enabled-text">已启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.enable === 0 && scope.row.status === '训练完毕'"
                type="text"
                size="mini"
                @click="openEnableModelDialog(scope.row.id)"
                >启用模型</el-button
              >
              <el-button
                type="text"
                size="mini"
                :disabled="scope.row.status !== '训练完毕'"
                @click="routeToTestModel(scope.row.id)"
                >测试准确率</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog
      width="400px"
      title="启用模型"
      :visible.sync="enableModelDialogVisible"
      :close-on-click-modal="false">
      <p class="confirm-tips">确定启用该模型？</p>
      <el-checkbox v-model="modelChecked"
        >利用该模型重新预测已有文件</el-checkbox
      >
      <span slot="footer">
        <el-button @click="enableModelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="enableModel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SelectFolderPopup from './SelectFolderPopup';

export default {
  name: 'schema-mold-training',
  components: { SelectFolderPopup },
  computed: {
    ...mapGetters('schemaModule', ['modelData', 'tree']),
    modelType() {
      // KV模型使用定位模型（moldLocation）的训练流程，但接口model_type需传值1
      if (Number(this.$route.query.moldType) === 1) {
        return 1;
      }
      return this.$route.params.panelType === 'moldExtraction' ? 1 : 2;
    },
    isExtractionModelType() {
      return this.$route.params.panelType === 'moldExtraction';
    },
  },
  props: {
    schemaId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      timer: null,
      visible: false,
      enableModelDialogVisible: false,
      enableModelVid: 0,
      modelChecked: true,
      trainigModel: 0,
      trainigHistroyModelId: null,
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    init() {
      this.fetchModelReleaseList();
      this.fetchModelHistoryPredictors();
    },
    fetchModelReleaseList() {
      try {
        this.$store.dispatch('schemaModule/fetchModelReleaseList', {
          schemaId: this.schemaId,
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    pollingFetch() {
      clearInterval(this.timer);
      this.timer = setInterval(this.fetchModelReleaseList, 5000);
    },
    fetchModelHistoryPredictors() {
      try {
        this.$store.dispatch('schemaModule/fetchModelHistoryPredictors', {
          schemaId: this.schemaId,
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async trainMold(treeNodes) {
      try {
        let modelData = {
          schemaId: this.schemaId,
          modelType: this.modelType,
          treeNodes: treeNodes.map((node) => node.id),
        };
        if (this.modelType === 1) {
          modelData.vid =
            this.trainigModel === 0 ? 0 : this.trainigHistroyModelId;
        }
        await this.$store.dispatch('schemaModule/trainModel', modelData);
        this.fetchModelReleaseList();
        this.pollingFetch();
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
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: '启用模型成功',
          type: 'success',
        });
        this.fetchModelReleaseList();
        this.pollingFetch();
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.enableModelDialogVisible = false;
      }
    },
    openEnableModelDialog(vid) {
      this.enableModelDialogVisible = true;
      this.enableModelVid = vid;
    },
    routeToTestModel(vid) {
      this.$router.push({
        name: 'schemaTree',
        query: {
          vid: vid,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.schema-mold-training {
  ::v-deep .el-header {
    font-size: 14px;
    line-height: 40px;
    height: 90px !important;
  }
  .mold-info {
    .predicted-num {
      color: #409eff;
    }
    span {
      margin-right: 25px;
    }
  }
  .training-button {
    text-align: right;
    .end-span {
      color: #606266;
      margin-right: 10px;
    }
  }
  .el-table {
    .model-enabled-text {
      color: #409eff;
    }
  }
  .el-footer {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 70px;
    z-index: 1;
    font-size: 16px;
    border-top: 1px solid #e3e3e3;
    margin-left: -19px;
    .class-name {
      padding-left: 76px;
      color: #409eff;
      font-weight: 500;
      padding-top: 17px;
    }
    .class-name-top {
      padding-left: 17px;
      color: #409eff;
      font-weight: 500;
      padding-top: 17px;
    }
    .el-table::before {
      height: 0;
    }
  }
  .tips {
    margin: 10px;
    color: #ce6e6e;
  }
  ::v-deep .el-dialog__body {
    padding: 0 20px 30px 20px;
    .confirm-tips {
      margin-bottom: 30px;
    }
    .el-radio__input {
      vertical-align: -2px;
    }
  }
  .select-label {
    margin-right: 10px;
  }
  .sub-title {
    position: relative;
    display: inline-block;
    margin-left: 12px;
    &::before {
      position: absolute;
      top: 13px;
      left: -10px;
      content: '';
      width: 4px;
      height: 13px;
      background: #409eff;
    }
  }
  .sub-title-tips {
    font-size: 14px;
    color: #939393;
  }
}
</style>
