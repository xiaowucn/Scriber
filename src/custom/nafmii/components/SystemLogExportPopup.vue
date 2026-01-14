<template>
  <div class="system-log-export-popup">
    <el-dialog
      visible
      title="导出日志"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form
        label-width="140px"
        ref="exportLogForm"
        :model="exportLogForm"
        :rules="exportLogFormRules">
        <el-form-item label="导出日志时间区间" prop="date">
          <el-date-picker
            v-model="exportLogForm.date"
            type="daterange"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="exportLog">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { nafmii as nafmiiApi } from '../../../store/api';
import { downloadFileByBlob } from '../../../utils';

export default {
  name: 'system-log-export-popup',
  data() {
    return {
      exportLogForm: {
        date: '',
      },
      exportLogFormRules: {
        date: [
          {
            required: true,
            message: '请选择导出日志时间区间',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    async exportLog() {
      const isValid = await this.$refs['exportLogForm']
        .validate()
        .catch(() => {});
      if (isValid) {
        try {
          const params = {
            start: this.exportLogForm.date[0] / 1000,
            end: this.exportLogForm.date[1] / 1000,
          };
          const res = await nafmiiApi.exportSystemLog(params);
          await downloadFileByBlob(res);
          this.$notify({
            title: '成功',
            message: '导出成功',
            type: 'success',
          });
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
  },
};
</script>

<style scoped lang="scss">
.system-log-export-popup {
  ::v-deep .el-dialog {
    width: 550px;
  }
  ::v-deep .el-form {
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
