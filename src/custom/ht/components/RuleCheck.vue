<template>
  <div class="container">
    <div class="rule-container">
      <div class="select-rule">
        <span>规则选择：</span>
        <el-select
          v-model="rule"
          size="mini"
          placeholder="请选择规则"
          @change="selectChange">
          <el-option label="全部规则" value="all">全部规则</el-option>
          <el-option
            v-for="(item, index) in fileRules"
            :key="index"
            :label="item"
            :value="item"></el-option>
        </el-select>
        <el-checkbox @change="setFilterRuleOptions"> 仅显示错误 </el-checkbox>
      </div>
      <ul class="rule-result-list">
        <li v-for="(item, index) in ruleList" :key="index">
          <h4>{{ item.name }}</h4>
          <div
            v-for="(item, idx) in item.rules"
            :key="idx"
            :class="[
              'rule-item',
              item.selected ? 'selected' : '',
              item.result === 1 ? 'is-wrong' : '',
            ]"
            @click="ruleItemClick(item)">
            <h5>{{ item.second_rule }}</h5>
            <div class="options">
              <div :class="[item.result === 0 ? 'right' : 'wrong']">
                <i
                  :class="[
                    'fa',
                    item.result === 0 ? 'fa-check-circle' : 'fa-times-circle',
                  ]"></i>
                <div v-if="item.detail.comment_detail" class="comment">
                  <p
                    v-for="(comment, index) in item.detail.comment_detail"
                    :key="index"
                    v-html="comment"
                    @click.stop="ruleItemClick(item, index)"></p>
                </div>
                <div v-else-if="item.comment">
                  <div
                    v-if="!showLabelInfo(item.detail.label_info)"
                    class="comment">
                    <p
                      v-for="(text, index) in convertStrToJSON(item.comment)"
                      :key="index"
                      v-html="text"></p>
                  </div>
                  <div v-else class="label-info">
                    <div
                      v-for="(itm, idx) in convertStrToJSON(
                        item.detail.label_info,
                      )"
                      :key="idx">
                      {{ itm }}
                      <template v-if="itm.includes('与模板有差异')">
                        <div
                          v-if="
                            item.detail[getTemplateDiffName(itm)].add.length > 0
                          "
                          class="template-diff">
                          <span>增加：</span>
                          <div>
                            <p
                              v-for="(itm, idx) in item.detail[
                                getTemplateDiffName(itm)
                              ].add"
                              :key="idx">
                              {{ idx + 1 }}.{{ itm }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="
                            item.detail[getTemplateDiffName(itm)].delete
                              .length > 0
                          "
                          class="template-diff">
                          <span>删除：</span>
                          <div>
                            <p
                              v-for="(itm, idx) in item.detail[
                                getTemplateDiffName(itm)
                              ].delete"
                              :key="idx">
                              {{ idx + 1 }}.{{ itm }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="
                            item.detail[getTemplateDiffName(itm)].modify
                              .length > 0
                          "
                          class="template-diff">
                          <span>修改：</span>
                          <div>
                            <p
                              v-for="(itm, idx) in item.detail[
                                getTemplateDiffName(itm)
                              ].modify"
                              :key="idx">
                              {{ idx + 1 }}.{{ itm }}
                            </p>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <el-button
                  v-if="item.detail.diff_result && item.result === 1"
                  type="text"
                  class="btn-diff-text"
                  @click="openTextsDiffDialog(item)">
                  条款比对详情
                </el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  size="mini"
                  class="annotation"
                  :disabled="fileViewer.currentFileIsReadonly"
                  @click="updateRuleStatus(item)">
                  <template v-if="item.audit_status === 1">
                    <i class="fa fa-undo"></i> 撤销批注
                  </template>
                  <template v-else>
                    <i class="fa fa-pencil"></i> 批注
                  </template>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="error"
                  :disabled="fileViewer.currentFileIsReadonly"
                  @click="reportError(item)">
                  <i class="fa fa-warning"></i>
                  {{ item.error_content ? '已报错' : '报错' }}
                </el-button>
              </div>
            </div>
            <div v-if="item.detail.text_diff" class="text">
              <div v-if="item.detail.text_diff.add.length > 0">
                <span>增加:</span>
                <div>
                  <p v-for="(itm, idx) in item.detail.text_diff.add" :key="idx">
                    {{ idx + 1 }}.{{ itm }}
                  </p>
                </div>
              </div>
              <div v-if="item.detail.text_diff.delete.length > 0">
                <span>删除:</span>
                <div>
                  <p
                    v-for="(itm, idx) in item.detail.text_diff.delete"
                    :key="idx">
                    {{ idx + 1 }}.{{ itm }}
                  </p>
                </div>
              </div>
              <div v-if="item.detail.text_diff.modify.length > 0">
                <span>修改:</span>
                <div>
                  <p
                    v-for="(itm, idx) in item.detail.text_diff.modify"
                    :key="idx">
                    {{ idx + 1 }}.{{ itm }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      title="报错"
      width="600px"
      :visible.sync="errorDialogVisible"
      :close-on-click-modal="false"
      @close="closeErrorDialog">
      <el-form
        :model="errorForm"
        :rules="rules"
        ref="errorForm"
        label-width="80px">
        <el-form-item label="报错信息" prop="message">
          <el-input
            type="textarea"
            rows="5"
            placeholder="若能输入错误描述，将有助于找到原因"
            v-model="errorForm.message"
            autocomplete="off"
            :disabled="fileViewer.currentFileIsReadonly"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="fileViewer.currentFileIsReadonly"
          @click="sendErrorMessage"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="`${textsDiffDialogTitle}：条款比对详情`"
      :visible.sync="textsDiffDialogVisible"
      width="70%"
      :close-on-click-modal="false"
      @close="closeTextsDiffDialog">
      <div class="text-diff-container">
        <div class="base">
          <h4>合同模板</h4>
          <p
            v-for="(paragraph, paragraphIndex) in textsDiff.texts_base"
            :key="paragraphIndex">
            {{ paragraph }}
          </p>
        </div>
        <div class="diff">
          <h4>当前合同</h4>
          <p
            class="paragraph-item"
            v-for="(paragraph, paragraphIndex) in textsDiff.texts_diff"
            :key="paragraphIndex">
            <span
              v-for="(item, index) in paragraph"
              :key="index"
              :class="item.diff">
              {{ item.text }}
            </span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';

export default {
  name: 'rule-check',
  data() {
    return {
      rule: 'all',
      ruleList: [],
      isAnswerItemSelected: false,
      errorDialogVisible: false,
      errorForm: {
        message: '',
      },
      rules: {
        message: [
          { required: true, message: '请输入报错信息', trigger: 'blur' },
        ],
      },
      fid: null,
      ruleResultId: null,
      textsDiffDialogVisible: false,
      textsDiffDialogTitle: '',
      textsDiff: {},
    };
  },
  computed: {
    ...mapGetters('htModule', ['fileRules', 'fileRuleResult']),
    ...mapGetters('detailModule', ['fileViewer']),
  },
  watch: {
    fileRuleResult() {
      this.ruleList = _.cloneDeep(this.fileRuleResult);
    },
  },
  created() {
    EventBus.$on('answer-item-selected', this.answerItemSelected);
    this.fetchFileRuleResult();
  },
  beforeDestroy() {
    EventBus.$off('answer-item-selected', this.answerItemSelected);
    this.$store.commit('htModule/SET_SELECTED_RULE_NAME', 'all');
    this.$store.commit('htModule/SET_FILE_RULE_RESULT_FILTER_OPTIONS', false);
  },
  methods: {
    async fetchFileRuleResult() {
      try {
        const { fileId, schemaId } = this.$route.query;
        await this.$store.dispatch('htModule/fetchFileRuleResult', {
          fileId,
          schemaId,
        });
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    selectChange(key) {
      if (key == 'all') {
        this.ruleList = _.cloneDeep(this.fileRuleResult);
      } else {
        const rules = _.cloneDeep(this.fileRuleResult);
        this.ruleList = rules.filter((rule) => rule.name === key);
      }
      this.$store.commit('htModule/SET_SELECTED_RULE_NAME', key);
    },
    async answerItemSelected({ schemaNode }) {
      for (let i = 0; i < this.ruleList.length; i++) {
        const rules = this.ruleList[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            const schemas = [];
            rule.schema_cols.forEach((schema) => {
              schemas.push(schema.replace(/\s+/g, ''));
            });
            const schema = schemas.find((schema) => schema === schemaNode);
            this.$set(rule, 'selected', false);
            if (schema) {
              this.$set(rule, 'selected', true);
            }
          }
        }
      }
      await this.$nextTick();
      this.scrollIntoView();
    },
    scrollIntoView() {
      const ruleItemDom = document.querySelector(
        '.rule-result-list > li .selected',
      );
      if (ruleItemDom) {
        ruleItemDom.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    },
    ruleItemClick(ruleItem, index) {
      for (let i = 0; i < this.ruleList.length; i++) {
        const rules = this.ruleList[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            this.$set(rule, 'selected', false);
            if (ruleItem.id === rule.id) {
              this.$set(rule, 'selected', true);
            }
          }
        }
      }
      EventBus.$emit('rule-item-selected', { ruleItem, index });
    },
    async updateRuleStatus(item) {
      try {
        const data = {
          status: 1,
        };
        let successTips = '批注成功';
        if (item.audit_status === 1) {
          data.status = 2;
          successTips = '撤销批注成功';
        }
        await this.$store.dispatch('htModule/updateRuleStatus', {
          ruleResultId: item.id,
          data,
        });
        this.$notify({
          title: this.$t(`message['成功']`),
          message: successTips,
          type: 'success',
        });
        this.fetchFileRuleResult();
      } catch (err) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: err.message,
          type: 'error',
        });
      }
    },
    reportError(item) {
      this.errorDialogVisible = true;
      this.errorForm.message = '';
      this.fid = item.fid;
      this.ruleResultId = item.id;
      this.errorForm.message = item.error_content;
    },
    closeErrorDialog() {
      this.$refs.errorForm.clearValidate();
    },
    async sendErrorMessage() {
      const valid = await this.$refs.errorForm.validate();
      if (valid) {
        await this.$store.dispatch('htModule/reportError', {
          fid: this.fid,
          rule_result_id: this.ruleResultId,
          content: this.errorForm.message,
        });
        this.errorDialogVisible = false;
        this.$notify({
          title: '成功',
          message: '报错成功',
          type: 'success',
        });
        this.fetchFileRuleResult();
      } else {
        return false;
      }
    },
    setFilterRuleOptions(value) {
      this.$store.commit('htModule/SET_FILE_RULE_RESULT_FILTER_OPTIONS', value);
    },
    showLabelInfo(info) {
      const labelInfo = this.convertStrToJSON(info);
      if (labelInfo.some((item) => item.includes('与模板有差异'))) {
        return true;
      }
      return false;
    },
    getTemplateDiffName(info) {
      console.log(info.split('：')[1]);
      return info.split('：')[1];
    },
    convertStrToJSON(str) {
      if (str === undefined) {
        return [];
      }
      try {
        return JSON.parse(str);
      } catch (error) {
        return [str];
      }
    },
    openTextsDiffDialog(item) {
      this.textsDiffDialogVisible = true;
      this.textsDiffDialogTitle = item.second_rule;
      const { patterns, diff_result } = item.detail;
      this.textsDiff = {
        texts_base: patterns,
        texts_diff: diff_result,
      };
    },
    closeTextsDiffDialog() {
      this.textsDiffDialogVisible = false;
      this.textsDiffDialogTitle = '';
      this.textsDiff = {
        texts_base: [],
        texts_diff: [],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding: 10px 0;
  overflow: hidden;
  .rule-container {
    height: 100%;
    overflow: auto;
    padding: 0 15px;
  }
  .select-rule {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    background: #fff;
    .el-select {
      flex: 1;
      margin-right: 10px;
    }
    ::v-deep .el-checkbox__label {
      padding-left: 5px;
    }
  }
  .rule-result-list {
    li {
      list-style: none;
      h4 {
        margin: 10px 0;
        font-weight: 500;
      }
      .rule-item {
        margin: 10px 0;
        padding: 10px;
        background: #f6f6f6;
        border-radius: 3px;
        border: 1px solid transparent;
        &:hover {
          background: #f1f1f1;
        }
        h5 {
          font-weight: normal;
        }
        &.selected {
          border-color: #67af11;
        }
        &.is-wrong {
          background: #fff4f4;
          &:hover {
            background: #fff0f0;
          }
          &.selected {
            border-color: #f56d6d;
          }
        }
        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 12px;
          .right {
            display: flex;
            align-items: baseline;
            color: #66af10;
            ::v-deep em {
              color: #409eff;
            }
            .comment {
              > p {
                &:hover {
                  cursor: pointer;
                  color: #66af10;
                }
              }
            }
          }
          .wrong {
            display: flex;
            align-items: baseline;
            color: #d22727;
            ::v-deep em {
              color: #d22727;
            }
            .comment {
              > p {
                &:hover {
                  cursor: pointer;
                  color: #d22727;
                }
              }
            }
          }
          .label-info {
            margin-left: 10px;
            > div {
              margin: 10px 0;
              color: #6b6b6b;
              .template-diff {
                display: flex;
                margin-top: 10px;
                padding-left: 85px;
              }
            }
          }
          .comment {
            margin-left: 10px;
            color: #6b6b6b;
            ::v-deep em {
              margin: 0 3px;
              font-style: normal;
              font-weight: bold;
            }
            > p {
              margin: 5px 0;
            }
          }
          .error {
            color: #d22727;
            &:hover {
              color: #ef4545;
            }
            &.is-disabled {
              color: #c0c4cc;
            }
          }
          .btn-diff-text {
            margin-left: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .el-button {
            margin: 0 5px;
          }
        }
        .text {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #ffdede;
          font-size: 12px;
          color: #6b6b6b;
          > div {
            display: flex;
            div {
              flex: 1;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
  .text-diff-container {
    display: flex;
    max-height: 60vh;
    overflow-y: auto;
    line-height: 26px;
    h4 {
      position: sticky;
      top: 0;
      margin-bottom: 10px;
      background: #fff;
      text-align: center;
    }
    .base {
      width: 50%;
      height: 100%;
    }
    .diff {
      width: 50%;
      height: 100%;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid #ccc;
      .lack {
        text-decoration: line-through;
        text-decoration-color: #ff4949;
      }
      .extra {
        color: #14b35b;
        text-decoration: underline;
        text-decoration-color: #14b35b;
      }
    }
  }
}
</style>
