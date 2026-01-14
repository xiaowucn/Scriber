<template>
  <el-dialog
    :visible="schemaNode !== null"
    :title="`正则提取-${schemaNode.data.label}`"
    :before-close="closeDialog"
    :close-on-click-modal="false">
    <div class="abstract-mode">
      <div class="abstract-mode-option">
        <span class="label">提取模式：</span>
        <el-radio-group v-model="method_type" size="small">
          <el-radio-button :label="1">整个段落（单个/多个）</el-radio-button>
          <el-radio-button :label="0">段落内文字</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="method_type === 1" class="abstract-paragraph-num">
        <span>抽取</span>
        <el-input
          v-model="cnt_of_res"
          size="mini"
          placeholder="段落抽取数量"
          @input="
            (val) => {
              cnt_of_res = val.replace(/^0|[\D]/g, '');
            }
          "></el-input>
        <span>个段落</span>
      </div>
      <el-input
        type="textarea"
        :rows="4"
        v-model="regs"
        placeholder="请输入正则表达式代码"></el-input>
      <p class="reg-tip">* 多条正则请通过换行区分，多条之间为“或”的关系</p>
      <p class="reg-tip">
        * 段落内文字，请使用命名分组 tar 标记要提取的目标内容，例如
        甲方\s*([(（].*[）)])?\s*[:：](?P&lt;tar&gt;.*公司)
      </p>
    </div>

    <div class="abstract-limit">
      <div class="abstract-limit-option">
        <el-checkbox v-model="limit">限定位置</el-checkbox>
        <div class="anchor">
          <span>前方第</span>
          <el-input
            :disabled="!limit"
            v-model="cnt_of_anchor_elts"
            size="mini"></el-input>
          <span>个段落满足关键词条件</span>
        </div>
      </div>
      <el-input
        type="textarea"
        :rows="4"
        v-model="anchor_reg"
        :disabled="!limit"
        placeholder="请输入正则表达式代码"></el-input>
      <p class="reg-tip">* 只支持一条正则表达式</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog">取 消</el-button>
      <el-button size="small" type="primary" @click="updateExtractMethod"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import _ from 'lodash';
import { schema as schemaApi } from '@/store/api';

export default {
  name: 'schema-regex-dialog',
  props: {
    schemaNode: { type: Object, require: false, default: null },
    schemaId: {
      type: Number,
      defalut: -1,
    },
  },
  data() {
    return {
      method_type: 1,
      regs: '',
      limit: false,
      cnt_of_anchor_elts: 1,
      anchor_reg: '',
      cnt_of_res: null,
    };
  },
  mounted() {
    this.getExtractMethod();
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    async getExtractMethod() {
      if (this.schemaNode && this.schemaId > -1) {
        try {
          const { data } = await schemaApi.fetchExtractMethod({
            mold: this.schemaId,
            path: this.schemaNode.data.label,
          });

          if (!_.isEmpty(data)) {
            this.method_type = data.method_type;
            this.regs = data.data.regs.join('\n');
            this.anchor_reg = data.data.anchor_reg;
            this.cnt_of_anchor_elts = data.data.cnt_of_anchor_elts;
            this.limit = !!data.data.anchor_reg;
            this.cnt_of_res = data.data.cnt_of_res;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async updateExtractMethod() {
      try {
        const params = {
          mold: this.schemaId,
          path: this.schemaNode.data.label,
          method_type: this.method_type,
          data: {
            regs: this.regs.split('\n'),
            anchor_reg: null,
            cnt_of_anchor_elts: null,
            cnt_of_res: this.method_type === 1 ? Number(this.cnt_of_res) : null,
          },
        };
        if (this.limit) {
          params.data.cnt_of_anchor_elts = this.cnt_of_anchor_elts;
          params.data.anchor_reg = this.anchor_reg;
        }

        await schemaApi.updateExtractMethod(params);

        this.$notify({
          title: '成功',
          message: '正则提取规则更新成功',
          type: 'success',
        });
        this.closeDialog();
      } catch (error) {
        this.$notify({
          title: this.$t(`message['错误']`),
          message: '正则提取规则更新失败',
          type: 'error',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.abstract-mode-option {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 10px;

  .label {
    width: 70px;
  }
}

.abstract-limit {
  margin-top: 30px;
}

.abstract-limit-option {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 10px;

  .anchor {
    flex: 1;
    display: flex;
    flex-flow: row;
    align-items: center;
    margin-left: 10px;

    .el-input {
      margin: 0 10px;
      width: 50px;
    }
  }
}

.abstract-paragraph-num {
  margin: 20px 0;
  .el-input {
    width: 105px;
    margin: 0 10px;
  }
}

.reg-tip {
  margin-top: 10px;
  color: red;
  font-size: 12px;
}
</style>
