<template>
  <el-dialog
    :before-close="close"
    width="50%"
    :visible="true"
    :close-on-click-modal="false">
    <h4 slot="title">
      <i v-if="!current.isDir" :class="`fa ${fileIconClass} fa-fw`"></i>
      <i v-else class="far fa-folder fa-2x fa-fw"></i>
      {{ fileType }}
    </h4>
    <el-form
      ref="file-form"
      v-if="current !== null"
      :model="current"
      :rules="filePopupRules"
      :label-width="$style.file.popupLabelWidth"
      @submit.native.prevent>
      <el-form-item
        v-if="isShowNameInFilePopup"
        :label="$t(`message['名称']`)"
        prop="name">
        <el-input
          ref="nameInput"
          :value="currentNameWithoutSuffix"
          @input="changeFileName"
          @keyup.enter.native="modify"></el-input>
      </el-form-item>
      <el-form-item
        v-if="showFileTag && !current.isDir"
        class="mold-select-wrapper"
        label="文件类型"
        prop="tag">
        <el-select
          v-model="selectedTag"
          placeholder="请选择文件类型"
          @change="selectTagChanged">
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="showGroup"
        class="group-select-wrapper"
        prop="group_ids"
        label="业务组">
        <el-select
          v-model="current.group_ids"
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
        :label="$text.file['Schema']"
        prop="schema">
        <el-select
          clearable
          filterable
          popper-class="file-popup-mold-select"
          :placeholder="$text.file['请选择Schema']"
          :no-match-text="$text.file['未找到匹配的Schema']"
          v-model="selectedMold"
          :multiple="$features.supportMultipleMolds()"
          :disabled="selectedMoldDisabled"
          @clear="clearSelectedMold">
          <el-option
            v-for="(label, index) in allMolds"
            :key="index"
            :disabled="label.disabled"
            :label="getSelectOptionLabel(label)"
            :value="label.id">
            <span>{{ label.name }}</span>
            <el-tag v-if="label.marked" type="success" size="mini">
              已标注
            </el-tag>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t(`message['取消']`) }}</el-button>
      <el-button @click="modify" type="primary" :loading="loading">{{
        $t(`message['确定']`)
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { AI_PREDICT_STATUS_MAP } from '../store/constants';
import { convertFileTypeToIcon, getFileTypeByName } from '../utils';
import {
  fetchUserBusinessGroups,
  fetchCatalogBusinessGroups,
} from '../store/api/cmfchina.api';

export default {
  name: 'file-popup',
  props: {
    file: {
      type: Object,
      required: true,
    },
    molds: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      current: null,
      originFileName: '',
      rules: {
        name: [{ required: true, validator: this.validateName }],
        schema: [{ required: true, validator: this.validateSchema }],
        group_ids: [
          { required: true, message: '请选择业务组', trigger: 'change' },
        ],
      },
      loading: false,
      selectedMold: null,
      allMolds: [],
      selectedTag: '',
      groups: [],
      isFetchingGroups: false,
    };
  },
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('tagModule', ['tags']),
    fileType() {
      return this.file.isDir
        ? this.$t(`message['文件夹']`)
        : this.$t(`message['文件']`);
    },
    nameValidateMessage() {
      return this.file.isDir
        ? this.$t(`message['文件夹名称不能为空']`)
        : this.$t(`message['文件名不能为空']`);
    },
    fileIconClass() {
      return convertFileTypeToIcon(getFileTypeByName(this.file.name));
    },
    selectedMoldDisabled() {
      if (this.$platform.isCmfchinaEnv()) {
        return this.current?.group_ids?.length === 0 && this.file.isDir;
      }
      if (this.$platform.isCcxiContractEnv()) {
        return this.file.isDir;
      }
      return this.file.questions?.some((question) => {
        return question.ai_status === AI_PREDICT_STATUS_MAP.DOING;
      });
    },
    showFileTag() {
      return this.$features.showFileTag();
    },
    showGroup() {
      return this.$features.supportBusinessGroup() && this.file.isDir;
    },
    currentNameWithoutSuffix() {
      if (this.current) {
        return this.current.name.replace(/\.\w+$/i, '');
      }
      return '';
    },
    fileSuffix() {
      if (this.file) {
        const type = /(\.\w+)$/.exec(this.file.name);
        if (type) {
          return type[1];
        }
      }

      return '';
    },
    isShowNameInFilePopup() {
      if (this.$platform.isNafmiiEnv() && !this.file.isDir) {
        return false;
      }
      return true;
    },
    isSchemaRequired() {
      return this.$platform.isNafmiiEnv();
    },
    filePopupRules() {
      const newRules = { ...this.rules };
      if (!this.isShowNameInFilePopup) {
        delete newRules.name;
      }
      if (!this.isSchemaRequired) {
        delete newRules.schema;
      }
      return newRules;
    },
  },
  watch: {
    'current.group_ids'(newVal) {
      if (this.$features.supportBusinessGroup() && this.current.isDir) {
        this.selectGroups(newVal);
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.current = _.cloneDeep(this.file);
      this.allMolds = this.setSchemaMarked(
        _.cloneDeep(this.molds),
        this.current,
      );
      this.originFileName = this.file.name;
      const { default_molds, molds } = this.current;

      if (this.$features.supportBusinessGroup()) {
        if (this.current.isDir) {
          await this.initBusinessGroups();
        } else {
          await this.getUserGroups();
          this.selectGroups(this.groups.map((group) => group.id));
          this.selectedMold = this.current.questions.map((q) => q.mold);
        }
      } else {
        if (this.$features.supportMultipleMolds()) {
          this.selectedMold = default_molds || molds;
        } else {
          this.selectedMold =
            (default_molds && default_molds[0]) || (molds && molds[0]);
        }
        if (this.showFileTag) {
          this.selectedTag = this.current.tags[0];
          this.selectTagChanged(this.selectedTag);
        }
      }
      await this.$nextTick();
      if (this.isShowNameInFilePopup) {
        this.$refs.nameInput.focus();
      }
    },
    close() {
      this.closeFilePopup();
    },
    validateName(rule, value, cb) {
      const name = this.currentNameWithoutSuffix.trim();
      if (!name) {
        cb(new Error(this.nameValidateMessage));
        return;
      }
      cb();
    },
    validateSchema(rule, value, cb) {
      if (!this.selectedMold || this.selectedMold.length === 0) {
        cb(new Error(this.$text.file['Schema不能为空']));
        return;
      }
      cb();
    },
    async modify() {
      const isValid = await this.$refs['file-form'].validate().catch(() => {});
      if (isValid) {
        let fileData = {
          file: this.current,
          oldFileName: this.originFileName,
        };
        fileData.molds = Array.isArray(this.selectedMold)
          ? this.selectedMold
          : [this.selectedMold].filter((mold) => !_.isNil(mold));
        if (this.showFileTag) {
          fileData.tags = [this.selectedTag];
        }
        if (this.$features.supportBusinessGroup()) {
          fileData.group_ids = this.current.group_ids;
        }
        this.modifyFile(fileData);
      }
    },
    clearSelectedMold() {
      this.selectedMold = null;
    },
    getSelectOptionLabel(option) {
      if (!option.marked) {
        return option.name;
      }
      return `${option.name} (已标注)`;
    },
    setSchemaMarked(molds, file) {
      if (file.isDir) {
        return molds;
      }
      for (let i = 0; i < molds.length; i++) {
        for (let j = 0; j < file.questions.length; j++) {
          if (molds[i].id === file.questions[j].mold) {
            if (file.questions[j].progress !== null) {
              molds[i].marked = true;
            }
          }
        }
      }
      return molds;
    },
    selectTagChanged(id) {
      const currentTag = this.tags.find((tag) => tag.id === id);
      if (currentTag) {
        this.allMolds = this.molds.filter((mold) =>
          currentTag.molds.includes(mold.id),
        );
        const currentMold = this.current.molds[0];
        const matchedMold = this.allMolds.find(
          (mold) => mold.id === currentMold,
        );
        if (!matchedMold) {
          this.selectedMold = null;
        } else {
          this.selectedMold = currentMold;
        }
      }
    },
    changeFileName(value) {
      this.current.name = value + this.fileSuffix;
    },
    closeFilePopup() {
      this.$store.commit('detailModule/SET_CUR_FILE', null);
    },
    async createFolder({ file, molds, group_ids }) {
      try {
        this.loading = true;
        let params;
        if (this.$features.supportBusinessGroup()) {
          params = {
            name: file.name,
            default_molds: molds,
            group_ids,
          };
        } else {
          params = {
            name: file.name,
            default_molds: molds,
          };
        }
        await this.$store.dispatch('detailModule/createFolder', {
          folderName: file.name,
          params,
        });
        this.closeFilePopup();
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['文件夹创建成功']`),
          type: 'success',
        });
        this.$emit('create-folder-success');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    async updateFile({ file, oldFileName, molds, tags, group_ids }) {
      try {
        this.loading = true;

        if (file.isDir) {
          // 更新文件夹
          const folderData = {
            id: file.id,
            name: file.name,
            oldName: oldFileName,
            default_molds: molds,
            current_default_molds: file.default_molds,
          };

          if (this.$features.supportBusinessGroup()) {
            folderData.group_ids = group_ids;
          }

          await this.$store.dispatch('detailModule/updateFolder', folderData);
        } else {
          // 更新文件
          const fileData = {
            id: file.id,
            name: file.name,
            molds,
            tags,
            scenario_id: file.scenario_id,
          };

          await this.$store.dispatch('detailModule/updateFileInfo', fileData);
        }

        this.$emit('update-files');
        this.closeFilePopup();
        this.$notify({
          title: this.$t(`message['提示']`),
          message: this.$t(`message['更新成功']`),
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: this.$t(`message['提示']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.loading = false;
      }
    },
    modifyFile(data) {
      if (data.file.isDir && !data.file.id) {
        // create new folder
        this.createFolder(data);
      } else {
        // update file or folder
        this.updateFile(data);
      }
    },
    async initBusinessGroups() {
      try {
        this.$set(this.current, 'group_ids', []);
        this.isFetchingGroups = true;
        await this.getUserGroups();
        if (this.current.isDir) {
          const catalogInfo = await this.getCatalogBusinessGroups();
          this.selectGroups(this.current.group_ids);
          this.selectedMold = catalogInfo.default_molds;
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      } finally {
        this.isFetchingGroups = false;
      }
    },
    async getUserGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
        if (this.groups.length === 1) {
          this.current.group_ids = [this.groups[0].id];
        }
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getCatalogBusinessGroups() {
      try {
        const treeId = this.current.id || this.$route.params.treeId;
        const res = await fetchCatalogBusinessGroups(treeId);
        this.current.group_ids = res.data.groups.map((item) => item.id);
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
      this.molds.forEach((item) => {
        if (availableSchemas.includes(item.id)) {
          visibleMolds.push(item);
        }
      });
      this.allMolds = visibleMolds;
      this.selectedMold = this.selectedMold?.filter((item) =>
        visibleMolds.map((mold) => mold.id).includes(item),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  h4 {
    display: flex;
    align-items: center;
    color: #444;
    i {
      font-size: 20px;
    }
  }
}
.tag-select-wrapper,
.mold-select-wrapper,
.group-select-wrapper {
  .el-select {
    width: 100%;
    ::v-deep .el-loading-mask {
      background-color: transparent;
    }
  }
}
</style>

<style lang="scss">
.file-popup-mold-select {
  max-width: 600px;
  .el-tag {
    margin-left: 10px;
    height: 18px;
    line-height: 18px;
  }
}
</style>
