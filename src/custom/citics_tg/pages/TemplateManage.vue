<template>
  <div class="citics-tg-page template-manage">
    <el-button
      v-if="isCiticsTgAllow('template_add')"
      class="list-header"
      size="medium"
      type="primary"
      @click="templateDialogVisible = true">
      <i class="fa fa-plus fa-fw"></i>
      {{ $t(`message['新增模板']`) }}
    </el-button>
    <el-table
      class="has-border"
      :empty-text="$t(`message['暂无数据']`)"
      :data="templateItems"
      v-loading="isLoading">
      <el-table-column
        prop="id"
        label="ID"
        width="100"
        align="center"></el-table-column>
      <el-table-column
        prop="name"
        :label="$t(`message['模板名称']`)"
        align="center">
        <template slot-scope="scope">
          <p>
            {{ scope.row.name }}
            <el-tag v-if="scope.row.is_default" size="small">
              {{ $t(`message['默认模板']`) }}
            </el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="business_group"
        :label="$t(`message['业务组']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="mold"
        :label="$t(`message['文档分类']`)"
        align="center"></el-table-column>
      <el-table-column
        class-name="tags-column"
        prop="fields"
        :label="$t(`message['所选参数']`)"
        align="center"
        width="300">
        <template slot-scope="scope">
          <el-tooltip placement="top" popper-class="all-tags-tooltip">
            <div slot="content">
              <el-tag :key="tag" v-for="tag in scope.row.fields">
                {{ getSelectParams(tag) }}
              </el-tag>
            </div>
            <p>
              <el-tag :key="tag" v-for="tag in scope.row.fields">
                {{ getSelectParams(tag) }}
              </el-tag>
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="uname"
        :label="$t(`message['创建人']`)"
        align="center"></el-table-column>
      <el-table-column
        prop="created_utc"
        :label="$t(`message['创建时间']`)"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.created_utc | datetime }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t(`message['操作']`)"
        width="150"
        class-name="operations"
        align="center">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip
              effect="dark"
              :content="$t(`message['编辑']`)"
              placement="top">
              <el-button
                v-if="isCiticsTgAllow('template_edit')"
                circle
                size="small"
                type="text"
                @click="handleEditTemplate(scope.row)">
                <theme-icon name="edit" icon-class="el-icon-edit"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="$t(`message['删除']`)"
              placement="top">
              <el-button
                v-if="isCiticsTgAllow('template_del')"
                circle
                size="small"
                type="text"
                @click="handleDeleteTemplate(scope.row)">
                <theme-icon
                  name="delete"
                  icon-class="el-icon-delete"></theme-icon>
              </el-button>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50, 100]"
      :total="pager.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange">
    </el-pagination>
    <template-dialog
      v-if="templateDialogVisible"
      :current-edit-item="currentEditItem"
      @close="handleCloseDialog"
      @fetchList="getTemplateList"></template-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import TemplateDialog from '../components/TemplateDialog.vue';
import { fetchTemplateList, deleteTemplate } from '@/store/api/citics-tg.api';
import { isCiticsTgAllow } from '../common/utils';
export default {
  name: 'citics-tg-template',
  components: { TemplateDialog },
  data() {
    return {
      isLoading: false,
      templateItems: [],
      templateDialogVisible: false,
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      currentEditItem: null,
    };
  },
  computed: {},
  mounted() {
    this.getTemplateList();
  },
  methods: {
    isCiticsTgAllow,
    getSelectParams(tag) {
      return tag.split('-')[tag.split('-').length - 1];
    },
    async getTemplateList() {
      try {
        this.isLoading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        const res = await fetchTemplateList(params);
        this.templateItems = res.data.items;
        this.pager.total = res.data.total;
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
    handleEditTemplate(row) {
      this.currentEditItem = _.cloneDeep(row);
      this.templateDialogVisible = true;
    },
    handleDeleteTemplate(row) {
      this.$confirm('确认删除模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteTemplate(row.id);
        })
        .catch(() => {});
    },
    async deleteTemplate(id) {
      try {
        await deleteTemplate(id);
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
        });
        if (this.templateItems.length === 1 && this.pager.page !== 1) {
          this.pager.page -= 1;
        }
        this.getTemplateList();
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleCloseDialog() {
      this.templateDialogVisible = false;
      this.currentEditItem = null;
    },

    handleCurrentPageChange(val) {
      this.pager.page = val;
      this.getTemplateList();
    },

    handleSizeChange(val) {
      this.pager.size = val;
      this.pager.page = 1;
      this.getTemplateList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
