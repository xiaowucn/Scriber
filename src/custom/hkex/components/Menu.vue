<template>
  <nav class="hkex-menu" :class="{ 'hkex-menu__collapse': menuCollapsed }">
    <div class="menu-header">
      <el-select
        v-model="auditType"
        size="small"
        placeholder="Please select"
        @change="changeAuditType">
        <el-option
          v-for="item in auditOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-dropdown
        v-if="menuCollapsed"
        placement="right"
        class="el-dropdown-exchange"
        @command="changeAuditType">
        <span class="el-dropdown-link">
          <i class="icon-exchange"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="hkex-menu-dropdown-menu">
          <el-dropdown-item
            v-for="item in auditOptions"
            :key="item.value"
            :command="item.value"
            :class="{ active: item.value === auditType }">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <ol class="hkex-menu__list">
      <li
        v-for="menuItem in menu"
        :key="menuItem.name"
        :class="{ active: menuItem.to.name === menuActived }">
        <router-link v-if="!menuItem.disabled" :to="menuItem.to">
          <el-tooltip
            placement="right"
            effect="dark"
            popper-class="hkex-menu-tooltip"
            :offset="1"
            :visible-arrow="false"
            :content="menuItem.name"
            :disabled="!menuCollapsed">
            <i v-if="menuItem.icon" :class="`${menuItem.icon}`"></i>
          </el-tooltip>
          {{ menuItem.name }}
        </router-link>

        <span v-else-if="!menuCollapsed" @click.stop="selectMenuItem(menuItem)">
          <i v-if="menuItem.icon" :class="`${menuItem.icon}`"></i>
          {{ menuItem.name }}
          <span
            v-if="
              Array.isArray(menuItem.children) && menuItem.children.length > 0
            "
            class="menu-item-collapse">
            <i
              class="fas"
              :class="
                menuItem.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'
              "></i>
          </span>
        </span>

        <el-dropdown
          v-else
          placement="right"
          class="el-dropdown-analysis"
          @command="handleUserCommand">
          <span class="el-dropdown-link">
            <i v-if="menuItem.icon" :class="`${menuItem.icon}`"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="hkex-menu-dropdown-menu analysis-dropdown-menu">
            <el-dropdown-item
              v-for="menuChildItem in menuItem.children"
              :key="menuChildItem.name"
              :command="menuChildItem.name"
              :class="{ active: menuChildItem.to.name === menuActived }">
              <router-link
                v-if="!menuChildItem.disabled"
                :to="menuChildItem.to">
                {{ menuChildItem.name }}
              </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <ol
          v-if="
            Array.isArray(menuItem.children) &&
            menuItem.children.length > 0 &&
            !menuCollapsed &&
            !menuItem.collapsed
          "
          class="hkex-menu__list-secondary">
          <li
            v-for="menuChildItem in menuItem.children"
            :key="menuChildItem.name"
            :class="{ active: menuChildItem.to.name === menuActived }">
            <router-link v-if="!menuChildItem.disabled" :to="menuChildItem.to">
              {{ menuChildItem.name }}
            </router-link>

            <span
              v-else
              class="disabled"
              @click.stop="selectMenuItem(menuChildItem)">
              {{ menuChildItem.name }}
            </span>
          </li>
        </ol>
      </li>
    </ol>

    <el-dropdown
      :placement="menuCollapsed ? 'right' : 'top'"
      class="el-dropdown-user"
      @command="handleUserCommand">
      <span class="el-dropdown-link">
        <i class="fas fa-user"></i>
        <span class="user-info">
          <span class="name">{{ loginUser.name }}</span>
          <i class="el-icon-arrow-right el-icon--right"></i>
        </span>
      </span>
      <el-dropdown-menu slot="dropdown" class="hkex-menu-dropdown-menu">
        <el-dropdown-item
          v-if="$user.isAdminUser()"
          command="ruleManagement"
          :class="{ active: menuActived === 'ruleManagement' }">
          Rule Management
        </el-dropdown-item>
        <el-dropdown-item
          v-if="$user.isAdminUser()"
          command="userManagement"
          :class="{
            active: ['userManagement', 'auditTrail'].includes(menuActived),
          }">
          User Management
        </el-dropdown-item>
        <el-dropdown-item command="signout">Sign Out</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <button
      class="hkex-menu__collapse-btn"
      @click="menuCollapsed = !menuCollapsed">
      <i v-if="!menuCollapsed" class="fas fa-angle-double-left"></i>
      <i v-if="menuCollapsed" class="fas fa-angle-double-right"></i>
      <span v-if="!menuCollapsed">Collapse Sidebar</span>
    </button>
  </nav>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { hkexReportType } from '@/store/constants';
