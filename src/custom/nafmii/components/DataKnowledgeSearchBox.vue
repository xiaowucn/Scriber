<template>
  <div class="data-knowledge-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchDataKnowledge"
      @clear="clearDataKnowledge" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SearchBox from './SearchBox';

export default {
  name: 'data-knowledge-search-box',
  components: { SearchBox },
  props: {
    types: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters('nafmiiModule', ['dataKnowledges']),

    searchData() {
      return [
        {
          key: 'id',
          label: '数据知识ID',
        },
        {
          key: 'name',
          label: '数据知识名称',
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
            ...this.types,
          ],
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
      ];
    },
    searchFormList() {
      return this.searchData.map((item) => {
        const { start, end } = this.dataKnowledges.searchParams;
        if (start && end && item.key === 'created_utc') {
          return {
            ...item,
            value: [start * 1000, end * 1000],
          };
        }
        return {
          ...item,
          value: this.dataKnowledges.searchParams[item.key] || '',
        };
      });
    },
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.id && !reg.test(searchParams.id)) {
        this.$notify({
          title: '警告',
          message: '数据知识ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchDataKnowledge(searchParams) {
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
    clearDataKnowledge() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped lang="scss">
.data-knowledge-search-box {
  width: 100%;
}
</style>
