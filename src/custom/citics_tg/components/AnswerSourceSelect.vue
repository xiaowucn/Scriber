<template>
  <el-select
    class="answer-source-select"
    v-model="sourceSelected"
    size="small"
    @change="handleSelectChange">
    <el-option
      v-for="op in statusOptions"
      :key="op.value"
      :label="op.label"
      :disabled="op.value === 0 && additionalDisabeld"
      :value="op.value"></el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { EventBus } from '@/utils';
import { fetchFileAdditionalAnswer } from '@/store/api/citics-tg.api';
export default {
  name: 'answer-source-select',
  props: {
    fileId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      sourceSelected: 1,
      statusOptions: [
        { label: 'AI提取', value: 1 },
        { label: '感易数据', value: 0 },
      ],
      additionalAnswer: {},
      additionalSchema: {},
      originExtractAnswer: {},
      originCustomAnswer: {},
      additionalDisabeld: false,
    };
  },
  computed: {
    ...mapGetters('remarkModule', ['answer', 'diffEnabled', 'diffAnswer']),
  },
  async created() {
    const additionalData = await this.getAdditionalAnswer();
    if (_.isEmpty(additionalData)) {
      this.additionalDisabeld = true;
    }
  },
  mounted() {},
  methods: {
    async getAdditionalAnswer() {
      try {
        const { data } = await fetchFileAdditionalAnswer(this.fileId);
        const { schema, userAnswer } = data;
        this.additionalSchema = schema;
        this.additionalAnswer = userAnswer;
        return data;
      } catch (e) {
        console.error(e);
        return;
      }
    },
    handleSelectChange(value) {
      if (!this.diffEnabled) {
        if (value === 0) {
          this.originExtractAnswer = _.cloneDeep(this.answer);
          this.$store.commit(
            'remarkModule/SET_USER_ANSWER',
            this.additionalAnswer,
          );
          this.$store.dispatch('remarkModule/initAnswerTree');
        } else if (value === 1) {
          this.$store.commit(
            'remarkModule/SET_USER_ANSWER',
            this.originExtractAnswer,
          );
          this.$store.dispatch('remarkModule/initAnswerTree');
        }
      }
      EventBus.$emit('handle-update-answer-type', value);
    },
  },
};
</script>
<style scoped lang="scss">
.answer-source-select {
  width: 120px;
  margin-left: auto;
}
</style>
