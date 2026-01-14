<template>
  <el-dialog
    visible
    custom-class="mapping-check-dialog"
    :before-close="close"
    :close-on-click-modal="false">
    <span slot="title">
      {{ $t(`message['映射关系检查']`) }}
      （{{ $t(`message['只展示具有映射关系的文本']`) }}）
    </span>
    <div
      v-if="haveChildrenData"
      class="mapping-check-wrapper"
      v-loading="dialogLoading">
      <el-collapse v-model="activeNames">
        <template v-for="item in mappingConvert">
          <el-collapse-item
            v-if="item.data.length > 0"
            :key="item.key"
            :title="getCollapseTitle(item.key)"
            :name="item.key"
            :class="{
              'collapse-item-error': getItemHasToValueError(item.data),
            }">
            <div class="mapping-check-field-container">
              <div class="mapping-check-relation-list">
                <div
                  class="mapping-check-relation-item"
                  v-for="(data, index) in item.data"
                  :key="`${answerText(data)}_${index}`"
                  :class="{ 'item-error': data.to_value_error }">
                  <div class="item-box">{{ answerText(data) }}</div>
                  <i class="el-icon-right"></i>
                  <div class="mapping-to-value">
                    <template v-if="data.to_value.length > 0">
                      <div
                        class="item-box"
                        v-for="value in data.to_value"
                        :key="value">
                        {{ value.to_value || '' }}
                      </div>
                    </template>
                    <div v-else class="item-box"></div>
                  </div>
                  <i
                    v-if="data.to_value_error"
                    class="el-icon-refresh"
                    @click="getMappingConvert"></i>
                </div>
              </div>
              <p
                v-if="getItemHasToValueError(item.data)"
                class="not-find-error-tip">
                注：未找到相应的投监系统编码，请在系统 “
                <a :href="paramMapConfigUrl" target="_blank">
                  参数值映射配置表
                </a>
                ” 中增加相应配置
              </p>
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
    <el-empty
      v-else
      :description="$t(`message['暂无具有映射关系的拆分文本']`)"></el-empty>
    <span slot="footer">
      <el-button type="primary" @click="close">
        {{ $t(`message['确定']`) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  answerText,
  getCollapseTitle,
  getItemHasToValueError,
} from '../common/utils';
export default {
  name: 'mapping-relation-check-dialog',
  data() {
    return {
      loading: false,
      activeNames: '',
    };
  },
  props: {
    qid: {
      type: Number,
      required: true,
    },
    dialogLoading: {
      type: Boolean,
      default: false,
    },
    mappingConvert: {
      type: Array,
      required: true,
    },
  },
  computed: {
    haveChildrenData() {
      return !!this.mappingConvert.find((item) => item.data.length > 0);
    },
    paramMapConfigUrl() {
      return `${window.location.pathname}#/citics-tg/paramMapConfig`;
    },
  },
  watch: {
    mappingConvert: {
      handler() {
        this.activeNames = this.mappingConvert[0]?.key;
      },
      immediate: true,
    },
  },
  mounted() {
    this.getMappingConvert();
  },
  methods: {
    answerText,
    getCollapseTitle,
    getItemHasToValueError,
    close() {
      this.$emit('close');
    },
    getMappingConvert() {
      this.$emit('get-mapping-convert');
    },
  },
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.mapping-check-dialog {
  .el-dialog__body {
    height: 45vh;
    overflow-y: auto;
  }
}
</style>
