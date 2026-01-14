<template>
  <div class="listing-rule-selector">
    <el-select
      :value="checkedRules.map((rule) => getRuleAlias(rule))"
      size="mini"
      multiple
      placeholder="Listing rules"
      class="rule-select"
      :popper-append-to-body="false"
      clearable
      collapse-tags
      @remove-tag="uncheckedFirstNode">
      <el-option value="" disabled>
        <div class="filter-options">
          <div class="search-bar">
            <el-input
              slot="reference"
              ref="searchInput"
              v-model="searchInputText"
              class="search-input"
              :class="{ 'has-prefix': searchBy !== '', [searchBy]: true }"
              size="mini"
              clearable
              suffix-icon="el-icon-search"
              placeholder=""
              @input="handleSearchInput"
              @keyup.enter.native="filterNodes"
              @clear="clearSearchInput">
              <el-select
                v-model="searchBy"
                size="mini"
                slot="prepend"
                :popper-append-to-body="false"
                @change="changeSearchBy">
                <el-option
                  v-for="(item, index) in searchByOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-input>
            <div class="recent-searches">
              <h5>
                <span>Recent searches</span>
                <el-tooltip effect="dark" content="Clear all" placement="top">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteAllRecentSearches">
                  </el-button>
                </el-tooltip>
              </h5>
              <div class="search-records">
                <el-tag
                  v-for="(record, index) in recentSearchRecords"
                  :key="index"
                  type="info"
                  size="mini"
                  :class="[searchRecordId === record.id ? 'active' : '']"
                  closable
                  @click="selectRecentSearch(record)"
                  @close="deleteRecentSearch(record.id)">
                  <span class="text" :title="record.text">{{
                    record.text
                  }}</span>
                </el-tag>
              </div>
            </div>
          </div>
          <div class="action-bar">
            <el-checkbox v-model="checkedAll" @change="checkAllNodes">
              Select All
            </el-checkbox>
            <el-button type="text" size="mini" @click="expandAllNodes">
              {{ isExpandAll ? 'Collapse All' : 'Expand All' }}
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </div>
        </div>
        <el-tree
          ref="groupTree"
          class="group-tree"
          :data="groupTreeData"
          node-key="id"
          check-on-click-node
          :default-expand-all="isExpandAll"
          :default-checked-keys="checkedKeys"
          :expand-on-click-node="false"
          :filter-node-method="filterNodesHandler">
          <div
            class="group-tree-node"
            :data-node-id="data.id"
            :title="data.label"
            slot-scope="{ node, data }">
            <el-checkbox
              v-model="data.is_checked"
              :indeterminate="data.indeterminate"
              @change="handleTreeNodeChecked(node)">
              {{ data.label }}
            </el-checkbox>
          </div>
        </el-tree>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  getReviewSearchHistory,
  createReviewSearchHistory,
  deleteReviewSearchHistory,
  deleteReviewAllSearchHistories,
} from '../../../store/api/hkex.group.api';
import ReportTypeMixin from '../mixins/ReportType.mixin';
import ReportReviewMixin from '../mixins/ReportReview.mixin';
import { saveDataInStorage, readDataFromStorage } from '../common/utils';

