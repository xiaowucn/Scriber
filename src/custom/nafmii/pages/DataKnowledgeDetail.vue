<template>
  <div class="data-knowledge-detail" v-loading="isLoading">
    <div class="detail-header">
      <span class="name">
        <overflow-popover
          :content="dataKnowledgeName"
          :lines="1"
          placement="right" />
      </span>
      <el-button size="medium" type="primary" @click="addKnowledge">
        新建知识
      </el-button>
    </div>
    <div class="detail-search">
      <el-select
        size="small"
        v-model="filterBy"
        placeholder="请选择"
        @change="handleSelectChange">
        <el-option
          v-for="(option, index) in searchOptions"
          :key="index"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-input
        clearable
        size="small"
        ref="searchInput"
        class="search-input"
        v-model.trim="filterValue"
        @clear="handleSearch"
        @keyup.enter.native="handleSearch">
      </el-input>
      <el-button size="small" class="search-btn" @click="handleSearch">
        检索
      </el-button>
    </div>
    <div class="detail-content">
      <div class="content-list">
        <div class="title">
          <span>综合排序</span>
          <span class="number" v-if="knowledgesNumber">
            （{{ knowledgesNumber }}）
          </span>
        </div>
        <ul class="content">
          <template v-if="knowledgesNumber">
            <li
              v-for="(knowledge, index) in knowledges"
              :key="index"
              @click="openKnowledgeDetail(knowledge)"
              :class="{ active: knowledge.id === currentKnowledge.id }">
              <span class="name">
                <overflow-popover
                  :content="knowledge.title"
                  :lines="1"
                  placement="right" />
              </span>
              <div class="detail">
                <span>{{ knowledgeCreatedDate(knowledge.created_utc) }}</span>
                <div class="operations">
                  <el-button type="text" @click.stop="editKnowledge(knowledge)">
                    <svg-font-icon
                      name="knowledge-edit"
                      :size="16"
                      color="var(--color-text-auxiliary)"
                      hover-color="var(--color-primary)" />
                  </el-button>
                  <el-button
                    type="text"
                    @click.stop="deleteKnowledge(knowledge.id)">
                    <svg-font-icon
                      name="knowledge-delete"
                      :size="16"
                      color="var(--color-text-auxiliary)"
                      hover-color="var(--color-primary)" />
                  </el-button>
                </div>
              </div>
            </li>
          </template>
          <el-empty v-else description="暂无数据" />
        </ul>
      </div>
      <div class="content-detail">
        <div class="title">知识详情</div>
        <div class="content">
          <template v-if="currentKnowledge">
            <div class="text">
              <span class="name">
                <overflow-popover
                  :content="currentKnowledge.title"
                  :lines="1"
                  placement="top" />
              </span>
              <span v-if="currentKnowledge.content">
                {{ currentKnowledge.content }}
              </span>
            </div>
            <div class="file" v-if="currentKnowledge.filename">
              <document-viewer
                ref="documentViewer"
                :key="currentKnowledge.file_path"
                :readOnly="true"
                :file-id="currentKnowledge.id"
                :file-info="{}"
                :file-url="fileUrl"
                :show-file-info="false"
                :show-go-back-button="false"
                :show-thumb-button="false"
                :show-chapter-button="false"
                :show-search-button="false"
                :show-toolbar-left="false"
                @scale-change="handleScaleChange" />
            </div>
          </template>
          <el-empty v-else description="暂无数据" />
        </div>
      </div>
    </div>
    <knowledge-popup
      v-if="isShowKnowledgePopup"
      :data-knowledge-id="dataKnowledgeId"
      :current="currentEditKnowledge"
      :is-edit="isEditKnowledgeDetail"
      @close="closeKnowledgePopup"
      @save-knowledge-success="fetchDataKnowledgeDetail" />
  </div>
</template>

<script>
import _ from 'lodash';
import KnowledgePopup from '../components/KnowledgePopup';
import OverflowPopover from '../../../components/OverflowPopover';
import DocumentViewer from '../../../components/remark/pdf-viewer/DocumentViewer';
import { KNOWLEDGE_TYPE_OPTIONS } from '../common/constant';
import { nafmii as nafmiiApi } from '../../../store/api';
import { baseURL } from '../../../store/api/http';

