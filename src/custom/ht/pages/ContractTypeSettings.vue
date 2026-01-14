<template>
  <div class="container">
    <div class="options">
      <el-button
        v-if="$isAllowed('manageSchema')"
        type="success"
        size="small"
        @click="openRootSchemaPopup">
        新增合同类型
      </el-button>
      <el-upload
        action=""
        accept=".json"
        :show-file-list="false"
        :http-request="importSchemaRequest">
        <el-button size="small" type="primary">导入合同类型</el-button>
      </el-upload>
      <el-button
        v-if="$isAllowed('manageSchema')"
        type="primary"
        size="small"
        @click="exportSchemaDialogVisible = true">
        导出合同类型
      </el-button>
    </div>
    <el-dialog
      v-if="importSchemaDialogVisible"
      title="导入合同类型"
      width="500px"
      custom-class="import-schema-dialog"
      :visible.sync="importSchemaDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeImportSchemaDialog">
      <div>
        <h4 class="tips">提示：有重名合同名称，是否覆盖或重命名？</h4>
        <el-form
          ref="importSchemaForm"
          :model="importSchemaForm"
          :rules="rootSchemaRules"
          label-width="80px">
          <el-form-item label="重命名" prop="name">
            <el-input
              v-model="importSchemaForm.name"
              placeholder="请输入新的合同名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeImportSchemaDialog">取消</el-button>
        <el-button type="primary" @click="overwriteImportSchema"
          >覆盖</el-button
        >
        <el-button
          type="primary"
          :disabled="importSchemaForm.name === ''"
          @click="renameImportSchema"
          >确认重命名</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="导出合同类型"
      custom-class="export-schema-dialog"
      :visible.sync="exportSchemaDialogVisible"
      :close-on-click-modal="false"
      @close="closeExportSchemaDialog">
      <el-radio-group v-model="exportSchemaId">
        <el-radio
          :label="item.id"
          v-for="(item, index) in schemas.items"
          :key="index">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
      <div slot="footer">
        <el-button @click="closeExportSchemaDialog">取消</el-button>
        <el-button
          type="primary"
          :disabled="exportSchemaId === null"
          :loading="exportLoading"
          @click="exportSchema">
          导出
        </el-button>
      </div>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) in schemas.items" :key="index">
        <el-card class="box-card">
          <h4>合同ID: {{ item.id }}</h4>
          <h4>合同名称: {{ item.name }}</h4>
          <el-button type="text" @click="openSchema(item.id)">
            Schema{{ $isAllowed('manageSchema') ? '设置' : '查看' }}
          </el-button>
          <el-button
            v-if="$isAllowed('manageSchema')"
            type="text"
            icon="el-icon-error"
            class="button-close"
            title="删除"
            @click="removeSchema(item)">
          </el-button>
        </el-card>
      </el-col>
    </el-row>
    <schema-part-info
      :schemaRules="rootSchemaRules"
      :schemaPart="tree.current"
      :isLoading="tree.isLoading"
      width="600px"
      @persist-schema-part="persistSchemaPart"
      @close-part-info="partInfoClose">
    </schema-part-info>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SchemaPartInfo from '@/components/SchemaPartInfo';

