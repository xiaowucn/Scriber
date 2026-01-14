<template>
  <el-dialog
    :title="currentLaw ? '更新文档' : '新增文档'"
    :visible="true"
    class="add-law-dialog"
    width="600px"
    v-loading.fullscreen.lock="loading"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="closeDialog">
    <div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left">
        <el-form-item label="文档类型" v-if="!isEdit">
          <el-radio-group v-model="form.is_template">
            <el-radio :label="false">法规</el-radio>
            <el-radio :label="true">范本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="获取方式" v-if="shouldShowMethodSelection">
          <el-radio-group v-model="form.method">
            <el-radio label="manual">手动上传</el-radio>
            <el-radio label="local" :disabled="isLocalMethodDisabled"
              >本地法规库</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用场景" prop="scenario_ids">
          <el-select
            multiple
            filterable
            :disabled="!!currentLaw"
            v-model="form.scenario_ids"
            placeholder="请选择应用场景"
            style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="法规库"
          v-if="form.method === 'local'"
          class="law-tree-container">
          <div class="law-filter">
            <el-input
              clearable
              size="small"
              placeholder="请输入法规名称进行筛选"
              v-model.trim="localFilter.searchText"
              @keyup.enter="handleSearchEnter"
              @clear="handleSearchClear"
              style="flex: 1; min-width: 200px"></el-input>
            <el-select
              v-model="localFilter.chooseed"
              size="small"
              placeholder="勾选状态"
              style="width: 120px">
              <el-option :value="null" label="全部"></el-option>
              <el-option :value="true" label="已勾选"></el-option>
              <el-option :value="false" label="未勾选"></el-option>
            </el-select>
            <el-select
              v-model="localFilter.attachment"
              size="small"
              placeholder="附件显示"
              style="width: 120px">
              <el-option :value="true" label="显示附件"></el-option>
              <el-option :value="false" label="隐藏附件"></el-option>
            </el-select>
          </div>
          <vue-easy-tree
            ref="lawTree"
            v-loading="treeLoading"
            :data="lawTreeData"
            :props="treeProps"
            show-checkbox
            node-key="nodeKey"
            default-expand-all
            check-strictly
            :filter-node-method="filterNode"
            @check="handleTreeCheck"
            height="300px"
            style="min-height: 100px; padding: 10px; background-color: #f8fafc">
            <template slot-scope="{ node, data }">
              <div class="tree-node-content">
                <i
                  v-if="data.is_empty"
                  class="el-icon-warning-outline tree-node-icon warning-icon"></i>
                <i
                  v-if="data.is_folder"
                  class="el-icon-folder tree-node-icon folder-icon"></i>
                <i
                  v-else-if="!data.is_file && !data.is_folder"
                  class="el-icon-paperclip tree-node-icon attachment-icon"></i>
                <i
                  v-else-if="data.is_file"
                  class="el-icon-document tree-node-icon file-icon"></i>
                <tooltip-over
                  :content="node.label"
                  class="tree-node-label"></tooltip-over>
              </div>
            </template>
          </vue-easy-tree>
        </el-form-item>
      </el-form>
      <label class="custom-upload" v-if="form.method === 'manual'">
        <label @click="clickUploadBtn">
          <div class="drop-area" @drop.prevent="handleDrop" @dragover.prevent>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              仅支持上传 doc、docx、pdf 格式的文档
            </div>
            <div class="el-upload__text">
              点击此区域上传文件或拖拽文件到此区域
            </div>
          </div>
        </label>
        <input
          type="file"
          ref="uploadInput"
          name="file"
          class="upload-input"
          multiple
          @change="uploadFileData"
          accept=".doc,.docx,.pdf" />
      </label>
      <div class="file-list">
        <div class="file-item" v-for="(file, index) in files" :key="index">
          <span>{{ file.name }}</span>
          <theme-icon
            class="delete-btn"
            name="delete"
            icon-class="el-icon-delete"
            @click.native.stop="deleteFile(index)"></theme-icon>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import TooltipOver from '../components/TooltipOver.vue';
import { laws as lawsApi } from '@/store/api';
import VueEasyTree from '@wchbrad/vue-easy-tree';
import '@wchbrad/vue-easy-tree/src/assets/index.scss';
import { debounce } from 'lodash';

