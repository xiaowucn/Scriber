<template>
  <el-table
    class="file-list-expand-table"
    :empty-text="$t(`message['暂无数据']`)"
    :data="file.questions.filter((q) => q.mold_type !== SCHEMA_TYPE.LLM.value)"
    :row-class-name="getRowClassName"
    @row-click="previewSubQuestion($event, file)">
    <el-table-column
      prop="last_mark_utc"
      align="center"
      :label="$text.fileExpand['修改时间']">
      <template slot-scope="scope">
        {{ scope.row.updated_utc | datetime }}
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$text.fileExpand['Schema名称']">
      <template slot-scope="scope">
        {{ getSchemaName(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t(`message['标注人数']`)">
      <template slot-scope="scope">
        {{ getMarkNums(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="mark_users"
      align="center"
      :label="$t(`message['标注用户']`)">
      <template slot-scope="scope">
        {{ getMarkUsers(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="question_status"
      align="center"
      :label="$t(`message['标注状态']`)">
      <template slot-scope="scope">
        {{ getMarkStatus(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="progress"
      align="center"
      :label="$t(`message['标注进度']`)">
      <template slot-scope="scope">
        {{ getMarkProgress(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column
      v-if="isShowAIModules"
      align="center"
      :show-overflow-tooltip="true"
      :label="$t(`message['AI预测']`)">
      <template slot-scope="scope">
        <span
          :class="[
            scope.row.ai_status === AI_PREDICT_STATUS_MAP.DISABLED
              ? 'model-disabled'
              : '',
          ]">
          <i
            v-if="scope.row.ai_status === AI_PREDICT_STATUS_MAP.FAILED"
            class="el-icon-error"></i>
          <i
            v-if="scope.row.ai_status === AI_PREDICT_STATUS_MAP.FINISHED"
            class="el-icon-success"></i>
          {{ getAIPredictionStatus(scope.row.ai_status) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      width="150"
      align="center"
      :label="$t(`message['操作']`)"
      class-name="operations">
      <template slot-scope="scope">
        <el-row>
          <slot name="options"></slot>
          <template v-if="$isAllowed('remark')">
            <el-tooltip
              v-if="$features.isShowOperationIcon()"
              effect="dark"
              :content="$t(`message['标注']`)"
              placement="top">
              <el-button
                :type="!$platform.isDefaultEnv() ? 'default' : 'text'"
                size="mini"
                circle
                @click.stop="previewSubQuestion(scope.row, file)">
                <theme-icon
                  name="remark"
                  icon-class="el-icon-tickets"></theme-icon>
              </el-button>
            </el-tooltip>
            <el-button
              v-else
              type="text"
              :disabled="remarkButtonDisabled(scope.row)"
              @click.stop="previewSubQuestion(scope.row, file)">
              {{ $t(`message['标注']`) }}
            </el-button>
          </template>
          <el-tooltip effect="dark" content="HKEX tag" placement="top">
            <el-button
              v-if="isHkexTagBtn(scope.row)"
              size="mini"
              class="button-hkex-tag"
              @click.stop="previewHkexFile(scope.row, file)"
              circle>
              <i class="el-icon-edit-outline"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="$t(`message['合规审核']`)"
            placement="top">
            <el-button
              v-if="$platform.isSseEnv() && scope.row.mold"
              size="mini"
              circle
              @click.stop="previewFileByRuleCheck(scope.row)">
              <i class="fa fa-eraser"></i>
            </el-button>
          </el-tooltip>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  questionStatus,
  AI_PREDICT_STATUS_MAP,
  INVALID_SCHEMA_IDS,
  SCHEMA_TYPE,
} from '@/store/constants';
import FileMarkableMixin from './mixins/FileMarkableMixin';

export default {
  name: 'file-list-expand',
  mixins: [FileMarkableMixin],
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      AI_PREDICT_STATUS_MAP,
      SCHEMA_TYPE,
    };
  },
  computed: {
    ...mapGetters('fileModule', ['lastOpendedQuestionId']),

    isShowAIModules() {
      if (this.$platform.isNafmiiEnv()) {
        return false;
      }
      return this.$features.showAIModules();
    },

    remarkButtonDisabled() {
      return (row) => {
        return INVALID_SCHEMA_IDS.includes(row.mold);
      };
    },
  },
  methods: {
    getMarkNums(question) {
      if (this.$features.enableUnlimitAnswerMode()) {
        return '∞';
      }
      const { ai_status, origin_health, health } = question;
      if (!origin_health) {
        return '-';
      }
      if (ai_status === AI_PREDICT_STATUS_MAP.DISABLED) {
        return '-';
      }
      return `${origin_health - health}/${origin_health}`;
    },
    getMarkUsers(question) {
      const { mark_users } = question;
      if (mark_users && mark_users.length > 0) {
        return mark_users.join(', ');
      }
      return '-';
    },
    getMarkStatus(question) {
      if (question.ai_status === AI_PREDICT_STATUS_MAP.DISABLED) {
        return '-';
      }
      const text = questionStatus[question.status];
      return text ? this.$t(`message['${text}']`) : '';
    },
    getMarkProgress(question) {
      return question.progress || '-';
    },
    getAIPredictionStatus(status) {
      let statusText = this.$options.filters.presetAnswerStatus(status);
      return this.$t(`message['${statusText}']`);
    },
    getRowClassName({ row }) {
      const classList = [];
      if (this.$isAllowed('remarkOrInspect')) {
        classList.push('clickable');
      }
      if (this.lastOpendedQuestionId === row.id) {
        classList.push('row-highlight');
      }
      return classList;
    },

    previewSubQuestion(question, file) {
      if (!this.$root.isClick) {
        return;
      }
      this.previewFileByRemark({
        ...file,
        qid: question.id,
        mold: question.mold,
      });
      this.$store.commit('fileModule/SET_SCROLL_TOP', window.scrollY);
      this.$store.commit('fileModule/SET_LAST_OPENED_QUESTION_ID', question.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.file-list-expand-table {
  width: calc(100% - 80px);
  margin: 20px 40px;
  border-right: 1px solid #eceff4;
  font-size: 13px;
  ::v-deep .el-table__header {
    th.el-table__cell {
      background-color: #f3f3f3;
      .cell {
        font-size: 13px;
      }
    }
  }
  ::v-deep .el-table__body {
    td.el-table__cell {
      .cell {
        img {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
.button-hkex-tag {
  background-color: #369aa2;
  border-color: #369aa2;
  color: #fff;
  &:hover {
    opacity: 0.8;
  }
}
</style>
