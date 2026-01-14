<template>
  <div class="answer-content" ref="answerContent">
    <section v-for="(item, index) in answer" :key="index">
      <div class="section-item">
        <div class="section-item-header">
          <h4 class="section-item-title">{{ item[0].name }}</h4>
          <div class="section-item-header-options">
            <span :class="[item[0].fill_status === 0 ? '' : 'success']">{{
              item[0].fill_status === ANSWER_STATUS.UNCONFIRMED
                ? '待核对'
                : '已核对'
            }}</span>
            <el-button type="primary" size="mini" @click="saveAnswer(index)">
              保存
            </el-button>
          </div>
        </div>
        <div class="section-item-content">
          <div class="table-wrapper">
            <table>
              <tr v-for="(tr, trIndex) in item[1]" :key="trIndex">
                <template v-if="!Array.isArray(tr[1])">
                  <td v-for="(td, tdIndex) in tr" :key="tdIndex">
                    <div v-if="tdIndex === 0" class="key">{{ td }}</div>
                    <template v-if="tdIndex === 1">
                      <data-sheet-value-cell
                        :cell-key="tr[0]"
                        :cell-data="td"
                        :cell-key-path="[index, 1, trIndex, 1]"
                        :selected-cell-key-path="selectedCellKeyPath"
                        @answer-item-selected="answerItemSelected"
                        @save-editing-answer="saveEditingAnswer"
                        @clear-answer-text="
                          clearAnswerText
                        "></data-sheet-value-cell>
                    </template>
                  </td>
                </template>
                <template v-else>
                  <td colspan="2">
                    <div v-if="tr[0].name" class="title">{{ tr[0].name }}</div>
                    <table>
                      <template v-if="tr[0].mode === 'vertical'">
                        <tr
                          v-for="(subTr, subTrIndex) in tr[1][0]"
                          :key="subTrIndex">
                          <td v-for="(td, tdIndex) in subTr" :key="tdIndex">
                            <div v-if="tdIndex === 0" class="key">{{ td }}</div>
                            <template v-if="tdIndex === 1">
                              <data-sheet-value-cell
                                :cell-key="subTr[0]"
                                :cell-data="td"
                                :cell-key-path="[
                                  index,
                                  1,
                                  trIndex,
                                  1,
                                  0,
                                  subTrIndex,
                                  tdIndex,
                                ]"
                                :selected-cell-key-path="selectedCellKeyPath"
                                @answer-item-selected="answerItemSelected"
                                @save-editing-answer="saveEditingAnswer"
                                @clear-answer-text="
                                  clearAnswerText
                                "></data-sheet-value-cell>
                            </template>
                          </td>
                        </tr>
                      </template>
                      <template v-if="tr[0].mode === 'horizontal'">
                        <tr>
                          <td v-for="(td, tdIndex) in tr[1][0]" :key="tdIndex">
                            <div class="key">
                              {{ td[0] }}
                              <el-tooltip
                                v-if="shouldShowWarningTips(td[0])"
                                effect="dark"
                                content="该处信息存在单位换算，请确认内容是否正确"
                                placement="top">
                                <i class="el-icon-warning"></i>
                              </el-tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr
                          v-for="(subTr, subTrIndex) in tr[1]"
                          :key="subTrIndex">
                          <td v-for="(td, tdIndex) in subTr" :key="tdIndex">
                            <data-sheet-value-cell
                              :cell-key="td[0]"
                              :cell-data="td[1]"
                              :cell-key-path="[
                                index,
                                1,
                                trIndex,
                                1,
                                subTrIndex,
                                tdIndex,
                                1,
                              ]"
                              :selected-cell-key-path="selectedCellKeyPath"
                              @answer-item-selected="answerItemSelected"
                              @save-editing-answer="saveEditingAnswer"
                              @clear-answer-text="
                                clearAnswerText
                              "></data-sheet-value-cell>
                          </td>
                        </tr>
                      </template>
                      <template v-if="tr[0].mode === 'new_debtor'">
                        <template v-for="(subTr, subTrIndex) in tr[1]">
                          <tr v-if="!Array.isArray(subTr[1])" :key="subTrIndex">
                            <td
                              v-for="(td, tdIndex) in subTr"
                              :key="tdIndex"
                              :colspan="tdIndex === 0 ? 2 : 0">
                              <div v-if="tdIndex === 0" class="key">
                                {{ td }}
                              </div>
                              <template v-if="tdIndex === 1">
                                <data-sheet-value-cell
                                  :cell-key="subTr[0]"
                                  :cell-data="td"
                                  :cell-key-path="[
                                    index,
                                    1,
                                    trIndex,
                                    1,
                                    subTrIndex,
                                    tdIndex,
                                  ]"
                                  :selected-cell-key-path="selectedCellKeyPath"
                                  @answer-item-selected="answerItemSelected"
                                  @save-editing-answer="saveEditingAnswer"
                                  @clear-answer-text="
                                    clearAnswerText
                                  "></data-sheet-value-cell>
                              </template>
                            </td>
                          </tr>
                          <tr
                            v-else
                            v-for="(cellTr, cellTrIndex) in subTr[1]"
                            :key="`${subTrIndex}_${cellTrIndex}`"
                            class="new-debtor">
                            <td v-if="cellTrIndex === 0" rowspan="6">
                              <div class="key">{{ subTr[0] }}</div>
                            </td>
                            <td>
                              <div class="key">{{ cellTr[0] }}</div>
                            </td>
                            <td>
                              <data-sheet-value-cell
                                :cell-key="cellTr[0]"
                                :cell-data="cellTr[1]"
                                :cell-key-path="[
                                  index,
                                  1,
                                  trIndex,
                                  1,
                                  subTrIndex,
                                  1,
                                  cellTrIndex,
                                  1,
                                ]"
                                :selected-cell-key-path="selectedCellKeyPath"
                                @answer-item-selected="answerItemSelected"
                                @save-editing-answer="saveEditingAnswer"
                                @clear-answer-text="
                                  clearAnswerText
                                "></data-sheet-value-cell>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </table>
                    <div
                      v-if="
                        tr[0].mode === 'horizontal' && tr[0].allow_clone_row
                      "
                      class="btns">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="增加组"
                        placement="top">
                        <el-button
                          type="primary"
                          size="mini"
                          round
                          icon="el-icon-plus"
                          @click="
                            addAnswerItemGroup([index, 1, trIndex])
                          "></el-button>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除组"
                        placement="top">
                        <el-button
                          v-if="tr[1].length > 1"
                          type="danger"
                          size="mini"
                          round
                          icon="el-icon-minus"
                          @click="
                            removeAnswerItemGroup([index, 1, trIndex])
                          "></el-button>
                      </el-tooltip>
                    </div>
                  </td>
                </template>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import DataSheetValueCell from './DataSheetValueCell';
import answerTableMixin from '../mixins/answerTableMixin';

export default {
  name: 'data-sheet',
  mixins: [answerTableMixin],
  components: { DataSheetValueCell },
  props: {
    answer: {
      type: Array,
      required: true,
    },
  },
  methods: {
    shouldShowWarningTips(key) {
      const keys = ['基础资产剩余期限分布（月）', '基础资产账期分布（月）'];
      return keys.includes(key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../szse/styles/szse-ipo.common.scss';
.answer-content {
  .section-item-content {
    flex-flow: column;
    table {
      td {
        &:has(.key) {
          background-color: #f9f9f9;
        }
        &:has(.value) {
          background-color: #fff;
        }
        &:has(.value.active) {
          background-color: #e1efff;
        }
        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 20px;
          padding: 8px 10px;
          box-sizing: border-box;
          &.title {
            display: block;
            text-align: center;
            font-weight: bold;
          }
          &.key {
            box-sizing: border-box;
            .el-icon-warning {
              color: #ffa600;
            }
          }
          &.btns {
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
