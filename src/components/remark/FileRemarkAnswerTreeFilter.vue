<template>
  <div class="file-remark-answer-tree-filter">
    <span class="label">仅查看:</span>
    <el-select v-model="valueType" size="mini" @change="change">
      <el-option
        v-for="option in valueTypeOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value">
      </el-option>
    </el-select>
    <el-select v-model="extractType" size="mini" @change="change">
      <el-option
        v-for="option in extractTypeOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SCHEMA_TYPE } from '@/store/constants';

export default {
  name: 'file-remark-answer-tree-filter',
  props: {
    fileId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      valueType: 'all',
      extractType: 'all',
      valueTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '为空字段', value: 'empty' },
      ],
      extractTypeOptions: [
        { label: '全部', value: 'all' },
        { label: SCHEMA_TYPE.LLM.label, value: SCHEMA_TYPE.LLM.type },
        { label: SCHEMA_TYPE.CUSTOM.label, value: SCHEMA_TYPE.CUSTOM.type },
      ],
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['answerTreeFilter']),
  },
  created() {},
  methods: {
    change() {
      // 合并现有筛选条件，避免覆盖其他组件设置的筛选
      const filter = {
        ...this.answerTreeFilter,
        ignoreChangeOpenStatus: true,
        valueType: this.valueType,
        extractType: this.extractType,
      };

      this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', filter);
    },
  },
};
</script>
<style scoped lang="scss">
.file-remark-answer-tree-filter {
  display: flex;
  align-items: center;
  .label {
    width: 50px;
    font-size: 13px;
    font-weight: bold;
    color: #666;
  }
  .el-select {
    width: 110px;
    margin-left: 5px;
  }
}
</style>
