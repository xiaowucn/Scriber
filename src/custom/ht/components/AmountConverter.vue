<template>
  <span v-if="showConvertAmountInCase" class="amount-converter">
    <i
      class="far fa-eye"
      title="转换金额大小写"
      @click.stop="convertAmountInCase"></i>
    <span class="convert-text">{{ answerConvertText }}</span>
  </span>
</template>

<script>
export default {
  name: 'ht-amount-converter',
  props: {
    answerData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      answerConvertText: '',
    };
  },
  computed: {
    showConvertAmountInCase() {
      return (
        this.$features.showHtRemarkAside() &&
        (this.answerData.schema.data.label.includes('大写') ||
          this.answerData.schema.data.label.includes('小写'))
      );
    },
  },
  methods: {
    async convertAmountInCase() {
      try {
        const amountText =
          this.answerData.answerItem.text ||
          this.answerData.answerItem.boxes.map((box) => box.text).join('');
        const res = await this.$store.dispatch('htModule/convertAmountInCase', {
          amount: amountText,
          schemaCol: this.answerData.schema.data.label,
          qid: Number(this.$route.params.qid),
        });
        this.answerConvertText = res.data;
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.amount-converter {
  i {
    margin: 0 10px;
    color: #409eff;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .convert-text {
    color: #7a7a7a;
  }
}
</style>
