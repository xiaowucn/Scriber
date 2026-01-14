<template>
  <div class="contract-detail-wrapper" v-loading="isLoading">
    <div class="contract-detail-header">
      <el-breadcrumb>
        <el-breadcrumb-item>合同详情页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ contract.project_name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        type="primary"
        size="small"
        class="back"
        @click="handleBackClick"
        >返回</el-button
      >
    </div>
    <div class="contract-detail-content">
      <section class="contract-info">
        <h5>合同信息</h5>
        <el-form
          :inline="true"
          :model="contract"
          disabled
          label-position="right"
          label-width="150px">
          <el-form-item label="合同编号">
            <el-input v-model="contract.contract_no"></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="contract.project_name"></el-input>
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="contract.company_name"></el-input>
          </el-form-item>
          <el-form-item label="签订日期">
            <el-input v-model="contract.meta['签订日期']"></el-input>
          </el-form-item>
          <el-form-item label="合同签署第三方">
            <el-input v-model="contract.third_party_name"></el-input>
          </el-form-item>
          <el-form-item label="品种">
            <el-input v-model="contract.variety"></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="contract.area"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="amount-info">
        <h5>金额信息</h5>
        <el-form
          :inline="true"
          :model="contract.meta"
          disabled
          label-position="right"
          label-width="150px">
          <el-form-item label="首次金额">
            <el-input v-model="contract.meta['首次金额（债券）']"></el-input>
          </el-form-item>
          <el-form-item label="分期金额">
            <el-input v-model="contract.meta['分期金额']"></el-input>
          </el-form-item>
          <el-form-item label="更新金额(一年内)">
            <el-input v-model="contract.meta['更新金额（一年内）']"></el-input>
          </el-form-item>
          <el-form-item label="更新金额(超过一年)">
            <el-input
              v-model="contract.meta['更新金额（超过一年内）']"></el-input>
          </el-form-item>
          <el-form-item label="跟踪金额(第一年)">
            <el-input v-model="contract.meta['跟踪金额（第一年）']"></el-input>
          </el-form-item>
          <el-form-item label="跟踪金额(第一年后)">
            <el-input
              v-model="contract.meta['跟踪金额（第一年之后）']"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="clause-info">
        <h5>条款信息</h5>
        <el-form
          :model="contract.meta"
          disabled
          label-position="right"
          label-width="150px">
          <el-form-item label="评级报告用途">
            <el-input
              type="textarea"
              resize="none"
              v-model="contract.meta['评级报告的用途']"></el-input>
          </el-form-item>
          <el-form-item label="违约责任">
            <el-input
              type="textarea"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="contract.meta['违约责任']"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="file-info">
        <h5>文件信息</h5>
        <div>
          <div class="contract-file">
            <span>合同文件</span>
            <div class="file-list">
              <span
                @click="
                  handleFileClick(contract.contract_id, contract.contract_name)
                "
                >{{ contract.contract_name }}</span
              >
            </div>
          </div>
          <div class="agreement-file">
            <span>补充协议文件</span>
            <div class="file-list">
              <span
                v-for="(file, index) in agreementFiles"
                :key="index"
                @click="handleFileClick(file.id, file.name)"
                >{{ file.name }}</span
              >
            </div>
          </div>
        </div>
      </section>
    </div>
    <contract-file-dialog
      v-if="isShowFileDialog"
      :fileId="fileId"
      :fileName="fileName"
      @handleCancel="isShowFileDialog = false"></contract-file-dialog>
  </div>
</template>

<script>
import ContractFileDialog from './ContractFileDialog.vue';
import { fetchContractDetail } from '@/store/api/ccxi.contract.api';
import { fetchFileList } from '@/store/api/detail.api';
export default {
  name: 'contract-detail',

  components: { ContractFileDialog },

  data() {
    return {
      contract: {
        meta: {},
      },
      agreementFiles: [],
      isShowFileDialog: false,
      fileId: '',
      fileName: '',
      isLoading: false,
    };
  },

  async created() {
    await this.getContractDetail();
    this.getFileList();
  },

  methods: {
    async getContractDetail() {
      try {
        this.isLoading = true;
        const res = await fetchContractDetail(this.$route.query.id);
        const contract = res.data;
        Object.keys(contract).forEach((key) => {
          if (!contract[key]) {
            contract[key] = '-';
          }
          Object.keys(contract.meta).forEach((item) => {
            if (!contract.meta[item]) {
              contract.meta[item] = '-';
            }
          });
        });
        this.contract = contract;
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getFileList() {
      try {
        const resp = await fetchFileList(this.$route.query.treeId, {
          page: 1,
          size: 1000,
        });
        const files = resp.data.files;
        files.forEach((file) => {
          if (file.id === Number(this.$route.query.fid)) {
            this.$set(this.contract, 'contract_name', file.name);
            this.$set(this.contract, 'contract_id', file.id);
          } else {
            this.agreementFiles.push({
              id: file.id,
              name: file.name,
            });
          }
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    handleBackClick() {
      this.$router.push({
        name: 'contract',
        params: this.$route.params,
      });
    },
    handleFileClick(id, fileName) {
      this.fileId = id;
      this.fileName = fileName;
      this.isShowFileDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-detail-wrapper {
  height: calc(100vh - 60px);
  overflow: auto;
  padding: 0 30px 10px;
  box-sizing: border-box;
  background: #eff1f5;
  .contract-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    position: sticky;
    background: #eff1f5;
    top: 0;
    z-index: 1000;
    .back {
      background: #027db4;
      border-color: #027db4;
    }
  }
  .contract-detail-content {
    section {
      background: #fff;
      border-radius: 5px;
      padding-top: 10px;
      margin-bottom: 20px;
      h5 {
        border-bottom: 1px solid #ddd;
        padding: 0 10px 5px 10px;
      }
      ::v-deep .el-form {
        padding: 10px;
        .el-form-item {
          margin: 0;
          display: flex;
          justify-content: space-between;
          padding-right: 30px;
          &:not(:last-child) {
            margin-bottom: 20px;
          }
          .el-form-item__content {
            flex: 1;
            margin-left: 0 !important;
            .el-textarea__inner {
              border: none;
            }
          }
        }
      }

      &.contract-info,
      &.amount-info {
        ::v-deep .el-form {
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(2, 50%);
          grid-gap: 20px 0;
          .el-form-item {
            margin: 0;
            display: flex;
            justify-content: space-between;
            padding-right: 30px;
            .el-form-item__content {
              flex: 1;
              .el-input__inner {
                border: none;
              }
            }
          }
        }
      }
      &.file-info {
        > div {
          padding: 10px;
          .contract-file {
            margin-bottom: 20px;
          }
          .contract-file,
          .agreement-file {
            display: flex;
            padding-right: 30px;
            > span {
              width: 150px;
              text-align: right;
              padding-right: 12px;
              color: #606266;
              font-size: 14px;
            }
            .file-list {
              flex: 1;
              background: #f5f7fa;
              border-radius: 4px;
              min-height: 42px;
              max-height: 82px;
              overflow-y: auto;
              display: flex;
              flex-wrap: wrap;
              > span {
                margin-left: 30px;
                color: #027db4;
                text-decoration: underline;
                cursor: pointer;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
