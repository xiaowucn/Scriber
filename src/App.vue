<template>
  <div
    id="app"
    :class="{
      'citics-dcm-page': $platform.isCiticsDCMEnv(),
      'cmfchina-page': $platform.isCmfchinaEnv(),
    }">
    <nafmii-app v-if="isShowNafmiiApp"></nafmii-app>
    <template v-else>
      <template v-if="showHeader">
        <csc-top-menu v-if="$platform.isCscEnv()"></csc-top-menu>

        <ccxi-top-menu v-else-if="$platform.isCcxiEnv()"></ccxi-top-menu>

        <ccxi-contract-top-menu v-else-if="$platform.isCcxiContractEnv()">
        </ccxi-contract-top-menu>

        <ht-top-menu v-else-if="$platform.isHtEnv()"> </ht-top-menu>

        <szse-annual-top-menu v-else-if="$platform.isSzseAnnualEnv()">
        </szse-annual-top-menu>

        <cmfchina-top-menu v-else-if="$platform.isCmfchinaEnv()">
        </cmfchina-top-menu>

        <citics-tg-top-menu v-else-if="isShowCiticsCustomHeader">
        </citics-tg-top-menu>

        <chinaamc-yx-top-menu v-else-if="isShowChinaamcYxCustomHeader">
        </chinaamc-yx-top-menu>

        <general-top-menu v-else-if="showGeneralMenu"></general-top-menu>

        <template v-else-if="!showPrivateHeader">
          <default-menu v-if="$platform.isDefaultEnv()"></default-menu>
          <top-menu v-else></top-menu>
        </template>
      </template>

      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>

      <log-out v-if="isShowLogout"></log-out>
    </template>
  </div>
</template>

<script>
import TopMenu from './components/Menu';
import DefaultMenu from './components/DefaultMenu';
import CscTopMenu from '@/custom/csc/components/Menu';
import CcxiTopMenu from '@/custom/ccxi/components/NavHeader';
import CcxiContractTopMenu from '@/custom/ccxi/components/NavHeaderContract';
import SzseAnnualTopMenu from '@/custom/szse/components/AnnualReport/Menu.vue';
import HtTopMenu from '@/custom/ht/components/Menu';
import GeneralTopMenu from '@/custom/general/components/TopMenu';
import CiticsTgTopMenu from '@/custom/citics_tg/components/Menu';
import ChinaamcYxTopMenu from '@/custom/chinaamc_yx/components/Menu';
import CmfchinaTopMenu from '@/custom/cmfchina/components/Menu';
import NafmiiApp from '@/custom/nafmii/pages/NafmiiApp';
import LogOut from './components/LogOut';
import { mapGetters } from 'vuex';
import featuresPerimeter from '@/perimeters/features.perimeter';
import checkVersionMixin from '@/components/mixins/CheckVersionMixin';

const mixins = [];
if (featuresPerimeter.supportCheckVersion()) {
  mixins.push(checkVersionMixin);
}

export default {
  name: 'App',
  mixins: mixins,
  components: {
    LogOut,
    DefaultMenu,
    TopMenu,
    CscTopMenu,
    CcxiTopMenu,
    CcxiContractTopMenu,
    SzseAnnualTopMenu,
    HtTopMenu,
    GeneralTopMenu,
    CiticsTgTopMenu,
    ChinaamcYxTopMenu,
    CmfchinaTopMenu,
    NafmiiApp,
  },
  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    showHeader() {
      return !this.$route.meta.hideHeader;
    },
    isShowCiticsCustomHeader() {
      return this.$route.meta.customHeader && this.$platform.isCiticsTGEnv();
    },
    isShowChinaamcYxCustomHeader() {
      return this.$route.meta.customHeader && this.$platform.isChinaamcYxEnv();
    },
    isShowNafmiiApp() {
      return (
        this.showHeader &&
        !this.$route.meta.customHeader &&
        this.$platform.isNafmiiEnv()
      );
    },
    showPrivateHeader() {
      return this.$route.meta.showPrivateHeader;
    },
    showGeneralMenu() {
      return (
        this.$platform.isCgsEnv() ||
        this.$platform.isGffundEnv() ||
        this.$platform.isCmsEnv()
      );
    },
    isShowLogout() {
      if (this.$platform.isSseEnv()) {
        return true;
      }

      if (
        this.$platform.isDefaultEnv() ||
        this.$platform.isCcxiContractEnv() ||
        this.$platform.isCgsEnv() ||
        this.$platform.isGffundEnv() ||
        this.$platform.isCmsEnv()
      ) {
        return false;
      }

      if (this.$platform.isHkexEnv() && this.$route.path.startsWith('/hkex')) {
        return false;
      }

      return this.showHeader;
    },
  },
  created() {
    if (this.$platform.isCiticsTGEnv()) {
      document.title = '文档智能提取';
    }
    this.checkIsClickEvent();
  },
  methods: {
    async checkIsClickEvent() {
      document.addEventListener('mousedown', () => {
        this.timesStart = new Date().getTime();
      });
      document.addEventListener('mouseup', () => {
        this.timesEnd = new Date().getTime();
        if (
          this.timesEnd - this.timesStart > 200 &&
          window.getSelection().toString()
        ) {
          this.$root.isClick = false;
        } else {
          this.$root.isClick = true;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
