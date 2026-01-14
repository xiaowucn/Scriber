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
                <td v-for="(cell, cellIndex) in subItem.data" :key="cellIndex">
                  <div
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
                  @click="addAnswerItemGroup(tableThNames, item)"></el-button>
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
  name: 'issuer-details',
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
          name: '发行人相关人员情况',
        },
      ],
      tableThNames: [
        '法人或自然人名称（包括全称及简称）',
        '职位',
        '代码',
        '任职机构',
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

          item[schema.name].forEach((answer, answerIndex) => {
            const ansItem = {
              data: item[schema.name][answerIndex],
            };
            let subData = [];
            this.tableThNames.forEach((th) => {
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
</style>
