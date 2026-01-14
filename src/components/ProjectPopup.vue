<template>
  <div>
    <el-dialog visible :before-close="close" :close-on-click-modal="false">
      <span slot="title">{{ dialogTitle }}</span>
      <el-form
        v-if="current"
        ref="form"
        :model="project"
        :rules="rules"
        :label-width="$style.project.popupLabelWidth">
        <el-form-item :label="$text.project['名称']" prop="name">
          <el-input v-model="project.name" ref="nameInput"></el-input>
        </el-form-item>
        <el-form-item
          v-if="$features.supportBusinessGroup()"
          prop="group_ids"
          label="业务组">
          <el-select
            v-model="project.group_ids"
            clearable
            filterable
            multiple
            placeholder="请选择业务组"
            v-loading="isFetchingGroups"
            element-loading-spinner="el-icon-loading"
            @change="selectGroups">
            <el-option
              v-for="(label, index) in groups"
              :key="index"
              :label="label.name"
              :value="label.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="mold-select-wrapper"
          :label="$text.project['Schema']">
          <el-select
            clearable
            filterable
            :placeholder="$text.project['请选择Schema']"
            :no-match-text="$text.project['未找到匹配的Schema']"
            v-model="selectedMold"
            :disabled="isDisabledSchema"
            :multiple="$features.supportMultipleMolds()"
            popper-class="mold-select-dropdown"
            @clear="clearSelectedMold">
            <el-option
              v-for="(item, index) in molds"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="$features.supportProjectPermission()"
          :label="$text.project['项目权限']">
          <el-radio-group v-model="projectPermission">
            <el-radio :label="0" :disabled="projectPermissionDisabled">
              {{ projectType.private }}
            </el-radio>
            <el-radio :label="1">{{ projectType.public }}</el-radio>
          </el-radio-group>
          <span class="folder-perm-tips">
            {{ $text.project['（提示：设为公共后，将不支持更改为私密项目）'] }}
          </span>
        </el-form-item>
        <el-form-item
          v-if="$features.supportProjectComment()"
          :label="$t(`message['备注']`)">
          <el-input
            v-model="project.comment"
            type="textarea"
            resize="none"
            autosize />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="close">
          {{ $t(`message['取消']`) }}
        </el-button>
        <el-button type="primary" @click="persistProject">
          {{ $t(`message['确定']`) }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { cloneDeep, isNil } from 'lodash/fp';
import { projectType, scriberPublicPoc } from '@/store/constants';
import {
  fetchUserBusinessGroups,
  fetchProjectBusinessGroups,
} from '../store/api/cmfchina.api';

export default {
  name: 'project-popup',
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      project: {},
      rules: {
        name: [{ required: true, validator: this.validateName }],
        group_ids: [
          { required: true, message: '请选择业务组', trigger: 'change' },
        ],
      },
      projectPermission: 1, // 0:私密 1:公共
      projectPermissionTemp: 1, // 临时变量，控制私密可勾选状态
      selectedMold: null,
      projectType,
      isFetchingGroups: false,
      groups: [],
      molds: [],
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('projectModule', ['projects']),
    ...mapGetters('schemaModule', ['schemas']),
    appid() {
      return this.configuration.app_id;
    },
    isEdit() {
      return this.current.id !== -1;
    },
    dialogTitle() {
      return this.isEdit
        ? this.$text.project['编辑项目']
        : this.$text.project['新建项目'];
    },
    projectPermissionDisabled() {
      return this.current.id !== -1 && this.projectPermissionTemp !== 0;
    },
    isDisabledSchema() {
      if (this.$platform.isCcxiContractEnv()) {
        return true;
      }
      if (this.$platform.isCmfchinaEnv()) {
        return this.project?.group_ids?.length === 0;
      }
      return false;
    },
  },
  watch: {
    'schemas.items'(newVal) {
      this.molds = _.cloneDeep(newVal);
      if (this.$features.supportBusinessGroup()) {
        this.selectGroups(this.project.group_ids);
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.project = cloneDeep(this.current);
      this.molds = _.cloneDeep(this.schemas.items);
      if (this.$features.supportBusinessGroup()) {
        this.isFetchingGroups = true;
        await this.getUserGroups();
        if (this.current.id !== -1) {
          const projectData = await this.getProjectBusinessGroups();
          this.selectGroups(this.project.group_ids);
          this.selectedMold = projectData.default_molds;
        }
        this.isFetchingGroups = false;
      } else {
        if (!isNil(this.current.defaultMolds)) {
          this.selectedMold = this.$features.supportMultipleMolds()
            ? this.current.defaultMolds
            : this.current.defaultMolds[0];
        } else {
          this.selectedMold = this.$features.supportMultipleMolds() ? [] : null;
        }
      }
      await this.$nextTick();
      this.$refs.nameInput.focus();
      if (
        !this.current.isPublic ||
        (this.appid === scriberPublicPoc && !this.isEdit)
      ) {
        this.projectPermission = 0;
        this.projectPermissionTemp = 0;
      }
    },
    close() {
      this.$emit('close');
    },
    async persistProject() {
      try {
        await this.$refs.form.validate();
      } catch (e) {
        return;
      }
      this.project.name = this.project.name.trim();
      this.$emit('persist-project', {
        projectData: this.project,
        isPublic: this.projectPermission,
        defaultMolds: Array.isArray(this.selectedMold)
          ? this.selectedMold
          : [this.selectedMold].filter((mold) => !_.isNil(mold)),
      });
    },
    validateName(rule, value, cb) {
      const name = this.project.name.trim();
      if (!name) {
        cb(new Error(this.$text.project['项目名称不能为空']));
        return;
      }
      cb();
    },
    clearSelectedMold() {
      this.selectedMold = null;
    },
    async getUserGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
        if (this.current.id === -1 && this.groups.length === 1) {
          this.project.group_ids = [this.groups[0].id];
          this.selectGroups(this.project.group_ids);
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getProjectBusinessGroups() {
      try {
        const res = await fetchProjectBusinessGroups(this.project.id);
        this.project.group_ids = res.data.groups.map((item) => item.id);
        return res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    selectGroups(groups) {
      const selectedGroups = this.groups.filter((group) =>
        groups.includes(group.id),
      );
      const availableSchemas = selectedGroups
        .map((group) => group.mold_ids)
        .flat(1);

      const visibleMolds = [];
      this.schemas.items.forEach((item) => {
        if (availableSchemas.includes(item.id)) {
          visibleMolds.push(item);
        }
      });
      this.molds = visibleMolds;
      this.selectedMold = this.selectedMold.filter((item) =>
        visibleMolds.map((mold) => mold.id).includes(item),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
  ::v-deep .el-loading-mask {
    background-color: transparent;
  }
}
.folder-perm-tips {
  margin-left: 5px;
  color: #f56c6c;
}
</style>

<style lang="scss">
.mold-select-dropdown {
  max-width: 600px;
}
</style>
