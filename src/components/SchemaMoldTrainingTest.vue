<template>
  <div class="schema-mold-training">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12">
            <el-button type="text" icon="el-icon-back" @click="goback"
              >返回</el-button
            >
          </el-col>
          <el-col :span="12" class="training-button">
            <el-button
              type="primary"
              size="medium"
              icon="fa fa-cube"
              @click="testAccuracy">
              {{ !isDiffModel ? '测试准确率' : '测试版本差异' }}
            </el-button>
          </el-col>
        </el-row>
        <select-folder-popup
          ref="selectFolderPopup"
          :visible="visible"
          dialog-title="选择测试样本"
          node-text="该文件夹下样本"
          :dialog-title-tips="
            isDiffModel
              ? '（版本差异测试只是当前版本与最近版本之间的差异比较）'
              : '（请确保样本文件已预处理并标注完成）'
          "
          :show-tree-modal="selectNewDisabled"
          :export-action="exportAction"
          @close="closeFolderPopup"
          @update-export-files="testMold">
          <!-- <div slot="subtitle" class="subtitle">
            <el-radio v-model="trainigMode" label="new">选择新样本</el-radio>
          </div> -->
          <div slot="content">
            <!-- <div>
              <el-radio v-model="trainigMode" label="history"
                >选择历史样本</el-radio
              >
            </div>
            <el-select
              v-model="trainigHistroyModelId"
              size="mini"
              placeholder="请选择"
              :disabled="selectHistoryDisabled"
            >
              <el-option
                v-for="(item, index) in modelData.testHistoryList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div>
              <el-checkbox v-model="checked">测试完毕后，重新生成测试样本的预测答案</el-checkbox>
            </div> -->
            <!-- <div class="tips">
              不选择范围，将引用该schema的所有文件标注答案进行测试
            </div> -->
            <div v-if="!isDiffModel">
              <span>是否导出测试报告</span>
              <el-switch v-model="exportExcel" />
            </div>
          </div>
        </select-folder-popup>
      </el-header>
      <el-main>
        <el-table :data="modelData.testList" style="width: 100%">
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="created_utc" label="测试版本（测试时间）">
            <template slot-scope="scope">
              {{ scope.row.created_utc | datetime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="file_count"
            align="center"
            label="测试文件基数">
          </el-table-column>
          <el-table-column
            v-if="!isDiffModel"
            prop="precision"
            align="center"
            label="整体准确率">
            <template slot-scope="scope">
              {{ scope.row.precision | conversionPercet }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="isDiffModel"
            prop="old_version"
            align="center"
            label="旧版本名称">
            <template slot-scope="scope">
              {{ scope.row.data.old_version_name }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="isDiffModel"
            prop="new_version"
            align="center"
            label="新版本名称">
            <template slot-scope="scope">
              {{ scope.row.data.version_name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="测试状态">
            <span slot-scope="scope" :class="scope.row.status">
              {{ scope.row.status | getTestStatus }}
            </span>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template slot-scope="scope">
              <div class="operations">
                <el-button
                  v-if="scope.row.export_path"
                  type="text"
                  size="mini"
                  @click="downloadExcel(scope.row.id)">
                  {{ isDiffModel ? '下载差异化报告' : '下载测试报告' }}
                </el-button>
                <el-button
                  v-if="!isDiffModel"
                  type="text"
                  size="mini"
                  @click="viewDetails(scope.row.vid, scope.row.id)"
                  >查看详情</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SelectFolderPopup from './SelectFolderPopup';
import { baseURL } from '@/store/api/http';
import { exportActionMap } from '../store/constants';

export default {
  name: 'schema-mold-training-test',
  components: { SelectFolderPopup },
  computed: {
    ...mapGetters('schemaModule', ['modelData', 'tree']),
    isShowResult() {
      return this.modelData.testList.length !== 0;
    },
    totalFile() {
      return this.modelData.testList[0].file_count;
    },
    isDiffModel() {
      return this.$route.query.diff_model;
    },
    exportAction() {
      if (this.isDiffModel) {
        return exportActionMap.diffModel;
      }
      return exportActionMap.getTrainingData;
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
      trainigMode: 'new',
      trainigHistroyModelId: null,
      selectNewDisabled: false,
      selectHistoryDisabled: true,
      checked: false,
      exportExcel: true,
    };
  },
  filters: {
    getTestStatus(status) {
      switch (status) {
        case 'doing':
          return '测试中';
        case 'done':
          return '测试完成';
        case 'failed':
          return '测试失败';
        default:
          return '-';
      }
    },
  },
  watch: {
    trainigMode(val) {
      if (val === 'new') {
        this.selectNewDisabled = false;
        this.selectHistoryDisabled = true;
      } else {
        this.selectNewDisabled = true;
        this.selectHistoryDisabled = false;
      }
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
      this.fetchModelTestList();
      this.fetchModelTestHistoryList();
    },
    fetchModelTestList() {
      try {
        const { vid } = this.$route.query;
        const params = { vid };
        if (this.isDiffModel) {
          params.diff_model = true;
        }
        this.$store.dispatch('schemaModule/fetchModelTestList', params);
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchModelTestHistoryList() {
      try {
        await this.$store.dispatch('schemaModule/fetchModelTestHistoryList', {
          versionId: Number(this.$route.query.vid),
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    pollingFetch() {
      clearInterval(this.timer);
      this.timer = setInterval(this.fetchModelTestList, 5000);
    },
    async testMold(treeNodes) {
      let modelData = {
        vid: Number(this.$route.query.vid),
        update: this.checked ? 1 : 0,
        export_excel: this.exportExcel,
      };
      if (this.isDiffModel) {
        modelData.diff_model = true;
      }
      const ids = treeNodes.map((item) => item.id);
      const fileIds = treeNodes
        .filter((item) => item.file_id)
        .map((item) => item.id);
      if (fileIds.length > 0) {
        modelData.files_ids = fileIds;
      } else {
        modelData.tree_l = ids;
      }
      try {
        await this.$store.dispatch('schemaModule/testModel', modelData);

        this.$notify({
          title: '成功',
          message: '发起测试成功',
          type: 'success',
        });

        this.fetchModelTestList();
        this.pollingFetch();
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    viewDetails(vid, id) {
      this.$router.push({
        name: 'schemaTree',
        query: {
          vid: vid,
          testId: id,
        },
      });
    },
    closeFolderPopup() {
      this.visible = false;
      this.exportExcel = true;
    },
    downloadExcel(id) {
      const link = document.createElement('a');
      link.href = `${baseURL}/accuracy-records/${id}?export_excel=true`;
      link.setAttribute('download', '');
      link.click();
    },
    goback() {
      history.go(-1);
    },
    async testAccuracy() {
      const treeDataIsEmpty =
        await this.$refs.selectFolderPopup.checkTreeDataIsEmpty();
      if (treeDataIsEmpty) {
        this.$notify({
          title: '提示',
          message: this.isDiffModel
            ? '暂无差异数据（版本），无法测试'
            : '暂无标注数据，无法进行测试',
          type: 'warning',
        });
        return;
      }
      this.visible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.schema-mold-training {
  .subtitle {
    margin-top: -30px;
  }

  ::v-deep .el-header {
    font-size: 14px;
    line-height: 40px;
    height: 90px !important;
  }

  .el-table {
    .cell {
      .failed {
        color: #f56c6c;
      }
    }
  }

  .tips {
    color: #ce6e6e;
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

  .el-select {
    width: 100%;
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

  .operations {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
  }

  .el-switch {
    margin-left: 10px;
  }
}
</style>
