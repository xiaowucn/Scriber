<template>
  <div>
    <el-dialog
      width="660px"
      :visible="visible"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      @open="init">
      <div slot="title" class="dialog-title">
        <h4>{{ dialogTitle }}</h4>
        <span v-if="dialogTitleTips">{{ dialogTitleTips }}</span>
      </div>
      <slot name="header"></slot>
      <slot name="subtitle"></slot>
      <div class="dialog-body-container" v-loading="loading">
        <el-tree
          ref="tree"
          :data="tree"
          accordion
          show-checkbox
          node-key="id"
          :default-expanded-keys="defaultCheckedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :class="showTreeModal ? 'tree-modal' : ''"
          :render-content="renderContent"></el-tree>
      </div>
      <slot name="content"></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          :disabled="saveButtonDisabled"
          @click="calcExportProjects"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'select-folder-popup',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    dialogTitle: {
      type: String,
      required: false,
      default: '选择导出文件范围',
    },
    dialogTitleTips: {
      type: String,
      required: false,
      default: '',
    },
    nodeText: {
      type: String,
      required: false,
      default: '可导出文件',
    },
    showTreeModal: {
      type: Boolean,
      required: false,
      default: false,
    },
    checkedKeys: {
      type: Array,
      required: false,
      default: () => [],
    },
    allTreeNodesDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    okButtonDisabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    exportAction: {
      type: Number,
      default: 25,
    },
    exportType: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      treeOrigin: {},
      tree: [],
    };
  },
  computed: {
    schemaId() {
      return this.$route.params.schemaId;
    },
    defaultCheckedKeys() {
      return this.allTreeNodesDisabled ? this.checkedKeys : [];
    },
    saveButtonDisabled() {
      if (!this.okButtonDisabled) {
        return false;
      }
      return (
        this.tree.length > 0 &&
        this.$refs.tree?.getCheckedNodes(true).length === 0
      );
    },
  },
  watch: {
    allTreeNodesDisabled() {
      this.initTree();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const res = await this.fetchExportProjects();
      this.treeOrigin = res;
      this.initTree();
    },
    initTree() {
      const allTreeNodesDisabled = this.allTreeNodesDisabled;

      // 定义递归函数
      function checkShow(item) {
        if (!item.show) {
          return false;
        }
        item.children = item.children.filter(checkShow);
        return true;
      }

      function checkFile(item) {
        item.label = item.name;
        item.disabled = allTreeNodesDisabled;

        let fileList = [];
        if (item.file_details) {
          fileList = item.file_details.map(function (file) {
            return {
              id: file.file_id,
              file_id: file.file_id,
              label: file.file_name,
              disabled: allTreeNodesDisabled,
            };
          });
        }

        item.children = item.children.map(checkFile).concat(fileList);
        return item;
      }

      this.tree = _.cloneDeep(this.treeOrigin.children)
        .filter(checkShow)
        .map(checkFile);
    },
    async fetchExportProjects() {
      try {
        this.loading = true;
        const supportedTypes = ['json', 'txt', 'csv'];
        const params = {
          export_action: this.exportAction,
        };
        if (supportedTypes.includes(this.exportType)) {
          params.export_type = this.exportType;
        }
        const resp = await this.$store.dispatch(
          'schemaModule/fetchExportProjects',
          {
            schemaId: this.schemaId,
            params,
          },
        );
        return resp.data;
      } catch (err) {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    calcExportProjects() {
      let list = this.$refs.tree.getCheckedNodes(true);
      this.$emit('update-export-files', list);
      this.closeDialog();
    },
    renderContent(h, { data }) {
      return h(
        'span',
        {
          class: 'custom-tree-node',
          attrs: {
            title: data.label,
          },
        },
        [
          h('i', {
            style: {
              fontSize: '14px',
              marginRight: '5px',
            },
            class:
              data.customType === 'folder'
                ? 'far fa-folder fa-2x fa-fw'
                : 'el-icon-document',
          }),
          data.label,
        ],
      );
    },
    closeDialog() {
      this.$emit('close');
    },
    async checkTreeDataIsEmpty() {
      await this.init();
      return this.tree.length === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-title {
  h4 {
    display: inline-block;
    font-size: 18px;
    font-weight: normal;
  }

  span {
    font-size: 14px;
    color: #939393;
  }
}

.dialog-body-container {
  position: relative;
  max-height: 240px;
  overflow-y: scroll;
  &.el-loading-parent--relative {
    overflow-y: hidden;
  }

  .tree-modal {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      background: rgba(255, 255, 255, 0.5);
    }
  }
}

::v-deep .custom-tree-node {
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
