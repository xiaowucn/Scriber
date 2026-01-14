<template>
  <div>
    <span class="file-path" :class="[readonly ? 'readonly' : '']">
      <span
        v-if="isShowRoot"
        class="path-name"
        @click="!readonly && openDir(-1)"
        >{{ $text.file['总览'] }}</span
      >
      <span
        v-for="(path, index) in fileViewer.filePath"
        :key="path.id"
        class="path-name"
        :class="{ 'path-hide': index > 0 && currentTab !== 'projectAll' }"
        @click="!readonly && openDir(path.id)">
        <svg-font-icon
          v-if="$platform.isDefaultEnv()"
          name="folder"
          :color="folderIconColor"
          :size="18"></svg-font-icon>
        <span>{{ path | pathName }}</span>
      </span>
    </span>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'bread-crumb',
  props: {
    currentTab: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isShowRoot: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('detailModule', ['fileViewer']),
    folderIconColor() {
      if (this.$platform.isCiticsDCMEnv()) {
        return '#8BD9C0';
      }
      return '#7DC1F5';
    },
  },
  filters: {
    pathName(path) {
      if (path.meta && path.meta.name) {
        return path.meta.name;
      }
      return path.name;
    },
  },
  methods: {
    openDir(dirId) {
      const query = _.omit(this.$route.query, ['page, size']);
      if (dirId === -1) {
        this.$router.push({ name: 'project' });
      } else {
        this.$router.push({
          name: 'projectDetail',
          params: {
            projectId:
              this.$route.params.projectId || this.$route.query.projectId,
            treeId: dirId,
          },
          query,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.file-path {
  display: flex;
  align-items: center;
  .path-name {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #000;
    &:not(:first-child)::before {
      font-family: element-icons !important;
      content: '\e6e0';
      color: #c0c4cc;
      display: inline-block;
      margin: 0 5px 0 3px;
    }
    &:first-child {
      font-weight: bold;
    }
    &:last-child {
      color: rgba(0, 0, 0, 0.5);
    }
    &:not(:last-child):hover {
      color: #409eff;
      cursor: pointer;
    }
  }
  .path-hide {
    display: none;
  }
  &.readonly {
    .path-name {
      color: #666;
      &:hover {
        color: #666;
        cursor: default;
      }
    }
  }
}
</style>
