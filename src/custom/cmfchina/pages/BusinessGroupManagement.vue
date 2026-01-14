<template>
  <div class="business-group-management" v-loading="loading">
    <div class="page-header model-header">
      <el-button size="medium" type="primary" @click="dialogVisible = true">
        <i class="fa fa-plus fa-fw"></i>
        新增业务组
      </el-button>
    </div>

    <el-table ref="table" height="auto" :data="groupList">
      <el-table-column prop="id" align="center" label="ID"></el-table-column>
      <el-table-column prop="name" align="center" label="业务组名称">
      </el-table-column>
      <el-table-column prop="file_trees" align="center" label="项目权限">
        <template slot-scope="scope">
          <div v-if="scope.row.file_trees.length > 0" class="tags">
            <el-tooltip
              placement="top"
              effect="light"
              popper-class="group-tags-tooltip">
              <div slot="content">
                <el-tag
                  v-for="(item, index) in scope.row.file_trees"
                  :key="index"
                  size="mini">
                  {{ item }}
                </el-tag>
              </div>
              <div>
                <el-tag
                  v-for="(item, index) in scope.row.file_trees"
                  :key="index"
                  size="mini">
                  {{ item }}
                </el-tag>
              </div>
            </el-tooltip>
          </div>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column prop="molds" align="center" label="场景权限">
        <template slot-scope="scope">
          <div v-if="scope.row.molds.length > 0" class="tags">
            <el-tooltip
              placement="top"
              effect="light"
              popper-class="group-tags-tooltip">
              <div slot="content">
                <el-tag
                  v-for="(mold, index) in scope.row.molds"
                  :key="index"
                  size="mini">
                  {{ mold }}
                </el-tag>
              </div>
              <div>
                <el-tag
                  v-for="(mold, index) in scope.row.molds"
                  :key="index"
                  size="mini">
                  {{ mold }}
                </el-tag>
              </div>
            </el-tooltip>
          </div>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="editGroup(scope.row)">
              <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              circle
              size="small"
              type="text"
              @click="deleteGroup(scope.row)">
              <theme-icon
                name="delete"
                icon-class="el-icon-delete"></theme-icon>
            </el-button>
          </el-tooltip>
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
      v-if="dialogVisible"
      visible
      :close-on-click-modal="false"
      @close="closeDialog">
      <span slot="title"> {{ groupForm.id ? '编辑' : '新增' }}业务组 </span>
      <el-form
        ref="groupForm"
        :rules="formRules"
        :model="groupForm"
        label-width="100px">
        <el-form-item label="业务组名称" prop="name">
          <el-input
            v-model="groupForm.name"
            placeholder="请输入业务组名称"></el-input>
        </el-form-item>
        <el-form-item label="项目权限" prop="file_trees">
          <el-select
            v-model="groupForm.file_trees"
            multiple
            collapse-tags
            :popper-append-to-body="false"
            class="project-tree-select"
            placeholder="请选择项目权限">
            <el-input
              v-model="filterProjectTreeText"
              clearable
              size="mini"
              placeholder="搜索项目"
              @clear="allProjectTreeNodesChecked = false">
            </el-input>
            <el-checkbox
              v-model="allProjectTreeNodesChecked"
              label="全选"
              @change="checkAllProjectTreeNodes"></el-checkbox>
            <el-option value="">
              <vue-easy-tree
                ref="projectPermissionsTree"
                :data="catalogTreeData"
                :props="{ label: 'name' }"
                height="170px"
                node-key="id"
                show-checkbox
                check-strictly
                check-on-click-node
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="filterTreeNodes"
                @check-change="handleProjectPermissionChange">
                <span slot-scope="{ data }" class="custom-tree-node">
                  <span v-if="!filterProjectTreeText">{{ data.name }}</span>
                  <span v-else v-html="getFilterMatchedNodeText(data)"></span>
                </span>
              </vue-easy-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景权限" prop="molds">
          <el-select
            ref="sceneSelect"
            v-model="groupForm.mold_ids"
            multiple
            clearable
            filterable
            collapse-tags
            :reserve-keyword="true"
            :popper-append-to-body="false"
            placeholder="请选择场景权限">
            <p
              :class="['option-all', allScenesSelected ? 'active' : '']"
              @click.stop="selectAllScenes">
              全选
            </p>
            <el-option
              v-for="item in scenes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="comfirmButtonLoading"
          @click="createOrUpdateGroup">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  createBusinessGroup,
  updateBusinessGroup,
  deleteBusinessGroup,
  fetchBusinessGroups,
  fetchProjectsTree,
} from '../../../store/api/cmfchina.api';
import VueEasyTree from '@wchbrad/vue-easy-tree';

