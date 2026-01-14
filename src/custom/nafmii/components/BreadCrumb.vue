<template>
  <div class="bread-crumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: `/${currentMenuItem.key}` }">
        <span>{{ currentMenuItem.label }}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadCrumbData" :key="index">
        <span @click="openPath(item.path)">
          <overflow-popover :content="item.name" :lines="1" />
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import OverflowPopover from '../../../components/OverflowPopover';

export default {
  name: 'bread-crumb',
  components: { OverflowPopover },
  props: {
    currentMenuItem: {
      type: Object,
      required: true,
    },
    breadCrumbData: {
      type: Array,
      required: true,
    },
  },
  methods: {
    openPath(path) {
      if (!path) {
        return;
      }
      this.$router.push({ path: `/${path}` });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../variables.scss';

.bread-crumb {
  ::v-deep .el-breadcrumb {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    .el-breadcrumb__separator {
      margin: 0 5px;
    }
    .el-breadcrumb__inner {
      display: inline-block;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      &.is-link,
      :is(a) {
        font-weight: unset;
      }
    }
    .el-breadcrumb__item {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        .el-breadcrumb__inner {
          color: $--color-text-secondary;
          :hover {
            color: $--color-primary;
            cursor: pointer;
          }
        }
      }
      &:last-child {
        .el-breadcrumb__inner {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
