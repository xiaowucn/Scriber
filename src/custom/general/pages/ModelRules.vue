<template>
  <div class="custom-rules" v-loading="isLoading">
    <template v-if="!isShowingFullTest">
      <div class="operater-list">
        <div class="operater-list-left">
          <slot name="operater"></slot>
          <el-button size="medium" type="primary" @click="handleOpenFullTest">
            <div class="test-icon-wrapper">
              <theme-icon
                class="test-icon"
                name="test-law-white"
                icon-class="el-icon-edit"></theme-icon>
              完整测试
            </div>
          </el-button>
        </div>
        <div class="search-container">
          <status-filter-checkbox
            v-model="searchForm.abandoned"
            label="审核规则实行状态："
            :options="abandonedFilterOptions"
            @change="handleAbandonedFilterChange" />
          <el-form :inline="true" :model="searchForm">
            <el-form-item>
              <el-select
                v-model="searchForm.field"
                size="medium"
                class="search-field">
                <el-option
                  v-for="(item, index) in searchOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-input
                v-model.trim="searchForm.keyword"
                :placeholder="currentSearchOption.placeholder"
                size="medium"
                clearable
                class="search-input"
                @clear="handleSearchClick"
                @keydown.enter.native="handleSearchClick">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="medium"
                class="search-btn"
                @click="handleSearchClick">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        class="rule-list-table has-border"
        height="calc(100vh - 218px)">
        <el-table-column width="70" prop="id" label="ID"></el-table-column>
        <el-table-column min-width="100" align="center" label="应用场景">
          <template slot="header" slot-scope="{}">
            <el-popover
              ref="scenarioFilterPopover"
              v-model="popoverConfig.scenario.visible"
              placement="bottom"
              width="168"
              trigger="manual"
              popper-class="model-table-column-select-popper">
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
                v-for="item in filterLawTypeOptions"
                :key="item.id"
                class="option-item"
                :class="{
                  'is-active':
                    filterParams.scenario_ids.includes(item.id) &&
                    filterParams.scenario_ids.length <
                      filterLawTypeOptions.length,
                }"
                @click="handleScenarioItemClick(item)">
                <tooltip-over :content="item.name"></tooltip-over>
                <i class="el-icon-check"></i>
              </div>
              <span
                slot="reference"
                class="option-header"
                @mouseenter="togglePopover('scenario')">
                应用场景<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div>
              {{
                scope.row.nowData.scenarios.map((item) => item.name).join('、')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          align="center"
          prop="order.name"
          label="文档名称">
          <template slot-scope="scope">
            <tooltip-over
              :content="scope.row.order.name"
              :max-lines="4"
              placement="right">
            </tooltip-over>
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          header-align="center"
          prop="nowData.rule_content"
          label="法规内容">
          <template slot-scope="scope">
            <div>
              <tooltip-over
                :content="scope.row.nowData.rule_content"
                :max-lines="4"
                placement="right">
              </tooltip-over>
              <el-tooltip :content="scope.row.abandoned_reason" placement="top">
                <el-tag type="danger" size="mini" v-show="scope.row.abandoned">
                  废弃
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="nowData.name"
          align="center"
          label="规则名称">
          <template slot-scope="scope">
            {{ scope.row.nowData.name }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          prop="nowData.core"
          header-align="center"
          label="核心要求">
          <template slot-scope="scope">
            <tooltip-over
              :content="scope.row.nowData.core"
              :max-lines="4"
              placement="right">
            </tooltip-over>
          </template>
        </el-table-column>
        <el-table-column min-width="220" header-align="center">
          <template slot="header" slot-scope="{}">
            <el-popover
              ref="consistencyFilterPopover"
              v-model="popoverConfig.consistency.visible"
              placement="bottom"
              width="126"
              trigger="manual"
              popper-class="model-table-column-select-popper consistency-filter-popover">
              <div
                @click="handleConsistencyAllClick"
                class="option-item"
                :class="{
                  'is-active': filterParams.is_consistency === '',
                }">
                <span>全部</span>
              </div>
              <div
                class="option-item"
                :class="{
                  'is-active': filterParams.is_consistency === 'true',
                }"
                @click="handleConsistencyItemClick('true')">
                <span>一致性检查</span>
              </div>
              <div
                class="option-item"
                :class="{
                  'is-active': filterParams.is_consistency === 'false',
                }"
                @click="handleConsistencyItemClick('false')">
                <span>非一致性检查</span>
              </div>
              <span
                slot="reference"
                class="option-header"
                @mouseenter="togglePopover('consistency')">
                验证方式<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div class="verification-method-content">
              <div class="check-type">
                {{ isConsistencyCheck(scope.row) ? '一致性' : '非一致性' }}
              </div>
              <div class="check-content">
                <div
                  v-if="isConsistencyCheck(scope.row)"
                  class="consistency-content">
                  <div
                    v-for="(group, index) in getTemplateGroups(scope.row)"
                    :key="index"
                    class="template-group-display">
                    <div class="group-label">{{ group.label }}</div>
                    <tooltip-over
                      :always-show-tooltip="true"
                      :content="
                        group.contents.map((item) => item.content).join('\n')
                      "
                      :tooltip-content="
                        getTooltipContent(
                          getTemplateGroups(scope.row),
                          group,
                          index,
                        )
                      "
                      :max-lines="4"
                      placement="right">
                    </tooltip-over>
                  </div>
                </div>
                <div v-else class="non-consistency-content">
                  <tooltip-over
                    :content="scope.row.nowData.check_method"
                    :max-lines="4"
                    placement="right">
                  </tooltip-over>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="修改/复核人员">
          <template slot-scope="scope">
            <div v-if="userMap[scope.row.nowData.updated_by_id]">
              修改人：{{ userMap[scope.row.nowData.updated_by_id] }}
            </div>
            <div v-if="userMap[scope.row.nowData.reviewer_id]">
              复核人：{{ userMap[scope.row.nowData.reviewer_id] }}
            </div>
          </template>
          <template> </template>
        </el-table-column>
        <el-table-column width="114" align="center">
          <template slot="header" slot-scope="{}">
            <el-popover
              ref="reviewStatusFilterPopover"
              v-model="popoverConfig.reviewStatus.visible"
              placement="bottom"
              width="126"
              trigger="manual"
              popper-class="model-table-column-select-popper review-status-filter-popover">
              <div
                @click="handleReviewStatusAllClick"
                class="option-item"
                :class="{
                  'is-active':
                    filterParams.review_status.length === reviewStatusNums ||
                    filterParams.review_status.length === 0,
                }">
                <span>全部</span>
              </div>
              <div
                v-for="(value, key) in REVIEW_STATUS_FILTER_MAP"
                :key="value"
                class="option-item"
                :class="{
                  'is-active': filterParams.review_status === Number(key),
                }"
                @click="handleReviewStatusItemClick(Number(key))">
                <span>{{ value }}</span>
              </div>
              <span
                slot="reference"
                class="option-header"
                @mouseenter="togglePopover('reviewStatus')">
                审核状态<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div
              class="option-container"
              :class="{
                'not-pass': isNotPass(scope.row.nowData.review_status),
              }">
              <span>
                {{ REVIEW_STATUS_MAP[scope.row.nowData.review_status] }}
              </span>
              <el-tooltip
                v-if="
                  scope.row.nowData.meta &&
                  isNotPass(scope.row.nowData.review_status)
                "
                effect="dark"
                placement="top"
                popper-class="review-reason-popper">
                <div slot="content" class="review-reason-content">
                  {{ scope.row.nowData.meta.review_reason }}
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <el-tooltip effect="dark" content="是否开启" placement="top">
                <el-switch
                  v-model="scope.row.enable"
                  :disabled="scope.row.abandoned"
                  @change="handleSwitchChange(scope.row)"
                  style="margin-right: 10px">
                </el-switch>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看" placement="top">
                <el-button
                  :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                  size="small"
                  circle
                  @click.native.stop="lookRule(scope.row)">
                  <theme-icon
                    name="check-law"
                    icon-class="el-icon-edit"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="审核" placement="top">
                <el-button
                  v-if="canReview"
                  :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                  size="small"
                  circle
                  :disabled="disabledReview(scope.row)"
                  @click.native.stop="handleReview(scope.row)">
                  <theme-icon
                    :name="disabledReview(scope.row) ? 'review-grey' : 'review'"
                    icon-class="el-icon-edit"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="canEdit"
                effect="dark"
                content="修改审核规则"
                placement="top">
                <el-button
                  :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                  size="small"
                  circle
                  :disabled="disabledEdit(scope.row)"
                  @click.native.stop="editRule(scope.row)">
                  <theme-icon
                    :name="
                      disabledEdit(scope.row) ? 'edit-grey-law' : 'edit-law'
                    "
                    icon-class="el-icon-edit"></theme-icon>
                </el-button>
              </el-tooltip>

              <el-popover
                placement="bottom-end"
                width="150px"
                trigger="hover"
                :disabled="!canEdit"
                popper-class="model-rule-column-select-popper">
                <ul class="options">
                  <li
                    @click="handleRelate(scope.row)"
                    v-show="!scope.row.abandoned">
                    <i class="el-icon-connection icon"></i>
                    <span>关联法规</span>
                  </li>
                  <li
                    :class="{
                      disabled: isDisabledDelete(scope.row),
                    }"
                    @click="deleteRule(scope.row)">
                    <i class="el-icon-delete icon"></i>
                    <span>删除审核点</span>
                  </li>
                </ul>
                <div
                  v-show="canEdit"
                  class="more"
                  :class="!canEdit ? 'disabled' : ''"
                  slot="reference">
                  更多
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        :current-page="searchForm.page"
        :page-size="searchForm.size"
        :total="pager.total"
        @current-change="handleChangePage"
        @size-change="handleChangeSize">
      </el-pagination>
    </template>
    <edit-rule-dialog
      v-if="editRuleVisible"
      :mode="editRuleMode"
      :loading="editRuleLoading"
      :original-data="originalRuleData"
      :now-data="currentRuleData"
      @close="handleEditRuleClose"
      @submit="handleEditRuleSubmit"
      @approve="handleEditRuleApprove"
      @reject="handleEditRuleReject"
      @delete="handleEditRuleDelete"
      @cancleDel="handleEditRuleCancleDel"
      @cache="handleEditRuleCache"></edit-rule-dialog>

    <full-test-model-rules
      v-if="isShowingFullTest"
      ref="fullTestModelRules"
      :laws-options="lawsOptions"
      @goBack="handleGoBack"
      @detail="handleDetailToSave"
      @relate="handleRelate" />
    <related-laws-dialog
      v-if="showRelatedLawsDialog"
      :current-row="relatedRow"
      :laws-options="lawsOptions"
      @success="handleRelatedSuccess"
      @close="handleRelatedLawsDialogClose" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { laws as lawsApi } from '@/store/api';
