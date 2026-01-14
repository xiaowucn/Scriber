export default {
  data() {
    return {
      uploadingFileInfo: {
        name: '',
        showProgress: false,
        progress: 0,
        showUnPackProgress: false,
        unpackProgress: 0,
      },
    };
  },
  methods: {
    async handleUploadDefaultFile({
      params,
      fileName,
      uploadFileApi,
      successMessage,
      signal,
    }) {
      try {
        this.uploadingFileInfo.name = fileName;
        this.uploadingFileInfo.showProgress = true;
        await uploadFileApi({
          ...params,
          onUploadProgress: this.uploadFileProgress,
          signal,
        });
        this.uploadingFileInfo.showProgress = false;
        this.$notify({
          title: '成功',
          message: successMessage || '上传成功',
          type: 'success',
        });
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.uploadingFileInfo.showProgress = false;
      }
    },
    async handleUploadZipFileBySSE({ params, fileName, uploadFileApi }) {
      try {
        this.uploadingFileInfo.name = fileName;
        this.uploadingFileInfo.showProgress = true;
        await uploadFileApi({
          ...params,
          onUploadProgress: this.uploadZipFileProgress,
          onDownloadProgress: this.downloadZipFileProgress,
        });
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.uploadingFileInfo.showProgress = false;
        this.uploadingFileInfo.showUnPackProgress = false;
      }
    },
    updateUploadFileProgress(progressEvent) {
      const progress = Math.floor(
        (progressEvent.loaded / progressEvent.total) * 100,
      );
      this.uploadingFileInfo.progress = progress;
    },
    uploadFileProgress(progressEvent) {
      this.updateUploadFileProgress(progressEvent);
    },
    uploadZipFileProgress(progressEvent) {
      this.updateUploadFileProgress(progressEvent);
      if (progressEvent.loaded === progressEvent.total) {
        this.uploadingFileInfo.showProgress = false;
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
        });
      }
    },
    downloadZipFileProgress(progressEvent) {
      const { responseText } = progressEvent.target;
      const lastIndex = responseText.lastIndexOf('data:');
      let chunk = responseText;
      if (lastIndex !== -1) {
        chunk = responseText
          .substring(lastIndex)
          .match(/data: {.*?}/s)[0]
          .replace(/data: /g, '')
          .replace(/\n/g, '');
        const data = JSON.parse(chunk);
        this.handleZipFileStageData(data);
      }
    },
    handleZipFileStageData(data) {
      switch (data.stage) {
        case 'START': {
          this.uploadingFileInfo.showUnPackProgress = true;
          this.uploadingFileInfo.unpackProgress = data.percent;
          break;
        }
        case 'UNPACK': {
          this.uploadingFileInfo.unpackProgress = data.percent;
          break;
        }
        case 'IMPORT': {
          this.uploadingFileInfo.unpackProgress = data.percent;
          break;
        }
        case 'FINISHED': {
          this.uploadingFileInfo.unpackProgress = data.percent;
          this.uploadingFileInfo.showUnPackProgress = false;
          this.$notify({
            title: '提示',
            message: '解压缩成功',
            type: 'success',
          });
          break;
        }
        case 'ERROR': {
          this.uploadingFileInfo.showUnPackProgress = false;
          this.$notify({
            title: '错误',
            message: data.message,
            type: 'error',
          });
          break;
        }
      }
    },
  },
};
