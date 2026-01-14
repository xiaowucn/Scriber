<template>
  <div class="extra-files">
    <template v-if="list.length > 0">
      <div v-for="file in list" :key="file.ext_fid" class="extra-file-item">
        <div class="file-name">
          <span class="title">临时公告:</span>
          <el-button
            v-if="file.ext_fid"
            type="text"
            @click="checkExtraFile(file)"
            >{{ file.ext_filename }}</el-button
          >
        </div>
        <div>
          <div class="file-time">
            <span class="title">事项发生日期:</span>
            <span class="time" v-if="file.ext_date">{{ file.ext_date }}</span>
          </div>
          <div class="file-time">
            <span class="title">公告披露日期:</span>
            <span class="time" v-if="file.ext_publish_date">{{
              file.ext_publish_date
            }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="no-extra-file">临时公告: 无</div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'szse-annual-report-extra-file-list',
  props: {
    list: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    checkExtraFile(file) {
      this.$emit('check-extra-file', file);
    },
  },
};
</script>
<style lang="scss" scoped>
.extra-files {
  display: flex;
  flex-flow: column;
  margin: 10px 0;
  padding: 0 8px;
  border-top: 1px solid #e9e9e9;

  .extra-file-item {
    display: flex;
    flex-flow: column;

    & > div {
      display: flex;
      flex-flow: row;
      align-items: center;
    }

    .file-name {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-flow: row;

      .title {
        width: 60px;
      }

      ::v-deep .el-button {
        flex: 1;
        overflow: hidden;
        text-align: left;

        span {
          display: block;
          width: calc(100% - 20px);
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .file-time {
      width: 200px;
    }

    .title {
      margin-right: 10px;
      color: #333333;
    }

    .time {
      color: #999999;
    }
  }

  .no-extra-file {
    margin-top: 10px;
  }
}
</style>
