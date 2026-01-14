import Vue from 'vue';
import _ from 'lodash';
import EventBus from './EventBus';
import { SEARCH_TYPE, SCHEMA_TYPE } from '@/store/constants';
import {
  getFieldStatus,
  getFieldProbability,
} from '../../../custom/cmfchina/common/utils';
import { mapGetters } from 'vuex';
import {
  deleteCustomField,
  batchDeleteCustomFields,
} from '@/store/api/remark.api';
import { mixDeepInfo, normalizeArrayJSON } from '../../../utils';
import { RemarkTreeLoading } from '@/utils/remark-tree-loading';
import {
  createEmptyAnswer,
  cloneModelAnswer,
  getDeepLabelsFromAnswerKey,
} from '@/utils/remarkAnswerTools';
import AnswerLabel from '../AnswerLabel';
import AnswerItem from '../AnswerItem';
import { v4 as uuid4 } from 'uuid';

const MAX_LENGTH = 1000;
const TreeItem = Vue.component('remark-tree-item', {
  created() {
    this.initData();

    // 对比文档时基准文档不允许接收标注等相关事件
    if (!this.showDiffMarks) {
      return;
    }

    EventBus.$on('create-remark-answer-item', this.createAnswerItem);
    EventBus.$on('create-excel-answer-item', this.createExcelAnswerItem);
    EventBus.$on('create-table-answer-batch', this.createAnswerGroup);
    EventBus.$on('update-group-answer-batch', this.updateGroupAnswerBatch);
    EventBus.$on('create-chapter-content-answer', this.createAnswerGroup);
    EventBus.$on('create-custom-schema-node', this.createCustomSchemaNode);
    EventBus.$on('sync-remark-answer', this.syncRemarkAnswer);
    EventBus.$on('highlight-change', this.jumpPageByNumber);
    EventBus.$on('answer-widget-clicked', this.handleAnswerWidgetClicked);
    EventBus.$on('excel-cell-selected', this.handleExcelCellSelected);
    EventBus.$on(
      'before-search-answer-tree-fields',
      this.resetSchemaGroupCollapsed,
    );
  },
  beforeDestroy() {
    EventBus.$off('create-remark-answer-item', this.createAnswerItem);
    EventBus.$off('create-excel-answer-item', this.createExcelAnswerItem);
    EventBus.$off('create-table-answer-batch', this.createAnswerGroup);
    EventBus.$off('update-group-answer-batch', this.updateGroupAnswerBatch);
    EventBus.$off('create-chapter-content-answer', this.createAnswerGroup);
    EventBus.$off('create-custom-schema-node', this.createCustomSchemaNode);
    EventBus.$off('sync-remark-answer', this.syncRemarkAnswer);
    EventBus.$off('highlight-change', this.jumpPageByNumber);
    EventBus.$off('answer-widget-clicked', this.handleAnswerWidgetClicked);
    EventBus.$off('excel-cell-selected', this.handleExcelCellSelected);
    EventBus.$off(
      'before-search-answer-tree-fields',
      this.resetSchemaGroupCollapsed,
    );
  },
  /* eslint-disable no-unused-vars */
  render(h) {
    const model = this.model;
    const depth = this.depth;

    let uls = null;
    let pagination = null;

    if (this.schemaGroupAnswer && this.schemaGroupAnswer.length > 0) {
      const needSplitChildren = this.schemaGroupAnswer.length > this.pageSize;
      let children = null;
      if (needSplitChildren) {
        children = this.getChildrenOfPage(this.schemaGroupAnswer);
      } else {
        children = this.schemaGroupAnswer;
      }
      pagination = needSplitChildren ? (
        <el-pagination
          small
          layout="prev, pager, next, jumper"
          hide-on-single-page={true}
          current-page={this.page}
          on-current-change={this.onPageChanged}
          page-size={this.pageSize}
          pager-count={5}
          total={this.schemaGroupAnswer.length}
        />
      ) : null;

      const canCloned = this.isGroupNode && !this.isHideClone;

      let canCheck = depth === 1 && !this.isInspect;

      const isShowAnswerCreateInline =
        canCloned && this.isCanCreate && !this.isInspect;

      let isShowTableRemark =
        this.$features.supportParsePdf() &&
        this.configuration.table_association &&
        model.meta._deepIndex.length > 0 &&
        model.children.length > 0;

      let isShowChapterAssistRemark =
        this.configuration.chapter_assist &&
        model.meta._deepIndex.length > 0 &&
        model.children.length > 0;

      if (this.$platform.isCmfchinaEnv()) {
        canCheck = false;
        isShowTableRemark = false;
        isShowChapterAssistRemark = false;
      }

      const ulLength = this.schemaGroupAnswer.length;
      // children 是二维数组
      uls = children.map((child) => {
        const index = this.schemaGroupAnswer.indexOf(child);
        const groupId = child[0].meta._uuid;

        const isNew = !this.schemaGroupAnswerIdsOriginal.some(
          (item) => item === groupId,
        );

        let removeAnswerItemBtn = null;
        if (ulLength > 1 && this.showDiffMarks) {
          removeAnswerItemBtn = (
            <div class="answer-item-operation-btn">
              <span on-click={() => this.removeSchemaGroupAnswer(index)}>
                {this.$platform.isDefaultEnv() ? (
                  <svg-font-icon
                    name="delete"
                    size={18}
                    color="#606266"></svg-font-icon>
                ) : (
                  <i class="far fa-times-circle" />
                )}
              </span>
              <span
                title="上移"
                on-click={() => this.swapSchemaGroupAnswer(index, index - 1)}>
                <i class="el-icon-top" />
              </span>
              <span
                title="下移"
                on-click={() => this.swapSchemaGroupAnswer(index, index + 1)}>
                <i class="el-icon-bottom" />
              </span>
            </div>
          );
        }

        return (
          <ul
            key={index}
            class={{
              'can-cloned': canCloned,
              collapsed: this.schemaGroupCollapsed[groupId],
            }}
            data-depth={this.depth + 1}>
            {canCloned ? (
              <li class="answer-index">
                {this.$features.supportFoldAnswerGroup() ? (
                  <i
                    class="fas fa-angle-right toggle-group-arrow"
                    on-click={(e) => this.toggleAnswerGroup(e, groupId)}></i>
                ) : null}
                <span
                  class={isNew ? 'index-number is-new' : 'index-number'}>{`${
                  index + 1
                }.`}</span>
                {canCheck ? (
                  <el-checkbox
                    value={this.schemaGroupChecked.includes(groupId)}
                    on-change={(value) => this.checkSchemaGroup(value, groupId)}
                  />
                ) : null}
              </li>
            ) : null}
            {removeAnswerItemBtn}
            {parseChildrenToTreeItems(
              child,
              this.selectedAnswerId,
              this.selectedSchemaNode,
              this.updateAllAnswerCollapsed,
              this.showDiffMarks,
              this.checkFirstLevelNodeOpen,
              this.allAnswerCollapsed,
              this.visible,
              this.opened,
              this.isGroupNode,
              this.removeAnswerFn,
            )}
            {isShowAnswerCreateInline ? (
              <li class="answer-create-inline">
                <span
                  class="fas fa-fw fa-plus-circle create-trigger"
                  on-click={() => this.cloneSchemaGroupAnswer(child, index + 1)}
                />
                {isShowChapterAssistRemark ? (
                  <el-button
                    class="table-remark-trigger"
                    type={this.$platform.isDefaultEnv() ? 'primary' : 'success'}
                    on-click={() => this.switchChapterAssistRemark(index + 1)}>
                    标题内容提取
                  </el-button>
                ) : null}
                {isShowTableRemark ? (
                  <el-button
                    class="table-remark-trigger"
                    type={this.$platform.isDefaultEnv() ? 'primary' : 'success'}
                    on-click={() => this.switchTableRemark(index + 1)}>
                    表格标注
                  </el-button>
                ) : null}
              </li>
            ) : null}
          </ul>
        );
      });
    }

    let icon = <span class="icon-placeholder" />;
    if (this.isShowArrow) {
      // 是否显示箭头
      const cls = ['fas', 'fa-fw', 'fa-angle-right', 'answer-header-icon'];
      if (this.isOpened) {
        cls.push('is-opened');
      }
      icon = (
        <span class="icon-placeholder">
          <i class={cls.join(' ')} on-click={this.handleNodeArrowClick} />
        </span>
      );
    }
    let cls = ['answer-item'];

    if (this.schemaNodeSelected) {
      cls.push('schema-node-selected');
    }

    if (!this.visible) {
      cls.push('schema-node-exclude');
    }
    let nodeHeaderClass = ['answer-header'];
    if (depth === 0) {
      nodeHeaderClass.push('node-title');
    }
    if (depth === 1) {
      nodeHeaderClass.push('node-sticky');
    }
    if (depth === 2) {
      nodeHeaderClass.push('node-sticky-2');
    }
    if (this.model.meta._type.type === 'group') {
      nodeHeaderClass.push('group-type-node');
    }

    return (
      <li
        data-nodeId={this.model.meta._nodeIndex}
        class={cls.join(' ')}
        on-click={this.selectSchemaNode}>
        <div class={nodeHeaderClass.join(' ')}>
          {icon}
          <answer-label
            index={0}
            dataIndex={this.dataIndex}
            switchDataIndexFn={this.switchDataIndex}
            needUniqueText={this.isLLMMode}
            schemaNodeSelected={this.schemaNodeSelected}
            answerItem={this.selectedAnswerItem}
            uuid={this.uuid}
            depth={this.depth}
            props={{ model: this.model }}
            modelKey={this.modelKey}
            schemaAnswer={this.schemaAnswer}
            cloneSchemaNodeFn={this.cloneSchemaGroupAnswer}
            changeSchemaTypeFn={this.changeSchemaType}
            removeSchemaNodeAnswerFn={this.removeSchemaNodeAnswer}
            removeSchemaAllAnswerFn={this.removeSchemaAllAnswer}
            changeSchemaManualFn={this.changeSchemaManual}
            schemaGroupChecked={this.schemaGroupChecked}
            switchBatchEditFn={this.switchBatchEdit}
            checkAllSchemaGroupFn={this.checkAllSchemaGroup}
            addCustomSchemaNodeFn={this.addCustomSchemaNode}
            editCustomSchemaNodeFn={this.editCustomSchemaNode}
            removeCustomSchemaNodeFn={this.removeCustomSchemaNode}
            cancelReviseSuggestionFn={this.cancelReviseSuggestion}
            diffResult={this.schemaAnswer.diff_result}
            showDiffMarks={this.showDiffMarks}
            isOpened={this.isOpened}
            fieldStatus={this.fieldStatus}
            isInspect={this.isInspect}
          />
        </div>
        {this.isOpened ? (
          <div class="answer-content">
            <div class="answer">
              {this.schemaAnswer ? (
                <div>
                  {this.model.key}
                  <ul>
                    {this.schemaAnswer.data.map((answerItem, index) => (
                      <answer-item
                        ref={`${this.schemaAnswer.key}:${index}`}
                        key={index + answerItem.text}
                        index={index}
                        dataIndex={this.dataIndex}
                        uuid={this.uuid}
                        answerItem={answerItem}
                        modelAnswer={this.schemaAnswer.text}
                        schemaNode={this.schemaAnswer.key}
                        schema={this.schemaAnswer.schema}
                        editAnswerFn={this.editAnswer}
                        removeAnswerFn={this.removeAnswer}
                        selectAnswerItemFn={this.selectSchemaAnswerItem}
                        isSelected={
                          this.selectedAnswerId ===
                          this.schemaAnswer.key + ':' + index
                        }
                        diffResult={this.schemaAnswer.diff_result}
                        showDiffMarks={this.showDiffMarks}
                        detail={this.schemaAnswer.detail}
                        similarity={this.schemaAnswer.similarity}
                        cls={cls}
                        fieldStatus={this.fieldStatus}
                      />
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {uls}
            <div class="pagination-wrapper">{pagination}</div>
          </div>
        ) : null}
      </li>
    );

    function parseChildrenToTreeItems(
      children,
      selectedAnswerId,
      selectedSchemaNode,
      updateAllAnswerCollapsed,
      showDiffMarks,
      checkFirstLevelNodeOpen,
      allAnswerCollapsed,
      visible,
      opened,
      isGroupNode,
      removeAnswerFn,
    ) {
      return children.map((child, index) => {
        return (
          <remark-tree-item
            props={{ model: child }}
            key={child.meta._uuid}
            uuid={child.meta._uuid}
            depth={depth + 1}
            selectedAnswerId={selectedAnswerId}
            selectedSchemaNode={selectedSchemaNode}
            checkFirstLevelNodeOpen={checkFirstLevelNodeOpen}
            parentVisible={visible}
            parentOpened={opened}
            allAnswerCollapsed={allAnswerCollapsed}
            updateAllAnswerCollapsed={updateAllAnswerCollapsed}
            showDiffMarks={showDiffMarks}
            isParentGroupNode={isGroupNode}
            removeAnswerFn={removeAnswerFn}
          />
        );
      });
    }
  },
  components: {
    AnswerLabel,
    AnswerItem,
  },
  data() {
    return {
      isOpened: true,
      isOpenedPrevious: undefined,
      page: 1,
      pageSize: 10,
      visible: true,
      schemaAnswer: null,
      schemaGroupAnswer: [],
      schemaGroupAnswerIdsOriginal: [],
      schemaNodeSelected: false,
      schemaGroupChecked: [],
      schemaGroupCollapsed: {},
      fieldStatus: null,
      dataIndex: 0,
      selectedAnswerItem: {},
    };
  },
  props: {
    selectedAnswerId: {
      type: [Number, String],
      required: true,
    },
    selectedSchemaNode: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
    },
    model: {
      type: Object,
      required: true,
    },
    depth: {
      type: Number,
      required: false,
      default: 0,
    },
    checkFirstLevelNodeOpen: {
      type: Function,
      required: false,
    },
    parentVisible: {
      type: Boolean,
      required: false,
    },
    parentOpened: {
      type: Boolean,
      required: false,
    },
    allAnswerCollapsed: {
      type: Boolean,
      required: false,
    },
    updateAllAnswerCollapsed: {
      type: Function,
      required: true,
    },
    showDiffMarks: {
      type: Boolean,
      default: true,
    },
    isParentGroupNode: {
      type: Boolean,
      default: false,
    },
    removeAnswerFn: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('remarkModule', [
      'userAnswerType',
      'answerTreeFilter',
      'keywordMatches',
      'currentSchema',
      'diffEnabled',
      'answerGroupPageInfo',
      'remarkFile',
    ]),
    ...mapGetters('ruleAuditModule', ['auditRules']),
    ...mapGetters('cmfchinaModule', ['fieldProbabilities']),
    isShowArrow() {
      const children = this.model.children;
      if (!_.isArray(children)) return false;
      return (
        this.model.meta._deepIndex.length > 0 &&
        (children.length > 0 ||
          this.model.meta._type.type === 'enum' ||
          (_.isObject(this.schemaAnswer) && this.schemaAnswer.data.length > 0))
      );
    },
    modelKey() {
      return JSON.stringify(mixDeepInfo(this.model.meta));
    },
    schemaExpandLevel() {
      if (this.configuration.answer_default_display_level) {
        return this.configuration.answer_default_display_level;
      }
      return -1;
    },
    isGroupNode() {
      return (
        this.model.meta._type.type === 'group' &&
        this.model.meta._partType !== 'root'
      );
    },
    isHideClone() {
      return (
        this.$features.showCiticsTgRemarkAside() && this.$route.meta.isCustom
      );
    },
    isCanCreate() {
      if (this.$platform.isNafmiiEnv()) {
        return this.showDiffMarks;
      }
      return true;
    },
    isInspect() {
      return this.$route.name === 'inspect';
    },
    isLLMMode() {
      return this.model.data.extract_type === SCHEMA_TYPE.LLM.type;
    },
  },
  watch: {
    userAnswerType() {
      this.checkNodeOpenStatus();
    },
    answerTreeFilter(options) {
      this.checkNodeVisibleStatus();
      if (options.ignoreChangeOpenStatus !== true) {
        this.checkNodeOpenStatus();
      }
    },
    selectedSchemaNode(nodeKey) {
      if (this.modelKey !== nodeKey) {
        this.schemaNodeSelected = false;
      }
    },
    schemaNodeSelected(value) {
      if (value === false) {
        this.dataIndex = 0;
      }
    },
    allAnswerCollapsed(status) {
      if (status) {
        if (this.depth > 0) {
          this.isOpened = false;
        }
      } else {
        this.isOpened = true;
      }
    },
    isOpened(next, previous) {
      if (next !== previous) {
        this.schemaGroupAnswer = this.getAnswerDataLatest();
      }
    },
    model() {
      this.initData();
    },
    parentOpened() {
      this.checkNodeOpenStatus();
    },
    schemaAnswer: {
      handler() {
        if (this.schemaAnswer?.data.length >= 5 && this.isHideClone) {
          setTimeout(() => {
            const depthTwoEls = document.querySelectorAll('.node-sticky-2');
            depthTwoEls?.forEach((el) => {
              const answerItems = el.parentElement.querySelectorAll(
                '.user-answer-wrapper',
              );
              if (answerItems.length > 0) {
                const parentUl = answerItems[0].parentElement;
                if (answerItems.length > 5) {
                  let childrenHeight = 0;
                  answerItems.forEach((item, index) => {
                    if (index < 5) {
                      childrenHeight += item.offsetHeight;
                    }
                  });
                  parentUl.style.height = `${childrenHeight + 22}px`;
                  parentUl.style.overflowY = 'auto';
                } else {
                  parentUl.style.height = 'auto';
                  parentUl.style.overflowY = 'hidden';
                }
              }
            });
          });
        }
      },
      deep: true,
    },
    fieldProbabilities() {
      this.getFieldAuditStatus();
    },
  },
  methods: {
    initData() {
      if (
        this.model.children &&
        this.model.children.length > 0 &&
        !this.model.childrenGroup
      ) {
        this.fixChildrenGroupMissing();
      }

      if (this.model.childrenGroup && this.model.childrenGroup[0]) {
        const size = this.model.childrenGroup[0].length;
        if (size > 0) {
          this.pageSize = Math.min(
            this.pageSize,
            Math.ceil(MAX_LENGTH / (size * this.pageSize)),
          );
        }
      }

      this.schemaAnswer = this.model.answer
        ? cloneModelAnswer(this.model)
        : createEmptyAnswer(this.model);

      if (
        this.answerGroupPageInfo.key ===
        normalizeArrayJSON(this.schemaAnswer.key)
      ) {
        this.page = this.answerGroupPageInfo.page;
      }

      const originalGroupAnswer = this.model.childrenGroup;

      if (originalGroupAnswer && originalGroupAnswer.length > 0) {
        const groupAnswerCloned = _.cloneDeep(originalGroupAnswer);

        groupAnswerCloned.forEach(function checkUUID(item) {
          if (item.meta) {
            if (!item.meta._uuid) {
              item.meta._uuid = uuid4();
            }
          }

          if (Array.isArray(item)) {
            item.forEach(checkUUID);
          }

          if (item.childrenGroup && item.childrenGroup.length > 0) {
            item.childrenGroup.forEach(checkUUID);
          }
        });

        this.schemaGroupAnswer = groupAnswerCloned;
        this.updateSchemaGroupAnswerOriginal();
      } else {
        this.schemaGroupAnswer = [];
      }

      this.checkNodeVisibleStatus();
      this.checkNodeOpenStatus();

      if (this.$features.showFieldAuditStatusInAnswer()) {
        this.getFieldAuditStatus();
      }
      this.schemaNodeSelected = this.modelKey == this.selectedSchemaNode;
    },
    async jumpPageByNumber(page, uuid, cb) {
      if (uuid === this.model.meta._uuid) {
        if (this.page !== page) {
          await this.onPageChanged(page);
        }
        cb();
      }
    },
    async jumpToPageByAnswerItemKey(key) {
      if (!key) {
        return;
      }
      const answerItemkey = JSON.parse(key);
      const answerItemIndex = Number(answerItemkey.at(-2).split(':')[1]);
      const targetPage = Math.ceil((answerItemIndex + 1) / this.pageSize);
      if (this.page !== targetPage) {
        await this.onPageChanged(targetPage);
      }
    },
    async handleAnswerWidgetClicked(widget) {
      await this.jumpToPageByAnswerItemKey(widget.data.meta.key);
      setTimeout(() => {
        EventBus.$emit('after-widget-clicked', widget);
      });
    },
    async handleExcelCellSelected(
      { key, sheet_name, cell },
      selectedAnswerKey,
      isEditMode,
    ) {
      await this.jumpToPageByAnswerItemKey(key);
      setTimeout(() => {
        EventBus.$emit(
          'after-cell-selected',
          { key, sheet_name, cell },
          selectedAnswerKey,
          isEditMode,
        );
      });
    },
    async onPageChanged(page, uuid) {
      await RemarkTreeLoading.start();

      this.schemaGroupAnswer = this.getAnswerDataLatest();
      this.page = page;

      this.$store.commit('remarkModule/SET_ANSWER_GROUP_PAGE_INFO', {
        key: normalizeArrayJSON(this.schemaAnswer.key),
        page,
      });

      await this.$nextTick();

      if (uuid) {
        this.scrollToAnswerItem(uuid);
      } else {
        this.scrollToFirstAnswer();
      }

      RemarkTreeLoading.close();
    },
    getChildrenOfPage(children) {
      return children.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
    },
    async createAnswerItem({ schemaNode, boxes }) {
      if (schemaNode === this.modelKey) {
        const text = boxes.map((box) => box.text).join('');
        this.schemaAnswer.data.push({ boxes, text, handleType: 'wireframe' });
        this.schemaAnswer.manual = true;
        this.$parent.schemaGroupAnswer.forEach((group) => {
          group.forEach((node) => {
            if (
              node.answer &&
              normalizeArrayJSON(node.answer.key) ===
                normalizeArrayJSON(this.modelKey)
            ) {
              node.answer.data.push({ boxes, text, handleType: 'wireframe' });
            }
          });
        });
        EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
      }
    },
    createExcelAnswerItem(answer) {
      if (this.modelKey === answer[0].key) {
        const { sheet_name, cell, text } = answer[0].data[0];
        this.schemaAnswer.data = [{ sheet_name, cell, text }];
        this.schemaAnswer.manual = true;
        EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
      }
    },
    switchTableRemark(insertIndex) {
      EventBus.$emit('open-table-remark', {
        model: this.model,
        modelKey: this.modelKey,
        insertIndex,
        postfixSupport: true,
        commonFieldSupport: true,
      });
    },
    switchBatchEdit() {
      EventBus.$emit('open-batch-edit', {
        model: this.model,
        modelKey: this.modelKey,
      });
    },
    switchChapterAssistRemark(insertIndex) {
      EventBus.$emit('open-chapter-assist-remark', {
        model: this.model,
        modelKey: this.modelKey,
        insertIndex,
      });
    },
    addCustomSchemaNode() {
      const schemaGroupAnswerLatest = this.getAnswerDataLatest();
      const children = [];

      if (this.depth === 0) {
        if (this.schemaGroupAnswer.length === 0) {
          this.schemaGroupAnswer = [[]];
        }
        children.push(...this.schemaGroupAnswer[0]);
      } else {
        this.schemaGroupChecked.forEach((groupId) => {
          const group = schemaGroupAnswerLatest.find(
            (item) => item[0].meta._uuid === groupId,
          );
          children.push(...group);
        });
      }

      EventBus.$emit('open-custom-schema-node', {
        model: {
          data: this.model.data,
          meta: this.model.meta,
          children: _.uniqBy(children, 'data.label'),
        },
        modelKey: this.modelKey,
      });
    },
    createCustomSchemaNode(schemaNode) {
      if (schemaNode.key === this.modelKey) {
        const schemaGroupAnswerLatest = this.getAnswerDataLatest();

        if (this.depth === 0) {
          if (this.schemaGroupAnswer.length === 0) {
            this.schemaGroupAnswer = [[]];
          }
          this.schemaGroupAnswer[0].push(...schemaNode.children);
          EventBus.$emit('custom-schema-node-added', schemaNode.children);
        } else {
          this.schemaGroupChecked.forEach((groupId) => {
            const group = schemaGroupAnswerLatest.find(
              (item) => item[0].meta._uuid === groupId,
            );
            schemaNode.children.forEach((child) => {
              child.meta._deepIndex = group[0].meta._deepIndex;
            });
            group.push(..._.cloneDeep(schemaNode.children));
            EventBus.$emit('custom-schema-node-added', schemaNode.children);
          });

          this.schemaGroupAnswer = schemaGroupAnswerLatest;
          this.schemaGroupChecked = [];
        }
      }
    },
    removeCustomSchemaNode({ key, md5 }) {
      this.$parent.schemaGroupAnswer.forEach((group) => {
        const nodeIndex = group.findIndex((node) => {
          return key === JSON.stringify(mixDeepInfo(node.meta));
        });
        if (nodeIndex !== -1) {
          group.splice(nodeIndex, 1);
          if (md5) {
            try {
              deleteCustomField(this.$route.params.qid, md5);
            } catch (error) {
              console.log(error.message);
            }
          }
        }
      });

      EventBus.$emit('answer-item-removed', [key]);
    },
    editCustomSchemaNode({ key, model, newAnswerLabel }) {
      const newKey = key.replace(model.data.label, newAnswerLabel);

      EventBus.$emit('answer-item-removed', [this.schemaAnswer.key]);

      this.schemaAnswer.key = newKey;
      this.schemaAnswer.schema.data.label = newAnswerLabel;

      this.$parent.schemaGroupAnswer.forEach((group) => {
        const node = group.find((node) => {
          return key === JSON.stringify(mixDeepInfo(node.meta));
        });
        if (node) {
          if (node.answer) {
            node.answer.key = newKey;
            node.answer.data = [];
          }
          node.data.label = newAnswerLabel;
          node.meta._deepLabels = _.initial(node.meta._deepLabels).concat(
            newAnswerLabel,
          );
          node.meta._type.label = newAnswerLabel;
        }
      });

      EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
    },
    createAnswerGroup({ schemaNode, data, insertIndex }) {
      if (schemaNode === this.modelKey) {
        if (this.model.childrenGroup.length === 0) {
          return;
        }

        const schemaGroupAnswerLatest = this.getAnswerDataLatest();

        const hasNoAnswer = schemaGroupAnswerLatest.every((groupItem) =>
          groupItem.every(
            (item) => !item.answer || item.answer.data.length === 0,
          ),
        );

        const schemaGroupAnswerBatch = [];
        const answerUpdatedBatch = [];

        const appendAnswer = ({
          answerItem,
          groupItem,
          insertPosition = 0,
          parentDeepIndex,
        }) => {
          groupItem.forEach((item) => {
            item.meta._uuid = uuid4();

            if (parentDeepIndex) {
              item.meta._deepIndex = parentDeepIndex.concat(insertPosition);
            } else {
              item.meta._deepIndex[item.meta._deepIndex.length - 1] =
                insertPosition;
            }

            item.answer = createEmptyAnswer(item, this.model);

            const answerData = answerItem[item.meta._deepLabels.join(':')];
            if (answerData) {
              if (answerData.data) {
                item.answer.data = answerData.data;
              }

              if (answerData.box) {
                const [box_left, box_top, box_right, box_bottom] =
                  answerData.box.box;

                item.answer.data.push({
                  boxes: [
                    {
                      box: { box_left, box_top, box_right, box_bottom },
                      page: answerData.box.page,
                      text: answerData.text,
                    },
                  ],
                  handleType: 'wireframe',
                });
              }

              if (answerData.value) {
                item.answer.value = answerData.value;
              }

              answerUpdatedBatch.push(item.answer);
            }

            if (
              Array.isArray(item.childrenGroup) &&
              item.childrenGroup.length > 0
            ) {
              appendAnswer({
                answerItem,
                groupItem: item.childrenGroup[0],
                parentDeepIndex: item.meta._deepIndex,
              });
            }
          });
        };

        const answerGroupInsertPositionInitial = hasNoAnswer
          ? 0
          : insertIndex > 0
            ? insertIndex
            : this.schemaGroupAnswer.length;

        let answerGroupInsertPosition = answerGroupInsertPositionInitial;
        data.forEach((answerItem) => {
          const groupItem = _.cloneDeep(this.model.childrenGroup[0]);

          appendAnswer({
            answerItem,
            groupItem,
            insertPosition: answerGroupInsertPosition,
          });
          answerGroupInsertPosition += 1;

          schemaGroupAnswerBatch.push(groupItem);
        });

        this.updateSchemaGroupAnswerOriginal();

        if (hasNoAnswer) {
          this.schemaGroupAnswer = schemaGroupAnswerBatch;
          EventBus.$emit('answer-item-updated', answerUpdatedBatch);
        } else {
          const answerKeyObsoleted = [];
          const answerKeyUpdated = [];

          const answerAfterInsertIndex = schemaGroupAnswerLatest.slice(
            answerGroupInsertPositionInitial,
            schemaGroupAnswerLatest.length,
          );

          if (
            answerGroupInsertPositionInitial < schemaGroupAnswerLatest.length
          ) {
            const parentPosition =
              schemaGroupAnswerLatest[answerGroupInsertPositionInitial][0].meta
                ._deepIndex.length - 1;

            answerAfterInsertIndex.forEach(function updateIndex(item) {
              if (item.meta) {
                item.meta._deepIndex[parentPosition] =
                  item.meta._deepIndex[parentPosition] + data.length;
              }

              if (item.answer) {
                answerKeyObsoleted.push(item.answer.key);
                item.answer.key = JSON.stringify(mixDeepInfo(item.meta));

                if (
                  item.answer.data.length > 0 ||
                  item.answer.value.length > 0
                ) {
                  answerKeyUpdated.push(item.answer);
                }
              }

              if (Array.isArray(item)) {
                item.forEach(updateIndex);
              }

              if (item.childrenGroup && item.childrenGroup.length > 0) {
                item.childrenGroup.forEach((childGroupItem) =>
                  childGroupItem.forEach(updateIndex),
                );
              }
            });
          }

          this.schemaGroupAnswer = [].concat(
            schemaGroupAnswerLatest.slice(0, answerGroupInsertPositionInitial),
            schemaGroupAnswerBatch,
            answerAfterInsertIndex,
          );

          EventBus.$emit('answer-item-removed', answerKeyObsoleted);
          EventBus.$emit(
            'answer-item-updated',
            answerUpdatedBatch.concat(answerKeyUpdated),
          );
        }

        this.openSchemaNode();
      }
    },
    updateGroupAnswerBatch({ schemaNode, data }) {
      if (schemaNode === this.modelKey) {
        if (
          this.model.childrenGroup.length === 0 ||
          this.schemaGroupChecked.length === 0
        ) {
          return;
        }

        const answerUpdatedBatch = [];
        const schemaGroupAnswerLatest = this.getAnswerDataLatest();

        const self = this;

        this.schemaGroupChecked.forEach((groupId) => {
          const group = schemaGroupAnswerLatest.find(
            (item) => item[0].meta._uuid === groupId,
          );

          if (group) {
            group.forEach(function replaceAnswer(node) {
              if (Array.isArray(node)) {
                node.forEach(replaceAnswer);
              } else {
                const nodePath = node.meta._deepLabels.join(':');
                const answerData = data[nodePath];
                if (answerData) {
                  if (!node.answer) {
                    node.answer = createEmptyAnswer(node, this.model);
                  }

                  node.answer.data = [];

                  answerData.boxes.forEach((box) => {
                    node.answer.data.push({
                      boxes: [
                        {
                          box: box.box,
                          page: box.page,
                          text: box.text,
                        },
                      ],
                      handleType: 'wireframe',
                    });
                  });

                  answerUpdatedBatch.push(node.answer);
                }

                if (
                  Array.isArray(node.childrenGroup) &&
                  node.childrenGroup.length > 0
                ) {
                  node.childrenGroup.forEach(replaceAnswer);
                }
              }
            });
          }
        });

        this.schemaGroupAnswer = schemaGroupAnswerLatest;
        this.schemaGroupChecked = [];
        EventBus.$emit('answer-item-updated', answerUpdatedBatch);
      }
    },
    async editAnswer({ index, text }) {
      const answerItem = this.schemaAnswer.data[index];
      const oldText =
        answerItem.text || answerItem.boxes.map((box) => box.text).join('');

      answerItem.text = text;
      this.schemaAnswer.manual = true;

      this.$parent.schemaGroupAnswer.forEach((group) => {
        group.forEach((node) => {
          if (
            node.answer &&
            normalizeArrayJSON(node.answer.key) ===
              normalizeArrayJSON(this.schemaAnswer.key)
          ) {
            node.answer.data[index].text = text;
          }
        });
      });

      if (
        this.$platform.isCgsEnv() &&
        this.remarkFile.source === 'Glazer' &&
        oldText !== text
      ) {
        this.$set(this.schemaAnswer, 'revise_suggestion', true);
      }

      EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
    },
    async removeAnswer(index, md5) {
      try {
        await this.$confirm(
          this.$t(`message['确认要删除已标注项目？']`),
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );

        this.schemaAnswer.data.splice(index, 1);
        if (this.schemaAnswer.data.length == 0) {
          this.schemaAnswer.value = [];
        }

        this.schemaAnswer.manual = false;
        this.schemaAnswer.score = null;
        this.schemaAnswer.text = '';
        this.selectedAnswerItem = {};

        this.$parent.schemaGroupAnswer.forEach((group) => {
          group.forEach((node) => {
            if (
              node.answer &&
              normalizeArrayJSON(node.answer.key) ===
                normalizeArrayJSON(this.schemaAnswer.key)
            ) {
              node.answer.data.splice(index, 1);
            }
          });
        });

        if (this.removeAnswerFn) {
          this.removeAnswerFn(index, this.schemaAnswer.key);
        }

        if (
          this.schemaAnswer.data.length === 0 &&
          !this.schemaAnswer.value &&
          !this.schemaAnswer.custom
        ) {
          EventBus.$emit('answer-item-removed', [this.schemaAnswer.key], md5);
        } else {
          EventBus.$emit('answer-item-updated', [this.schemaAnswer], md5);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async cloneSchemaGroupAnswer(child, insertIndex) {
      if (!Array.isArray(child) || child.length === 0) {
        return;
      }

      const schemaGroupAnswerLatest = this.getAnswerDataLatest();

      if (!insertIndex) {
        insertIndex = this.schemaGroupAnswer.length;
      }

      const insertPosition = insertIndex
        ? insertIndex
        : schemaGroupAnswerLatest.length;
      const parentPosition = child[0].meta._deepIndex.length - 1;

      const childCloned = _.cloneDeep(child);

      childCloned.forEach(function updateAnswer(item) {
        if (item.answer) {
          item.meta._deepLabels = getDeepLabelsFromAnswerKey(item); // 展示多个schema合并答案的情况下，添加的组的字段path需要和被复制的字段保持一致（仅限于被复制的字段有answer的情况）
          delete item.answer;
        }

        item.meta._deepIndex[parentPosition] = insertPosition;
        item.meta._uuid = uuid4();

        if (Array.isArray(item)) {
          item.forEach(updateAnswer);
        }

        if (item.childrenGroup && item.childrenGroup.length > 0) {
          item.childrenGroup = item.childrenGroup.slice(0, 1);
          item.childrenGroup.forEach((childItem) =>
            childItem.forEach(updateAnswer),
          );
        }
      });

      const answerAfterInsertIndex = schemaGroupAnswerLatest.slice(
        insertPosition,
        schemaGroupAnswerLatest.length,
      );
      const answerKeyObsoleted = [];
      const answerKeyUpdated = [];

      answerAfterInsertIndex.forEach(function updateIndex(item) {
        if (item.meta) {
          item.meta._deepIndex[parentPosition] =
            item.meta._deepIndex[parentPosition] + 1;
        }

        if (item.answer) {
          answerKeyObsoleted.push(item.answer.key);
          item.meta._deepLabels = getDeepLabelsFromAnswerKey(item);
          item.answer.key = JSON.stringify(mixDeepInfo(item.meta));

          if (item.answer.data.length > 0 || item.answer.value.length > 0) {
            answerKeyUpdated.push(item.answer);
          }
        }

        if (Array.isArray(item)) {
          item.forEach(updateIndex);
        }

        if (item.childrenGroup && item.childrenGroup.length > 0) {
          item.childrenGroup.forEach((childItem) =>
            childItem.forEach(updateIndex),
          );
        }
      });

      const schemaGroupAnswerUpdated = [].concat(
        schemaGroupAnswerLatest.slice(0, insertPosition),
        [childCloned],
        answerAfterInsertIndex,
      );

      this.schemaGroupAnswer = schemaGroupAnswerUpdated;

      await this.$nextTick();

      const page = Math.floor(insertIndex / this.pageSize + 1);
      const answerItemFocus = childCloned[0].meta._uuid;

      if (page !== this.page) {
        this.onPageChanged(page, answerItemFocus);
      } else {
        this.scrollToAnswerItem(answerItemFocus);
      }

      EventBus.$emit('answer-item-removed', answerKeyObsoleted);
      EventBus.$emit('answer-item-updated', answerKeyUpdated);
    },
    async removeSchemaGroupAnswer(index) {
      try {
        await this.$confirm(
          this.$t(`message['确认要删除已标注项目？']`),
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );

        const schemaGroupAnswerLatest = this.getAnswerDataLatest();
        const groupAnswerRemoved = schemaGroupAnswerLatest[index];

        const parentPosition =
          schemaGroupAnswerLatest[index][0].meta._deepIndex.length - 1;

        const answerAfterRemoveIndex = schemaGroupAnswerLatest.slice(
          index + 1,
          schemaGroupAnswerLatest.length,
        );

        const answerKeyObsoleted = [];
        const answerKeyUpdated = [];

        const md5List = []; // 自定义字段key的md5值

        answerAfterRemoveIndex.forEach(function updateIndex(item) {
          if (item.meta) {
            item.meta._deepIndex[parentPosition] =
              item.meta._deepIndex[parentPosition] - 1;
          }

          if (item.answer) {
            answerKeyObsoleted.push(item.answer.key);
            item.meta._deepLabels = getDeepLabelsFromAnswerKey(item);
            item.answer.key = JSON.stringify(mixDeepInfo(item.meta));

            if (item.answer.data.length > 0 || item.answer.value.length > 0) {
              answerKeyUpdated.push(item.answer);
            }
          }

          if (Array.isArray(item)) {
            item.forEach(updateIndex);
          }

          if (item.childrenGroup && item.childrenGroup.length > 0) {
            item.childrenGroup.forEach((childItem) =>
              childItem.forEach(updateIndex),
            );
          }
        });

        const schemaGroupAnswerUpdated = [].concat(
          schemaGroupAnswerLatest.slice(0, index),
          answerAfterRemoveIndex,
        );

        this.schemaGroupAnswer = schemaGroupAnswerUpdated;

        await this.$nextTick();

        let indexUpdated =
          index <= this.schemaGroupAnswer.length - 1
            ? index
            : this.schemaGroupAnswer.length - 1;
        const page = Math.floor(indexUpdated / this.pageSize + 1);
        const answerItemFocus =
          this.schemaGroupAnswer[indexUpdated][0].meta._uuid;

        if (page !== this.page) {
          this.onPageChanged(page, answerItemFocus);
        } else {
          this.scrollToAnswerItem(answerItemFocus);
        }

        const answerKeyRemoved = [];

        groupAnswerRemoved.forEach(function getAnswerItem(item) {
          if (item.answer) {
            answerKeyRemoved.push(item.answer.key);
            if (item.answer.md5) {
              md5List.push(item.answer.md5);
            }
          }

          if (Array.isArray(item)) {
            item.forEach(getAnswerItem);
          }

          if (item.childrenGroup && item.childrenGroup.length > 0) {
            item.childrenGroup.forEach((childItem) =>
              childItem.forEach(getAnswerItem),
            );
          }
        });

        if (this.$features.supportCustomField()) {
          await batchDeleteCustomFields(this.$route.params.qid, md5List); // 批量删除该组下的所有自定义字段
        }

        EventBus.$emit(
          'answer-item-removed',
          answerKeyRemoved.concat(answerKeyObsoleted),
        );
        EventBus.$emit('answer-item-updated', answerKeyUpdated);
      } catch (error) {
        console.error(error);
      }
    },
    async swapSchemaGroupAnswer(index, targetIndex) {
      if (targetIndex < 0 || targetIndex >= this.schemaGroupAnswer.length) {
        return;
      }

      try {
        const answerKeyUpdated = [];

        const schemaGroupAnswerLatest = this.getAnswerDataLatest();

        const parentPosition =
          schemaGroupAnswerLatest[index][0].meta._deepIndex.length - 1;

        const itemChildren = schemaGroupAnswerLatest[index];
        const targetItemChildren = schemaGroupAnswerLatest[targetIndex];

        itemChildren.forEach(function updateIndex(item, itemIndex) {
          const targetItem = targetItemChildren[itemIndex];

          const itemDeepIndex = item.meta._deepIndex[parentPosition];
          const targetItemDeepIndex =
            targetItem.meta._deepIndex[parentPosition];

          item.meta._deepIndex[parentPosition] = targetItemDeepIndex;
          targetItem.meta._deepIndex[parentPosition] = itemDeepIndex;

          if (item.answer) {
            item.answer.key = JSON.stringify(mixDeepInfo(item.meta));
            answerKeyUpdated.push(item.answer);
          }

          if (targetItem.answer) {
            targetItem.answer.key = JSON.stringify(
              mixDeepInfo(targetItem.meta),
            );
            answerKeyUpdated.push(targetItem.answer);
          }

          if (item.childrenGroup && item.childrenGroup.length > 0) {
            item.childrenGroup.forEach((childItem) =>
              childItem.forEach(updateIndex),
            );
          }
        });

        [schemaGroupAnswerLatest[index], schemaGroupAnswerLatest[targetIndex]] =
          [
            schemaGroupAnswerLatest[targetIndex],
            schemaGroupAnswerLatest[index],
          ];

        this.schemaGroupAnswer = schemaGroupAnswerLatest;

        await this.$nextTick();

        EventBus.$emit('answer-item-updated', answerKeyUpdated);
      } catch (error) {
        console.error(error);
      }
    },
    removeSchemaNodeAnswer() {
      this.schemaAnswer.data = [];
      EventBus.$emit('answer-item-removed', [this.schemaAnswer.key]);
    },
    async removeSchemaAllAnswer() {
      try {
        await this.$confirm(
          this.$t(`message['确认要删除已标注项目？']`),
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );

        const schemaGroupAnswerLatest = this.getAnswerDataLatest();

        const answerKeyRemoved = [];

        const md5List = []; // 自定义字段key的md5值

        schemaGroupAnswerLatest.forEach((schemaGroup) => {
          schemaGroup.forEach(function getChildAnswer(item) {
            if (item.answer) {
              answerKeyRemoved.push(item.answer.key);
              if (item.answer.md5) {
                md5List.push(item.answer.md5);
              }
            }

            if (item.childrenGroup && item.childrenGroup.length > 0) {
              item.childrenGroup.forEach((childItem) =>
                childItem.forEach(getChildAnswer),
              );
            }
          });
        });

        this.schemaGroupAnswer = [
          this.schemaGroupAnswer[0].map((item) => {
            item = _.omit(item, 'answer');

            if (item.childrenGroup && item.childrenGroup.length > 0) {
              item.childrenGroup = item.childrenGroup.map((childrenGroupItem) =>
                childrenGroupItem.map((childItem) =>
                  _.omit(childItem, 'answer'),
                ),
              );
            }

            return item;
          }),
        ];

        if (this.$features.supportCustomField()) {
          await batchDeleteCustomFields(this.$route.params.qid, md5List); // 批量删除该schema-node下所有自定义字段
        }

        EventBus.$emit('answer-item-removed', answerKeyRemoved);
      } catch (error) {
        console.error(error);
      }
    },
    async changeSchemaType(value) {
      this.schemaAnswer.value = value;
      this.schemaAnswer.manual = true;
      EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
    },
    async changeSchemaManual(manual) {
      this.schemaAnswer.manual = manual;
      EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
    },
    selectSchemaAnswerItem(item) {
      this.selectedAnswerItem = item;
      this.selectSchemaNode();
    },
    async selectSchemaNode(e) {
      if (e) {
        e.stopPropagation();
      }

      this.schemaNodeSelected = true;
      EventBus.$emit('schema-node-selected', {
        key: this.modelKey,
        model: this.model,
      });
    },
    getAnswerDataLatest() {
      const childAnswerData = {};
      const childGroupAnswer = {};

      this.$children.forEach(function getAnswer(item) {
        if (item.schemaAnswer) {
          childAnswerData[item.model.meta._uuid] = _.cloneDeep(
            item.schemaAnswer,
          );
        }

        if (item.schemaGroupAnswer) {
          childGroupAnswer[item.model.meta._uuid] = _.cloneDeep(
            item.schemaGroupAnswer,
          );
        }

        item.$children.forEach(getAnswer);
      });

      const schemaGroupAnswerUpdated = _.cloneDeep(this.schemaGroupAnswer);

      schemaGroupAnswerUpdated.forEach(function updateAnswer(item) {
        if (item.meta) {
          if (childAnswerData[item.meta._uuid]) {
            item.answer = childAnswerData[item.meta._uuid];
          }

          if (childGroupAnswer[item.meta._uuid]) {
            item.childrenGroup = childGroupAnswer[item.meta._uuid];
            item.childrenGroup.forEach(updateAnswer);
          }
        }

        if (Array.isArray(item)) {
          item.forEach(updateAnswer);
        }
      });

      return schemaGroupAnswerUpdated;
    },
    checkNodeVisibleStatus() {
      const {
        keyword,
        searchBy,
        nodeShow,
        nodeHide,
        diffOnly,
        valueType,
        extractType,
      } = this.answerTreeFilter;
      const nodeDepth = this.model.meta._deepIndex.length;

      let visible = true;

      if (nodeDepth > 0) {
        if (this.parentVisible) {
          const filterVisible = {
            nodeShow: true,
            nodeHide: true,
            keyword: true,
            diffOnly: true,
            valueType: true,
            extractType: true,
          };

          if (!this.isInspect) {
            filterVisible.nodeShow =
              this.model.data.extract_type !== SCHEMA_TYPE.LLM.type;
          }

          if (nodeShow) {
            const isCurrentMatchedShow =
              this.checkIsCurrentMatchFilterShow(nodeShow);
            const isChildrenMatchedShow =
              this.checkIsChildrenMatchFilterShow(nodeShow);

            filterVisible.nodeShow =
              isCurrentMatchedShow || isChildrenMatchedShow;
          }

          if (nodeHide) {
            const isCurrentMatchedShow =
              this.checkIsCurrentMatchFilterShow(nodeHide);

            filterVisible.nodeHide = !isCurrentMatchedShow;
          }

          if (keyword) {
            const isCurrentMatchKeyword = this.checkIsCurrentMatchFilterKeyword(
              keyword,
              searchBy,
            );
            const isChildrenMatchKeyword =
              this.checkIsChildrenMatchFilterKeyword(keyword, searchBy);

            filterVisible.keyword =
              isCurrentMatchKeyword || isChildrenMatchKeyword;
          }

          if (diffOnly) {
            const isCurrentMatchedDiffOnly =
              this.checkIsCurrentMatchFilterDiffOnly();
            const isChildrenMatchedDiffOnly =
              this.checkIsChildrenMatchedFilterDiffOnly();

            filterVisible.diffOnly =
              isCurrentMatchedDiffOnly || isChildrenMatchedDiffOnly;
          }

          if (valueType === 'empty') {
            filterVisible.valueType =
              _.isEmpty(this.schemaAnswer.data) &&
              _.isEmpty(this.schemaAnswer.value);
            if (this.schemaGroupAnswer.length > 0) {
              filterVisible.valueType = this.schemaGroupAnswer.some((ans) => {
                return ans.some((a) => {
                  return (
                    _.isEmpty(a.answer?.data) && _.isEmpty(a.answer?.value)
                  );
                });
              });
            }
          }

          if (extractType && extractType !== 'all') {
            const type =
              this.model.data.extract_type || SCHEMA_TYPE.CUSTOM.type;
            filterVisible.extractType = type === extractType;
            if (this.schemaGroupAnswer.length > 0) {
              filterVisible.extractType = this.schemaGroupAnswer.some((ans) => {
                return ans.some((a) => {
                  const type = a.data.extract_type || SCHEMA_TYPE.CUSTOM.type;
                  return type === extractType;
                });
              });
            }
          }

          if (this.isParentGroupNode) {
            visible =
              filterVisible.nodeShow &&
              filterVisible.nodeHide &&
              filterVisible.valueType &&
              filterVisible.extractType;
          } else {
            visible = Object.values(filterVisible).every((i) => i);
          }
        }
      }

      this.visible = visible;
    },
    async handleNodeArrowClick(e) {
      e.stopPropagation();

      if (!this.diffEnabled) {
        await RemarkTreeLoading.start();
      }

      this.isOpened = !this.isOpened;

      await this.$nextTick();

      if (this.isOpened) {
        this.scrollToFirstAnswer();
        EventBus.$emit('node-arrow-click');
      }

      RemarkTreeLoading.close();
    },
    toggleAnswerGroup(e, groupId) {
      const collapsed = this.schemaGroupCollapsed[groupId];
      this.$set(this.schemaGroupCollapsed, groupId, !collapsed);
    },
    resetSchemaGroupCollapsed() {
      this.schemaGroupCollapsed = {};
    },
    async openSchemaNode() {
      if (this.isOpened) {
        return;
      }

      await RemarkTreeLoading.start();

      this.isOpened = true;
      this.updateAllAnswerCollapsed(false);

      await this.$nextTick();
      this.scrollToFirstAnswer();

      RemarkTreeLoading.close();
    },
    checkNodeOpenStatus() {
      let isOpened = this.isOpened;

      if (this.visible) {
        const { keyword } = this.answerTreeFilter;
        const nodeDepth = this.model.meta._deepIndex.length;
        if (keyword) {
          isOpened = true;
        } else {
          if (nodeDepth === 1 && this.model.children.length > 0) {
            isOpened = this.checkFirstLevelNodeOpen();
          }

          if (nodeDepth > 1) {
            isOpened = true;
          }
        }
      } else {
        isOpened = false;
      }

      this.isOpened = isOpened;
    },
    scrollToFirstAnswer() {
      const firstAnswer = this.$children.find((item) =>
        item.$el.classList.contains('answer-item'),
      );
      if (firstAnswer) {
        firstAnswer.$el.scrollIntoView({ block: 'nearest' });

        setTimeout(() => {
          const labelOffsetTop = -26;
          const listContainer = document.querySelector('.remark-tree-list');

          if (listContainer) {
            listContainer.scrollBy(0, labelOffsetTop);
          }
        });
      }
    },
    fixChildrenGroupMissing() {
      const child = _.cloneDeep(this.model.children[0]);
      child.meta._deepIndex = [...this.model.meta._deepIndex, 0];
      this.model.childrenGroup = [[child]]; // eslint-disable-line
    },
    scrollToAnswerItem(uuid) {
      if (uuid) {
        const childSelected = this.$children.find(
          (item) => item.model && item.model.meta._uuid === uuid,
        );

        if (childSelected) {
          childSelected.$el.scrollIntoView({ block: 'center' });
        }
      }
    },
    updateSchemaGroupAnswerOriginal() {
      this.schemaGroupAnswerIdsOriginal = this.schemaGroupAnswer.map(
        (item) => item[0].meta._uuid,
      );
    },
    checkAllSchemaGroup() {
      this.schemaGroupChecked = this.schemaGroupAnswer.map(
        (item) => item[0].meta._uuid,
      );
    },
    checkSchemaGroup(checked, groupId) {
      const groupIdIndex = this.schemaGroupChecked.indexOf(groupId);

      if (checked) {
        if (groupIdIndex === -1) {
          this.schemaGroupChecked = this.schemaGroupChecked.concat(groupId);
        }
      } else {
        if (groupIdIndex > -1) {
          this.schemaGroupChecked.splice(groupIdIndex, 1);
        }
      }
    },
    syncRemarkAnswer({ schemaNode, answer }) {
      if (schemaNode === this.modelKey) {
        this.schemaAnswer = cloneModelAnswer(this.model, answer);
      }
    },
    checkIsCurrentMatchFilterKeyword(keyword, searchBy) {
      if (searchBy === SEARCH_TYPE.field) {
        const isMatched = this.model.data.label.includes(keyword);
        if (isMatched && this.model.meta._deepIndex.length === 1) {
          this.$store.commit('remarkModule/SET_KEYWORD_MATCHES', [
            ...this.keywordMatches,
            {
              treeItemUuid: this.model.meta._uuid,
              treeItemIndex: 0,
              answerUuid: this.model.meta._uuid,
              answerIndex: 0,
              level: 1,
            },
          ]);
        }
        return isMatched;
      } else {
        const matches = [];
        this.schemaAnswer?.data.forEach((item, j) => {
          if (
            this.model.meta._deepIndex.length === 1 &&
            this.checkIsAnswerMatch(item, keyword)
          ) {
            matches.push({
              treeItemUuid: this.model.meta._uuid,
              treeItemIndex: 0,
              answerUuid: this.model.meta._uuid,
              answerIndex: j,
              level: this.model.meta._deepIndex.length,
            });
          }
        });
        const isMatched = matches.length > 0;
        if (isMatched) {
          this.$store.commit('remarkModule/SET_KEYWORD_MATCHES', [
            ...this.keywordMatches,
            ...matches,
          ]);
        }
        return isMatched;
      }
    },
    checkIsChildrenMatchFilterKeyword(keyword, searchBy) {
      const matches = [];
      if (searchBy === SEARCH_TYPE.field) {
        this.model.childrenGroup?.forEach(
          (function checkKeyWords(treeItem) {
            return (item, i) => {
              item.forEach((child) => {
                if (child.data.label.includes(keyword)) {
                  matches.push({
                    treeItemUuid: treeItem.meta._uuid,
                    treeItemIndex: i,
                    answerUuid: child.meta._uuid,
                    answerIndex: 0,
                  });
                } else if (
                  Array.isArray(child.childrenGroup) &&
                  child.childrenGroup.length > 0
                ) {
                  child.childrenGroup.forEach(checkKeyWords(child));
                }
              });
            };
          })(this.model),
        );
      } else {
        const self = this;
        this.schemaGroupAnswer?.forEach(
          (function checkKeyWords(treeItem) {
            return (item, i) => {
              item.forEach((child) => {
                if (child.answer && child.answer?.data.length > 0) {
                  child.answer.data.forEach((item, j) => {
                    if (self.checkIsAnswerMatch(item, keyword)) {
                      matches.push({
                        treeItemUuid: treeItem.meta._uuid,
                        treeItemIndex: i,
                        answerUuid: child.meta._uuid,
                        answerIndex: j,
                      });
                    }
                  });
                } else if (
                  Array.isArray(child.childrenGroup) &&
                  child.childrenGroup.length > 0
                ) {
                  child.childrenGroup.forEach(checkKeyWords(child));
                }
              });
            };
          })(this.model),
        );
      }
      const isMatched = matches.length > 0;
      if (isMatched) {
        this.$store.commit(
          'remarkModule/SET_KEYWORD_MATCHES',
          _.uniqWith(
            [...this.keywordMatches, ...matches],
            (a, b) =>
              a.answerUuid === b.answerUuid && a.answerIndex === b.answerIndex,
          ),
        );
      }
      return isMatched;
    },
    checkIsAnswerMatch(item, keyword) {
      return (
        (item.text && item.text.includes(keyword)) ||
        (!item.text && item.boxes.some((box) => box.text.includes(keyword)))
      );
    },
    checkIsCurrentMatchFilterDiffOnly() {
      return this.schemaAnswer.diff_result === false;
    },
    checkIsChildrenMatchedFilterDiffOnly() {
      return this.$children.some(function setNodeVisible(item) {
        if (item.schemaAnswer && item.schemaAnswer.diff_result === false) {
          return true;
        } else if (Array.isArray(item.$children) && item.$children.length > 0) {
          return item.$children.some(setNodeVisible);
        } else {
          return false;
        }
      });
    },
    checkIsCurrentMatchFilterShow(list) {
      const schemaLabel = this.model.meta._deepLabels.slice(1).join('|');
      return list.includes(schemaLabel);
    },
    checkIsChildrenMatchFilterShow(list) {
      return this.model.children.some(function checkChild(item) {
        const schemaLabel = item.meta._deepLabels.slice(1).join('|');
        if (list.includes(schemaLabel)) {
          return true;
        }

        if (Array.isArray(item.children) && item.children.length > 0) {
          return item.children.some(checkChild);
        }
      });
    },
    cancelReviseSuggestion() {
      this.schemaAnswer.revise_suggestion = false;
      EventBus.$emit('answer-item-updated', [this.schemaAnswer]);
      EventBus.$emit('toggle-submit-answer-disabled', false);
    },
    getFieldAuditStatus() {
      const probability = getFieldProbability(
        this.fieldProbabilities,
        this.model.answer?.mold_field_id,
      );
      this.fieldStatus = getFieldStatus(
        this.model.answer,
        this.auditRules,
        [],
        probability,
      );
    },
    switchDataIndex(direction) {
      if (direction === 'prev') {
        this.dataIndex--;
      } else {
        this.dataIndex++;
      }
      this.$nextTick(() => {
        this.$refs[this.selectedAnswerId]?.answerItemClick();
      });
    },
  },
});

export default TreeItem;
