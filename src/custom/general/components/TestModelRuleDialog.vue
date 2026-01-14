<template>
  <el-dialog
    title="测试"
    width="600px"
    :visible="true"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="closeDialog">
    <div>
      <el-form
        ref="form"
        class="test-rule-form"
        :model="form"
        label-width="0"
        label-position="left">
        <!-- 测试类型选择 -->
        <div class="test-type-section">
          <el-form-item label="">
            <div class="test-type-select">
              <el-select
                v-model="testType"
                size="small"
                placeholder="请选择测试类型"
                style="width: 110px"
                :disabled="testLoading">
                <el-option label="选择文档" value="选择文档"></el-option>
                <el-option label="输入片段" value="输入片段"></el-option>
              </el-select>
              <svg-font-icon
                class="test-icon"
                name="test-law"
                :size="32"
                color="#3673F3"
                @click="handleTest"
                :style="{
                  opacity: testLoading ? 0.5 : 1,
                  cursor: testLoading ? 'not-allowed' : 'pointer',
                }"
                :disabled="testLoading"></svg-font-icon>
              <!-- 提示文案 -->
              <div class="tip-text">
                {{
                  testType === '选择文档'
                    ? '选择文档后，系统会自动提取法规对应的相关片段'
                    : '输入片段后，系统会对该片段进行审核'
                }}
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- 文档选择或片段输入 -->
        <div class="content-section">
          <!-- 选择文档 -->
          <el-form-item v-if="testType === '选择文档'" label="">
            <el-select
              v-model="form.chatdoc_unique"
              clearable
              size="small"
              placeholder="请选择一份解析完成的文档"
              style="width: 100%"
              :disabled="testLoading">
              <el-option
                v-for="item in documentList"
                :key="item.id"
                :value="item.chatdoc_unique"
                :label="item.name"></el-option>
            </el-select>
          </el-form-item>

          <!-- 输入片段 -->
          <el-form-item v-else label="">
            <el-input
              v-model="form.snippet"
              type="textarea"
              :rows="4"
              resize="vertical"
              size="small"
              placeholder="请输入要测试的片段内容"
              style="width: 100%"
              :disabled="testLoading">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="test-result-container">
        <div class="test-result">测试结果</div>
        <template v-if="testResult || testLoading">
          <div class="result-list">
            <div class="result-item">
              <div class="result-label">法规原文</div>
              <el-input
                type="textarea"
                :rows="4"
                :value="
                  testLoading ? '系统处理中...' : testRuleInfo.rule_content
                "
                class="result-content">
              </el-input>
            </div>

            <div v-if="!isConsistencyCheckMode" class="result-item">
              <div class="result-label">合同片段</div>
              <el-input
                type="textarea"
                :rows="3"
                readonly
                :value="
                  testLoading ? '系统处理中...' : testResult.contract_rects
                "
                class="result-content">
              </el-input>
            </div>
            <div class="result-item">
              <div class="result-label">是否合规</div>
              <el-input
                type="textarea"
                :rows="1"
                readonly
                resize="none"
                :value="
                  testLoading ? '系统处理中...' : testResult.compliance_status
                "
                class="result-content">
              </el-input>
            </div>
            <div class="result-item">
              <div class="result-label">判定依据</div>
              <div v-if="isConsistencyCheckMode" class="result-content">
                <el-input
                  v-if="testLoading"
                  type="textarea"
                  :rows="3"
                  readonly
                  value="系统处理中..."
                  class="result-content">
                </el-input>
                <ul v-else class="failure-reason-list">
                  <li
                    v-for="(reason, reasonIndex) in testResult.reasons"
                    :key="reasonIndex">
                    <span>{{ reason.reason_text }}</span>
                    <el-button
                      type="text"
                      v-if="reason.diff"
                      @click.stop="openDiffDialog(reason)"
                      >详情</el-button
                    >
                  </li>
                </ul>
              </div>
              <el-input
                v-else
                type="textarea"
                :rows="1"
                readonly
                :value="
                  testLoading ? '系统处理中...' : testResult.judgment_basis
                "
                class="result-content">
              </el-input>
            </div>
            <div class="result-item">
              <div class="result-label">修改意见</div>
              <el-input
                type="textarea"
                :rows="3"
                readonly
                :value="testLoading ? '系统处理中...' : testResult.suggestion"
                class="result-content">
              </el-input>
            </div>
          </div>
        </template>
        <div class="empty" v-else>
          <p>请在上方选择文档</p>
          <p>文档选择完成后，请点击开始测试</p>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog" size="small">
        关闭
      </el-button>
    </div>

    <!-- 差异对话框 -->
    <show-diff-dialog
      :visible="isShowDiffDialog"
      :diff-text="diffText"
      :base-title="baseTitle"
      :diff-title="diffTitle"
      :law-source="lawSource"
      @close="closeDiffDialog">
    </show-diff-dialog>
  </el-dialog>
</template>
<script>
import { laws as lawsApi } from '@/store/api';
import ShowDiffDialog from '@/components/ShowDiffDialog.vue';

