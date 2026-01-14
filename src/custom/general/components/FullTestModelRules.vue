<template>
  <div v-loading="isLoading">
    <div class="container">
      <div class="header" :style="headerStyle">
        <el-tooltip content="返回" placement="top">
          <el-button
            @click="handleGoBack"
            type="text"
            :size="buttonSize"
            circle>
            <i class="el-icon-back" style="font-size: 20px"></i>
          </el-button>
        </el-tooltip>
        <span>待测试文档</span>
        <el-select
          :size="selectSize"
          v-model="chatdoc_unique"
          filterable
          placeholder="请选择待测试文档"
          :style="documentSelectStyle">
          <el-option
            v-for="item in documentList"
            :key="item.id"
            :value="item.chatdoc_unique"
            :label="item.name"></el-option>
        </el-select>
        <span>测试依据文档</span>
        <el-select
          v-model="orderIds"
          placeholder="请选择测试依据文档"
          class="law-select"
          multiple
          collapse-tags
          filterable
          :size="selectSize"
          :style="lawSelectStyle"
          popper-class="law-select-popper"
          @change="handleLawChange">
          <el-option
            v-for="item in lawsOptions"
            :key="item.id"
            :value="item.id"
            :label="item.name">
            <tooltip-over :content="item.name" :width="300"></tooltip-over>
          </el-option>
        </el-select>
        <el-tooltip content="开始测试" placement="top">
          <el-button type="primary" :size="buttonSize" @click="handleStartTest">
            <theme-icon name="test-law-white"></theme-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="提交审核" placement="top">
          <el-button
            type="primary"
            :size="buttonSize"
            @click="handleSubmitReview">
            <theme-icon name="review-white"></theme-icon>
          </el-button>
        </el-tooltip>
      </div>

      <div class="search-form">
        <el-select
          v-model="modificationFilter"
          size="medium"
          class="modification-filter"
          @change="handleSearchClick">
          <el-option label="全部" value="all"></el-option>
          <el-option label="已修改" value="modified"></el-option>
          <el-option label="未修改" value="unmodified"></el-option>
        </el-select>
        <el-select
          v-model="localSearchForm.field"
          size="medium"
          class="search-field">
          <el-option
            v-for="(item, index) in searchOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-input
          v-model.trim="localSearchForm.keyword"
          :placeholder="currentSearchOption.placeholder"
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
      :data="tableData"
      border
      :height="tableHeight"
      ref="table"
      class="rule-list-table has-border"
      :row-class-name="getRowClassName"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column
        width="70"
        prop="id"
        label="ID"
        header-align="center"></el-table-column>
      <el-table-column
        min-width="100"
        prop="order.name"
        label="依据文档名称"
        header-align="center"></el-table-column>
      <el-table-column
        min-width="100"
        prop="nowData.name"
        label="规则名称"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.nowData.name }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="160"
        prop="nowData.rule_content"
        label="法规内容"
        header-align="center">
        <template slot-scope="scope">
          <div>
            <tooltip-over
              :content="scope.row.nowData.rule_content"
              :max-lines="4"
              placement="right">
            </tooltip-over>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="160"
        label="核心要求"
        header-align="center"
        prop="nowData.core">
        <template slot-scope="scope">
          <div
            class="core-requirement-wrapper"
            @mouseenter="setHoverState(scope.row.id, true)"
            @mouseleave="setHoverState(scope.row.id, false)">
            <div
              class="core-requirement-content"
              @dblclick="handleCoreRequirementEdit(scope.row)">
              <div class="core-content">
                {{ scope.row.nowData.core }}
              </div>
            </div>
            <theme-icon
              v-show="hoveredRowId === scope.row.id && !isRowWaiting(scope.row)"
              name="edit-law"
              class="core-requirement-edit-icon"
              @click.native="handleCoreRequirementEdit(scope.row)"></theme-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="220" header-align="center" label="验证方式">
        <template slot-scope="scope">
          <div
            class="verification-method-wrapper"
            @mouseenter="setHoverState(scope.row.id, true)"
            @mouseleave="setHoverState(scope.row.id, false)">
            <div
              class="verification-method-content"
              @dblclick="handleVerificationEdit(scope.row)">
              <div class="check-type">
                {{
                  isConsistencyCheck(scope.row) ? '一致性检查' : '非一致性检查'
                }}
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
                    :content="
                      scope.row.nowData.check_method || '请输入验证方式'
                    "
                    :max-lines="4"
                    placement="right">
                  </tooltip-over>
                </div>
              </div>
            </div>
            <theme-icon
              v-show="hoveredRowId === scope.row.id && !isRowWaiting(scope.row)"
              name="edit-law"
              class="verification-edit-icon"
              @click.native="handleVerificationEdit(scope.row)"></theme-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="complianceStatusPopover"
            placement="bottom"
            width="100"
            popper-class="model-rule-column-select-popper"
            trigger="manual"
            v-model="popoverConfig.complianceStatus.visible">
            <div
              @click="handleStatusAllClick"
              class="option-item"
              :class="{
                'is-active': filterStatus.length === 0,
              }">
              <span>全部</span>
              <i class="el-icon-check"></i>
            </div>
            <div
              v-for="(value, key) in ROW_STATUS_MAP"
              :key="value"
              class="option-item"
              :class="{
                'is-active':
                  filterStatus.length < columnStatusNums &&
                  filterStatus.includes(key),
              }"
              @click="handleLawStatusItemClick(key)">
              <span>{{ value }}</span>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleComplianceStatusPopover">
              是否合规<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <el-tooltip
            v-if="
              hasTestResult(scope.row.id) &&
              scope.row.nowData.compliance !== ROW_STATUS.WAITING
            "
            placement="left"
            effect="dark"
            :open-delay="300">
            <div slot="content" class="tooltip-content">
              <!-- 一致性检查模式：使用 reasons 展示 -->
              <template v-if="isConsistencyCheck(scope.row)">
                <div class="judgment-section">
                  <ul
                    class="failure-reason-list"
                    v-if="testResults[scope.row.id].reasons.length > 0">
                    <li
                      v-for="(reason, reasonIndex) in testResults[scope.row.id]
                        .reasons"
                      :key="reasonIndex">
                      <span>{{ reason.reason_text }}</span>
                      <el-button
                        type="text"
                        v-if="reason.diff"
                        @click.stop="openDiffDialog(reason)"
                        >详情</el-button
                      >
                    </li>
                  </ul>
                  <span v-else> 无内容 </span>
                </div>
              </template>
              <template v-else>
                <div v-if="testResults[scope.row.id].judgment_basis">
                  <strong>判断依据：</strong><br />
                  {{ testResults[scope.row.id].judgment_basis }}
                </div>
              </template>

              <div
                v-if="
                  !isConsistencyCheck(scope.row) &&
                  testResults[scope.row.id].suggestion
                "
                class="suggestion-section">
                <strong>建议：</strong><br />
                {{ testResults[scope.row.id].suggestion }}
              </div>
              <div
                v-if="
                  testResults[scope.row.id].contract_rects &&
                  testResults[scope.row.id].contract_rects.length > 0
                "
                class="suggestion-section">
                <strong>提取片段：</strong><br />
                <div
                  v-for="(item, index) in testResults[scope.row.id]
                    .contract_rects"
                  :key="`${index}_contract_rects`">
                  {{ item[0] }}
                </div>
              </div>
            </div>
            <div
              class="compliance-status with-tooltip"
              :class="getComplianceStatusClass(scope.row.nowData.compliance)">
              {{ ROW_STATUS_MAP[scope.row.nowData.compliance] }}
              <i class="el-icon-info info-icon"></i>
            </div>
          </el-tooltip>
          <div
            v-else
            class="compliance-status"
            :class="getComplianceStatusClass(scope.row.nowData.compliance)">
            {{ ROW_STATUS_MAP[scope.row.nowData.compliance] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="操作" header-align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleDetail(scope.row)"
            :disabled="isRowWaiting(scope.row)"
            >详情</el-button
          >
          <el-button type="text" @click="handleRelate(scope.row)"
            >关联法规</el-button
          >
          <el-button
            type="text"
            @click="handleReTest(scope.row)"
            :disabled="isRowWaiting(scope.row)"
            >重新测试</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <related-laws-dialog
      v-if="showRelatedLawsDialog"
      :current-row="relatedRow"
      :laws-options="relateLawsOptions"
      @close="handleRelatedLawsDialogClose"
      @success="handleRelatedSuccess" />

    <!-- 差异对话框 -->
    <show-diff-dialog
      :visible="isShowDiffDialog"
      :diff-text="diffText"
      :base-title="baseTitle"
      :diff-title="diffTitle"
      :law-source="lawSource"
      @close="closeDiffDialog">
    </show-diff-dialog>
  </div>
</template>
<script>
import RelatedLawsDialog from './RelatedLawsDialog.vue';
import TooltipOver from '../components/TooltipOver.vue';
import ThemeIcon from '@/components/ThemeIcon.vue';
import ShowDiffDialog from '@/components/ShowDiffDialog.vue';
import { laws as lawsApi } from '@/store/api';
import _ from 'lodash';
import { REVIEW_STATUS, CHECK_TYPE_MAP } from '@/store/constants';
import { mapGetters } from 'vuex';

const SCREEN_BREAKPOINTS = {
  MEDIUM: 1550,
};

const ROW_STATUS = {
  WAITING: 'WAITING',
  NOT_COMPLIANCE: 'NOT_COMPLIANCE',
  COMPLIANCE: 'COMPLIANCE',
  UNCERTAIN: 'UNCERTAIN',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};
export default {
  name: 'full-test-model-rules',
  components: {
    RelatedLawsDialog,
    TooltipOver,
    ThemeIcon,
    ShowDiffDialog,
  },
  props: {
    lawsOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ROW_STATUS,
      chatdoc_unique: '',
      orderIds: [],
      tableData: [],
      formatTableOriginData: [],
      ROW_STATUS_MAP: {
        [ROW_STATUS.COMPLIANCE]: '合规',
        [ROW_STATUS.NOT_COMPLIANCE]: '不合规',
        [ROW_STATUS.WAITING]: '分析中',
        [ROW_STATUS.NOT_APPLICABLE]: '不适用',
        [ROW_STATUS.UNCERTAIN]: '-',
      },
      filterStatus: [],
      showRelatedLawsDialog: false,
      localSearchForm: {
        field: 'law_name',
        keyword: '',
      },
      modificationFilter: 'all',
      searchOptions: [
        { label: '文档名称', value: 'law_name', placeholder: '请输入文档名称' },
        {
          label: '法规内容',
          value: 'rule_content',
          placeholder: '请输入法规内容',
        },
        { label: '规则名称', value: 'name', placeholder: '请输入规则名称' },
      ],
      isLoading: false,
      documentList: [],
      selectedRows: [], // 存储选中的行
      testResults: {}, // 存储测试结果 {rowId: {judgment_basis, suggestion, compliance}}
      testQueue: [],
      runningTests: new Set(),
      maxConcurrency: 2,
      originalStatusMap: new Map(),
      abortControllers: new Map(),
      firstEditNotifiedRows: new Set(),
      relatedRow: null,
      windowWidth: window.innerWidth, // 响应式窗口宽度
      hoveredRowId: null, // 当前悬停的行ID
      // ShowDiffDialog 相关数据
      isShowDiffDialog: false,
      diffText: [],
      baseTitle: '',
      diffTitle: '',
      lawSource: '',
      popoverConfig: {
        complianceStatus: {
          visible: false,
          timer: null,
          ref: 'complianceStatusPopover',
        },
      },
    };
  },
  computed: {
    ...mapGetters(['loginUser']),
    columnStatusNums() {
      return Object.keys(this.ROW_STATUS_MAP).length;
    },
    currentSearchOption() {
      return (
        this.searchOptions.find(
          (option) => option.value === this.localSearchForm.field,
        ) || this.searchOptions[0]
      );
    },
    relateLawsOptions() {
      return this.lawsOptions.filter((item) => this.orderIds.includes(item.id));
    },
    hasSelectedRows() {
      return this.selectedRows.length > 0;
    },
    testableSelectedRows() {
      return this.selectedRows.filter(
        (row) => row.nowData.compliance !== this.ROW_STATUS.WAITING,
      );
    },
    hasSelectedDocument() {
      return !!this.chatdoc_unique;
    },
    tableHeight() {
      // 根据屏幕宽度动态计算表格高度
      const baseHeight = window.innerHeight;
      const isNarrowScreen = this.windowWidth <= SCREEN_BREAKPOINTS.MEDIUM;

      if (isNarrowScreen) {
        return `${baseHeight - 240}px`;
      } else {
        return `${baseHeight - 142}px`;
      }
    },
    buttonSize() {
      if (this.windowWidth <= SCREEN_BREAKPOINTS.MEDIUM) {
        return 'mini';
      } else {
        return 'medium';
      }
    },
    selectSize() {
      if (this.windowWidth <= SCREEN_BREAKPOINTS.MEDIUM) {
        return 'mini';
      } else {
        return 'small';
      }
    },
    documentSelectStyle() {
      if (this.windowWidth <= SCREEN_BREAKPOINTS.MEDIUM) {
        return { width: '240px' };
      } else {
        return { width: '300px' };
      }
    },
    lawSelectStyle() {
      if (this.windowWidth <= SCREEN_BREAKPOINTS.MEDIUM) {
        return { width: '283px' };
      } else {
        return { width: '300px' };
      }
    },
    headerStyle() {
      if (this.windowWidth <= SCREEN_BREAKPOINTS.MEDIUM) {
        return { 'column-gap': '10px' };
      } else {
        return { 'column-gap': '20px' };
      }
    },
  },
  watch: {
    'popoverConfig.complianceStatus.visible'(newVal) {
      this.handlePopoverVisibilityChange('complianceStatus', newVal);
    },
  },
  created() {
    this.init();
  },

  mounted() {
    this.handleResize = () => {
      this.windowWidth = window.innerWidth;
    };
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    this.resetStatus();
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
  },
  methods: {
    init() {
      this.getCheckPoints();
      this.getDocumentList();
    },
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
    resetStatus() {
      this.abortControllers.forEach((controller, rowId) => {
        try {
          controller.abort();
        } catch (error) {
          console.warn(`取消请求失败 (rowId: ${rowId}):`, error);
        }
      });

      this.testQueue = [];
      this.runningTests.clear();
      this.originalStatusMap.clear();
      this.abortControllers.clear();
      this.firstEditNotifiedRows.clear();
      this.relatedRow = null;
      this.formatTableOriginData = [];
      this.tableData = [];
    },
    async handleRowEditCheck(row) {
      const isCurrentlyEdited = this.hasEditedData(row);

      if (isCurrentlyEdited && !this.firstEditNotifiedRows.has(row.id)) {
        try {
          const data = await lawsApi.getCheckPointInfo(row.id);
          if (
            data.draft &&
            data.draft.review_status === REVIEW_STATUS.NOT_PASS
          ) {
            data.review_status = REVIEW_STATUS.NOT_PASS;
            delete data.draft;
          }
          const { review_status, updated_by_id } = data.draft
            ? data.draft
            : data;
          if (
            ![
              REVIEW_STATUS.NOT_REVIEWED,
              REVIEW_STATUS.DEL_NOT_REVIEWED,
            ].includes(review_status) ||
            !updated_by_id ||
            updated_by_id === this.loginUser.id
          ) {
            return;
          }
          this.$alert(
            '当前审核点正在审核中，请通知审核人员进行审核；审核通过后，本次修改的内容才能再次提交； 注：修改内容不影响本次测试过程；',
            '提示',
            {
              confirmButtonText: '确定',
              customClass: 'first-edit-alert',
            },
          );
          this.firstEditNotifiedRows.add(row.id);
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
        if (this.modificationFilter === 'unmodified') {
          // 如果筛选是未修改，需要更新表格
          this.tableData = this.filterTableData();
        }
      }

      if (!isCurrentlyEdited && this.firstEditNotifiedRows.has(row.id)) {
        this.firstEditNotifiedRows.delete(row.id);
      }
    },
    handleRelatedLawsDialogClose() {
      this.relatedRow = null;
      this.showRelatedLawsDialog = false;
    },
    handleRelatedSuccess() {
      this.handleRelatedLawsDialogClose();
    },
    getRowClassName({ row }) {
      // 检查行是否有任何字段被修改
      const hasChanges = this.hasRowChanges(row);
      return hasChanges ? 'row-changed' : '';
    },

    hasRowChanges(row) {
      // 基础字段检查
      const baseFields = [
        'name',
        'rule_content',
        'core',
        'scenario_ids',
        'subject',
        'check_type',
      ];
      const hasBaseChanges = baseFields.some((fieldName) => {
        if (Array.isArray(row[fieldName])) {
          return !_.isEqual(
            _.sortBy(row[fieldName]),
            _.sortBy(row.nowData[fieldName]),
          );
        }
        return !_.isEqual(row[fieldName], row.nowData[fieldName]);
      });
      if (hasBaseChanges) {
        return true;
      }

      // 验证方式字段检查 - 根据一致性检查类型分别判断
      const isConsistency = this.isConsistencyCheck(row);

      if (isConsistency) {
        // 一致性检查：比较 templates 字段
        const templatesEqual = this.isTemplatesEqual(
          row.templates,
          row.nowData.templates,
        );
        return !templatesEqual;
      } else {
        // 非一致性检查：比较 check_method 字段
        const checkMethodEqual = _.isEqual(
          row.check_method,
          row.nowData.check_method,
        );
        return !checkMethodEqual;
      }
    },
    handleLawChange() {
      this.getCheckPoints();
    },
    async handleSelectionChange(rows) {
      this.selectedRows = rows;
    },

    hasEditedData(row) {
      // 使用统一的变更检查逻辑
      return this.hasRowChanges(row);
    },

    // 比较templates字段，排除排序干扰
    isTemplatesEqual(templates1, templates2) {
      // 如果两者都为null或undefined，认为相等
      if (!templates1 && !templates2) {
        return true;
      }

      // 如果一个为null另一个不为null，认为不相等
      if (!templates1 || !templates2) {
        return false;
      }

      // 如果都没有groups字段，认为相等
      if (!templates1.groups && !templates2.groups) {
        return true;
      }

      // 如果一个有groups另一个没有，认为不相等
      if (!templates1.groups || !templates2.groups) {
        return false;
      }

      // 比较groups数组长度
      if (templates1.groups.length !== templates2.groups.length) {
        return false;
      }

      // 使用查找匹配的方式比较groups，而不是依赖排序
      const isEqual = this.compareGroupsByMatching(
        templates1.groups,
        templates2.groups,
      );

      return isEqual;
    },

    // 通过查找匹配的方式比较groups，解决label重复导致的排序问题
    compareGroupsByMatching(groups1, groups2) {
      // 为每个group1找到在groups2中的匹配项
      const usedIndices = new Set();

      for (let i = 0; i < groups1.length; i++) {
        const group1 = groups1[i];
        let foundMatch = false;

        // 在groups2中查找匹配的group
        for (let j = 0; j < groups2.length; j++) {
          if (usedIndices.has(j)) continue; // 跳过已经匹配的项

          const group2 = groups2[j];
          const isMatch = this.isGroupEqual(group1, group2);

          if (isMatch) {
            usedIndices.add(j);
            foundMatch = true;
            break;
          }
        }

        if (!foundMatch) {
          return false;
        }
      }

      // 检查是否所有group2都被匹配了
      return usedIndices.size === groups2.length;
    },

    // 比较两个group是否相等
    isGroupEqual(group1, group2) {
      // 比较label
      if (group1.label !== group2.label) {
        return false;
      }

      // 比较contents数组长度
      if (group1.contents?.length !== group2.contents?.length) {
        return false;
      }

      // 如果都没有contents，认为相等
      if (!group1.contents && !group2.contents) {
        return true;
      }

      // 对contents进行排序后比较
      const sortedContents1 = this.sortContents(group1.contents || []);
      const sortedContents2 = this.sortContents(group2.contents || []);

      return _.isEqual(sortedContents1, sortedContents2);
    },

    // 对contents进行排序
    sortContents(contents) {
      return contents
        .map((content) => ({
          ...content,
          chapters: content.chapters ? _.sortBy(content.chapters) : [],
        }))
        .sort((a, b) => {
          return (a.content || '').localeCompare(b.content || '');
        });
    },

    // 对template groups进行排序，确保比较的一致性
    sortTemplateGroups(groups) {
      return groups
        .map((group) => ({
          ...group,
          // 对contents数组进行排序
          contents: group.contents
            ? group.contents
                .map((content) => ({
                  ...content,
                  // 对chapters数组进行排序
                  chapters: content.chapters ? _.sortBy(content.chapters) : [],
                }))
                .sort((a, b) => {
                  // 按content内容排序
                  return (a.content || '').localeCompare(b.content || '');
                })
            : [],
        }))
        .sort((a, b) => {
          // 按label排序
          return (a.label || '').localeCompare(b.label || '');
        });
    },

    // 将选中的行移动到顶部并排序
    sortSelectedRowsToTop() {
      if (this.selectedRows.length === 0) {
        return;
      }

      const selectedIds = this.selectedRows.map((row) => row.id);
      const selectedRowsData = this.tableData.filter((row) =>
        selectedIds.includes(row.id),
      );
      const unselectedRowsData = this.tableData.filter(
        (row) => !selectedIds.includes(row.id),
      );

      // 选中的行按ID排序
      selectedRowsData.sort((a, b) => a.id - b.id);

      // 重新组合数据：选中的在前，未选中的在后
      this.tableData = [...selectedRowsData, ...unselectedRowsData];
    },
    async getDocumentList() {
      try {
        const { files } = await lawsApi.getTestFileList();
        this.documentList = files;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    async getCheckPoints(options = { loading: true }) {
      try {
        if (this.orderIds.length === 0) {
          this.resetStatus();
          return;
        }
        if (options.loading) {
          this.isLoading = true;
        }
        const { items } = await lawsApi.getCheckPoints({
          order_ids: this.orderIds,
          abandoned: false,
          size: 1000,
          page: 1,
        });
        const formatTableAllData = this.formatTableData(items);
        const updatedData =
          this.updateTableDataWithTestResults(formatTableAllData);
        this.formatTableOriginData = _.cloneDeep(updatedData);
        this.tableData = this.filterTableData(updatedData);
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
    updateTableDataWithTestResults(tableData) {
      return tableData.map((row) => {
        if (this.testResults[row.id] && this.testResults[row.id].compliance) {
          return {
            ...row,
            nowData: {
              ...row.nowData,
              compliance: this.testResults[row.id].compliance,
            },
          };
        }
        return row;
      });
    },
    filterTableData() {
      let filteredData = [...this.formatTableOriginData];
      filteredData = this.applyModificationFilter(filteredData);
      filteredData = this.applyComplianceStatusFilter(filteredData);
      filteredData = this.applyKeywordFilter(filteredData);
      return filteredData;
    },
    applyModificationFilter(data) {
      if (this.modificationFilter === 'modified') {
        return data.filter((item) => this.hasEditedData(item));
      }
      if (this.modificationFilter === 'unmodified') {
        return data.filter((item) => !this.hasEditedData(item));
      }
      if (this.modificationFilter === 'all') {
        return data;
      }
      return data;
    },
    applyComplianceStatusFilter(data) {
      if (this.filterStatus.length === 0) {
        return data;
      }
      return data.filter((item) =>
        this.filterStatus.includes(item.nowData.compliance),
      );
    },
    applyKeywordFilter(data) {
      if (!this.localSearchForm.keyword) {
        return data;
      }

      const keyword = this.localSearchForm.keyword.toLowerCase();
      const field = this.localSearchForm.field;

      return data.filter((item) => {
        const fieldValue = item.nowData[field];
        return fieldValue && fieldValue.toLowerCase().includes(keyword);
      });
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
        } = nowData;
        const order = item.order;
        return {
          ...item,
          scenario_ids: item.scenarios.map((item) => item.id),
          check_method,
          check_type,
          core,
          name,
          review_status,
          rule_content,
          subject,
          updated_by_id,
          reviewer_id,
          meta,
          scenarios,
          templates,
          nowData: {
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
            templates,
            // 如果draft 无scenarios数据，则使用外部scenarios
            scenarios: scenarios.length > 0 ? scenarios : item.scenarios,
            scenario_ids:
              scenarios.length > 0
                ? scenarios.map((item) => item.id)
                : item.scenarios.map((item) => item.id),
            law_name: order.name,
            compliance: ROW_STATUS.UNCERTAIN,
          },
        };
      });
    },
    async handleSearchClick() {
      this.tableData = this.filterTableData();
      // 筛选后重新应用选中状态和排序
      await this.$nextTick();
      this.sortSelectedRowsToTop();
    },

    handleStatusAllClick() {
      this.filterStatus = [];
      this.handleSearchClick();
    },
    handleLawStatusItemClick(val) {
      const isExist = this.filterStatus.includes(val);
      if (isExist) {
        this.filterStatus = this.filterStatus.filter((item) => {
          return item !== val;
        });
      } else {
        this.filterStatus.push(val);

        if (this.filterStatus.length === this.columnStatusNums) {
          this.filterStatus = [];
        }
      }

      this.handleSearchClick();
    },
    handleGoBack() {
      this.$emit('goBack');
    },
    handleDetail(row) {
      this.$emit('detail', row);
    },
    handleVerificationEdit(row) {
      // 双击验证方式单元格时，触发详情弹窗编辑
      this.$emit('detail', row);
    },
    handleCoreRequirementEdit(row) {
      // 双击核心要求单元格时，触发详情弹窗编辑
      this.$emit('detail', row);
    },
    setHoverState(rowId, isHover) {
      // 设置当前悬停的行ID
      this.hoveredRowId = isHover ? rowId : null;
    },
    handleRelate(row) {
      this.relatedRow = row;
      this.showRelatedLawsDialog = true;
    },
    handleReTest(row) {
      if (!this.hasSelectedDocument) {
        this.showErrorNotification('请先选择待测试文档');
        return;
      }
      if (this.isRowWaiting(row)) {
        this.showWarningNotification('该行正在分析中，请稍候');
        return;
      }
      this.startSingleRowTest(row);
    },
    startSingleRowTest(row) {
      this.originalStatusMap.set(row.id, row.nowData.compliance);
      this.updateRowFieldValue(row.id, 'compliance', this.ROW_STATUS.WAITING);
      this.addToTestQueue([row]);
      this.startConcurrentTesting();
    },

    updateRowData(id, data) {
      this.updateRowSomeData(id, data);
    },
    updateRowSomeData(rowId, data) {
      const originRowIndex = this.formatTableOriginData.findIndex(
        (row) => row.id === rowId,
      );
      const newData = {
        ...this.formatTableOriginData[originRowIndex].nowData,
        ...data,
      };

      if (originRowIndex !== -1) {
        this.$set(
          this.formatTableOriginData[originRowIndex],
          'nowData',
          newData,
        );
      }

      const rowIndex = this.tableData.findIndex((row) => row.id === rowId);

      if (rowIndex !== -1) {
        this.$set(this.tableData[rowIndex], 'nowData', newData);
      }
    },

    /**
     * 开始批量测试
     */
    async handleStartTest() {
      const validation = this.validateTestConditions();
      if (!validation.valid) {
        this.showErrorNotification(validation.message);
        return;
      }

      this.startBatchTest(this.testableSelectedRows);
    },

    /**
     * 开始批量测试
     * @param {Array} rows - 要测试的行数据数组
     */
    startBatchTest(rows) {
      if (rows.length === 0) return;
      rows.forEach((row) => {
        this.originalStatusMap.set(row.id, row.nowData.compliance);
        this.updateRowFieldValue(row.id, 'compliance', this.ROW_STATUS.WAITING);
      });

      this.addToTestQueue(rows);
      this.startConcurrentTesting();
    },
    addToTestQueue(rows) {
      const existingIds = new Set([
        ...this.testQueue.map((row) => row.id),
        ...this.runningTests,
      ]);

      const newRows = rows.filter((row) => !existingIds.has(row.id));
      this.testQueue.push(...newRows);
    },
    startConcurrentTesting() {
      while (
        this.testQueue.length > 0 &&
        this.runningTests.size < this.maxConcurrency
      ) {
        const row = this.testQueue.shift();
        if (row && !this.runningTests.has(row.id)) {
          this.runningTests.add(row.id);
          this.testSingleRowWithQueue(row);
        }
      }
    },

    async testSingleRowWithQueue(row) {
      try {
        await this.testSingleRow(row);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.runningTests.delete(row.id);
        this.startConcurrentTesting();
      }
    },

    async testSingleRow(row) {
      const originalStatus = this.originalStatusMap.get(row.id);
      const abortController = new AbortController();
      this.abortControllers.set(row.id, abortController);

      try {
        this.updateRowFieldValue(row.id, 'compliance', this.ROW_STATUS.WAITING);
        const {
          rule_content,
          name,
          subject,
          check_type,
          core,
          check_method,
          templates,
        } = row.nowData;
        const requestData = {
          rule_content,
          name,
          subject,
          check_type,
          core,
          check_method,
          templates: check_method ? null : templates,
          chatdoc_unique: this.chatdoc_unique,
        };

        const response = await lawsApi.contractAnalysisByCheckPoint(
          row.nowData.id,
          requestData,
          { signal: abortController.signal },
        );
        if (response) {
          let complianceStatus;

          // 判断是否为一致性检查
          const isConsistency = this.isConsistencyCheck(row);

          if (isConsistency) {
            // 一致性检查：使用 is_compliance 字段
            if (response.is_compliance !== undefined) {
              complianceStatus = response.is_compliance
                ? ROW_STATUS.COMPLIANCE
                : ROW_STATUS.NOT_COMPLIANCE;
            } else {
              complianceStatus = ROW_STATUS.UNCERTAIN;
            }
          } else {
            // 非一致性检查：使用 compliance_status 字段
            if (response.compliance_status) {
              complianceStatus = Object.keys(this.ROW_STATUS_MAP).find(
                (key) =>
                  this.ROW_STATUS_MAP[key] === response.compliance_status,
              );
              complianceStatus = complianceStatus || ROW_STATUS.NOT_APPLICABLE;
            } else {
              complianceStatus = ROW_STATUS.UNCERTAIN;
            }
          }

          this.updateRowFieldValue(row.id, 'compliance', complianceStatus);

          this.$set(this.testResults, row.id, {
            contract_rects: response.contract_rects || [],
            judgment_basis: response.judgment_basis || '',
            suggestion: response.suggestion || '',
            compliance: complianceStatus,
            // 一致性检查特有字段
            reasons: response.reasons || [],
            user_reason: response.user_reason || '',
            is_compliance: response.is_compliance,
          });
        } else {
          this.updateRowFieldValue(row.id, 'compliance', ROW_STATUS.UNCERTAIN);
          this.$set(this.testResults, row.id, {
            judgment_basis: '',
            suggestion: '',
            compliance: ROW_STATUS.UNCERTAIN,
          });
        }
        this.originalStatusMap.delete(row.id);
        this.abortControllers.delete(row.id);
      } catch (error) {
        this.updateRowFieldValue(row.id, 'compliance', originalStatus);
        this.originalStatusMap.delete(row.id);
        this.abortControllers.delete(row.id);

        this.$notify({
          title: '测试失败',
          message: `ID ${row.id} 测试失败: ${error.message}`,
          type: 'error',
        });
        console.error(`测试行 ${row.id} 失败:`, error);
      }
    },

    // 更新行的合规状态
    updateRowFieldValue(rowId, field, newStatus) {
      const rowIndex = this.tableData.findIndex((row) => row.id === rowId);
      if (rowIndex !== -1) {
        this.$set(this.tableData[rowIndex].nowData, field, newStatus);
      }

      // 同时更新原始数据
      const originRowIndex = this.formatTableOriginData.findIndex(
        (row) => row.id === rowId,
      );
      if (originRowIndex !== -1) {
        this.$set(
          this.formatTableOriginData[originRowIndex].nowData,
          field,
          newStatus,
        );
      }
    },
    hasTestResult(rowId) {
      return rowId in this.testResults;
    },
    getComplianceStatusClass(compliance) {
      return {
        'compliance-success': compliance === this.ROW_STATUS.COMPLIANCE,
        'compliance-error': compliance === this.ROW_STATUS.NOT_COMPLIANCE,
      };
    },
    isRowWaiting(row) {
      return row.nowData.compliance === this.ROW_STATUS.WAITING;
    },
    validateTestConditions() {
      if (!this.hasSelectedDocument) {
        return { valid: false, message: '请先选择待测试文档' };
      }
      if (this.orderIds.length === 0) {
        return { valid: false, message: '请选择测试依据文档' };
      }
      if (!this.hasSelectedRows) {
        return { valid: false, message: '请至少勾选一行数据' };
      }
      if (this.testableSelectedRows.length === 0) {
        return { valid: false, message: '所选行均在分析中，请稍候' };
      }
      return { valid: true, message: '' };
    },
    showErrorNotification(message) {
      this.$notify({
        title: '错误',
        message,
        type: 'error',
      });
    },
    showWarningNotification(message) {
      this.$notify({
        title: '提示',
        message,
        type: 'warning',
      });
    },
    showSuccessNotification(message) {
      this.$notify({
        title: '成功',
        message,
        type: 'success',
      });
    },

    // 提交审核
    async handleSubmitReview() {
      const editedRows = this.formatTableOriginData.filter((row) =>
        this.hasEditedData(row),
      );

      if (editedRows.length === 0) {
        this.$notify({
          title: '提示',
          message: '未检测到任何内容的调整，无须提交审核',
          type: 'warning',
        });
        return;
      }
      this.submitEditedData(editedRows);
    },
    getCheckTypeName(check_type) {
      const type = CHECK_TYPE_MAP.find((item) => item.value === check_type);
      return type ? type.label : '';
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

    /**
     * 打开差异对话框
     * @param {Object} reason - 包含差异信息的原因对象
     */
    openDiffDialog(reason) {
      this.isShowDiffDialog = true;
      this.diffText = reason.diff;
      this.baseTitle = reason.template.content_title;
      this.diffTitle = '当前合同';
      this.lawSource = reason.source;
    },

    /**
     * 关闭差异对话框
     */
    closeDiffDialog() {
      this.isShowDiffDialog = false;
    },

    // 提交已编辑的数据
    async submitEditedData(editedRows) {
      try {
        this.isLoading = true;
        // 构建提交数据
        const submitData = editedRows.map((row) => {
          const data = {
            id: row.id,
            core: row.nowData.core,
            rule_content: row.nowData.rule_content,
            name: row.nowData.name,
            subject: row.nowData.subject,
            check_type: row.nowData.check_type,
          };

          // 根据验证方式类型传递不同的字段
          const isConsistency = this.isConsistencyCheck(row);
          if (isConsistency) {
            // 一致性检查：传递 templates 字段，check_method 设为 null
            data.check_method = null;
            data.templates = row.nowData.templates;
          } else {
            // 非一致性检查：传递 check_method 字段，templates 设为 null
            data.check_method = row.nowData.check_method;
            data.templates = null;
          }

          if (
            !_.isEqual(
              _.sortBy(row.nowData.scenario_ids),
              _.sortBy(row.scenario_ids),
            )
          ) {
            data.scenario_ids = row.nowData.scenario_ids;
          }
          return data;
        });

        const { conflict_ids } = await lawsApi.updateCheckPoints({
          check_points: submitData,
        });
        if (conflict_ids.length > 0) {
          this.$alert(
            `检测到共有${conflict_ids.length}个审核点当前正在审核中，无法再次提交，请确认；点击复制，可粘贴到Excel中查看不能提交审核的审核点。`,
            '提示',
            {
              confirmButtonText: '复制',
              customClass: 'first-edit-alert',
              callback: () => {
                const header = [
                  'ID',
                  '依据文档名称',
                  '规则名称',
                  '法规内容',
                  '应用场景',
                  '核心要求',
                  '验证方式',
                  '行为主体',
                  '审核点类型',
                ];
                // 获取冲突行数据
                const rows = conflict_ids.map((id) => {
                  const row = this.formatTableOriginData.find(
                    (r) => r.id === id,
                  );
                  if (!row) return [];
                  return [
                    row.id,
                    row.nowData.law_name || '',
                    row.nowData.name || '',
                    row.nowData.rule_content || '',
                    row.order.scenarios
                      .filter((item) =>
                        row.nowData.scenario_ids.includes(item.id),
                      )
                      .map((item) => item.name)
                      .join('、'),
                    row.nowData.core || '',
                    row.nowData.check_method || '',
                    row.nowData.subject || '',
                    this.getCheckTypeName(row.nowData.check_type),
                  ];
                });
                // 组装为TSV格式（Excel可粘贴）
                const tsv = [header, ...rows]
                  .map((arr) => arr.join('\t'))
                  .join('\n');
                // 复制到剪贴板
                if (navigator.clipboard) {
                  navigator.clipboard
                    .writeText(tsv)
                    .then(() => {
                      this.$notify({
                        title: '复制成功',
                        message: '已复制冲突审核点数据，可粘贴到Excel查看',
                        type: 'success',
                      });
                    })
                    .catch(() => {
                      this.$notify({
                        title: '错误',
                        message: '复制失败',
                        type: 'error',
                      });
                    });
                } else {
                  // 兼容旧浏览器
                  const textarea = document.createElement('textarea');
                  textarea.value = tsv;
                  document.body.appendChild(textarea);
                  textarea.select();
                  try {
                    document.execCommand('copy');
                    this.$notify({
                      title: '复制成功',
                      message: '已复制冲突审核点数据，可粘贴到Excel查看',
                      type: 'success',
                    });
                  } catch (err) {
                    this.$notify({
                      title: '错误',
                      message: '复制失败',
                      type: 'error',
                    });
                  }
                  document.body.removeChild(textarea);
                }
              },
            },
          );
        } else {
          this.$notify({
            title: '成功',
            message: '提交审核成功',
            type: 'success',
          });
          // 刷新列表数据，显示loading状态
          await this.getCheckPoints({ loading: true });
          this.$refs.table.clearSelection();
          this.selectedRows = [];
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

    toggleComplianceStatusPopover() {
      this.togglePopover('complianceStatus');
    },

    togglePopover(type) {
      this.popoverConfig[type].visible = !this.popoverConfig[type].visible;
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

        // 清除事件处理器引用
        delete this.popoverConfig[type].enterHandler;
        delete this.popoverConfig[type].leaveHandler;
      }
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
  },
};
</script>
<style lang="scss" scoped>
// 断点常量（SCSS）与 CSS 变量，保持与 JS SCREEN_BREAKPOINTS 一致
$bp-mini: 1024px;
$bp-small: 1366px;
$bp-medium: 1500px;
:root {
  --bp-mini: 1024px;
  --bp-small: 1366px;
  --bp-medium: 1500px;
}

.container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .search-form {
    display: flex;
    align-items: center;
    gap: 10px;

    .modification-filter {
      width: 80px;
    }
    .search-field {
      width: 110px;
    }
    .search-input {
      width: 200px;
    }
  }
}
.header {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  min-height: 36px;

  .el-button {
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon-back {
      font-size: 16px;
    }

    .theme-icon {
      width: 16px;
      height: 16px;
    }

    &.el-button--medium {
      width: 36px;
      height: 36px;
    }

    &.el-button--small {
      width: 32px;
      height: 32px;

      .el-icon-back {
        font-size: 14px;
      }

      .theme-icon {
        width: 14px;
        height: 14px;
      }
    }

    &.el-button--mini {
      width: 28px;
      height: 28px;

      .el-icon-back {
        font-size: 12px;
      }

      .theme-icon {
        width: 12px;
        height: 12px;
      }
    }
    & + .el-button {
      margin: 0;
    }
  }

  @media (max-width: var(--bp-medium)) {
    column-gap: 12px;
    margin: 0 12px 12px;
  }
}
.law-select {
  ::v-deep .el-tag {
    max-width: 210px;
  }
}

// 表格行选中时的样式
::v-deep .el-table__row.current-row {
  background-color: #f0f9ff;
}

.compliance-status {
  display: inline-flex;
  align-items: center;

  &.with-tooltip {
    cursor: pointer;

    .info-icon {
      margin-left: 4px;
      font-size: 12px;
    }
  }

  .compliance-icon {
    margin-right: 4px;
    font-size: 14px;
  }

  &.compliance-success {
    color: #67c23a;
    font-weight: 500;
  }

  &.compliance-error {
    color: #f56c6c;
    font-weight: 500;
  }
}

.tooltip-content {
  line-height: 1.5;
  max-height: 600px;
  overflow-y: auto;
  .suggestion-section {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    white-space: pre-line;
  }

  .judgment-section {
    margin-bottom: 8px;
  }

  .failure-reason-list {
    margin: 5px 0 0 0;
    padding: 0;

    li {
      list-style: none;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-all;
      margin-bottom: 5px;
      color: #fff;

      .el-button--text {
        padding: 0;
        margin-left: 5px;
        font-weight: normal;
        font-size: 13px;
        color: #409eff;
      }
    }
  }

  strong {
    color: #fff;
  }
}

// 数据变更行样式 - 从ID列到验证方式列的边框覆盖
::v-deep .row-changed {
  position: relative;

  // 为ID列到验证方式列添加边框
  .el-table__cell:nth-child(2), // ID列
  .el-table__cell:nth-child(3), // 依据文档名称列
  .el-table__cell:nth-child(4), // 规则名称列
  .el-table__cell:nth-child(5), // 法规内容列
  .el-table__cell:nth-child(6), // 核心要求列
  .el-table__cell:nth-child(7)  // 验证方式列
  {
    background-color: rgba(64, 158, 255, 0.05);
    border-top: 2px solid #409eff !important;
    border-bottom: 2px solid #409eff !important;

    // 第一个单元格（ID列）添加左边框
    &:nth-child(2) {
      border-left: 2px solid #409eff !important;
    }

    // 最后一个单元格（验证方式列）添加右边框
    &:nth-child(7) {
      border-right: 2px solid #409eff !important;
    }
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
  }
}
</style>
<style lang="scss">
.el-popover.model-rule-column-select-popper {
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
.first-edit-alert {
  .el-message-box__btns {
    text-align: center;
  }
}
.law-select-popper {
  .el-select-dropdown__item {
    .over-flow {
      line-height: 34px;
    }
  }
}

// 验证方式列可编辑样式
.verification-method-wrapper {
  position: relative;

  .verification-method-content {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }
  }

  .verification-edit-icon {
    position: absolute;
    bottom: 0px;
    right: 0px;
    cursor: pointer;
    z-index: 10;
  }
}

// 核心要求列可编辑样式
.core-requirement-wrapper {
  position: relative;

  .core-requirement-content {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    .core-content {
      min-height: 20px;
      line-height: 1.4;
      color: #606266;
      font-size: 14px;
      word-break: break-word;
    }
  }

  .core-requirement-edit-icon {
    position: absolute;
    bottom: 0px;
    right: 0px;
    cursor: pointer;
    z-index: 10;
  }
}
</style>
