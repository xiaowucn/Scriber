<template>
  <div>
    <sse-common-header
      v-if="showHeader"
      :title="headerTitle"
      :menu-items="headerMenuItems"
      custom-class="sse-poc-header"></sse-common-header>
    <router-view></router-view>
  </div>
</template>

<script>
import SseCommonHeader from '../../szse/components/Header';

export default {
  name: 'sse-compliance',
  components: {
    SseCommonHeader,
  },
  computed: {
    showHeader() {
      return this.$route.meta.showPrivateHeader;
    },
  },
  data() {
    return {
      headerTitle: '上市公司年报信息披露合规性检查',
      headerMenuItems: [
        {
          name: 'project',
          text: '项目管理',
          path: '/sse/poc',
          icon: 'el-icon-tickets',
          perimeter: 'browse',
        },
        {
          name: 'rule-summary',
          text: '数据分析',
          path: '/sse/poc/rule-summary',
          icon: 'el-icon-menu',
          perimeter: 'browse',
        },
        {
          name: 'user',
          text: '用户管理',
          path: '/user',
          icon: 'fa fa-user',
          target: '_blank',
          perimeter: 'manageUser',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';
</style>
