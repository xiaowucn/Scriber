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
        label-width="80px"
        label-position="left">
        <el-form-item label="选择文档">
          <div class="document-select">
            <el-select
              v-model="form.chatdoc_unique"
              collapse-tags
              clearable
              size="small"
              placeholder="请选择一份解析完成的文档"
              style="width: 100%"
              @change="handleChangeDocument">
              <el-option
                v-for="item in documentList"
                :key="item.id"
                :value="item.chatdoc_unique"
                :label="item.name"></el-option>
            </el-select>
            <theme-icon
              class="test-icon"
              name="test-law"
              icon-class="el-icon-edit"
              @click.native.stop="handleTestLawRule"></theme-icon>
          </div>
          <!-- <div class="tips">提示：一次性最多选择 5 份文档进行测试</div> -->
        </el-form-item>
      </el-form>
      <div class="test-result-container">
        <div class="test-result">测试结果</div>
        <template v-if="testResult">
          <div class="test-switch">
            <!-- <i class="el-icon-caret-left"></i> -->
            <div class="test-switch-title">{{ documentTitle }}</div>
            <!-- <i class="el-icon-caret-right"></i> -->
          </div>
          <div class="test-content">
            <div class="test-content-title">提取内容</div>
            <div class="test-content-text" v-text="testResult"></div>
          </div>
        </template>
        <div class="empty" :class="{ loading: testLoading }" v-else>
          {{ testLoading ? '测试中...' : '请在上方选择文档' }}
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog" size="small">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { laws as lawsApi } from '@/store/api';
export default {
  name: 'test-rule-dialog',
  props: {
    documentList: {
      type: Array,
      default: () => [],
    },

    testRuleInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    documentTitle() {
      const document = this.documentList.find(
        (item) => item.chatdoc_unique === this.form.chatdoc_unique,
      );
      return document ? document.name : '';
    },
  },
  data() {
    return {
      form: {
        chatdoc_unique: '',
      },
      testResult: '',
      testLoading: false,
      abortController: null,
    };
  },

  methods: {
    handleChangeDocument() {
      this.testResult = '';
    },
    async handleTestLawRule() {
      if (!this.form.chatdoc_unique) {
        this.$notify({
          title: '请选择测试文档',
          type: 'warning',
        });
      }
      if (this.abortController) {
        this.abortController.abort();
      }

      this.testLoading = true;
      this.abortController = new AbortController();

      try {
        const response = await lawsApi.contractAnalysisByRule(
          this.testRuleInfo.id,
          this.form,
          { signal: this.abortController.signal },
        );

        if (!response) {
          return;
        }

        if (response.contents) {
          this.testResult = response.contents;
        }
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
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
      this.$emit('close');
    },
  },

  beforeDestroy() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
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
.test-rule-form {
  padding: 0 40px;
}
.test-result-container {
  position: relative;
  border: 1px solid #e9e5e5;
  border-radius: 6px;
  padding: 10px 20px;
  min-height: 160px;
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #ccc;
  }
  .loading {
    color: #000;
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
.test-switch {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  font-size: 16px;
  .test-switch-title {
    max-width: 300px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  [class^='el-icon-'] {
    font-size: 24px;
    cursor: pointer;
    color: #225476;
  }
}
.test-content {
  display: flex;
  align-items: center;
  column-gap: 20px;
  .test-content-title {
    flex-shrink: 0;
  }
  .test-content-text {
    border: 1px solid #e9e5e5;
    border-radius: 6px;
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;
    padding: 12px 10px;
    margin-bottom: 20px;
  }
}
.test-icon {
  cursor: pointer;
  width: 32px;
  margin-left: 10px;
}
</style>
