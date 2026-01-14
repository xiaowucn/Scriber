<template>
  <div class="project-list">
    <div class="page-header list-header">
      <el-button
        size="medium"
        type="primary"
        @click="openProjectPopup"
        v-if="$user.isAdminUser()">
        <i class="fa fa-plus fa-fw"></i>
        <span> 新建项目</span>
      </el-button>
    </div>
    <el-table
      class="has-border"
      empty-text="暂无数据"
      :data="projects.items"
      v-loading="projects.isLoading"
      @row-click="jumpToFileList">
      <el-table-column prop="id" label="ID" width="150" align="center" />
      <el-table-column prop="name" label="文件名">
        <template slot-scope="scope">
          <img src="../assets/folder.svg" alt="folder" class="icon" />
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_utc" label="创建时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.created_utc | datetime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fill_status" label="填写状态">
        <template slot-scope="scope">
          <span :style="getFillStatusStyle(scope.row.fill_status)">
            {{ getFillStatus(scope.row.fill_status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip effect="dark" placement="top" content="邮箱">
              <el-button
                size="small"
                type="text"
                @click.stop="openEmailPopup(scope.row)">
                <theme-icon name="email" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top" content="自动填写">
              <el-button
                size="small"
                type="text"
                @click.stop="autoFill(scope.row.id)"
                :disabled="disabledAutoFillButton(scope.row)">
                <theme-icon name="fill" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top" content="删除">
              <el-button
                size="small"
                type="text"
                @click.stop="deleteProject(scope.row.id)">
                <theme-icon name="delete" />
              </el-button>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :current-page="projects.pager.page"
      :page-size="projects.pager.size"
      :page-sizes="[10, 20, 50]"
      :total="projects.pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <email-popup
      v-if="emailPopupVisible"
      :emailAddress="emailAddress"
      :emailProjectId="emailProjectId"
      @fetch-projects="fetchProjects"
      @close="closeEmailPopup" />
    <project-popup
      v-if="projects.current"
      :current="projects.current"
      @persist-project="persistProject"
      @close="closeProjectPopup">
    </project-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EmailPopup from '../components/EmailPopup.vue';
import ProjectPopup from '@/components/ProjectPopup.vue';
import FileMarkableMixin from '@/components/mixins/FileMarkableMixin';
import { FILL_STATUS_CODE } from '../common/constant';
import { getFillStatus, getFillStatusStyle } from '../common/utils';
import { citicsDCM as citicsDCMApi } from '@/store/api';

export default {
  name: 'projectViewer',
  mixins: [FileMarkableMixin],
  components: {
    EmailPopup,
    ProjectPopup,
  },
  data() {
    return {
      emailAddress: '',
      emailProjectId: '',
      emailPopupVisible: false,
      fileListTimer: null,
    };
  },
  created() {
    this.fetchProjects();
  },
  mounted() {
    if (this.fileListTimer) {
      clearInterval(this.fileListTimer);
    }
    this.fileListTimer = setInterval(() => {
      this.fetchProjects({ needLoading: false });
    }, 30e3);
  },
  beforeDestroy() {
    clearInterval(this.fileListTimer);
  },
  computed: {
    ...mapGetters('projectModule', ['projects']),
    isEmailConfigured() {
      return (email) => !email;
    },
    disabledAutoFillButton() {
      return (row) => {
        const { fill_status, email_address } = row;
        return (
          fill_status == FILL_STATUS_CODE.completed ||
          this.isEmailConfigured(email_address)
        );
      };
    },
  },
  methods: {
    getFillStatus,
    getFillStatusStyle,
    openEmailPopup(row) {
      const { id, email_address } = row;
      this.emailProjectId = id;
      if (email_address) {
        this.emailAddress = email_address;
      } else {
        this.emailAddress = '';
      }
      this.emailPopupVisible = true;
    },
    closeEmailPopup() {
      this.emailPopupVisible = false;
    },
    openProjectPopup() {
      this.$store.commit('projectModule/SET_EMPTY_PROJECT');
      this.fetchAllSchemas();
    },
    closeProjectPopup() {
      this.$store.commit('projectModule/SET_CUR_PROJECT', null);
    },
    async fetchProjects(options = { needLoading: true }) {
      try {
        if (options.needLoading) {
          this.$store.commit('projectModule/SET_LOADING', true);
        }
        await this.$store.dispatch('projectModule/fetchProjects');
      } catch (e) {
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'error',
        });
      } finally {
        if (options.needLoading) {
          this.$store.commit('projectModule/SET_LOADING', false);
        }
      }
    },
    async persistProject({ projectData, isPublic, defaultMolds }) {
      try {
        this.$store.commit('projectModule/SET_LOADING', true);
        await this.$store.dispatch('projectModule/persistProject', {
          projectData,
          isPublic,
          defaultMolds,
        });
        this.closeProjectPopup();
        this.$notify({
          title: '成功',
          message: '项目新建成功',
          type: 'success',
        });
      } catch (e) {
        this.$notify({
          title: '错误',
          message: e.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('projectModule/SET_LOADING', false);
      }
    },
    async deleteProject(id) {
      const confirm = await this.$confirm('是否删除该项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (confirm) {
        try {
          this.$store.commit('projectModule/SET_LOADING', true);
          await this.$store.dispatch('projectModule/deleteProject', { id });
          this.$notify({
            title: '成功',
            message: '项目删除成功',
            type: 'success',
          });
        } catch (e) {
          if (e === 'cancel') {
            return;
          }
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'error',
          });
        } finally {
          this.$store.commit('projectModule/SET_LOADING', false);
        }
      }
    },
    async autoFill(id) {
      const confirm = await this.$confirm(
        '请确认是否完成人工审核工作？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).catch(() => {});
      if (confirm) {
        try {
          const params = { fill_status: String(FILL_STATUS_CODE.fillable) };
          await citicsDCMApi.updateProject(id, params);
          this.$notify({
            title: '成功',
            message: '已触发自动填写',
            type: 'success',
          });
          this.fetchProjects();
        } catch (e) {
          this.$notify({
            title: '错误',
            message: e.message,
            type: 'error',
          });
        }
      }
    },
    jumpToFileList(row) {
      const { id, email_address } = row;
      if (this.isEmailConfigured(email_address)) {
        this.$alert('请先配置邮箱信息。', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        });
      } else {
        this.$router.push({
          name: 'projectDetail',
          params: { projectId: id },
        });
        this.resetFileViewerPager();
      }
    },
    handleChangePage(page) {
      const pager = {
        ...this.projects.pager,
        page: page,
      };
      this.$store.commit('projectModule/SET_PROJECTS_PAGER', pager);
      this.fetchProjects();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.projects.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('projectModule/SET_PROJECTS_PAGER', pager);
      this.fetchProjects();
    },
    resetFileViewerPager() {
      const pager = {
        page: 1,
        size: 20,
        total: 0,
      };
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
    },
  },
};
</script>

<style lang="scss" scoped>
.project-list {
  .folder {
    width: 26px;
    margin-right: 10px;
  }
  .el-table {
    ::v-deep .el-table__row {
      cursor: pointer;
    }
    ::v-deep .cell {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
      }
    }
    ::v-deep .is-center {
      .cell {
        justify-content: center;
      }
    }
  }
}
</style>
