<template>
  <div class="extra-file">
    <div class="extra-file-header">
      <div>
        <i class="go-back el-icon-back" @click="closeFile"></i>
        <span v-if="fileInfo" class="title">{{ fileInfo.filename }}</span>
      </div>
    </div>
    <div class="extra-file-content">
      <audit-summary
        :projectInfo="projectInfo"
        :auditSummary="auditSummary"
        @refresh-project="$emit('refresh-project')"></audit-summary>
      <file-viewer
        v-if="fileInfo"
        :fileId="fileInfo.fileId"
        :fileInfo="fileInfo"></file-viewer>
    </div>
  </div>
</template>
<script>
import FileViewer from '@/custom/szse/components/AnnualReport/FileViewer';
import AuditSummary from '@/custom/szse/components/AnnualReport/AuditSummary';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';

export default {
  name: 'szse-annual-report-extra-file',
  components: { FileViewer, AuditSummary },
  props: {
    file: {
      type: Object,
      require: true,
    },
    projectInfo: {
      type: Object,
      require: true,
    },
    auditSummary: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      fileInfo: null,
    };
  },
  async created() {
    await this.getFileInfo();
  },
  methods: {
    async getFileInfo() {
      try {
        const { ext_fid, ext_filename } = this.file;

        const [pageInfoRes, outlineRes] = await Promise.all([
          fetchFilePageInfo(ext_fid),
          fetchFileOutline(ext_fid),
        ]);

        this.fileInfo = {
          fileId: ext_fid,
          filename: ext_filename,
          pageInfo: pageInfoRes.data,
          outline: {
            items: outlineRes.data ? outlineRes.data.children : [],
          },
        };
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
    closeFile() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.extra-file {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

.extra-file-header {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 20px;
  background: white;
  border-left: 1px solid #e9e9e9;

  .go-back {
    cursor: pointer;
  }

  .title {
    flex: 1;
    margin-left: 10px;
    font-weight: 600;
  }
}

.extra-file-content {
  flex: 1;
  display: flex;
  flex-flow: column;
  row-gap: 10px;
  margin: 10px;
  overflow: hidden;

  .image-viewer-container {
    flex: 1;
  }
}
</style>
