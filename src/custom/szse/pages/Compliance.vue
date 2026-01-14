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
  name: 'szse-compliance',
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
      headerTitle: '上市公司年报及临时公告监管审核平台',
      headerMenuItems: [
        {
          name: 'project',
          text: '项目管理',
          path: '/szse/compliance',
          icon: 'el-icon-tickets',
          perimeter: 'browse',
        },
        {
          name: 'rule-summary',
          text: '数据分析',
          path: '/szse/compliance/rule-summary',
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
