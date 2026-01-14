<template>
  <div class="schema-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchSchemas"
      @clear="clearSchemas" />
  </div>
</template>

<script>
import SearchBox from './SearchBox';

export default {
  name: 'schema-search-box',
  components: { SearchBox },
  data() {
    return {
      searchFormList: [
        {
          key: 'id',
          label: '算法模型ID',
        },
        {
          key: 'name',
          label: '算法模型名称',
        },
      ],
    };
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.id && !reg.test(searchParams.id)) {
        this.$notify({
          title: '警告',
          message: '算法模型ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchSchemas(searchParams) {
      if (!this.validateSearchVal(searchParams)) {
        return;
      }
      this.$emit('search', searchParams);
    },
    clearSchemas() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped lang="scss">
.schema-search-box {
  width: 100%;
}
</style>
