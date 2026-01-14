<template>
  <el-tooltip
    effect="light"
    placement="bottom-end"
    popper-class="audit-status-info-tooltip">
    <div slot="content" class="content">
      <p v-for="item in statusList" :key="item.value">
        <label>{{ item.label }}:</label>
        <span :class="['color', item.colorValue]">
          {{ item.colorLabel }}
        </span>
      </p>
    </div>
    <el-button
      type="text"
      size="mini"
      icon="el-icon-question"
      class="button-info">
    </el-button>
  </el-tooltip>
</template>

<script>
import _ from 'lodash';
import { FIELD_STATUS_MAP, FIELD_STATUS } from '../common/constant.js';

export default {
  name: 'field-status-helper',
  computed: {
    statusList() {
      const options = _.omit(FIELD_STATUS, [FIELD_STATUS_MAP.ALL]);
      const result = Object.values(
        Object.keys(options).reduce((acc, key) => {
          const item = options[key];
          if (!acc[item.colorValue]) {
            acc[item.colorValue] = { ...item };
          } else {
            acc[item.colorValue].label += `&${item.label}`;
          }
          return acc;
        }, {}),
      );

      const order = ['orange', 'red', 'blue', 'green', 'black'];
      const orderedResult = result.sort((a, b) => {
        return order.indexOf(a.colorValue) - order.indexOf(b.colorValue);
      });

      return orderedResult;
    },
  },
};
</script>

<style lang="scss">
.audit-status-info-tooltip {
  border-color: #0090c0 !important;
  .content {
    font-weight: bold;
    > p {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
