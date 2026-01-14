<template>
  <div class="rule-management">
    <div class="container">
      <el-tree
        ref="menuTree"
        class="menu-tree"
        default-expand-all
        :data="menuTreeData"
        node-key="key"
        :current-node-key="`${currentGroupId}_${currentMenuKey}`"
        highlight-current
        @node-click="selectMenu">
      </el-tree>

      <div class="right-panel" v-loading="loading">
        <div v-if="currentMenuKey === 'rule'">
          <header>
            <h2>Rule Lists</h2>
            <div class="search-bar">
              <el-input
                size="small"
                placeholder="Please input rule name"
                v-model="ruleSearchInput"
                clearable
                @clear="searchGroupRuleList"
                @keydown.enter.native="searchGroupRuleList">
                <el-select v-model="ruleSearchBy" slot="prepend">
                  <el-option label="MLR" value="MLR"></el-option>
                  <el-option label="GLR" value="GLR"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  size="small"
                  icon="el-icon-search"
                  @click="searchGroupRuleList"></el-button>
              </el-input>
              <el-button
                type="primary"
                size="small"
                class="button-hkex"
                @click="openOperationRecordDialog">
                Operation record
              </el-button>
            </div>
          </header>
          <el-table border stripe :data="groupRuleList.items">
            <el-table-column
              prop="id"
              label="Rule ID"
              align="center"
              width="70">
              <template slot-scope="scope">
                {{ getListIndex(scope.$index) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="main_rule"
              label="MLR"
              align="center"
              width="150">
              <template slot-scope="scope">
                {{ getRuleAlias(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="rule_description"
              label="MLR Description"
              header-align="center"
              align="left"></el-table-column>
            <el-table-column
              prop="gem_rule"
              label="GLR"
              align="center"
              width="120">
              <template slot-scope="scope">
                {{ getRuleAlias(scope.row, 'gem') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="gem_description"
              label="GLR Description"
              header-align="center"
              align="left"></el-table-column>
            <el-table-column prop="status" label="Status" align="center">
              <template slot-scope="scope">
                <span :class="scope.row.status.toLowerCase()">
                  {{ scope.row.status }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="Action"
              class-name="action"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="openRuleDialog(scope.row)">
                  Edit
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[10, 20, 50]"
            :current-page="groupRuleList.pager.page"
            :page-size="groupRuleList.pager.size"
            :total="groupRuleList.pager.total"
            @current-change="handleChangeGroupRuleListPage"
            @size-change="handleChangeGroupRuleListPageSize">
          </el-pagination>
        </div>

        <div v-if="currentMenuKey === 'group'">
          <header>
            <h2>Group</h2>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-circle-plus"
              class="button-hkex"
              @click="openGroupDialog(null)">
              Create new group
            </el-button>
          </header>
          <el-table border stripe :data="groupList.items">
            <el-table-column
              prop="id"
              label="Group ID"
              align="center"
              width="100">
              <template slot-scope="scope">
                {{ getListIndex(scope.$index) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="Group Name"
              align="center"></el-table-column>
            <el-table-column
              prop="description"
              label="Description"
              align="center"></el-table-column>
            <el-table-column
              label="Grouping"
              class-name="action"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.name === 'All'">N/A</span>
                <el-button
                  v-else
                  type="text"
                  @click="openGroupDialog(scope.row)">
                  Edit
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="View" class-name="action" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.name === 'All'">N/A</span>
                <el-switch
                  v-else
                  v-model="scope.row.is_enabled"
                  active-color="#369aa2"
                  @change="
                    (value) => enableGroup(scope.row, value)
                  "></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="Action"
              class-name="action"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-tooltip
                  v-if="scope.row.name !== 'All'"
                  effect="dark"
                  content="Delete"
                  placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    circle
                    class="btn-delete"
                    @click.stop="deleteGroup(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[10, 20, 50]"
            :current-page="groupList.pager.page"
            :page-size="groupList.pager.size"
            :total="groupList.pager.total"
            @current-change="handleChangeGroupListPage"
            @size-change="handleChangeGroupListPageSize">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      v-if="operationRecordDialogVisible"
      :visible="true"
      title="Operation record"
      width="1200px"
      top="5vh"
      @close="closeOperationRecordDialog">
      <el-table
        v-loading="operationRecord.loading"
        border
        height="65vh"
        :data="operationRecord.items">
        <el-table-column
          prop="main_alias"
          label="Rule"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column prop="at" label="Time" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.at | datetime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="Operation"
          header-align="center"
          align="left"></el-table-column>
        <el-table-column
          prop="by"
          label="User"
          width="150"
          align="center"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        :current-page="operationRecord.pager.page"
        :page-size="operationRecord.pager.size"
        :total="operationRecord.pager.total"
        @current-change="handleChangeOperationRecordPage"
        @size-change="handleChangeOperationRecordPageSize">
      </el-pagination>
    </el-dialog>

    <el-dialog
      v-if="ruleDialogVisible"
      :visible="true"
      title="Edit Rule"
      width="1000px"
      top="5vh"
      custom-class="rule-dialog"
      @close="closeRuleDialog">
      <el-form
        ref="ruleForm"
        :model="ruleOperationRecords"
        v-loading="ruleOperationRecords.loading"
        label-position="left"
        label-width="150px">
        <div v-if="showAddNewRuleOperationButton">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-plus-outline"
            class="btn-add"
            @click="addNewRuleOperation"></el-button>
        </div>
        <ul class="list">
          <li v-for="(item, index) in ruleOperationRecords.items" :key="index">
            <el-row v-if="!item.isAdd" :gutter="20" class="time">
              {{ item.updated_utc | datetime }}
            </el-row>
            <el-row :gutter="20" type="flex" align="middle" class="date">
              <el-col :span="8">
                <el-form-item
                  v-if="item.operation !== OPERATION.INIT"
                  label=""
                  label-width="0"
                  :prop="`items[${index}].operation`"
                  :rules="ruleFormRules.operation">
                  <el-select
                    v-model="item.operation"
                    size="mini"
                    :disabled="!item.isAdd"
                    placeholder="Please select">
                    <el-option
                      v-for="(item, index) in ruleOperationOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  v-if="item.operation !== OPERATION.INIT"
                  :label="
                    item.operation === OPERATION.REPEALED
                      ? 'Date Repealed'
                      : 'Date Effective'
                  "
                  :prop="`items[${index}].activated_at`"
                  :rules="ruleFormRules.activated_at">
                  <template>
                    <el-date-picker
                      v-model="item.activated_at"
                      type="date"
                      size="mini"
                      :disabled="!item.editing"
                      placeholder="Pick a date"
                      value-format="timestamp">
                    </el-date-picker>
                  </template>
                </el-form-item>
              </el-col>
              <el-col v-if="!item.isAdd" :span="6" class="btns">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  class="btn-edit"
                  @click="editRuleOperationRecord(item)"></el-button>
              </el-col>
            </el-row>
            <template v-if="![OPERATION.REPEALED].includes(item.operation)">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="MLR" prop="rule" label-width="60px">
                    <el-input
                      size="mini"
                      :value="getRuleAlias(item)"
                      disabled
                      :title="getRuleAlias(item)"
                      placeholder="MLR name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item
                    label="MLR Description"
                    :prop="`items[${index}].rule_description`"
                    :rules="ruleFormRules.rule_description">
                    <el-input
                      type="textarea"
                      size="mini"
                      resize="vertical"
                      :autosize="{ minRows: 3, maxRows: 10 }"
                      :disabled="!item.editing"
                      v-model="item.rule_description"
                      placeholder="MLR Description"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="GLR" prop="gem_rule" label-width="60px">
                    <el-input
                      size="mini"
                      :value="getRuleAlias(item, 'gem')"
                      disabled
                      :title="getRuleAlias(item, 'gem')"
                      placeholder="GLR name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item
                    label="GLR Description"
                    :prop="`items[${index}].gem_description`"
                    :rules="ruleFormRules.gem_description">
                    <el-input
                      type="textarea"
                      size="mini"
                      resize="vertical"
                      :autosize="{ minRows: 3, maxRows: 10 }"
                      :disabled="!item.editing"
                      v-model="item.gem_description"
                      placeholder="GLR Description"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <template v-if="item.editing">
              <div v-if="item.isAdd" class="btns">
                <el-button size="mini" @click="closeRuleDialog"
                  >Cancel</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="saveRuleOperation(item)">
                  Save
                </el-button>
              </div>
              <div v-else class="btns">
                <el-button
                  size="mini"
                  @click="cancelEditingRuleOperationRecord(item)"
                  >Cancel</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="saveEditingRuleOperationRecordButtonDisabled(item)"
                  @click="saveEditingRuleOperationRecord(item)">
                  Save
                </el-button>
              </div>
            </template>
          </li>
        </ul>
      </el-form>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="ruleOperationRecords.pager.page"
        :page-size="ruleOperationRecords.pager.size"
        :total="ruleOperationRecords.pager.total"
        @current-change="handleChangeRuleOperationRecordsPage">
      </el-pagination>
    </el-dialog>

    <el-dialog
      v-if="groupDialogVisible"
      :visible="true"
      :title="groupDialogTitle"
      width="1000px"
      top="7vh"
      @close="closeGroupDialog">
      <div v-loading="groupDialogLoading">
        <el-form
          ref="groupForm"
          :model="groupForm"
          :rules="groupFormRules"
          label-position="left"
          label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Group Name" prop="name">
                <el-input
                  size="mini"
                  v-model="groupForm.name"
                  maxlength="255"
                  placeholder="group name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                v-if="!groupEditing"
                label="Copy Grouping From"
                prop="copy_from">
                <el-select
                  v-model="groupForm.copy_from"
                  size="mini"
                  placeholder="Please select"
                  @change="copySubGroup">
                  <el-option
                    v-for="item in copyGroupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Description" prop="description">
            <el-input
              type="textarea"
              size="mini"
              rows="4"
              v-model="groupForm.description"
              placeholder="Group Description"></el-input>
          </el-form-item>
        </el-form>
        <div class="rearrange-group">
          <div class="left">
            <h5>All sub-groups</h5>
            <el-tree
              ref="subGroupsTree"
              :data="subGroupsTreeData"
              node-key="id"
              draggable
              default-expand-all
              :expand-on-click-node="false"
              :allow-drag="
                (node) => !subGroupTreeNodeEditing.includes(node.data.id)
              "
              :allow-drop="subGroupAllowDrop"
              @node-drag-start="handleSubGroupsTreeNodeDragStart"
              @node-drag-enter="handleSubGroupsTreeNodeDragEnter"
              @node-drag-end="handleSubGroupsTreeNodeDragEnd"
              @dragleave.native="handleSubGroupsTreeNodeDragLeave"
              @node-click="subGroupsTreeNodeClick">
              <div
                class="sub-group-tree-node"
                :data-node-id="data.id"
                slot-scope="{ data }">
                <template v-if="data.editable">
                  <div
                    v-show="!subGroupTreeNodeEditing.includes(data.id)"
                    class="tree-node-label"
                    :title="data.name"
                    @dblclick="
                      (event) => toggleSubGroupTreeNodeEdit(data, true)
                    ">
                    {{ data.name }}
                  </div>
                  <el-input
                    v-show="subGroupTreeNodeEditing.includes(data.id)"
                    size="mini"
                    v-model="data.name"
                    class="sub-group-label-input"
                    @input="validateSubGroupNameInput(data)"
                    @blur="toggleSubGroupTreeNodeEdit(data, false)"></el-input>
                  <span
                    v-show="data.name === ''"
                    class="sub-group-label-input-validate">
                    sub-group name cannot be empty
                  </span>
                  <span
                    v-show="data.existing"
                    class="sub-group-label-input-validate">
                    the sub-group name already exists, please change it
                  </span>
                </template>

                <span v-else :title="getRuleAlias(data)">
                  {{ getRuleAlias(data) }}
                </span>
              </div>
            </el-tree>
            <div class="sub-group-btns">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="addSubGroup"></el-button>
              <el-button
                size="mini"
                icon="el-icon-minus"
                :disabled="!currentClickedSubGroupsTreeNode"
                @click="deleteSubGroup"></el-button>
            </div>
          </div>
          <div class="right">
            <h5>All rules</h5>
            <el-tree
              ref="allRulesTree"
              :data="currentGroupAllRules"
              node-key="id"
              draggable
              default-expand-all
              :allow-drop="() => false"
              @node-drag-start="handleAllRulesTreeNodeDragStart"
              @node-drag-end="handleAllRulesTreeNodeDragEnd">
              <div
                class="all-rule-tree-node"
                :title="getRuleAlias(data)"
                slot-scope="{ data }">
                {{ getRuleAlias(data) }}
              </div>
            </el-tree>
          </div>
        </div>
        <div class="footer">
          <el-button @click="closeGroupDialog">Cancel</el-button>
          <el-button type="primary" @click="saveGroup">Save</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  updateRule,
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupChildren,
  getGroupRules,
  getRuleOperationRecords,
  updateRuleOperationRecord,
  getRulesOperationRecord,
} from '../../../../store/api/hkex.group.api';

const OPERATION = {
  INIT: 10,
  NEW: 20,
  AMENDED: 30,
  REPEALED: 40,
};

export default {
  name: 'rule-management',
  data() {
    return {
      loading: false,
      currentMenuType: 'Annual Report',
      currentGroupId: null,
      currentMenuKey: 'group',
      ruleDialogVisible: false,
      originalRuleForm: null,
      ruleSearchBy: 'MLR',
      ruleSearchInput: '',
      ruleForm: {
        rule: '',
        rule_description: '',
        main_rule: '',
        gem_rule: '',
        gem_description: '',
        activated_at: '',
      },
      currentEditingRule: '',
      currentEditingRuleRecordFormOriginal: null,
      OPERATION,
      ruleOperationRecords: {
        loading: false,
        items: [],
        pager: {
          page: 1,
          size: 2,
          total: 0,
        },
      },
      ruleFormRules: {
        operation: [
          {
            required: true,
            message: 'Please select the operation',
            trigger: 'change',
          },
        ],
        rule: [
          {
            required: true,
            message: 'Please enter the MLR name',
            trigger: 'blur',
          },
        ],
        rule_description: [
          {
            required: true,
            message: 'Please enter the MLR description',
            trigger: 'blur',
          },
        ],
        gem_rule: [
          {
            required: true,
            message: 'Please enter the GLR name',
            trigger: 'blur',
          },
        ],
        gem_description: [
          {
            required: true,
            message: 'Please enter the GLR description',
            trigger: 'blur',
          },
        ],
        activated_at: [
          {
            required: true,
            message: `Please pick the date`,
            trigger: 'blur',
          },
        ],
      },
      groups: [],
      groupList: {
        items: [],
        pager: {
          page: 1,
          size: 10,
          total: 0,
        },
      },
      groupRuleList: {
        items: [],
        pager: {
          page: 1,
          size: 10,
          total: 0,
        },
      },
      groupDialogVisible: false,
      groupDialogLoading: false,
      groupEditing: null,
      groupForm: {
        name: '',
        copy_from: '',
        description: '',
      },
      groupFormCloned: null,
      groupFormRules: {
        name: [
          {
            required: true,
            message: 'Please enter the group name',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: 'Please enter the group description',
            trigger: 'blur',
          },
        ],
      },
      currentClickedSubGroupsTreeNode: null,
      dragingNode: null,
      isDragingOut: false,
      subGroupsTreeData: [],
      subGroupsTreeDataCloned: null,
      subGroupTreeNodeEditing: [],
      operationRecordDialogVisible: false,
      operationRecord: {
        loading: false,
        items: [],
        pager: {
          page: 1,
          size: 10,
          total: 0,
        },
      },
    };
  },
  computed: {
    menuTreeData() {
      return this.groups.map((item) => {
        const children = [
          {
            key: `${item.id}_group`,
            groupId: item.id,
            menuKey: 'group',
            label: 'Group',
          },
          {
            key: `${item.id}_rule`,
            groupId: item.id,
            menuKey: 'rule',
            label: 'Rule Lists',
          },
        ];

        if (item.name === 'Result') {
          children.splice(0, 1);
        }

        return {
          key: item.id,
          label: item.name,
          children,
        };
      });
    },
    groupDialogTitle() {
      return this.groupEditing ? 'Edit Group' : 'Create New Group';
    },
    copyGroupOptions() {
      return this.groupList.items;
    },
    currentGroupAllRules() {
      const group = this.groups.find((item) => item.id === this.currentGroupId);
      if (group) {
        const subGroup = group.children.find((item) => item.name === 'All');
        const allRules = [];
        if (subGroup) {
          subGroup.children.forEach((child) => {
            allRules.push(...child.rules);
          });
        }
        return allRules;
      }

      return [];
    },
    ruleFromUnmodified() {
      return _.isEqual(this.ruleForm, this.originalRuleForm);
    },
    showAddNewRuleOperationButton() {
      if (this.ruleOperationRecords.pager.page !== 1) {
        return false;
      }
      if (this.ruleOperationRecords.items.length === 0) {
        return true;
      }
      return (
        this.ruleOperationRecords.items[0].operation !== OPERATION.REPEALED
      );
    },
    ruleOperationOptions() {
      return [
        {
          value: OPERATION.NEW,
          label: 'New',
          disabled: this.originalRuleForm.already_new,
        },
        {
          value: OPERATION.AMENDED,
          label: 'Amended',
        },
        {
          value: OPERATION.REPEALED,
          label: 'Repealed',
        },
      ];
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.loading = true;

        await this.getGroups();
        if (this.groups.length > 0) {
          this.currentGroupId = this.currentGroupId || this.groups[0].id;

          if (this.currentMenuKey === 'group') {
            await this.getGroupList();
          } else {
            await this.getGroupRuleList();
          }
        }
        this.setMenuTreeCurrentKey();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async getGroups() {
      const data = await getGroups();
      this.groups = data;
      await this.$nextTick();
      this.setMenuTreeCurrentKey();
    },
    setMenuTreeCurrentKey() {
      const { groupId, menuKey } = this.$route.query;
      this.currentGroupId = groupId || this.currentGroupId;
      this.currentMenuKey = menuKey || this.currentMenuKey;
      this.$refs.menuTree.setCurrentKey(
        `${this.currentGroupId}_${this.currentMenuKey}`,
      );
    },
    getListIndex(index) {
      const { page, size } =
        this.currentMenuKey === 'group'
          ? this.groupList.pager
          : this.groupRuleList.pager;
      return (page - 1) * size + index + 1;
    },
    getRuleAlias(rule, type = 'main') {
      return type === 'main' ? rule.main_alias : rule.gem_alias;
    },
    async getGroupList() {
      try {
        this.loading = true;

        const data = await getGroupChildren(this.currentGroupId, {
          page: this.groupList.pager.page,
          page_size: this.groupList.pager.size,
        });
        this.groupList.items = data.items;
        this.groupList.pager.total = data.total;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async getRuleOperationRecords() {
      try {
        this.ruleOperationRecords.loading = true;
        const data = await getRuleOperationRecords(this.currentEditingRule, {
          page: this.ruleOperationRecords.pager.page,
          page_size: this.ruleOperationRecords.pager.size,
        });
        this.ruleOperationRecords.items = data.items.map((item) => {
          return {
            ...item,
            activated_at: item.activated_at * 1000,
            editing: false,
          };
        });
        this.ruleOperationRecords.pager.total = data.total;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.ruleOperationRecords.loading = false;
      }
    },
    handleChangeRuleOperationRecordsPage(page) {
      this.ruleOperationRecords.pager.page = page;
      this.getRuleOperationRecords();
    },
    handleChangeGroupListPage(page) {
      this.groupList.pager.page = page;
      this.getGroupList();
    },
    handleChangeGroupListPageSize(size) {
      this.groupList.pager.page = 1;
      this.groupList.pager.size = size;
      this.getGroupList();
    },
    searchGroupRuleList() {
      this.groupRuleList.pager.page = 1;
      this.ruleSearchInput = this.ruleSearchInput.trim();
      this.getGroupRuleList();
    },
    async getGroupRuleList() {
      try {
        this.loading = true;

        const params = {
          page: this.groupRuleList.pager.page,
          page_size: this.groupRuleList.pager.size,
        };
        if (this.ruleSearchInput !== '') {
          Object.assign(params, {
            by: this.ruleSearchBy,
            q: this.ruleSearchInput,
          });
        }
        const data = await getGroupRules(this.currentGroupId, params);
        this.groupRuleList.items = data.items;
        this.groupRuleList.pager.total = data.total;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    handleChangeGroupRuleListPage(page) {
      this.groupRuleList.pager.page = page;
      this.getGroupRuleList();
    },
    handleChangeGroupRuleListPageSize(size) {
      this.groupRuleList.pager.page = 1;
      this.groupRuleList.pager.size = size;
      this.getGroupRuleList();
    },
    async selectMenu(data, node) {
      const { groupId, menuKey } = data;
      if (!menuKey) {
        return;
      }
      this.currentMenuType = node.parent.data.label;
      this.currentGroupId = groupId;
      this.currentMenuKey = menuKey;

      if (this.currentMenuKey === 'group') {
        this.groupList.pager.page = 1;
        await this.getGroupList();
        this.getGroups();
      } else {
        this.ruleSearchInput = '';
        this.groupRuleList.pager.page = 1;
        await this.getGroupRuleList();
      }
      this.$router.replace({
        name: 'ruleManagement',
        query: { menuKey, groupId },
      });
    },
    openRuleDialog(row) {
      this.ruleDialogVisible = true;
      this.currentEditingRule = row.rule;
      this.ruleForm = {
        ...row,
        activated_at: row.activated_at * 1000,
      };
      this.originalRuleForm = _.cloneDeep(this.ruleForm);
      this.getRuleOperationRecords();
    },
    closeRuleDialog() {
      this.ruleDialogVisible = false;
      this.originalRuleForm = null;
      this.ruleForm = {
        rule: '',
        rule_description: '',
        main_rule: '',
        gem_rule: '',
        gem_description: '',
        activated_at: '',
      };
      this.ruleOperationRecords.pager.page = 1;
    },
    addNewRuleOperation() {
      const newRuleForm = {
        ...this.originalRuleForm,
        isAdd: true,
        editing: true,
        operation: '',
        rule_description: '',
        gem_description: '',
        activated_at: '',
      };
      this.ruleOperationRecords.items.unshift(newRuleForm);
    },
    saveEditingRuleOperationRecordButtonDisabled(item) {
      return _.isEqual(item, this.currentEditingRuleRecordFormOriginal);
    },
    editRuleOperationRecord(item) {
      item.editing = true;
      this.currentEditingRuleRecordFormOriginal = _.cloneDeep(item);
    },
    cancelEditingRuleOperationRecord(item) {
      const { activated_at, rule_description, gem_description } =
        this.currentEditingRuleRecordFormOriginal;
      item.editing = false;
      item.activated_at = activated_at;
      item.rule_description = rule_description;
      item.gem_description = gem_description;
      this.$refs.ruleForm.clearValidate();
    },
    async saveEditingRuleOperationRecord(record) {
      const isValid = await this.$refs.ruleForm.validate();
      if (isValid) {
        try {
          const data = {
            ...record,
            activated_at: record.activated_at / 1000,
          };
          await updateRuleOperationRecord(record.id, data);

          await this.getRuleOperationRecords();

          this.getGroupRuleList();

          this.$notify({
            title: 'Success',
            message: `Update record successfully.`,
            type: 'success',
          });
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async saveRuleOperation(rule) {
      const isValid = await this.$refs.ruleForm.validate();
      if (isValid) {
        try {
          const data = {
            ...rule,
            activated_at: rule.activated_at / 1000,
          };
          await updateRule(this.ruleForm.id, data);

          if (rule.operation === OPERATION.NEW) {
            this.originalRuleForm.already_new = true;
          }

          await this.getRuleOperationRecords();

          this.getGroupRuleList();

          this.$notify({
            title: 'Success',
            message: `Update rule successfully.`,
            type: 'success',
          });
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async openGroupDialog(row) {
      this.groupDialogVisible = true;
      if (row) {
        try {
          this.groupDialogLoading = true;
          const currentGroup = await getGroup(row.id);
          this.groupEditing = currentGroup;
          this.groupForm.name = currentGroup.name;
          this.groupForm.description = currentGroup.description;
          this.subGroupsTreeData = this.convertGroupRulesToSubGroupsTreeData(
            currentGroup.children,
          );
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        } finally {
          this.groupDialogLoading = false;
        }
      } else {
        this.groupEditing = null;
      }
      this.groupFormCloned = _.cloneDeep(this.groupForm);
      this.subGroupsTreeDataCloned = _.cloneDeep(this.subGroupsTreeData);
    },
    async closeGroupDialog() {
      const isGroupFormModified =
        !_.isEqual(this.groupForm, this.groupFormCloned) ||
        !_.isEqual(this.subGroupsTreeData, this.subGroupsTreeDataCloned);
      if (isGroupFormModified) {
        const confirm = await this.$confirm(
          'The current data is not saved. Confirm leaving?',
          'Message',
        ).catch(() => {});
        if (confirm === 'confirm') {
          this.resetGroupFormData();
        }
      } else {
        this.resetGroupFormData();
      }
    },
    resetGroupFormData() {
      this.groupDialogVisible = false;
      this.groupEditing = null;
      this.groupForm = {
        name: '',
        copy_from: '',
        description: '',
      };
      this.subGroupsTreeData = [];
      this.subGroupTreeNodeEditing = [];
      this.groupFormCloned = null;
      this.subGroupsTreeDataCloned = null;
    },
    async saveGroup() {
      const data = {
        name: this.groupForm.name,
        description: this.groupForm.description,
        children: this.convertSubGroupsTreeDataToGroupRules(
          this.subGroupsTreeData,
        ),
      };

      const isValid = await this.$refs.groupForm.validate();
      if (!isValid) {
        return;
      }
      if (data.children.some((child) => child.name === '')) {
        return;
      }
      const subGroupNames = data.children.map((child) => child.name);
      const hasDuplicateSubGroupName = _.some(
        subGroupNames,
        function (name, index) {
          return subGroupNames.indexOf(name) !== index;
        },
      );
      if (hasDuplicateSubGroupName) {
        return;
      }

      try {
        if (this.groupEditing) {
          await updateGroup(this.groupEditing.id, {
            ...this.groupEditing,
            ...data,
          });
        } else {
          await createGroup({ ...data, parent_id: this.currentGroupId });
        }

        await this.getGroups();
        await this.getGroupList();

        this.$notify({
          title: 'Success',
          message: `${
            this.groupEditing ? 'Update' : 'Create'
          } group successfully.`,
          type: 'success',
        });

        this.resetGroupFormData();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async enableGroup(group, is_enabled) {
      try {
        await updateGroup(group.id, { ...group, is_enabled });

        await this.getGroupList();

        this.$notify({
          title: 'Success',
          message: `${is_enabled ? 'Enable' : 'Disable'} group successfully.`,
          type: 'success',
        });
      } catch (error) {
        group.is_enabled = !is_enabled;
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteGroup(group) {
      const confirm = await this.$confirm(
        'Confirm deleting the group?',
        'Message',
      ).catch(() => {});

      if (confirm === 'confirm') {
        try {
          await deleteGroup(group.id);
          this.$notify({
            title: 'Success',
            message: `Delete group successfully.`,
            type: 'success',
          });

          const islastItem =
            this.groupList.items.findIndex((item) => item.id === group.id) ===
            this.groupList.items.length - 1;
          if (islastItem && this.groupList.pager.page > 1) {
            this.groupList.pager.page -= 1;
          }
          await this.getGroupList();
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async addSubGroup() {
      const defaultTreeNode = {
        id: uuid(),
        name: 'Unnamed',
        editable: true,
        existing: false,
      };
      this.subGroupsTreeData.push(defaultTreeNode);

      await this.$nextTick();
      this.toggleSubGroupTreeNodeEdit(defaultTreeNode, true);
    },
    async deleteSubGroup() {
      const confirm = await this.$confirm(
        'Are you sure want to delete this sub-group or this rule?',
        'Message',
      ).catch(() => {});

      if (confirm === 'confirm') {
        this.$refs.subGroupsTree.remove(this.currentClickedSubGroupsTreeNode);
        this.currentClickedSubGroupsTreeNode = null;
      }
    },
    copySubGroup(id) {
      const group = this.copyGroupOptions.find((item) => item.id === id);
      this.groupForm.description = group.description;
      const currentGroup = this.groups.find(
        (group) => group.id === this.currentGroupId,
      );
      if (currentGroup) {
        const subGroup = currentGroup.children.find((child) => child.id === id);
        if (subGroup) {
          this.subGroupsTreeData = this.convertGroupRulesToSubGroupsTreeData(
            subGroup.children,
          );
        }
      }
    },
    subGroupAllowDrop(draggingNode, dropNode, type) {
      let subGroupNode = dropNode;
      if (dropNode.isLeaf) {
        subGroupNode = dropNode.parent;
      }
      const draggingNodeExisted = subGroupNode.childNodes.some(
        (child) => child.data.id === draggingNode.data.id,
      );
      if (draggingNode.parent.data.id === undefined && draggingNodeExisted) {
        return false;
      }
      if (
        draggingNode.parent.data.id !== subGroupNode.data.id &&
        draggingNodeExisted
      ) {
        return false;
      }
      if (draggingNode.data.editable) {
        return draggingNode.level === dropNode.level && type !== 'inner';
      }
      return dropNode.level === 1 ? type === 'inner' : type !== 'inner';
    },
    subGroupsTreeNodeClick(data, node) {
      if (this.subGroupTreeNodeEditing.includes(data.id)) {
        return;
      }
      if (node.level > 1) {
        this.currentClickedSubGroupsTreeNode = null;
        return;
      }
      this.currentClickedSubGroupsTreeNode = node;
    },
    async toggleSubGroupTreeNodeEdit({ id, name }, enable) {
      const inputEl = this.$refs.subGroupsTree.$el.querySelector(
        `[data-node-id="${id}"] .sub-group-label-input input`,
      );

      if (enable) {
        this.subGroupTreeNodeEditing = [...this.subGroupTreeNodeEditing, id];
      } else {
        if (name === '') {
          await this.$nextTick();
          if (inputEl) {
            inputEl.focus();
            inputEl.select();
          }
          return;
        }

        if (!this.validateSubGroupNameInput({ id, name })) {
          await this.$nextTick();
          if (inputEl) {
            inputEl.focus();
          }
          return;
        }

        this.subGroupTreeNodeEditing = this.subGroupTreeNodeEditing.filter(
          (item) => item !== id,
        );
      }

      if (enable) {
        await this.$nextTick();

        if (inputEl) {
          inputEl.focus();
          inputEl.select();
        }
      }
    },
    validateSubGroupNameInput({ id, name }) {
      const allSubGroupNames = this.subGroupsTreeData
        .filter((i) => i.id !== id)
        .map((i) => i.name);
      const currentSubGroup = this.subGroupsTreeData.find((i) => i.id === id);
      if (allSubGroupNames.includes(name)) {
        currentSubGroup.existing = true;
        return false;
      }
      currentSubGroup.existing = false;
      return true;
    },
    setDragingNodeStatus() {
      this.$refs.subGroupsTree.$children.forEach((node) => {
        node.$el.classList.remove('is-draging-node-enter');
      });
      this.$refs.subGroupsTree.$el.querySelector(
        '.el-tree__drop-indicator',
      ).style.display = 'none';
    },
    handleAllRulesTreeNodeDragStart(node, event) {
      this.$refs.subGroupsTree.$emit('tree-node-drag-start', event, { node });
      this.dragingNode = node;
    },
    handleSubGroupsTreeNodeDragEnter(draggingNode, enterNode, event) {
      const enterSubGroupNode = event.target.closest('.el-tree-node__children')
        ? event.target.closest('.el-tree-node__children').parentNode
        : event.target.parentNode;
      const allSubGroupNodes = this.$refs.subGroupsTree;
      allSubGroupNodes.$children.forEach((node) => {
        node.$el.classList.remove('is-draging-node-enter');
      });
      enterSubGroupNode.classList.add('is-draging-node-enter');
    },
    handleSubGroupsTreeNodeDragEnd() {
      if (this.isDragingOut && this.dragingNode.level > 1) {
        this.$refs.subGroupsTree.remove(this.dragingNode);
      }
      this.setDragingNodeStatus();
    },
    handleSubGroupsTreeNodeDragStart(node) {
      this.dragingNode = node;
    },
    handleSubGroupsTreeNodeDragLeave(event) {
      this.isDragingOut = false;
      if (
        event.fromElement &&
        !['el-tree-node__content', 'el-tree__drop-indicator'].includes(
          event.fromElement.className,
        )
      ) {
        this.isDragingOut = true;
        this.setDragingNodeStatus();
      }
    },
    handleAllRulesTreeNodeDragEnd(draggingNode, endNode, position, event) {
      const tempNodeData = { id: uuid() };
      const draggingNodeData = draggingNode.data;
      const allRulesTreeRef = this.$refs.allRulesTree;
      allRulesTreeRef.insertBefore(tempNodeData, draggingNode);
      if (this.isDragingOut) {
        this.handleSubGroupsTreeNodeDragEnd();
      } else {
        this.$refs.subGroupsTree.$emit('tree-node-drag-end', event);
      }
      this.$nextTick(() => {
        if (allRulesTreeRef.getNode(draggingNodeData)) {
          allRulesTreeRef.remove(tempNodeData);
        } else {
          const data = JSON.parse(JSON.stringify(draggingNodeData));
          const tempNode = this.$refs.allRulesTree.getNode(tempNodeData);
          allRulesTreeRef.insertAfter(data, tempNode);
          allRulesTreeRef.remove(tempNodeData);
        }
      });
    },
    openOperationRecordDialog() {
      this.getOperationRecord();
      this.operationRecordDialogVisible = true;
    },
    closeOperationRecordDialog() {
      this.operationRecordDialogVisible = false;
    },
    async getOperationRecord() {
      try {
        this.operationRecord.loading = true;

        const params = {
          group_id: this.currentGroupId,
          page: this.operationRecord.pager.page,
          page_size: this.operationRecord.pager.size,
        };
        const res = await getRulesOperationRecord(params);

        this.operationRecord.items = res.items;
        this.operationRecord.pager.total = res.total;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.operationRecord.loading = false;
      }
    },
    handleChangeOperationRecordPage(page) {
      this.operationRecord.pager.page = page;
      this.getOperationRecord();
    },
    handleChangeOperationRecordPageSize(size) {
      this.operationRecord.pager.page = 1;
      this.operationRecord.pager.size = size;
      this.getOperationRecord();
    },
    convertGroupRulesToSubGroupsTreeData(rules) {
      return rules.map((item) => ({
        id: item.id,
        name: item.name,
        editable: true,
        children: item.rules,
      }));
    },
    convertSubGroupsTreeDataToGroupRules(data) {
      return data.map((node) => {
        const subGroupData = {
          name: node.name,
          description: '',
          rules: node.children || [],
        };
        if (typeof node.id === 'number') {
          subGroupData.id = node.id;
        }
        return subGroupData;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';
@import '../../common/hkex-global.scss';

.rule-management {
  padding: 0;
  overflow: auto;

  .container {
    display: flex;
    height: 100%;
    overflow: auto;

    .menu-tree {
      position: sticky;
      top: 0;
      width: 170px;
      height: 100%;
      overflow: auto;
      padding: 20px 0;
      box-sizing: border-box;
      border-right: 1px solid rgba($--color-black, 0.15);

      ::v-deep > .el-tree-node {
        margin: 10px 0;

        > .el-tree-node__content {
          position: relative;
          padding: 5px 50px 5px 20px !important;

          .el-tree-node__expand-icon {
            position: absolute;
            top: 6px;
            right: 5px;

            &::before {
              content: '\e6e0';
              font-size: 14px;
              font-weight: bold;
              color: #999;
            }
          }

          .el-tree-node__label {
            font-weight: bold;
          }
        }

        .el-tree-node__children {
          .el-tree-node {
            &.is-current {
              color: $--color-primary;
              background: rgba(82, 151, 159, 0.1);
              border-right: 2px solid $--color-primary;
            }
          }

          .el-tree-node__content {
            padding: 5px 0;
          }
        }
      }
    }

    .right-panel {
      width: calc(100% - 160px);
      height: 100vh;
      overflow: hidden;
      box-sizing: border-box;

      header {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;
        padding-bottom: 20px;
        .search-bar {
          display: flex;
          ::v-deep .el-input {
            margin-right: 20px;
            .el-input__inner {
              border-color: #dcdfe6;
              &:focus {
                border-color: $--color-blue;
              }
            }
            .el-input-group__prepend {
              .el-select {
                width: 80px;
                .el-input__inner {
                  border: 0;
                }
              }
            }
            .el-input-group__append {
              .el-button {
                width: 60px;
              }
            }
          }
        }
      }

      > div {
        height: 100%;
        margin: 30px 0 0 0;
        padding: 0 20px 20px 20px;
        overflow: auto;
        box-sizing: border-box;
      }

      .el-table {
        width: 100%;
        overflow: initial;
        z-index: 0;
        ::v-deep .el-table__header-wrapper {
          position: sticky;
          top: 52px;
          z-index: 1;
        }

        ::v-deep .cell {
          padding: 10px;

          > span {
            &.active {
              color: $--color-primary;
            }
            &.repealed {
              color: $--color-red;
            }
          }

          .el-button--text {
            padding: 0;
          }

          .btn-delete {
            margin-left: 10px;
            i {
              color: #dddfe6;
              font-size: 18px;
              font-weight: bold;

              &:hover {
                color: $--color-primary;
              }
            }
          }
        }
      }

      .btns {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;

        .el-button {
          background-color: $--color-primary;
        }
      }
    }
  }

  ::v-deep .el-dialog {
    &.rule-dialog {
      .el-dialog__body {
        padding: 10px 20px;
      }
      .btn-add {
        width: 100%;
        background-color: #fff;
        color: $--color-primary;
        border-color: $--color-primary;
        i {
          font-size: 18px;
        }
      }
      .list {
        list-style: none;
        li {
          margin: 10px 0;
          padding: 5px 10px;
          border: 1px solid #e2e5ed;
          border-radius: 3px;
          background-color: #f6f6f6;
          .date {
            .el-select {
              width: 140px;
            }
            ::v-deep .el-input__inner {
              border-color: #999;
            }
          }
          .btns {
            display: flex;
            justify-content: flex-end;
            padding: 10px 0 5px;
          }
          .el-row {
            padding: 5px 0 0 0;
            &.time {
              padding: 15px;
              border-bottom: 1px solid #e2e5ed;
              &::before {
                content: '';
                display: inline-block;
                width: 10px;
                height: 10px;
                margin-right: 5px;
                background-color: $--color-primary;
                border-radius: 50%;
              }
            }

            .el-form-item {
              margin-bottom: 0;
              &.is-error {
                .el-input__inner {
                  border-color: $--color-red !important;
                }
              }
              .el-form-item__error {
                position: initial;
              }
              .el-input {
                &.is-disabled {
                  .el-input__inner {
                    color: #888;
                  }
                }
                .el-input__inner {
                  border-color: #dcdfe6;
                  &:focus {
                    border-color: $--color-blue;
                  }
                }
              }
            }
            .btn-delete {
              margin-left: 20px;
              color: #6b6c6f;
              &:hover {
                color: $--color-red;
              }
            }
          }
          .el-divider--horizontal {
            margin: 0 0 15px 0;
          }
        }
      }
    }
    .el-form {
      .el-input__inner {
        color: #606266;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        &:focus {
          border-color: $--color-blue;
        }
      }

      .el-input__suffix {
        .el-input__icon {
          &::before {
            color: #c0c4cc;
          }
        }
      }

      .el-textarea__inner {
        border-radius: 0;
        resize: none;
        font-size: 14px;
      }

      .el-select {
        width: 100%;
      }

      .el-date-editor {
        &.el-input {
          width: 100%;
        }
      }
    }

    .footer {
      margin-top: 30px;
      text-align: center;

      .el-button {
        padding: 8px 30px;
        border-radius: 0;
      }
    }
  }

  .operation-record-dialog {
    ::v-deep .el-dialog__body {
      max-height: 75vh;
      overflow-y: auto;
    }
  }

  ::v-deep .el-collapse {
    border: none;

    .el-collapse-item__arrow {
      margin: 1px 0 0 40px;
    }

    .el-collapse-item__header {
      border-bottom: none;
    }
  }

  .el-pagination {
    padding: 20px 0;
    text-align: center;

    ::v-deep .el-pager li:not(.disabled).active {
      background-color: #5287e1;
    }
  }

  .el-button--primary {
    background-color: #5287e1;
    border-color: #5287e1;

    &.is-disabled {
      opacity: 0.5;
    }
  }

  .rearrange-group {
    display: flex;
    position: relative;
    padding: 20px;
    background-color: #f8f8f8;
    min-height: 30vh;
    max-height: 38vh;

    & > div {
      position: relative;
      display: flex;
      flex-flow: column;
      overflow: auto;
      flex: 1;

      &.left {
        border-right: 10px solid #f8f8f8;
      }

      .el-tree {
        flex: 1;
        ::v-deep .el-tree-node {
          &.is-draging-node-enter {
            background-color: rgb($--color-primary, 15%);
          }
        }
        .sub-group-tree-node {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          .tree-node-label {
            max-width: 95%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    h5 {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 0 10px 10px 10px;
      background-color: #f8f8f8;
      color: $--color-primary;
    }

    .sub-group-label-input {
      width: auto;

      ::v-deep input {
        height: 24px;
        line-height: 24px;
        padding: 0 4px;
      }
    }

    .sub-group-label-input-validate {
      color: #f56c6c;
      font-size: 12px;
    }

    .sub-group-btns {
      position: sticky;
      bottom: 0;
      background: #fff;
      padding: 5px 8px;

      button {
        padding: 2px;
        border-radius: 0;
        background-color: #000;
        color: #fff;

        &[disabled] {
          opacity: 0.4;
        }
      }
    }
  }
}
</style>
