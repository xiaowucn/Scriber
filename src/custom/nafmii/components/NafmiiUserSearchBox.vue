<template>
  <div class="user-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchUsers"
      @clear="searchUsers" />
  </div>
</template>

<script>
import SearchBox from './SearchBox';

export default {
  name: 'user-search-box',
  components: { SearchBox },
  data() {
    return {
      searchFormList: [
        {
          key: 'name',
          label: '用户名',
        },
        {
          key: 'note',
          label: '备注',
        },
      ],
    };
  },
  methods: {
    searchUsers(searchData) {
      this.$emit('search', searchData);
    },
  },
};
</script>

<style scoped lang="scss">
.user-search-box {
  width: 100%;
}
</style>
