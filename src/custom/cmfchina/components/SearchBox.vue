<template>
  <div class="search-box">
    <date-picker
      ref="datePicker"
      @search="handleSearch"
      :disabled="disabled"
      :options="searchData.dateOptions" />
    <content-select
      v-if="searchData.contentOptions"
      ref="contentSelect"
      @search="handleSearch"
      :disabled="disabled"
      :options="searchData.contentOptions" />
    <el-button
      class="search-button"
      type="primary"
      size="medium"
      @click="handleSearch">
      <svg-font-icon name="search" :size="20" />
      搜索
    </el-button>
  </div>
</template>

<script>
import DatePicker from './DatePicker';
import ContentSelect from './ContentSelect';

export default {
  name: 'search-box',
  components: { DatePicker, ContentSelect },
  props: {
    searchData: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      searchParams: {},
    };
  },
  computed: {
    disabled() {
      return (
        this.$route.name === 'projectDetail' &&
        this.$route.query.mid !== undefined
      );
    },
  },
  methods: {
    handleSearch() {
      const dateParams = this.$refs.datePicker.getSearchParams();
      const contentParams = this.$refs.contentSelect?.getSearchParams() || {};
      this.searchParams = { ...dateParams, ...contentParams };
      this.$emit('search', this.searchParams);
    },
  },
};
</script>

<style scoped lang="scss">
.search-box {
  display: flex;
  > div {
    margin-right: 10px;
  }
  .search-button {
    height: 36px;
    font-size: 16px;
    padding: 7px 20px;
    ::v-deep > span {
      display: flex;
      align-items: center;
    }
    .svg-icon-container {
      margin-right: 5px;
    }
  }
}
</style>