import EditRuleDialog from '../components/EditRuleDialog.vue';
import FullTestModelRules from '../components/FullTestModelRules.vue';
import RelatedLawsDialog from '../components/RelatedLawsDialog.vue';
import TooltipOver from '../components/TooltipOver.vue';
import StatusFilterCheckbox from '../components/StatusFilterCheckbox.vue';
import {
  REVIEW_STATUS,
  REVIEW_STATUS_MAP,
  REVIEW_STATUS_FILTER,
  EDIT_RULE_DIALOG_MODE,
  REVIEW_STATUS_FILTER_MAP,
} from '@/store/constants';
import { polling } from '@/utils';
import _ from 'lodash';

export default {
  name: 'custom-rules',
  components: {
    EditRuleDialog,
    FullTestModelRules,
    RelatedLawsDialog,
    TooltipOver,
    StatusFilterCheckbox,
  },
  props: {
    showFullTest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      REVIEW_STATUS,
      REVIEW_STATUS_MAP,
      REVIEW_STATUS_FILTER,
      EDIT_RULE_DIALOG_MODE,
      REVIEW_STATUS_FILTER_MAP,
      isLoading: false,
      searchForm: {
        field: 'law_name',
        keyword: '',
        abandoned: false,
        page: 1,
        size: 10,
      },
      filterParams: {
        review_status: '',
        is_consistency: '',
        scenario_ids: [],
      },
      searchOptions: [
        { label: '文档名称', value: 'law_name', placeholder: '请输入文档名称' },
        {
          label: '法规内容',
          value: 'rule_content',
          placeholder: '请输入法规内容',
        },
        {
          label: '规则名称',
          value: 'name',
          placeholder: '请输入规则名称',
        },
      ],
      tableData: [],
      pager: {
        total: 0,
      },
      editRuleVisible: false,
      editRuleMode: EDIT_RULE_DIALOG_MODE.REVIEW,
      currentRuleData: null, // 当前操作的规则数据
      originalRuleData: null, // 原始规则数据（用于审核对比）
      isShowingFullTest: false,
      userMap: {},
      editRuleLoading: false,
      showRelatedLawsDialog: false,
      relatedRow: null,
      lawsOptions: [],
      // popover 统一配置对象
      popoverConfig: {
        status: {
          visible: false,
          timer: null,
          ref: 'statusFilterPopover',
        },
        consistency: {
          visible: false,
          timer: null,
          ref: 'consistencyFilterPopover',
        },
        reviewStatus: {
          visible: false,
          timer: null,
          ref: 'reviewStatusFilterPopover',
        },
        scenario: {
          visible: false,
          timer: null,
          ref: 'scenarioFilterPopover',
        },
      },
      // 当前页场景ID（由接口 all_scenario_ids 返回）
      allUseScenarioIds: [],
      closePolling: null,
    };
  },
  watch: {
    'popoverConfig.status.visible'(visible) {
      this.handlePopoverVisibilityChange('status', visible);
    },
    'popoverConfig.consistency.visible'(visible) {
      this.handlePopoverVisibilityChange('consistency', visible);
    },
    'popoverConfig.reviewStatus.visible'(visible) {
      this.handlePopoverVisibilityChange('reviewStatus', visible);
    },
    'popoverConfig.scenario.visible'(visible) {
      this.handlePopoverVisibilityChange('scenario', visible);
    },
  },
  computed: {
    ...mapGetters(['loginUser']),
    lawTypeOptions() {
      return this.$store.getters['scenariosModule/scenarioItems'];
    },
    filterLawTypeOptions() {
      return this.lawTypeOptions.filter((item) =>
        this.allUseScenarioIds.includes(item.id),
      );
    },
    canReview() {
      if (this.$features.supportRuleReview()) {
        return this.$isAllowed('customerRuleReview');
      }
      return false;
    },
    canEdit() {
      return this.$isAllowed('customerRuleParticipate');
    },
    currentSearchOption() {
      return this.searchOptions.find(
        (option) => option.value === this.searchForm.field,
      );
    },
    params() {
      const params = {
        page: this.searchForm.page,
        size: this.searchForm.size,
      };
      if (this.searchForm.keyword) {
        params[this.searchForm.field] = this.searchForm.keyword;
      }
      if (
        this.filterParams.scenario_ids.length &&
        this.filterParams.scenario_ids.length !== this.lawTypeOptions.length
      ) {
        params.scenario_ids = this.filterParams.scenario_ids;
      }
      if (this.filterParams.review_status) {
        params.review_status = this.filterParams.review_status;
      }
      if (this.filterParams.is_consistency !== '') {
        params.is_consistency = this.filterParams.is_consistency === 'true';
      }
      if (this.searchForm.abandoned !== null) {
        params.abandoned = this.searchForm.abandoned;
      }
      return params;
    },
    reviewStatusNums() {
      return Object.keys(REVIEW_STATUS_FILTER).length;
    },
    abandonedFilterOptions() {
      return [
        { label: '现行', value: false },
        { label: '废弃', value: true },
      ];
    },
  },
  methods: {
    getTooltipContent(templates, group, index) {
      const startIndex = templates.findIndex(
        (item) => item.label === group.label,
      );
      const realIndex = index - startIndex;
      return group.contents
        .map(
          (item, itemIndex) =>
            `${group.label} ${realIndex + 1}-${itemIndex + 1}\n\n${
              item.content
            }`,
        )
        .join('\n\n');
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
    isDisabledDelete(row) {
      return (
        [REVIEW_STATUS.DEL_NOT_REVIEWED].includes(row.nowData.review_status) &&
        !row.abandoned
      );
    },
    async getLawsOrders() {
      try {
        const data = await lawsApi.getLawsOrders();
        this.lawsOptions = data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleRelatedLawsDialogClose() {
      this.relatedRow = null;
      this.showRelatedLawsDialog = false;
    },
    handleRelatedSuccess() {
      this.getCheckPoints();
      this.handleRelatedLawsDialogClose();
    },
    handleRelate(row) {
      this.relatedRow = row;
      this.showRelatedLawsDialog = true;
    },
    isNotPass(review_status) {
      return [REVIEW_STATUS.NOT_PASS, REVIEW_STATUS.DEL_NOT_PASS].includes(
        review_status,
      );
    },
    disabledReview(row) {
      return (
        row.nowData.updated_by_id === this.loginUser.id ||
        ![REVIEW_STATUS.NOT_REVIEWED, REVIEW_STATUS.DEL_NOT_REVIEWED].includes(
          row.nowData.review_status,
        ) ||
        (row.abandoned &&
          row.nowData.review_status !== REVIEW_STATUS.DEL_NOT_REVIEWED)
      );
    },
    disabledEdit(row) {
      return (
        (row.nowData.updated_by_id &&
          row.nowData.updated_by_id !== this.loginUser.id &&
          [REVIEW_STATUS.NOT_REVIEWED, REVIEW_STATUS.DEL_NOT_REVIEWED].includes(
            row.nowData.review_status,
          )) ||
        row.abandoned
      );
    },
    handleGoBack() {
      this.isShowingFullTest = false;
      this.$emit('update-show-full-test', false);
    },
    handleDetailToSave(row) {
      this.editRuleMode = EDIT_RULE_DIALOG_MODE.SAVE;
      this.currentRuleData = {
        ...row.nowData,
        scenarios: row.order.scenarios,
        ruleId: row.rule_id,
        id: row.id,
        is_tempalte: row.order.is_tempalte,
      };
      this.originalRuleData = null; // 编辑模式不需要原始数据对比
      this.editRuleVisible = true;
    },
    handleEditRuleCache(data) {
      this.$refs.fullTestModelRules.updateRowData(
        this.currentRuleData.id,
        data,
      );
      this.handleEditRuleClose();
    },
    handleReviewStatusAllClick() {
      this.popoverConfig.status.visible = false;
      this.filterParams.review_status = [];
      this.handleSearchClick();
    },
    async handleReview(row) {
      try {
        // 设置为审核模式
        this.editRuleMode =
          row.nowData.review_status === REVIEW_STATUS.DEL_NOT_REVIEWED
            ? EDIT_RULE_DIALOG_MODE.DELETE_REVIEW
            : EDIT_RULE_DIALOG_MODE.REVIEW;
        this.currentRuleData = {
          ...row.nowData,
          scenarios: row.order.scenarios,
          ruleId: row.rule_id,
          id: row.id,
          is_tempalte: row.order.is_template,
        };

        // 获取原始数据用于对比
        this.originalRuleData = {
          ...row,
          scenario_ids: row.scenarios.map((item) => item.id),
        };
        this.editRuleVisible = true;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: '获取原始规则数据失败：' + error.message,
          type: 'error',
        });
      }
    },
    handleReviewStatusItemClick(val) {
      this.popoverConfig.reviewStatus.visible = false;
      if (this.filterParams.review_status === val) {
        this.filterParams.review_status = null;
      } else {
        this.filterParams.review_status = val;
      }
      this.handleSearchClick();
    },
    handleConsistencyAllClick() {
      this.popoverConfig.consistency.visible = false;
      this.filterParams.is_consistency = '';
      this.handleSearchClick();
    },
    handleConsistencyItemClick(val) {
      this.popoverConfig.consistency.visible = false;
      if (val === '') {
        this.filterParams.is_consistency = '';
      } else {
        this.filterParams.is_consistency = val;
      }
      this.handleSearchClick();
    },
    isConsistencyCheck(row) {
      // check_method 为 null 表示一致性检查
      return row.nowData.check_method === null;
    },
    getTemplateGroups(row) {
      if (row.nowData.templates && row.nowData.templates.groups) {
        const sortedGroups = [...row.nowData.templates.groups].sort((a, b) => {
          if (a.label === '法规' && b.label === '范文') {
            return -1;
          }
          if (a.label === '范文' && b.label === '法规') {
            return 1;
          }
          return 0;
        });
        return sortedGroups;
      }
      return [];
    },
    formatTableData(data) {
      return data.map((item) => {
        if (item.draft && item.draft.review_status === REVIEW_STATUS.NOT_PASS) {
          item.review_status = REVIEW_STATUS.NOT_PASS;
          item.meta = item.draft.meta;
          item.updated_by_id = item.draft.updated_by_id;
          item.reviewer_id = item.draft.reviewer_id;
          delete item.draft;
        }
        const nowData = item.draft ? item.draft : item;
        const {
          check_method,
          check_type,
          core,
          id,
          name,
          review_status,
          rule_content,
          subject,
          updated_by_id,
          reviewer_id,
          meta,
          scenarios,
          templates,
          rule_id,
        } = nowData;
        return {
          ...item,
          nowData: {
            check_method,
            check_type,
            core,
            id,
            rule_id,
            name,
            review_status,
            rule_content,
            subject,
            updated_by_id,
            reviewer_id,
            meta,
            templates,
            // 如果draft 无scenarios数据，则使用外部scenarios
            scenarios: scenarios.length > 0 ? scenarios : item.scenarios,
            scenario_ids:
              scenarios.length > 0
                ? scenarios.map((item) => item.id)
                : item.scenarios.map((item) => item.id),
          },
        };
      });
    },
    async getCheckPoints(options = { loading: true }) {
      try {
        if (options.loading) {
          this.isLoading = true;
        }
        const { items, total, user_map, all_scenario_ids } =
          await lawsApi.getCheckPoints(this.params);

        this.tableData = this.formatTableData(items);
        this.userMap = user_map;
        this.pager.total = total;
        this.allUseScenarioIds = all_scenario_ids || [];
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
          this.isLoading = false;
        }
      }
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
    handleOpenFullTest() {
      this.isShowingFullTest = true;
      this.$emit('update-show-full-test', true);
    },
    handleSearchClick() {
      this.searchForm.page = 1;
      this.getCheckPoints();
    },
    handleAbandonedFilterChange() {
      // 启用状态筛选变化时重新搜索
      this.searchForm.page = 1;
      this.getCheckPoints();
    },
    handleChangeSize(size) {
      this.searchForm.page = 1;
      this.searchForm.size = size;
      this.getCheckPoints();
    },
    handleChangePage(page) {
      this.searchForm.page = page;
      this.getCheckPoints();
    },
    handleScenarioAllClick() {
      this.popoverConfig.scenario.visible = false;
      this.filterParams.scenario_ids = [];
      this.handleSearchClick();
    },
    handleScenarioItemClick(val) {
      this.popoverConfig.scenario.visible = false;
      const index = this.filterParams.scenario_ids.findIndex(
        (id) => id === val.id,
      );
      if (index !== -1) {
        this.filterParams.scenario_ids.splice(index, 1);
      } else {
        this.filterParams.scenario_ids.push(val.id);
      }
      if (
        this.filterParams.scenario_ids.length === this.lawTypeOptions.length
      ) {
        this.filterParams.scenario_ids = [];
      }
      this.handleSearchClick();
    },
    async handleSwitchChange(row) {
      try {
        await lawsApi.switchCheckPoints(row.id, {
          enable: row.enable,
        });
        this.$notify({
          title: '成功',
          message: row.enable ? '启用成功' : '禁用成功',
          type: 'success',
        });
      } catch (error) {
        row.enable = !row.enable;
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    deleteRule(row) {
      if (this.isDisabledDelete(row)) {
        return;
      }
      this.$confirm(
        `是否删除该规则？${row.abandoned ? '' : '（将进入复核）'}`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      ).then(async () => {
        try {
          if (row.abandoned) {
            await lawsApi.deleteCheckPoint(row.id);
          } else {
            await lawsApi.startDeleteCheckPoint(row.id);
          }
          this.$notify({
            title: '成功',
            message: `${row.abandoned ? '删除成功' : '提交复核成功'}`,
            type: 'success',
          });
          this.handleEditRuleClose();
          this.getCheckPoints({ loading: false });
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      });
    },
    editRule(row) {
      // 设置为编辑模式
      this.editRuleMode = EDIT_RULE_DIALOG_MODE.EDIT;

      this.currentRuleData = {
        ...row.nowData,
        scenarios: row.order.scenarios,
        ruleId: row.rule_id,
        id: row.id,
        is_template: row.order.is_template,
      };
      this.originalRuleData = null; // 编辑模式不需要原始数据对比
      this.editRuleVisible = true;
    },
    lookRule(row) {
      this.editRuleMode = EDIT_RULE_DIALOG_MODE.VIEW;
      this.currentRuleData = {
        ...row.nowData,
        scenarios: row.order.scenarios,
        ruleId: row.rule_id,
        id: row.id,
        is_template: row.order.is_template,
      };
      this.originalRuleData = null;
      this.editRuleVisible = true;
    },
    handleEditRuleClose() {
      this.editRuleVisible = false;
      this.editRuleMode = EDIT_RULE_DIALOG_MODE.EDIT;
      this.currentRuleData = null;
      this.originalRuleData = null;
    },
    async handleEditRuleSubmit(data) {
      this.editRuleLoading = true;
      try {
        // scenario_ids未修改 不用传
        if (
          _.isEqual(
            _.sortBy(this.currentRuleData.scenario_ids),
            _.sortBy(data.scenario_ids),
          )
        ) {
          delete data.scenario_ids;
        }
        await lawsApi.updateCheckPoint(this.currentRuleData.id, data);
        this.$message.success('规则提交成功');
        this.handleEditRuleClose();
        this.getCheckPoints({ loading: false });
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.editRuleLoading = false;
      }
    },
    handleEditRuleApprove() {
      this.$confirm('确认审核通过该规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            this.editRuleLoading = true;
            await lawsApi.reviewCheckPoint(this.currentRuleData.id, {
              review_status: REVIEW_STATUS.PASS,
              review_reason: '',
            });
            this.$message.success('审核通过成功');
            this.handleEditRuleClose();
            this.getCheckPoints({ loading: false });
          } catch (error) {
            this.$notify({
              title: '错误',
              message: error.message,
              type: 'error',
            });
          } finally {
            this.editRuleLoading = false;
          }
        })
        .catch(() => {});
    },

    openPolling() {
      this.stopPolling();

      this.closePolling = polling(
        async () => {
          await this.getCheckPoints({ loading: false });
        },
        30e3,
        { leading: false },
      );
    },

    stopPolling() {
      if (this.closePolling) {
        this.closePolling();
        this.closePolling = null;
      }
    },
    async handleEditRuleReject(reason) {
      try {
        this.editRuleLoading = true;
        await lawsApi.reviewCheckPoint(this.currentRuleData.id, {
          review_status: REVIEW_STATUS.NOT_PASS,
          review_reason: reason,
        });
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
        });
        this.handleEditRuleClose();
        this.getCheckPoints({ loading: false }); // 刷新列表
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.editRuleLoading = false;
      }
    },
    handleEditRuleDelete() {
      this.$confirm('确认删除该规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            this.editRuleLoading = true;
            await lawsApi.reviewCheckPoint(this.currentRuleData.id, {
              review_status: REVIEW_STATUS.PASS,
              review_reason: '',
            });
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
            });
            this.handleEditRuleClose();
            this.getCheckPoints({ loading: false });
          } catch (error) {
            this.$notify({
              title: '错误',
              message: error.message,
              type: 'error',
            });
          } finally {
            this.editRuleLoading = false;
          }
        })
        .catch(() => {});
    },
    handleEditRuleCancleDel() {
      this.$confirm('确认取消删除该规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            this.editRuleLoading = true;
            await lawsApi.reviewCheckPoint(this.currentRuleData.id, {
              review_status: REVIEW_STATUS.DEL_NOT_PASS,
              review_reason: '该条规则删除请求不通过',
            });
            this.$notify({
              title: '成功',
              message: '取消删除成功',
              type: 'success',
            });
            this.handleEditRuleClose();
            this.getCheckPoints({ loading: false });
          } catch (error) {
            this.$notify({
              title: '错误',
              message: error.message,
              type: 'error',
            });
          } finally {
            this.editRuleLoading = false;
          }
        })
        .catch(() => {});
    },
  },

  created() {
    this.getCheckPoints();
    this.getLawsOrders();
    this.getScenarios();
    this.openPolling();
  },

  mounted() {
    if (this.showFullTest) {
      this.isShowingFullTest = true;
    }
  },

  beforeDestroy() {
    this.stopPolling();

    // 循环清理所有 popover 的定时器和事件监听器
    Object.keys(this.popoverConfig).forEach((type) => {
      this.removePopoverMouseListeners(type);
    });
  },
};
</script>
<style lang="scss" scoped>
.custom-rules {
  padding: 25px 20px 0;
  .operater-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    margin-bottom: 25px;
    .search-container {
      display: flex;
    }
    .abandoned-checkbox-group {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    ::v-deep .el-form {
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
        &:last-child {
          margin-left: 10px;
        }
        .el-form-item__content {
          line-height: initial;
        }
        .search-field {
          width: 140px;
          margin-left: 20px;
          .el-input__inner {
            border-right: none;
            border-radius: 4px 0 0 4px;
          }
        }
        .search-input,
        .search-select {
          width: 300px;
          .el-input__inner {
            border-radius: 0 4px 4px 0;
          }
        }
        .search-btn {
          height: 36px;
          padding: 7px 20px;
          vertical-align: middle;
          > span {
            display: flex;
            align-items: center;
            .svg-icon-container {
              margin-right: 5px;
            }
          }
        }
      }
    }
    .operater-list-left {
      display: flex;
      align-items: center;
      .test-icon-wrapper {
        display: flex;
        align-items: center;
        column-gap: 8px;
        .test-icon {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  ::v-deep .rule-list-table {
    .operation {
      display: flex;
      align-items: center;
    }
    .more {
      cursor: pointer;
      margin-left: 10px;
      &.disabled {
        cursor: not-allowed;
        color: #0000007a;
      }
    }
    .option-header {
      cursor: pointer;
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
  .option-container {
    display: flex;
    align-items: center;
    column-gap: 8px;
    &.not-pass {
      color: #b14435;
    }
  }

  // 验证方式列样式
  .verification-method-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .check-type {
      font-weight: bold;
      color: #2f5373;
      font-size: 14px;
      padding: 4px 8px;
      background-color: #f5f7fa;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .check-content {
      flex: 1;

      .consistency-content {
        .template-group-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #e4e7ed;
          &:last-child {
            border-bottom: none;
          }

          .group-label {
            font-weight: bold;
            color: #2f5373;
            font-size: 14px;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
      }

      .non-consistency-content {
        color: #666;
        line-height: 1.4;
        font-size: 13px;
      }
    }
  }
}
</style>
<style lang="scss">
.el-popover {
  &.model-table-column-select-popper {
    padding: 10px 0;
    max-height: 388px;
    overflow-y: auto;
    .option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      padding: 0 20px;
      cursor: pointer;

      &:hover {
        background: #f3f7fc;
        color: $--color-primary;
      }

      .el-icon-check {
        visibility: hidden;
        color: $--color-primary;
      }

      &.is-active {
        background: #f3f7fc;
        color: $--color-primary;
        .el-icon-check {
          visibility: visible;
        }
      }
    }
  }
  &.consistency-filter-popover {
    min-width: 126px;
  }
  &.status-filter-popover {
    min-width: 110px;
  }
}
.review-reason-popper {
  &.el-tooltip__popper {
    max-width: 400px;
    .review-reason-content {
      white-space: pre-line;
      word-wrap: break-word;
      line-height: 1.4;
    }
  }
}
.el-popover.model-rule-column-select-popper {
  min-width: 100px;

  li {
    display: flex;
    align-items: center;
    column-gap: 10px;
    padding: 0 10px;
    line-height: 34px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background-color: #e9eef1;
      color: #2f5373;
    }
    .icon {
      font-size: 20px;
    }
    &.disabled {
      cursor: not-allowed;
      color: #0000007a;
      pointer-events: none;
    }
  }
}
</style>
