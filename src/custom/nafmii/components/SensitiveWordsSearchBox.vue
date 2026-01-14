<template>
  <div class="sensitive-words-search-box">
    <search-box
      :searchFormList="searchFormList"
      @search="searchSensitiveWords"
      @clear="clearSensitiveWords" />
  </div>
</template>

<script>
import SearchBox from './SearchBox';

export default {
  name: 'sensitive-words-search-box',
  components: { SearchBox },
  props: {
    types: {
      type: Array,
      required: true,
    },
    systems: {
      type: Array,
      required: true,
    },
  },
  computed: {
    searchFormList() {
      return [
        {
          key: 'id',
          label: '敏感词ID',
        },
        {
          key: 'name',
          label: '敏感词',
        },
        {
          isSelect: true,
          key: 'type_id',
          label: '敏感词类型',
          options: [
            {
              value: '',
              label: '全部',
            },
            ...this.types,
          ],
        },
        {
          isSelect: true,
          key: 'sys_id',
          label: '归属系统',
          options: [
            {
              value: '',
              label: '全部',
            },
            ...this.systems,
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
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.id && !reg.test(searchParams.id)) {
        this.$notify({
          title: '警告',
          message: '敏感词ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    searchSensitiveWords(searchParams) {
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
    clearSensitiveWords() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped lang="scss">
.sensitive-words-search-box {
  width: 100%;
}
</style>
