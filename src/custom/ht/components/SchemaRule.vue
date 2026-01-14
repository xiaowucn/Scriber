<template>
  <div class="schema-rule-container">
    <div class="schame-rule-header">
      <el-button
        v-if="$features.canEditSchemaRule()"
        type="primary"
        size="small"
        @click="openCategoryDialog()">
        新增大类
      </el-button>
    </div>
    <el-table
      :data="categories"
      row-key="id"
      :expand-row-keys="categoryExpandKey">
      <el-table-column type="expand">
        <template slot-scope="categoryScope">
          <div v-if="categoryScope.row.method_type === ruleMethodType.template">
            <div class="child-rule-header">
              <el-button
                type="primary"
                size="small"
                @click="
                  openRuleDialog({
                    categoryId: categoryScope.row.id,
                    method_type: ruleMethodType.template,
                  })
                "
                >新增规则</el-button
              >
            </div>
            <el-table :data="categoryScope.row.rules">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="column" label="字段">
                <template slot-scope="ruleScope">
                  {{ ruleScope.row.column | fieldFormatter }}
                </template>
              </el-table-column>
              <el-table-column
                class-name="column-template"
                prop="patterns"
                label="模版内容"></el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="ruleScope">
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      openRuleDialog({
                        rule: ruleScope.row,
                        method_type: ruleMethodType.template,
                      })
                    "
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteRule(ruleScope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              small
              layout="total, prev, pager, next"
              :current-page="categoryScope.row.pager.page"
              :page-size="categoryScope.row.pager.size"
              :total="categoryScope.row.pager.total"
              @current-change="
                (page) => handleChangePage(categoryScope.row.id, page)
              ">
            </el-pagination>
          </div>
          <div v-if="categoryScope.row.method_type === ruleMethodType.formula">
            <div class="child-rule-header">
              <el-button
                type="primary"
                size="small"
                @click="
                  openRuleDialog({
                    categoryId: categoryScope.row.id,
                    method_type: ruleMethodType.formula,
                  })
                "
                >新增公式</el-button
              >
            </div>

            <el-table :data="categoryScope.row.rules">
              <el-table-column
                prop="name"
                label="名称"
                width="380"></el-table-column>
              <el-table-column prop="formula" label="公式"></el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="ruleScope">
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      openRuleDialog({
                        rule: ruleScope.row,
                        method_type: ruleMethodType.formula,
                      })
                    "
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteRule(ruleScope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              small
              layout="total, prev, pager, next"
              :current-page="categoryScope.row.pager.page"
              :page-size="categoryScope.row.pager.size"
              :total="categoryScope.row.pager.total"
              @current-change="
                (page) => handleChangePage(categoryScope.row.id, page)
              ">
            </el-pagination>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="规则大类名称"></el-table-column>
      <el-table-column label="规则类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.method_type === ruleMethodType.template
              ? '固定条款对比'
              : scope.row.method_type === ruleMethodType.formula
                ? '公式校验'
                : ''
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="子规则数量">
        <template slot-scope="scope">
          <span>{{ scope.row.pager.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="expandCategory(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$features.canEditSchemaRule()"
            type="text"
            size="small"
            @click="openCategoryDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="$features.canEditSchemaRule()"
            type="text"
            size="small"
            @click="deleteCategory(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="categoryEdited ? '编辑大类' : '新增大类'"
      :visible="categoryDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="closeCategoryDialog">
      <el-form
        ref="categoryForm"
        :model="categoryModel"
        label-width="70px"
        size="small">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称' }]">
          <el-input v-model="categoryModel.name"></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="method_type"
          :rules="[{ required: true, message: '请选择类型' }]">
          <el-radio-group
            v-model="categoryModel.method_type"
            :disabled="categoryEdited !== null">
            <el-radio :label="ruleMethodType.template">固定条款对比</el-radio>
            <el-radio :label="ruleMethodType.formula">公式校验</el-radio>
          </el-radio-group>
          <span class="category-type-alert">选择后不允许更改</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="categoryDialogSubmit"
            >确定</el-button
          >
          <el-button @click="closeCategoryDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="ruleEdited ? '编辑固定条款对比规则' : '新增固定条款对比规则'"
      :visible="templateRuleDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="() => closeRuleDialog(ruleMethodType.template)">
      <el-form
        ref="ruleForm"
        :model="templateRuleModel"
        label-width="80px"
        size="small">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称' }]">
          <el-input
            v-model="templateRuleModel.name"
            :style="{ width: '350px' }"></el-input>
        </el-form-item>
        <el-form-item
          label="字段"
          prop="column"
          :rules="[{ required: true, message: '请选择字段' }]">
          <el-cascader
            expand-trigger="hover"
            v-model="templateRuleModel.column"
            :options="cascaderTree"></el-cascader>
        </el-form-item>
        <el-form-item
          prop="patterns"
          label="模版内容"
          :rules="[{ required: true, message: '请填写模版内容' }]">
          <el-input
            type="textarea"
            :rows="4"
            v-model="templateRuleModel.patterns[0]"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="ruleDialogSubmit(ruleMethodType.template)"
            >确定</el-button
          >
          <el-button @click="closeRuleDialog(ruleMethodType.template)"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="ruleEdited ? ' 编辑公式校验规则' : ' 新增公式校验规则'"
      :visible="formulaRuleDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :before-close="() => closeRuleDialog(ruleMethodType.formula)">
      <el-form
        ref="ruleForm"
        :model="formulaRuleModel"
        label-width="70px"
        size="small">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称' }]">
          <el-input
            v-model="formulaRuleModel.name"
            @focus="toggleFormulaEditorDisabled(true)"
            @blur="toggleFormulaEditorDisabled(false)"
            :style="{ width: '350px' }"></el-input>
        </el-form-item>
        <el-form-item label="规则校验">
          <schema-formula-rule-editor
            v-if="formulaRuleDialogVisible"
            ref="formulaRuleEditor"
            :columns="columns"
            :formulaExisted="formulaRuleModel.formula"
            :disabled="formulaEditorDisabled"
            @updateFormulaPatterns="updateFormulaPatterns"
            @updateFormulaValidate="
              updateFormulaValidate
            "></schema-formula-rule-editor>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!formulaRuleValidate"
            @click="ruleDialogSubmit(ruleMethodType.formula)"
            >确定</el-button
          >
          <el-button @click="closeRuleDialog(ruleMethodType.formula)"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { omit } from 'lodash';
import SchemaFormulaRuleEditor from './SchemaFormulaRuleEditor';
import { schema as schemaApi } from '@/store/api';

export default {
  name: 'schema-rule',
  components: {
    SchemaFormulaRuleEditor,
  },
  props: {
    tree: {
      type: Object,
      required: true,
    },
    schemaId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      categories: [],
      categoryExpandKey: [],
      categoryActived: null,
      categoryDialogVisible: false,
      categoryModel: {
        name: '',
        method_type: 1,
      },
      categoryEdited: null,
      ruleMethodType: {
        template: 1,
        formula: 2,
      },
      templateRuleDialogVisible: false,
      templateRuleModel: {
        name: '',
        column: [],
        patterns: [],
      },
      formulaRuleDialogVisible: false,
      formulaRuleModel: {
        name: '',
        formula: '',
      },
      formulaRuleValidate: false,
      formulaEditorDisabled: false,
      ruleEdited: null,
    };
  },
  filters: {
    fieldFormatter(column) {
      if (Array.isArray(column)) {
        return column.join(' / ');
      }
      return column;
    },
  },
  computed: {
    columns() {
      if (this.tree && this.tree.data.children) {
        return this.tree.data.children.map((item) => item.data.label);
      }

      return [];
    },
    cascaderTree() {
      const formatColumnsToTree = (nodes) => {
        nodes.forEach((node) => {
          node.value = node.data.label;
          node.label = node.data.label;
          if (node.children.length > 0) {
            return formatColumnsToTree(node.children);
          } else {
            delete node.children;
          }
        });

        return nodes;
      };

      if (this.tree && this.tree.data.children) {
        return formatColumnsToTree(this.tree.data.children);
      }

      return [];
    },
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const { data: categoryData } = await schemaApi.fetchRuleCategories(
          this.schemaId,
        );

        const params = {
          page: 1,
        };

        this.categories = await Promise.all(
          categoryData.map(async (item) => {
            const { data: categoryRules } = await schemaApi.fetchRuleItems(
              item.id,
              params,
            );

            return {
              ...item,
              rules: categoryRules.items.map((item) => ({
                ...omit(item, 'data'),
                ...item.data,
              })),
              pager: {
                page: categoryRules.page,
                size: categoryRules.size,
                total: categoryRules.total,
              },
            };
          }),
        );
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchRuleItems(id, params) {
      const res = await schemaApi.fetchRuleItems(id, params);
      const index = this.categories.findIndex((i) => i.id === id);
      if (index !== -1) {
        this.categories[index].rules = res.data.items.map((item) => ({
          ...omit(item, 'data'),
          ...item.data,
        }));
        this.categories[index].pager.total = res.data.total;
      }
    },
    handleChangePage(id, page) {
      this.fetchRuleItems(id, { page });
    },
    expandCategory(id) {
      const isExpand = this.categoryExpandKey.findIndex((item) => item === id);
      if (isExpand > -1) {
        this.categoryExpandKey.splice(isExpand, 1);
      } else {
        this.categoryExpandKey.push(id);
      }
    },
    openCategoryDialog(category) {
      if (category) {
        this.categoryModel.name = category.name;
        this.categoryModel.method_type = category.method_type;
        this.categoryEdited = category.id;
      }
      this.categoryDialogVisible = true;
    },
    closeCategoryDialog() {
      this.categoryDialogVisible = false;
      this.categoryModel = {
        name: '',
        method_type: this.ruleMethodType.template,
      };
      this.categoryEdited = null;
    },
    async categoryDialogSubmit() {
      try {
        const validate = await this.$refs.categoryForm.validate();
        if (validate) {
          if (this.categoryEdited) {
            await this.updateCategory();
          } else {
            await this.createCategory();
          }

          this.closeCategoryDialog();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async createCategory() {
      try {
        const { data } = await schemaApi.createRuleCategory(this.schemaId, {
          ...this.categoryModel,
        });
        const newCategory = {
          ...data,
          rules: [],
        };
        this.categories = this.categories.concat(newCategory);

        this.$notify({
          title: '成功',
          message: '新增大类成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async updateCategory() {
      try {
        await schemaApi.updateRuleCategory(this.categoryEdited, {
          ...this.categoryModel,
        });

        this.categories = this.categories.map((item) => {
          if (item.id === this.categoryEdited) {
            return { ...item, ...this.categoryModel };
          } else {
            return item;
          }
        });

        this.$notify({
          title: '成功',
          message: '编辑大类成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteCategory(category) {
      await this.$confirm(`确认删除规则大类 ${category.name}？`);
      try {
        await schemaApi.deleteRuleCategory(category.id);
        this.categories = this.categories.filter(
          (item) => item.id !== category.id,
        );

        this.$notify({
          title: '成功',
          message: '删除大类成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    openRuleDialog({ categoryId, method_type, rule }) {
      if (rule) {
        if (method_type === this.ruleMethodType.template) {
          this.templateRuleModel.name = rule.name;
          this.templateRuleModel.column = Array.isArray(rule.column)
            ? rule.column
            : [rule.column];
          this.templateRuleModel.patterns = rule.patterns;
        } else if (method_type === this.ruleMethodType.formula) {
          this.formulaRuleModel.name = rule.name;
          this.formulaRuleModel.formula = rule.formula;
        }

        this.ruleEdited = rule.id;
        this.categoryActived = rule.class_name;
      } else {
        this.categoryActived = categoryId;
      }

      if (method_type === this.ruleMethodType.template) {
        this.templateRuleDialogVisible = true;
      } else if (method_type === this.ruleMethodType.formula) {
        this.formulaRuleDialogVisible = true;
      }
    },
    closeRuleDialog(method_type) {
      this.$refs.ruleForm.resetFields();
      if (method_type === this.ruleMethodType.template) {
        this.templateRuleModel = {
          name: '',
          column: [],
          patterns: [],
        };

        this.templateRuleDialogVisible = false;
      } else if (method_type === this.ruleMethodType.formula) {
        this.formulaRuleModel = {
          name: '',
          formula: '',
        };

        this.formulaRuleDialogVisible = false;
      }

      this.ruleEdited = null;
      this.categoryActived = null;
    },
    async ruleDialogSubmit(method_type) {
      try {
        const validate = await this.$refs.ruleForm.validate();
        if (validate) {
          if (this.ruleEdited) {
            await this.updateRule(method_type);
          } else {
            await this.createRule(method_type);
          }

          this.closeRuleDialog(method_type);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async createRule(method_type) {
      try {
        const model =
          method_type === this.ruleMethodType.template
            ? this.templateRuleModel
            : method_type === this.ruleMethodType.formula
              ? this.formulaRuleModel
              : null;

        if (model) {
          const { data } = await schemaApi.createRuleItem(
            this.categoryActived,
            {
              name: model.name,
              data: omit(model, 'name'),
            },
          );

          this.categories = this.categories.map((item) => {
            if (item.id === this.categoryActived) {
              item.rules = item.rules.concat({ ...data, ...model });
              item.pager.total++;
            }

            return item;
          });

          this.$notify({
            title: '成功',
            message: '新增规则成功',
            type: 'success',
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async updateRule(method_type) {
      try {
        const model =
          method_type === this.ruleMethodType.template
            ? this.templateRuleModel
            : method_type === this.ruleMethodType.formula
              ? this.formulaRuleModel
              : null;

        if (model) {
          await schemaApi.updateRuleItem(this.ruleEdited, {
            name: model.name,
            data: omit(model, 'name'),
          });

          this.categories = this.categories.map((item) => {
            if (item.id === this.categoryActived) {
              item.rules = item.rules.map((ruleItem) => {
                if (ruleItem.id === this.ruleEdited) {
                  return { ...ruleItem, ...model };
                } else {
                  return ruleItem;
                }
              });
            }

            return item;
          });

          this.$notify({
            title: '成功',
            message: '编辑规则成功',
            type: 'success',
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async deleteRule(rule) {
      await this.$confirm(`确认删除规则 ${rule.name}？`);

      try {
        await schemaApi.deleteRuleItem(rule.id);
        this.categories = this.categories.map((item) => {
          if (item.id === rule.class_name) {
            const ruleIndex = item.rules.findIndex(
              (ruleItem) => ruleItem.id === rule.id,
            );
            if (ruleIndex > -1) {
              item.rules.splice(ruleIndex, 1);
            }
            item.pager.total--;
          }

          return item;
        });

        this.$notify({
          title: '成功',
          message: '删除规则成功',
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    updateFormulaPatterns(formula) {
      this.formulaRuleModel.formula = formula;
    },
    updateFormulaValidate(validate) {
      this.formulaRuleValidate = validate;
    },
    toggleFormulaEditorDisabled(disabled) {
      this.formulaEditorDisabled = disabled;
    },
  },
};
</script>
<style lang="scss" scoped>
.schema-rule-container {
  width: 100%;
  ::v-deep .el-table {
    td.column-template {
      .cell {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }
    }
  }
  .el-pagination {
    margin: 15px 0 5px;
    text-align: center;
  }
}

.schame-rule-header,
.child-rule-header {
  margin-bottom: 10px;
  text-align: right;
}

.category-type-alert {
  display: inline-block;
  margin-left: 20px;
  font-size: 14px;
  color: red;
}

::v-deep .el-input--small {
  width: 350px;
}
</style>
