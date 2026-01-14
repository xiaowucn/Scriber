<template>
  <div class="page-header project-nav-header">
    <nafmii-project-search-box v-if="showNafmiiProjectSearchBox">
    </nafmii-project-search-box>
    <nafmii-file-search-box v-if="showNafmiiFileSearchBox">
    </nafmii-file-search-box>
    <slot>
      <bread-crumb v-if="showBreadCrumb" :currentTab="currentTab"></bread-crumb>
      <div v-else-if="showSearchFileTitle" class="search-file-title">
        <template v-if="!$platform.isDefaultEnv()">
          <span>{{ $t(`message['搜索']`) }}: {{ searchTitle }}</span>
          <el-button
            size="mini"
            type="info"
            @click.native="clearSearchResult"
            class="goback-button">
            {{ $t(`message['清除']`) }}
          </el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-back"
            @click="goback()">
            {{ $t(`message['返回']`) }}
          </el-button>
        </template>
      </div>
    </slot>

    <cmfchina-project-search-box v-if="showCmfchinaProjectSearchBox">
    </cmfchina-project-search-box>
    <cmfchina-file-search-box
      v-else-if="showCmfchinaFileSearchBox"
      :treeId="treeId"
      :projectId="projectId">
    </cmfchina-file-search-box>
    <file-search-box
      v-else-if="showFileSearchBox"
      @clear="clearSearchResult"></file-search-box>
    <file-search-popup v-else-if="showCommonFileSearch"></file-search-popup>
    <file-search-bar
      v-if="showGeneralFileSearchBar"
      :current-tab="currentTab"
      @clear="clearSearchResult"></file-search-bar>
  </div>
</template>

<script>
import BreadCrumb from '@/components/BreadCrumb';
import FileSearchPopup from './FileSearchPopup';
import FileSearchBox from './FileSearchBox';
import FileSearchBar from '../custom/general/components/FileSearchBar';
import CmfchinaProjectSearchBox from '../custom/cmfchina/components/ProjectSearchBox';
import CmfchinaFileSearchBox from '../custom/cmfchina/components/FileSearchBox';
import NafmiiProjectSearchBox from '../custom/nafmii/components/ProjectSearchBox';
import NafmiiFileSearchBox from '../custom/nafmii/components/FileSearchBox';

export default {
  name: 'project-nav-header',
  props: {
    projectId: {
      type: Number,
      default: -1,
    },
    treeId: {
      type: Number,
      default: -1,
    },
    currentTab: {
      type: String,
      required: true,
    },
    searchTitle: {
      type: String,
      required: false,
      default: '',
    },
    isProjectActive: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    BreadCrumb,
    FileSearchPopup,
    FileSearchBox,
    FileSearchBar,
    CmfchinaProjectSearchBox,
    CmfchinaFileSearchBox,
    NafmiiProjectSearchBox,
    NafmiiFileSearchBox,
  },
  computed: {
    showBreadCrumb() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return !this.searchTitle;
    },
    showSearchFileTitle() {
      return !!this.searchTitle;
    },
    showFileSearchBox() {
      if (this.$platform.isCgsEnv()) {
        return false;
      }
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return this.$platform.isDefaultEnv();
    },
    showCommonFileSearch() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return !this.$platform.isCgsEnv();
    },
    showGeneralFileSearchBar() {
      return this.$platform.isCgsEnv();
    },
    showNafmiiProjectSearchBox() {
      return this.$platform.isNafmiiEnv() && !this.isProjectActive;
    },
    showNafmiiFileSearchBox() {
      return this.$platform.isNafmiiEnv() && this.isProjectActive;
    },
    showCmfchinaProjectSearchBox() {
      return this.$platform.isCmfchinaEnv() && !this.isProjectActive;
    },
    showCmfchinaFileSearchBox() {
      return this.$platform.isCmfchinaEnv() && this.isProjectActive;
    },
  },
  methods: {
    clearSearchResult() {
      this.$emit('clear-search-result');
    },
    goback() {
      if (!this.$platform.isCustomerEnv()) {
        this.$router.back();
      } else if (this.$platform.isCmfchinaEnv()) {
        this.$router.push({
          name: 'projectDetail',
          params: { projectId: this.projectId, treeId: this.treeId },
        });
      } else {
        this.$router.push({ name: 'project' });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.project-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-file-title {
  display: flex;
  align-items: center;
  color: #666;
  .goback-button {
    margin-left: 15px;
    padding: 3px 7px;
  }
}
</style>
