<template>
  <div class="project-schema" v-loading="loading">
    <el-table
      class="has-border"
      :empty-text="$t(`message['暂无数据']`)"
      v-loading="schemas.isLoading"
      style="width: 100%"
      ref="table"
      row-key="id"
      @row-click="openSchemaFiles"
      :default-sort="{ prop: 'created_utc', order: 'descending' }"
      :data="usedSchemas || []">
      <el-table-column width="30"></el-table-column>
      <el-table-column width="60" label="ID" prop="id"></el-table-column>
      <el-table-column :label="$t(`message['名称']`)" prop="name">
      </el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        :fixed="$features.operationColumnFixed()"
        width="150"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="$t(`message['详情']`)"
            placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
              size="small"
              @click.stop="openSchemaFiles(scope.row)"
              circle>
              <theme-icon name="detail" icon-class="el-icon-more"></theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import platformPerimeter from '@/perimeters/platform.perimeter';
import { mapGetters } from 'vuex';
export default {
  name: 'project-schema',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      usedSchemas: [],
    };
  },
  computed: {
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('fileModule', ['schemaFiles']),
  },
  mounted() {
    this.initProjectSchema();
  },
  methods: {
    async initProjectSchema() {
      try {
        this.loading = true;

        let size = 9999;
        if (platformPerimeter.isNafmiiEnv()) {
          size = 1000;
        }

        await this.$store.dispatch('fileModule/fetchAllFiles', {
          projectId: this.projectId,
          query: {
            size,
          },
        });

        this.joinSchema();
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async joinSchema() {
      if (this.schemas.items.length === 0) {
        await this.$store.dispatch('schemaModule/fetchAllSchemas');
      }
      const allSchemas = [
        ...this.schemas.items,
        { id: null, name: this.$t(`message['未分配']`) },
      ];
      for (const mold of Object.keys(this.schemaFiles)) {
        for (const s of allSchemas) {
          if (String(s.id) === mold) {
            this.usedSchemas.push(s);
            break;
          }
        }
      }
    },
    openSchemaFiles(row) {
      if (!this.$root.isClick) {
        return;
      }
      this.$router.push({
        name: 'projectSchema',
        params: { projectId: this.projectId },
        query: { schemaId: row.id },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.project-schema ::v-deep .el-table__expanded-cell {
  padding: 0;
}
.project-schema ::v-deep .el-table__row.expanded td {
  background: rgba(64, 158, 255, 0.3);
}
.project-schema ::v-deep .el-table__row {
  cursor: pointer;
}
::v-deep .operations {
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
