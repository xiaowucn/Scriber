<template>
  <div
    :class="['audit-wrapper', readonlyMode ? 'readonly' : '']"
    v-loading="loading">
    <div class="main-container">
      <div class="aside">
        <div v-if="!readonlyMode" class="filter">
          <el-radio-group v-model="filterFieldsBy" @change="changeFilterBy">
            <el-radio
              v-for="(option, index) in filterFieldsOptions"
              :key="index"
              :label="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </div>
        <el-table
          v-if="auditAnswer.productInfo.length > 0"
          ref="productInfoTable"
          :key="auditAnswer.productInfo.length"
          :data="auditAnswer.productInfo"
          :row-key="(row) => row.md5"
          :row-class-name="getRowClassName"
          :span-method="spanMethod">
          <el-table-column prop="classification" label="分类" width="100">
            <template slot-scope="{ row }">
              <i
                :class="[
                  'el-icon-arrow-down',
                  row.collapsed ? 'collapsed' : '',
                ]"
                @click="toggleRows(row)"></i>
              {{ row.classification }}
            </template>
          </el-table-column>
          <el-table-column prop="fieldCodeDesc" label="字段名称" width="120">
            <template slot-scope="{ row, $index }">
              <el-tooltip
                :disabled="row.equal"
                class="item"
                effect="dark"
                content="字段识别不一致"
                placement="top">
                <span :class="{ 'not-equal': !row.equal }">
                  {{ row.fieldCodeDesc }}
                </span>
              </el-tooltip>
              <i
                v-if="row.noticeValue === row.noticeValueAlter"
                class="icon-ai"></i>
              <i v-else class="icon-edit"></i>
              <el-button
                v-if="showAddRowButton(row, $index)"
                type="text"
                icon="el-icon-circle-plus icon-plus"
                @click="addRow(row, $index)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="linkSystemDesc" label="" min-width="60">
            <template slot-scope="{ row }">
              {{ row.linkSystemDesc || '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="zytValueDesc"
            label="招赢通数据"
            min-width="150">
            <template slot="header" slot-scope="{}">
              <el-checkbox
                v-if="!readonlyMode"
                :value="allChecked('zyt')"
                :indeterminate="allIndeterminate('zyt')"
                @change="($event) => checkAll($event, 'zyt')"></el-checkbox>
              招赢通数据
            </template>
            <template slot-scope="{ row }">
              <div>
                <div class="cell-top">
                  <el-checkbox
                    size="mini"
                    :disabled="!editable(row)"
                    true-label="zyt"
                    false-label=""
                    v-model="row.checkValue">
                  </el-checkbox>
                  <template>
                    <span
                      v-if="!isLevelThreshold(row)"
                      class="text"
                      :title="row.zytValueDesc">
                      {{ row.zytValueDesc || '无数据' }}
                    </span>
                    <span
                      v-if="isLevelThreshold(row)"
                      class="text"
                      :title="row.zytThresholdType">
                      {{
                        getKeyByValue(row.zytThresholdType, '升降级阈值类型') ||
                        '无数据'
                      }}
                    </span>
                  </template>
                </div>
                <div v-if="isLevelThreshold(row)" class="level-threshold">
                  <span>升降级别：{{ row.zytValue || '无数据' }}</span>
                </div>
                <div class="date" v-if="row.zytStartDate || row.zytEndDate">
                  <span v-if="row.zytStartDate">{{ row.zytStartDate }}</span>
                  <span v-if="row.zytStartDate && row.zytEndDate"> ~ </span>
                  <span v-if="row.zytEndDate">{{ row.zytEndDate }}</span>
                </div>
                <div class="range" v-if="row.isRange">
                  <span>
                    {{ row.zytRangeMin || '无数据' }}
                    {{ getKeyByValue(row.zytRangeMinUnit, '最小值单位') }}
                  </span>
                  <span class="condition">
                    &lt;= {{ rangeLabel(row, 'zyt') }} &lt;
                  </span>
                  <span>
                    {{ row.zytRangeMax || '无数据' }}
                    {{ getKeyByValue(row.zytRangeMaxUnit, '最大值单位') }}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="noticeValueDescAlter"
            label="公告关键字"
            min-width="150">
            <template slot="header" slot-scope="{}">
              <el-checkbox
                v-if="!readonlyMode"
                :value="allChecked('notice')"
                :indeterminate="allIndeterminate('notice')"
                @change="($event) => checkAll($event, 'notice')"></el-checkbox>
              公告关键字
            </template>
            <template slot-scope="{ row }">
              <div>
                <div class="cell-top">
                  <el-checkbox
                    size="mini"
                    true-label="notice"
                    false-label=""
                    :disabled="!editable(row)"
                    v-model="row.checkValue">
                  </el-checkbox>
                  <template>
                    <el-select
                      v-if="row.isEnum"
                      v-model="row.enumSelected"
                      :disabled="!editable(row)"
                      :multiple="row.isEnumMultiSelect"
                      size="mini"
                      placeholder="无数据"
                      @change="($event) => changeNoticeValueAlter($event, row)">
                      <el-option
                        v-for="value in row.enumValues"
                        :key="value"
                        :label="value"
                        :value="value">
                      </el-option>
                    </el-select>
                    <span v-else class="text" :title="row.noticeValueDescAlter">
                      {{
                        row.noticeValueDescAlter !== null
                          ? row.noticeValueDescAlter
                          : '无数据'
                      }}
                    </span>
                  </template>
                  <el-tooltip
                    v-if="!readonlyMode"
                    :disabled="!editable(row)"
                    class="item"
                    effect="dark"
                    :content="
                      row.isEnum
                        ? '修改枚举数值对应的原文内容'
                        : '编辑并重新标记'
                    "
                    placement="right">
                    <el-popover
                      v-model="row.editing"
                      :popper-class="getEditingPopoverClass(row)"
                      placement="top"
                      width="180"
                      trigger="manual">
                      <el-input
                        v-model="editingText"
                        :ref="`editInput-${row.md5}`"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 10 }"
                        size="mini"
                        :autofocus="true"
                        @focus="focusInput(row)"
                        @keydown.enter.native="
                          ($event) => saveEditingAnswer($event, row)
                        "
                        @keyup.native="
                          ($event) => handleKeyupEvent($event, row, 'value')
                        "></el-input>
                      <div v-if="isLevelThreshold(row)" class="level-threshold">
                        <el-input
                          v-model="editingLevel"
                          :ref="`editInput-${row.md5}-level`"
                          size="mini"
                          placeholder="升降级别"
                          @focus="focusLevelInput(row)"
                          @keydown.enter.native="
                            ($event) => saveEditingAnswer($event, row)
                          "
                          @keyup.native="
                            ($event) => handleKeyupEvent($event, row, 'level')
                          ">
                        </el-input>
                      </div>
                      <div v-if="row.isRange" class="range">
                        <el-input
                          v-model="editingRangeMin"
                          :ref="`editInput-${row.md5}-min`"
                          size="mini"
                          :placeholder="
                            isLevelThreshold(row) ? '最小值' : '起始值'
                          "
                          @focus="focusRangeInput(row, 'min')"
                          @keydown.enter.native="
                            ($event) => saveEditingAnswer($event, row)
                          "
                          @keyup.native="
                            ($event) => handleKeyupEvent($event, row, 'min')
                          "></el-input>
                        <el-select
                          v-if="isLevelThreshold(row)"
                          v-model="editingRangeMinUnit"
                          placeholder="单位">
                          <el-option
                            v-for="unit in row.rangeMinUnitOptions"
                            :key="unit.value"
                            :label="unit.label"
                            :value="unit.value">
                          </el-option>
                        </el-select>
                        <span>&lt;= {{ rangeLabel(row, 'notice') }} &lt;</span>
                        <el-input
                          v-model="editingRangeMax"
                          :ref="`editInput-${row.md5}-max`"
                          size="mini"
                          :placeholder="
                            isLevelThreshold(row) ? '最大值' : '结束值'
                          "
                          @focus="focusRangeInput(row, 'max')"
                          @keydown.enter.native="
                            ($event) => saveEditingAnswer($event, row)
                          "
                          @keyup.native="
                            ($event) => handleKeyupEvent($event, row, 'max')
                          "></el-input>
                        <el-select
                          v-if="isLevelThreshold(row)"
                          v-model="editingRangeMaxUnit"
                          placeholder="单位">
                          <el-option
                            v-for="unit in row.rangeMaxUnitOptions"
                            :key="unit.value"
                            :label="unit.label"
                            :value="unit.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="btns">
                        <el-button
                          size="mini"
                          @click.stop="cancelEditingAnswer(row)">
                          取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click.stop="
                            ($event) => saveEditingAnswer($event, row)
                          ">
                          确定
                        </el-button>
                      </div>
                      <el-button
                        v-if="!readonlyMode"
                        slot="reference"
                        type="text"
                        size="mini"
                        :class="[
                          'btn-edit',
                          row.md5 === currentEditingRow.md5 ? 'active' : '',
                        ]"
                        :disabled="!editable(row)"
                        @click.stop="editAnswer(row)">
                        <i class="fa fa-edit"></i>
                      </el-button>
                    </el-popover>
                  </el-tooltip>
                  <el-popover
                    v-if="row.noticeValue !== row.noticeValueAlter"
                    placement="top"
                    trigger="hover"
                    popper-class="value-diff-popover">
                    <div class="content">
                      <p>AI识别: {{ row.noticeValueDesc }}</p>
                      <p>人工校验为: {{ row.noticeValueDescAlter }}</p>
                    </div>
                    <i
                      slot="reference"
                      class="el-icon-warning value-diff-icon"></i>
                  </el-popover>
                </div>
                <div
                  class="date"
                  v-if="row.noticeStartDate || row.noticeEndDate">
                  <span v-if="row.noticeStartDate">
                    {{ row.noticeStartDate }}
                  </span>
                  <span v-if="row.noticeStartDate && row.noticeEndDate">
                    ~
                  </span>
                  <span v-if="row.noticeEndDate">{{ row.noticeEndDate }}</span>
                </div>
                <div v-if="isLevelThreshold(row)" class="level-threshold">
                  <span>升降级别：{{ row.noticeValueAlter || '无数据' }}</span>
                </div>
                <div v-if="row.isRange" class="range">
                  <span>
                    {{ row.noticeRangeMin || '无数据' }}
                    {{ getKeyByValue(row.noticeRangeMinUnit, '最小值单位') }}
                  </span>
                  <span class="condition">
                    &lt;= {{ rangeLabel(row, 'notice') }} &lt;
                  </span>
                  <span>
                    {{ row.noticeRangeMax || '无数据' }}
                    {{ getKeyByValue(row.noticeRangeMaxUnit, '最大值单位') }}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80" align="right">
            <template slot-scope="{ row, $index }">
              <el-tooltip
                :disabled="row.data !== undefined"
                effect="dark"
                content="数据字段未匹配，无法溯源"
                placement="top">
                <el-button
                  type="text"
                  size="medium"
                  :disabled="viewDataButtonDisabled(row)"
                  @click="viewData(row)">
                  追溯
                </el-button>
              </el-tooltip>
              <el-button
                v-if="showDeleteRowButton(row, $index)"
                type="text"
                size="medium"
                @click="deleteRow(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty
          v-else
          description="当前暂无数据展示，请稍后手动刷新页面再次查看"></el-empty>
      </div>
      <div class="pdf-viewer-wrapper">
        <file-pdf-viewer-container
          v-if="viewerReady"
          ref="pdfViewerContainer"
          :file-id="fileId"
          :file-info="fileInfo"
          :default-scale="1.1">
        </file-pdf-viewer-container>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import md5 from 'blueimp-md5';
