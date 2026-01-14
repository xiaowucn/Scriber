<template>
  <div class="answer-content" ref="answerContent">
    <section v-if="answerTable.rows.length > 0">
      <div class="section-item">
        <div class="section-item-header">
          <div class="section-item-header-options">
            <span :class="answerTable.fill_status === 0 ? '' : 'success'">
              {{
                answerTable.fill_status === ANSWER_STATUS.UNCONFIRMED
                  ? '待核对'
                  : '已核对'
              }}
            </span>
            <el-button type="primary" size="mini" @click="saveAnswer">
              保存
            </el-button>
          </div>
        </div>
        <div class="section-item-content">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th
                    v-for="(th, thIndex) in answerTable.headers"
                    :key="thIndex">
                    {{ th }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tr, trIndex) in answerTable.rows" :key="trIndex">
                  <td v-for="(td, tdIndex) in tr" :key="tdIndex">
                    <data-sheet-value-cell
                      edit-mode="popover"
                      :cell-key="answerTable.headers[tdIndex]"
                      :cell-data="td"
                      :cell-key-path="['pages', page, 'rows', trIndex, tdIndex]"
                      :selected-cell-key-path="selectedCellKeyPath"
                      @answer-item-selected="answerItemSelected"
                      @save-editing-answer="saveEditingAnswer"
                      @clear-answer-text="clearAnswerText">
                    </data-sheet-value-cell>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    <el-empty v-else description="当前页无数据"></el-empty>
  </div>
</template>

<script>
import DataSheetValueCell from './DataSheetValueCell';
import answerTableMixin from '../mixins/answerTableMixin';

export default {
  name: 'data-sheet2',
  mixins: [answerTableMixin],
  components: { DataSheetValueCell },
  props: {
    answer: {
      type: Object,
      required: true,
    },
  },
  computed: {
    page() {
      const pages = Object.keys(this.answer.pages);
      return Number(pages[0]) || 0;
    },
    answerTable() {
      if (this.answer.pages[this.page]) {
        return {
          fill_status: this.answer.pages[this.page].fill_status,
          headers: this.answer.headers,
          rows: this.answer.pages[this.page].rows,
        };
      }
      return {
        fill_status: 0,
        headers: [],
        rows: [],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../szse/styles/szse-ipo.common.scss';
.answer-content {
  .section-item-header {
    justify-content: flex-end;
  }
  .section-item-content {
    .table-wrapper {
      table {
        thead {
          position: sticky;
          top: 42px;
        }
        tr {
          th {
            font-weight: normal;
            background-color: #f9f9f9;
          }
          td {
            height: 0;
            padding: 3px;
            color: #555;
            &:has(.value.active) {
              background-color: #e1efff;
            }
            .value {
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .el-empty {
    height: calc(100vh - 55px);
  }
}
</style>
