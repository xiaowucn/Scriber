<template>
  <div class="project-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchProjects"
      @clear="clearProjects" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '@/utils';
import SearchBox from './SearchBox';

export default {
  name: 'project-search-box',
  components: { SearchBox },
  data() {
    return {
      searchData: [
        {
          key: 'pid',
          label: '识别文件集ID',
        },
        {
          key: 'name',
          label: '识别文件集名称',
        },
        {
          key: 'user_name',
          label: '创建人',
        },
        {
          isDatePicker: true,
          key: 'created_utc',
          label: '创建时间',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('projectModule', ['projectSearchParams']),

    searchFormList() {
      return this.searchData.map((item) => {
        const { start, end } = this.projectSearchParams;
        if (start && end && item.key === 'created_utc') {
          return {
            ...item,
            value: [start * 1000, end * 1000],
          };
        }
        return {
          ...item,
          value: this.projectSearchParams[item.key] || '',
        };
      });
    },
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.pid && !reg.test(searchParams.pid)) {
        this.$notify({
          title: '警告',
          message: '识别文件集ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchProjects(searchParams) {
      if (searchParams.created_utc) {
        searchParams.start = searchParams.created_utc[0] / 1000;
        searchParams.end = searchParams.created_utc[1] / 1000;
        delete searchParams.created_utc;
      }
      if (!this.validateSearchVal(searchParams)) {
        return;
      }
      EventBus.$emit('search-projects', searchParams);
    },
    clearProjects() {
      EventBus.$emit('search-projects');
    },
  },
};
</script>

<style scoped lang="scss">
.project-search-box {
  width: 100%;
}
</style>