export default {
  name: 'business-group-management',
  components: { VueEasyTree },
  data() {
    return {
      groupList: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
      dialogVisible: false,
      catalogTreeData: [],
      scenes: [],
      groupForm: {
        id: null,
        name: '',
        file_trees: [],
        file_tree_ids: [],
        mold_ids: [],
      },
      formRules: {
        name: [
          {
            required: true,
            message: '请输入业务组名称',
            trigger: ['blur', 'change'],
          },
        ],
      },
      loading: false,
      comfirmButtonLoading: false,
      filterProjectTreeText: '',
      allProjectTreeNodesChecked: false,
    };
  },
  computed: {
    allScenesSelected() {
      if (this.groupForm.mold_ids.length === 0) {
        return false;
      }
      return this.getFilteredScenesOptions().every((id) => {
        return this.groupForm.mold_ids.includes(id);
      });
    },
  },
  watch: {
    filterProjectTreeText(val) {
      this.$refs.projectPermissionsTree.filter(val);
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getGroupList();
      this.getProjects();
      this.getScenes();
    },
    async getGroupList() {
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        const res = await fetchBusinessGroups(params);
        this.groupList = res.data.items;
        this.pager.total = res.data.total;
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
    async getProjects() {
      try {
        const res = await fetchProjectsTree();
        this.catalogTreeData = res.data.children;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getScenes() {
      try {
        const data = await this.$store.dispatch('schemaModule/fetchAllSchemas');
        this.scenes = data.items;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    checkAllProjectTreeNodes() {
      const tree = this.$refs.projectPermissionsTree;
      if (this.allProjectTreeNodesChecked) {
        const nodes = Object.values(tree.store.nodesMap).filter(
          (node) => node.visible === true,
        );
        const keys = nodes.map((node) => node.data.id);
        tree.setCheckedKeys(keys);
      } else {
        tree.setCheckedKeys([]);
      }
    },
    selectAllScenes() {
      this.groupForm.mold_ids = this.allScenesSelected
        ? _.without(this.groupForm.mold_ids, ...this.getFilteredScenesOptions())
        : _.uniq([
            ...this.groupForm.mold_ids,
            ...this.getFilteredScenesOptions(),
          ]);
    },
    getFilteredScenesOptions() {
      return (
        this.$refs.sceneSelect?._data.options
          .filter((option) => option.visible)
          .map((option) => option.value) || this.scenes.map((scene) => scene.id)
      );
    },
    filterTreeNodes(value, data, node) {
      if (!value) {
        return true;
      }

      if (this.allProjectTreeNodesChecked) {
        this.allProjectTreeNodesChecked = false;
      }

      return this.getTreeNodeMatched(node, value);
    },
    getTreeNodeMatched(node, value) {
      if (node.data.name.includes(value)) {
        return true;
      }

      if (node.level > 1 && node.parent) {
        return this.getTreeNodeMatched(node.parent, value);
      }

      return false;
    },
    getFilterMatchedNodeText(data) {
      return data.name?.replace(
        new RegExp(this.filterProjectTreeText, 'g'),
        `<span style='background:#ffff00'>${this.filterProjectTreeText}</span>`,
      );
    },
    getGroupFormData() {
      return {
        name: this.groupForm.name,
        file_tree_ids: this.groupForm.file_tree_ids,
        mold_ids: this.groupForm.mold_ids,
      };
    },
    createOrUpdateGroup() {
      if (!this.groupForm.id) {
        this.createGroup();
      } else {
        this.updateGroup();
      }
    },
    async createGroup() {
      const valid = await this.$refs.groupForm.validate().catch(() => {});
      if (!valid) {
        return;
      }

      try {
        this.comfirmButtonLoading = true;
        const data = this.getGroupFormData();
        await createBusinessGroup(data);
        this.$notify({
          title: '成功',
          message: '新增业务组成功',
          type: 'success',
        });
        this.closeDialog();
        this.pager.page = 1;
        this.getGroupList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.comfirmButtonLoading = false;
      }
    },
    async updateGroup() {
      const valid = await this.$refs.groupForm.validate().catch(() => {});
      if (!valid) {
        return;
      }

      try {
        this.comfirmButtonLoading = true;
        const data = this.getGroupFormData();
        await updateBusinessGroup(this.groupForm.id, data);
        this.$notify({
          title: '成功',
          message: '修改业务组成功',
          type: 'success',
        });
        this.closeDialog();
        this.getGroupList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.comfirmButtonLoading = false;
      }
    },
    editGroup(row) {
      this.dialogVisible = true;
      const currentGroup = _.cloneDeep(row);
      this.groupForm = {
        id: currentGroup.id,
        name: currentGroup.name,
        file_trees: currentGroup.file_trees,
        file_tree_ids: currentGroup.file_tree_ids,
        mold_ids: currentGroup.mold_ids,
      };
      this.$nextTick(() => {
        this.$refs.projectPermissionsTree.setCheckedKeys(
          currentGroup.file_tree_ids,
        );
      });
    },
    async deleteGroup(row) {
      const confirm = await this.$confirm(
        '确定要删除该业务组吗？',
        '提示',
      ).catch(() => {});
      if (confirm === 'confirm') {
        try {
          await deleteBusinessGroup(row.id);
          this.$notify({
            title: '成功',
            message: '删除业务组成功',
            type: 'success',
          });
          this.pager.page = 1;
          this.getGroupList();
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    handleChangePage(page) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = page;
      this.getGroupList();
    },
    handleChangeSize(size) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.pager.page = 1;
      this.pager.size = size;
      this.getGroupList();
    },
    handleProjectPermissionChange(data, checked) {
      if (data.children && data.children.length > 0) {
        if (checked) {
          const childrenKeys = this.getNodeChildrenKeys(data);
          childrenKeys.forEach((key) => {
            this.$refs.projectPermissionsTree.setChecked(key, true, false);
          });
        }
      }
      const checkedNodes = this.$refs.projectPermissionsTree.getCheckedNodes();
      this.groupForm.file_trees = checkedNodes.map((node) => node.name);
      this.groupForm.file_tree_ids = checkedNodes.map((node) => node.id);
    },
    getNodeChildrenKeys(node) {
      const keys = [];
      const visibleNodes = Object.values(
        this.$refs.projectPermissionsTree.store.nodesMap,
      ).filter((node) => node.visible === true);
      const ids = visibleNodes.map((node) => node.data.id);
      if (node.children) {
        node.children.forEach((child) => {
          if (ids.includes(child.id)) {
            keys.push(child.id);
            keys.push(...this.getNodeChildrenKeys(child));
          }
        });
      }
      return keys;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.groupForm = {
        id: null,
        name: '',
        file_trees: [],
        file_tree_ids: [],
        mold_ids: [],
      };
      this.filterProjectTreeText = '';
      this.allProjectTreeNodesChecked = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.business-group-management {
  .el-form {
    .el-form-item {
      .el-select {
        width: 100%;
        ::v-deep .el-tag {
          i {
            display: none;
          }
        }
        .el-select-dropdown__item {
          &.hover {
            background-color: #fff !important;
          }
          &:hover {
            background-color: #f5f7fa !important;
          }
        }
        &.project-tree-select {
          .el-input {
            width: calc(100% - 40px);
            margin: 0 20px;
            box-sizing: border-box;
            background-color: #fff;
          }
          .el-checkbox {
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            ::v-deep .el-checkbox__label {
              vertical-align: middle;
            }
          }
          ::v-deep .el-select-dropdown {
            .el-select-dropdown__wrap {
              height: 100%;
            }
            .el-select-dropdown__list {
              padding: 0;
              .el-select-dropdown__item {
                height: 100%;
                padding: 0 20px;
                background-color: #fff !important;
                &:hover {
                  background-color: #fff !important;
                }
              }
            }
          }
        }
        .option-all {
          padding: 0 20px;
          color: #606266;
          cursor: pointer;
          &.active {
            color: $--color-primary;
            font-weight: bold;
            &::after {
              position: absolute;
              top: 16px;
              right: 20px;
              font-family: 'element-icons';
              content: '\e6da';
              font-size: 12px;
              font-weight: bold;
            }
          }
          &:hover {
            background-color: #f5f7fa;
          }
        }
      }
    }
  }
  .el-table {
    .cell {
      .tags {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        .el-tag {
          margin: 0 5px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
$--tooltip-border-color: rgba($--color-primary, 0.4);

.group-tags-tooltip {
  &.el-tooltip__popper {
    max-width: 500px;
    &.is-light[x-placement^='top'] {
      border-color: $--tooltip-border-color;
      .popper__arrow {
        border-top-color: $--tooltip-border-color;
      }
    }
    .el-tag {
      margin: 5px;
    }
  }
}
</style>
