<template>
  <el-select
    class="review-fields-select"
    v-model="statusSelected"
    size="mini"
    @change="change">
    <el-option
      v-for="op in statusOptions"
      :key="op.value"
      :label="op.label"
      :value="op.value"></el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
import { getReviewFields } from '@/store/api/cgs.api';

export default {
  name: 'review-fields-select',
  props: {
    fileId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      statusSelected: 'all',
      statusOptions: [
        { label: '全量字段', value: 'all' },
        { label: '复核字段', value: 1 },
        { label: '非复核字段', value: 0 },
      ],
      reviewFields: [],
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['answerTreeFilter']),
  },
  async created() {
    await this.getReviewFields();
  },
  methods: {
    async getReviewFields() {
      const { data } = await getReviewFields(this.fileId);
      this.reviewFields = data.review_fields;
    },
    change(value) {
      // 合并现有筛选条件，避免覆盖其他组件设置的筛选
      // 先清除 nodeShow 和 nodeHide，再根据选择设置对应值
      const filter = {
        ...this.answerTreeFilter,
        nodeShow: null,
        nodeHide: null,
      };

      if (value === 1) {
        filter.nodeShow = this.reviewFields;
      } else if (value === 0) {
        filter.nodeHide = this.reviewFields;
      }

      this.$store.commit('remarkModule/SET_ANSWER_TREE_FILTER', filter);
    },
  },
};
</script>
<style scoped lang="scss">
.review-fields-select {
  width: 120px;
}
</style>
