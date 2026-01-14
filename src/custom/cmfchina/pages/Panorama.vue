<template>
  <div class="data-panorama" v-loading="loading">
    <div class="header">
      <div class="search-bar">
        <div>
          <label>场景名称</label>
          <el-select
            v-model="filter.mid"
            size="medium"
            placeholder="请选择场景"
            filterable
            v-load-more-select-options="getMoreScenes"
            @change="changeScene">
            <el-option
              v-for="item in scene.items"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            <el-option v-if="loadingMoreScenes" label="" value="">
              <i class="el-icon-loading"></i>
              <span style="margin-left: 10px; color: #999">loading...</span>
            </el-option>
          </el-select>
        </div>
        <div>
          <label>项目名称</label>
          <el-select
            v-model="filter.pid"
            size="medium"
            placeholder="请选择项目"
            filterable
            clearable
            v-load-more-select-options="getMoreProjects"
            @change="changeProject">
            <el-option
              v-for="item in projects.items"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            <el-option v-if="loadingMoreProjects" label="" value="">
              <i class="el-icon-loading"></i>
              <span style="margin-left: 10px; color: #999">loading...</span>
            </el-option>
          </el-select>
        </div>
        <div>
          <el-form ref="filterForm" :model="filter" :rules="filterFormRules">
            <el-form-item label="" prop="dateRange" class="form-item-date">
              <el-select
                v-model="filter.type"
                size="medium"
                class="date-type-select"
                @change="getPanorama">
                <el-option
                  v-for="(item, index) in dateTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-date-picker
                size="medium"
                v-model="filter.dateRange"
                type="daterange"
                range-separator="-"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button
            type="primary"
            size="medium"
            :disabled="searchButtonDisabled"
            @click="search">
            查 询
          </el-button>
        </div>
      </div>
      <div class="operation-bar">
        <field-status-helper></field-status-helper>
        <el-button
          type="primary"
          size="medium"
          :disabled="selectedRows.length === 0"
          @click="batchReviewFiles">
          文档复核
        </el-button>
        <el-dropdown v-if="canExportFiles" @command="exportData">
          <el-button type="primary" size="medium">
            导出数据<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in exportFileOptions"
              :key="index"
              :command="item">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover
          v-if="canExportFiles"
          placement="bottom"
          title="导出数据列表"
          width="450"
          popper-class="export-list-popover"
          @hide="clearExportList"
          @show="getExportFilesByStatus">
          <el-radio-group
            size="mini"
            v-model.number="exportFile.status"
            @change="getExportFilesByStatus">
            <el-radio-button
              v-for="(item, index) in EXPORT_STATUS_TYPES"
              :key="index"
              :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
          <div v-loading="exportFile.loading">
            <el-table :data="exportFile.items">
              <el-table-column prop="created_utc" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.created_utc | datetime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="task_total"
                label="文件数量"
                align="center">
              </el-table-column>
              <el-table-column prop="" label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    v-if="showExportDownloadButton(scope.row.status)"
                    type="text"
                    size="mini"
                    @click="downloadExportData(scope.row)">
                    下载
                  </el-button>
                  <el-button
                    v-if="showExportDeleteButton(scope.row.status)"
                    type="text"
                    size="mini"
                    class="delete"
                    @click="deleteExportData(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            small
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            :current-page="exportFile.pager.page"
            :page-size="exportFile.pager.size"
            :total="exportFile.pager.total"
            @current-change="changeExportListPage">
          </el-pagination>
          <el-button slot="reference" type="text" class="button-export">
            导出列表
          </el-button>
        </el-popover>
      </div>
    </div>
    <el-table
      ref="table"
      :data="panorama.items"
      row-key="id"
      height="auto"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="120">
        <template slot="header" slot-scope="{}">
          <p>ID</p>
          <span v-if="numberInputInvalid" class="invalid-tooltip">
            ID须为数字
          </span>
          <el-input
            size="mini"
            prefix-icon="el-icon-search"
            v-model="filter.fid"
            :class="[numberInputInvalid ? 'invalid' : '']"
            clearable
            @clear="search"
            @keyup.enter.native="search"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件" min-width="200">
        <template slot="header" slot-scope="{}">
          <p>文件</p>
          <el-input
            size="mini"
            prefix-icon="el-icon-search"
            v-model="filter.fileName"
            clearable
            @clear="search"
            @keyup.enter.native="search"></el-input>
        </template>
      </el-table-column>
      <template>
        <el-table-column
          v-for="(item, index) in allFields.filter(
            (item) => item.value === true,
          )"
          :key="index"
          :prop="item.label"
          :label="item.label"
          header-align="top"
          min-width="150">
          <template slot="header" slot-scope="{}">
            <p class="field-header">
              <span class="field-name" :title="item.label">
                {{ item.label }}
              </span>
              <el-dropdown
                placement="bottom"
                @command="(e) => changeFieldStatus(e, fieldFilter[item.path])">
                <span class="el-dropdown-link">
                  <svg-font-icon
                    name="filter"
                    :color="getFieldStatusFilterIconColor(item.path)" />
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  class="field-status-filter-dropdown">
                  <el-dropdown-item
                    v-for="(status, key) in FIELD_STATUS"
                    :key="status.value"
                    :class="getFieldStatusDropdownItemClass(key, item.path)"
                    :command="key">
                    <div v-if="status.editable" class="probability">
                      {{ status.label }}
                      <span class="color green">
                        （&lt;{{ getFieldProbability(item.field_id) }}%）
                      </span>
                      <i
                        class="el-icon-setting"
                        @click.stop="
                          openProbabilityThresholdSettingsDialog(item)
                        "></i>
                    </div>
                    <template v-else>{{ status.label }}</template>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
            <el-input
              v-if="fieldFilter[item.path]"
              size="mini"
              prefix-icon="el-icon-search"
              v-model="fieldFilter[item.path].keywords"
              clearable
              @clear="search"
              @keyup.enter.native="search"></el-input>
          </template>
          <template slot-scope="scope">
            <el-popover
              :disabled="getFieldAnswerItems(scope.row, item.path).length === 0"
              placement="right"
              width="200"
              trigger="hover"
              popper-class="field-content-popover"
              content="">
              <div>
                <p
                  v-for="(answerItem, answerItemIndex) in getFieldAnswerItems(
                    scope.row,
                    item.path,
                  )"
                  :key="answerItemIndex"
                  class="answer-item">
                  <label
                    v-if="getFieldAnswerItems(scope.row, item.path).length > 1"
                    class="name">
                    {{
                      item.label.includes('-')
                        ? item.label.split('-')[1]
                        : item.label
                    }}{{ answerItemIndex + 1 }}:
                  </label>
                  <span class="text">
                    {{
                      getFieldAnswerContent(scope.row, item.label, answerItem)
                    }}
                  </span>
                </p>
              </div>
              <span
                slot="reference"
                class="color"
                :class="[
                  FIELD_STATUS[getFieldAuditStatus(scope.row, item)].colorValue,
                ]"
                @click="jumpToAnswerData(scope.row, item.path)">
                {{
                  getFieldAnswerContent(
                    scope.row,
                    item.label,
                    getFirstHasTextValueAnswerItem(
                      getFieldAnswerItems(scope.row, item.path),
                    ),
                  )
                }}
              </span>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="created_utc"
        label="上传时间"
        fixed="right"
        min-width="110"
        align="center"
        sortable>
        <template slot-scope="scope">
          <span class="datetime">
            {{ scope.row.created_utc | datetime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_utc"
        label="修改时间"
        fixed="right"
        min-width="110"
        align="center"
        sortable>
        <template slot-scope="scope">
          <span class="datetime">
            {{ scope.row.updated_utc | datetime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="reviewed" label="状态" fixed="right">
        <template slot="header" slot-scope="{}">
          状态
          <el-dropdown placement="bottom" @command="changeReviewStatus">
            <span class="el-dropdown-link">
              <svg-font-icon
                name="filter"
                :color="filter.reviewed ? '#0090c0' : ''" />
            </span>
            <el-dropdown-menu
              slot="dropdown"
              class="review-status-filter-dropdown">
              <el-dropdown-item
                v-for="(value, status) in REVIEW_STATUS"
                :key="value"
                :class="filter.reviewed === Number(status) ? 'active' : ''"
                :command="status">
                {{ value }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          {{ scope.row.reviewed ? '已复核' : '未复核' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="review_user"
        label="复核人员"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          {{ scope.row.review_user || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot="header" slot-scope="{}">
          <div class="operations">
            <span>操作</span>
            <el-popover
              placement="bottom"
              width="500"
              popper-class="cmfchina-panorama-fields-filter"
              @hide="handleAfterHideFieldsFilterPopover">
              <div class="title">
                <h4>字段选择</h4>
                <el-checkbox
                  v-model="checkedAll"
                  :indeterminate="checkAllIndeterminate"
                  label="全选">
                </el-checkbox>
              </div>
              <el-checkbox-group v-model="checkedFields">
                <el-checkbox
                  v-for="(column, index) in allFields"
                  :key="index"
                  :label="column.path">
                  {{ column.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="btns">
                <el-button size="mini" @click="closeFieldsFilterPopover">
                  取消
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="updateCheckedFields">
                  确定
                </el-button>
              </div>
              <theme-icon
                slot="reference"
                name="column-filter"
                class="column-filter">
              </theme-icon>
            </el-popover>
            <el-tooltip effect="dark" content="重置筛选条件" placement="top">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-refresh"
                class="reset-btn"
                @click="resetFieldFilter">
              </el-button>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="复核" placement="top">
            <el-button type="text" size="small" @click="reviewFile(scope.row)">
              <svg-font-icon name="list-check" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="项目中查看" placement="top">
            <el-button
              type="text"
              size="small"
              @click="openInProject(scope.row)">
              <svg-font-icon name="view" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="panorama.pager.page"
      :page-size="panorama.pager.size"
      :total="panorama.pager.total"
      @current-change="changePage"
      @size-change="changeSize">
    </el-pagination>

    <el-dialog
      v-if="probabilityThresholdSettingsDialogVisible"
      :visible="true"
      :title="`${currentFieldForm.label} 置信度阈值设置`"
      top="30vh"
      width="500px"
      class="probability-threshold-settings-dialog"
      @close="closeProbabilityThresholdSettingsDialog">
      <el-form
        ref="currentFieldForm"
        :model="currentFieldForm"
        :rules="currentFieldFormRules"
        label-width="100px">
        <el-form-item label="置信度阈值:" prop="probability">
          <el-input-number
            ref="probability-threshold-input"
            v-model="currentFieldForm.probability"
            :min="1"
            :max="100"
            :step-strictly="true"
            size="mini"
            @input.native="handleProbabilityInput">
          </el-input-number>
          <span class="percent-sign">%</span>
        </el-form-item>
        <el-form-item label="">
          <p class="tips">说明: 请输入 1-100 的整数，系统默认为90</p>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          size="small"
          @click="closeProbabilityThresholdSettingsDialog">
          取消
        </el-button>
        <el-button type="primary" size="small" @click="setFieldProbability">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  exportTypeMap,
  exportActionMap,
  pdfParseStatus,
} from '../../../store/constants';
import {
  FIELD_STATUS,
  REVIEW_STATUS,
  EXPORT_STATUS,
  EXPORT_STATUS_TYPES,
  SIX_DAYS_MILLISECONDS,
  ONE_DAY_OFFSET_MILLISECONDS,
} from '../common/constant';
import { getSortParams } from '../../../utils';
import { cmfchinaPermAllowed } from '../common/utils';
import { getFieldStatus } from '../common/utils';
import FieldStatusHelper from '../components/FieldStatusHelper.vue';
import {
  review,
  searchScene,
  fetchProjects,
  fetchPanorama,
  fetchProbabilities,
  updateFieldProbability,
  exportPanoramaData,
  fetchPanoramaVisibleFields,
  updatePanoramaVisibleFields,
} from '../../../store/api/cmfchina.api';
import {
  fetchExportList,
  exportTrainingData,
  deleteTrainingData,
} from '../../../store/api/schema.api';

export default {
  name: 'data-panorama',
  components: {
    FieldStatusHelper,
  },
  data() {
    return {
      FIELD_STATUS,
      REVIEW_STATUS,
      EXPORT_STATUS_TYPES,
      loading: false,
      filter: {
        mid: null,
        pid: null,
        fid: null,
        fileName: '',
        type: 1,
        dateRange: [],
        reviewed: 0,
      },
      dateTypes: [
        {
          label: '上传时间',
          value: 1,
        },
        {
          label: '修改时间',
          value: 2,
        },
      ],
      filterFormRules: {
        dateRange: [{ required: true, message: '请选择时间范围' }],
      },
      sortParams: {},
      scene: {
        items: [],
        pager: {
          page: 1,
          size: 500,
          total: 0,
        },
      },
      projects: {
        all: [],
        items: [],
        pager: {
          page: 1,
          size: 500,
          total: 0,
        },
      },
      loadingMoreScenes: false,
      loadingMoreProjects: false,
      exportFile: {
        loading: false,
        exportAction: exportActionMap.createTrainingData,
        status: 3,
        items: [],
        pager: {
          page: 1,
          size: 10,
          total: 0,
        },
      },
      exportFileOptions: [
        {
          label: '导出单文件（ZIP）',
          export_type: exportTypeMap.csv,
          export_action: exportActionMap.createTrainingData,
        },
        {
          label: '导出多文件（Excel）',
          export_type: exportTypeMap.excel,
          export_action: exportActionMap.createTrainingData,
        },
        {
          label: '导出原文件（ZIP）',
          export_type: null,
          export_action: exportActionMap.originalFile,
        },
      ],
      panorama: {
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
      },
      fieldFilter: {},
      allFields: [],
      checkedFields: [],
      initialCheckedFields: [],
      selectedRows: [],
      allFieldsProbability: [],
      fieldColumnsFilterVisible: false,
      probabilityThresholdSettingsDialogVisible: false,
      currentFieldForm: {
        probability: 90,
      },
      currentFieldFormRules: {
        probability: [
          { required: true, message: '请输入置信度阈值' },
          { type: 'number', message: '请输入数字' },
        ],
      },
    };
  },
  computed: {
    canExportFiles() {
      return cmfchinaPermAllowed('para_export');
    },
    selectedFids() {
      return this.selectedRows.map((item) => item.id);
    },
    numberInputInvalid() {
      return isNaN(this.filter.fid);
    },
    showExportDownloadButton() {
      return (status) => {
        return [EXPORT_STATUS.FINISH].includes(status);
      };
    },
    showExportDeleteButton() {
      return (status) => {
        return [EXPORT_STATUS.FINISH, EXPORT_STATUS.FAILED].includes(status);
      };
    },
    searchButtonDisabled() {
      return !this.filter.dateRange || this.filter.mid === null;
    },
    checkedAll: {
      get() {
        return this.checkedFields.length === this.allFields.length;
      },
      set(value) {
        this.checkedFields = value
          ? this.allFields.map((item) => item.path)
          : [];
      },
    },
    checkAllIndeterminate() {
      return (
        this.checkedFields.length > 0 &&
        this.checkedFields.length < this.allFields.length
      );
    },
  },
  created() {
    this.init();
  },
  activated() {
    if (this.filter.mid) {
      this.getPanorama();
    }
  },
  deactivated() {
    this.removePopovers();
  },
  methods: {
    async init() {
      this.setDefaultDate(SIX_DAYS_MILLISECONDS);
      await this.getScenes();
      await this.getProjects();
      if (!this.filter.mid) {
        return;
      }
      await this.getPanoramaVisibleFields();
      this.getProbabilities();
      this.getPanorama();
    },
    setDefaultDate(range) {
      const start = new Date(new Date().getTime() - range).setHours(0, 0, 0, 0);
      const end = new Date().setHours(0, 0, 0, 0) + ONE_DAY_OFFSET_MILLISECONDS;
      this.filter.dateRange = [start, end];
    },
    search() {
      this.panorama.pager.page = 1;
      this.getPanorama();
    },
    changeFieldStatus(status, fieldObj) {
      fieldObj.status = Number(status);
      this.getPanorama();
    },
    async getScenes() {
      try {
        const params = {
          page: this.scene.pager.page,
          size: this.scene.pager.size,
        };
        const res = await searchScene(params);
        const sceneItems = res.data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        this.scene.items = [...this.scene.items, ...sceneItems];
        this.scene.pager.total = res.data.total;
        if (this.scene.items.length === 0) {
          this.filter.mid = null;
          return;
        }
        this.filter.mid = Math.min(
          ...this.scene.items.map((item) => item.value),
        );
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getMoreScenes() {
      const { page, size, total } = this.scene.pager;
      if (this.loadingMoreScenes || page * size >= total) {
        return;
      }
      this.loadingMoreScenes = true;
      this.scene.pager.page += 1;
      await this.getScenes();
      this.loadingMoreScenes = false;
    },
    async getProjects() {
      try {
        const params = {
          page: this.projects.pager.page,
          size: this.projects.pager.size,
          mid: this.filter.mid,
        };
        const res = await fetchProjects(params);
        const projectsItems = res.data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        this.projects.items = [...this.projects.items, ...projectsItems];
        this.projects.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getMoreProjects() {
      const { page, size, total } = this.projects.pager;
      if (this.loadingMoreProjects || page * size >= total) {
        return;
      }
      this.loadingMoreProjects = true;
      this.projects.pager.page += 1;
      await this.getProjects();
      this.loadingMoreProjects = false;
    },
    async getPanorama() {
      if (!this.filter.dateRange) {
        this.$notify({
          title: '提示',
          message: '未选择查询时间范围，请选择时间范围后进行查询',
          type: 'warning',
        });
        return;
      }

      if (this.numberInputInvalid) {
        this.$notify({
          title: '提示',
          message: 'ID 输入有误，请输入数字后进行查询',
          type: 'warning',
        });
        return;
      }

      try {
        this.loading = true;
        const data = {
          mid: this.filter.mid,
          pid: this.filter.pid,
          fid: Number(this.filter.fid),
          file_name: this.filter.fileName,
          reviewed: this.filter.reviewed,
          start_at: this.filter.dateRange[0] / 1000,
          end_at: this.filter.dateRange[1] / 1000,
          filter_dict: this.getFieldFilter(),
          type: this.filter.type,
          page: this.panorama.pager.page,
          size: this.panorama.pager.size,
          ...this.sortParams,
        };
        const res = await fetchPanorama(
          _.omitBy(data, (v) => v === null || v === ''),
        );
        this.panorama.items = res.data.items;
        this.panorama.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    getFieldFilter() {
      const fieldFilter = {};
      for (const key in this.fieldFilter) {
        const value = this.fieldFilter[key];
        const key_path = value.path;
        fieldFilter[[key_path]] = {
          keywords: value.keywords,
          status: value.status,
        };
      }
      return fieldFilter;
    },
    getMatchedField(item, fieldPath) {
      const key = JSON.parse(item.key);
      if (!key) {
        return false;
      }
      const keyPath = JSON.stringify(
        _.tail(key).map((item) => item.split(':')[0]),
      );
      return fieldPath === keyPath;
    },
    getFieldAnswerItems(row, fieldPath) {
      const matched = row.data.answer.items.filter((item) => {
        return this.getMatchedField(item, fieldPath);
      });
      return _.sortBy(matched, 'key');
    },
    getFirstHasTextValueAnswerItem(items) {
      const item = items.find((item) => {
        return item.data?.some(
          (d) => d.text !== '' || item.boxes?.some((box) => box.text !== ''),
        );
      });
      return item || items[0];
    },
    getAnswerText(answer) {
      if (!answer) {
        return '';
      }
      return (
        answer
          .map((ans) => ans.text || ans.boxes?.map((box) => box.text).join(''))
          .join('') || '无数据'
      );
    },
    getAnswerEnumValue(item) {
      return item.value.join(',');
    },
    getFieldAnswerContent(row, columnName, answerItem) {
      if (!answerItem) {
        return '无数据';
      }
      if (this.isEnumField(row, columnName)) {
        return this.getAnswerEnumValue(answerItem);
      }
      return this.getAnswerText(answerItem.data);
    },
    isEnumField(row, columnName) {
      const fieldName = columnName.includes('-')
        ? columnName.split('-')[1]
        : columnName;
      const fieldSchema =
        row.data.schema.schemas.find((s) => {
          return s.schema[fieldName];
        })?.schema[fieldName] || {};
      return row.data.schema.schema_types.some(
        (schema) => schema.label === fieldSchema.type && schema.type === 'enum',
      );
    },
    getFieldAuditStatus(row, column) {
      const fieldAnswerItems = row.data.answer.items.filter((item) => {
        return this.getMatchedField(item, column.path);
      });
      const probability = this.getFieldProbability(column.field_id);
      return getFieldStatus(
        fieldAnswerItems[0],
        row.data.audit_results.items,
        fieldAnswerItems,
        probability,
      );
    },
    async getPanoramaVisibleFields() {
      try {
        const res = await fetchPanoramaVisibleFields(this.filter.mid);
        this.allFields = res.data.map((field) => {
          const label = _.tail(JSON.parse(field.key_path)).join('-');
          const { key_path, check, mold_field_id } = field;
          return {
            label,
            path: JSON.stringify(_.tail(JSON.parse(key_path))),
            value: check,
            field_id: mold_field_id,
          };
        });
        this.checkedFields = this.allFields.flatMap((item) =>
          item.value === true ? [item.path] : [],
        );
        this.initialCheckedFields = _.clone(this.checkedFields);
        this.fieldFilter = this.allFields.reduce((acc, cur) => {
          acc[cur.path] = {
            keywords: '',
            status: 0,
            path: cur.path,
          };
          return acc;
        }, {});
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getProbabilities() {
      try {
        const res = await fetchProbabilities(this.filter.mid);
        this.allFieldsProbability = res;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    getFieldProbability(id) {
      return this.allFieldsProbability.find((item) => item.field_id === id)
        ?.probability;
    },
    async setFieldProbability() {
      const isValid = await this.$refs['currentFieldForm']
        .validate()
        .catch(() => {});
      if (!isValid) {
        return;
      }
      try {
        const { field_id, probability } = this.currentFieldForm;
        await updateFieldProbability(field_id, { probability });
        this.closeProbabilityThresholdSettingsDialog();
        this.$notify({
          title: '成功',
          message: '置信度阈值设置成功',
          type: 'success',
        });
        await this.getProbabilities();
        this.getPanorama();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getExportFiles() {
      try {
        this.exportFile.loading = true;
        const params = {
          schema_id: this.filter.mid,
          status: this.exportFile.status,
          page: this.exportFile.pager.page,
          size: this.exportFile.pager.size,
        };
        const res = await fetchExportList(params);
        this.exportFile.items = res.data.items;
        this.exportFile.pager.total = res.data.total;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.exportFile.loading = false;
      }
    },
    clearExportList() {
      this.exportFile.items = [];
      this.exportFile.pager.page = 1;
      this.exportFile.pager.total = 0;
    },
    getExportFilesByStatus() {
      this.exportFile.pager.page = 1;
      this.getExportFiles();
    },
    getFieldStatusFilterIconColor(fieldName) {
      return this.fieldFilter[fieldName]?.status !== 0 ? '#0090c0' : '';
    },
    getFieldStatusDropdownItemClass(status, fieldName) {
      return Number(status) === this.fieldFilter[fieldName]?.status
        ? 'active'
        : '';
    },
    async changeScene() {
      this.filter.fid = null;
      this.filter.pid = null;
      this.filter.fileName = '';
      this.filter.reviewed = 0;
      this.sortParams = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearSelection();
      this.closeFieldsFilterPopover();
      this.projects.items = [];
      this.getProjects();
      await this.getPanoramaVisibleFields();
      await this.getProbabilities();
      this.getPanorama();
    },
    changeProject() {
      this.getPanorama();
    },
    changePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.panorama.pager.page = page;
      this.getPanorama();
    },
    changeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.panorama.pager.page = 1;
      this.panorama.pager.size = size;
      this.getPanorama();
    },
    handleSortChange({ prop, order }) {
      this.sortParams = getSortParams(prop, order);
      this.getPanorama();
    },
    resetFieldFilter() {
      this.sortParams = {};
      this.$refs.table.clearSort();
      Object.keys(this.fieldFilter).forEach((key) => {
        this.fieldFilter[key] = {
          path: key,
          keywords: '',
          status: 0,
        };
      });
      this.filter = {
        ...this.filter,
        fid: null,
        fileName: '',
        filter_dict: this.getFieldFilter(),
        reviewed: 0,
      };
      this.getPanorama();
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    changeReviewStatus(status) {
      this.filter.reviewed = Number(status);
      this.getPanorama();
    },
    jumpToAnswerData(row, fieldPath) {
      if (row.pdf_parse_status !== pdfParseStatus.completed) {
        this.$notify({
          title: '提示',
          message: '该文档正在处理中',
          type: 'warning',
        });
        return;
      }

      const { qid, pid, tree_id, id } = row;
      const fieldAnswerItem = this.getFirstHasTextValueAnswerItem(
        this.getFieldAnswerItems(row, fieldPath),
      );

      const routeParams = {
        name: 'inspect',
        params: { qid },
        query: {
          projectId: pid,
          treeId: tree_id,
          fileId: id,
          schemaId: this.filter.mid,
          task_type: 'audit',
          key: fieldAnswerItem?.key,
          fileSuffix: (row.name.split('.').pop() || '').toLowerCase(),
        },
      };
      this.$router.push(routeParams);
    },
    async reviewFile(row) {
      const confirm = await this.$confirm('确定要复核文件吗？', '提示').catch(
        () => {},
      );
      if (confirm === 'confirm') {
        try {
          await review({ fids: [row.id] });
          this.$notify({
            title: '成功',
            message: '复核成功',
            type: 'success',
          });
          this.getPanorama();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async batchReviewFiles() {
      const confirm = await this.$confirm(
        '确定要批量复核文件吗？',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await review({ fids: this.selectedFids });
          this.$notify({
            title: '成功',
            message: '批量复核成功',
            type: 'success',
          });
          this.getPanorama();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async updateCheckedFields() {
      try {
        const fields = this.allFields.map((item) => ({
          [item.field_id]: this.checkedFields.includes(item.path),
        }));
        const check_fields = Object.assign({}, ...fields);
        await updatePanoramaVisibleFields(this.filter.mid, {
          check_fields,
        });
        await this.getPanoramaVisibleFields();
        this.closeFieldsFilterPopover();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    closeFieldsFilterPopover() {
      document.body.click();
    },
    handleAfterHideFieldsFilterPopover() {
      this.checkedFields = this.initialCheckedFields;
    },
    async exportData(command) {
      try {
        const data = _.omitBy(
          {
            mid: this.filter.mid,
            pid: this.filter.pid,
            fid: Number(this.filter.fid),
            file_name: this.filter.fileName,
            reviewed: this.filter.reviewed,
            start_at: this.filter.dateRange[0] / 1000,
            end_at: this.filter.dateRange[1] / 1000,
            filter_dict: this.getFieldFilter(),
            type: this.filter.type,
            files_ids: this.selectedFids,
            export_type: command.export_type,
            export_action: command.export_action,
          },
          (v) => v === null || v === '',
        );
        await exportPanoramaData(data);
        this.$notify({
          title: '成功',
          message: '数据导出中，导出详情须在导出列表中查看',
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
    downloadExportData(row) {
      const link = exportTrainingData(row.id, this.exportFile.exportAction);
      window.open(link, '_blank');
    },
    async deleteExportData(row) {
      const confirm = await this.$confirm('确定要删除吗？', '提示').catch(
        () => {},
      );
      if (confirm === 'confirm') {
        try {
          await deleteTrainingData(row.id, this.exportFile.exportAction);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          });
          this.exportFile.pager.page = 1;
          this.getExportFiles();
        } catch (err) {
          this.$notify({
            title: '错误',
            message: err.message,
            type: 'error',
          });
        }
      }
    },
    changeExportListPage(page) {
      this.exportFile.pager.page = page;
      this.getExportFiles();
    },
    openInProject(row) {
      this.$router.push({
        name: 'projectDetail',
        params: { treeId: row.tree_id, projectId: row.pid },
        query: { fileId: row.id, from: 'panorama' },
      });
    },
    removePopovers() {
      const elPopovers = document.querySelectorAll('.el-popover');
      elPopovers.forEach((popover) => {
        popover.remove();
      });
    },
    openProbabilityThresholdSettingsDialog(field) {
      this.currentFieldForm = {
        ...field,
        probability: this.getFieldProbability(field.field_id),
      };
      this.probabilityThresholdSettingsDialogVisible = true;
      this.$nextTick(() => {
        this.$refs['probability-threshold-input'].focus();
      });
    },
    closeProbabilityThresholdSettingsDialog() {
      this.probabilityThresholdSettingsDialogVisible = false;
    },
    async handleProbabilityInput() {
      this.currentFieldForm.probability =
        this.$refs['probability-threshold-input'].displayValue || undefined;
      const isValid = await this.$refs.currentFieldForm
        .validate()
        .catch(() => {});
      if (!isValid) {
        this.$refs.currentFieldForm.validateField('probability');
      } else {
        this.$refs.currentFieldForm.clearValidate('probability');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.data-panorama {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    font-size: 14px;
    .search-bar {
      display: flex;
      align-items: center;
      > div {
        display: flex;
        align-items: center;
        margin-right: 10px;
        label {
          margin-right: 10px;
        }
        .el-select {
          flex: 1;
        }
        .el-form {
          .el-form-item {
            margin-bottom: 0;
            &.form-item-date {
              .date-type-select {
                width: 110px;
                ::v-deep .el-input__inner {
                  border-right: 0;
                  border-radius: 4px 0 0 4px;
                }
              }
              .el-date-editor {
                width: 270px;
                border-radius: 0 4px 4px 0;
              }
            }
            ::v-deep .el-form-item__label,
            ::v-deep .el-form-item__content {
              display: flex;
              align-items: center;
              line-height: unset;
            }
          }
        }
      }
    }
    .operation-bar {
      display: flex;
      align-items: center;
      .el-button {
        margin-right: 10px;
      }
    }
    .button-info {
      font-size: 20px;
    }
    .button-export {
      margin-left: 10px;
      text-decoration: underline;
    }
  }
  .el-table {
    ::v-deep th {
      vertical-align: top;
      .cell {
        min-height: 34px;
        line-height: 34px;
        .el-input {
          &.invalid {
            .el-input__inner {
              border-color: #f56c6c;
              color: #f56c6c;
            }
          }
        }
        .invalid-tooltip {
          position: absolute;
          top: 2px;
          left: 20px;
          width: 80px;
          line-height: 24px;
          box-sizing: border-box;
          text-align: center;
          padding: 2px 5px;
          border-radius: 5px;
          background-color: #303133;
          color: #fff;
          font-size: 12px;
          font-weight: normal;
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -5px;
            transform: translateX(-50%);
            z-index: 999;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #303133;
          }
        }
      }
      .field-header {
        display: flex;
        align-items: center;
        margin-top: -1px;
        .field-name {
          max-width: 90%;
          white-space: nowrap;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .el-dropdown {
          margin-left: 5px;
        }
      }
    }
    ::v-deep .cell {
      .el-button--text {
        i {
          font-size: 18px;
          color: #666 !important;
        }
      }
      .datetime {
        word-break: break-word;
      }
      .operations {
        .column-filter {
          width: 13px;
          height: 13px;
          margin-left: 5px;
          vertical-align: -2px;
          cursor: pointer;
        }
        .reset-btn {
          margin-left: 10px;
          padding: 2px 5px;
          vertical-align: -1px;
          i {
            font-size: 15px;
            font-weight: bold;
          }
        }
      }
      .color {
        cursor: pointer;
        display: -webkit-inline-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .column-filter {
    width: 30px;
  }
  .probability-threshold-settings-dialog {
    ::v-deep .el-dialog__body {
      padding: 10px;
    }
    .el-form-item {
      margin-bottom: 15px;
      .percent-sign {
        margin-left: 10px;
        vertical-align: middle;
      }
      .tips {
        font-size: 12px;
        font-weight: bold;
        color: #fc3c38;
      }
    }
  }
}
</style>

<style lang="scss">
.export-list-popover {
  .el-popover__title {
    padding: 5px 0 15px;
    border-bottom: 1px solid #f4f4f4;
  }
  .el-radio-group {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }
  .el-button {
    &.delete {
      color: #fc3c38;
    }
  }
  .el-table {
    max-height: 50vh;
    overflow: auto;
    &::before {
      display: none;
    }
    .el-loading-mask {
      position: absolute;
    }
  }
  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
}
.cmfchina-panorama-fields-filter {
  padding: 0;
  .title {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom: 1px solid #0000000f;
    .el-checkbox {
      .el-checkbox__label {
        padding-left: 5px;
        vertical-align: -1px;
      }
    }
  }
  .el-checkbox-group {
    max-height: 50vh;
    overflow-y: auto;
    padding: 10px 0;
    .el-checkbox {
      margin: 5px 10px;
      .el-checkbox__label {
        padding-left: 5px;
        vertical-align: -1px;
      }
    }
  }
  .btns {
    padding: 12px 0;
    text-align: center;
    border-top: 1px solid #0000000f;
  }
}
.field-content-popover {
  .answer-item {
    display: flex;
    margin: 5px 0;
    .name {
      margin-right: 10px;
    }
    .text {
      flex: 1;
      color: #888;
    }
  }
}
.field-status-filter-dropdown,
.review-status-filter-dropdown {
  .el-dropdown-menu__item {
    margin-right: 0;
    &.active {
      color: #0090c0;
      font-weight: bold;
    }
    .probability {
      i {
        padding: 5px 5px 5px 10px;
        color: $--color-primary;
        vertical-align: baseline;
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