export default {
  name: 'contract-type-settings',
  components: {
    SchemaPartInfo,
  },
  created() {
    this.fetchSchemaList();
  },
  data() {
    return {
      rootSchemaRules: {
        name: [{ required: true, validator: this.rootSchemaNameValidator }],
      },
      temporary: [],
      importSchemaForm: {
        name: '',
        rewrite: 0,
        file: null,
      },
      importSchemaDialogVisible: false,
      exportSchemaDialogVisible: false,
      exportSchemaId: null,
      exportLoading: false,
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['schemas', 'tree']),
  },
  methods: {
    fetchSchemaList() {
      try {
        this.$store.commit('schemaModule/SET_LOADING', true);
        this.$store.dispatch('schemaModule/fetchSchemas');
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_LOADING', false);
      }
    },
    updateSchemaHandle({ entity, done }) {
      try {
        this.$store.dispatch('schemaModule/updateSchema', {
          entity,
          callback: done,
        });
        this.$notify({
          title: '成功',
          message: this.$text.schema['Schema 修改成功'],
          type: 'success',
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    async removeSchema(scm) {
      try {
        await this.$confirm(`确定删除 “${scm.name}” 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        this.$store.commit('schemaModule/SET_LOADING', true);
        await this.$store.dispatch('schemaModule/deleteSchema', {
          id: scm.id,
        });
        this.$notify({
          title: '成功',
          message: this.$text.schema['Schema 删除成功'],
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_LOADING', false);
      }
    },
    /**
     * 进入schema tree页面
     */
    openSchema(id) {
      this.$router.push({ path: `/schema/${id}` });
    },
    openRootSchemaPopup() {
      this.$store.commit('schemaModule/SET_EMPTYPART_DATA', 'root');
    },
    /**
     * 关闭根Schema popup
     */
    partInfoClose() {
      this.$store.commit('schemaModule/SET_PART_DATA', null);
    },
    persistSchemaPart({ current, type }) {
      try {
        this.$store.dispatch('schemaModule/persistSchemaPart', {
          current,
          type,
          callback: (err) => {
            if (!err) {
              this.partInfoClose();
            }
          },
        });
        this.$notify({
          title: '成功',
          message: this.$text.schema['Schema 新增成功'],
          type: 'success',
        });
        this.partInfoClose();
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('schemaModule/SET_TREE_LOADING', false);
      }
    },
    rootSchemaNameValidator(rule, value, callback) {
      value = value.trim();
      if (!value) {
        return callback('名称不能为空');
      }
      const index = this.schemas.items.findIndex((itm) => itm.name === value);
      if (index !== -1) {
        return callback(`名称“${value}”不能重复`);
      }
      callback();
    },
    closeExportSchemaDialog() {
      this.exportSchemaDialogVisible = false;
      this.exportSchemaId = null;
    },
    closeImportSchemaDialog() {
      this.importSchemaDialogVisible = false;
      this.importSchemaForm = {
        name: '',
        rewrite: 0,
        file: null,
      };
    },
    importSchemaRequest(data) {
      this.importSchemaForm.file = data.file;
      const schemaData = new FormData();
      this.importSchema(schemaData);
    },
    async overwriteImportSchema() {
      this.importSchemaForm.rewrite = 1;
      const schemaData = new FormData();
      schemaData.append('rewrite', this.importSchemaForm.rewrite);
      this.importSchema(schemaData);
    },
    async renameImportSchema() {
      const isValid = await this.$refs.importSchemaForm.validate();
      if (isValid) {
        this.importSchemaForm.rewrite = 0;
        const schemaData = new FormData();
        schemaData.append('rename', this.importSchemaForm.name);
        this.importSchema(schemaData);
      }
    },
    async importSchema(data) {
      try {
        data.append('file', this.importSchemaForm.file);
        await this.$store.dispatch('schemaModule/importSchema', {
          data,
        });
        this.$notify({
          title: '成功',
          message: 'Schema 导入成功',
          type: 'success',
        });
        this.closeImportSchemaDialog();
      } catch (error) {
        if (error.message === '名称重复') {
          this.importSchemaDialogVisible = true;
        } else {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async exportSchema() {
      try {
        this.exportLoading = true;
        const downloadUrl = await this.$store.dispatch(
          'schemaModule/exportSchema',
          {
            id: this.exportSchemaId,
          },
        );
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', downloadUrl);
        link.click();
        this.closeExportSchemaDialog();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.exportLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 30px;
  .options {
    display: flex;
    margin-bottom: 20px;
    .el-button {
      margin-right: 15px;
    }
  }
  .import-schema-dialog {
    .tips {
      margin-bottom: 20px;
      padding-left: 15px;
      color: #ff0000;
    }
  }
  .export-schema-dialog {
    .el-radio-group {
      display: flex;
      flex-flow: wrap;
      .el-radio {
        width: 50%;
        margin: 10px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .el-col {
    margin: 0 0 20px 0;
    .el-card {
      position: relative;
      &:hover {
        .button-close {
          visibility: initial;
        }
      }
      h4 {
        margin: 10px 0;
        font-size: 14px;
        color: #666;
      }
      .button-close {
        position: absolute;
        top: 0;
        right: 10px;
        color: #cecece;
        visibility: hidden;
        &:hover {
          color: #aaa;
        }
      }
    }
  }
}
</style>
