<template>
  <div class="file-viewer">
    <el-container v-loading="fileViewer.isLoading" class="detail-container">
      <el-main>
        <div class="head-bar" v-if="showHeaderBar">
          <div class="action-wrapper">
            <div v-if="showFileActionBtns" class="action-btns">
              <el-tooltip
                effect="dark"
                placement="bottom"
                :content="$t(`message['新建文件夹']`)">
                <el-button
                  v-if="isCanCreateFolder"
                  type="text"
                  :circle="!$platform.isDefaultEnv() ? '' : null"
                  class="btn"
                  size="small"
                  @click="openFolderPopup">
                  <theme-icon
                    name="add-folder"
                    :old-icon-url="newFolderImg"></theme-icon>
                </el-button>
              </el-tooltip>
              <template v-if="fileViewer.curDirId !== -1">
                <template v-if="$features.showUploadFilePopup()">
                  <el-tooltip
                    effect="dark"
                    placement="bottom"
                    :content="$t(`message['上传文件']`)">
                    <el-button
                      type="text"
                      size="small"
                      class="btn"
                      @click="openUploadFileDialog">
                      <theme-icon
                        name="file-upload"
                        icon-class="el-icon-upload"></theme-icon>
                    </el-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-tooltip
                    effect="dark"
                    placement="bottom"
                    :content="$t(`message['上传文件']`)">
                    <el-button
                      type="text"
                      :circle="!$platform.isDefaultEnv() ? '' : null"
                      size="small"
                      class="btn"
                      @click="openUploadFileWithTaskTypeDialog">
                      <theme-icon
                        name="file-upload"
                        :old-icon-url="uploadFileImg"></theme-icon>
                    </el-button>
                  </el-tooltip>
                </template>
              </template>
              <el-tooltip
                effect="dark"
                placement="bottom"
                :content="$t(`message['上传压缩包']`)">
                <el-button
                  v-if="isCanUploadZip"
                  type="text"
                  :circle="!$platform.isDefaultEnv() ? '' : null"
                  size="small"
                  class="btn"
                  @click="openUploadFileWithTaskTypeDialog('zip')">
                  <theme-icon :name="zipIcon" :old-icon-url="uploadZipImg">
                  </theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                placement="bottom"
                :content="$t(`message['文件比对']`)">
                <el-button
                  v-if="showDiffFilesButton"
                  type="text"
                  size="small"
                  class="btn"
                  @click="handleDiffFiles">
                  <svg-font-icon
                    name="file-diff"
                    :size="18"
                    color="#707070"></svg-font-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                placement="bottom"
                :content="$text.file['批量预测']">
                <el-button
                  v-if="$features.supportBatchPredict()"
                  :disabled="batchPredictFilesButtonDisabled"
                  size="small"
                  class="btn"
                  @click="batchPredictFiles('predict')">
                  <theme-icon
                    name="reparse"
                    icon-class="el-icon-refresh"
                    img-class="refresh-img"></theme-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                placement="bottom"
                :content="$t(`message['批量审核']`)">
                <el-button
                  v-if="$features.supportBatchInspect()"
                  :disabled="!showBatchPredictFilesButton"
                  size="small"
                  class="btn"
                  @click="batchPredictFiles('inspect')">
                  <svg-font-icon
                    name="batch-inspect"
                    color="#707070"></svg-font-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                placement="bottom"
                :content="$t(`message['批量删除']`)">
                <el-button
                  v-if="$features.supportBatchDelete()"
                  :disabled="!showBatchDeleteFilesButton"
                  size="small"
                  class="btn"
                  @click="batchDeleteFiles">
                  <svg-font-icon
                    name="batch-delete"
                    :size="18"
                    color="#707070"></svg-font-icon>
                </el-button>
              </el-tooltip>
              <template v-if="this.$features.supportLLMExtract()">
                <el-tooltip effect="dark" placement="bottom" content="批量导出">
                  <el-button
                    :disabled="!showBatchExportAnswerDataButton"
                    size="small"
                    class="btn"
                    @click="exportAnswerData">
                    <svg-font-icon
                      name="download"
                      :size="17"
                      color="#707070"></svg-font-icon>
                  </el-button>
                </el-tooltip>
                <export-answer-data-history
                  :project-id="projectId"></export-answer-data-history>
              </template>
              <bread-crumb
                v-if="$user.isCcxiNormalUser()"
                currentTab="projectAll"
                :readonly="true"
                :is-show-root="false"></bread-crumb>
            </div>
            <upload-progress
              :fileName="uploadingFileInfo.name"
              :upload="uploadingFileInfo">
            </upload-progress>
          </div>
          <div class="summary">
            <slot name="summary"></slot>
          </div>
        </div>

        <el-dialog
          v-if="uploadFileDialogVisible"
          title="上传文件"
          visible
          :close-on-click-modal="false"
          @close="closeUploadFileDialog">
          <el-form
            ref="uploadFileForm"
            :model="uploadFileForm"
            :rules="uploadFileFormRules"
            label-width="100px"
            class="upload-file-form">
            <el-form-item
              v-if="$features.showFileTag()"
              :label="$t(`message['文件类型']`)"
              prop="tag">
              <el-select
                v-model="uploadFileForm.tag"
                :placeholder="$t(`message['请选择文件类型']`)">
                <el-option
                  v-for="tag in tags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="$features.showSchemaOptionsInUploadFilePopup()"
              :label="$t(`message['合同类型']`)"
              prop="molds">
              <el-select
                v-model="uploadFileForm.molds"
                :placeholder="$t(`message['请选择合同类型']`)">
                <el-option
                  v-for="(label, index) in schemas.items"
                  :key="index"
                  :label="label.name"
                  :value="label.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t(`message['上传']`)" prop="files">
              <el-upload
                drag
                action=""
                :multiple="true"
                :file-list="uploadFileForm.files"
                accept=".doc,.docx,.pdf"
                :auto-upload="false"
                :on-change="onUploadFileChange"
                :on-remove="onUploadFileRemove">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  {{ $t(`message['将文件拖到此处']`) }}，{{
                    $t(`message['或']`)
                  }}
                  <em>{{ $t(`message['点击上传']`) }}</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  {{ $t(`message['说明']`) }}：{{
                    $t(`message['目前支持上传']`)
                  }}
                  *.doc,*.docx,*.pdf
                  {{ $t(`message['格式的文档']`) }}
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="closeUploadFileDialog">
              {{ $t(`message['取消']`) }}
            </el-button>
            <el-button
              type="primary"
              :loading="showUploadFileProgress"
              @click="handleUploadFile">
              {{ $t(`message['确定']`) }}
            </el-button>
          </div>
        </el-dialog>

        <template v-if="uploadFileWithTaskTypeDialogVisible">
          <nafmii-upload-file-popup
            v-if="$platform.isNafmiiEnv()"
            :tree-id="treeId"
            :upload-title="uploadTitle"
            :accept-types="acceptTypes"
            :supported-suffixes="supportedSuffixes"
            :project-molds="fileViewer.molds"
            :task="task"
            :task-file-types="taskFileTypes"
            @upload-file="uploadFile"
            @close="closeUploadFileWithTaskTypeDialog" />
          <upload-dialog
            v-else-if="$isAllowed('showFileScenario')"
            ref="uploadDialog"
            :default-options="uploadFileDefaultOptions"
            :scenario-options="scenarioOptions"
            :accept-types="acceptTypes"
            :supported-suffixes="supportedSuffixes"
            :tree-id="treeId"
            @close="closeUploadFileWithTaskTypeDialog"
            @confirm="handleNewUploadConfirm" />
          <el-dialog
            v-else
            :title="uploadTitle"
            visible
            :close-on-click-modal="false"
            @close="closeUploadFileWithTaskTypeDialog">
            <el-form
              ref="uploadFileWithTaskTypeForm"
              :model="uploadFileWithTaskTypeForm"
              :rules="uploadFileWithTaskTypeFormRules"
              label-width="140px"
              class="upload-file-form">
              <el-form-item
                v-if="isShowTaskType"
                :label="$t(`message['处理方式']`)"
                prop="task_type">
                <el-radio
                  v-model="uploadFileWithTaskTypeForm.task_type"
                  label="extract">
                  {{ $t(`message['提取']`) }}
                </el-radio>
                <el-radio
                  v-if="$isAllowed('inspect')"
                  v-model="uploadFileWithTaskTypeForm.task_type"
                  label="audit">
                  {{ $t(`message['提取']`) }} + {{ $t(`message['审核']`) }}
                </el-radio>
              </el-form-item>
              <el-form-item :label="$t(`message['上传']`)" prop="files">
                <el-upload
                  drag
                  action=""
                  :multiple="true"
                  :file-list="uploadFileWithTaskTypeForm.files"
                  :accept="acceptTypes"
                  :auto-upload="false"
                  :on-change="onUploadFileWithTaskTypeChange"
                  :on-remove="onUploadFileWithTaskTypeRemove"
                  @drop.native="
                    (e) => handleUploadFileDrop(e.dataTransfer.files)
                  ">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    {{ $t(`message['将文件拖到此处']`) }}，{{
                      $t(`message['或']`)
                    }}
                    <em>{{ $t(`message['点击上传']`) }}</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">
                    {{ $t(`message['说明']`) }}：{{
                      $t(`message['目前支持上传']`)
                    }}
                    {{
                      supportedSuffixes
                        .split(',')
                        .map((item) => item.replace(/^./, ''))
                        .join('、')
                    }}
                    {{ $t(`message['格式的文档']`) }}
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button @click="closeUploadFileWithTaskTypeDialog">
                {{ $t(`message['取消']`) }}
              </el-button>
              <el-button
                type="primary"
                :loading="uploadingFileInfo.showProgress"
                @click="handleUploadFileWithTaskType">
                {{ $t(`message['确定']`) }}
              </el-button>
            </div>
          </el-dialog>
        </template>

        <file-list
          ref="fileList"
          :files="fileViewer.files"
          :pager="fileViewer.pager"
          :can-select-file="true"
          :readonly="readOnly"
          :scroll-top="scrollTop"
          :sort-params="sortParams"
          :expanded-files="expandedFiles"
          @open-dir="openDir"
          @open-file-popup="openFilePopup"
          @change-page="handleChangePage"
          @change-size="handleChangeSize"
          @change-sort="handleChangeSort"
          @change-expand="handleChangeExpand"
          @change-selection="handleChangeSelection">
          <template
            v-if="showOperationBtns(row.slotScope)"
            slot="row-handle"
            slot-scope="row">
            <template v-if="row.slotScope.fileType !== 'parent'">
              <el-tooltip
                effect="dark"
                :content="$t(`message['合规审核']`)"
                placement="top">
                <el-button
                  v-if="
                    $platform.isSseEnv() &&
                    row.slotScope.questions &&
                    row.slotScope.questions.length === 1
                  "
                  type="text"
                  size="small"
                  circle
                  @click.stop="previewFileByRuleCheck(row.slotScope)">
                  <theme-icon
                    name="audit"
                    icon-class="fa fa-eraser"></theme-icon>
                </el-button>
              </el-tooltip>
              <template v-if="showInspectAnswerBtn(row.slotScope)">
                <el-tooltip
                  v-if="$features.isShowOperationIcon()"
                  effect="dark"
                  :content="$t(`message['查看']`)"
                  placement="top">
                  <el-button
                    :type="!$platform.isDefaultEnv() ? 'warning' : 'text'"
                    size="small"
                    @click.stop="previewFileByInspect(row.slotScope)"
                    circle>
                    <theme-icon
                      name="view"
                      icon-class="el-icon-document"></theme-icon>
                  </el-button>
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  @click.stop="previewFileByInspect(row.slotScope)">
                  {{ $t(`message['查看']`) }}
                </el-button>
              </template>
              <template v-if="isShowEditInOperations(row.slotScope)">
                <el-tooltip
                  v-if="$features.isShowOperationIcon()"
                  effect="dark"
                  :content="$t(`message['编辑']`)"
                  placement="top">
                  <el-button
                    :type="!$platform.isDefaultEnv() ? 'primary' : 'text'"
                    size="small"
                    circle
                    @click.native.stop="openFilePopup(row.slotScope)">
                    <theme-icon
                      name="edit"
                      icon-class="el-icon-edit"></theme-icon>
                  </el-button>
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  @click.stop="openFilePopup(row.slotScope)">
                  {{ $t(`message['编辑']`) }}
                </el-button>
              </template>
              <template v-if="isShowReparseInOperations(row.slotScope)">
                <template v-if="isShowPredictInOperation(row.slotScope)">
                  <el-tooltip
                    v-if="$features.isShowOperationIcon()"
                    effect="dark"
                    :content="$text.file['重新预测']"
                    placement="top">
                    <el-button
                      :type="!$platform.isDefaultEnv() ? 'success' : 'text'"
                      size="small"
                      circle
                      :disabled="repredictButtonDisabled(row.slotScope)"
                      @click.native.stop="
                        reparseFile(
                          row.slotScope,
                          'predict',
                          $text.file['重新预测'],
                        )
                      ">
                      <theme-icon
                        name="reparse"
                        icon-class="el-icon-refresh"></theme-icon>
                    </el-button>
                  </el-tooltip>
                  <template v-else>
                    <el-button
                      v-if="isFileSourceByLocalUpload(row.slotScope.source)"
                      type="text"
                      :disabled="isReparseDisabled(row.slotScope)"
                      @click.stop="
                        reparseFile(
                          row.slotScope,
                          'predict',
                          $text.file['重新预测'],
                          $platform.isNafmiiEnv()
                            ? NAFMII_PREDICT_TASK_MAP.SKIP_PUSH.value
                            : undefined,
                        )
                      ">
                      {{ $text.file['重新预测'] }}
                    </el-button>
                    <el-dropdown
                      v-else
                      trigger="hover"
                      placement="bottom"
                      :disabled="isReparseDisabled(row.slotScope)"
                      @command="
                        (e) => handleReparseCommandForNafmii(e, row.slotScope)
                      ">
                      <el-button
                        type="text"
                        size="small"
                        :disabled="isReparseDisabled(row.slotScope)"
                        @click.stop>
                        重新识别
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="task in NAFMII_PREDICT_TASK_MAP"
                          :key="task.value"
                          :command="task">
                          {{ task.name }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </template>
                <el-dropdown
                  v-else
                  class="reparse-dropdown"
                  trigger="click"
                  @command="(e) => handleReparseCommand(e, row.slotScope)">
                  <el-button
                    class="reparse-btn"
                    :type="!$platform.isDefaultEnv() ? 'success' : 'text'"
                    size="small"
                    circle
                    :disabled="disableReparseFile(row.slotScope)"
                    @click.stop>
                    <theme-icon
                      v-if="$features.isShowOperationIcon()"
                      name="reparse"
                      icon-class="el-icon-refresh"></theme-icon>
                    <template v-else>{{ $text.file['重新预测'] }}</template>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="$isAllowed('showFileScenario')">
                      <el-dropdown-item command="parse">
                        {{ $t(`message['重新解析']`) }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        command="predict"
                        v-if="hasAIStatus(row.slotScope)">
                        {{ $t(`message['重新预测']`) }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        command="audit"
                        v-if="hasAuditReview(row.slotScope)">
                        {{ $t(`message['重新审核（规则）']`) }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        command="judge"
                        v-if="hasJudgeReview(row.slotScope)">
                        {{ $t(`message['重新审核（大模型）']`) }}
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item command="predict">
                        {{ $t(`message['重新预测和审核']`) }}
                      </el-dropdown-item>
                      <el-dropdown-item command="inspect">
                        {{ $t(`message['仅重新审核']`) }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-if="isShowDeleteInOperations(row.slotScope)">
                <el-tooltip
                  v-if="$features.isShowOperationIcon()"
                  effect="dark"
                  :content="$t(`message['删除']`)"
                  placement="top">
                  <el-button
                    :type="!$platform.isDefaultEnv() ? 'danger' : 'text'"
                    size="small"
                    circle
                    :disabled="disableDeleteFile(row.slotScope)"
                    @click.native.stop="deleteFile(row.slotScope)">
                    <theme-icon
                      name="delete"
                      icon-class="el-icon-delete"></theme-icon>
                  </el-button>
                </el-tooltip>
                <el-button
                  v-else
                  type="text"
                  class="delete-btn"
                  :disabled="disableDeleteFile(row.slotScope)"
                  @click.stop="deleteFile(row.slotScope)">
                  {{ $t(`message['删除']`) }}
                </el-button>
              </template>
            </template>
          </template>
        </file-list>
      </el-main>
    </el-container>

    <template v-if="fileViewer.current">
      <edit-file-dialog
        v-if="shouldShowEditFileDialog"
        ref="editFileDialog"
        :file-data="editFileData"
        :scenario-options="scenarioOptions"
        @confirm="handleEditFileConfirm"
        @close="handleEditFileClose">
      </edit-file-dialog>

      <file-popup
        v-else
        :molds="schemas.items"
        :file="fileViewer.current"
        @create-folder-success="handleCreateFolderSuccess"
        @update-files="getFiles">
      </file-popup>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileList from './FileList';
import FilePopup from './FilePopup';
import BreadCrumb from '@/components/BreadCrumb';
import UploadProgress from './UploadProgress.vue';
import FileMarkableMixin from './mixins/FileMarkableMixin';
import UploadFileMixin from './mixins/UploadFileMixin';
import {
  questionStatusNames,
  pdfParseStatus,
  scriberPublicPoc,
  fileMaxSize,
  AI_PREDICT_STATUS_MAP,
} from '@/store/constants';
import { CONFIRM_STATUS_CODE } from '@/custom/nafmii/common/constant.js';
import {
  file as fileApi,
  cmfchina as cmfchinaApi,
  nafmii as nafmiiApi,
} from '@/store/api';
import { diffFiles } from '@/store/api/cgs.api';
import { fetchUserBusinessGroups } from '../store/api/cmfchina.api';
import { conflictImg } from '@/images/';
import { uploadFileImg, uploadZipImg, newFolderImg } from '@/images/';
import {
  EventBus,
  checkUploadFile,
  getAcceptFileTypes,
  isUploadZipFile,
} from '@/utils';
import * as llmParamsUtils from '@/utils/llmParamsUtils';
import NafmiiUploadFilePopup from '@/custom/nafmii/components/UploadFilePopup';
import UploadDialog from './UploadDialog.vue';
import EditFileDialog from './EditFileDialog.vue';
import ExportAnswerDataHistory from './ExportAnswerDataHistory.vue';
import {
  isFileConfirmed,
  isFileSourceByLocalUpload,
} from '@/custom/nafmii/common/utils';
import {
  ROUTE_NAME_MAP,
  PREDICT_TASK_MAP as NAFMII_PREDICT_TASK_MAP,
} from '@/custom/nafmii/common/constant';

export default {
  name: 'file-viewer',
  components: {
    FileList,
    FilePopup,
    EditFileDialog,
    BreadCrumb,
    UploadProgress,
    NafmiiUploadFilePopup,
    UploadDialog,
    ExportAnswerDataHistory,
  },
  mixins: [FileMarkableMixin, UploadFileMixin],
  props: {
    fileViewer: {
      type: Object,
      required: true,
    },
    projectId: {
      type: [Number, String],
      required: false,
    },
    treeId: {
      type: [Number, String],
      required: false,
    },
    canCreateFolder: {
      type: Boolean,
      required: false,
      default: true,
    },
    canUploadZip: {
      type: Boolean,
      required: false,
      default: true,
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectedFiles: {
      type: Array,
      default: () => [],
    },
    expandedFiles: {
      type: Array,
      default: () => [],
    },
    sortParams: {
      type: Object,
      default: () => {},
    },
    scrollTop: {
      type: Number,
      default: 0,
    },
    task: {
      type: Boolean,
      default: false,
    },
    taskFileTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      uploadFileImg,
      uploadZipImg,
      newFolderImg,
      conflictImg,
      file: null,
      folder: null,
      folderRules: {
        name: {
          required: true,
          message: this.$t(`message['文件名不能为空']`),
          trigger: 'blur',
        },
      },
      uploadType: 'file',
      uploadFileWithTaskTypeDialogVisible: false,
      uploadFileWithTaskTypeForm: {
        task_type: 'extract',
        files: [],
      },
      uploadFileWithTaskTypeFormRules: {
        files: [
          {
            required: true,
            message: this.$t(`message['请选择文件']`),
            trigger: 'change',
          },
        ],
        task_type: [
          {
            required: true,
            message: this.$t(`message['请选择操作类型']`),
            trigger: 'change',
          },
        ],
      },
      uploadFileDialogVisible: false,
      uploadFileForm: {
        tag: '',
        molds: '',
        files: [],
      },
      uploadFileFormRules: {
        files: [
          {
            required: true,
            message: this.$t(`message['请选择文件']`),
            trigger: 'change',
          },
        ],
        tag: [
          {
            required: true,
            message: this.$t(`message['请选择文件类型']`),
            trigger: 'change',
          },
        ],
      },
      showUploadFileProgress: false,
      groups: [],
      NAFMII_PREDICT_TASK_MAP,
    };
  },
  computed: {
    ...mapGetters('projectModule', ['projects']),
    ...mapGetters(['loginUser', 'configuration']),
    ...mapGetters('tagModule', ['tags']),
    ...mapGetters('schemaModule', ['schemas']),
    ...mapGetters('scenariosModule', ['scenarioItems']),
    scenarioOptions() {
      return this.scenarioItems;
    },

    uploadObj() {
      return this.fileViewer.uploadMap[this.fileViewer.curDirId] || {};
    },
    isTreeidInProject() {
      const treeId = Number(this.$route.params.treeId);
      return !!this.projects.items.find((item) => item.rtree_id === treeId);
    },
    uploadTitle() {
      const zipLabel =
        this.configuration.supported_zip_suffixes?.length > 0
          ? '压缩包'
          : 'zip';
      return this.uploadType === 'zip' ? `上传${zipLabel}` : '上传文件';
    },
    supportedSuffixes() {
      if (this.uploadType === 'zip') {
        if (!this.configuration.supported_zip_suffixes) {
          return '.zip';
        }
        return this.configuration.supported_zip_suffixes.join(',');
      }
      return this.configuration.supported_suffixes.join(',');
    },
    zipIcon() {
      const supportedZipSuffixes = this.configuration.supported_zip_suffixes;
      if (supportedZipSuffixes?.length === 1) {
        const type = supportedZipSuffixes[0];
        switch (type) {
          case '.zip':
            return 'file-zip';
          case '.tar':
            return 'file-tar';
          case '.7z':
            return 'file-7z';
          default:
            return '.zip';
        }
      }
      return 'file-compression';
    },
    acceptTypes() {
      return getAcceptFileTypes(this.supportedSuffixes);
    },
    currentProject() {
      const pid = Number(this.projectId);
      return this.projects.items.find((i) => i.id === pid) || {};
    },
    showHeaderBar() {
      if (this.$platform.isCmfchinaEnv()) {
        const visibleTreeIds = this.groups
          .map((group) => group.file_tree_ids)
          .flat(1);
        return visibleTreeIds.includes(this.treeId);
      }
      return true;
    },
    showOperationBtns() {
      return (row) => {
        if (this.$platform.isCmfchinaEnv()) {
          if (!row.isDir) {
            return true;
          }
          const visibleTreeIds = this.groups
            .map((group) => group.file_tree_ids)
            .flat(1);
          return visibleTreeIds.includes(row.id);
        }
        return true;
      };
    },
    showFileActionBtns() {
      if (
        this.configuration.app_id === scriberPublicPoc &&
        !this.$user.isAdminUser() &&
        this.currentProject.public
      ) {
        return false;
      }

      if (this.$platform.isStrongholdEnv()) {
        return false;
      }

      if (this.$platform.isNafmiiEnv()) {
        return true;
      }

      if (
        !(
          this.$isAllowed('manageProject') ||
          this.currentProject.uid === this.loginUser.id
        )
      ) {
        return false;
      }

      return true;
    },
    isCanCreateFolder() {
      return (
        this.canCreateFolder &&
        this.fileViewer.curDirId !== -1 &&
        !this.$user.isCcxiNormalUser()
      );
    },
    isCanUploadZip() {
      return this.canUploadZip && this.$features.supportUploadZipFile();
    },
    isFileParsing() {
      if (this.$platform.isNafmiiEnv()) {
        return (status) =>
          status === pdfParseStatus.parsing ||
          status === pdfParseStatus.waiting ||
          status === pdfParseStatus.parsing_time;
      }
      return (status) => status === pdfParseStatus.parsing;
    },
    isFileParseCompleted() {
      return (status) => status === pdfParseStatus.completed;
    },
    isFileParseWaiting() {
      return (status) => status === pdfParseStatus.waiting;
    },
    isFileParseFailed() {
      return (status) => status === pdfParseStatus.failed;
    },
    isReparseDisabled() {
      if (this.$platform.isNafmiiEnv()) {
        return (row) =>
          row.confirm_status === CONFIRM_STATUS_CODE.confirmed ||
          !(
            this.isFileParseCompleted(row.pdf_parse_status) ||
            this.isFileParseFailed(row.pdf_parse_status)
          );
      }
      return (row) => this.isFileParsing(row.pdf_parse_status);
    },
    batchPredictFilesButtonDisabled() {
      if (this.selectedFiles.length === 0) {
        return true;
      }
      return this.selectedFiles.some((item) => {
        return this.repredictButtonDisabled(item);
      });
    },
    repredictButtonDisabled() {
      return (row) => {
        const { pdf_parse_status, questions } = row;
        const canRepredict =
          pdf_parse_status === pdfParseStatus.completed &&
          questions.every((question) => {
            const { ai_status } = question;
            return [
              AI_PREDICT_STATUS_MAP.FINISHED,
              AI_PREDICT_STATUS_MAP.FAILED,
            ].includes(ai_status);
          });
        return !canRepredict;
      };
    },
    showDiffFilesButton() {
      return (
        this.$features.canCreateCalliperDiffTask() &&
        this.selectedFiles.length === 2 &&
        this.selectedFiles.every((item) => !item.isDir)
      );
    },
    showBatchDeleteFilesButton() {
      return this.selectedFiles.length > 0;
    },
    showBatchPredictFilesButton() {
      return this.selectedFiles.length > 0;
    },
    showBatchExportAnswerDataButton() {
      return this.selectedFiles.length > 0;
    },
    isShowTaskType() {
      return !this.$platform.isCmfchinaEnv();
    },
    disableReparseFile() {
      return (row) => {
        const { pdf_parse_status, confirm_status } = row;
        if (this.$platform.isNafmiiEnv()) {
          return (
            this.isFileParsing(pdf_parse_status) ||
            this.isFileParseWaiting(pdf_parse_status) ||
            this.isFileConfirmed(confirm_status)
          );
        }
        return this.isFileParsing(pdf_parse_status);
      };
    },
    disableDeleteFile() {
      return (row) => {
        const { source } = row;
        if (this.$platform.isNafmiiEnv() && !row.isDir) {
          return !this.isFileSourceByLocalUpload(source);
        }
        return false;
      };
    },
    isShowEditInOperations() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          return false;
        }
        if (this.$platform.isStrongholdEnv()) {
          return true;
        }
        return (
          this.$isAllowed('manageProject') || row.uid === this.loginUser.id
        );
      };
    },
    isShowReparseInOperations() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          return !row.isDir;
        }
        return this.$isAllowed('manageProject') && !row.isDir;
      };
    },
    isShowPredictInOperation() {
      return (row) => {
        if (this.$platform.isNafmiiEnv()) {
          return true;
        }
        return (
          row.task_type === 'extract' && !this.$isAllowed('showFileScenario')
        );
      };
    },
    isShowDeleteInOperations() {
      return (row) => {
        if (this.$platform.isStrongholdEnv()) {
          return false;
        }
        if (this.$platform.isNafmiiEnv()) {
          return true;
        }
        return (
          this.$isAllowed('manageProject') || row.uid === this.loginUser.id
        );
      };
    },
    routeFrom() {
      return ROUTE_NAME_MAP[this.$route.name];
    },

    shouldShowEditFileDialog() {
      if (!this.fileViewer.current) {
        return false;
      }
      const isLLMReview = this.$isAllowed('showFileScenario');
      return isLLMReview;
    },

    /**
     * 获取编辑文件数据
     * @returns {Object} 编辑文件数据
     */
    editFileData() {
      if (!this.fileViewer.current) {
        return {};
      }

      const file = this.fileViewer.current;
      const defaultOptions = this.fileViewer.defaultOptions;

      // 获取任务参数
      const taskParams = this.getTaskParams(file, defaultOptions);

      // 转换任务类型为表单数据
      const formData = this.convertTaskTypeToFormData(
        taskParams.task_type,
        taskParams.scenario_id,
      );

      return {
        ...file,
        filename: file.name,
        process_methods: formData.process_methods,
        audit_methods: formData.audit_methods,
        scenario_id: this.getScenarioId(file, defaultOptions),
        molds: this.getMolds(file, defaultOptions),
        isDir: file.isDir,
      };
    },
    uploadFileDefaultOptions() {
      return this.fileViewer.defaultOptions;
    },
  },
  created() {
    this.init();
  },
  methods: {
    isFileConfirmed,
    isFileSourceByLocalUpload,
    hasAIStatus(row) {
      return row.questions.length > 0;
    },
    hasAuditReview(row) {
      return typeof row.audit_status === 'number';
    },
    hasJudgeReview(row) {
      return typeof row.judge_status === 'number';
    },
    /**
     * 判断是否为新建文件夹
     * @param {Object} file - 文件对象
     * @returns {Boolean} 是否为新建文件夹
     */
    isNewFolder(file) {
      return file.isDir && !file.name;
    },

    /**
     * 获取任务参数
     * @param {Object} file - 文件对象
     * @param {Object} defaultOptions - 默认选项
     * @returns {Object} 任务参数 { task_type, scenario_id }
     */
    getTaskParams(file, defaultOptions) {
      if (file.isDir) {
        if (this.isNewFolder(file)) {
          return {
            task_type: defaultOptions.default_task_type,
            scenario_id: defaultOptions.default_scenario_id,
          };
        }
        return {
          task_type: file.default_task_type,
          scenario_id: file.default_scenario_id,
        };
      }

      return {
        task_type: file.task_type,
        scenario_id: file.scenario,
      };
    },

    /**
     * 获取场景ID
     * @param {Object} file - 文件对象
     * @param {Object} defaultOptions - 默认选项
     * @returns {String|Array} 场景ID
     */
    getScenarioId(file, defaultOptions) {
      if (file.isDir) {
        return this.isNewFolder(file)
          ? defaultOptions.default_scenario_id
          : file.default_scenario_id;
      }
      return file.scenario;
    },

    /**
     * 获取模板数据
     * @param {Object} file - 文件对象
     * @param {Object} defaultOptions - 默认选项
     * @returns {Array} 模板数组
     */
    getMolds(file, defaultOptions) {
      if (file.isDir) {
        return this.isNewFolder(file)
          ? defaultOptions.default_molds
          : file.default_molds;
      }
      return file.molds;
    },

    init() {
      if (this.$features.supportBusinessGroup()) {
        this.getUserGroups();
      }
    },
    openDir(file) {
      if (this.showInspectAnswerBtn(file)) {
        this.previewFileByInspect(file);
        return;
      }

      if (!file.questions || file.questions.length === 0) {
        this.$emit('open-dir', file);
      } else if (file.questions.length === 1) {
        this.previewFileByRemark(file);
      }
    },
    openFolderPopup() {
      if (this.$platform.isNafmiiEnv()) {
        this.folder = { isDir: true, name: '', molds: this.fileViewer.molds };
      } else {
        this.folder = { isDir: true, name: '', molds: [] };
      }
      this.openFilePopup(this.folder);
    },
    beforeFileUpload(file) {
      let fileSizeLimit;
      if (this.$platform.isCmfchinaEnv()) {
        if (!isUploadZipFile(file)) {
          fileSizeLimit = this.configuration.file_size_limit;
        }
      } else {
        fileSizeLimit = fileMaxSize;
      }
      const isChecked = checkUploadFile(
        file,
        this.acceptTypes,
        fileSizeLimit,
        true,
      );
      return isChecked;
    },
    async handleUploadFile() {
      const isValid = await this.$refs['uploadFileForm']
        .validate()
        .catch(() => {});

      if (isValid) {
        try {
          this.showUploadFileProgress = true;
          const { tag, molds, files } = this.uploadFileForm;
          const formData = new FormData();
          if (this.$features.showFileTag()) {
            formData.append('tag', tag);
          }
          if (molds) {
            formData.append('molds', molds);
          }
          files.forEach((file) => {
            formData.append('file', file.raw);
          });
          await this.$store.dispatch('detailModule/uploadFile', {
            treeId: this.treeId,
            data: formData,
          });
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(`message['上传成功']`),
            type: 'success',
          });
          this.closeUploadFileDialog();
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        } finally {
          this.showUploadFileProgress = false;
        }
      }
    },
    getUploadFileParamsWithTaskType(file, { task_type, default_molds }) {
      const formData = new FormData();
      formData.append('file', file.raw);
      if (!this.$platform.isCmfchinaEnv()) {
        formData.append('task_type', task_type);
      }
      if (default_molds.length > 0) {
        default_molds.forEach((item) => {
          formData.append('molds', item);
        });
      }
      return { treeId: this.treeId, data: formData };
    },
    async handleNewUploadConfirm(data) {
      const { files, ...params } = data;
      const validFailedFile = files.find((file) => {
        return !this.beforeFileUpload(file.raw);
      });
      if (validFailedFile) {
        return;
      }
      try {
        this.uploadFileWithTaskTypeDialogVisible = false;
        this.uploadFile(
          files,
          params,
          this.$refs.uploadDialog.getUploadFileParams,
        );
      } catch (error) {
        console.error('上传失败:', error);
        this.$message.error('上传失败: ' + (error.message || '未知错误'));
      } finally {
        if (this.$refs.uploadDialog) {
          this.$refs.uploadDialog.closeLoading();
        }
      }
    },
    async handleUploadFileWithTaskType() {
      const isValid = await this.$refs['uploadFileWithTaskTypeForm']
        .validate()
        .catch(() => {});

      if (isValid) {
        const { files, task_type } = this.uploadFileWithTaskTypeForm;
        const validFailedFile = files.find((file) => {
          return !this.beforeFileUpload(file.raw);
        });
        if (validFailedFile) {
          return;
        }
        this.closeUploadFileWithTaskTypeDialog();
        this.uploadFile(
          files,
          {
            task_type,
            default_molds: this.uploadFileDefaultOptions.default_molds,
          },
          this.getUploadFileParamsWithTaskType,
        );
      }
    },
    async uploadFile(files, params, getUploadFileParamsFun) {
      try {
        let uploadDefaultFileApi, uploadZipFileApi;
        if (this.$platform.isCmfchinaEnv()) {
          uploadDefaultFileApi = cmfchinaApi.uploadFile;
          uploadZipFileApi = cmfchinaApi.uploadZipBySSE;
        } else if (this.$platform.isNafmiiEnv()) {
          if (this.task) {
            uploadDefaultFileApi = nafmiiApi.uploadTasks;
          } else {
            uploadDefaultFileApi = nafmiiApi.uploadFile;
            uploadZipFileApi = nafmiiApi.uploadZipFile;
          }
        } else {
          uploadDefaultFileApi = fileApi.uploadFile;
          uploadZipFileApi = fileApi.uploadZipBySSE;
        }
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          const uploadFile = isUploadZipFile(file.raw)
            ? this.handleUploadZipFileBySSE
            : this.handleUploadDefaultFile;
          const uploadFileApi = isUploadZipFile(file.raw)
            ? uploadZipFileApi
            : uploadDefaultFileApi;
          await uploadFile({
            fileName: file.raw.name,
            params: getUploadFileParamsFun(file, params),
            uploadFileApi,
          });
          this.getFiles();
          if (this.$features.supportBusinessGroup()) {
            this.getUserGroups();
          }
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    onUploadFileChange(_file, fileList) {
      this.uploadFileForm.files = fileList;
      this.$refs.uploadFileForm.clearValidate('files');
    },
    onUploadFileRemove(_file, fileList) {
      this.uploadFileForm.files = fileList;
    },

    openUploadFileDialog() {
      this.uploadFileDialogVisible = true;
    },
    closeUploadFileDialog() {
      this.uploadFileDialogVisible = false;
      this.uploadFileForm = {
        tag: '',
        files: [],
      };
    },
    async openUploadFileWithTaskTypeDialog(uploadType) {
      this.uploadFileWithTaskTypeDialogVisible = true;
      this.uploadType = uploadType;
      if (this.$isAllowed('showFileScenario')) {
        try {
          await this.$store.dispatch('scenariosModule/getScenarios');
        } catch (error) {
          this.$notify({
            title: '错误',
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    closeUploadFileWithTaskTypeDialog() {
      this.uploadFileWithTaskTypeDialogVisible = false;
      this.uploadFileWithTaskTypeForm = {
        task_type: 'extract',
        files: [],
      };
      if (this.$isAllowed('showFileScenario') && this.$refs.uploadDialog) {
        this.$refs.uploadDialog.closeLoading();
      }
    },
    handleUploadFileDrop(files) {
      Array.from(files).forEach((file) => {
        this.beforeFileUpload(file);
      });
    },
    onUploadFileWithTaskTypeChange(_file, fileList) {
      const files = fileList.filter((file) => this.beforeFileUpload(file));
      this.uploadFileWithTaskTypeForm.files = files;
      this.$refs.uploadFileWithTaskTypeForm.clearValidate('files');
    },
    onUploadFileWithTaskTypeRemove(_file, fileList) {
      this.uploadFileWithTaskTypeForm.files = fileList;
    },
    /**
     * 删除文件（夹）
     */
    deleteFile(file) {
      this.$emit('delete-file', { file });
    },
    /**
     * 点击修改文件（夹）
     */
    async openFilePopup(file) {
      this.$emit('set-current', file);

      // 如果在 LLM 审核模式下，需要获取应用场景选项和 Schema 数据
      if (this.$isAllowed('showFileScenario')) {
        try {
          await Promise.all([
            this.$store.dispatch('scenariosModule/getScenarios'),
            this.fetchAllSchemas(),
          ]);
        } catch (error) {
          console.error('获取数据失败:', error);
          this.$notify({
            title: '错误',
            message: '获取数据失败，请重试',
            type: 'error',
          });
        }
      }
    },

    convertTaskTypeToFormData(taskType, scenarioId) {
      return llmParamsUtils.getMethodsByTaskTypeCode(taskType, scenarioId);
    },

    convertFormDataToTaskType(processMethods, auditMethods, scenarioId) {
      return llmParamsUtils.getTaskTypeByMethods(
        processMethods,
        auditMethods,
        scenarioId,
      );
    },

    async handleEditFileConfirm(params) {
      try {
        const currentFile = this.fileViewer.current;
        if (currentFile.isDir && !currentFile.name) {
          const formattedParams = {
            name: params.folderName,
            default_molds: params.molds || [],
            default_task_type: params.task_type || null,
            default_scenario_id: params.scenario_id || null,
          };
          await this.$store.dispatch('detailModule/createFolder', {
            folderName: params.folderName,
            params: formattedParams,
          });
        } else {
          if (currentFile.isDir) {
            // 更新文件夹
            const folderData = {
              id: currentFile.id,
              name: params.filename,
              default_molds: params.molds,
              default_task_type: params.task_type,
              default_scenario_id: params.scenario_id,
            };

            await this.$store.dispatch('detailModule/updateFolder', folderData);
          } else {
            // 更新文件
            const fileData = {
              id: currentFile.id,
              name: params.filename,
              molds: params.molds,
              tags: currentFile.tags,
              scenario_id: params.scenario_id,
              task_type: params.task_type,
            };

            await this.$store.dispatch('detailModule/updateFileInfo', fileData);
          }
        }

        this.$notify({
          title: '成功',
          message: `${currentFile.isDir ? '文件夹' : '文件'}${
            currentFile.name ? '配置修改' : '创建'
          }成功`,
          type: 'success',
        });

        this.handleEditFileClose();
        this.getFiles();
      } catch (error) {
        this.$refs.editFileDialog.closeSubmitting();
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },

    /**
     * 处理 EditFileDialog 关闭事件
     */
    handleEditFileClose() {
      this.$store.commit('detailModule/SET_CUR_FILE', null);
    },
    viewHistory(file) {
      this.$router.push({
        name: 'fileHistory',
        params: { fileId: file.id },
      });
    },
    labelBtnDisable(status) {
      let { prepare, completed } = questionStatusNames;
      if (status === prepare) return false;
      else if (status === completed) return false;
      return true;
    },
    isShowTag(row) {
      return (
        this.$isAllowed('remarkOrInspect') &&
        row.molds &&
        row.molds.length === 0
      );
    },
    getFiles() {
      this.$emit('fetch-files');
    },
    handleChangePage(page) {
      this.$emit('change-page', page);
    },
    handleChangeSize(size) {
      this.$emit('change-size', size);
    },
    async reparseFile(row, task, type, flag) {
      try {
        const data = {
          task,
          fids: [row.id],
          flag,
        };
        if (this.$platform.isNafmiiEnv()) {
          await nafmiiApi.predictFiles(data, this.routeFrom);
        } else {
          await fileApi.predictFiles(data);
        }
        this.$notify({
          title: this.$t(`message['成功']`),
          message:
            this.$t(`message['发起']`) + `${type}` + this.$t(`message['成功']`),
          type: 'success',
        });
        this.getFiles();
        EventBus.$emit('after-reparse-file');
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      }
    },
    async handleReparseCommandForNafmii(task, row) {
      const confirm = await this.$confirm(
        task.description + '，是否继续？',
        task.name,
      ).catch(() => {});
      if (confirm === 'confirm') {
        await this.reparseFile(row, 'predict', task.name, task.value);
        this.getFiles();
      }
    },
    async handleReparseCommand(command, row) {
      if (this.$isAllowed('showFileScenario')) {
        this.LLMReviewReparseCommand(command, row);
        return;
      }
      const taskMap = {
        predict: this.$t(`message['重新预测和审核']`),
        inspect: this.$t(`message['重新审核']`),
      };
      if (
        this.$platform.isCmfchinaEnv() &&
        command === 'predict' &&
        row.reviewed
      ) {
        const confirm = await this.$confirm(
          '文档已通过复核，重新预测将替换原复核答案，仅保留最新模型结果。是否继续重新预测并审核？',
          '提示',
        ).catch(() => {});
        if (confirm === 'confirm') {
          this.reparseFile(row, command, taskMap[command]);
        }
        return;
      }
      this.reparseFile(row, command, taskMap[command]);
    },
    LLMReviewReparseCommand(command, row) {
      const taskMap = {
        parse: this.$t(`message['重新解析']`),
        predict: this.$t(`message['重新预测']`),
        audit: this.$t(`message['重新审核（规则）']`),
        judge: this.$t(`message['重新审核（大模型）']`),
      };
      this.reparseFile(row, command, taskMap[command]);
    },
    async handleDiffFiles() {
      try {
        const { id: file_id_1, name: file1Name } = this.selectedFiles[0];
        const { id: file_id_2, name: file2Name } = this.selectedFiles[1];

        const res = await diffFiles({ file_id_1, file_id_2 });
        const message =
          this.$t(`message['已将文件']`) +
          file1Name +
          this.$t(`message['与']`) +
          file2Name +
          this.$t(`message['发送至Calliper进行比对。']`);
        const confirm = await this.$confirm(
          message,
          this.$t(`message['提示']`),
          {
            confirmButtonText: this.$t(`message['去查看']`),
            cancelButtonText: this.$t(`message['关闭']`),
            type: 'warning',
          },
        ).catch(() => {});

        if (confirm === 'confirm') {
          window.open(res.data.calliper_url);
        }
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: error.message,
          type: 'error',
        });
      } finally {
        this.resetSelectedFiles();
      }
    },
    resetSelectedFiles() {
      this.$refs.fileList.clearSelection();
    },
    async batchDeleteFiles() {
      const confirm = await this.$confirm(
        this.$t(`message['确定要删除选中的文件吗？']`),
        this.$t(`message['提示']`),
      ).catch(() => {});

      if (confirm === 'confirm') {
        const dirIds = this.selectedFiles
          .filter((item) => item.isDir)
          .map((item) => item.id);
        const fileIds = this.selectedFiles
          .filter((item) => !item.isDir)
          .map((item) => item.id);

        let data;
        if (this.$platform.isNafmiiEnv()) {
          data = { tree_ids: dirIds, file_ids: fileIds };
        } else {
          data = { dirs: dirIds, fids: fileIds };
        }
        try {
          if (this.$platform.isNafmiiEnv()) {
            await nafmiiApi.deleteFiles(data, this.routeFrom);
          } else {
            await fileApi.batchDeleteFiles(data);
          }
          this.$notify({
            title: this.$t(`message['成功']`),
            message: this.$t(`message['批量删除文件成功']`),
            type: 'success',
          });
          this.resetSelectedFiles();
          this.$emit('after-batch-delete-files');
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async batchPredictFiles(task) {
      const title =
        task === 'predict'
          ? this.$text.file['确定要重新预测选中的文件吗？']
          : '确定要重新审核选中的文件吗？';
      const message = this.selectedFiles.find((file) => file.reviewed)
        ? `选中的文件中存在已通过复核的文档，${
            task === 'predict' ? '重新预测和审核' : '重新审核'
          }将替换原复核答案，仅保留最新模型结果。是否继续${
            task === 'predict' ? '重新预测并审核' : '重新审核'
          }？`
        : title;
      const confirm = await this.$confirm(
        message,
        this.$t(`message['提示']`),
      ).catch(() => {});

      if (confirm === 'confirm') {
        const data = {
          task,
          dirs: this.selectedFiles
            .filter((item) => item.isDir)
            .map((item) => item.id),
          fids: this.selectedFiles
            .filter((item) => !item.isDir)
            .map((item) => item.id),
        };
        try {
          if (this.$platform.isNafmiiEnv()) {
            await nafmiiApi.predictFiles(data, this.routeFrom);
          } else {
            await fileApi.predictFiles(data);
          }
          const taskMessage =
            task === 'predict'
              ? this.$text.file['重新预测']
              : this.$t(`message['重新审核']`);
          this.$notify({
            title: this.$t(`message['成功']`),
            message:
              this.$t(`message['发起']`) +
              taskMessage +
              this.$t(`message['成功']`),
            type: 'success',
          });
          this.resetSelectedFiles();
          this.$emit('after-batch-predict-files');
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    async exportAnswerData() {
      const confirm = await this.$confirm(
        '确定要导出选中的文件答案吗？',
        '提示',
      ).catch(() => {});

      if (confirm === 'confirm') {
        const data = {
          tree_ids: this.selectedFiles
            .filter((item) => item.isDir)
            .map((item) => item.id),
          file_ids: this.selectedFiles
            .filter((item) => !item.isDir)
            .map((item) => item.id),
        };
        try {
          await fileApi.batchExportAnswerData(this.projectId, data);
          this.$notify({
            title: '成功',
            message: '数据导出中，导出详情须在导出历史列表中查看',
            type: 'success',
          });
          this.resetSelectedFiles();
        } catch (error) {
          this.$notify({
            title: this.$t(`message['错误']`),
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    viewExportAnswerDataHistory() {},
    async getUserGroups() {
      try {
        const res = await fetchUserBusinessGroups();
        this.groups = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    handleCreateFolderSuccess() {
      this.init();
    },
    handleChangeSort(params) {
      this.$emit('change-sort', params);
    },
    handleChangeExpand(rows) {
      this.$emit('change-expand', rows);
    },
    handleChangeSelection(files) {
      this.$emit('change-selection', files);
    },
  },
};
</script>

<style scoped lang="scss">
.file-viewer {
  --img-size: 32px;
}
.action-btns {
  .el-button,
  ::v-deep .el-upload,
  .upload-zip {
    &.is-circle {
      padding: 0 !important;
    }
    &:hover {
      opacity: 0.9;
    }
  }
  ::v-deep .btn {
    height: 34px;
    padding: 0 15px;
    color: #7d8598;
    border: 1px solid #edeff3;
    background: linear-gradient(180deg, #fff, #f5f7ff);
    &.is-disabled {
      opacity: 0.3;
      border: 1px solid #ccc;
      &:hover {
        color: #7d8598;
      }
    }
    ::v-deep i {
      font-size: 20px;
      font-weight: bold;
    }
    .refresh-img {
      width: 20px !important;
      height: 20px !important;
      filter: contrast(0);
    }
  }
  ::v-deep img {
    width: var(--img-size);
    height: var(--img-size);
    display: block;
    box-sizing: border-box;
    border-radius: 50%;
  }
}
.conflict-icon {
  width: 12px;
  height: 12px;
  transform: scale(1.4);
}
.el-main {
  padding: 0;
  overflow: hidden;
  .el-pagination {
    margin-top: 30px;
    text-align: center;
  }
}
.detail-container {
  width: 100%;
}
.head-bar {
  padding: 1em 0;
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-width: 0 1px 1px 1px;
  overflow: hidden;
}
.action-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: auto;
  .action-btns {
    display: flex;
    align-items: center;
    ::v-deep .file-path {
      margin-left: 50px;
    }
    > div {
      margin: 0 5px;
      &:hover img {
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
      }
    }
    > .el-button {
      margin: 0 5px;
    }
  }
}
.new-folder {
  display: block;
  padding: 0;
  border: 0;
  border-radius: 50%;
  font-size: inherit;
  height: 100%;
  background: #aace5a;
  &:hover {
    background: #aace5a;
    border: 0;
  }
}
.new-folder ::v-deep span {
  display: block;
  height: 100%;
}

.upload-file {
  ::v-deep .el-upload {
    display: block;
    height: 100%;
  }
  ::v-deep .el-upload-list {
    display: none;
  }
}
.upload-zip {
  position: relative;
  input {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    clip-path: polygon(
      calc(100% - var(--img-size)) 100%,
      100% 100%,
      100% 0%,
      calc(100% - var(--img-size)) 0
    );
    opacity: 0;
    cursor: pointer;
  }
}
.summary {
  margin-right: 1em;
  flex-shrink: 0;
}
@media (max-width: 65rem) {
  .summary ::v-deep .project-summary-item span {
    display: block;
  }
}
.el-dropdown {
  margin: 0 10px;
}
.upload-file-form {
  .el-select {
    width: 100%;
  }
  .el-upload__tip {
    line-height: 20px;
    color: #999;
  }
}

::v-deep .reparse-dropdown {
  margin-top: 5px;
}
</style>
