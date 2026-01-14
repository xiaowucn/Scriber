<template>
  <div class="answer-content" ref="answerContent">
    <section v-for="(item, index) in answer" :key="index">
      <div
        :class="[
          'section-item',
          answerStatus[currentTab][item.name] === ANSWER_STATUS.UNCONFIRMED
            ? 'unconfirmed'
            : '',
        ]">
        <div class="section-item-header">
          <h4 class="section-item-title">{{ item.name }}</h4>
          <div class="section-item-header-options">
            <span
              :class="[
                answerStatus[currentTab][item.name] ===
                ANSWER_STATUS.UNCONFIRMED
                  ? ''
                  : 'success',
              ]">
              {{
                answerStatus[currentTab][item.name] ===
                ANSWER_STATUS.UNCONFIRMED
                  ? '待核对'
                  : '已核对'
              }}
            </span>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="confirmToSaveAnswer(item.name)"
              >保存</el-button
            >
          </div>
        </div>
        <div class="section-item-content">
          <div
            v-for="(orderItem, orderItemIndex) in item.data"
            :key="orderItemIndex"
            class="table-wrapper">
            <table>
              <tr v-for="(subItem, subIndex) in orderItem" :key="subIndex">
                <td
                  v-for="(cell, cellIndex) in subItem.data"
                  :key="cellIndex"
                  :colspan="cell.colspan">
                  <div v-if="!cell.path" class="key">
                    {{ subItem.name || cell.name }}
                  </div>
                  <div
                    v-else
                    class="cells"
                    :class="cell.path === currentAnswerKeyPath ? 'active' : ''">
                    <div
                      class="value"
                      :class="cell.manual ? 'manual' : ''"
                      @click="
                        answerItemSelected(cell.name, cell.path, item.name)
                      ">
                      <span>
                        {{ cell.text }}
                      </span>
                      <div
                        v-if="isEditing && cell.path === currentAnswerKeyPath"
                        class="edit-input">
                        <el-input
                          v-model="editingText"
                          size="mini"
                          ref="editInput"
                          @click.stop.native></el-input>
                        <el-button size="mini" @click.stop="isEditing = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          size="mini"
                          @click.stop="saveEditingAnswer"
                          >保存</el-button
                        >
                      </div>
                      <div class="operate-btns">
                        <i
                          v-if="shouldShowNextCellIcon(cell.path)"
                          class="el-icon-caret-right"
                          title="计算数据，查看下一处定位"
                          @click.stop="showNextCellWidget"></i>
                        <i
                          class="el-icon-edit"
                          title="编辑"
                          @click.stop="editAnswerText(cell.path)"></i>
                        <i
                          class="el-icon-delete"
                          title="删除"
                          @click.stop="clearAnswerText(cell.path)"></i>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash';
import answerTableMixin from '../../mixins/answerTableMixin';

