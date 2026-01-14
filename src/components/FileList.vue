<template>
  <div class="file-list-wrapper">
    <el-table
      v-bind="
        $style.file.tableHeight ? { height: $style.file.tableHeight } : {}
      "
      :stripe="!$platform.isDefaultEnv()"
      :empty-text="$t(`message['暂无数据']`)"
      :data="tableData"
      :default-sort="currentDefaultSort"
      style="width: 100%"
      :row-class-name="getRowClassName"
      row-key="id"
      :expand-row-keys="expandedFiles"
      ref="table"
      class="has-border"
      @row-click="openDir"
      @sort-change="handleChangeSort"
      @expand-change="handleChangeExpand"
      @selection-change="handleChangeSelection">
      <el-table-column v-if="isShowFileListExpand" type="expand" width="30">
        <template slot-scope="props">
          <file-list-expand
            v-if="checkRowCanExpand(props.row)"
            :file="props.row">
            <template slot="options">
              <el-button
                v-if="isShowEditBtn"
                type="text"
                :disabled="disableEditBtn(props.row)"
                @click.stop="openFilePopup(props.row)">
                {{ $t(`message['编辑']`) }}
              </el-button>
            </template>
          </file-list-expand>
        </template>
      </el-table-column>
      <el-table-column v-else width="30"></el-table-column>
      <el-table-column
        v-if="tableRowSelectEnable"
        type="selection"
        width="30"
        align="center"
        :reserve-selection="true"></el-table-column>
      <el-table-column
        v-if="showColumn('id')"
        prop="id"
        :label="$text.file['ID']"
        :width="$style.file.idWidth"></el-table-column>
      <el-table-column
        v-if="showColumn('name')"
        prop="name"
        :label="$text.file['文件']"
        :width="$style.file.nameWidth"
        class-name="name">
        <template slot-scope="scope">
          <span>
            <i :class="getIcon(scope.row.fileType)"></i>
            <span v-if="scope.row.download" class="filename">
              {{ scope.row.name }}
              <el-tag v-if="scope.row.size" size="mini" class="tag-filesize">
                {{ scope.row.size | fileSize }}
              </el-tag>
              <el-popover
                v-if="$platform.isNafmiiEnv()"
                placement="right"
                trigger="hover"
                popper-class="file-download-popover">
                <div class="download-link">
                  <el-button
                    type="text"
                    size="mini"
                    :loading="scope.row.originFileDownloading"
                    @click.stop="downloadOriginFile(scope.row)">
                    源文件
                  </el-button>
                  <el-tooltip
                    effect="dark"
                    content="文件服务器异常，请联系文件服务管理员处理"
                    placement="right"
                    :disabled="
                      downloadAnnotationFileTooltipDisabled(scope.row)
                    ">
                    <el-button
                      type="text"
                      size="mini"
                      :loading="scope.row.reviseFileDownloading"
                      :disabled="!canDownloadAnnotationFile(scope.row)"
                      @click.stop="downloadReviseFile(scope.row)">
                      批注文件
                    </el-button>
                  </el-tooltip>
                </div>
                <i
                  slot="reference"
                  class="el-icon-download file-download-popover-icon"></i>
              </el-popover>
              <template v-else>
                <a
                  v-if="scope.row.task_type !== 'clean_file'"
                  :href="scope.row.download"
                  target="_blank"
                  :title="$t(`message['下载']`)"
                  :download="scope.row.name"
                  class="list-item-title"
                  @click.stop>
                  <i class="el-icon-download file-download-icon"></i>
                </a>
                <el-popover
                  v-if="scope.row.task_type === 'clean_file'"
                  placement="right"
                  popper-class="cleanfile-download-popover"
                  trigger="hover">
                  <div class="download-link">
                    <a
                      :href="scope.row.downloadUrlByWord"
                      target="_blank"
                      :class="{ disabled: !scope.row.downloadUrlByWord }"
                      :download="scope.row.name"
                      @click.stop>
                      导出 Word
                    </a>
                    <a
                      :href="scope.row.downloadUrlByPdf"
                      target="_blank"
                      :class="{ disabled: !scope.row.downloadUrlByPdf }"
                      :download="scope.row.name"
                      @click.stop>
                      导出 PDF
                    </a>
                  </div>
                  <i
                    slot="reference"
                    class="el-icon-download file-download-icon"></i>
                </el-popover>
              </template>
            </span>
            <span v-else class="filename">{{ getMetaName(scope.row) }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('nafmii_mold_names')"
        label="文件类型"
        width="130"
        align="center">
        <template slot-scope="scope">
          <template
            v-if="scope.row.mold_names && scope.row.mold_names.length > 0">
            <span
              v-for="(mold_name, index) in scope.row.mold_names"
              :key="index">
              <overflow-popover :content="mold_name" />
            </span>
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('nafmii_task_types')"
        label="任务类型"
        width="120"
        align="center"
        class-name="task-types">
        <template slot-scope="scope">
          <template
            v-if="scope.row.task_types && scope.row.task_types.length > 0">
            <span
              v-for="(task_type, index) in scope.row.task_types"
              :key="index">
              {{ task_type }}
            </span>
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('nafmii_file_source')"
        label="文件来源"
        width="120"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.source || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('pdf_parse_status')"
        prop="pdf_parse_status"
        align="center"
        :label="$t(`message['预处理']`)"
        class-name="parse-status"
        :width="$style.file.parseStatusWidth">
        <template slot-scope="scope">
          <span :class="getPdfParseStatusClassName(scope.row.pdf_parse_status)">
            {{ getPdfParseStatus(scope.row.pdf_parse_status) }}
            <el-tooltip
              content="预计处理时长=任务队列等待时长+解析时长 预计处理时长仅供参考，请以实际时长为准。"
              placement="bottom"
              effect="light"
              popper-class="parse-status-tooltip">
              <i
                v-if="isShowParseTime(scope.row.pdf_parse_status)"
                class="el-icon-info"
                style="color: #003f78"></i>
            </el-tooltip>
          </span>
          <span
            v-if="isShowParseTime(scope.row.pdf_parse_status)"
            class="parse-time">
            预计{{ formatSecondToHms(scope.row.parse_time) }}完成
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('schema_and_ai_status')"
        label="Schema&AI预测">
        <template slot-scope="scope">
          <p
            v-for="(question, index) in scope.row.questions"
            :key="index"
            class="ai-status">
            <span>{{ question.mold_name }}</span>
            <el-tag
              size="mini"
              :type="AI_PREDICT_STATUS_TAG_TYPE[question.ai_status]">
              {{ getAIPredictionText(question.ai_status, scope.row) }}
              <theme-icon
                v-if="question.ai_status === AI_PREDICT_STATUS_MAP.DOING"
                :class="`ai-status-${question.ai_status}`"
                :name="getAIPredictIconName(question.ai_status, scope.row)" />
            </el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('nafmii_ai_status')"
        label="AI预测"
        width="120"
        align="center">
        <template slot-scope="scope">
          <template
            v-if="scope.row.questions && scope.row.questions.length !== 0">
            <span
              v-for="(question, index) in scope.row.questions"
              :key="index"
              :class="getAIStatusClassName(question.ai_status)">
              {{ getAIStatusText(question.ai_status) }}
            </span>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="isTimeSorting"
        v-if="showColumn('updated_utc')"
        prop="updated_utc"
        align="center"
        :label="$t(`message['修改时间']`)"
        :width="$style.file.timeWidth">
        <template slot-scope="scope">
          {{ scope.row.updated_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        :sortable="isTimeSorting"
        v-if="showColumn('created_utc')"
        prop="created_utc"
        align="center"
        :label="$t(`message['上传时间']`)"
        :width="$style.file.timeWidth">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('user_name')"
        prop="user_name"
        align="center"
        width="100"
        :label="$t(`message['上传用户']`)"></el-table-column>
      <el-table-column
        v-if="showColumn('nafmii_confirm_status')"
        label="人工确认状态"
        width="120"
        align="center">
        <template slot-scope="scope">
          {{ getConfirmStatusText(scope.row.confirm_status) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('insight_queue_stamp')"
        label="解析开始时间"
        sortable="custom"
        width="140"
        prop="insight_queue_stamp"
        align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.insight_queue_stamp">
            {{ scope.row.insight_queue_stamp | datetime }}
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('insight_parse_stamp')"
        label="解析完成时间"
        sortable="custom"
        width="140"
        prop="insight_parse_stamp"
        align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.insight_parse_stamp">
            {{ scope.row.insight_parse_stamp | datetime }}
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('nafmii_execute_push_stamp')"
        label="识别结果推送时间"
        width="140"
        prop="push_answer_at"
        align="center">
        <template slot-scope="scope">
          <template v-if="isFileSourceByLocalUpload(scope.row.source)">
            -
          </template>
          <template v-else>{{ scope.row.push_answer_at | datetime }}</template>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        v-if="showColumn('scene_and_ai_status')"
        :label="$t(`message['场景&AI预测']`)"
        class-name="scene_and_ai_status">
        <template slot-scope="scope">
          <template
            v-if="scope.row.isDir && scope.row.default_molds.length > 0">
            <div v-if="$platform.isCmfchinaEnv()">
              <p
                v-for="(name, index) in getDirSchemaNames(scope.row)"
                :key="index">
                {{ name }}
              </p>
            </div>
          </template>
          <div
            v-else-if="scope.row.questions && scope.row.questions.length > 0">
            <div
              v-for="(question, index) in scope.row.questions"
              :key="index"
              class="question">
              <span class="mold-name">{{ question.mold_name }}</span>
              <el-tooltip
                placement="top"
                :content="getAIPredictionText(question.ai_status)">
                <theme-icon :name="getAIPredictIconName(question.ai_status)" />
              </el-tooltip>
            </div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('file_type')"
        align="center"
        :label="$t(`message['文件类型']`)"
        sortable
        sort-by="tags">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.tags && scope.row.tags.length > 0"
            size="mini"
            :title="getFileTagName(scope.row.tags)"
            >{{ getFileTagName(scope.row.tags) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('review_status')"
        align="center"
        :label="$t(`message['审核状态']`)">
        <template slot-scope="scope">
          {{ getReviewStatusText(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('product_name')"
        prop="product_name"
        align="center"
        :label="$t(`message['产品名称']`)">
        <template slot-scope="scope">
          {{ scope.row.product_name ? scope.row.product_name : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('manager_name')"
        prop="manager_name"
        align="center"
        class-name="manager-name"
        :label="$t(`message['基金管理人名称']`)">
        <span slot-scope="scope" :title="scope.row.manager_name">
          {{ scope.row.manager_name ? scope.row.manager_name : '-' }}
        </span>
      </el-table-column>
      <el-table-column
        v-if="showColumn('sysfrom')"
        prop="sysfrom"
        align="center">
        <template slot="header" slot-scope="{}">
          <el-dropdown
            @command="(value) => filterFilesByCondition('sysfrom', value)">
            <span class="el-dropdown-link">
              {{ $t(`message['文件来源']`) }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="rules-filter-dropdown">
              <el-dropdown-item
                v-for="item in sysfromOptions"
                :key="item.value"
                :command="item.value"
                :class="[item.value === filterSysfrom ? 'active' : '']">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          {{ getSysFromName(scope.row.sysfrom) }}
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn('source')" prop="source" align="center">
        <template slot="header" slot-scope="{}">
          <el-dropdown
            @command="(value) => filterFilesByCondition('source', value)">
            <span class="el-dropdown-link">
              详细来源
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="rules-filter-dropdown">
              <el-dropdown-item
                v-for="item in sourceOptions"
                :key="item.value"
                :command="item.value"
                :class="[item.value === filterSource ? 'active' : '']">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          {{ getSourceName(scope.row.source) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('task_type')"
        align="center"
        width="120"
        :label="$t(`message['处理方式']`)">
        <template slot-scope="scope">
          <span
            :style="{
              whiteSpace:
                scope.row.process_methods.length > 1 ? 'pre-line' : 'nowrap',
            }"
            v-text="
              Array.isArray(scope.row.process_methods)
                ? scope.row.process_methods.join('\n')
                : scope.row.process_methods
            "></span>
          <el-tooltip
            v-if="showCleanFileTooltip(scope.row)"
            effect="dark"
            placement="top"
            style="margin-left: 4px"
            popper-class="cleanfile-tooltip">
            <div slot="content" class="content">
              {{ formatCleanFileInfo(scope.row.meta_info.clean_file) }}
            </div>
            <i
              class="el-icon-warning"
              @click="gotoCleanfilePage(scope.row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn('review_methods')"
        align="center"
        :label="$t(`message['审核方式']`)">
        <template slot-scope="scope">
          <div
            style="white-space: pre-line"
            v-text="scope.row.review_methods.join('\n')"></div>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        align="center"
        class-name="operations"
        :fixed="$features.operationColumnFixed()">
        <template slot="header" slot-scope="{}">
          <div class="operations">
            <span>{{ $t(`message['操作']`) }}</span>
            <el-popover
              placement="top"
              width="460"
              trigger="click"
              popper-class="table-columns-filter"
              v-model="tableColumnsFilterVisible"
              v-if="isShowTableColumnsFilter">
              <h4 class="title">{{ $t(`message['列表详情']`) }}</h4>
              <el-checkbox-group v-model="tableColumnsSelectedTemp">
                <el-checkbox
                  v-for="(column, index) in tableColumns"
                  :key="index"
                  :label="column.key">
                  {{
                    $text.file[column.label] || $t(`message['${column.label}']`)
                  }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="btns">
                <el-button
                  size="medium"
                  @click="tableColumnsFilterVisible = false">
                  {{ $t(`message['取消']`) }}
                </el-button>
                <el-button
                  size="medium"
                  type="primary"
                  @click="selectTableColumns">
                  {{ $t(`message['确定']`) }}
                </el-button>
              </div>
              <theme-icon
                slot="reference"
                name="column-filter"
                icon-class="el-icon-menu"
                class="column-filter-ref"></theme-icon>
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          <slot name="row-handle" :slot-scope="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pager.total > 0"
      background
      :layout="paginationLayout"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handleChangePage"
      @size-change="handleChangeSize">
    </el-pagination>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  convertFileTypeToIcon,
  getFileTypeByName,
  EventBus,
  getSortParams,
  parseSortParams,
  formatSecondToHms,
  downloadFileByBlob,
} from '@/utils';
import { getPaginationLayout } from '@/utils/pagination';
import * as llmParamsUtils from '@/utils/llmParamsUtils';
import {
  questionStatus,
  pdfParseStatus,
  AI_PREDICT_STATUS_MAP,
  AI_PREDICT_STATUS_TEXT_MAP,
  AI_PREDICT_STATUS_TAG_TYPE,
  AI_PREDICT_STATUS_ICON_NAME_MAP,
  SCHEMA_TYPE,
} from '@/store/constants';
import {
  getAuditStatus,
  getAuditStatusTextByKey,
} from '@/utils/auditStatusUtils';
import FileMarkableMixin from './mixins/FileMarkableMixin';
import FileListExpand from './FileListExpand';
import OverflowPopover from './OverflowPopover';
import {
  getConfirmStatusText,
  isFileSourceByLocalUpload,
} from '@/custom/nafmii/common/utils';
import { downloadOriginFile } from '../store/api/file.api';
import { nafmii as nafmiiApi } from '../store/api';

import { ROUTE_NAME_MAP } from '@/custom/nafmii/common/constant';

const CGS_FILE_LIST_TABLE_COLUMNS = 'CGS_FILE_LIST_TABLE_COLUMNS';

export default {
  name: 'file-list',
  components: {
    FileListExpand,
    OverflowPopover,
  },
  mixins: [FileMarkableMixin],
  props: {
    files: {
      type: Array,
      required: true,
    },
    pager: {
      type: Object,
      required: true,
    },
    defaultSort: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    canSelectFile: {
      type: Boolean,
      required: false,
      default: false,
    },
    expandedFiles: {
      type: Array,
      required: false,
      default: () => [],
    },
    sortParams: {
      type: Object,
      required: false,
      default: () => {},
    },
    scrollTop: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      AI_PREDICT_STATUS_MAP,
      AI_PREDICT_STATUS_TAG_TYPE,
      tableColumnsFilterVisible: false,
      sysfromOptions: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '本地上传',
          value: 'local',
        },
        {
          label: '产品中心',
          value: 'PIF',
        },
        {
          label: 'OA系统',
          value: 'OAS',
        },
        {
          label: '管理人平台',
          value: 'FMP',
        },
      ],
      sourceOptions: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: 'Glazer',
          value: 'Glazer',
        },
      ],
      filterSysfrom: null,
      filterSource: null,
      tableColumnsSelected: [],
      tableColumnsSelectedTemp: [],
      needScrollToSearchMatchedRow: true,
    };
  },
  computed: {
    tableData() {
      if (this.$isAllowed('showFileScenario')) {
        return this.files.map((item) => {
          const scenario = item.isDir
            ? item.default_scenario_id
            : item.scenario;
          const taskType = item.isDir ? item.default_task_type : item.task_type;
          const { process_methods, review_methods } =
            this.getFormDataFromParams(scenario, taskType);
          let formatProcessMethods = process_methods;
          if (process_methods.length === 1 && process_methods[0] === '-') {
            formatProcessMethods = this.getTaskTypeNames(item);
          }
          return {
            ...item,
            process_methods: formatProcessMethods,
            review_methods,
          };
        });
      }
      return this.files.map((item) => {
        return {
          ...item,
          process_methods: this.getTaskTypeNames(item),
        };
      });
    },
    tableColumns() {
      return this.$features.getFileListTableColumns();
    },
    tableRowSelectEnable() {
      return this.canSelectFile;
    },
    paginationLayout() {
      return getPaginationLayout();
    },
    isShowFileListExpand() {
      return !this.readonly && !this.$platform.isCmfchinaEnv();
    },
    isTimeSorting() {
      if (this.$platform.isCmfchinaEnv() || this.$platform.isNafmiiEnv()) {
        return 'custom';
      }
      return false;
    },
    currentDefaultSort() {
      return parseSortParams(this.sortParams, this.defaultSort);
    },
    isFileParsing() {
      return (status) => status === pdfParseStatus.parsing_time;
    },
    isFileParseWaiting() {
      return (status) =>
        status === pdfParseStatus.waiting || status === pdfParseStatus.parsing;
    },
    isAIPredictFinished() {
      return (questions) =>
        !_.isEmpty(questions) &&
        questions[0].ai_status === AI_PREDICT_STATUS_MAP.FINISHED;
    },
    canDownloadAnnotationFile() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          if (!row.revise_file_path) {
            return false;
          }
        }
        return this.isAIPredictFinished(row.questions);
      };
    },
    downloadAnnotationFileTooltipDisabled() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          return !!row.revise_file_path;
        }
        return true;
      };
    },
    isShowEditBtn() {
      if (this.$platform.isNafmiiEnv()) {
        return true;
      }
      return false;
    },
    isShowParseTime() {
      return (status) => {
        if (this.$platform.isNafmiiEnv()) {
          return this.isFileParsing(status) || this.isFileParseWaiting(status);
        }
        return false;
      };
    },
    isShowTableColumnsFilter() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return true;
    },
    disableEditBtn() {
      return (row) => {
        const { source } = row;
        if (this.$platform.isNafmiiEnv()) {
          return !this.isFileSourceByLocalUpload(source);
        }
        return false;
      };
    },
    routeFrom() {
      return ROUTE_NAME_MAP[this.$route.name];
    },
  },
  watch: {
    '$route.params.treeId'() {
      this.clearSelection();
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.clearSelection();
  },
  methods: {
    formatSecondToHms,
    getConfirmStatusText,
    isFileSourceByLocalUpload,
    init() {
      this.setScrollTop();
      this.setDefaultTableColumns();
      this.fetchAllSchemas();
    },
    getReviewStatusText(row) {
      const statusKey = getAuditStatus(row);
      return getAuditStatusTextByKey(statusKey);
    },
    getFormDataFromParams(scenario_id, task_type) {
      const result = llmParamsUtils.getMethodsByTaskTypeDisplay(
        task_type,
        scenario_id,
      );

      // 将 audit_methods 重命名为 review_methods
      const { audit_methods, ...rest } = result;
      const finalResult = {
        ...rest,
        review_methods: audit_methods,
      };

      // 如果没有方法，返回默认值 ['-']
      if (finalResult.process_methods.length === 0) {
        finalResult.process_methods = ['-'];
      }
      if (finalResult.review_methods.length === 0) {
        finalResult.review_methods = ['-'];
      }

      return finalResult;
    },

    setDefaultTableColumns() {
      const tableColumnsHidden =
        this.$features.getFileListDefaultHiddenTableColumns();
      let tableColumns = this.tableColumns
        .filter((item) => !tableColumnsHidden.includes(item.key))
        .map((item) => item.key);

      const tableColumnsFromStorage = JSON.parse(
        window.sessionStorage.getItem(CGS_FILE_LIST_TABLE_COLUMNS),
      );

      if (this.$isAllowed('showFileScenario')) {
        tableColumns = tableColumns.filter((item) => item !== 'schema');
      }

      if (tableColumnsFromStorage) {
        tableColumns = tableColumnsFromStorage;
      }

      this.tableColumnsSelected = tableColumns;
      this.tableColumnsSelectedTemp = tableColumns;
    },
    formatterTagProcess(row) {
      if (row.molds && row.molds.length > 0 && !row.isDir) {
        return '';
      } else {
        return row.progress || '';
      }
    },
    getMarkNums(question) {
      const { ai_status, origin_health, health } = question;
      if (ai_status === AI_PREDICT_STATUS_MAP.DISABLED) {
        return '';
      }
      if (health === null) {
        return `0/${origin_health}`;
      } else {
        return `${origin_health - health}/${origin_health}`;
      }
    },
    getStatus(question) {
      if (
        question.isDir ||
        question.ai_status === AI_PREDICT_STATUS_MAP.DISABLED
      ) {
        return '';
      }
      const text = questionStatus[question.status];
      return text ? this.$t(`message['${text}']`) : '';
    },
    getLatestTime(questions) {
      return Math.max(...questions.map((item) => item.updated_utc));
    },
    getIcon(fileName) {
      return convertFileTypeToIcon(getFileTypeByName(fileName));
    },
    convertFileTypeToIcon(fileType) {
      return convertFileTypeToIcon(fileType);
    },
    getAIStatusText(status) {
      const aiStatus = this.$options.filters.presetAnswerStatus(status);
      return !aiStatus ? '-' : this.$t(`message['${aiStatus}']`);
    },
    getAIStatusClassName(status) {
      if (status === AI_PREDICT_STATUS_MAP.FAILED) {
        return 'failed';
      }
    },
    // 打开目录 或 跳转到标注页面
    openDir(file) {
      if (!this.$root.isClick) {
        return;
      }
      if (file.isDir) {
        // Warning: 根目录下，目录id是rtree_id字段，子目录下，目录id是id字段
        this.$emit('open-dir', file.rtree_id || file.id);
      } else {
        if (!this.checkRowCanExpand(file)) {
          return;
        }
        if (this.$isAllowed('remark')) {
          if (this.$platform.isCmfchinaEnv()) {
            this.previewFileByInspect(file);
            return;
          }
          this.$refs.table.toggleRowExpansion(file);
        } else {
          this.$emit('open-dir', file);
        }
      }
    },
    openFilePopup(file) {
      this.$emit('open-file-popup', file);
    },
    getPdfParseStatusClassName(status) {
      if (status === pdfParseStatus.failed) {
        return 'failed';
      } else if (status === pdfParseStatus.exception) {
        return 'exception';
      }
    },
    getPdfParseStatus(status) {
      const pdfParseStatus = this.$options.filters.pdfParseStatus(status);
      return !pdfParseStatus ? '-' : this.$t(`message['${pdfParseStatus}']`);
    },
    getAIPredictionSummaryStatus(file) {
      const questions = file.questions || {};
      if (file.isDir || questions.length === 0) {
        return '-';
      }
      const questionGroups = _.groupBy(questions, 'ai_status');
      return Object.keys(questionGroups)
        .map((key) => {
          const item = {
            text: this.$t(`message['${AI_PREDICT_STATUS_TEXT_MAP[key]}']`),
            count: questionGroups[key].length,
            class: `ai-status-${key}`,
          };
          return `<p class="${item.class}">${item.text}: ${item.count}</p>`;
        })
        .join('');
    },
    getAIPredictIconName(status, file) {
      const newStatus = this.calcQuestionAIStatus(status, file);
      return AI_PREDICT_STATUS_ICON_NAME_MAP[newStatus];
    },
    getAIPredictionText(status, file) {
      const newStatus = this.calcQuestionAIStatus(status, file);
      return this.$t(`message['${AI_PREDICT_STATUS_TEXT_MAP[newStatus]}']`);
    },
    calcQuestionAIStatus(status, file) {
      let finalStatus = status;
      if (
        status === AI_PREDICT_STATUS_MAP.FINISHED &&
        [
          pdfParseStatus.parsing,
          pdfParseStatus.parsing_time,
          pdfParseStatus.parsed,
        ].includes(file.pdf_parse_status)
      ) {
        finalStatus = AI_PREDICT_STATUS_MAP.DOING;
      }
      return finalStatus;
    },
    getRowClassName({ row }) {
      const classList = [];

      if (this.checkRowCanExpand(row)) {
        classList.push('row-expand-enable');
      }

      const { from, fileId } = this.$route.query;
      const needHighlightRow =
        ['search', 'filed', 'panorama'].includes(from) && row.id === fileId;
      if (needHighlightRow) {
        classList.push('row-highlight');
        this.$nextTick(() => {
          const searchMatchRowEl = this.$refs.table.$el.querySelector(
            'tbody > tr.row-highlight',
          );
          if (searchMatchRowEl && this.needScrollToSearchMatchedRow) {
            setTimeout(() => {
              searchMatchRowEl.scrollIntoView({
                block: 'center',
              });
              searchMatchRowEl.addEventListener('animationend', () => {
                this.needScrollToSearchMatchedRow = false;
              });
            }, 200);
          }
        });
      }

      return classList;
    },
    getTaskTypeNames({ task_type, isDir }) {
      if (isDir) {
        return '-';
      }
      const taskTypeMap = {
        extract: '提取',
        audit: '提取+审核',
        clean_file: '清稿判定',
      };
      const text = taskTypeMap[task_type] || '-';
      return [text];
    },
    showCleanFileTooltip(row) {
      return (
        row.task_type === 'clean_file' &&
        row.meta_info.clean_file &&
        Object.keys(row.meta_info.clean_file).length > 0
      );
    },
    formatCleanFileInfo(info) {
      const keys = {
        blank_pages: '为空白页，已删除',
        comment_pages: '存在批注，已删除',
        revisions: '存在修订',
      };
      return (
        Object.keys(keys)
          .reduce((result, key) => {
            if (_.isEmpty(info[key])) {
              return result;
            }

            let pages = '';
            let description = keys[key];

            if (key === 'revisions' && !_.isEmpty(info[key])) {
              pages = '';
            } else {
              pages = info[key]?.map((item) => `第${item}页`).join('、') || '';
            }

            result.push(`${pages}${description}`);

            return result;
          }, [])
          .join('\n') || '无清稿信息'
      );
    },
    getSysFromName(sysfrom) {
      let item = this.sysfromOptions.find((item) => item.value === sysfrom);
      if (item) {
        return item.label;
      }

      return '本地上传';
    },
    getSourceName(source) {
      let item = this.sourceOptions.find((item) => item.value === source);
      if (item) {
        return item.label;
      }

      return '本地上传';
    },
    translate(text) {
      return this.$t(`message['${text}']`);
    },
    handleChangePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      if (!_.isEmpty(this.$route.query) && this.$route.name !== 'fileSearch') {
        // if (!this.$platform.isNafmiiEnv()) {
        //   this.$router.replace({
        //     query: {},
        //   });
        // }
        this.$emit('change-page', page);
      } else {
        this.$emit('change-page', page);
        this.clearSelection();
      }
    },
    handleChangeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.$emit('change-size', size);
      this.clearSelection();
    },
    showColumn(name) {
      return this.tableColumnsSelected.includes(name);
    },
    selectTableColumns() {
      this.tableColumnsSelected = this.tableColumnsSelectedTemp;
      this.tableColumnsFilterVisible = false;
      window.sessionStorage.setItem(
        CGS_FILE_LIST_TABLE_COLUMNS,
        JSON.stringify(this.tableColumnsSelected),
      );
    },
    filterFilesByCondition(field, value) {
      if (field === 'sysfrom') {
        this.filterSysfrom = value;
      }

      if (field === 'source') {
        this.filterSource = value;
      }

      if (value === 'all') {
        value = '';
      }

      EventBus.$emit('filter-files-by-condition', {
        field,
        value,
      });
    },
    checkRowCanExpand(row) {
      if (!this.$isAllowed('remark')) {
        return false;
      }
      if (row.isDir) {
        return false;
      }
      return (
        Array.isArray(row.questions) &&
        row.questions.length > 0 &&
        (!this.$features.supportLLMExtract() ||
          row.questions.some((q) => q.mold_type !== SCHEMA_TYPE.LLM.value))
      );
    },
    handleChangeSelection(selection) {
      this.$emit('change-selection', selection);
    },
    clearSelection() {
      this.$emit('change-selection', []);
      this.$refs.table.clearSelection();
    },
    handleChangeExpand(row, expandedRows) {
      const expandedRowKeys = expandedRows.map((row) => row.id);
      this.$emit('change-expand', expandedRowKeys);
    },
    handleChangeSort({ prop, order }) {
      const sortParams = getSortParams(prop, order);
      this.$emit('change-sort', sortParams);
      this.handleChangePage(1);
    },
    setScrollTop() {
      this.$nextTick(() => {
        window.scrollTo(0, this.scrollTop);
      });
    },
    gotoCleanfilePage(row) {
      this.$router.push({
        name: 'cleanfile',
        params: {
          projectId: row.pid,
          treeId: row.tree_id,
          fileId: row.id,
        },
      });
    },
    async downloadOriginFile(file) {
      try {
        this.$set(file, 'originFileDownloading', true);
        const res = await downloadOriginFile(file.id, this.routeFrom);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.$set(file, 'originFileDownloading', false);
      }
    },
    async downloadReviseFile(file) {
      const { id } = file;
      if (!this.canDownloadAnnotationFile(file)) {
        return;
      }
      try {
        this.$set(file, 'reviseFileDownloading', true);
        let downloadReviseFileApi;
        if (this.$platform.isNafmiiEnv()) {
          downloadReviseFileApi = nafmiiApi.downloadReviseFile;
        }
        const res = await downloadReviseFileApi(id, this.routeFrom);
        await downloadFileByBlob(res);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.$set(file, 'reviseFileDownloading', false);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.file-list-wrapper {
  width: 100%;
  .column-filter-ref {
    width: 14px;
    height: 14px;
    vertical-align: sub;
    margin-left: 10px;
    cursor: pointer;
  }
  .el-table {
    ::v-deep .el-table__header {
      .cell {
        width: auto;
        word-break: break-word;
        .el-button {
          margin-left: 5px;
          border: none;
          i {
            font-size: 14px;
            vertical-align: middle;
          }
        }
        .el-dropdown {
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    ::v-deep .el-table__row {
      &.row-expand-enable {
        cursor: pointer;
      }

      &:not(.row-expand-enable) {
        .el-table__expand-icon {
          visibility: hidden;
        }
      }

      .cell {
        padding: 0;
        text-overflow: initial;
        .failed {
          color: #ea0e0e;
        }
        .exception {
          color: #ffa700;
        }
        .far {
          font-size: 16px;
        }
        .cell-icon {
          width: 10px;
          height: 10px;
        }

        .ai-status {
          margin: 5px 0;
          > span:first-child {
            margin-right: 5px;
          }
          .el-tag {
            vertical-align: text-top;
            &.el-tag--default {
              border-color: #0090c080;
            }
            &.el-tag--info {
              border-color: #9ea0a580;
            }
            &.el-tag--success {
              border-color: #67c23a80;
            }
            &.el-tag--warning {
              border-color: #f2af6d80;
            }
            &.el-tag--danger {
              border-color: #e7585880;
            }
          }
          .ai-status-1 {
            width: 10px;
            height: 10px;
            animation: rotate 1s linear infinite;
            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          }
          .ai-status-2 {
            color: #f56c6c;
          }
          .ai-status-3 {
            color: $--color-primary;
          }
        }
        > span:not(.el-tag) {
          white-space: initial;
          &.model-disabled {
            color: #6200ff;
          }
        }
      }
      .el-table-column--selection {
        .cell {
          padding: 0;
        }
      }
      .list-item-title {
        color: #606266;
        text-decoration: none;
      }
      .scene_and_ai_status {
        .question {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mold-name {
          margin-right: 5px;
        }
      }
      .manager-name {
        .cell {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .filename {
        font-size: 14px;
        font-family: Arial;
        word-break: break-all;
        &:hover {
          .file-download-icon {
            visibility: visible;
          }
        }
        .file-download-icon {
          visibility: hidden;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .el-icon-error {
        font-size: 14px;
        color: #f56c6c;
      }
      .el-icon-remove {
        font-size: 14px;
      }
      .el-tag {
        max-width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        &.tag-filesize {
          height: 16px;
          line-height: 15px;
          padding: 0 2px;
          background-color: transparent;
          border-color: #6200ff;
          color: #6200ff;
          border-radius: 2px;
          vertical-align: text-top;
        }
      }
      .el-tooltip:not(.is-disabled) {
        cursor: pointer;
      }
    }
    ::v-deep .el-table__expanded-cell {
      padding: 0;
    }

    .operations {
      display: flex;
      align-items: center;
      height: 23px;
    }

    .parse-status {
      span {
        position: relative;
      }
      .el-icon-info {
        position: absolute;
        top: 5px;
        margin-left: 1px;
      }
    }
  }
  .el-pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>

<style lang="scss">
.el-popover.table-columns-filter {
  padding: 0;
  .title {
    padding: 15px 10px;
    border-bottom: 1px solid #0000000f;
  }
  .el-checkbox-group {
    padding: 10px 20px;
    .el-checkbox {
      min-width: 140px;
      margin: 5px 0;
    }
  }
  .btns {
    padding: 12px 0;
    text-align: center;
    border-top: 1px solid #0000000f;
  }
}
.cleanfile-tooltip {
  max-width: 300px;
  .content {
    white-space: pre-line;
    line-height: 20px;
  }
}
.cleanfile-download-popover,
.file-download-popover {
  width: 80px;
  min-width: 80px !important;
  .download-link {
    display: flex;
    flex-flow: column;
    .el-button {
      margin-left: 0;
      padding: 5px;
      text-align: left;
      text-decoration: none;
      color: #666;
      font-size: 13px;
      > span {
        margin-left: 0;
      }
      &:hover {
        cursor: pointer;
        background-color: #f1f1f1;
        color: $--color-primary;
      }
      &.is-disabled {
        cursor: not-allowed;
        color: #afacac;
        background-color: #fff;
      }
      .el-icon-loading {
        position: absolute;
        top: calc(50% - 6px);
        right: 0;
        font-size: 12px;
      }
    }
  }
}
.parse-status-tooltip {
  max-width: 240px;
  border: 0 !important;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  .popper__arrow {
    border: 0 !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
