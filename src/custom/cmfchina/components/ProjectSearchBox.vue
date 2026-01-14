<template>
  <search-box :searchData="searchData" @search="searchProjects" />
</template>

<script>
import { EventBus } from '@/utils';
import SearchBox from './SearchBox';
import SearchProjectOrFileMixin from '../mixins/SearchProjectOrFileMixin';

export default {
  name: 'project-search-box',
  components: { SearchBox },
  mixins: [SearchProjectOrFileMixin],
  data() {
    return {
      searchData: {
        dateOptions: [
          {
            value: 'created_utc',
            label: '创建时间',
          },
        ],
        contentOptions: [
          {
            value: 'name',
            label: '项目名称',
          },
          {
            value: 'id',
            label: '项目ID',
          },
          {
            value: 'user_name',
            label: '创建人',
          },
          {
            value: 'mid',
            label: '场景名称',
            options: [],
          },
        ],
      },
    };
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.id && !reg.test(searchParams.id)) {
        this.$notify({
          title: '警告',
          message: '项目ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchProjects(searchParams) {
      if (!this.validateSearchVal(searchParams)) {
        return;
      }
      this.$router.replace({ query: searchParams });
      EventBus.$emit('search-projects', searchParams);
    },
  },
};
</script>
