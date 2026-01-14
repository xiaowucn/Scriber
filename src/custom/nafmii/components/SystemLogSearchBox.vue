<template>
  <div class="system-log-search-box">
    <search-box
      :searchFormList="searchFormList"
      :defaultSearchData="defaultSearchData"
      @search="searchSystemLog"
      @clear="clearSystemLog" />
  </div>
</template>

<script>
import SearchBox from './SearchBox';
import {
  SYSTEM_LOG_TYPE_OPTIONS,
  SYSTEM_LOG_STATUS_OPTIONS,
} from '../common/constant';

export default {
  name: 'system-log-search-box',
  components: { SearchBox },
  props: {
    defaultFilterTime: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchFormList: [
        {
          isDatePicker: true,
          key: 'created_utc',
          label: '日期',
        },
        {
          key: 'user_name',
          label: '用户',
        },
        {
          key: 'user_id',
          label: '用户ID',
        },
        {
          isSelect: true,
          key: 'type',
          label: '类型',
          options: [
            {
              value: '',
              label: '全部',
            },
            ...SYSTEM_LOG_TYPE_OPTIONS,
          ],
        },
        {
          isSelect: true,
          key: 'status',
          label: '状态',
          options: [
            {
              value: '',
              label: '全部',
            },
            ...SYSTEM_LOG_STATUS_OPTIONS,
          ],
        },
      ],
    };
  },
  computed: {
    defaultSearchData() {
      return [
        {
          key: 'created_utc',
          value: this.defaultFilterTime,
        },
      ];
    },
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.id && !reg.test(searchParams.id)) {
        this.$notify({
          title: '警告',
          message: '日志ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchSystemLog(searchParams) {
      if (searchParams.created_utc) {
        searchParams.start = Math.floor(searchParams.created_utc[0] / 1000);
        searchParams.end = Math.floor(searchParams.created_utc[1] / 1000);
        delete searchParams.created_utc;
      }
      if (!this.validateSearchVal(searchParams)) {
        return;
      }
      this.$emit('search', searchParams);
    },
    clearSystemLog() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped lang="scss">
.system-log-search-box {
  width: 100%;
}
</style>