import { normalizeArrayJSON } from '@/utils';
import FilePdfViewerContainer from '@/components/remark/FilePdfViewerContainer';
import { fetchFilePageInfo, fetchFileOutline } from '@/store/api/file.api';
import { fetchQuestion } from '@/store/api/remark.api';
import { fetchAuditAnswer, submitAnswer } from '@/store/api/cmbchina.api';
import EventBus from '@/components/remark/remark-tree/EventBus';

const enumValuesMap = {
  机构: 0,
  个人: 1,
  产品: 2,

  公募: 'GM',
  私募: 'SM',

  年: 'YEAR',
  月: 'MONTH',
  周: 'WEEK',
  天: 'DAY',

  是: 'Y',
  否: 'N',

  合并: 'merge',
  分级: 'graded',

  最短: 'SHORT',
  滚动: 'CUSTOMER',
  不限: 'NULL',

  份额: 0,
  金额: 1,
};

const fieldValueMap = {
  升降级阈值类型: {
    按持有份额: 'P',
    按持有净资产: 'N',
    按持有期限: 'T',
  },
  最小值单位: {
    份: 'P',
    元: 'A',
    天: 'D',
    周: 'W',
    月: 'm',
    年: 'Y',
  },
  最大值单位: {
    份: 'P',
    元: 'A',
    天: 'D',
    周: 'W',
    月: 'm',
    年: 'Y',
  },
};

