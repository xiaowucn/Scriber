<template>
  <div class="project-schema-file" v-loading="isLoading">
    <div v-if="showBackButton" class="banner">
      <el-button
        type="primary"
        :plain="!$platform.isDefaultEnv()"
        size="mini"
        icon="el-icon-back"
        @click="back">
        返回
      </el-button>
    </div>
    <file-list
      :defaultSort="{ prop: 'id', order: 'descending' }"
      :files="files || []"
      :pager="pager"
      :scroll-top="scrollTop"
      :sort-params="fileSortParams"
      :expanded-files="expandedFiles"
      @open-dir="openDir"
      @open-file-popup="openFilePopup"
      @change-sort="handleChangeSort"
      @change-page="handleChangePage"
      @change-size="handleChangeSize"
      @change-expand="handleChangeExpand">
      <template slot="row-handle" slot-scope="row">
        <el-button
          :title="$t(`message['对比']`)"
          v-if="isShowCompareButton(row.slotScope)"
          type="primary"
          icon="el-icon-setting"
          @click.stop="compareAnswer(row.slotScope.qid)"
          circle>
        </el-button>
        <template v-if="isShowConflictInOperations(row.slotScope)">
          <el-tooltip
            effect="dark"
            :content="$t(`message['处理冲突']`)"
            placement="top">
            <el-button
              v-if="isShowTag(row.slotScope)"
              type="danger"
              @click.stop="previewFileByRemark(row.slotScope)"
              circle>
              <img :src="conflictImg" alt="conflict" class="conflict-icon" />
            </el-button>
          </el-tooltip>
        </template>
        <template v-else>
          <el-tooltip
            v-if="isShowRemarkInOperations(row.slotScope)"
            effect="dark"
            :content="$t(`message['标注']`)"
            placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'default' : 'text'"
              size="small"
              @click.stop="previewFileByRemark(row.slotScope)"
              circle>
              <theme-icon
                name="remark"
                icon-class="el-icon-tickets"></theme-icon>
            </el-button>
          </el-tooltip>
          <template v-if="showInspectAnswerBtn(row.slotScope)">
            <el-tooltip
              v-if="$features.isShowOperationIcon()"
              effect="dark"
              :content="$t(`message['查看']`)"
              placement="top">
              <el-button
                :type="!$platform.isDefaultEnv() ? 'warning' : 'text'"
                size="small"
                @click.stop="previewFileByInspect(row.slotScope)"
                circle>
                <theme-icon
                  name="view"
                  icon-class="el-icon-document"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-button
              v-else
              type="text"
              @click.stop="previewFileByInspect(row.slotScope)">
              {{ $t(`message['查看']`) }}
            </el-button>
          </template>
        </template>
        <template>
          <el-tooltip
            v-if="$features.isShowOperationIcon()"
            effect="dark"
            :content="$text.file['在项目中查看']"
            placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'default' : 'text'"
              size="small"
              circle
              @click.stop="goDetail(row.slotScope)">
              <theme-icon
                name="view-in-project"
                icon-class="el-icon-search"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-button v-else type="text" @click.stop="goDetail(row.slotScope)">
            {{ $text.file['在项目中查看'] }}
          </el-button>
        </template>
      </template>
    </file-list>
    <file-popup
      v-if="fileViewer.current"
      :molds="schemas.items"
      :file="fileViewer.current"
      @update-files="searchFiles">
    </file-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileList from './FileList.vue';
import FilePopup from './FilePopup';
import FileMarkableMixin from './mixins/FileMarkableMixin';
import { questionStatusNames } from '../store/constants';
import { conflictImg } from '@/images/';
import { EventBus } from '@/utils';
import _ from 'lodash';

export default {
  name: 'project-file',
  components: { FileList, FilePopup },
  mixins: [FileMarkableMixin],
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    schemaId: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    showBackButton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      conflictImg,
    };
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('fileModule', [
      'fileList',
      'schemaFiles',
      'isLoading',
      'pager',
      'scrollTop',
      'expandedFiles',
      'fileSortParams',
      'fileSearchParams',
    ]),
    files() {
      if (this.type === 'schemaFiles') {
        return this.schemaFiles[this.schemaId];
      } else {
        return this.fileList;
      }
    },
    isShowConflictInOperations() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          return false;
        }
        return this.getIsConflictQuestion(row);
      };
    },
    isShowRemarkInOperations() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          return false;
        }
        return this.showRemarkAnswerBtn(row);
      };
    },
  },
  created() {
    this.fetchFileListByStatus();
    EventBus.$on('search-files', this.searchFiles);
  },
  beforeDestroy() {
    EventBus.$off('search-files', this.searchFiles);
  },
  methods: {
    async fetchFileListByStatus() {
      try {
        let query = {
          page: this.pager.page,
          size: this.pager.size,
          ...this.fileSearchParams,
          ...this.fileSortParams,
        };
        this.$store.commit('fileModule/SET_ALL_LOADING', true);
        if (this.type === 'schemaFiles') {
          query.mold_id = this.schemaId;
          await this.$store.dispatch('fileModule/fetchAllFiles', {
            projectId: this.projectId,
            query,
          });
          return;
        }
        if (this.type === 'answeredFiles') {
          query.answered = 1;
        } else if (this.type === 'taggedFiles') {
          query.status = questionStatusNames.completed;
        } else if (this.type === 'conflictFiles') {
          query.conflicted = 1;
          query.status = questionStatusNames.conflict;
        }
        await this.$store.dispatch('fileModule/fetchFilesByStatus', {
          projectId: this.projectId,
          query,
          canSearch: true,
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      } finally {
        this.$store.commit('fileModule/SET_ALL_LOADING', false);
      }
    },
    handleChangePage(page) {
      const pager = {
        ...this.pager,
        page: page,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', pager);
      this.fetchFileListByStatus();
    },
    handleChangeSize(size) {
      const pager = {
        ...this.pager,
        page: 1,
        size: size,
      };
      this.$store.commit('fileModule/SET_FILE_PAGER', pager);
      this.fetchFileListByStatus();
    },
    handleChangeSort(params) {
      this.$store.commit('fileModule/SET_FILE_SORT_PARAMS', params);
    },
    handleChangeExpand(rows) {
      this.$store.commit('fileModule/SET_EXPANDED_FILES', rows);
    },
    isShowTag(row) {
      return row.qid && row.mold;
    },
    openDir(file) {
      if (this.showInspectAnswerBtn(file)) {
        this.previewFileByInspect(file);
        return;
      }

      this.previewFileByRemark(file);
    },
    openFilePopup(file) {
      this.$store.commit('detailModule/SET_CUR_FILE', file);
    },
    back() {
      this.$router.push({
        name: 'projectSchema',
        params: { projectId: this.projectId },
      });
    },
    searchFiles(params) {
      if (!_.isEmpty(params)) {
        this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', params);
      } else {
        this.$store.commit('fileModule/SET_FILE_SEARCH_PARAMS', {});
      }
      this.handleChangePage(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.project-schema-file {
  .banner {
    padding: 15px;
    border: 1px solid #dcdfe6;
    border-top: none;
  }

  .conflict-icon {
    width: 12px;
    height: 10px;
    transform: scale(1.4);
  }
}
</style>
