<template>
  <el-card class="formula-card">
    <div slot="header" v-drag>
      <span>数据详情</span>
      <el-button
        type="text"
        size="mini"
        icon="el-icon-close"
        @click="close"></el-button>
    </div>
    <div class="content">
      <div v-for="(item, index) in formulas" :key="index" class="formula-item">
        <div
          v-for="(formula, formulaIndex) in item"
          :key="formulaIndex"
          class="item"
          :class="[isActive(formula, index) ? 'active' : '']">
          <p class="text">{{ formula.item }}</p>
          <p class="value">
            {{ getFormulaDataText(formula.data) }}
          </p>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'szse-formula',
  props: {
    formulas: {
      type: Array,
      required: true,
    },
    answer: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isActive() {
      return function (formula, index) {
        if (this.formulas.length > 1 && index === 0) {
          return false;
        }
        if (formula.data.data) {
          return _.isEqual(formula.data.data[0], this.answer);
        }
        return false;
      };
    },
  },
  directives: {
    drag: {
      inserted: (target) => {
        target.onmousedown = (e) => {
          const container = target.parentNode.parentNode;
          const disX = e.clientX - container.offsetLeft;
          const disY = e.clientY - container.offsetTop;
          document.onmousemove = (e) => {
            container.style.left = e.clientX - disX + 'px';
            container.style.top = e.clientY - disY + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
          return false;
        };
      },
    },
  },
  methods: {
    getFormulaDataText(data) {
      if (!_.isEmpty(data)) {
        return data.text ? data.text : data;
      }
      return '';
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.formula-card {
  position: fixed;
  top: 100px;
  right: 30px;
  width: 470px;
  z-index: 301;
  transition: none;
  ::v-deep .el-card__header {
    padding: 10px 20px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    }
  }
  .content {
    .formula-item {
      display: flex;
      align-items: center;
      padding: 10px;
      box-shadow: 0 0 5px #e8e8e8;
      &:nth-child(2) {
        margin: 15px 0;
      }
    }
    .item {
      text-align: center;
      font-size: 13px;
      white-space: nowrap;
      &:nth-child(even) {
        flex: 1;
      }
      &:nth-child(odd) {
        flex: 2;
      }
      &.active {
        .value {
          color: #409eff;
        }
      }
    }
  }
}
</style>
