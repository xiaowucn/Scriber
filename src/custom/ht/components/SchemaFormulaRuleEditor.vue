<template>
  <div class="schema-formular-rule-editor">
    <div class="editor-operators">
      <div class="columns-selection">
        <el-select
          size="mini"
          v-model="columnSelected"
          filterable
          placeholder="请选择字段">
          <el-option v-for="item in columns" :key="item" :value="item">{{
            item
          }}</el-option>
        </el-select>
        <el-button
          type="text"
          size="mini"
          :disabled="!columnSelected || disabled"
          @click="insertColumn"
          >插入</el-button
        >
      </div>
      <div class="operators-selection">
        <el-button-group>
          <el-button
            v-for="item in operators"
            :key="item"
            :type="operatorSelected === item ? 'primary' : 'defalut'"
            size="mini"
            :disabled="disabled"
            @click="selectOperator(item)"
            >{{ item }}</el-button
          >
        </el-button-group>
        <el-button-group>
          <el-button
            icon="el-icon-circle-close-outline"
            size="mini"
            @click="deleteFormulaElement"></el-button>
          <el-button size="mini" @click="clearFormulaElement"
            >全部清除</el-button
          >
        </el-button-group>
      </div>
    </div>
    <div class="editor-content">
      <span
        v-for="(item, index) in formula"
        :key="index"
        class="formula-element"
        :class="{
          [item.type]: true,
          active: elementIndexActived === index,
          invalid: formulaInvalidIndexes.indexOf(index) > -1,
        }"
        @click="selectElement(index)"
        >{{ item.value }}</span
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'schema-formula-rule-editor',
  props: {
    columns: {
      type: Array,
      required: false,
    },
    formulaExisted: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      operators: ['+', '-', '*', '/', '='],
      operatorSelected: null,
      columnSelected: '',
      formula: [],
      elementIndexActived: -1,
    };
  },
  mounted() {
    this.checkExsitedFormula();
    window.addEventListener('keyup', this.keyupHandler);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyupHandler);
  },
  computed: {
    formulaInvalidIndexes() {
      const indexes = new Set();

      this.formula.forEach((element, index) => {
        if (index === 0) {
          if (element.type === 'operator') {
            indexes.add(index);
          }
        } else {
          const elementPrevious = this.formula[index - 1];

          if (element.type === 'operator') {
            if (elementPrevious.type === 'operator') {
              indexes.add(index);
            }
            if (index === this.formula.length - 1) {
              indexes.add(index);
            }
          } else if (element.type === 'number' || element.type === 'column') {
            if (elementPrevious.type !== 'operator') {
              indexes.add(index);
            }
          }
        }
      });

      const hasEqual = this.formula.some((item) => item.value === '=');
      if (!hasEqual) {
        indexes.add(this.formula.length - 1);
      }

      return Array.from(indexes);
    },
  },
  watch: {
    formulaInvalidIndexes(val) {
      this.$emit('updateFormulaValidate', val.length === 0);
    },
  },
  methods: {
    selectOperator(operator) {
      this.operatorSelected = operator;
      this.insertFormulaElement({
        type: 'operator',
        value: operator,
      });
    },
    insertColumn() {
      this.insertFormulaElement({
        type: 'column',
        value: this.columnSelected,
      });
    },
    insertFormulaElement(element) {
      if (this.formula.length === 0) {
        if (element.type === 'column' || element.type === 'number') {
          this.formula.push(element);
          this.elementIndexActived = 0;
        }
      } else {
        const insertPosition =
          this.elementIndexActived > -1
            ? this.elementIndexActived + 1
            : this.formula.length;

        const elementPreviousIndex =
          this.elementIndexActived > -1
            ? this.elementIndexActived
            : this.formula.length - 1;
        const elementPrevious = this.formula[elementPreviousIndex];

        if (element.type === 'operator') {
          if (
            elementPrevious.type === 'column' ||
            elementPrevious.type === 'number'
          ) {
            const hasExistedEqual = this.formula.some(
              (item) => item.value === '=',
            );
            if (element.value !== '=' || !hasExistedEqual) {
              this.formula.splice(insertPosition, 0, element);
              this.elementIndexActived = this.elementIndexActived + 1;
            }
          }
        } else if (element.type === 'column') {
          if (elementPrevious.type === 'operator') {
            this.formula.splice(insertPosition, 0, element);
            this.elementIndexActived = this.elementIndexActived + 1;
          }
        } else if (element.type === 'number') {
          if (elementPrevious.type === 'operator' && element.value !== '0') {
            this.formula.splice(insertPosition, 0, element);
            this.elementIndexActived = this.elementIndexActived + 1;
          } else if (
            elementPrevious.type === 'number' &&
            /^\d+(\.\d*)?$/.test(elementPrevious.value)
          ) {
            this.formula[elementPreviousIndex].value =
              '' + this.formula[elementPreviousIndex].value + element.value;
          }
        } else if (element.type === 'numberDot') {
          if (
            elementPrevious.type === 'number' &&
            /^\d+$/.test(elementPrevious.value)
          ) {
            this.formula[elementPreviousIndex].value =
              '' + this.formula[elementPreviousIndex].value + element.value;
          }
        } else if (element.type === 'numberSuffix') {
          if (
            elementPrevious.type === 'number' &&
            /^\d+(\.\d+)?$/.test(elementPrevious.value)
          ) {
            this.formula[elementPreviousIndex].value =
              '' + this.formula[elementPreviousIndex].value + element.value;
          }
        }
      }

      const formulaPatterns = Object.keys(this.formula)
        .map((key) =>
          this.formula[key].type === 'column'
            ? `{${this.formula[key].value}}`
            : this.formula[key].value,
        )
        .join('');
      this.$emit('updateFormulaPatterns', formulaPatterns);
    },
    selectElement(elementIndex, deactive = true) {
      if (elementIndex < 0) {
        elementIndex = 0;
      }
      if (elementIndex > this.formula.length - 1) {
        elementIndex = this.formula.length - 1;
      }

      if (deactive && this.elementIndexActived === elementIndex) {
        this.elementIndexActived = -1;
      } else {
        this.elementIndexActived = elementIndex;
      }
    },
    deleteFormulaElement() {
      if (this.elementIndexActived > -1) {
        const elementActived = this.formula[this.elementIndexActived];
        if (
          elementActived.type === 'number' &&
          elementActived.value.length > 1
        ) {
          let lastIndex =
            elementActived.value[elementActived.value.length - 2] === '.'
              ? elementActived.value.length - 2
              : elementActived.value.length - 1;
          elementActived.value = elementActived.value.slice(0, lastIndex);
        } else {
          this.formula.splice(this.elementIndexActived, 1);
          this.elementIndexActived = Math.max(this.elementIndexActived - 1, 0);
        }
      }
    },
    clearFormulaElement() {
      this.formula = [];
    },
    checkExsitedFormula() {
      if (this.formulaExisted) {
        const formula = [];

        let charIndex = -1;
        let charCombined = '';
        while (charIndex < this.formulaExisted.length - 1) {
          charIndex += 1;
          const char = this.formulaExisted[charIndex];

          if (char === '{') {
            let columnCharIndex = charIndex;
            while (columnCharIndex < this.formulaExisted.length - 1) {
              columnCharIndex += 1;
              const columnChar = this.formulaExisted[columnCharIndex];
              if (columnChar === '}') {
                formula.push({
                  type: 'column',
                  value: charCombined,
                });

                charCombined = '';
                charIndex = columnCharIndex;
                break;
              } else {
                charCombined += columnChar;
              }
            }
            continue;
          }

          if (!isNaN(Number(char))) {
            let numberCharIndex = charIndex;
            while (numberCharIndex < this.formulaExisted.length) {
              const numberChar = this.formulaExisted[numberCharIndex];
              charCombined += numberChar;

              const nextChar = this.formulaExisted[numberCharIndex + 1];
              if (
                this.operators.indexOf(nextChar) > -1 ||
                numberCharIndex === this.formulaExisted.length - 1
              ) {
                formula.push({
                  type: 'number',
                  value: charCombined,
                });

                charCombined = '';
                charIndex = numberCharIndex;

                break;
              }

              numberCharIndex += 1;
            }
            continue;
          }

          if (this.operators.indexOf(char) > -1) {
            formula.push({ type: 'operator', value: char });
          }
        }

        this.formula = formula;
      }
    },
    keyupHandler(e) {
      if (this.disabled) {
        return;
      }

      switch (e.keyCode) {
        // delete
        case 8:
          this.deleteFormulaElement();
          return;
        // left arrow
        case 37:
          this.selectElement(this.elementIndexActived - 1, false);
          return;
        // right arrow
        case 39:
          this.selectElement(this.elementIndexActived + 1, false);
          return;
      }

      if (this.operators.indexOf(e.key) > -1) {
        this.insertFormulaElement({ type: 'operator', value: e.key });
      } else if (!isNaN(Number(e.key))) {
        this.insertFormulaElement({ type: 'number', value: e.key });
      } else if (e.key === '.') {
        this.insertFormulaElement({ type: 'numberDot', value: e.key });
      } else if (e.key === '%') {
        this.insertFormulaElement({ type: 'numberSuffix', value: e.key });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.editor-operators {
  .columns-selection {
    .el-select {
      margin-right: 10px;
      width: 160px;
    }
  }
  .operators-selection {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin-top: 8px;
  }
}
.editor-content {
  margin-top: 8px;
  padding: 10px;
  width: calc(100% - 20px);
  min-height: 100px;
  border-radius: 6px;
  border: 1px solid #eee;
  outline: none;

  &:focus {
    border-color: #409eff;
  }

  .formula-element {
    display: inline-block;
    padding: 0 4px;
    height: 24px;
    line-height: 24px;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #606266;
    text-align: center;
    vertical-align: middle;
    cursor: default;

    &:not(:first-of-type) {
      margin-left: 4px;
    }

    &.operator {
      font-size: 20px;
    }

    &.column {
      padding: 4px 8px;
      background-color: #ecf5ff;
      font-size: 14px;
      color: #409eff;
    }

    &.active {
      background-color: #409eff;
      color: #fff;
    }

    &.invalid {
      background-color: #f56c6c;
      color: #fff;

      &.active {
        border-color: #409eff;
      }
    }
  }
}
</style>
