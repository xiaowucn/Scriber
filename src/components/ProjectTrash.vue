<template>
  <div class="project-trash-files">
    <file-list
      :files="trashFiles"
      :pager="pager"
      :readonly="true"
      @change-page="handleChangePage"
      @change-size="handleChangeSize">
      <template slot="row-handle" slot-scope="row">
        <el-tooltip effect="dark" content="恢复文件" placement="top">
          <el-button
            size="small"
            circle
            class="restore-file"
            @click.stop="restoreFile(row.slotScope)">
            <img src="../images/icon-restore.svg" alt="restore" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="彻底删除" placement="top">
          <el-button
            type="danger"
            size="small"
            circle
            @click.stop="abandonFile(row.slotScope)">
            <i class="el-icon-delete"></i>
          </el-button>
        </el-tooltip>
      </template>
    </file-list>
  </div>
</template>

<script>
import _ from 'lodash';
import FileList from './FileList';
import {
  fetchFileList,
  fetchFilesByStatus,
  getTrashProjectInfo,
  trashOrRestoreFile,
} from '@/store/api/cgs.api';
import { EventBus } from '@/utils';
import { getFileDownloadUrl } from '@/store/api/detail.api';
import platformPerimeter from '@/perimeters/platform.perimeter';
import { setDownloadUrl } from '@/custom/cgs/utils';

export default {
  name: 'project-trash-file',
  props: {
    projectId: {
      type: [Number, String],
      required: true,
    },
    treeId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      trashProjectId: null,
      trashTreeId: null,
      trashFiles: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      isSearchFile: false,
      filterParams: {},
    };
  },
  components: {
    FileList,
  },
  created() {
    this.getTrashProjectInfo();
  },
  mounted() {
    EventBus.$on(
      'filter-recycle-files-by-condition',
      this.handleFilterParamsChanged,
    );
  },
  beforeDestroy() {
    EventBus.$off(
      'filter-recycle-files-by-condition',
      this.handleFilterParamsChanged,
    );
  },
  methods: {
    async getTrashProjectInfo() {
      try {
        const { data } = await getTrashProjectInfo(this.projectId);
        this.trashTreeId = data.rtree_id;
        this.trashProjectId = data.id;
        await this.fetchFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchFiles() {
      try {
        const { data } = await fetchFileList(this.trashTreeId, {
          ..._.omit(this.pager, 'total'),
          ...this.filterParams,
        });
        const trees = data.trees.map((folder) => {
          folder.isDir = true;
          return folder;
        });
        const files = data.files.map((file) => {
          file.isDir = false;
          file.public = data.project_public;
          file.download = getFileDownloadUrl(file.id);
          return file;
        });
        if (platformPerimeter.isCgsEnv()) {
          setDownloadUrl(files);
        }
        this.trashFiles = [...trees, ...files];
        this.pager.total = data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async searchFile() {
      try {
        const { data } = await fetchFilesByStatus(this.trashProjectId, {
          ..._.omit(this.pager, 'total'),
          ...this.filterParams,
        });

        const files = data.items.map((file) => {
          file.isDir = false;
          file.public = data.project_public;
          file.download = getFileDownloadUrl(file.id);
          return file;
        });
        this.trashFiles = [...files];
        this.pager.total = data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async restoreFile(file) {
      try {
        const params = file.isDir ? { tree_id: file.id } : { file_id: file.id };
        await trashOrRestoreFile(this.projectId, {
          ...params,
          restore: true,
        });
        const fileType = file.isDir ? '文件夹' : '文件';
        this.$notify({
          title: '成功',
          message: `${fileType}已放回原处`,
          type: 'success',
        });
        this.fetchFiles();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async abandonFile(file) {
      const fileType = file.isDir ? '文件夹' : '文件';
      const confirm = await this.$confirm(
        `此操作将彻底删除该${fileType}, 是否继续?`,
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await this.$store.dispatch('detailModule/deleteFile', {
            fileId: file.id,
            isDir: file.isDir,
          });
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.fetchFiles();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    getFiles() {
      if (this.isSearchFile) {
        this.searchFile();
      } else {
        this.fetchFiles();
      }
    },
    handleChangePage(page) {
      this.pager.page = page;
      this.getFiles();
    },
    handleChangeSize(size) {
      this.pager.page = 1;
      this.pager.size = size;
      this.getFiles();
    },
    handleFilterParamsChanged(params = {}) {
      this.filterParams = _.omit(params, ['page', 'size']);

      this.isSearchFile =
        Object.keys(_.omit(this.filterParams, 'sysfrom')).length > 0;

      this.handleChangePage(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.project-trash-files {
  ::v-deep .el-table__row {
    &.clickable {
      cursor: default !important;
    }
  }
  .restore-file {
    img {
      width: 13px;
      height: 11px;
    }
  }
}
</style>