export default {
  name: 'test-rule-dialog',
  components: {
    ShowDiffDialog,
  },
  props: {
    documentList: {
      type: Array,
      default: () => [],
    },
    id: {
      type: Number,
      required: true,
    },
    testRuleInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      testType: '选择文档', // 选择文档或输入片段
      form: {
        chatdoc_unique: '',
        snippet: '', // 输入的片段内容
      },
      testResult: null,
      testLoading: false,
      abortController: null,
      isShowDiffDialog: false,
      diffText: [],
      baseTitle: '',
      diffTitle: '',
      lawSource: '',
    };
  },
  computed: {
    /**
     * 判断是否为一致性检查模式
     * 条件：check_method === null 且 templates 是有值的对象
     */
    isConsistencyCheckMode() {
      const { check_method, templates } = this.testRuleInfo;
      return (
        check_method === null &&
        templates &&
        typeof templates === 'object' &&
        Object.keys(templates).length > 0
      );
    },
  },
  methods: {
    async handleTest() {
      if (this.testLoading) {
        return;
      }

      // 验证输入
      if (this.testType === '选择文档' && !this.form.chatdoc_unique) {
        this.$notify({
          title: '请选择测试文档',
          type: 'warning',
        });
        return;
      }

      if (this.testType === '输入片段' && !this.form.snippet.trim()) {
        this.$notify({
          title: '请输入测试片段',
          type: 'warning',
        });
        return;
      }

      if (this.abortController) {
        this.abortController.abort();
      }

      this.testLoading = true;
      this.abortController = new AbortController();

      try {
        const {
          rule_content,
          name,
          subject,
          check_type,
          core,
          check_method,
          templates,
        } = this.testRuleInfo;
        const params = {
          rule_content,
          name,
          subject,
          check_type,
          core,
          check_method,
          templates: check_method ? null : templates,
        };
        if (this.testType === '选择文档') {
          params.chatdoc_unique = this.form.chatdoc_unique;
        } else {
          params.snippet = this.form.snippet.trim(); // todo  字段待定
        }
        const data = await lawsApi.contractAnalysisByCheckPoint(
          this.id,
          params,
          { signal: this.abortController.signal },
        );

        if (!data) {
          return;
        }
        let result = {};
        if (check_method) {
          data.contract_rects = data.contract_rects
            .map((item) => item[0])
            .join('\n');
          result = data;
        } else {
          result = {
            compliance_status: data.is_compliance ? '合规' : '不合规',
            suggestion: data.suggestion,
            reasons: data.reasons,
          };
        }

        this.testResult = result;
      } catch (error) {
        if (error && error.message) {
          this.$notify({
            title: '错误',
            message: error?.message || '请求失败',
            type: 'error',
          });
        }
      } finally {
        this.testLoading = false;
        this.abortController = null;
      }
    },
    closeDialog() {
      this.$emit('close');
    },

    /**
     * 打开差异对话框
     * @param {Object} reason - 包含差异信息的原因对象
     */
    openDiffDialog(reason) {
      this.isShowDiffDialog = true;
      this.diffText = reason.diff;
      this.baseTitle = reason.template.content_title;
      this.diffTitle = '当前合同';
      this.lawSource = reason.source;
    },

    /**
     * 关闭差异对话框
     */
    closeDiffDialog() {
      this.isShowDiffDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.document-select {
  display: flex;
}
.tips {
  line-height: 20px;
  font-size: 12px;
  color: #b14435;
}
.test-result-container {
  position: relative;
  border: 1px solid #e9e5e5;
  border-radius: 6px;
  padding: 20px;
  min-height: 160px;

  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #ccc;
    text-align: center;
  }

  .result-list {
    margin-top: 10px;
  }

  .result-item {
    display: flex;
    margin-bottom: 20px;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .result-label {
    width: 80px;
    flex-shrink: 0;
    font-weight: 500;
    color: #333;
    font-size: 14px;
    line-height: 1.5;
    margin-right: 20px;
  }

  .result-content {
    flex: 1;

    ::v-deep .el-textarea__inner {
      font-size: 14px;
      line-height: 1.5;
      word-break: break-all;
      border-radius: 4px;
      padding: 6px;
      min-height: 21px;
    }
  }
}
.test-result {
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.test-icon {
  cursor: pointer;
  width: 32px;
  margin-left: 20px;
}

.failure-reason-list {
  margin: 0;
  padding: 6px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  min-height: 21px;

  li {
    list-style: none;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-all;

    .el-button--text {
      padding: 0;
      margin-left: 5px;
      font-weight: normal;
      font-size: 13px;
    }
  }
}

/* 测试类型选择样式 */
.test-type-section {
  margin-bottom: 10px;
}

.test-type-select {
  display: flex;
  align-items: center;
  width: 100%;
}

.tip-text {
  margin-left: 50px;
  font-size: 12px;
  color: #909399;
  flex: 1;
  line-height: 1.5;
}

.content-section {
  margin-bottom: 20px;
}
</style>
