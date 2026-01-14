<template>
  <export-panel
    :isLoading="isLoading"
    :exportList="exportList"
    :export-pager="exportPager"
    :export-type="exportType"
    :export-action-map="exportActionMap"
    @export-new-result="exportNewResult"
    @deleted-file="fetchExportList"
    @change-export-list-page="changeExportListPage">
  </export-panel>
</template>

<script>
import ExportPanel from './ExportPanel';
import { exportActionMap } from '../store/constants';

export default {
  name: 'schema-export-answer',
  components: {
    ExportPanel,
  },
  data() {
    return {
      schemaId: this.$route.params.schemaId,
      exportList: [],
      exportPager: {
        page: 1,
        size: 20,
        total: 0,
      },
      isLoading: false,
      timer: null,
    };
  },
  computed: {
    isExportAnswer() {
      return this.exportList.every((item) => item.zip_path);
    },
    exportType() {
      const panelType = this.$route.params.panelType;
      if (panelType.startsWith('export-')) {
        return panelType.split('-').at(-1);
      }
      return 'csv';
    },
    exportActionMap() {
      const panelType = this.$route.params.panelType;
      switch (panelType) {
        case 'export-inspect-csv':
          return {
            get: exportActionMap.createInspectResult,
            create: exportActionMap.createInspectResult,
            download: exportActionMap.downloadInspectResult,
            delete: exportActionMap.deleteInspectResult,
          };
        case 'export-catalog-csv':
          return {
            get: exportActionMap.createCatalogData,
            create: exportActionMap.createCatalogData,
            download: exportActionMap.downloadCatalogData,
            delete: exportActionMap.deleteCatalogData,
          };
        default:
          return {
            get: exportActionMap.createTrainingData,
            create: exportActionMap.createTrainingData,
            download: exportActionMap.downloadTrainingData,
            delete: exportActionMap.deleteTrainingData,
          };
      }
    },
  },
  created() {
    this.fetchExportList();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async fetchExportList() {
      this.handleClearInterval();
      try {
        this.isLoading = true;
        const params = {
          schema_id: Number(this.schemaId),
          export_type: this.exportType,
          export_action: this.exportActionMap.get,
          page: this.exportPager.page,
          size: this.exportPager.size,
        };
        const res = await this.$store.dispatch(
          'schemaModule/fetchExportList',
          params,
        );
        this.exportList = res.data.items;
        this.exportPager.total = res.data.total;
      } catch (err) {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    changeExportListPage(page) {
      this.exportPager.page = page;
      this.fetchExportList();
    },
    handleClearInterval() {
      if (this.timer && this.isExportAnswer) {
        clearInterval(this.timer);
      }
    },
    async exportNewResult(list) {
      try {
        this.isLoading = true;
        const data = {
          schema_id: Number(this.schemaId),
          export_type: this.exportType,
          export_action: this.exportActionMap.create,
        };
        const ids = list.map((item) => item.id);
        if (list.every((i) => i.file_id)) {
          data.files_ids = ids;
        } else {
          data.tree_l = ids;
        }
        const res = await this.$store.dispatch(
          'schemaModule/updateExportList',
          data,
        );
        if (res.data.task_total === 0) {
          this.$notify({
            title: '提示',
            message: '当前schema暂无标注数据！',
            type: 'warning',
          });
          return;
        }
        this.$notify({
          title: '成功',
          message: '新建导出成功',
          type: 'success',
        });
        this.fetchExportList();
        this.timer = setInterval(() => {
          this.fetchExportList();
        }, 5000);
      } catch (err) {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
