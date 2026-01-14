<template>
  <table class="file-predict-answer-table">
    <tbody>
      <div
        v-for="groupIndex in Math.ceil(tableData.length / 2)"
        :key="groupIndex"
        class="group">
        <tr
          v-for="(item, index) in tableData.slice(
            (groupIndex - 1) * 2,
            groupIndex * 2,
          )"
          :key="index">
          <td class="label">
            <div class="text">
              <span>{{ item.label }}</span>
            </div>
          </td>
          <slot name="value" :item="item">
            <td class="value">
              <div class="text">
                <span>{{ item.value }}</span>
              </div>
            </td>
          </slot>
        </tr>
        <tr
          v-if="
            tableData.slice((groupIndex - 1) * 2, groupIndex * 2).length === 1
          ">
          <td class="label"></td>
          <td class="value"></td>
        </tr>
      </div>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'filePredictAnswerTable',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.file-predict-answer-table {
  width: 100%;
  tbody {
    display: block;
    border: 1.5px solid #707070;
    border-right: none;
    border-bottom: none;
    .group {
      display: flex;
    }
  }
  tr {
    width: 50%;
    display: inline-flex;
  }
  ::v-deep td {
    flex: 1;
    border-right: 1.5px solid #707070;
    border-bottom: 1.5px solid #707070;
    padding: 7px 5px;
    .text {
      width: 100%;
      height: 100%;
      font-size: 12px;
      line-height: 17px;
      display: flex;
      align-items: center;
      overflow: hidden;
      word-break: break-word;
    }
    &.label {
      max-width: 40%;
    }
  }
}
</style>