import ReportTypeMixin from '../mixins/ReportType.mixin';
import { checkUnsubmitAnswer } from '../common/utils';
import { fetchAgmDocs, fetchPollDocs } from '@/store/api/hkex.api';

export default {
  name: 'hkex-menu',
  mixins: [ReportTypeMixin],
  mounted() {
    this.init();
  },

  data() {
    return {
      menuActived: '',
      menuCollapsed: true,
      menu: [],
    };
  },

  computed: {
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters('hkexModule', ['isDelisted']),
    ...mapGetters('hkexModule/ruleModule', ['rules']),
    auditType: {
      get() {
        return this.$store.getters['hkexModule/auditType'];
      },
      set(value) {
        if (checkUnsubmitAnswer()) {
          return;
        }

        this.$store.commit('hkexModule/SET_AUDIT_TYPE', value);
      },
    },
    auditOptions() {
      const allModules = this.configuration.page_modules || {};
      const allowedModules = this.loginUser.page_module || [];
      const options = [];

      const availableModules = Object.values(hkexReportType);

      availableModules.forEach((item) => {
        const currentModule = allModules[item.moduleMenuName];
        if (allowedModules.indexOf(currentModule) !== -1) {
          options.push({
            label: item.moduleMenuName,
            value: item.value,
          });
        }
      });

      return options;
    },
  },

  watch: {
    $route(to) {
      this.menuActived = to.name;
      this.setMenuActive();
      this.setAuditType();
      this.setIsDelisted();
    },
    rules() {
      this.setMenu();
      this.updateReviewMenuLink();
    },
    auditType() {
      this.getRules();
    },
  },

  created() {
    this.setAuditType();
    this.setIsDelisted();
    this.setMenu();
    this.getRules();
  },

  methods: {
    init() {
      this.updateReviewMenuLink();
      this.setMenuActive();
    },
    changeAuditType(type) {
      this.$router.push({ name: hkexReportType[type].homeRouterName });
    },
    setAuditType() {
      const routePath = this.$route.path.split('/')[2];
      const modules = Object.values(hkexReportType);
      const currentModule = modules.find((item) =>
        routePath.startsWith(item.modulePath),
      );
      if (currentModule) {
        this.$store.commit('hkexModule/SET_AUDIT_TYPE', currentModule.value);
      }
    },
    setIsDelisted() {
      if (['ruleManagement', 'userManagement'].includes(this.$route.name)) {
        return;
      }
      const isDelisted =
        this.$route.path.endsWith('delisted-securities') ||
        Number(this.$route.query.delist) === 1;
      this.$store.commit('hkexModule/SET_IS_DELISTED', isDelisted);
    },
    setMenu() {
      const homepageName = hkexReportType[this.auditType].homeRouterName;
      const reviewMenuName =
        hkexReportType[this.auditType].reportReviewMenuName;
      const reviewName = hkexReportType[this.auditType].reportReviewRouterName;
      const byRuleName = hkexReportType[this.auditType].byRuleRouterName;
      const byIssuerName = hkexReportType[this.auditType].byIssuerRouterName;

      this.menu = [
        {
          name: 'Home Page',
          to: { name: homepageName },
          icon: 'fas fa-home',
        },
        {
          name: reviewMenuName,
          to: {
            name: reviewName,
          },
          icon: 'fas fa-search',
          disabled: true,
        },
        {
          name: 'Result Analysis',
          to: {
            name: '',
          },
          icon: 'fas fa-chart-bar',
          collapsed: false,
          disabled: true,
          children: [
            {
              name: 'By Rule',
              to: { name: byRuleName },
            },
            {
              name: 'By Issuer',
              to: { name: byIssuerName },
            },
          ],
        },
      ];
    },
    selectMenuItem(menuItem) {
      if (this.menuCollapsed) {
        this.menuCollapsed = false;
        menuItem.collapsed = false;
      } else {
        menuItem.collapsed = !menuItem.collapsed;
      }
    },
    async getRules() {
      try {
        const params = !this.isQrReport ? { dt: this.auditType } : null;
        await this.$store.dispatch('hkexModule/ruleModule/fetchRules', params);
      } catch (error) {
        this.notifyError(error, 'Failed to fetch rules.');
      }
    },
    async fetchLatestAnnualReport() {
      try {
        return await this.$store.dispatch(
          'hkexModule/fetchLatestAnnualReport',
          _.omitBy(
            {
              dt: this.auditType,
            },
            (v) => v === undefined || v === '',
          ),
        );
      } catch (error) {
        return null;
      }
    },
    async updateReviewMenuLink() {
      let latestReport = {};
      const fetchLatestReport = () => {
        if (this.isAgmReport) {
          return fetchAgmDocs();
        }
        if (this.isPollReport) {
          return fetchPollDocs();
        }
      };
      if (this.isAgmReport || this.isPollReport) {
        const res = await fetchLatestReport();
        latestReport = res?.[0] || {};
        latestReport.question_id = latestReport.qid;
        latestReport.file_id = latestReport.fid;
      } else {
        latestReport = await this.fetchLatestAnnualReport();
      }

      if (latestReport) {
        this.menu[1].disabled = false;
        const routeQuery = {
          fileId: latestReport.file_id,
        };
        if (!this.isQrReport) {
          Object.assign(routeQuery, {
            schemaId: latestReport.mold_id,
            rule: this.rules[0]?.rule,
          });
        }
        this.menu[1].to = {
          name: hkexReportType[this.auditType].reportReviewRouterName,
          params: {
            qid: latestReport.question_id,
          },
          query: routeQuery,
        };
      }
    },
    setMenuActive() {
      this.menuActived = this.$route.name.replace(
        /CurrentSecurities|DelistedSecurities/g,
        '',
      );
      if (this.$route.meta.autoExpand && this.menu[2]) {
        this.menu[2].collapsed = false;
      }
    },
    async handleUserCommand(command) {
      if (command === 'ruleManagement') {
        this.$router.push({ name: 'ruleManagement' });
      }
      if (command === 'userManagement') {
        this.$router.push({ name: 'userManagement' });
      }
      if (command === 'signout') {
        await this.$store.dispatch('logout');
        localStorage.removeItem('HKEX_HOME_FILTERS');
        this.$router.push({ name: 'login' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.hkex-menu {
  position: relative;
  width: 280px;
  height: 100%;
  background: $--color-primary;
  overflow: auto;
  border-right: 1px solid rgba($--color-white, 0.5);

  .fas::before {
    font-size: 18px;
  }

  .menu-header {
    padding: 30px 22px 10px 22px;
    text-align: center;
    .el-select {
      width: 100%;
    }
  }

  .hkex-menu__list {
    padding: 15px 0;
    font-size: 18px;
    color: $--color-white;
    list-style: none;
    cursor: default;

    li {
      > span,
      > :is(a) {
        display: block;
        padding: 12px 24px;
        white-space: nowrap;
        color: $--color-white;
        text-decoration: none;

        &:hover {
          background: $--color-white-light;
        }

        i {
          margin-right: 8px;
        }
      }
    }

    .active {
      background: $--color-white-light;

      > span,
      > :is(a) {
        &:hover {
          background: $--color-white-light;
        }
      }
    }

    .menu-item-collapse {
      position: absolute;
      right: 15px;

      i::before {
        font-size: 14px;
      }
    }
  }

  &.hkex-menu__collapse {
    width: 50px;
    overflow: hidden;

    .menu-header {
      padding: 20px 0 0 0;
      .el-select {
        display: none;
      }
    }

    .el-dropdown-exchange {
      .el-dropdown-link {
        display: block;
        padding: 15px;
        text-align: center;
        &:hover {
          background: $--color-white-light;
        }
        .icon-exchange {
          display: block;
          width: 20px;
          height: 20px;
          margin: 0 auto;
          background-size: 100% 100%;
          background-image: url(../common/images/icon-exchange.svg);
          cursor: pointer;
        }
      }
    }
    .el-dropdown-analysis {
      .el-dropdown-link {
        display: block;
        &:hover {
          background: $--color-white-light;
        }
        .fas {
          margin: 0;
          color: #fff;
        }
      }
    }

    .hkex-menu__list {
      a,
      span {
        width: 50px;
        height: 20px;
        padding: 12px 0;
        text-align: center;

        i {
          display: inline-block;
          width: 30px;
          height: 100%;
          margin: 0 10px;
          &::before {
            font-size: 20px;
          }
        }
      }
    }
    .user-info {
      display: none;
    }

    .hkex-menu__collapse-btn {
      &:hover {
        i {
          animation: fade-out-right 2s ease-in-out infinite;
        }
      }
    }
  }

  .hkex-menu__list-secondary {
    list-style: none;

    li {
      > span,
      > :is(a) {
        padding-left: 48px;
        color: $--color-white;
        text-decoration: none;
        &::before {
          content: '-';
        }
        &.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }
  }

  .el-dropdown-user {
    position: absolute;
    bottom: 50px;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 10px 0;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      background-color: $--color-white-light;
    }
    .el-dropdown-link {
      width: 100%;
      padding: 15px;
      text-align: center;
      i::before {
        font-size: 14px;
      }
      .user-info {
        .name {
          display: inline-block;
          max-width: 115px;
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: bottom;
        }
      }
    }
  }
  .hkex-menu__collapse-btn {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    background: $--color-white-light;
    border: none;
    outline: none;
    font-size: 14px;
    color: rgba($--color-white, 0.5);
    cursor: pointer;

    &:hover {
      color: rgba($--color-white, 0.7);
      i {
        animation: fade-out-left 2s ease-in-out infinite;
      }
    }

    .fas::before {
      margin-right: 4px;
      font-size: 16px;
    }
  }

  ::v-deep .el-select {
    input {
      border: none;
      color: #369aa2;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.5);
    }

    .popper__arrow {
      display: none;
    }

    .el-input__icon {
      &:before {
        font-size: 14px;
        font-weight: bold;
        color: $--color-primary;
      }
    }

    .el-select-dropdown {
      margin-top: 0;
    }

    .el-select-dropdown__item {
      font-size: 14px;
      font-weight: bold;
    }
  }

  @keyframes fade-out-left {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.3;
      transform: translate3d(-50%, 0, 0);
    }
  }

  @keyframes fade-out-right {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.3;
      transform: translate3d(50%, 0, 0);
    }
  }
}
</style>

<style lang="scss">
@import '../common/color.scss';

.hkex-menu-tooltip {
  &.is-dark {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
.hkex-menu-dropdown-menu {
  padding: 0;
  .el-dropdown-menu__item {
    &:hover {
      color: $--color-blue;
    }
    &.active {
      color: $--color-blue;
      background-color: #ecf5ff;
      font-weight: 600;
      :is(a) {
        color: $--color-blue;
        text-decoration: none;
        font-weight: 600;
      }
    }
    :is(a) {
      color: #606266;
      text-decoration: none;
    }
  }
  &.analysis-dropdown-menu {
    .el-dropdown-menu__item {
      padding: 0 10px;
      :is(a) {
        display: inline-block;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
