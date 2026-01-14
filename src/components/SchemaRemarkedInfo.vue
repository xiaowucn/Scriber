<template>
  <el-dialog
    :visible="remarkedInfo.visible"
    width="600px"
    class="schema-part-info-wrapper"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <h4 slot="title">{{ title }}</h4>
    <div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 20 }"
        :placeholder="$t(`message['请输入内容']`)"
        :disabled="isDisabled"
        :value="remarkedInfo.words"
        @input="updateRemarkedInfoWord">
      </el-input>
    </div>
    <span slot="footer" v-if="!hideBtn">
      <el-button @click="handleClose">{{ $t(`message['取消']`) }}</el-button>
      <el-button type="primary" @click="persistSchemaInfo">{{
        $t(`message['确定']`)
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'schema-part-info',
  props: {
    title: {
      type: String,
    },
    remarkedInfo: {
      type: Object,
      required: true,
    },
    hideBtn: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      remarkedMessage: '',
    };
  },
  methods: {
    handleClose() {
      this.$emit('close-info-visible', '');
    },
    persistSchemaInfo() {
      this.$emit('persist-schema-info');
    },
    updateRemarkedInfoWord(value) {
      this.$emit('update:remarkedInfo', { ...this.remarkedInfo, words: value });
    },
  },
};
</script>

<style scoped>
.detail-wapper {
  margin: 1.5em 0;
}
.schema-part-info-wrapper {
  min-width: 1210px;
}
.btn-group-wrapper {
  text-align: right;
}
.el-dialog__body {
  padding: 16px 20px;
}
</style>
