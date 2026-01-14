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
          <div v-for="(subItem, subIndex) in item.data" :key="`1-${subIndex}`">
            <table v-if="index === 0" class="table-1">
              <tr v-for="(cell, cellIndex) in subItem.data" :key="cellIndex">
                <td
                  class="cells"
                  :class="cell.path === currentAnswerKeyPath ? 'active' : ''">
                  <span class="key">{{ cell.name }}</span>
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
                </td>
              </tr>
            </table>
          </div>

          <div v-for="(subItem, subIndex) in item.data" :key="`2-${subIndex}`">
            <table v-if="index === 1" class="table-2">
              <tr v-for="(cell, cellIndex) in subItem.data" :key="cellIndex">
                <td
                  v-if="cellIndex === 0"
                  :rowspan="subItem.data.length"
                  class="name">
                  {{ item.name }}
                </td>
                <td class="key">{{ cell.name }}</td>
                <td
                  class="cells"
                  :class="cell.path === currentAnswerKeyPath ? 'active' : ''"
                  @click="answerItemSelected(cell.name, cell.path, item.name)">
                  <div
                    class="value"
                    :class="getAnswerItem(cell.path).manual ? 'manual' : ''">
                    <span>
                      {{ getAnswerItem(cell.path).text }}
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
                </td>
              </tr>
            </table>
          </div>

          <div v-if="index === 2">
            <table class="table-2">
              <tr>
                <th></th>
                <th></th>
                <th v-for="(th, thIndex) in tableThNames" :key="thIndex">
                  {{ th }}
                </th>
              </tr>
              <tr v-for="(subItem, subIndex) in item.data" :key="subIndex">
                <td
                  v-if="subIndex === 0"
                  :rowspan="item.data.length"
                  class="name">
                  {{ item.name }}
                </td>
                <td class="index">
                  {{ subIndex + 1 }}
                </td>
                <td
                  v-for="(cell, cellIndex) in subItem.data"
                  :key="cellIndex"
                  @click="answerItemSelected(cell.name, cell.path, item.name)">
                  <div
                    class="cells"
                    :class="cell.path === currentAnswerKeyPath ? 'active' : ''">
                    <div class="value" :class="cell.manual ? 'manual' : ''">
                      <span>{{ cell.text }}</span>
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

            <div class="btns">
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
                    addAnswerItemGroup(originSchema[index].orders, item)
                  "></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除组"
                placement="top">
                <el-button
                  type="danger"
                  size="mini"
                  round
                  icon="el-icon-minus"
                  @click="removeAnswerItemGroup(item)"></el-button>
              </el-tooltip>
            </div>
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
  name: 'basic-project-data',
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
          name: '发行人信息',
          orders: [
            '申报企业（全称）',
            '申报企业（简称）',
            '申报企业曾用名',
            '公司类型',
            '统一社会信用代码',
            '高新技术企业',
            '证监会行业',
            '证监会行业细分',
            '申万一级行业',
            '申万二级行业',
            '主营业务',
            '公司设立时间',
            '是否发行CDR',
            '是否红筹',
            '是否特殊股权架构',
            '是否存在员工持股计划、股权激励计划',
            '注册地（省市或境外）',
            '注册地（市区县）',
            '辖区证监局',
            '法人代表',
            '实际控制人',
            '实际控制人持股比例（%）',
            '最近一期审计基准日',
            '采用的会计准则',
            '拟发行量（万股）',
            '发行前总股本（万股）',
            '拟发行股数占发行后总股本比例（%）',
            '预计募集资金总额（万元）',
            '预计募集资金净额（万元）',
            '最近一次增资日期',
            '最近一次增资数量（万股）',
            '最近一次增资比例（%）',
            '预计市值（亿元）',
            '上市标准',
            '重要发明专利数量（件）',
          ],
        },
        {
          name: '发行前股本结构（万股）',
          orders: [
            '国有股东持有股份',
            '境内民营机构或自然人持有股份',
            '境外股东持有股份',
            '其他',
            '合计',
          ],
        },
        {
          name: '持股5%以上（含5%）股东信息',
          orders: ['名称', '持股比例', '股东性质'],
        },
      ],
      tableThNames: ['名称', '持股比例', '股东性质'],
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

          item[schema.name].forEach((answer, answerIndex) => {
            const ansItem = {
              data: item[schema.name][answerIndex],
            };
            let subData = [];
            schema.orders.forEach((th) => {
              if (!ansItem.data[th]) {
                ansItem.data[th] = {};
              }
              ansItem.data[th].name = th;
              ansItem.data[th].path =
                `['${this.currentTab}'][${index}]['${schema.name}'][${answerIndex}][${th}]`;
              subData.push(ansItem.data[th]);
            });
            ansItem.data = subData;
            newAnswer[schemaIndex].data.push(ansItem);
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
    table {
      table-layout: fixed;
      &.table-1 {
        tr {
          display: inline-flex;
          align-items: center;
          width: 50%;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          &:nth-child(2n) {
            border-right: none;
          }
          &:last-child {
            border-bottom: none;
          }
          td {
            border-top: none;
            .key {
              border-right: 1px solid #ccc;
              background: #fff;
            }
          }
        }
      }
      &.table-2 {
        tr {
          th {
            text-align: center;
          }
          td {
            text-align: center;
            &.index {
              width: 100px;
            }
          }
        }
      }
    }
  }
}
</style>
