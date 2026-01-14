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
                <th v-for="(th, thIndex) in tableThNames" :key="thIndex">
                  {{ th }}
                </th>
              </tr>
              <tr v-for="(subItem, subIndex) in item.data" :key="subIndex">
                <td class="key">
                  {{ subItem.name }}
                  <el-tooltip
                    v-if="showComputedWarningIcon(subItem.data)"
                    effect="dark"
                    content="该数据为计算结果"
                    placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </td>
                <td v-for="(cell, cellIndex) in subItem.data" :key="cellIndex">
                  <div
                    :class="[
                      'cells',
                      cell.path === currentAnswerKeyPath ? 'active' : '',
                      isComputedValue(cell.data) ? 'is-computed' : '',
                    ]"
                    @click="answerKeySelected(cell.name, cell.path)">
                    <span
                      :class="['value', cell.data.manual ? 'manual' : '']"
                      :title="cell.data.text"
                      @click="
                        answerItemSelected(cell.name, cell.path, item.name)
                      ">
                      <span>{{ cell.data.text }}</span>
                      <div
                        v-if="isEditing && cell.path === currentAnswerKeyPath"
                        class="edit-input">
                        <el-input
                          v-model="editingText"
                          size="mini"
                          ref="editInput"
                          @click.stop.native></el-input>
                        <el-button size="mini" @click="isEditing = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          size="mini"
                          @click.stop="saveEditingAnswer"
                          >保存</el-button
                        >
                      </div>
                      <el-tooltip
                        v-if="shouldShowNextCellIcon(cell.path)"
                        effect="dark"
                        content="计算数据，查看下一处定位"
                        placement="top">
                        <i
                          class="el-icon-caret-right"
                          @click.stop="showNextCellWidget"></i>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="编辑" placement="top">
                        <i
                          class="el-icon-edit"
                          @click.stop="editAnswerText(cell.path)"></i>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="删除" placement="top">
                        <i
                          class="el-icon-delete"
                          @click.stop="clearAnswerText(cell.path)"></i>
                      </el-tooltip>
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>

    <formula
      v-if="formulaData.length > 0"
      :formulas="formulaData"
      :answer="currentAnswer"
      @close="closeFormulaCard"></formula>
  </div>
</template>

<script>
import _ from 'lodash';
import answerTableMixin from '../../mixins/answerTableMixin';
import Formula from '../Formula';

export default {
  name: 'basic-financial-data',
  components: { Formula },
  mixins: [answerTableMixin],
  props: {
    originAnswer: {
      type: Object,
      required: true,
    },
    originSchema: {
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
      tableThNames: [
        '',
        '最近一期（末）（如有）',
        '最近一年（末）',
        '申报期第二年（末）',
        '申报期第一年（末）',
      ],
    };
  },
  computed: {
    schema() {
      if (this.originSchema.schemas) {
        return this.originSchema.schemas.find(
          (schema) => schema.name === this.currentTab,
        );
      }
      return {};
    },
    answer() {
      const ignoredKeys = ['其他指标'];
      const originAnswer = this.parseAnswer(
        _.omit(this.originAnswer[this.currentTab][0], ignoredKeys),
      );
      const newAnswer = [];

      this.schema.orders
        .filter((order) => !ignoredKeys.includes(order))
        .forEach((schema) => {
          let answerItems = {
            name: schema,
            data: [],
          };

          this.findSchemaOrders(schema).forEach((order) => {
            let rows = {
              name: order,
              data: [],
            };
            originAnswer[schema].forEach((answer, answerIndex) => {
              rows.data.push({
                name: order,
                data: answer[order] || {},
                path: `['${this.currentTab}'][0]['${schema}'][${answerIndex}][${order}]`,
              });
            });

            answerItems.data.push(rows);
          });

          newAnswer.push(answerItems);
        });

      return newAnswer;
    },
    formulaDataActivedIndex() {
      return this.currentAnswerCellSubValueIndex === 0 ? 0 : 2;
    },
  },
  methods: {
    parseAnswer(answer) {
      for (const key in answer) {
        const originItemGroup = answer[key];
        if (!originItemGroup) {
          continue;
        }
        const length = originItemGroup.length;
        for (let j = 0; j < 4 - length; j++) {
          let answerItem = _.cloneDeep(originItemGroup[0]);
          for (const key in answerItem) {
            answerItem[key] = {};
          }
          originItemGroup.unshift(answerItem);
        }
      }
      return answer;
    },
    findSchemaOrders(name) {
      const index = this.originSchema.schemas.findIndex(
        (item) => item.name === name,
      );
      if (index === -1) {
        return [];
      }
      return _.pull(this.originSchema.schemas[index].orders, '报告期');
    },
    showFormulaData(data) {
      return !_.isEmpty(data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/szse-ipo.common.scss';
</style>