export default {
  name: 'add-law-dialog',
  components: {
    TooltipOver,
    VueEasyTree,
  },
  props: {
    typeOptions: {
      type: Array,
      default: () => [],
    },
    currentLaw: {
      type: [Object, null],
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        method: 'manual',
        scenario_ids: [],
        chatdocs: [],
        is_template: false,
      },
      files: [],
      lawTreeData: [],
      treeLoading: false,

      rules: {
        scenario_ids: [
          { required: true, message: '请选择应用场景', trigger: 'change' },
        ],
      },
      loading: false,
      localFilter: {
        searchText: '',
        chooseed: null,
        attachment: true,
      },
      currentSelectedLawFile: null,
      cachedCheckedKeys: [],
      filterDebounced: null,
    };
  },
  created() {
    this.filterDebounced = debounce(this.performFilter, 300);

    if (this.currentLaw) {
      const scenario_ids = this.currentLaw.scenarios.map((item) => item.id);
      if (scenario_ids.length) {
        this.form = {
          scenario_ids,
          method: 'manual',
          is_template: this.currentLaw.is_template || false,
          chatdocs: [],
        };
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.currentLaw;
    },
    shouldShowMethodSelection() {
      if (this.isEdit && this.form.is_template) {
        return false;
      }
      return true;
    },
    isLocalMethodDisabled() {
      return this.form.is_template;
    },
    treeProps() {
      const baseProps = {
        children: 'children',
        label: 'name',
      };
      baseProps.disabled = this.isNodeDisabled;
      return baseProps;
    },
  },
  watch: {
    'form.method'(newMethod) {
      if (newMethod === 'local' && this.lawTreeData.length === 0) {
        this.getLawsPublicList();
      }
    },
    'form.is_template'(newValue) {
      // 当选择范本时，如果当前是本地法规库，自动切换为手动上传
      if (newValue && this.form.method === 'local') {
        this.form.method = 'manual';
      }
    },
    localFilter: {
      handler() {
        this.filterDebounced();
      },
      deep: true,
    },
  },
  methods: {
    closeLoading() {
      this.loading = false;
    },
    isNodeDisabled(data) {
      if (data.is_folder) {
        return true;
      }
      if (this.isEdit) {
        return false;
      }
      if (data.is_file) {
        return data.is_file === true && data.is_created === true;
      }

      const parentFolder = this.getNodeParentFolder(data);

      return (
        parentFolder &&
        parentFolder.is_file === true &&
        parentFolder.is_created === true
      );
    },
    isLawFile(data) {
      return data.is_file === true;
    },
    isAttachmentFile(data) {
      return !data.is_file && !data.is_folder;
    },
    getNodeParentFolder(nodeData) {
      return nodeData.parentNode;
    },

    areNodesInSameFolder(node1, node2) {
      const parent1 = this.getNodeParentFolder(node1);
      const parent2 = this.getNodeParentFolder(node2);
      return parent1 && parent2 && parent1.nodeKey === parent2.nodeKey;
    },

    performFilter() {
      this.updateCheckedKeysCache();
      this.$refs.lawTree.filter(this.localFilter);
    },

    updateCheckedKeysCache() {
      if (this.$refs.lawTree) {
        this.cachedCheckedKeys = this.$refs.lawTree.getCheckedKeys() || [];
      }
    },

    filterNode(value, data) {
      if (!data.children || data.children.length === 0) {
        return this.checkNodeFilter(value, data);
      }
      if (data.is_folder) {
        return this.hasVisibleChildren(value, data);
      }
      return this.checkNodeFilter(value, data);
    },

    checkNodeFilter(value, data) {
      const { searchText, chooseed, attachment } = value;
      if (!data.is_file && !data.is_folder && !attachment) {
        return false;
      }
      if (searchText && !data.is_folder) {
        if (!data.name.toLowerCase().includes(searchText.toLowerCase())) {
          return false;
        }
      }
      if (chooseed !== null) {
        const isChecked = this.cachedCheckedKeys.includes(data.nodeKey);
        if (chooseed !== isChecked) {
          return false;
        }
      }

      return true;
    },

    hasVisibleChildren(value, data) {
      if (!data.children || data.children.length === 0) {
        return false;
      }

      return data.children.some((child) => {
        if (child.is_folder) {
          return this.hasVisibleChildren(value, child);
        } else {
          return this.checkNodeFilter(value, child);
        }
      });
    },

    handleSearchEnter() {
      this.updateCheckedKeysCache();
      this.$refs.lawTree.filter(this.localFilter);
    },
    handleSearchClear() {
      this.updateCheckedKeysCache();
      this.$refs.lawTree.filter(this.localFilter);
    },

    async getLawsPublicList() {
      if (this.lawTreeData.length > 0) {
        return;
      }

      this.treeLoading = true;
      try {
        const data = await lawsApi.getLawsPublicList();
        this.lawTreeData = Array.isArray(data) ? data : [data];
        this.addNodeKeys(this.lawTreeData);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message || '获取法规库数据失败',
          type: 'error',
        });
      } finally {
        this.treeLoading = false;
      }
    },
    addNodeKeys(nodes, parentPath = '', parentNode = null) {
      nodes.forEach((node, index) => {
        const currentPath = parentPath ? `${parentPath}-${index}` : `${index}`;
        node.nodeKey = currentPath;
        node.parentNode = parentNode;
        if (node.children && node.children.length > 0) {
          this.addNodeKeys(node.children, currentPath, node);
        }
      });
    },

    handleTreeCheck(data, checked) {
      this.updateCheckedKeysCache();

      if (this.isEdit) {
        this.handleEditModeTreeCheck(data, checked);
      }
    },
    handleEditModeTreeCheck(data, checked) {
      const isChecked = checked.checkedKeys.includes(data.nodeKey);
      if (this.isLawFile(data)) {
        this.handleLawFileSelection(data, isChecked);
      } else if (this.isAttachmentFile(data)) {
        this.handleAttachmentFileSelection(data, isChecked);
      }
    },

    // 处理法规正文文件的选择
    handleLawFileSelection(data, isChecked) {
      if (isChecked) {
        if (this.currentSelectedLawFile) {
          this.clearPreviousLawFileSelection();
        } else {
          this.clearUnrelatedAttachments(data);
        }
        this.currentSelectedLawFile = data;
      } else {
        if (
          this.currentSelectedLawFile &&
          this.currentSelectedLawFile.nodeKey === data.nodeKey
        ) {
          this.clearCurrentLawFileAndAttachments();
        }
      }
    },

    // 检查附件是否与法规文件父子关系
    isAttachmentRelatedToLawFile(attachment, lawFile) {
      const attachmentParent = this.getNodeParentFolder(attachment);
      if (attachmentParent && attachmentParent.nodeKey === lawFile.nodeKey) {
        return true;
      }

      return false;
    },

    // 清除与指定法规文件不相关的附件
    clearUnrelatedAttachments(lawFileData) {
      const checkedNodes = this.$refs.lawTree.getCheckedNodes();
      const selectedAttachments = checkedNodes.filter((node) =>
        this.isAttachmentFile(node),
      );

      if (selectedAttachments.length === 0) {
        return;
      }
      const unrelatedAttachments = selectedAttachments.filter(
        (attachment) =>
          !this.isAttachmentRelatedToLawFile(attachment, lawFileData),
      );

      if (unrelatedAttachments.length > 0) {
        this.clearAllSelectedAttachments(unrelatedAttachments);
      }
    },

    // 处理附件文件的选择
    handleAttachmentFileSelection(data, isChecked) {
      if (this.currentSelectedLawFile) {
        const parentNode = this.getNodeParentFolder(data);

        if (
          isChecked &&
          parentNode.nodeKey !== this.currentSelectedLawFile.nodeKey
        ) {
          this.switchToNewLawFileGroup(data);
          return;
        }
      } else {
        this.handleAttachmentOnlySelection(data, isChecked);
      }
    },

    // 处理只有附件选择的情况（没有法规文件时）
    handleAttachmentOnlySelection(data, isChecked) {
      if (!isChecked) {
        return;
      }
      const checkedNodes = this.$refs.lawTree.getCheckedNodes();
      const selectedAttachments = checkedNodes.filter(
        (node) => this.isAttachmentFile(node) && node.nodeKey !== data.nodeKey,
      );

      if (selectedAttachments.length === 0) {
        return;
      }

      // 检查新附件是否与已选中的附件在同一文件夹下
      const firstSelectedAttachment = selectedAttachments[0];
      const isInSameFolder = this.areNodesInSameFolder(
        data,
        firstSelectedAttachment,
      );

      if (!isInSameFolder) {
        // 不在同一文件夹下，清空所有之前选中的附件
        this.clearAllSelectedAttachments(selectedAttachments);

        this.$nextTick(() => {
          this.$refs.lawTree.setChecked(data.nodeKey, true, false);
        });
      }
    },
    clearAllSelectedAttachments(attachments) {
      attachments.forEach((attachment) => {
        this.$refs.lawTree.setChecked(attachment.nodeKey, false, false);
      });
    },

    switchToNewLawFileGroup(attachmentData) {
      if (this.currentSelectedLawFile) {
        this.$refs.lawTree.setChecked(
          this.currentSelectedLawFile.nodeKey,
          false,
          false,
        );
      }
      this.clearCurrentLawFileAttachments();
      this.$nextTick(() => {
        this.$refs.lawTree.setChecked(attachmentData.nodeKey, true, false);
      });

      this.currentSelectedLawFile = null;
    },

    clearCurrentLawFileAttachments() {
      if (!this.currentSelectedLawFile) return;
      if (this.currentSelectedLawFile.children) {
        this.currentSelectedLawFile.children.forEach((child) => {
          if (this.isAttachmentFile(child)) {
            this.$refs.lawTree.setChecked(child.nodeKey, false, false);
          }
        });
      }
    },
    clearPreviousLawFileSelection() {
      if (!this.currentSelectedLawFile) {
        return;
      }
      this.$refs.lawTree.setChecked(
        this.currentSelectedLawFile.nodeKey,
        false,
        false,
      );

      if (this.currentSelectedLawFile.children) {
        this.currentSelectedLawFile.children.forEach((child) => {
          if (this.isAttachmentFile(child)) {
            this.$refs.lawTree.setChecked(child.nodeKey, false, false);
          }
        });
      }
    },

    // 清除当前法规文件及其相关附件
    clearCurrentLawFileAndAttachments() {
      if (!this.currentSelectedLawFile) {
        return;
      }
      if (this.currentSelectedLawFile.children) {
        this.currentSelectedLawFile.children.forEach((child) => {
          if (this.isAttachmentFile(child)) {
            this.$refs.lawTree.setChecked(child.nodeKey, false, false);
          }
        });
      }
      this.currentSelectedLawFile = null;
    },

    updateFormChatdocs() {
      const checkedNodes = this.$refs.lawTree.getCheckedNodes();

      const lawFiles = checkedNodes.filter((item) => item.is_file);
      const attachmentFiles = checkedNodes.filter(
        (item) => !item.is_file && !item.is_folder,
      );
      this.form.chatdocs = lawFiles.map((lawFile) => {
        const relatedAttachments = this.findRelatedAttachments(
          lawFile,
          attachmentFiles,
        );

        const chatdocData = {
          chatdoc_unique: lawFile.upload_record_id,
          name: lawFile.name || '',
          children: relatedAttachments.map((attachment) => ({
            chatdoc_unique: attachment.upload_record_id,
            name: attachment.name || '',
          })),
        };

        // 只有当is_empty字段存在时才添加到数据中
        if (Object.prototype.hasOwnProperty.call(lawFile, 'is_empty')) {
          chatdocData.is_empty = lawFile.is_empty;
        }

        return chatdocData;
      });
    },
    findRelatedAttachments(lawFile, attachmentFiles) {
      return attachmentFiles.filter((attachment) => {
        const attachmentParent = this.getNodeParentFolder(attachment);
        if (lawFile && attachmentParent) {
          return lawFile.nodeKey === attachmentParent.nodeKey;
        }
        return false;
      });
    },

    // 验证附件文件选择的有效性
    validateAttachmentSelection() {
      const checkedNodes = this.$refs.lawTree.getCheckedNodes();
      const selectedAttachments = checkedNodes.filter((node) =>
        this.isAttachmentFile(node),
      );
      const selectedLawFiles = checkedNodes.filter((node) =>
        this.isLawFile(node),
      );

      // 检查is_empty字段的校验逻辑
      for (const lawFile of selectedLawFiles) {
        if (lawFile.is_empty === true) {
          // 当is_empty=true时，必须确保children字段有值且已勾选附件
          const relatedAttachments = this.findRelatedAttachments(
            lawFile,
            selectedAttachments,
          );
          if (
            !lawFile.children ||
            lawFile.children.length === 0 ||
            relatedAttachments.length === 0
          ) {
            return {
              isValid: false,
              message: `无法单独选择无内容的法规正文，请确认后重新选择`,
            };
          }
        }
      }

      if (selectedAttachments.length === 0) {
        return { isValid: true };
      }

      for (const attachment of selectedAttachments) {
        const attachmentParent = this.getNodeParentFolder(attachment);

        const hasCorrespondingLawFile = selectedLawFiles.some(
          (lawFile) => lawFile.nodeKey === attachmentParent?.nodeKey,
        );

        if (!hasCorrespondingLawFile) {
          return {
            isValid: false,
            message: '附件文件必须与法规文件一同勾选',
          };
        }
      }

      return { isValid: true };
    },

    handleBeforeUpload(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.name
          .substr(file.name.lastIndexOf('.'))
          .toLowerCase();

        if (!['.doc', '.docx', '.pdf'].includes(fileType)) {
          this.$message.error('文件格式错误，请重新上传');
          return false;
        }
      }

      return true;
    },
    handleDrop(e) {
      const fileList = [...e.dataTransfer.files];
      if (this.isEdit && [...this.files, ...fileList].length > 1) {
        this.$message.error('最多上传一个文件');
        return;
      }
      if (!this.handleBeforeUpload(fileList)) {
        return;
      }
      this.files = [...this.files, ...fileList];
    },
    clickUploadBtn() {
      this.$refs.uploadInput.value = null;
      this.$refs.uploadInput.files = null;
      this.$refs.uploadInput.click();
    },
    uploadFileData(event) {
      const fileList = [...event.target.files];
      if (this.isEdit && [...this.files, ...fileList].length > 1) {
        this.$message.error('最多上传一个文件');
        return;
      }
      if (!this.handleBeforeUpload(fileList)) {
        return;
      }
      this.files = [...this.files, ...fileList];
    },
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    closeDialog() {
      this.$emit('close');
    },
    handleCancel() {
      this.closeDialog();
    },
    async handleConfirm() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) {
        return;
      }

      if (this.form.method === 'manual') {
        if (this.files.length === 0) {
          this.$notify({
            title: '错误',
            message: '请上传文件',
            type: 'error',
          });
          return;
        }
      } else if (this.form.method === 'local') {
        // 验证附件文件是否有对应的法规文件，以及is_empty字段的校验
        const validationResult = this.validateAttachmentSelection();
        if (!validationResult.isValid) {
          this.$notify({
            title: '错误',
            message: validationResult.message,
            type: 'error',
          });
          return;
        }

        this.updateFormChatdocs();
        if (this.form.chatdocs.length === 0) {
          this.$notify({
            title: '错误',
            message: this.isEdit
              ? '更新法规必须选择法规正文'
              : '创建法规必须选择法规正文',
            type: 'error',
          });
          return;
        }
      }

      this.loading = true;
      if (this.isEdit) {
        this.$emit(
          'confirm',
          this.form.method === 'manual'
            ? { files: this.files }
            : { form: { chatdoc: this.form.chatdocs[0] } },
        );
      } else {
        this.$emit(
          'confirm',
          this.form.method === 'manual'
            ? {
                form: {
                  scenario_ids: this.form.scenario_ids,
                  is_template: this.form.is_template,
                },
                files: this.files,
              }
            : {
                form: {
                  scenario_ids: this.form.scenario_ids,
                  chatdocs: this.form.chatdocs,
                  is_template: this.form.is_template,
                },
              },
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-input {
  display: none;
}
.custom-upload {
  width: 100%;
  .drop-area {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 150px;
    background: #f8fafc;
    cursor: pointer;
    .el-icon-upload {
      font-size: 50px;
      color: #c0c4cc;
    }
    .el-upload__text {
      color: #9a9a9a;
    }
  }
}
.law-tree-container {
  ::v-deep .el-form-item__content {
    background-color: #f8fafc;
  }
}
.law-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;

  .el-input {
    flex: 1;
    min-width: 200px;
  }

  .el-select {
    flex-shrink: 0;
  }
}
.file-list {
  margin-top: 10px;
  max-height: 160px;
  overflow: auto;
  .file-item {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    &:hover {
      color: $--color-primary;
      background: #f3f7fc;
    }

    > span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .delete-btn {
      cursor: pointer;
    }
  }
}

// 树形节点样式
.tree-node-content {
  display: flex;
  align-items: center;
  width: calc(100% - 90px);

  .tree-node-icon {
    margin-right: 6px;
    font-size: 14px;

    &.folder-icon {
      color: #e6a23c;
    }

    &.file-icon {
      color: #409eff;
    }

    &.attachment-icon {
      color: #909399;
    }

    &.warning-icon {
      color: #e6a23c;
    }
  }

  .tree-node-label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