export default {
  name: 'contact-details',
  mixins: [answerTableMixin],
  props: {
    originAnswer: {
      type: Object,
      required: true,
    },
    answerStatus: {
      type: Object,
      required: true,
    },
    currentTab: {
      type: String,
      required: true,
    },
    currentAnswerKeyPath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      editingText: '',
      originSchema: [
        {
          name: '发行人',
          orders: [
            [
              ['注册地址', '公司网址'],
              ['通讯地址', '邮编'],
              '董事长',
              '总经理',
              '董秘',
              '其他',
            ],
          ],
        },
        {
          name: '保荐机构',
          orders: [
            [
              ['保荐机构一名称', '统一社会信用代码'],
              '保荐业务负责人',
              '保荐代表人A',
              '保荐代表人B',
              '项目协办人',
            ],
            [
              ['保荐机构二名称', '统一社会信用代码'],
              '保荐业务负责人',
              '保荐代表人A',
              '保荐代表人B',
              '项目协办人',
            ],
            [
              ['保荐机构三名称', '统一社会信用代码'],
              '保荐业务负责人',
              '保荐代表人A',
              '保荐代表人B',
              '项目协办人',
            ],
          ],
        },
        {
          name: '会计师事务所',
          orders: [
            [
              ['会计师事务所名称', '统一社会信用代码'],
              '会计师事务所负责人',
              '签字会计师A',
              '签字会计师B',
              '签字会计师C',
            ],
          ],
        },
        {
          name: '律师事务所',
          orders: [
            [
              ['律师事务所名称', '统一社会信用代码'],
              '律师事务所负责人',
              '签字律师A',
              '签字律师B',
              '签字律师C',
            ],
          ],
        },
        {
          name: '资产评估机构',
          orders: [
            [
              ['资产评估机构一', '统一社会信用代码'],
              '评估事务所负责人',
              '签字评估师A',
              '签字评估师B',
              '签字评估师C',
            ],
            [
              ['资产评估机构二', '统一社会信用代码'],
              '评估事务所负责人',
              '签字评估师A',
              '签字评估师B',
              '签字评估师C',
            ],
          ],
        },
      ],
      tableThNames: [
        '职务',
        '姓名',
        '身份证号/护照号',
        '办公电话',
        '传真',
        'EMAIL地址',
        '手机',
      ],
    };
  },
  computed: {
    answer() {
      const originAnswer = _.cloneDeep(this.originAnswer[this.currentTab]);
      const newAnswer = [];

      originAnswer.forEach((item, index) => {
        this.originSchema.forEach((schema, schemaIndex) => {
          newAnswer.push({
            name: schema.name,
            data: [],
          });

          schema.orders.forEach((orderItem, orderItemIndex) => {
            const trs = [];

            let hasInsertThToTrs = false;

            orderItem.forEach((order) => {
              const ths = {
                data: [],
              };

              if (Array.isArray(order)) {
                let ansItem = {
                  data: [],
                };
                order.forEach((key, keyIndex) => {
                  const cellKey = {
                    name: key,
                  };
                  const data = item[schema.name][orderItemIndex]
                    ? item[schema.name][orderItemIndex][key]
                    : {};
                  const value = {
                    name: key,
                    ...data,
                    path: `['${this.currentTab}'][${index}]['${schema.name}'][${orderItemIndex}]['${key}']`,
                    colspan: keyIndex === 0 ? 3 : 2,
                  };
                  ansItem.data.push(cellKey);
                  ansItem.data.push(value);
                });
                trs.push(ansItem);
              }

              if (!Array.isArray(order)) {
                const ansItem = {
                  name: order,
                  data: item[schema.name][orderItemIndex]
                    ? item[schema.name][orderItemIndex][order]
                    : {},
                };
                let subData = [];
                this.tableThNames.forEach((th, thIndex) => {
                  const thName = {
                    name: th,
                  };
                  ths.data.push(thName);
                  if (!hasInsertThToTrs) {
                    trs.push(ths);
                  }
                  hasInsertThToTrs = true;
                  if (!ansItem.data) {
                    ansItem.data = {};
                  }
                  if (!ansItem.data[th]) {
                    ansItem.data[th] = {};
                  }
                  ansItem.data[th].name = th;
                  if (thIndex > 0) {
                    ansItem.data[th].path =
                      `['${this.currentTab}'][${index}]['${schema.name}'][${orderItemIndex}]['${order}']['${th}']`;
                  }
                  subData.push(ansItem.data[th]);
                });

                ansItem.data = subData;
                trs.push(ansItem);
              }
            });
            newAnswer[schemaIndex].data.push(trs);
          });
        });
      });

      return newAnswer;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/szse-ipo.common.scss';

.answer-content {
  .section-item-content {
    flex-flow: column;
    .table-wrapper {
      border-bottom: none;
    }
    table {
      tr {
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: none;
        }
        td {
          .key {
            padding: 8px 10px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
