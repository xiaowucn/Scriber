<template>
  <el-dialog
    visible
    custom-class="push-content-dialog"
    :before-close="close"
    :close-on-click-modal="false">
    <span slot="title">
      {{ $t(`message['推送内容查看']`) }}
    </span>
    <div v-if="haveChildrenData">
      <div class="params-content mapping-check-wrapper">
        <el-collapse v-model="activeNames" accordion>
          <template v-for="item in mappingConvert">
            <el-collapse-item
              v-if="item.data && item.data.length > 0"
              :key="item.key"
              :title="item.key"
              :name="item.key">
              <div class="mapping-check-field-container">
                <div class="mapping-check-relation-list">
                  <div
                    class="mapping-check-relation-item"
                    v-for="(data, index) in item.data"
                    :key="`${answerText(data)}_${index}`">
                    <div
                      class="item-box"
                      :class="{ 'origin-item': !data.to_value }">
                      {{ answerText(data) }}
                    </div>
                    <template v-if="data.to_value">
                      <i class="el-icon-right"></i>
                      <div class="mapping-to-value">
                        <template v-if="data.to_value.length > 0">
                          <div
                            class="item-box"
                            v-for="(value, index) in data.to_value"
                            :key="index">
                            {{ value.to_value || '' }}
                          </div>
                        </template>
                        <div v-else class="item-box"></div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse>
      </div>
    </div>
    <el-empty v-else :description="$t(`message['推送内容为空']`)"></el-empty>
  </el-dialog>
</template>

<script>
import { answerText, getCollapseTitle } from '../common/utils';
import { mapGetters } from 'vuex';
import _ from 'lodash';
export default {
  name: 'push-content-dialog',
  props: {
    currentViewContent: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mappingConvert: [],
      activeNames: '',
      currentContentAnswer: null,
    };
  },
  computed: {
    ...mapGetters('citicsTgModule', ['templates']),
    haveChildrenData() {
      return !!this.mappingConvert.find((item) => item.data.length > 0);
    },
  },
  watch: {
    currentViewContent: {
      handler() {
        this.currentContentAnswer = this.currentViewContent.answer;
        this.convertContentData();
      },
      immediate: true,
    },
  },
  methods: {
    answerText,
    getCollapseTitle,
    close() {
      this.$emit('close');
    },
    convertContentData() {
      const data = [];
      Object.keys(this.currentContentAnswer).forEach((key) => {
        const fieldData = this.currentContentAnswer[key];
        const dataItem = {};
        dataItem.key = key.split('(')[0];
        dataItem.data = [];
        if (!_.isEmpty(fieldData)) {
          if (Array.isArray(fieldData)) {
            fieldData.forEach((item) => {
              Object.keys(item).forEach((fieldKey) => {
                dataItem.data.push(...item[fieldKey].data);
              });
            });
          } else if (fieldData.data.length > 0) {
            dataItem.data = fieldData.data;
          } else {
            dataItem.data = [fieldData];
          }
        }
        data.push(dataItem);
      });
      this.mappingConvert = data;
      this.activeNames = this.mappingConvert.find(
        (item) => item.data.length > 0,
      )?.key;
    },
  },
};
</script>

<style lang="scss">
.push-content-dialog {
  .el-dialog__body {
    height: 45vh;
    overflow-y: auto;
  }
}
</style>
