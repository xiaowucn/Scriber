<template>
  <div class="task-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchTasks"
      @clear="clearTasks" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SearchBox from './SearchBox';
import { TASK_SEARCH_DATA } from '../common/constant';

export default {
  name: 'task-search-box',
  components: { SearchBox },
  props: {
    fileTypes: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters('nafmiiModule', ['tasks']),

    searchData() {
      return TASK_SEARCH_DATA.map((item) => {
        if (item.key === 'file_type') {
          return {
            ...item,
            options: [
              {
                value: '',
                label: '全部',
              },
              ...this.fileTypes,
            ],
          };
        }
        return item;
      });
    },
    searchFormList() {
      return this.searchData.map((item) => {
        const { start, end } = this.tasks.searchParams;
        if (start && end && item.key === 'created_utc') {
          return {
            ...item,
            value: [start * 1000, end * 1000],
          };
        }
        return {
          ...item,
          value: this.tasks.searchParams[item.key] ?? '',
        };
      });
    },
  },
  methods: {
    validateSearchVal(searchData) {
      let reg = /^[0-9]*$/;
      if (searchData.id && !reg.test(searchData.id)) {
        this.$notify({
          title: '警告',
          message: '任务ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchTasks(searchParams) {
      if (searchParams.created_utc) {
        searchParams.start = searchParams.created_utc[0] / 1000;
        searchParams.end = searchParams.created_utc[1] / 1000;
        delete searchParams.created_utc;
      }
      if (!this.validateSearchVal(searchParams)) {
        return;
      }
      this.$emit('search', searchParams);
    },
    clearTasks() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped lang="scss">
.task-search-box {
  width: 100%;
}
</style>
