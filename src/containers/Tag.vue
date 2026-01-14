<template>
  <div class="tags">
    <div class="page-header">
      <el-button
        v-if="$isAllowed('manageProject')"
        size="medium"
        type="primary"
        icon="el-icon-circle-plus"
        @click="openTagPopup">
        {{ $t(`message['新增文件类型']`) }}
      </el-button>
    </div>
    <div>
      <el-table :data="tags" :empty-text="$t(`message['暂无数据']`)">
        <el-table-column width="120" prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" :label="$t(`message['名称']`)">
          <template slot-scope="scope">
            <i class="fa fa-tag fa-fw"></i> {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="tag_type"
          :label="$t(`message['关联的Schema']`)"
          align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(tag, index) in scope.row.molds"
              :key="index"
              size="small"
              >{{ getTagName(tag) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t(`message['操作']`)"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button
                v-if="$isAllowed('manageProject')"
                :title="$t(`message['编辑']`)"
                circle
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editTag(scope.row.id)">
              </el-button>
              <el-button
                v-if="$isAllowed('manageProject')"
                :title="$t(`message['删除']`)"
                circle
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteTag(scope.row.id)">
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-if="dialogVisible"
      visible
      :close-on-click-modal="false"
      @close="closeTagPopup">
      <span slot="title"><i class="fa fa-tag fa-fw"></i> {{ mode }}</span>
      <el-form
        ref="tagForm"
        :model="currentTag"
        :rules="rules"
        label-width="70px">
        <el-form-item :label="$t(`message['名称']`)" prop="name">
          <el-input v-model="currentTag.name"></el-input>
        </el-form-item>
        <el-form-item label="Schema" prop="molds">
          <el-select
            clearable
            :placeholder="$text.schema['请选择Schema']"
            v-model="currentTag.molds"
            :multiple="true">
            <el-option
              v-for="(mold, index) in molds"
              :key="index"
              :label="mold.label"
              :value="mold.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTagPopup">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button type="primary" @click="persistTag">
          {{ $t(`message['确定']`) }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'tag-page',
  data() {
    return {
      dialogVisible: false,
      currentTag: {
        id: -1,
        name: '',
        molds: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur',
          },
        ],
        molds: [
          {
            required: true,
            message: 'Schema不能为空',
            trigger: 'change',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('tagModule', ['tags']),
    ...mapGetters('schemaModule', ['schemas']),
    mode() {
      const mold = this.currentTag.id === -1 ? '新增文件类型' : '修改文件类型';
      return this.$t(`message['${mold}']`);
    },
    molds() {
      return this.schemas.items.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    },
  },
  created() {
    this.fetchTags();
    this.fetchMoldList();
  },
  methods: {
    async fetchMoldList() {
      try {
        await this.$store.dispatch('schemaModule/fetchSchemas');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    fetchTags() {
      try {
        this.$store.dispatch('tagModule/fetchTags');
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    openTagPopup() {
      this.dialogVisible = true;
    },
    closeTagPopup() {
      this.dialogVisible = false;
      this.currentTag = {
        id: -1,
        name: '',
        molds: [],
      };
    },
    async persistTag() {
      const valid = await this.$refs.tagForm.validate();
      if (!valid) {
        return;
      }
      try {
        await this.$store.dispatch('tagModule/persistTag', {
          tagData: this.currentTag,
        });
        let tip = this.$t(`message['文件类型修改成功']`);
        if (this.currentTag.id === -1) {
          tip = this.$t(`message['文件类型新建成功']`);
        }
        this.closeTagPopup();
        this.$notify({
          title: this.$t(`message['成功']`),
          message: tip,
          type: 'success',
        });
      } catch (e) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    editTag(id) {
      this.dialogVisible = true;
      this.currentTag = _.cloneDeep(this.tags.find((tag) => tag.id === id));
    },
    async deleteTag(id) {
      try {
        await this.$confirm(
          this.$t(`message['是否删除该文件类型?']`),
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['确定']`),
            cancelButtonText: this.$t(`message['取消']`),
            type: 'warning',
          },
        );
        await this.$store.dispatch('tagModule/deleteTag', { id });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: this.$t(`message['文件类型删除成功']`),
          type: 'success',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }
        this.$notify({
          title: this.$t(`message['错误']`),
          message: e.message,
          type: 'error',
        });
      }
    },
    getTagName(id) {
      const mold = this.molds.find((tag) => tag.value === id);
      if (mold) {
        return mold.label;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.tags {
  padding: 0 20px;
  height: calc(100% - 61px);
  overflow-y: auto;
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-tag {
    margin: 0 5px;
  }
}
</style>
