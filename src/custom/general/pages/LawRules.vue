<template>
  <div class="law-rules" v-loading="isLoading">
    <div class="header">
      <div class="header-button">
        <el-button size="medium" type="primary" @click="handleGoBack">
          <i class="fa fa-arrow-left fa-fw"></i>
          返回
        </el-button>
        <el-button size="medium" type="primary" @click="handleAddLawRule">
          新增文档明细
        </el-button>
        <el-button
          size="medium"
          type="primary"
          @click="handleRuleTransformation">
          规则转换
        </el-button>
      </div>
      <tooltip-over
        class="law-title"
        :content="lawInfo.name"
        justifyContent="center"></tooltip-over>
      <div class="search">
        <status-filter-checkbox
          v-model="filterEnable"
          :options="statusFilterOptions"
          @change="handleStatusFilterChange" />

        <el-input
          ref="inputRef"
          v-model.trim="keywords"
          placeholder="请输入关键字"
          size="medium"
          clearable
          class="search-input"
          @clear="handleSearchClick"
          @keydown.enter.native="handleSearchClick">
        </el-input>
        <el-button
          type="primary"
          size="medium"
          class="search-btn"
          @click="handleSearchClick">
          查询
        </el-button>
      </div>
    </div>
    <el-table
      :data="lawRules"
      ref="tableRef"
      v-loading="isTableLoading"
      height="calc(100vh - 191px)"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      @sort-change="handleIdSortChange">
      <el-table-column
        width="100"
        prop="id"
        label="ID"
        sortable="custom"
        :sort-orders="['ascending', 'descending']">
      </el-table-column>
      <el-table-column
        prop="content"
        label="文档明细"
        min-width="400"></el-table-column>
      <el-table-column
        prop="scenariosText"
        label="应用场景"
        min-width="100"
        align="center"
        show-overflow-tooltip>
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="scenarioPopover"
            placement="bottom"
            width="160"
            popper-class="table-column-multiple-select-popper"
            trigger="manual"
            v-model="popoverConfig.scenario.visible">
            <div
              @click="handleScenarioAllClick"
              class="option-item"
              :class="{
                'is-active': filterParams.scenario_ids.length === 0,
              }">
              <span>全部</span>
              <i class="el-icon-check"></i>
            </div>
            <div
              v-for="item in availableScenarioOptions"
              :key="item.id"
              class="option-item"
              :class="{
                'is-active':
                  filterParams.scenario_ids.length <
                    availableScenarioOptions.length &&
                  filterParams.scenario_ids.includes(item.id),
              }"
              @click="handleScenarioItemClick(item)">
              <span>{{ item.name }}</span>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleScenarioPopover">
              应用场景<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.scenariosText || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="规则转换状态"
        width="130"
        align="center">
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="statusPopover"
            placement="bottom"
            width="120"
            popper-class="table-column-multiple-select-popper"
            trigger="manual"
            v-model="popoverConfig.status.visible">
            <div
              @click="handleStatusAllClick"
              class="option-item"
              :class="{
                'is-active': filterParams.status.length === 0,
              }">
              <span>全部</span>
              <i class="el-icon-check"></i>
            </div>
            <div
              v-for="item in statusOptions"
              :key="item.key"
              class="option-item"
              :class="{
                'is-active':
                  filterParams.status.length < statusOptions.length &&
                  filterParams.status.includes(item.key),
              }"
              @click="handleStatusItemClick(item.key)">
              <span>{{ item.value }}</span>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleStatusPopover">
              规则转换状态<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <span
            :class="{
              error: scope.row.status === LAW_RULE_STATUS.CONVERT_FAILED,
            }"
            >{{ LAW_RULE_STATUS_MAP[scope.row.status] }}</span
          >
          <i
            v-if="
              [
                LAW_RULE_STATUS.CONVERTED,
                LAW_RULE_STATUS.CONVERT_FAILED,
              ].includes(scope.row.status)
            "
            class="el-icon-refresh-right refresh-icon"
            @click="handleRefreshRule(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" header-align="center">
        <template slot-scope="scope">
          <div class="operation">
            <el-tooltip effect="dark" content="审核开关" placement="top">
              <el-switch
                v-model="scope.row.enable"
                @change="handleSwitchChange(scope.row)">
              </el-switch>
            </el-tooltip>
            <el-tooltip
              v-if="!lawInfo.is_template"
              effect="dark"
              content="开始测试"
              placement="top">
              <el-button
                :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                size="small"
                circle
                @click.native.stop="handleTestLawRule(scope.row)">
                <theme-icon
                  class="test-icon"
                  name="test-law"
                  icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改文档明细" placement="top">
              <el-button
                :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                size="small"
                circle
                :style="{ marginLeft: '10px' }"
                @click.native.stop="handleEditLawRule(scope.row)">
                <theme-icon
                  name="edit-law"
                  icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除文档明细" placement="top">
              <el-button
                :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
                size="small"
                circle
                @click.native.stop="handleDeleteLawRule(scope.row)">
                <theme-icon
                  name="delete-law"
                  icon-class="el-icon-delete"></theme-icon>
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <el-dialog
      title="提示"
      :visible.sync="ruleTransformationDialogVisible"
      width="300px"
      class="rule-transformation-dialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <div class="dialog-tips">请确认下面的文档明细是否需要重新转换</div>
      <el-checkbox-group
        v-model="ruleTransFormationData"
        class="rule-transformation-checkbox-group">
        <el-checkbox :label="LAW_RULE_STATUS.CONVERTED"
          >转换成功的文档明细</el-checkbox
        >
        <el-checkbox :label="LAW_RULE_STATUS.CONVERT_FAILED"
          >转换失败的文档明细</el-checkbox
        >
        <el-checkbox :label="LAW_RULE_STATUS.INIT"
          >未转换的文档明细</el-checkbox
        >
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelTransfromDialog" size="small">
          取消
        </el-button>
        <el-button
          type="primary"
          :disabled="ruleTransFormationData.length === 0"
          :loading="transforming"
          @click="handleConfirmTransfromDialog"
          size="small">
          开始转换
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="switchDialogVisible"
      width="300px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="closeSwitchDialog">
      <div class="dialog-tips">删除/关闭对应的审核规则？</div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSwitchRule" size="small">
          取消
        </el-button>
        <el-button type="primary" @click="handleDeleteSwitchRule" size="small">
          删除
        </el-button>
        <el-button type="primary" @click="handleOffRule" size="small">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <add-law-rule-dialog
      v-if="addLawRuleDialogVisible"
      :law-name="lawInfo.name"
      :current-rule="currentRule"
      :type-options="currentlawTypeOptions"
      :is-template="lawInfo.is_template"
      @close="handleCloseAddLawRuleDialog"
      @confirm="handleAddLawRuleConfirm"></add-law-rule-dialog>
    <test-rule-dialog
      v-if="testRuleDialogVisible"
      :test-rule-info="testRuleInfo"
      :document-list="documentList"
      @close="handleCloseTestRuleDialog"></test-rule-dialog>
    <check-diff-rules-dialog
      ref="checkDiffRulesDialog"
      v-if="checkDiffRulesDialogVisible"
      :diff-rules="diffRules"
      :law-name="lawInfo.name"
      @cancel="handleCancelCheckDiffRulesDialog"
      @update="handleUpdateLawRule"></check-diff-rules-dialog>
  </div>
