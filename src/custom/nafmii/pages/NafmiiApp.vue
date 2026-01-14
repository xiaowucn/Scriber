<template>
  <div class="nafmii-app">
    <div class="left">
      <left-menu :isMenuCollapsed="isMenuCollapsed" />
    </div>
    <div class="right">
      <top-header @logout="removeMenuCollapsedLocalStorage">
        <template slot="collapse-btn">
          <el-button class="collapse-btn" @click="handleToggleMenuCollapse">
            <img
              v-if="!isMenuCollapsed"
              src="@/assets/svg-icons/menu-collapse.svg"
              alt="collapse-icon" />
            <img
              v-else
              src="@/assets/svg-icons/menu-expand.svg"
              alt="expand-icon" />
          </el-button>
        </template>
      </top-header>
      <router-view />
    </div>
  </div>
</template>

<script>
import LeftMenu from '../components/LeftMenu';
import TopHeader from '../components/TopHeader';

const MENU_COLLAPSED_LOCALSTORAGE_KEY = 'nafmii-menu-collapsed-state';

export default {
  name: 'nafmii-app',
  components: { LeftMenu, TopHeader },
  data() {
    return {
      isMenuCollapsed: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getMenuCollapsedState();
    },
    getMenuCollapsedState() {
      const menuCollapsedState = JSON.parse(
        localStorage.getItem(MENU_COLLAPSED_LOCALSTORAGE_KEY),
      );
      if (menuCollapsedState !== null) {
        this.isMenuCollapsed = menuCollapsedState;
      }
    },
    handleToggleMenuCollapse() {
      this.isMenuCollapsed = !this.isMenuCollapsed;
      localStorage.setItem(
        MENU_COLLAPSED_LOCALSTORAGE_KEY,
        JSON.stringify(this.isMenuCollapsed),
      );
    },
    removeMenuCollapsedLocalStorage() {
      localStorage.removeItem(MENU_COLLAPSED_LOCALSTORAGE_KEY);
    },
  },
};
</script>

<style lang="scss" scoped>
.nafmii-app {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  .right {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .collapse-btn {
      border: none;
      background: unset;
      padding: 0px;
      cursor: pointer;
    }
  }
}
</style>
