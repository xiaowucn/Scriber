<template>
  <div class="report-review-history-log">
    <el-popover
      placement="top"
      :width="isAdminUser ? '400' : 'auto'"
      trigger="hover"
      popper-class="report-review-history-popover">
      <template v-if="historyLog.length > 0">
        <h4 v-if="isAdminUser" class="title">Modify records</h4>
        <ol v-if="historyLog.length > 0" class="history-list">
          <li v-for="(item, index) in historyLog" :key="index">
            <p>
              <span v-if="isAdminUser" class="index">{{ index + 1 }}:</span>
              <span v-else class="index">Last modified by: </span>
              <span class="user-name">{{ item.user_name }}</span>
              <span class="date-time">{{ item.date_time }}</span>
            </p>
            <p v-if="isAdminUser" class="desc">{{ item.desc }}</p>
          </li>
        </ol>
      </template>
      <div v-else class="empty">No modification record</div>
      <i slot="reference" class="icon-history-log"></i>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'report-review-history-log',
  props: {
    historyLog: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(['loginUser']),
    isAdminUser() {
      return this.$user.isAdminUser();
    },
  },
};
</script>

<style lang="scss" scoped>
.report-review-history-log {
  .icon-history-log {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-size: 100% 100%;
    background-image: url(../common/images/icon-review-history.svg);
    cursor: pointer;
  }
}
</style>

<style lang="scss">
@import '../common/color.scss';

.report-review-history-popover {
  min-width: 200px;
  padding: 10px 5px 10px 15px;
  .title {
    padding-bottom: 8px;
    border-bottom: 1px solid #efefef;
    font-size: 15px;
    color: #000;
  }
  .history-list {
    max-height: 200px;
    padding-right: 15px;
    overflow: auto;
    li {
      margin: 8px 0;
      .index {
        margin-right: 10px;
      }
      .user-name {
        margin-right: 10px;
      }
      .date-time {
        color: #999;
      }
      .desc {
        padding-left: 20px;
        line-height: 18px;
        color: $--color-primary;
        font-size: 13px;
        word-break: break-all;
      }
    }
  }
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20px;
    padding-top: 5px;
    color: #ccc;
  }
}
</style>
