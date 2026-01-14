<template>
  <div class="file-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchFiles"
      @clear="clearFiles" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';
import SearchBox from './SearchBox';
import { FILE_SEARCH_DATA } from '../common/constant';

export default {
  name: 'file-search-box',
  components: { SearchBox },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('fileModule', ['fileSearchParams']),

    searchFormList() {
      return FILE_SEARCH_DATA.map((item) => {
        const { start, end } = this.fileSearchParams;
        if (start && end && item.key === 'created_utc') {
          return {
            ...item,
            value: [start * 1000, end * 1000],
          };
        }
        return {
          ...item,
          value: this.fileSearchParams[item.key] ?? '',
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
    searchFiles(searchParams) {
      if (searchParams.created_utc) {
        searchParams.start = searchParams.created_utc[0] / 1000;
        searchParams.end = searchParams.created_utc[1] / 1000;
        delete searchParams.created_utc;
      }
      if (!this.validateSearchVal(searchParams)) {
        return;
      }
      EventBus.$emit('search-files', searchParams);
    },
    clearFiles() {
      EventBus.$emit('search-files');
    },
  },
};
</script>

<style scoped lang="scss">
.file-search-box {
  width: 100%;
}
</style>