export default {
  name: 'listing-rule-selector',
  mixins: [ReportTypeMixin, ReportReviewMixin],
  props: {
    groups: {
      type: Array,
      require: true,
      default: () => [],
    },
    fileMeta: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      searchRecordId: null,
      searchInputText: '',
      searchBy: '',
      searchByOptions: [
        {
          value: '',
          label: 'All',
        },
        {
          value: 'group',
          label: 'Group name',
        },
        {
          value: 'name',
          label: 'Rule name',
        },
        {
          value: 'description',
          label: 'Rule description',
        },
      ],
      checkedAll: false,
      checkedRules: [],
      selectedTree: [],
      recentSearchRecords: [],
      isExpandAll: true,
      checkedKeys: [],
    };
  },
  computed: {
    groupTreeData() {
      return this.groups.map((group) => {
        return {
          data: group,
          id: uuid(),
          label: group.name,
          is_checked: false,
          indeterminate: false,
          children: group.children.map((subGroup) => {
            return {
              data: subGroup,
              id: uuid(),
              label: subGroup.name,
              is_checked: false,
              indeterminate: false,
              children: subGroup.rules.map((rule) => {
                return {
                  data: { ...rule, parent_id: subGroup.id },
                  id: uuid(),
                  rule: rule.rule,
                  is_checked: false,
                  indeterminate: false,
                  label: this.getRuleAlias(rule),
                };
              }),
            };
          }),
        };
      });
    },
  },
  watch: {
    groups: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.setExpandAllStatus();
      this.getRencentSearches();
      this.initTree();
    },
    async initTree() {
      await this.$nextTick();
      const storageData = readDataFromStorage();
      if (storageData) {
        const cachedSearch = storageData.listing_rule_search;
        if (cachedSearch) {
          this.searchBy = cachedSearch.by;
          this.searchInputText = cachedSearch.text;
          this.searchRecordId = cachedSearch.id;
          this.filterNodes();
        } else {
          this.filterNodes();
          this.setCheckedNodes();
        }
      } else {
        this.selectGroupAll();
      }
    },
    async getRencentSearches() {
      try {
        const data = await getReviewSearchHistory({
          rule_type: this.auditType,
        });
        this.recentSearchRecords = data;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    selectRecentSearch(record) {
      const { id, text, search_by } = record;
      if (this.searchRecordId === id) {
        return;
      }
      this.searchBy = search_by === 'all' ? '' : search_by;
      this.searchRecordId = id;
      this.searchInputText = text;
      this.saveAllNodesDataToStorage();
      this.filterNodes();
    },
    async createRecentSearch() {
      try {
        const res = await createReviewSearchHistory({
          rule_type: this.auditType,
          q: this.searchInputText.trim(),
          by: this.searchBy,
        });
        this.searchRecordId = res.id;
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteRecentSearch(id) {
      try {
        await deleteReviewSearchHistory(id);
        this.getRencentSearches();
        if (this.searchRecordId === id) {
          this.handleAfterDeleteSearch();
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteAllRecentSearches() {
      try {
        await deleteReviewAllSearchHistories({ rule_type: this.auditType });
        this.getRencentSearches();
        this.handleAfterDeleteSearch();
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleAfterDeleteSearch() {
      this.searchRecordId = null;
      this.searchInputText = '';
      this.searchBy = '';
      saveDataInStorage({ listing_rule_checked: [] });
      this.checkAllNodes(false);
      this.setCheckedNodes();
      this.expandGroupAllToSubGroups();
    },
    async changeSearchBy(value) {
      this.searchBy = value;
      this.filterNodes();
      await this.$nextTick();
      this.$refs.searchInput.focus();
    },
    async clearSearchBy() {
      this.searchBy = '';

      await this.$nextTick();
      this.$refs.searchInput.focus();
    },
    setExpandAllStatus() {
      this.isExpandAll = !this.isArReport;
    },
    checkAllNodes(checked) {
      Object.values(this.$refs.groupTree.store.nodesMap).forEach((item) => {
        item.data.is_checked = checked;
        item.data.indeterminate = false;
      });

      this.groupTreeData.forEach((group) => {
        this.handleTreeNodeChecked(group);
      });
    },
    expandAllNodes() {
      this.isExpandAll = !this.isExpandAll;
      Object.values(this.$refs.groupTree.store.nodesMap).forEach((item) => {
        const isRuleNode = item.data.data.rule;

        if (!isRuleNode) {
          item.expanded = this.isExpandAll;
        }
      });
    },

    getCheckedNodes() {
      const checkedRules = [];
      this.groupTreeData.forEach((node) => {
        if (!node.children) {
          if (node.is_checked) {
            checkedRules.push(node.data);
          }
        } else {
          node.children.forEach(function checkNode(child) {
            if (child.rule && child.is_checked) {
              checkedRules.push(child.data);
            }

            if (child.children) {
              child.children.forEach(checkNode);
            }
          });
        }
      });

      return checkedRules;
    },

    setCheckedRules() {
      this.checkedRules = _.uniqBy(this.getCheckedNodes(), 'id');
      this.$emit('select-rules', this.checkedRules);
    },

    setParentNodeChecked(node) {
      if (!node.parent) {
        return;
      }
      if (
        node.parent.childNodes
          .filter((node) => node.visible)
          .every((node) => node.data.is_checked)
      ) {
        node.parent.data.is_checked = true;
        node.parent.data.indeterminate = false;
      } else {
        if (
          node.parent.childNodes.some(
            (node) => node.data.is_checked || node.data.indeterminate,
          )
        ) {
          node.parent.data.indeterminate = true;
          node.parent.data.is_checked = false;
        } else {
          node.parent.data.indeterminate = false;
          node.parent.data.is_checked = false;
        }
      }
      this.setParentNodeChecked(node.parent);
    },

    setCheckedNodes() {
      const storageData = readDataFromStorage();

      if (!storageData) {
        this.selectGroupAll();
        return;
      }

      const cachedCheckedRules = storageData.listing_rule_checked || [];
      const allLeafNodes = Object.values(
        this.$refs.groupTree.store.nodesMap,
      ).filter((node) => node.isLeaf);

      if (cachedCheckedRules.length === 0) {
        this.selectGroupAll();
        return;
      }

      cachedCheckedRules.forEach((rule) => {
        const node = allLeafNodes.find(
          (n) =>
            rule.parent_id === n.data.data.parent_id &&
            rule.id === n.data.data.id,
        );
        if (!node) {
          return;
        }
        node.data.is_checked = true;
        this.setParentNodeChecked(node);
      });

      this.setCheckedRules();
    },

    handleTreeNodeChecked(node) {
      if (node.data.children) {
        node.data.indeterminate = false;
        node.data.children.forEach(function setNodeChecked(childNode) {
          childNode.is_checked = node.data.is_checked;

          if (childNode.children) {
            childNode.children.forEach(setNodeChecked);
          }
        });
      }

      this.setParentNodeChecked(node);

      this.setCheckedRules();

      saveDataInStorage({
        listing_rule_checked: this.getCheckedNodes().map((rule) => {
          return {
            parent_id: rule.parent_id,
            id: rule.id,
            rule: rule.rule,
          };
        }),
      });

      this.filterNodes();
    },
    uncheckedFirstNode() {
      const checkedNodes = Object.values(
        this.$refs.groupTree.store.nodesMap,
      ).filter((node) => node.data.is_checked && node.isLeaf);
      checkedNodes[0].data.is_checked = false;
      saveDataInStorage({
        listing_rule_checked: this.getCheckedNodes().map((rule) => {
          return {
            parent_id: rule.parent_id,
            id: rule.id,
          };
        }),
      });
      this.filterNodes();
    },
    saveAllNodesDataToStorage() {
      const allRules = Object.values(this.$refs.groupTree.store.nodesMap)
        .filter((node) => node.isLeaf)
        .map((node) => node.data.data);

      saveDataInStorage({
        listing_rule_checked: allRules.map((rule) => {
          return {
            parent_id: rule.parent_id,
            id: rule.id,
            rule: rule.rule,
          };
        }),
      });
    },
    handleSearchInput: _.debounce(async function () {
      if (this.searchInputText.trim() !== '') {
        await this.createRecentSearch();
        await this.getRencentSearches();
        this.saveAllNodesDataToStorage();
        this.filterNodes();
      }
    }, 1000),
    clearSearchInput() {
      this.searchRecordId = null;
      this.checkAllNodes(false);
      this.setCheckedNodes();
      this.expandGroupAllToSubGroups();
    },
    async filterNodes() {
      const searchInputText = this.searchInputText.trim();
      this.$refs.groupTree.filter(searchInputText);
      if (searchInputText !== '') {
        saveDataInStorage({
          listing_rule_search: {
            by: this.searchBy,
            text: searchInputText,
            id: this.searchRecordId,
          },
        });
      } else {
        saveDataInStorage({ listing_rule_search: undefined });
      }
      await this.$nextTick();
      const allNodes = Object.values(this.$refs.groupTree.store.nodesMap);
      const cachedCheckedRules = readDataFromStorage().listing_rule_checked;
      allNodes.forEach((node) => {
        node.data.is_checked = false;
        node.data.indeterminate = false;
        if (
          node.visible &&
          cachedCheckedRules.some(
            (rule) =>
              rule.parent_id === node.data.data.parent_id &&
              rule.id === node.data.data.id,
          )
        ) {
          node.data.is_checked = true;
          this.setParentNodeChecked(node);
        }
      });
      this.setCheckedRules();
    },
    filterNodesHandler(value, nodeData, node) {
      if (!value) {
        return true;
      }

      const matchCase = false; // 不区分大小写
      const convertToLowerCase = (str) => {
        if (typeof str !== 'string') {
          return null;
        }
        return matchCase ? str : str.toLowerCase();
      };

      let { label, data } = nodeData;
      label = convertToLowerCase(label);
      value = convertToLowerCase(value);

      const isRuleNode = data.rule !== undefined;

      if (this.searchBy === 'group') {
        if (!isRuleNode) {
          return label.includes(value);
        } else {
          let isParentMatched = false;

          const checkParentNodeMatch = (parentNode) => {
            const parentNodeLabel = convertToLowerCase(parentNode.label);
            if (parentNodeLabel.includes(value)) {
              isParentMatched = true;
              return;
            }

            if (parentNode.level > 1) {
              checkParentNodeMatch(parentNode.parent);
            }
          };
          checkParentNodeMatch(node.parent);

          return isParentMatched;
        }
      }

      if (this.searchBy === 'name') {
        if (isRuleNode) {
          return label.includes(value);
        }
        return false;
      }

      if (this.searchBy === 'description') {
        if (isRuleNode) {
          const ruleDescription = convertToLowerCase(data.rule_description);
          return ruleDescription.includes(value);
        }
        return false;
      }

      let isParentMatched = false;

      const checkParentNodeMatch = (parentNode) => {
        const parentNodeLabel = convertToLowerCase(parentNode.label);
        const ruleDescription = convertToLowerCase(data.rule_description);
        if (
          (parentNodeLabel && parentNodeLabel.includes(value)) ||
          label.includes(value) ||
          (ruleDescription && ruleDescription.includes(value))
        ) {
          isParentMatched = true;
          return;
        }

        if (parentNode.level > 1) {
          checkParentNodeMatch(parentNode.parent);
        }
      };

      checkParentNodeMatch(node.parent);

      return isParentMatched;
    },
    selectGroupAll() {
      const allGroup = this.groupTreeData.find(
        (item) => item.data.name === 'All',
      );
      if (allGroup) {
        if (this.isArReport) {
          allGroup.indeterminate = true;
        } else {
          allGroup.is_checked = true;
        }
        allGroup.children.forEach(function checkNode(node) {
          if (node.label !== 'Archived') {
            node.is_checked = true;

            if (node.children) {
              node.children.forEach(checkNode);
            }
          }
        });
      }

      this.handleTreeNodeChecked(allGroup);
    },
    expandGroupAllToSubGroups() {
      Object.values(this.$refs.groupTree.store.nodesMap).forEach((item) => {
        if (item.level === 2) {
          item.expanded = this.isExpandAll;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common/color.scss';

.listing-rule-selector {
  flex: 1;

  .rule-select {
    width: 100%;

    ::v-deep .el-select__tags {
      .el-tag {
        max-width: 75%;
      }
    }

    ::v-deep > .el-input {
      .el-input__suffix-inner {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: url(../common/images/icon-filter.svg) no-repeat 50% 50%;
        cursor: pointer;

        .el-input__icon {
          display: none;
        }
      }
    }

    ::v-deep .el-select-dropdown {
      width: 100%;
      margin-top: 5px;
      border-radius: 0;

      .el-input__prefix {
        color: #999;

        .el-tag {
          margin: 7px 0 0 0;
          color: #333;
          background-color: #e6e6e6;
          border: 1px solid #d2d2d2;
        }
      }

      .el-select-dropdown__wrap {
        overflow: hidden;
        max-height: unset;
        margin: 0 !important;
      }

      .el-select-dropdown__item {
        display: flex;
        flex-flow: column;
        height: fit-content;
        min-height: 300px;
        max-height: 70vh;
        padding: 0;
        cursor: default;
        &.selected {
          color: $--color-primary;
        }
      }

      .popper__arrow {
        display: none;
      }
    }
  }

  ::v-deep .el-input {
    .el-input__inner {
      padding-right: 50px;
      text-overflow: ellipsis;
      border-color: #dcdfe6;

      &:hover {
        border-color: $--color-primary;
      }
    }

    .el-input__icon::before {
      color: #ccc;
    }
  }

  .filter-options {
    border-bottom: 1px solid #dcdfe6;
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

    .el-button {
      color: $--color-primary;

      .el-icon--right {
        margin-left: 0;
        font-weight: bold;
      }
    }
  }

  .group-tree {
    flex: 1;
    overflow: auto;

    .group-tree-node {
      width: 100%;
      .el-checkbox {
        display: flex;
        align-items: center;
        width: 100%;
        ::v-deep .el-checkbox__label {
          display: inline-block;
          max-width: 85%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }

  ::v-deep .el-checkbox {
    &.is-checked,
    .is-indeterminate {
      .el-checkbox__inner {
        background-color: $--color-primary;
      }

      .el-checkbox__label {
        color: $--color-primary;
      }
    }
  }

  .search-bar {
    padding: 0 10px;
    border-radius: 0;
    box-sizing: border-box;
    background-color: #fafafa;
    .search-input {
      ::v-deep .el-input-group__prepend {
        background-color: #fff;
        border-radius: 0;
        .el-select {
          width: 135px;
          border: none;
          color: $--color-primary;
          .el-select-dropdown {
            .el-select-dropdown__item {
              min-height: 0;
              padding: 0 10px;
              cursor: pointer;
              &::after {
                content: none;
              }
            }
          }
        }
        .el-input__inner {
          padding: 0 30px 0 10px;
          border: 1px solid #dcdfe6;
        }
        .el-input__suffix {
          right: 0;
          .el-select__caret {
            font-size: 12px;
            &::before {
              content: '\e79a';
            }
          }
        }
      }
    }

    .recent-searches {
      padding-bottom: 10px;
      border-bottom: 1px solid #e6e6e6;

      h5 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 3px;
        color: #666;
        .el-button {
          color: #6f7073;
          &:hover {
            color: $--color-red;
          }
        }
      }

      .search-records {
        display: flex;
        flex-wrap: wrap;

        .el-tag {
          margin: 0 5px 5px 0;
          border-radius: 15px;
          padding: 0 10px;
          background-color: #efeff0;
          cursor: pointer;

          &.active {
            background: rgba(54, 154, 162, 0.1);
            color: $--color-primary;
          }

          .text {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
