<template>
  <div class="laws-page">
    <div class="page-header tool-bar">
      <el-button size="medium" type="primary" @click="openAddLawDialog">
        <i class="fa fa-plus fa-fw"></i>
        新增文档
      </el-button>
      <el-button size="medium" type="primary" @click="openLawTypeDialog">
        <i class="fa fa-plus fa-fw"></i>
        应用场景
      </el-button>
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-select
            v-model="searchForm.field"
            size="medium"
            class="search-field"
            @change="handleSearchFieldChange">
            <el-option
              v-for="(item, index) in searchOptions"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-input
            ref="inputRef"
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
    <el-table
      ref="tableRef"
      :data="lawList"
      v-loading="isLoading"
      height="calc(100vh - 217px)">
      <el-table-column width="100" prop="rank" label="ID"></el-table-column>
      <el-table-column prop="doc_type" align="center" width="120">
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="docTypePopover"
            placement="bottom"
            width="86"
            popper-class="table-column-multiple-select-popper document-type"
            trigger="manual"
            v-model="popoverConfig.docType.visible">
            <div
              @click="handleDocTypeAllClick"
              class="option-item"
              :class="{
                'is-active': filterParams.doc_types.length === 0,
              }">
              <span>全部</span>
              <i class="el-icon-check"></i>
            </div>
            <div
              v-for="item in docTypeOptions"
              :key="item.key"
              class="option-item"
              :class="{
                'is-active':
                  filterParams.doc_types.includes(item.key) &&
                  filterParams.doc_types.length < docTypeOptions.length,
              }"
              @click="handleDocTypeItemClick(item.key)">
              <span>{{ item.value }}</span>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleDocTypePopover">
              文档类型<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.is_template ? '范本' : '法规' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="law_type" align="center" min-width="100">
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="lawTypePopover"
            placement="bottom"
            width="160"
            popper-class="table-column-multiple-select-popper"
            trigger="manual"
            v-model="popoverConfig.lawType.visible">
            <div
              @click="handleLawTypeAllClick"
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
              @click="handleLawTypeItemClick(item)">
              <tooltip-over :content="item.name"></tooltip-over>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleLawTypePopover">
              应用场景<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <div>
            <tooltip-over
              :content="scope.row.scenariosText"
              justify-content="center"
              :placement="'top'"></tooltip-over>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文档名称" min-width="300">
        <template slot-scope="scope">
          <div class="law-name">
            <span>{{ scope.row.name }}</span>
            <el-tooltip
              :disabled="scope.row.refresh_status !== LAW_REFRESH_STATUS.FAILED"
              effect="dark"
              :content="scope.row.refresh_msg"
              placement="top">
              <el-tag
                v-show="scope.row.refresh_status !== LAW_REFRESH_STATUS.INIT"
                style="margin-left: 10px"
                size="mini"
                :type="refreshStatusMap[scope.row.refresh_status]">
                {{ LAW_REFRESH_STATUS_MAP[scope.row.refresh_status] }}
              </el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="origin" align="center" width="200px">
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="lawOriginPopover"
            placement="bottom"
            width="126"
            popper-class="table-column-multiple-select-popper law-origin"
            trigger="manual"
            v-model="popoverConfig.lawOrigin.visible">
            <div
              @click="handleLawOriginAllClick"
              class="option-item"
              :class="{
                'is-active': filterParams.origins.length === 0,
              }">
              <span>全部</span>
              <i class="el-icon-check"></i>
            </div>
            <div
              v-for="item in lawOriginOptions"
              :key="item.key"
              class="option-item"
              :class="{
                'is-active':
                  filterParams.origins.includes(item.key) &&
                  filterParams.origins.length < lawOriginOptions.length,
              }"
              @click="handleLawOriginItemClick(item.key)">
              <span>{{ item.value }}</span>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleLawOriginPopover">
              来源<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <div>
            {{
              scope.row.currentLaw.chatdoc_unique ? '本地法规库' : '人工上传'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" width="200px">
        <template slot="header" slot-scope="{}">
          <el-popover
            ref="lawStatusPopover"
            placement="bottom"
            width="168"
            popper-class="table-column-multiple-select-popper"
            trigger="manual"
            v-model="popoverConfig.lawStatus.visible">
            <div
              @click="handleLawStatusAllClick"
              class="option-item"
              :class="{
                'is-active': filterParams.status.length === 0,
              }">
              <span>全部</span>
              <i class="el-icon-check"></i>
            </div>
            <div
              v-for="(value, key) in LAW_STATUS_MAP"
              :key="value"
              class="option-item"
              :class="{
                'is-active':
                  filterParams.status.includes(key) &&
                  filterParams.status.length < lwaStatusNums,
              }"
              @click="handleLawStatusItemClick(key)">
              <span>{{ value }}</span>
              <i class="el-icon-check"></i>
            </div>
            <span
              slot="reference"
              class="option-header"
              @mouseenter="toggleLawStatusPopover">
              状态<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <div>{{ LAW_STATUS_MAP[scope.row.currentLaw.status] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改文档" placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
              size="small"
              circle
              :disbaled="disabledEdit(scope.row.currentLaw.status)"
              @click.native.stop="editLaw(scope.row)">
              <theme-icon
                :name="
                  disabledEdit(scope.row.currentLaw.status)
                    ? 'edit-grey-law'
                    : 'edit-law'
                "
                icon-class="el-icon-edit"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看文档明细" placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'warning' : 'text'"
              size="small"
              :disabled="disabledCheck(scope.row.currentLaw.status)"
              @click.stop="viewLaw(scope.row)"
              circle>
              <theme-icon
                :name="
                  disabledCheck(scope.row.currentLaw.status)
                    ? 'check-grey-law'
                    : 'check-law'
                "
                icon-class="el-icon-document"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="重新获取/解析文档" placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'success' : 'text'"
              size="small"
              circle
              :disabled="disabledReparse(scope.row.currentLaw.status)"
              @click.native.stop="reparseLaw(scope.row)">
              <theme-icon
                :name="
                  disabledReparse(scope.row.currentLaw.status)
                    ? 'reload-grey-law'
                    : 'reload-law'
                "
                icon-class="el-icon-refresh"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="更新文档" placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'success' : 'text'"
              size="small"
              circle
              :disabled="
                disabledUpdate(
                  scope.row.currentLaw.status,
                  scope.row.refresh_status,
                )
              "
              @click.native.stop="updateLaw(scope.row)">
              <theme-icon
                :name="
                  disabledUpdate(
                    scope.row.currentLaw.status,
                    scope.row.refresh_status,
                  )
                    ? 'update-grey-law'
                    : 'update-law'
                "
                icon-class="el-icon-refresh"></theme-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip effect="dark" content="删除文档" placement="top">
            <el-button
              :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
              size="small"
              circle
              :disbaled="disabledDelete(scope.row.currentLaw.status)"
              @click.native.stop="deleteLaw(scope.row)">
              <theme-icon
                :name="
                  disabledDelete(scope.row.currentLaw.status)
                    ? 'delete-grey-law'
                    : 'delete-law'
                "
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pager.total > 0"
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="searchForm.page"
      :page-size="searchForm.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
    <law-type
      v-if="showLawTypeDialog"
      ref="lawTypeDialog"
      :typeOptions="lawTypeOptions"
      @close="showLawTypeDialog = false"
      @delete="handleDeleteScenarios"
      @add="handleAddScenarios"></law-type>
    <add-law-dialog
      ref="addLawDialog"
      v-if="showAddLawDialog"
      :typeOptions="lawTypeOptions"
      :current-law="updatingLaw"
      @close="handleCloseAddLawDialog"
      @confirm="handleAddLawConfirm"></add-law-dialog>
    <edit-law-dialog
      v-if="showEditLawDialog"
      :typeOptions="lawTypeOptions"
      :defaultForm="editingLaw"
      @close="showEditLawDialog = false"
      @confirm="handleEditLawConfirm"></edit-law-dialog>
  </div>
</template>

<script>
import AddLawDialog from '../components/AddLawDialog.vue';
import EditLawDialog from '../components/EditLawDialog.vue';
import LawType from '../components/LawType.vue';
import TooltipOver from '../components/TooltipOver.vue';
import { laws as lawsApi } from '@/store/api';
import {
  updateSearchParams,
  fillSearchParamsFromURL,
  storeSearchParamsToSession,
  getSearchParamsFromSession,
  removeSearchParamsFromSession,
} from '@/utils/tableSearchUtils';
import {
  LAW_SESSION_KEY,
  LAW_STATUS,
  LAW_STATUS_MAP,
  LAW_ERROR_STATUS,
  LAW_REFRESH_STATUS,
  LAW_REFRESH_STATUS_MAP,
} from '@/store/constants';
import { polling } from '@/utils';

export default {
  components: { LawType, AddLawDialog, EditLawDialog, TooltipOver },
  name: 'laws-page',
  data() {
    return {
      LAW_STATUS,
      LAW_STATUS_MAP,
      LAW_ERROR_STATUS,
      LAW_REFRESH_STATUS,
      LAW_REFRESH_STATUS_MAP,
      searchForm: {
        field: 'name',
        keyword: '',
        page: 1,
        size: 10,
      },
      filterParams: {
        scenario_ids: [],
        origins: [],
        status: [],
        doc_types: [],
      },
      searchOptions: [
        { label: '文档名称', value: 'name', placeholder: '请输入文档名称' },
        { label: '文档ID', value: 'rank', placeholder: '请输入文档ID' },
      ],
      lawOriginOptions: [
        {
          key: 'local',
          value: '本地法规库',
        },
        {
          key: 'upload',
          value: '人工上传',
        },
      ],
      docTypeOptions: [
        {
          key: 'template',
          value: '范本',
        },
        {
          key: 'law',
          value: '法规',
        },
      ],
      lawStatusOptions: [
        '排队中',
        '解析中',
        '解析失败',
        '获取中',
        '获取失败',
        '解析完成',
        '拆分中',
        '拆分失败',
        '拆分完成',
      ],
      lawList: [],
      pager: {
        total: 0,
      },
      showAddLawDialog: false,
      showLawTypeDialog: false,
      showEditLawDialog: false,
      editingLaw: null,
      updatingLaw: null,
      closePolling: null,
      isLoading: false,
      refreshStatusMap: {
        [LAW_REFRESH_STATUS.SUCCESS]: 'success',
        [LAW_REFRESH_STATUS.FAILED]: 'danger',
        [LAW_REFRESH_STATUS.REFRESHING]: 'warning',
      },
      // popover 统一配置对象
      popoverConfig: {
        docType: {
          visible: false,
          timer: null,
          ref: 'docTypePopover',
        },
        lawType: {
          visible: false,
          timer: null,
          ref: 'lawTypePopover',
        },
        lawOrigin: {
          visible: false,
          timer: null,
          ref: 'lawOriginPopover',
        },
        lawStatus: {
          visible: false,
          timer: null,
          ref: 'lawStatusPopover',
        },
      },
      pageScenarioIds: [],
    };
  },

  watch: {
    'popoverConfig.docType.visible'(visible) {
      this.handlePopoverVisibilityChange('docType', visible);
    },
    'popoverConfig.lawType.visible'(visible) {
      this.handlePopoverVisibilityChange('lawType', visible);
    },
    'popoverConfig.lawOrigin.visible'(visible) {
      this.handlePopoverVisibilityChange('lawOrigin', visible);
    },
    'popoverConfig.lawStatus.visible'(visible) {
      this.handlePopoverVisibilityChange('lawStatus', visible);
    },
  },

  computed: {
    lawTypeOptions() {
      return this.$store.getters['scenariosModule/scenarioItems'];
    },
    filterLawTypeOptions() {
      return this.lawTypeOptions.filter((item) =>
        this.pageScenarioIds.includes(item.id),
      );
    },
    currentSearchOption() {
      return this.searchOptions.find(
        (option) => option.value === this.searchForm.field,
      );
    },
    lwaStatusNums() {
      return Object.keys(LAW_STATUS_MAP).length;
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
      if (this.filterParams.origins.length === 1) {
        params.from_chatdoc = this.filterParams.origins[0] === 'local';
      }
      if (
        this.filterParams.status.length &&
        this.filterParams.status.length !== this.lwaStatusNums
      ) {
        params.status = this.filterParams.status;
      }
      if (this.filterParams.doc_types.length === 1) {
        params.is_template = this.filterParams.doc_types[0] === 'template';
      }
      return params;
    },
  },

  methods: {
    handleRouteEnter(fromRoute) {
      if (fromRoute.name !== 'lawRules') {
        removeSearchParamsFromSession();
      } else {
        getSearchParamsFromSession(this.filterParams);
      }
      this.init();
    },

    init() {
      fillSearchParamsFromURL(this, this.searchForm);

      this.getLaws();
      this.getScenarios();
    },
    handleCloseAddLawDialog() {
      this.showAddLawDialog = false;
      this.updatingLaw = null;
    },
    disabledEdit(status) {
      return status === LAW_STATUS.FETCHING;
    },
    disabledCheck(status) {
      return status !== LAW_STATUS.SPLIT;
    },
    disabledReparse(status) {
      return ![...LAW_ERROR_STATUS, LAW_STATUS.SPLIT].includes(status);
    },

    disabledUpdate(status, refresh_status) {
      return (
        ![
          LAW_STATUS.FETCH_FAIL,
          LAW_STATUS.PARSE_FAIL,
          LAW_STATUS.SPLIT,
        ].includes(status) ||
        [LAW_REFRESH_STATUS.REFRESHING, LAW_REFRESH_STATUS.SUCCESS].includes(
          refresh_status,
        )
      );
    },
    disabledDelete(status) {
      return status === LAW_STATUS.FETCHING;
    },
    stopPolling() {
      if (this.closePolling) {
        this.closePolling();
        this.closePolling = null;
      }
    },
    openPolling() {
      this.stopPolling();

      this.closePolling = polling(
        async () => {
          if (this.needFreshLaws()) {
            await this.getLaws({ loading: false });
          } else {
            this.stopPolling();
          }
        },
        5e3,
        { leading: false },
      );
    },
    needFreshLaws() {
      return this.lawList.some(
        (law) =>
          ![
            LAW_STATUS.SPLIT,
            LAW_STATUS.PARSE_FAIL,
            LAW_STATUS.FETCH_FAIL,
            LAW_STATUS.SPLIT_FAIL,
          ].includes(law.currentLaw.status) ||
          law.refresh_status === LAW_REFRESH_STATUS.REFRESHING,
      );
    },
    viewLaw(row) {
      window.sessionStorage.setItem(
        LAW_SESSION_KEY,
        JSON.stringify(this.searchForm),
      );

      this.$router.push({
        name: 'lawRules',
        params: {
          rankId: row.rank,
        },
      });
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
    async getLaws(options = { loading: true }) {
      try {
        if (options.loading) {
          this.isLoading = true;
        }
        const {
          items: lawList,
          total,
          scenario_ids,
        } = await lawsApi.getLaws(this.params);
        this.pageScenarioIds = scenario_ids || [];
        this.lawList = lawList.map((law) => {
          const currentLaws = law.laws.filter((item) => item.is_current);
          let currentLaw = { ...currentLaws[0] };
          // 需求：当 currentLaws 长度 > 1（正文 + 附件等并存）时：
          // 1) 默认取 currentLaws[0] 作为基础数据；
          // 2) 状态合并：
          //    - 只有所有项均为 SPLIT(已完成) 时，展示为 SPLIT；
          //    - 否则展示所有项里“进度最慢”的状态（按 LAW_STATUS 数值从小到大比较；失败态为负值，自然更靠前）。

          if (currentLaws.length > 1) {
            const statuses = currentLaws.map((i) => i.status);
            const allCompleted = statuses.every((s) => s === LAW_STATUS.SPLIT);
            const someErrorStatus = statuses.find((s) =>
              [
                LAW_STATUS.PARSE_FAIL,
                LAW_STATUS.FETCH_FAIL,
                LAW_STATUS.SPLIT_FAIL,
              ].includes(s),
            );
            if (allCompleted) {
              currentLaw.status = LAW_STATUS.SPLIT;
            } else if (someErrorStatus) {
              currentLaw.status = someErrorStatus;
            } else {
              currentLaw.status = statuses.reduce(
                (min, s) => (s < min ? s : min),
                statuses[0],
              );
            }
          }

          const row = {
            ...law,
            currentLaw,
          };
          row.scenariosText = law.scenarios.map((item) => item.name).join('、');
          return row;
        });
        this.pager.total = total;
        updateSearchParams(this, this.searchForm);
        storeSearchParamsToSession(this.filterParams);
        this.openPolling();

        if (options.loading && this.$refs.tableRef) {
          this.$refs.tableRef.bodyWrapper.scrollTop = 0;
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    openAddLawDialog() {
      this.showAddLawDialog = true;
    },
    openLawTypeDialog() {
      this.showLawTypeDialog = true;
    },
    handleSearchFieldChange() {
      this.searchForm.keyword = '';
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    handleSearchClick() {
      this.searchForm.page = 1;
      this.getLaws();
    },
    handleLawTypeItemClick(val) {
      const isExist = this.filterParams.scenario_ids.find(
        (id) => id === val.id,
      );
      if (isExist) {
        this.filterParams.scenario_ids = this.filterParams.scenario_ids.filter(
          (id) => {
            return id !== val.id;
          },
        );
      } else {
        this.filterParams.scenario_ids.push(val.id);
        if (
          this.filterParams.scenario_ids.length === this.lawTypeOptions.length
        ) {
          this.filterParams.scenario_ids = [];
        }
      }
      this.handleSearchClick();
    },
    handleLawTypeAllClick() {
      this.filterParams.scenario_ids = [];
      this.handleSearchClick();
    },
    handleLawOriginItemClick(val) {
      const isExist = this.filterParams.origins.includes(val);
      if (isExist) {
        this.filterParams.origins = this.filterParams.origins.filter((item) => {
          return item !== val;
        });
      } else {
        this.filterParams.origins.push(val);
        if (this.filterParams.origins.length === this.lawOriginOptions.length) {
          this.filterParams.origins = [];
        }
      }
      this.handleSearchClick();
    },
    handleLawOriginAllClick() {
      this.filterParams.origins = [];
      this.handleSearchClick();
    },
    handleLawStatusItemClick(val) {
      const isExist = this.filterParams.status.includes(val);
      if (isExist) {
        this.filterParams.status = this.filterParams.status.filter((item) => {
          return item !== val;
        });
      } else {
        this.filterParams.status.push(val);
        if (this.filterParams.status.length === this.lwaStatusNums) {
          this.filterParams.status = [];
        }
      }
      this.handleSearchClick();
    },
    handleLawStatusAllClick() {
      this.filterParams.status = [];
      this.handleSearchClick();
    },
    handleDocTypeItemClick(val) {
      const isExist = this.filterParams.doc_types.includes(val);
      if (isExist) {
        this.filterParams.doc_types = this.filterParams.doc_types.filter(
          (item) => {
            return item !== val;
          },
        );
      } else {
        this.filterParams.doc_types.push(val);
        if (this.filterParams.doc_types.length === this.docTypeOptions.length) {
          this.filterParams.doc_types = [];
        }
      }
      this.handleSearchClick();
    },
    handleDocTypeAllClick() {
      this.filterParams.doc_types = [];
      this.handleSearchClick();
    },
    handleChangePage(page) {
      this.searchForm.page = page;
      this.getLaws();
    },
    handleChangeSize(size) {
      this.searchForm.page = 1;
      this.searchForm.size = size;
      this.getLaws();
    },
    editLaw(row) {
      this.editingLaw = row;
      this.showEditLawDialog = true;
    },
    async updateLaw(row) {
      this.updatingLaw = row;
      this.showAddLawDialog = true;
    },
    async reparseLaw(row) {
      const confirm = await this.$confirm(`是否重新获取/解析文档？`, '提示', {
        type: 'warning',
      }).catch(() => {});
      if (confirm != 'confirm') {
        return;
      }
      try {
        await lawsApi.triggerRefreshLaw(row.id);
        this.$notify({
          title: '成功',
          message: '重新获取/解析文档成功',
          type: 'success',
        });
        this.getLaws();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteLaw(row) {
      const { exists } = await lawsApi.getCheckPointsExistsByLaw(row.id);

      const confirm = await this.$msgbox({
        title: '提示',
        message: exists
          ? `<div>
          <p style="font-size: 14px;  color: #303133; margin-bottom: 10px;">是否删除该文档?</p>
          <p style="color: #F56C6C; font-size: 12px;">提示: 文档删除后，文档明细会被删除，对应的审核规则将被废弃</p>
        </div>`
          : `<div>
          <p style="font-size: 14px;  color: #303133; margin-bottom: 10px;">是否删除该文档?</p>
        </div>`,
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        dangerouslyUseHTMLString: true,
      }).catch(() => {});
      if (confirm != 'confirm') {
        return;
      }
      try {
        await lawsApi.deleteLawData(row.id);
        if (this.lawList.length === 1 && this.searchForm.page > 1) {
          this.searchForm.page--;
        }
        this.getLaws();
        this.$notify({
          title: '成功',
          message: '删除文档成功',
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
    async handleDeleteScenarios(id) {
      try {
        await this.$store.dispatch('scenariosModule/deleteScenario', id);
        this.$notify({
          title: '成功',
          message: '删除成功',
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
    async handleAddScenarios(newName) {
      try {
        await this.$store.dispatch('scenariosModule/createScenario', {
          name: newName,
        });
        this.$refs.lawTypeDialog.resetForm();
        this.$notify({
          title: '成功',
          message: '创建成功',
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
    async handleEditLawConfirm(form) {
      try {
        await lawsApi.updateLawData(this.editingLaw.id, form);
        this.showEditLawDialog = false;
        this.getLaws();
        this.$notify({
          title: '成功',
          message: '编辑成功',
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
    async handleAddLawConfirm({ form, files }) {
      try {
        const formData = new FormData();
        formData.append(
          'form',
          form ? JSON.stringify(form) : JSON.stringify({}),
        );

        let duplicatesFiles = [];
        if (this.updatingLaw) {
          if (files) {
            formData.append('file', files[0]);
          }
          await lawsApi.refreshLaw(this.updatingLaw.id, formData);
        } else {
          if (files) {
            files.forEach((file) => {
              formData.append('files', file);
            });
          }

          const { duplicates } = await lawsApi.createLaws(formData);
          duplicatesFiles = duplicates;
        }
        if (duplicatesFiles.length > 0) {
          this.$notify({
            title: '提示',
            message: `文档${duplicatesFiles.join('、')}已存在，请重新上传`,
            type: 'warning',
          });
        } else {
          this.$notify({
            title: '成功',
            message: this.updatingLaw ? '更新文档成功' : '新增文档成功',
            type: 'success',
          });
        }
        this.updatingLaw = null;
        this.showAddLawDialog = false;
        this.getLaws();
      } catch (error) {
        this.$refs.addLawDialog.closeLoading();
        this.$notify({
          title: '错误',
          type: 'error',
          message: error.message,
        });
        this.getLaws({ loading: false });
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

        // 清除事件处理器引用
        delete this.popoverConfig[type].enterHandler;
        delete this.popoverConfig[type].leaveHandler;
      }
    },

    // 兼容性方法 - 为模板中的事件绑定提供简化调用
    toggleDocTypePopover() {
      this.togglePopover('docType');
    },
    toggleLawTypePopover() {
      this.togglePopover('lawType');
    },
    toggleLawOriginPopover() {
      this.togglePopover('lawOrigin');
    },
    toggleLawStatusPopover() {
      this.togglePopover('lawStatus');
    },
    addDocTypePopoverMouseListeners() {
      this.$nextTick(() => {
        const popover = this.$refs.docTypePopover;
        const reference = popover.$refs.reference;
        const popper = popover.$refs.popper;

        if (reference) {
          reference.addEventListener(
            'mouseenter',
            this.handleDocTypePopoverMouseEnter,
          );
          reference.addEventListener(
            'mouseleave',
            this.handleDocTypePopoverMouseLeave,
          );
        }
        if (popper) {
          popper.addEventListener(
            'mouseenter',
            this.handleDocTypePopoverMouseEnter,
          );
          popper.addEventListener(
            'mouseleave',
            this.handleDocTypePopoverMouseLeave,
          );
        }
      });
    },
    removeDocTypePopoverMouseListeners() {
      const popover = this.$refs.docTypePopover;
      if (popover) {
        const reference = popover.$refs.reference;
        const popper = popover.$refs.popper;

        if (reference) {
          reference.removeEventListener(
            'mouseenter',
            this.handleDocTypePopoverMouseEnter,
          );
          reference.removeEventListener(
            'mouseleave',
            this.handleDocTypePopoverMouseLeave,
          );
        }
        if (popper) {
          popper.removeEventListener(
            'mouseenter',
            this.handleDocTypePopoverMouseEnter,
          );
          popper.removeEventListener(
            'mouseleave',
            this.handleDocTypePopoverMouseLeave,
          );
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.handleRouteEnter(from);
    });
  },
  beforeDestroy() {
    if (this.closePolling) {
      this.closePolling();
      this.closePolling = null;
    }

    // 循环清理所有 popover 的定时器和事件监听器
    Object.keys(this.popoverConfig).forEach((type) => {
      this.removePopoverMouseListeners(type);
    });
  },
};
</script>

<style lang="scss" scoped>
.laws-page {
  padding: 0 20px;

  .tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep .el-form {
      margin-left: auto;
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
          width: 120px;
          margin-left: 20px;
          .el-input__inner {
            border-right: none;
            border-radius: 4px 0 0 4px;
          }
        }
        .search-input {
          width: 300px;
          .el-input__inner {
            border-radius: 0 4px 4px 0;
          }
        }
        .search-btn {
          height: 36px;
          font-size: 14px;
          padding: 7px 20px;
          vertical-align: middle;
          > span {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  ::v-deep .el-table {
    .option-header {
      cursor: pointer;
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
.law-name {
  display: flex;
  .el-tag {
    flex-shrink: 0;
    align-items: center;
  }
}
</style>
<style lang="scss">
.el-popover {
  &.table-column-multiple-select-popper {
    padding: 10px 0;
    max-height: 400px;
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
  &.document-type {
    min-width: 86px;
  }
  &.law-origin {
    min-width: 126px;
  }
}
</style>
