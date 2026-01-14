<template>
  <el-dialog
    v-if="!noDiffRules"
    v-loading="loading"
    title=""
    :visible="true"
    :show-close="false"
    width="80%"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    class="check-diff-rules-dialog">
    <div class="title">{{ `《 ${lawName} 》 ` }} 法规更新内容如下</div>
    <div class="tips">请确定对应的审核规则是否需要更新</div>
    <el-table
      :data="formatDiffRules"
      border
      class="law-list-table has-border"
      height="60vh">
      <el-table-column
        prop="type"
        label="变更类型"
        width="180"
        column-key="type"
        align="center"
        :filters="coloumFilters"
        :filter-method="filterHandler">
        <template slot-scope="scope">
          <span>{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="left"
        label="变更前"
        min-width="200"
        header-align="center">
        <template slot-scope="scope">
          <div
            v-for="item in scope.row.left"
            :key="item.id"
            v-html="item.html"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="right"
        label="变更后"
        min-width="200"
        header-align="center">
        <template slot-scope="scope">
          <div
            v-for="item in scope.row.right"
            :key="item.id"
            v-html="item.html"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" header-align="center">
        <template slot-scope="scope">
          <el-radio-group
            class="operations"
            v-model="scope.row.operationStatus">
            <el-radio :label="OPERATION_TYPE.update">更新审核规则</el-radio>
            <el-radio
              :label="OPERATION_TYPE.keep"
              v-if="scope.row.type === 'chars_replace'"
              >保持现有审核规则</el-radio
            >
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancelUpdate" size="small">取消更新</el-button>
      <el-button type="primary" @click="handleUpdateLawRule" size="small">
        更新法规
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    v-else
    v-loading="loading"
    title="法规更新提醒"
    :visible="true"
    width="400px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="handleCancelUpdate">
    <div>已更新完成，法规正文内容没有变化</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleCancelUpdate" size="small">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'check-diff-rules-dialog',
  props: {
    diffRules: {
      type: Array,
      default: () => [],
    },
    lawName: {
      type: String,
      required: true,
    },
  },
  computed: {
    coloumFilters() {
      return _.uniq(_.map(this.diffRules, 'type')).map((item) => {
        return {
          text: this.getDiffText(item),
          value: item,
        };
      });
    },
    noDiffRules() {
      return this.diffRules.length === 0;
    },
  },
  data() {
    return {
      OPERATION_TYPE: {
        update: 0,
        keep: 1,
      },
      formatDiffRules: [],
      loading: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    getDiffText(key) {
      if (key.includes('insert')) {
        return '新增';
      }
      if (key.includes('delete')) {
        return '删除';
      }
      return '变更';
    },
    init() {
      this.formatDiffRules = this.diffRules.map((item) => {
        const formatLeft = item.left.map((data) => {
          const html = this.applyStylesToString(
            data.content,
            data.ranges,
            'color:red;text-decoration: line-through;',
          );
          return {
            html,
            ...data,
          };
        });
        const formatRight = item.right.map((data) => {
          const html = this.applyStylesToString(
            data.content,
            data.ranges,
            'color:#28cf28;',
          );
          return {
            html,
            ...data,
          };
        });

        return {
          type: item.type,
          left: formatLeft,
          right: formatRight,
          operationStatus: 0,
          text: this.getDiffText(item.type),
        };
      });
    },
    applyStylesToString(originalString, indexRanges, style = '') {
      let resultString = '';
      let lastIndex = 0;
      indexRanges.sort((a, b) => a[0] - b[0]);

      for (const range of indexRanges) {
        const startIndex = range[0];
        const endIndex = range[1];

        resultString += originalString.substring(lastIndex, startIndex);

        if (startIndex < endIndex) {
          const styledText = originalString.substring(startIndex, endIndex);
          resultString += `<span style="${style}">${styledText}</span>`;
        }

        lastIndex = Math.max(lastIndex, endIndex);
      }

      resultString += originalString.substring(lastIndex);

      return resultString || '-';
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleCancelUpdate() {
      this.loading = true;
      this.$emit('cancel');
    },
    handleUpdateLawRule() {
      const data = this.formatDiffRules.map((item) => {
        const { left, right, operationStatus } = item;
        if (operationStatus === this.OPERATION_TYPE.keep) {
          if (left.length === 1 && right.length === 1) {
            return [left[0].id, right[0].id];
          } else {
            console.error('格式错误', item);
          }
        }
      });
      this.loading = true;
      this.$emit('update', {
        pairs: data.filter((item) => Array.isArray(item)),
      });
    },
    closeLoading() {
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.operations {
  .el-radio + .el-radio {
    margin-top: 20px;
  }
}
.title {
  font-size: 18px;
  line-height: 24px;
  font-weight: bold;
  text-align: center;
}
.tips {
  font-size: 16px;
  line-height: 40px;
  text-align: right;
}
</style>
<style lang="scss">
.check-diff-rules-dialog {
  .el-dialog__header {
    display: none;
  }
}
</style>
