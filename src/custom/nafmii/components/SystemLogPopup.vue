<template>
  <div class="system-log-popup">
    <el-dialog
      visible
      title="日志详情"
      :before-close="handleClose"
      :close-on-click-modal="false">
      <ul class="log-list">
        <li
          v-for="(item, index) in currentLogData"
          :key="index"
          class="log-item">
          <span class="label">{{ item.label }}：</span>
          <span class="value">{{ item.value || '-' }}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSystemLogType,
  getSystemLogStatus,
  isSystemLogSuccessed,
} from '../common/utils';

export default {
  name: 'system-log-popup',
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  computed: {
    currentLogData() {
      const {
        user_name,
        user,
        menu,
        type,
        subject,
        ip,
        client,
        status,
        created_utc,
        content,
      } = this.current;
      const logData = [
        {
          label: '登录信息',
          value: `${user_name}/${user}`,
        },
        { label: '功能菜单', value: menu },
        { label: '操作类型', value: getSystemLogType(type) },
        { label: '操作对象', value: subject },
        { label: 'IP地址', value: ip },
        { label: '浏览器版本', value: client },
        { label: '状态', value: getSystemLogStatus(status) },
        {
          label: '操作时间',
          value: this.$options.filters.datetime(created_utc),
        },
      ];
      if (isSystemLogSuccessed(status)) {
        logData.push({ label: '详情', value: content });
      } else {
        logData.push({ label: '失败原因', value: content });
      }
      return logData;
    },
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.system-log-popup {
  ::v-deep .el-dialog {
    width: 550px;
  }
  .log-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    .log-item {
      display: flex;
      min-width: 50%;
      margin-bottom: 10px;
    }
    .label {
      min-width: 85px;
      font-weight: 500;
    }
  }
}
</style>
