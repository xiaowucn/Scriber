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
          <div class="table-wrapper">
            <table class="table">
              <tr>
                <th v-for="(th, thIndex) in item.data[0].data" :key="thIndex">
                  {{ th.name }}
                </th>
              </tr>
              <tr v-for="(subItem, subIndex) in item.data" :key="subIndex">
                <td v-for="(cell, cellIndex) in subItem.data" :key="cellIndex">
                  <div
                    class="cells"
                    :class="cell.path === currentAnswerKeyPath ? 'active' : ''">
                    <div
                      class="value"
                      :class="cell.data.manual ? 'manual' : ''"
                      @click="
                        answerItemSelected(
                          cell.name,
                          cell.path,
                          item.data[0].name,
                        )
                      ">
                      <span>
                        {{ cell.data.text }}
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
  name: 'product-details',
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
          name: '主要产品市场占有率',
          orders: [
            '产品名称',
            '报告期',
            '报告期营业收入占比（%）',
            '国内市场占有率（%）',
            '国内市场占有率排名',
            '国际市场占有率（%）',
            '国际市场占有率排名',
          ],
        },
        {
          name: '重大科技专场',
          orders: [
            '项目名称',
            '项目开始时间',
            '项目状态',
            '参与角色',
            '项目总经费（万元）',
            '财政拨款经费（万元）',
            '发行人自筹经费（万元）',
            '备注',
          ],
        },
        {
          name: '参与标准制定情况',
          orders: [
            '参与制定标准名称',
            '标准层级',
            '参与角色',
            '标准状态',
            '备注',
          ],
        },
        {
          name: '产品实现进口代替情况',
          orders: [
            '产品名称',
            '初次上市时间',
            '国内市场占有率（%）',
            '上市前进口产品市场占有率（%）',
            '目前进口产品市场占有率（%）',
            '实现替代情况描述',
            '备注',
          ],
        },
      ],
    };
  },
  computed: {
    answer() {
      const originAnswer = _.cloneDeep(this.originAnswer[this.currentTab]);
      const newAnswer = [];

      originAnswer.forEach((item) => {
        this.originSchema.forEach((schema, schemaIndex) => {
          newAnswer.push({
            name: schema.name,
            data: [],
          });

          if (!item[schema.name] || item[schema.name].length === 0) {
            item[schema.name] = [
              {
                data: [],
              },
            ];
          }

          item[schema.name].forEach((answer, answerIndex) => {
            const ansItem = {
              data: [],
            };
            let subData = [];
            schema.orders.forEach((order) => {
              if (!ansItem.data[order]) {
                ansItem.data[order] = {};
              }
              ansItem.data[order].name = order;
              ansItem.data[order].data = answer[order] || {};
              ansItem.data[order].path =
                `['${this.currentTab}'][0]['${schema.name}'][${answerIndex}][${order}]`;
              subData.push(ansItem.data[order]);
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
</style>