</template>
<script>
import { laws as lawsApi } from '@/store/api';
import AddLawRuleDialog from '../components/AddLawRuleDialog.vue';
import TestRuleDialog from '../components/TestRuleDialog.vue';
import CheckDiffRulesDialog from '../components/CheckDiffRulesDialog.vue';
import TooltipOver from '../components/TooltipOver.vue';
import StatusFilterCheckbox from '../components/StatusFilterCheckbox.vue';
import {
  LAW_SESSION_KEY,
  LAW_RULE_STATUS,
  LAW_RULE_STATUS_MAP,
  LAW_REFRESH_STATUS,
} from '@/store/constants';
import { polling } from '@/utils';

export default {
  components: {
    AddLawRuleDialog,
    TestRuleDialog,
    CheckDiffRulesDialog,
    TooltipOver,
    StatusFilterCheckbox,
  },
  name: 'LawRules',
  props: {
    rankId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      LAW_RULE_STATUS,
      LAW_RULE_STATUS_MAP,
      keywords: '',
      filterEnable: null,
      lawRules: [],
      lawInfo: {},
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      addLawRuleDialogVisible: false,
      ruleTransformationDialogVisible: false,
      testRuleDialogVisible: false,
      switchDialogVisible: false,
      ruleTransFormationData: [],
      currentRule: null,

      needConfirmData: {},
      testRuleInfo: {},
      closePolling: null,
      isLoading: true,
      isTableLoading: false,
      diffRules: [],
      checkDiffRulesDialogVisible: false,
      documentList: [],
      transforming: false,
      // 筛选参数
      filterParams: {
        scenario_ids: [],
        status: [],
      },
      // ID列排序状态：'ascending'(正序-默认), 'descending'(倒序)
      idSortOrder: 'ascending',
      // popover 配置
      popoverConfig: {
        scenario: {
          visible: false,
          timer: null,
          ref: 'scenarioPopover',
        },
        status: {
          visible: false,
          timer: null,
          ref: 'statusPopover',
        },
      },
    };
  },

  watch: {
    'popoverConfig.scenario.visible'(visible) {
      this.handlePopoverVisibilityChange('scenario', visible);
    },
    'popoverConfig.status.visible'(visible) {
      this.handlePopoverVisibilityChange('status', visible);
    },
  },

  computed: {
    params() {
      const params = {
        page: this.pager.page,
        size: this.pager.size,
      };
      if (this.keywords) {
        params.keywords = this.keywords;
      }
      // 添加筛选参数
      if (this.filterParams.scenario_ids.length > 0) {
        params.scenario_ids = this.filterParams.scenario_ids;
      }
      if (this.filterParams.status.length > 0) {
        params.status = this.filterParams.status;
      }
      if (this.filterEnable !== null) {
        params.enable = this.filterEnable;
      }
      // 添加ID排序参数
      if (this.idSortOrder === 'descending') {
        params.desc = true;
      }

      return params;
    },
    lawTypeOptions() {
      return this.$store.getters['scenariosModule/scenarioItems'];
    },
    currentlawTypeOptions() {
      return this.lawTypeOptions.filter((item) =>
        this.lawInfo.scenarios.map((item) => item.id).includes(item.id),
      );
    },
    // 可用的应用场景选项（基于当前法规的scenarios过滤）
    availableScenarioOptions() {
      if (!this.lawInfo.scenarios) return [];
      return this.lawTypeOptions.filter((item) =>
        this.lawInfo.scenarios.map((scenario) => scenario.id).includes(item.id),
      );
    },
    // 状态选项
    statusOptions() {
      return Object.keys(LAW_RULE_STATUS_MAP).map((key) => ({
        key: parseInt(key),
        value: LAW_RULE_STATUS_MAP[key],
      }));
    },
    lawId() {
      return this.lawInfo.id;
    },
    // 启用状态筛选选项
    statusFilterOptions() {
      return [
        { label: '启用', value: true },
        { label: '未启用', value: false },
      ];
    },
  },
  methods: {
    async init() {
      this.getScenarios();
      this.getLawInfo();
      this.getLawRules({ loading: false });
    },
    openPolling() {
      this.stopPolling();

      this.closePolling = polling(
        async () => {
          if (this.needFreshRules()) {
            await this.getLawRules({ loading: false });
          } else {
            this.stopPolling();
          }
        },
        10e3,
        { leading: false },
      );
    },

    stopPolling() {
      if (this.closePolling) {
        this.closePolling();
        this.closePolling = null;
      }
    },
    needFreshRules() {
      return this.lawRules.some(
        (item) =>
          item.status === LAW_RULE_STATUS.INIT ||
          item.status === LAW_RULE_STATUS.CONVERTING ||
          item.status === LAW_RULE_STATUS.WAITING,
      );
    },
    async getScenarios() {
      try {
        await this.$store.dispatch('scenariosModule/getScenarios');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getLawInfo() {
      try {
        const lawInfo = await lawsApi.getLawInfo(this.rankId);
        this.lawInfo = lawInfo;
        if (lawInfo.refresh_status === LAW_REFRESH_STATUS.SUCCESS) {
          this.getDiffRules();
        } else if (lawInfo.refresh_status === LAW_REFRESH_STATUS.FAILED) {
          await lawsApi.revertLawRules(this.lawId);
        }
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
    async getDiffRules() {
      try {
        const { diff } = await lawsApi.getDiffRules(this.lawId);
        this.diffRules = diff.filter((item) => item.type !== 'equal');
        this.checkDiffRulesDialogVisible = true;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getLawRules(options = { loading: true }) {
      try {
        if (options.loading) {
          this.isTableLoading = true;
        }

        const { items, total } = await lawsApi.getLawRules(
          this.rankId,
          this.params,
        );

        this.lawRules = items.map((item) => {
          return {
            ...item,
            scenariosText: item.scenarios.map((item) => item.name).join('、'),
          };
        });
        this.pager.total = total;

        this.openPolling();

        if (options.loading && this.$refs.tableRef) {
          this.$refs.tableRef.bodyWrapper.scrollTop = 0;
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        if (options.loading) {
          this.isTableLoading = false;
        }
      }
    },
    handleCloseTestRuleDialog() {
      this.testRuleDialogVisible = false;
      this.testRuleInfo = {};
    },
    closeSwitchDialog() {
      this.needConfirmData = null;
    },
    handleCancelSwitchRule() {
      const row = this.lawRules.find(
        (item) => item.id === this.needConfirmData.id,
      );
      row.enable = !row.enable;
      this.switchDialogVisible = false;
    },
    handleDeleteSwitchRule() {
      this.handleDeleteLawRule(this.needConfirmData, { confirm: false });
      this.switchDialogVisible = false;
    },
    async handleAddLawRuleConfirm(data) {
      this.addLawRuleDialogVisible = false;
      try {
        if (this.currentRule) {
          await lawsApi.updateRule(this.lawId, this.currentRule.id, data);
        } else {
          await lawsApi.createRule(this.lawId, data);
        }
        this.$notify({
          title: '成功',
          message: this.currentRule ? '更新文档明细成功' : '新建文档明细成功',
          type: 'success',
        });
        this.getLawRules();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
        });
      } finally {
        this.currentRule = null;
      }
    },
    handleCloseAddLawRuleDialog() {
      this.currentRule = null;
      this.addLawRuleDialogVisible = false;
    },
    handleTestLawRule(row) {
      this.getDocumentList({
        scenario_ids: row.scenarios.map((scenario) => scenario.id),
      });

      this.testRuleDialogVisible = true;
      this.testRuleInfo = row;
    },
    async getDocumentList(params) {
      try {
        const { files } = await lawsApi.getTestFileList(params);
        this.documentList = files;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async handleRefreshRule(row) {
      const confirm = await this.$confirm('是否要重新转换该条规则？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
      }).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await lawsApi.ruleConvert(row.id);
          this.$notify({
            title: '成功',
            message: '重新转换成功',
            type: 'success',
          });
          this.getLawRules();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async handleDeleteLawRule(row, options = { comfirm: true }) {
      if (options.comfirm) {
        const { exists_ids } = await lawsApi.getCheckPointsExistsIdsByRule(
          row.id,
        );
        const confirm = await this.$msgbox({
          title: '提示',
          message:
            exists_ids.length > 0
              ? `<div>
          <p style="font-size: 14px;  color: #303133; margin-bottom: 10px;">是否删除该条文档明细?</p>
          <p style="color: #F56C6C; font-size: 12px;">提示：文档明细删除后，对应的审核规则将被废弃</p>
        </div>`
              : `<div>
          <p style="font-size: 14px;  color: #303133; margin-bottom: 10px;">是否删除该条文档明细?</p>
        </div>`,
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          dangerouslyUseHTMLString: true,
        }).catch(() => {});
        if (confirm != 'confirm') {
          return;
        }
      }

      try {
        await lawsApi.deleteRule(this.lawId, row.id);
        if (this.lawRules.length === 1 && this.pager.page > 1) {
          this.pager.page--;
        }
        this.getLawRules();
        this.$notify({
          title: '成功',
          message: '删除文档明细成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleOffRule() {
      const rowData = this.lawRules.find(
        (item) => item.id === this.needConfirmData.id,
      );
      this.updateRuleEnable(rowData);
      this.switchDialogVisible = false;
    },
    async handleSwitchChange(row) {
      if (!row.enable && row.status === LAW_RULE_STATUS.CONVERTED) {
        this.needConfirmData = row;
        this.switchDialogVisible = true;
      } else {
        this.updateRuleEnable(row);
      }
    },
    async updateRuleEnable(row) {
      const law_id = this.lawId;
      const rule_id = row.id;
      try {
        await lawsApi.switchRule(law_id, rule_id, {
          enable: row.enable,
        });
        this.$notify({
          title: '成功',
          message: row.enable ? '启用成功' : '禁用成功',
          type: 'success',
        });
        this.getLawRules({ loading: false });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
        row.enable = !row.enable;
      }
    },
    handleChangePage(page) {
      this.pager.page = page;
      this.getLawRules();
    },
    handleChangeSize(size) {
      this.pager.page = 1;
      this.pager.size = size;
      this.getLawRules();
    },
    handleGoBack() {
      let query = {};
      try {
        query = JSON.parse(window.sessionStorage.getItem(LAW_SESSION_KEY));
      } catch (error) {
        console.error(error);
      }
      this.$router.replace({
        query,
        name: 'laws',
      });
    },
    handleAddLawRule() {
      this.addLawRuleDialogVisible = true;
    },
    handleRuleTransformation() {
      this.ruleTransformationDialogVisible = true;
    },
    handleCancelTransfromDialog() {
      this.ruleTransformationDialogVisible = false;
    },
    async handleConfirmTransfromDialog() {
      try {
        this.transforming = true;
        await lawsApi.convertLawRules(this.lawId, {
          status: this.ruleTransFormationData,
        });
        this.ruleTransformationDialogVisible = false;
        this.ruleTransFormationData = [];
      } catch (error) {
        if (error.message) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      } finally {
        this.getLawRules();
        this.transforming = false;
      }
    },
    // popover 通用方法
    togglePopover(type) {
      this.popoverConfig[type].visible = !this.popoverConfig[type].visible;
    },

    handlePopoverMouseEnter(type) {
      if (this.popoverConfig[type].timer) {
        clearTimeout(this.popoverConfig[type].timer);
        this.popoverConfig[type].timer = null;
      }
    },

    handlePopoverMouseLeave(type) {
      this.popoverConfig[type].timer = setTimeout(() => {
        this.popoverConfig[type].visible = false;
      }, 300);
    },

    handlePopoverVisibilityChange(type, visible) {
      if (visible) {
        this.addPopoverMouseListeners(type);
      } else {
        this.removePopoverMouseListeners(type);
      }
    },

    addPopoverMouseListeners(type) {
      this.$nextTick(() => {
        const popover = this.$refs[this.popoverConfig[type].ref];
        if (popover) {
          const popoverEl = popover.popperElm;
          const referenceEl = popover.referenceElm;

          const enterHandler = () => this.handlePopoverMouseEnter(type);
          const leaveHandler = () => this.handlePopoverMouseLeave(type);

          if (popoverEl) {
            popoverEl.addEventListener('mouseenter', enterHandler);
            popoverEl.addEventListener('mouseleave', leaveHandler);
          }
          if (referenceEl) {
            referenceEl.addEventListener('mouseenter', enterHandler);
            referenceEl.addEventListener('mouseleave', leaveHandler);
          }

          // 保存事件处理器引用，用于后续移除
          this.popoverConfig[type].enterHandler = enterHandler;
          this.popoverConfig[type].leaveHandler = leaveHandler;
        }
      });
    },

    removePopoverMouseListeners(type) {
      const popover = this.$refs[this.popoverConfig[type].ref];
      if (
        popover &&
        this.popoverConfig[type].enterHandler &&
        this.popoverConfig[type].leaveHandler
      ) {
        const popoverEl = popover.popperElm;
        const referenceEl = popover.referenceElm;

        const enterHandler = this.popoverConfig[type].enterHandler;
        const leaveHandler = this.popoverConfig[type].leaveHandler;

        if (popoverEl) {
          popoverEl.removeEventListener('mouseenter', enterHandler);
          popoverEl.removeEventListener('mouseleave', leaveHandler);
        }
        if (referenceEl) {
          referenceEl.removeEventListener('mouseenter', enterHandler);
          referenceEl.removeEventListener('mouseleave', leaveHandler);
        }

        // 清理事件处理器引用
        delete this.popoverConfig[type].enterHandler;
        delete this.popoverConfig[type].leaveHandler;
      }

      if (this.popoverConfig[type].timer) {
        clearTimeout(this.popoverConfig[type].timer);
        this.popoverConfig[type].timer = null;
      }
    },

    // 兼容性方法 - 为模板中的事件绑定提供简化调用
    toggleScenarioPopover() {
      this.togglePopover('scenario');
    },
    toggleStatusPopover() {
      this.togglePopover('status');
    },
    // 应用场景筛选方法
    handleScenarioAllClick() {
      this.filterParams.scenario_ids = [];
      this.pager.page = 1;
      this.getLawRules();
    },
    handleScenarioItemClick(item) {
      const index = this.filterParams.scenario_ids.indexOf(item.id);
      if (index > -1) {
        this.filterParams.scenario_ids.splice(index, 1);
      } else {
        this.filterParams.scenario_ids.push(item.id);
      }

      if (
        this.filterParams.scenario_ids.length ===
        this.availableScenarioOptions.length
      ) {
        this.filterParams.scenario_ids = [];
      }

      this.pager.page = 1;
      this.getLawRules();
    },
    // 状态筛选方法
    handleStatusAllClick() {
      this.filterParams.status = [];
      this.pager.page = 1;
      this.getLawRules();
    },
    handleStatusItemClick(statusKey) {
      const index = this.filterParams.status.indexOf(statusKey);
      if (index > -1) {
        this.filterParams.status.splice(index, 1);
      } else {
        this.filterParams.status.push(statusKey);
      }

      if (this.filterParams.status.length === this.statusOptions.length) {
        this.filterParams.status = [];
      }

      this.pager.page = 1;
      this.getLawRules();
    },
    handleSearchClick() {
      this.pager.page = 1;
      this.getLawRules();
    },
    handleStatusFilterChange() {
      // 状态筛选变化时重新搜索
      this.pager.page = 1;
      this.getLawRules();
    },
    handleIdSortChange({ prop, order }) {
      if (prop === 'id') {
        this.idSortOrder = order;
        this.pager.page = 1;
        this.getLawRules();
      }
    },
    handleEditLawRule(row) {
      this.currentRule = row;
      this.addLawRuleDialogVisible = true;
    },
    async handleUpdateLawRule(data) {
      try {
        await lawsApi.applyLawRules(this.lawId, data);
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
        });
        this.getLawRules();
        this.checkDiffRulesDialogVisible = false;
      } catch (error) {
        this.$refs.checkDiffRulesDialog.closeLoading();
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async handleCancelCheckDiffRulesDialog() {
      try {
        await lawsApi.revertLawRules(this.lawId);
        this.checkDiffRulesDialogVisible = false;
      } catch (error) {
        this.$refs.checkDiffRulesDialog.closeLoading();
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
  created() {
    this.init();
  },

  beforeDestroy() {
    if (this.closePolling) {
      this.closePolling();
      this.closePolling = null;
    }
    Object.keys(this.popoverConfig).forEach((type) => {
      this.removePopoverMouseListeners(type);
    });
  },
};
</script>
<style lang="scss" scoped>
.law-rules {
  ::v-deep .el-table {
    .option-header {
      cursor: pointer;
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
  .operation {
    display: flex;
    align-items: center;
    .test-icon {
      margin-left: 10px;
    }
  }
}
.law-title {
  text-align: center;
  line-height: 60px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  flex: 1;
}
.header {
  min-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 20px;
  padding: 0 20px;
  .header-button {
    flex-shrink: 0;
  }
  .search {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    column-gap: 10px;
  }
}
.refresh-icon {
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
}
.error {
  color: red;
}
</style>
<style lang="scss">
.rule-transformation-dialog {
  .dialog-tips {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .rule-transformation-checkbox-group {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
}
</style>