export default {
  name: 'audit-data',
  components: {
    FilePdfViewerContainer,
  },
  props: {
    fileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      fileInfo: null,
      viewerReady: false,
      filterFieldsBy: 'all',
      filterFieldsOptions: [
        {
          value: 'all',
          label: '全部字段',
        },
        {
          value: 'not-equal',
          label: '仅展示有差异字段',
        },
      ],
      auditAnswer: {
        productInfo: [],
      },
      questionData: {},
      mergeColumnsName: ['classification', 'fieldCodeDesc'],
      mergeRows: {},
      editingText: '',
      editingRangeMin: '',
      editingRangeMax: '',
      editingLevel: '',
      editingRangeMinUnit: '',
      editingRangeMaxUnit: '',
      currentEditingRow: {},
      currentEditingRowRangeMin: {},
      currentEditingRowRangeMax: {},
      currentEditingRowLevel: {},
      submitLoading: false,
      postMessageOrigin: '',
      postMessageData: {},
      tableScrollTop: 0,
    };
  },
  computed: {
    readonlyMode() {
      return this.$route.query.view === 'readonly';
    },
    allChecked() {
      return (value) => {
        const { checkedCount, checkableCount } = this.getCheckedCount(value);
        return checkedCount === checkableCount;
      };
    },
    allIndeterminate() {
      return (value) => {
        const { checkedCount, checkableCount } = this.getCheckedCount(value);
        if (checkedCount === 0) {
          return false;
        }
        return checkableCount > 0 && checkedCount < checkableCount;
      };
    },
    viewDataButtonDisabled() {
      return (row) => {
        return (
          !row.data || row.data.length === 0 || row.data[0].boxes.length === 0
        );
      };
    },
    showAddRowButton() {
      return (row, index) => {
        if (this.filterFieldsBy === 'not-equal') {
          return false;
        }
        return (
          !this.readonlyMode &&
          row.isRange &&
          this.mergeRows.fieldCodeDesc[index] < 10
        );
      };
    },
    showDeleteRowButton() {
      return (row, index) => {
        return (
          !this.readonlyMode &&
          row.isRange &&
          this.mergeRows.fieldCodeDesc[index] === 0
        );
      };
    },
    isLevelThreshold() {
      return (row) => {
        return row.fieldCode === 'levelThreshold';
      };
    },
    rangeLabel() {
      return (row, type) => {
        if (this.isLevelThreshold(row)) {
          let label = '';
          if (type === 'zyt') {
            label = this.getKeyByValue(row.zytThresholdType, '升降级阈值类型');
          } else if (type === 'notice') {
            label = row.enumSelected;
          }
          return label?.replace(/^按/, '') || '无数据';
        }
        return '购买金额';
      };
    },
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
    EventBus.$on('create-answer-item', this.createAnswer);
    window.addEventListener('message', this.handleMessageEvent);
  },
  beforeDestroy() {
    EventBus.$off('create-answer-item', this.createAnswer);
    window.removeEventListener('message', this.handleMessageEvent);
  },
  methods: {
    async init() {
      try {
        this.loading = true;
        await Promise.all([
          this.getFileInfo(this.fileId),
          this.getAuditAnswer(),
        ]);
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
    async getAuditAnswer() {
      try {
        const params = { productCode: this.$route.query.productCode };
        const { data: auditAnswer } = await fetchAuditAnswer(
          this.fileId,
          params,
        );
        const { data: questionData } = await fetchQuestion(auditAnswer.qid);
        this.questionData = questionData;
        this.auditAnswer = {
          ...auditAnswer,
          productInfo: this.convertAuditAnswerProductInfo(
            auditAnswer.productInfo,
            questionData.answer,
          ),
        };
        this.auditAnswer.productInfoOriginal = this.auditAnswer.productInfo;
        this.changeFilterBy(this.filterFieldsBy);
        this.getTableSpanArr(this.auditAnswer.productInfo);
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    convertAuditAnswerProductInfo(data, answer) {
      const typeMap = {
        basic: '基本信息',
        limit: '限额信息',
        fee: '费率信息',
      };
      return data.map((item) => {
        const answerItem = answer?.userAnswer.items.find((i) => {
          return md5(normalizeArrayJSON(i.key)) === item.md5;
        });
        if (answerItem) {
          item.key = answerItem.key;
          item.data = answerItem.data;
          item.value = answerItem.value;
          item.schema = answerItem.schema;
          item.isEnum = this.isEnumField(answer.schema, item.schema.data.label);
          item.isEnumMultiSelect = this.isEnumMultiSelect(
            answer.schema,
            item.schema.data.label,
          );
          item.enumSelected =
            item.isEnumMultiSelect && item.noticeValueDescAlter !== ''
              ? item.noticeValueDescAlter?.split(';')
              : item.noticeValueDescAlter;
          item.enumValues = this.getEnumValues(answerItem.schema.data.label);
          if (this.isLevelThreshold(item)) {
            item.enumSelected = this.getKeyByValue(
              item.noticeThresholdType,
              '升降级阈值类型',
            );
            item.rangeMinUnitOptions = this.getEnumValues('最小值单位');
            item.rangeMaxUnitOptions = this.getEnumValues('最大值单位');
          }
        }
        this.setEqual(item);
        return {
          ...item,
          classification: typeMap[item.infoType],
          collapsed: false,
          hidden: false,
          editing: false,
          editingRange: '',
          rangeMinData: [],
          rangeMaxData: [],
          rangeLevelData: [],
        };
      });
    },
    getKeyByValue(value, type) {
      return _.findKey(fieldValueMap[type], (v) => v === value);
    },
    getAnswerItemText(data) {
      if (!data) {
        return '';
      }
      return data[0]?.text || data[0]?.boxes.map((box) => box.text).join('');
    },
    isEnumField(schema, field) {
      return schema.schema_types.some(
        (schema) => schema.label === field && schema.type === 'enum',
      );
    },
    isEnumMultiSelect(schema, field) {
      const currentEnum = schema.schema_types.find(
        (schema) => schema.label === field,
      );
      return currentEnum?.isMultiSelect || false;
    },
    getEnumValues(label) {
      const enumType = this.questionData.answer.schema.schema_types.find(
        (s) => s.label === label,
      );
      if (enumType) {
        if (['最小值单位', '最大值单位'].includes(label)) {
          return enumType.values.map((v) => {
            return {
              value: fieldValueMap[label][v.name],
              label: v.name,
            };
          });
        }
        return enumType.values.map((v) => v.name);
      }
      return [];
    },
    async getFileInfo(fileId) {
      const [pageInfo, outline, filePath] = await Promise.all([
        this.getFilePageInfo(fileId),
        this.getFileOutline(fileId),
      ]);
      this.fileInfo = {
        fileId,
        pageInfo,
        outline,
        ...filePath,
      };
      this.viewerReady = true;
    },
    async getFilePageInfo(fileId) {
      try {
        const res = await fetchFilePageInfo(fileId);
        const pageInfo = res.data;
        return pageInfo;
      } catch (error) {
        return [
          {
            page: 0,
            width: 595,
          },
        ];
      }
    },
    async getFileOutline(fileId) {
      try {
        const res = await fetchFileOutline(fileId);
        const outline = {
          items: res.data?.children || [],
        };
        return outline;
      } catch (error) {
        return { items: [] };
      }
    },
    checkAll(checked, value) {
      this.auditAnswer.productInfo
        .filter((item) => !item.readOnly)
        .forEach((item) => {
          item.checkValue = checked ? value : '';
        });
    },
    getCheckedCount(value) {
      const checkableCount = this.auditAnswer.productInfo.filter(
        (item) => !item.readOnly,
      ).length;
      const checkedCount = this.auditAnswer.productInfo.filter(
        (item) => !item.readOnly && item.checkValue === value,
      ).length;
      return { checkableCount, checkedCount };
    },
    changeFilterBy(val) {
      if (val === 'all') {
        this.auditAnswer.productInfo = this.auditAnswer.productInfoOriginal;
      } else if (val === 'not-equal') {
        this.auditAnswer.productInfo =
          this.auditAnswer.productInfoOriginal.filter((row) => !row.equal);
      }
      this.setRowsHidden();
      this.getTableSpanArr(this.auditAnswer.productInfo);
    },
    setRowsHidden() {
      const rowGroups = _.groupBy(this.auditAnswer.productInfo, 'infoType');
      Object.values(rowGroups).forEach((rows) => {
        rows.forEach((row, index) => {
          if (index === 0) {
            row.hidden = false;
          } else {
            row.hidden = row.collapsed;
          }
        });
      });
    },
    toggleRows(row) {
      row.collapsed = !row.collapsed;

      const otherSameInfoTypeRows = this.auditAnswer.productInfoOriginal.filter(
        (item) => item.infoType === row.infoType && item.md5 !== row.md5,
      );
      otherSameInfoTypeRows.forEach((item) => {
        item.hidden = row.collapsed;
        item.collapsed = row.collapsed;
      });
    },
    getEditingPopoverClass(row) {
      const classList = ['edit-audit-answer-popover'];
      if (row.isRange) {
        classList.push('has-range');
      }
      if (this.isLevelThreshold(row)) {
        classList.push('has-level-threshold');
      }
      return classList.join(' ');
    },
    getRowClassName({ row }) {
      const classList = [];
      if (!this.readonlyMode && this.isUnchecked(row)) {
        classList.push('unchecked');
      }
      classList.push(row.infoType);
      return classList;
    },
    getTableSpanArr(data) {
      this.mergeColumnsName.forEach((key) => {
        let count = 0;
        this.mergeRows[key] = [];
        data.forEach((item, index) => {
          if (index === 0 || item[key] !== data[index - 1][key]) {
            count = index;
            this.mergeRows[key].push(1);
          } else {
            this.mergeRows[key][count] += 1;
            this.mergeRows[key].push(0);
          }
        });
      });
    },
    spanMethod({ column, row, rowIndex }) {
      if (row.hidden) {
        return [0, 0];
      }

      if (this.mergeColumnsName.includes(column.property)) {
        const rowSpan = this.mergeRows[column.property][rowIndex];
        const columnSpan = rowSpan > 0 ? 1 : 0;
        return [rowSpan, columnSpan];
      }
    },
    editable(row) {
      return !this.readonlyMode && row.readOnly === false;
    },
    setNodeSelected(label) {
      EventBus.$emit('schema-node-selected', {
        model: {
          data: { label },
          meta: {
            _deepIndex: [0],
            _deepLabels: [label],
          },
          children: [],
        },
      });
    },
    editAnswer(row) {
      this.auditAnswer.productInfo.forEach((item) => {
        item.editing = false;
      });
      row.editing = true;
      this.currentEditingRow = row;
      this.editingText = row.isEnum
        ? this.getAnswerItemText(row.data)
        : row.noticeValueDescAlter;
      this.editingRangeMin = row.noticeRangeMin;
      this.editingRangeMax = row.noticeRangeMax;
      if (this.isLevelThreshold(row)) {
        this.editingLevel = row.noticeValueAlter;
        this.editingRangeMinUnit = row.noticeRangeMinUnit;
        this.editingRangeMaxUnit = row.noticeRangeMaxUnit;
      }
      this.$nextTick(() => {
        this.$refs[`editInput-${row.md5}`].focus();
      });
      const label = row.schema?.data.label || '';
      this.setNodeSelected(label);
    },
    createAnswer(data) {
      const text = data.boxes.map((box) => box.text).join('');
      const editingRange = this.currentEditingRow.editingRange;
      if (editingRange === 'min') {
        this.editingRangeMin = text;
        this.currentEditingRowRangeMin.tempData = [{ boxes: data.boxes, text }];
        this.$refs[`editInput-${this.currentEditingRow.md5}-min`].focus();
      } else if (editingRange === 'max') {
        this.editingRangeMax = text;
        this.currentEditingRowRangeMax.tempData = [{ boxes: data.boxes, text }];
        this.$refs[`editInput-${this.currentEditingRow.md5}-max`].focus();
      } else if (editingRange === 'level') {
        this.editingLevel = text;
        this.currentEditingRowLevel.tempData = [{ boxes: data.boxes, text }];
        this.$refs[`editInput-${this.currentEditingRow.md5}-level`].focus();
      } else {
        this.editingText = text;
        this.currentEditingRow.tempData = [{ boxes: data.boxes, text }];
        this.$refs[`editInput-${this.currentEditingRow.md5}`].focus();
      }
    },
    saveEditingAnswer(e, row) {
      e.preventDefault();
      if (!row.isEnum) {
        row.noticeValueDescAlter = this.editingText;
        row.noticeRangeMin = this.editingRangeMin;
        row.noticeRangeMax = this.editingRangeMax;
        row.noticeValueAlter = row.noticeValueDescAlter;
        this.setEqual(row);
      }
      if (this.isLevelThreshold(row)) {
        row.noticeValueDescAlter = this.editingLevel;
        row.noticeValueAlter = row.noticeValueDescAlter;
        row.noticeRangeMin = this.editingRangeMin;
        row.noticeRangeMinUnit = this.editingRangeMinUnit;
        row.noticeRangeMax = this.editingRangeMax;
        row.noticeRangeMaxUnit = this.editingRangeMaxUnit;
        this.setEqual(row);
      }
      if (row.data) {
        row.data = [
          {
            boxes:
              this.currentEditingRow.tempData?.[0]?.boxes ||
              row.data[0]?.boxes ||
              [],
            text: this.editingText,
          },
        ];
        row.rangeMinData = [
          {
            boxes:
              this.currentEditingRowRangeMin.tempData?.[0]?.boxes ||
              row.rangeMinData?.[0]?.boxes ||
              [],
            text: this.editingRangeMin,
          },
        ];
        row.rangeMaxData = [
          {
            boxes:
              this.currentEditingRowRangeMax.tempData?.[0]?.boxes ||
              row.rangeMaxData?.[0]?.boxes ||
              [],
            text: this.editingRangeMax,
          },
        ];
        if (this.isLevelThreshold(row)) {
          row.rangeLevelData = [
            {
              boxes:
                this.currentEditingRowLevel.tempData?.[0]?.boxes ||
                row.rangeLevelData?.[0]?.boxes ||
                [],
              text: this.editingLevel,
            },
          ];
        }
        if (row.isRange) {
          this.modifyAnswerItem(row, 'update');
        }
      }

      row.editing = false;
      row.editingRange = '';
      row.tempData = [];
      this.reset();
    },
    focusInput(row) {
      row.editingRange = '';
      this.setNodeSelected(row.schema?.data.label || '');
      this.clearAnnnotations();
    },
    focusLevelInput(row) {
      row.editingRange = 'level';
      this.setNodeSelected('升降级别');
      this.clearAnnnotations();
    },
    focusRangeInput(row, type) {
      row.editingRange = type;
      const labelMap = {
        min: '区间起始值',
        max: '区间结束值',
      };
      this.setNodeSelected(labelMap[type]);
      this.clearAnnnotations();
    },
    modifyAnswerItem(row, action) {
      const fieldMap = {
        认购费: '认购区间',
        申购费: '申购区间',
        赎回费: '赎回区间',
      };
      const rangeMinField = this.isLevelThreshold(row)
        ? '最小值'
        : '区间起始值';
      const rangeMaxField = this.isLevelThreshold(row)
        ? '最大值'
        : '区间结束值';
      const field = _.last(JSON.parse(row.key)).split(':')[0];
      const key = row.key;
      const rangeKey = this.getAnswerItemKey(key, fieldMap[field]);
      const rangePropertyKey = this.getAnswerItemKey(key, '购买金额');
      const rangeMinKey = this.getAnswerItemKey(key, rangeMinField);
      const rangeMaxKey = this.getAnswerItemKey(key, rangeMaxField);
      const item = this.getAnswerItemByKey(key);
      const rangeItem = this.getAnswerItemByKey(rangeKey);
      const rangePropertyItem = this.getAnswerItemByKey(rangePropertyKey);
      const rangeMinItem = this.getAnswerItemByKey(rangeMinKey);
      const rangeMaxItem = this.getAnswerItemByKey(rangeMaxKey);

      const rangeLevelKey = this.getAnswerItemKey(key, '升降级别');
      const rangeMinUnitKey = this.getAnswerItemKey(key, '最小值单位');
      const rangeMaxUnitKey = this.getAnswerItemKey(key, '最大值单位');
      const rangeLevelItem = this.getAnswerItemByKey(rangeLevelKey);
      const rangeMinUnitItem = this.getAnswerItemByKey(rangeMinUnitKey);
      const rangeMaxUnitItem = this.getAnswerItemByKey(rangeMaxUnitKey);

      if (action === 'update') {
        item.data = this.getAnswerItemData(row.data);
        rangeItem.value = ['M1<=M<M2'];
        rangePropertyItem.value = ['金额（M）'];
        rangeMinItem.data = this.getAnswerItemData(row.rangeMinData);
        rangeMaxItem.data = this.getAnswerItemData(row.rangeMaxData);
        if (this.isLevelThreshold(row)) {
          rangeLevelItem.data = this.getAnswerItemData(row.rangeLevelData);
          rangeMinUnitItem.value = [
            this.getKeyByValue(row.noticeRangeMinUnit, '最小值单位'),
          ];
          rangeMaxUnitItem.value = [
            this.getKeyByValue(row.noticeRangeMaxUnit, '最大值单位'),
          ];
        }
      }
      if (action === 'delete') {
        item.data = [];
        item.value = [];
        rangeItem.value = [];
        rangePropertyItem.value = [];
        rangeMinItem.data = [];
        rangeMaxItem.data = [];
        if (this.isLevelThreshold(row)) {
          rangeLevelItem.data = [];
          rangeMinUnitItem.value = [];
          rangeMaxUnitItem.value = [];
        }
      }
    },
    getAnswerItemKey(key, filed) {
      const keyJson = JSON.parse(key);
      keyJson[keyJson.length - 1] = `${filed}:0`;
      return JSON.stringify(keyJson);
    },
    getAnswerItemByKey(targetKey) {
      return (
        this.questionData.answer.userAnswer.items.find(
          (item) =>
            normalizeArrayJSON(item.key) === normalizeArrayJSON(targetKey),
        ) || {}
      );
    },
    getAnswerItemData(data) {
      for (const item of data) {
        if (!item.text) {
          for (const box of item.boxes) {
            box.text = '';
          }
        }
      }
      return data;
    },
    cancelEditingAnswer(row) {
      row.editing = false;
      row.editingRange = '';
      row.tempData = [];
      this.reset();
    },
    clearAnnnotations() {
      this.$refs.pdfViewerContainer?.$refs.pdfViewer.app.removeAllAnnotation();
    },
    reset() {
      this.currentEditingRow = {};
      this.currentEditingRowLevel = {};
      this.currentEditingRowRangeMin = {};
      this.currentEditingRowRangeMax = {};
      this.$refs.pdfViewerContainer.nodeSelected = null;
      this.clearAnnnotations();
    },
    viewData(row) {
      const answerItem = this.convertAnswerItem(row);
      const pdfViewer = this.$refs.pdfViewerContainer;
      if (!answerItem.data) {
        pdfViewer?.resetWidgets();
        return;
      }
      pdfViewer?.selectAnswerItem(answerItem);
    },
    convertAnswerItem(answer) {
      return {
        index: 0,
        schemaNode: null,
        schema: { data: { label: answer.schema?.data.label } },
        data: answer.data?.[0],
      };
    },
    isUnchecked(row) {
      return row.checkValue === '' || row.checkValue === null;
    },
    validateAuditAnswer(items) {
      const invalid = items.some(
        (item) => !item.readOnly && this.isUnchecked(item),
      );
      const firstUncheckedRow = this.$refs.productInfoTable.$el.querySelector(
        '.el-table__row.unchecked',
      );
      firstUncheckedRow?.classList.add('flash');
      setTimeout(() => {
        firstUncheckedRow?.classList.remove('flash');
      }, 3000);
      firstUncheckedRow?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
      return !invalid;
    },
    changeNoticeValueAlter(e, row) {
      if (this.isLevelThreshold(row)) {
        row.noticeThresholdType =
          fieldValueMap['升降级阈值类型'][row.enumSelected];
      } else {
        row.noticeValueAlter = this.getNoticeValueAlter(row);
        row.noticeValueDescAlter = this.getNoticeValueDescAlter(row);
      }
      this.setEqual(row);
    },
    addRow(row, index) {
      this.auditAnswer.productInfo.forEach((item) => {
        this.cancelEditingAnswer(item);
      });
      const keyJson = JSON.parse(row.key);
      const field = keyJson[1].split(':')[0];
      const fieldGroupItems = this.questionData.answer.userAnswer.items.filter(
        (item) => {
          return JSON.parse(item.key)[1].split(':')[0] === field;
        },
      );
      const fieldGroup = _.groupBy(
        fieldGroupItems,
        (item) => JSON.parse(item.key)[1],
      );
      let newMd5 = '';
      let item = {};

      for (let i = 0; i < Object.keys(fieldGroup).length; i++) {
        keyJson[keyJson.length - 2] = `${field}:${i}`;
        item = fieldGroup[`${field}:${i}`].find(
          (item) => normalizeArrayJSON(item.key) === JSON.stringify(keyJson),
        );

        const existed = this.auditAnswer.productInfo.some(
          (i) => i.md5 === md5(normalizeArrayJSON(item.key)),
        );

        if (existed && i === Object.keys(fieldGroup).length - 1) {
          this.$alert('未匹配到数据，不能继续添加', '提示');
          break;
        }

        if (!existed && item.data.length === 0) {
          newMd5 = md5(normalizeArrayJSON(JSON.stringify(keyJson)));
          const mergedRowsNum = this.mergeRows.fieldCodeDesc[index];

          this.auditAnswer.productInfo.splice(index + mergedRowsNum, 0, {
            ...row,
            md5: newMd5,
            key: normalizeArrayJSON(JSON.stringify(keyJson)),
            sysId: null,
            data: [],
            value: [],
            enumSelected: null,
            zytValue: null,
            zytValueDesc: null,
            noticeValue: null,
            noticeValueAlter: null,
            noticeValueDesc: null,
            noticeValueDescAlter: null,
            zytRangeMin: null,
            zytRangeMax: null,
            zytRangeMinUnit: null,
            zytRangeMaxUnit: null,
            noticeRangeMin: null,
            noticeRangeMax: null,
            noticeRangeMinUnit: null,
            noticeRangeMaxUnit: null,
            zytThresholdType: null,
            noticeThresholdType: null,
          });

          this.getTableSpanArr(this.auditAnswer.productInfo);
          this.setTableScrollTop();

          break;
        }
      }
    },
    async deleteRow(row) {
      const confirm = await this.$confirm('确定删除这行数据？', '提示').catch(
        () => {},
      );
      if (confirm === 'confirm') {
        const index = this.auditAnswer.productInfo.findIndex(
          (item) => item.md5 === row.md5,
        );
        this.auditAnswer.productInfo.splice(index, 1);
        this.modifyAnswerItem(row, 'delete');
        this.getTableSpanArr(this.auditAnswer.productInfo);
        this.setTableScrollTop();
      }
    },
    setTableScrollTop() {
      const scrollTop = this.$refs.productInfoTable.$el.scrollTop;
      this.$nextTick(() => {
        this.$refs.productInfoTable.$el.scrollTop = scrollTop;
      });
    },
    setEqual(row) {
      // 对于枚举字段，需忽略顺序后再比较（比如 'A;B' 和 'B;A' 被认为是一致的）
      let zytValue = row.zytValue;
      let noticeValueAlter = row.noticeValueAlter;

      if (row.isEnum) {
        zytValue = row.zytValue?.split(';').sort().join(';');
        noticeValueAlter = row.noticeValueAlter?.split(';').sort().join(';');
      }

      // 10个9的数字
      const bigNumber = 9999999999;

      // zytValue 为 null、大于等于10个9，都表示为<无限额>
      const isZytValueUnlimited =
        zytValue === null || Number(zytValue) >= bigNumber;

      // noticeValueAlter 为 0、大于等于10个9、无限额，都表示为<无限额>
      const isNoticeValueAlterUnlimited =
        noticeValueAlter === 0 ||
        Number(noticeValueAlter) >= bigNumber ||
        noticeValueAlter === '无限额';

      /**
       * 限额字段:  N-限额字段，U-限额的上限字段
       * 1. zyt为null时表示无限额，公告为无限额: 一致
       * 2. zyt为null（表示无限额），公告为无数据(null): 不一致
       * 3. zyt有值，公告为无数据(null): 不一致
       * 4. zyt有值，公告为无限额: 不一致
       */
      if (['N', 'U'].includes(row.fieldType)) {
        if (row.fieldType === 'U') {
          if (isZytValueUnlimited && isNoticeValueAlterUnlimited) {
            row.equal = true;
            return;
          }
        }

        if (zytValue === null && noticeValueAlter === '无限额') {
          row.equal = true;
          return;
        }

        if (
          (zytValue === null && noticeValueAlter === null) ||
          (zytValue && noticeValueAlter === null)
        ) {
          row.equal = false;
          return;
        }
      }

      /** 非限额字段
       * 1. zyt没有值（null)，公告没解析出来(null): 一致
       * 2. zyt有值，公告没解析出来(null): 不一致
       * 3. zyt没有值(null)，公告有值: 不一致
       */
      if (zytValue === null && noticeValueAlter === null) {
        row.equal = true;
        return;
      }

      if (
        (zytValue && noticeValueAlter === null) ||
        (zytValue == null && noticeValueAlter)
      ) {
        row.equal = false;
        return;
      }

      // null 和 '' 被认为是一致的
      const emptyValues = [null, ''];
      if (
        emptyValues.includes(zytValue) &&
        emptyValues.includes(noticeValueAlter)
      ) {
        row.equal = true;
        return;
      }

      row.equal = zytValue === noticeValueAlter;
    },
    getNoticeValueAlter(item) {
      if (this.isLevelThreshold(item)) {
        return item.noticeValueAlter;
      }
      let enumFieldValueMap = enumValuesMap;
      if (Object.keys(fieldValueMap).includes(item.fieldCodeDesc)) {
        enumFieldValueMap = fieldValueMap[item.fieldCodeDesc];
      }
      const value = item.isEnum
        ? item.isEnumMultiSelect
          ? item.enumSelected?.map((i) => enumFieldValueMap[i]).join(';')
          : enumFieldValueMap[item.enumSelected]
        : item.noticeValueAlter;

      return value || null;
    },
    getNoticeValueDescAlter(item) {
      if (this.isLevelThreshold(item)) {
        return item.noticeValueDescAlter;
      }
      const value = item.isEnum
        ? item.isEnumMultiSelect
          ? item.enumSelected?.join(';')
          : item.enumSelected
        : item.noticeValueDescAlter;

      return value || null;
    },
    async submit() {
      try {
        if (!this.validateAuditAnswer(this.auditAnswer.productInfo)) {
          this.$message.error('字段内容存在未选择，请选择后再提交。');
          return;
        }
        this.submitLoading = true;
        this.questionData.answer.userAnswer.items.forEach((item) => {
          const auditItem = this.auditAnswer.productInfoOriginal.find(
            (i) => i.key === item.key,
          );
          if (auditItem) {
            item.data = auditItem.data;
            if (auditItem.isEnum) {
              item.value = [auditItem.enumSelected];
            }
          }
        });
        const questionAnswer = this.questionData.answer;
        const auditAnswerFields = _.omit(
          this.auditAnswer,
          'productInfoOriginal',
        );
        const auditAnswer = {
          ...auditAnswerFields,
          ...this.postMessageData,
          productInfo: this.auditAnswer.productInfoOriginal.map((item) => {
            return {
              md5: item.md5,
              sysId: item.sysId,
              infoType: item.infoType,
              fieldType: item.fieldType,
              fieldOrder: item.fieldOrder,
              fieldCode: item.fieldCode,
              fieldCodeDesc: item.fieldCodeDesc,
              zytValue: item.zytValue,
              zytValueDesc: item.zytValueDesc,
              noticeValue: item.noticeValue,
              noticeValueDesc: item.noticeValueDesc,
              noticeValueAlter: this.getNoticeValueAlter(item),
              noticeValueDescAlter: this.getNoticeValueDescAlter(item),
              checkValue: item.checkValue,
              readOnly: item.readOnly,
              linkSystem: item.linkSystem,
              linkSystemDesc: item.linkSystemDesc,
              zytStartDate: item.zytStartDate,
              zytEndDate: item.zytEndDate,
              noticeStartDate: item.noticeStartDate,
              noticeEndDate: item.noticeEndDate,
              isRange: item.isRange,
              zytRangeMin: item.zytRangeMin,
              zytRangeMax: item.zytRangeMax,
              noticeRangeMin: item.noticeRangeMin,
              noticeRangeMax: item.noticeRangeMax,
              zytRangeMinUnit: item.zytRangeMinUnit,
              zytRangeMaxUnit: item.zytRangeMaxUnit,
              noticeRangeMinUnit: item.noticeRangeMinUnit,
              noticeRangeMaxUnit: item.noticeRangeMaxUnit,
              zytThresholdType: item.zytThresholdType,
              noticeThresholdType: item.noticeThresholdType,
            };
          }),
        };

        await submitAnswer(this.auditAnswer.qid, {
          product_code: this.$route.query.productCode,
          answer: questionAnswer,
          zyt_answer: auditAnswer,
        });

        await this.$store.dispatch('remarkModule/sendQuestionAnswer', {
          qid: this.auditAnswer.qid,
          type: 0,
          data: {
            data: this.questionData.answer,
            skip_hook: true,
          },
        });

        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
        });

        this.getAuditAnswer();

        window.parent.postMessage(
          {
            type: 'submit-success',
            data: {
              answer: auditAnswer,
            },
          },
          this.postMessageOrigin,
        );
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.submitLoading = false;
      }
    },
    handleMessageEvent(event) {
      const eventData = event.data.data;
      const targetOrigin = event.data.origin;
      if (event.origin !== targetOrigin) {
        return;
      }

      this.postMessageOrigin = targetOrigin;
      this.postMessageData = eventData;

      if (event.data.type === 'submit') {
        this.submit();
      }
    },
    handleKeyupEvent(event, row, target) {
      const baseInput = `editInput-${row.md5}`;
      let ArrowUp = {
        value: `${baseInput}-max`,
        min: baseInput,
        max: `${baseInput}-min`,
      };
      let ArrowDown = {
        value: `${baseInput}-min`,
        min: `${baseInput}-max`,
        max: baseInput,
      };
      if (this.isLevelThreshold(row)) {
        ArrowUp = {
          value: `${baseInput}-max`,
          level: baseInput,
          min: `${baseInput}-level`,
          max: `${baseInput}-min`,
        };
        ArrowDown = {
          value: `${baseInput}-level`,
          level: `${baseInput}-min`,
          min: `${baseInput}-max`,
          max: baseInput,
        };
      }
      const keyMapping = {
        ArrowUp: ArrowUp,
        ArrowDown: ArrowDown,
        ArrowLeft: {
          max: `${baseInput}-min`,
        },
        ArrowRight: {
          min: `${baseInput}-max`,
        },
      };

      const direction = keyMapping[event.key];

      if (direction && direction[target]) {
        const ref = direction[target];
        this.$refs[ref]?.focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$--color-primary: #e20303;

.audit-wrapper {
  height: 100vh;
  &.readonly {
    .main-container {
      height: 100%;
    }
    ::v-deep .draw-widget-switch {
      display: none;
    }
    ::v-deep .pdf-document-viewer {
      .page {
        pointer-events: none;
      }
    }
  }
  .main-container {
    display: flex;
    height: 100%;
    .pdf-viewer-wrapper {
      width: 50%;
      ::v-deep .document-viewer-toolbar {
        border-width: 0 0 1px 0;
        .toolbar-back,
        .toolbar-fileinfo {
          display: none;
        }
      }
      ::v-deep .draw-widget-switch {
        left: 24px;
        right: auto;
      }
    }
    .aside {
      flex: 1;
      width: 50%;
      border-right: 1px solid #e2e3e1;
      .filter {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #e2e2e2;
        .el-radio {
          ::v-deep .el-radio__label {
            padding-left: 2px;
            vertical-align: middle;
          }
        }
      }
      .el-table {
        height: calc(100% - 40px);
        overflow-y: auto;
        border: none;
        &::before {
          content: none;
        }
        ::v-deep .el-table__header-wrapper {
          position: sticky;
          top: 0;
          z-index: 2;
        }
        ::v-deep .el-table__body-wrapper {
          overflow: initial;
          .el-table__row {
            &.unchecked {
              position: relative;
              &::after {
                content: '';
                position: absolute;
                top: 5px;
                right: 10px;
                bottom: 5px;
                left: 220px;
                border: 2px solid #ff0000;
                pointer-events: none;
              }
              &.flash {
                &::after {
                  animation: flash 1s 0s 3;
                }
              }
              @keyframes flash {
                50% {
                  background-color: #ff00001c;
                }
              }
            }
          }
        }
        ::v-deep .cell {
          display: flex;
          align-items: center;
          > div {
            width: 100%;
          }
          .el-icon-arrow-down {
            margin-right: 3px;
            color: #0090c0;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s;
            cursor: pointer;
            &.collapsed {
              transform: rotate(-90deg);
            }
          }
          .not-equal {
            color: $--color-primary;
          }
          .el-checkbox {
            margin-right: 5px;
            vertical-align: 1px;
            &.is-disabled.is-checked {
              .el-checkbox__inner {
                background-color: $--color-primary;
                border-color: $--color-primary;
                opacity: 0.5;
                &::after {
                  border-color: #fff;
                }
              }
            }
            &.is-checked:not(.is-disabled),
            .is-indeterminate {
              .el-checkbox__inner {
                background-color: $--color-primary;
                border-color: $--color-primary;
                &::after {
                  border-color: #fff;
                }
              }
            }
          }
          .el-select {
            width: 80%;
            .el-select__tags {
              .el-tag {
                height: 16px;
              }
            }
            .el-input__inner {
              height: 22px;
              line-height: 22px;
              padding-right: 22px;
            }
            .el-input__suffix {
              right: 0;
              .el-input__icon {
                line-height: 22px;
                font-size: 12px;
              }
            }
          }
          .cell-top {
            display: flex;
            align-items: center;
            width: 100%;
          }
          .text {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .date {
            margin-top: 5px;
            font-size: 12px;
            color: #999;
            line-height: 14px;
          }
          .range {
            font-size: 12px;
            color: #666;
            .condition {
              margin: 0 3px;
            }
            .el-input {
              width: 100px;
              height: 22px;
              line-height: 22px;
            }
          }
          .level-threshold {
            font-size: 12px;
          }
          .btn-edit {
            margin-left: 8px;
            &.active {
              i {
                color: #0090c0;
              }
            }
            i {
              color: #999;
            }
          }
          .el-popover {
            .btns {
              display: flex;
              justify-content: center;
              margin-top: 10px;
              .el-button {
                padding: 3px 8px;
              }
            }
          }
          .value-diff-icon {
            margin-left: 5px;
            color: #999;
            font-size: 15px;
            vertical-align: -1px;
          }
          > i {
            width: 13px;
            height: 13px;
            min-width: 13px;
            margin-left: 5px;
            background-size: 100% 100%;
            &.icon-ai {
              background-image: url(../assets/icon-ai.svg);
            }
            &.icon-edit {
              background-image: url(../assets/icon-edit.svg);
            }
          }
          .el-button {
            margin-left: 5px;
            i.icon-plus {
              vertical-align: middle;
              color: #666;
              &:hover {
                color: #0090c0;
              }
            }
          }
        }
      }
      .el-empty {
        height: 100%;
      }
    }
  }
}
</style>

<style lang="scss">
.edit-audit-answer-popover {
  &.has-range {
    width: 300px !important;
    .range {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      .el-input {
        width: 100px;
        .el-input__inner {
          height: 24px;
          line-height: 24px;
        }
      }
    }
  }
  &.has-level-threshold {
    width: 450px !important;
    .el-select {
      width: 70px;
      .el-input {
        width: 100%;
        font-size: 12px;
        .el-input__suffix {
          right: 2px;
          .el-select__caret {
            line-height: 24px;
            font-size: 12px;
          }
        }
      }
    }
    .level-threshold {
      margin-top: 10px;
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    .el-button {
      padding: 3px 8px;
    }
  }
}
.value-diff-popover {
  .content {
    p {
      margin: 5px 0;
      font-size: 13px;
    }
  }
}
</style>
