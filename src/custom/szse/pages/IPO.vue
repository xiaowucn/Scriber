<template>
  <div>
    <szse-common-header
      v-if="showHeader"
      :title="headerTitle"
      :menu-items="headerMenuItems"></szse-common-header>
    <router-view></router-view>
  </div>
</template>

<script>
import SzseCommonHeader from '../components/Header';

export default {
  name: 'IPO',
  components: {
    SzseCommonHeader,
  },
  computed: {
    showHeader() {
      return this.$route.meta.showPrivateHeader;
    },
  },
  data() {
    return {
      headerTitle: '招股说明书数据抽取',
      headerMenuItems: [
        {
          name: 'project',
          text: '任务管理',
          path: '/szse/ipo',
          icon: 'el-icon-tickets',
          perimeter: 'browse',
        },
        {
          name: 'user',
          text: '用户管理',
          path: '/szse/ipo/user',
          icon: 'fa fa-user',
          perimeter: 'manageUser',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
$primary-color: #2b70cf;

.szse-ipo-message-box {
  .el-button--primary {
    background: $primary-color;
    border-color: $primary-color;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