export default {
  name: 'data-knowledge-detail',
  components: { OverflowPopover, KnowledgePopup, DocumentViewer },
  props: {
    dataKnowledgeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    const fileTypeValue = KNOWLEDGE_TYPE_OPTIONS.find(
      (option) => option.label === '文件',
    ).value;
    const entryTypeValue = KNOWLEDGE_TYPE_OPTIONS.find(
      (option) => option.label === '词条',
    ).value;
    return {
      filterBy: fileTypeValue,
      filterValue: '',
      searchOptions: [
        {
          value: fileTypeValue,
          label: '文件标题',
        },
        {
          value: entryTypeValue,
          label: '词条名称',
        },
      ],
      isShowKnowledgePopup: false,
      isLoading: false,
      dataKnowledgeName: '',
      knowledges: [],
      currentKnowledge: {},
      currentEditKnowledge: {},
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.resetBreadcrumb();
  },
  computed: {
    knowledgesNumber() {
      return this.knowledges.length;
    },
    knowledgeCreatedDate() {
      return (created_utc) => {
        return this.$options.filters.date(created_utc).replace(/-/g, '.');
      };
    },
    isEditKnowledgeDetail() {
      return !_.isEmpty(this.currentEditKnowledge);
    },
    fileUrl() {
      const baseUrl = `${window.location.origin}${window.location.pathname}${baseURL}`;
      return `${baseUrl}/plugins/nafmii/knowledge-details/${this.currentKnowledge.id}/file`;
    },
  },
  methods: {
    init() {
      this.fetchDataKnowledgeDetail();
    },
    async fetchDataKnowledgeDetail(currentId) {
      try {
        this.isLoading = true;
        let params = {};
        if (this.filterValue) {
          params.type = this.filterBy;
          params.title = this.filterValue;
        }
        const res = await nafmiiApi.fetchDataKnowledgeDetail(
          this.dataKnowledgeId,
          params,
        );
        this.dataKnowledgeName = res.data.name;
        this.knowledges = res.data.details;
        if (currentId) {
          this.currentKnowledge =
            this.knowledges.find((knowledge) => knowledge.id === currentId) ||
            this.knowledges[0];
        } else {
          this.currentKnowledge = this.knowledges[0];
        }
        this.getBreadCrumbData();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    getBreadCrumbData() {
      const breadCrumbData = [{ name: this.dataKnowledgeName }];
      this.$store.commit('nafmiiModule/SET_BREAD_CRUMB_DATA', breadCrumbData);
    },
    openKnowledgeDetail(knowledge) {
      this.currentKnowledge = knowledge;
    },
    handleSelectChange() {
      this.filterValue = '';
      this.$refs.searchInput.focus();
    },
    handleSearch() {
      this.fetchDataKnowledgeDetail();
    },
    openKnowledgePopup() {
      this.isShowKnowledgePopup = true;
    },
    closeKnowledgePopup() {
      this.isShowKnowledgePopup = false;
    },
    addKnowledge() {
      this.currentEditKnowledge = {};
      this.openKnowledgePopup();
    },
    editKnowledge(knowledge) {
      this.currentEditKnowledge = knowledge;
      this.openKnowledgePopup();
    },
    async deleteKnowledge(id) {
      const confirm = await this.$confirm('是否删除该知识？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await nafmiiApi.deleteKnowledge(id);
          this.$notify({
            title: '成功',
            message: '知识删除成功',
            type: 'success',
          });
          this.fetchDataKnowledgeDetail();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    resetBreadcrumb() {
      this.$store.commit('nafmiiModule/SET_BREAD_CRUMB_DATA', []);
    },
    setScale(scale) {
      this.$refs.documentViewer.setScale(scale);
    },
    handleScaleChange(scale) {
      let toScale = scale;
      if (scale === -2) {
        toScale = 'page-fit';
      }
      if (scale === -1) {
        toScale = 'page-width';
      }
      this.setScale(toScale);
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables.scss';

.data-knowledge-detail {
  height: auto;
  margin: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px 10px 15px;
    background-color: #fff;
    .name {
      font-weight: 700;
      font-size: 20px;
      ::v-deep .overflow-content {
        max-width: 400px;
      }
    }
  }
  .detail-search {
    padding: 10px 0;
    display: flex;
    align-items: center;
    ::v-deep .el-select {
      .el-input {
        width: 100px;
      }
      .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: transparent;
        &:focus {
          border-right: 1px solid $--color-primary;
        }
      }
    }
    ::v-deep .search-input {
      .el-input__inner {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    ::v-deep .search-btn {
      margin-left: 10px;
      font-weight: 400;
      font-size: 14px;
      padding: 8px 26px;
    }
  }
  .detail-content {
    flex: 1;
    display: flex;
    overflow-y: auto;
    .content-list,
    .content-detail {
      background-color: #fff;
      .title {
        font-weight: 700;
        font-size: 16px;
        padding: 20px 35px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: $--color-primary;
        }
      }
    }
    .content-list {
      width: 40%;
      margin-right: 5px;
      display: flex;
      flex-direction: column;
      .title {
        border-bottom: 1px solid #ebeef5;
      }
      .content {
        overflow-y: auto;
        li {
          list-style: none;
          padding: 10px 20px;
          font-size: 14px;
          border-bottom: 1px solid #ebeef5;
          &:hover,
          &.active {
            cursor: pointer;
            .name {
              color: $--color-primary;
            }
          }
          &.active {
            background-color: $--color-primary-light-1;
          }
        }
        .name {
          font-weight: 700;
          margin-bottom: 5px;
          color: $--color-text-auxiliary;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
        }
        .detail {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: $--color-text-auxiliary;
        }
        .el-button {
          padding: 0px;
        }
      }
      .operations {
        .el-button + .el-button {
          margin-left: 5px;
        }
        .svg-icon-container {
          color: $--color-text-auxiliary !important;
          &:hover {
            color: $--color-primary !important;
          }
        }
      }
    }
    .content-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 60%;
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0px 35px;
        font-size: 14px;
        overflow: hidden;
        .text {
          max-height: calc(50% - 10px);
          overflow-x: auto;
          margin-bottom: 10px;
        }
        .name {
          font-weight: 700;
          color: $--color-primary;
          display: block;
          height: fit-content;
          margin-bottom: 10px;
        }
        .file {
          flex: 1;
        }
      }
    }
  }
}
</style>
