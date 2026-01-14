<template>
  <div class="content-select">
    <el-select
      v-model="filterBy"
      size="medium"
      :disabled="disabled"
      class="label-select"
      placeholder="请选择"
      @change="changeFilter">
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select
      v-if="currentSearchCondition.options"
      ref="contentInput"
      v-model="filterValue"
      size="medium"
      filterable
      clearable
      class="value-select"
      :placeholder="`请选择${currentSearchCondition.label}`"
      @change="handleSearch">
      <el-option
        v-for="(item, index) in currentSearchCondition.options"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input
      v-else
      clearable
      size="medium"
      ref="contentInput"
      :placeholder="`请输入${currentSearchCondition.label}`"
      v-model="filterValue"
      class="value-input"
      @clear="handleClear"
      @keyup.enter.native="handleSearch">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'content-select',
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterBy: '',
      filterValue: '',
    };
  },
  computed: {
    currentSearchCondition() {
      return this.options.find((item) => item.value === this.filterBy);
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      const selectedKey = this.options
        .map((item) => item.value)
        .find((key) => key in query);
      if (selectedKey) {
        const value = query[selectedKey];
        this.filterValue = /^-?\d+(\.\d+)?$/.test(value)
          ? Number(value)
          : value;
        this.filterBy = selectedKey;
      } else {
        this.filterBy = this.options[0].value;
      }
      this.setSearchParams();
    },
    setSearchParams() {
      const params = this.getSearchParams();
      this.$store.commit('projectModule/SET_PROJECTS_SEARCH_PARAMS', params);
    },
    getSearchParams() {
      if (this.filterValue !== '') {
        const params = {
          [this.filterBy]: this.filterValue,
        };
        return params;
      }
    },
    handleSearch() {
      this.setSearchParams();
      this.$emit('search');
    },
    handleClear() {
      this.handleSearch();
    },
    changeFilter() {
      const { options } = this.currentSearchCondition;
      if (options) {
        if (this.filterBy !== 'mid') {
          this.filterValue = options[0].value;
          this.handleSearch();
        }
      } else {
        this.filterValue = '';
      }
      this.$nextTick(() => {
        this.$refs.contentInput?.focus();
      });
    },
  },
};
</script>
<style scoped lang="scss">
.content-select {
  .label-select {
    width: 120px;
    ::v-deep .el-input__inner {
      border-right: none;
      border-radius: 4px 0 0 4px;
    }
  }
  .value-input,
  .value-select {
    width: 200px;
    ::v-deep .el-input__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
