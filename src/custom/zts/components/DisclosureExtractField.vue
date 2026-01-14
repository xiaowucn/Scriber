<template>
  <div class="disclosure-extract-field">
    <div class="answer-list">
      <template v-for="(group, groupIndex) in resultTree">
        <disclosure-answer-item
          v-for="(item, index) in group.data"
          :answerItem="item"
          :answerLabel="item.data.label"
          :answerDocType="group.doc_type"
          :answerName="`${group.doc_type}${item.data.label}`"
          :answerUpdatedName="`${group.doc_type}${item.data.label}`"
          :fileId="fileId(group.doc_type)"
          :key="`${groupIndex}-${index}`" />
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import DisclosureAnswerItem from './DisclosureAnswerItem';

export default {
  name: 'disclosure-extract-field',
  components: { DisclosureAnswerItem },
  computed: {
    ...mapGetters('ztsDisclosureModule', ['detail']),

    resultTree() {
      const selectedTreeData =
        this.detail.mergedTreeData[this.detail.selectedRule.label];
      const resultTree = selectedTreeData.map((group) => {
        let result = [];
        group.data.childrenGroup[0].forEach((item) => {
          if (item.childrenGroup) {
            if (item.data.label === '资产受限金额合计') {
              const children = item.childrenGroup[0];
              const cloneItem = _.cloneDeep(
                children.find((child) => child.data.label === '受限金额'),
              );
              cloneItem.data.label = '资产受限金额合计';
              cloneItem.unit = '万元';
              result.push(cloneItem);
            } else if (item.data.label === '单项资产受限') {
              const cloneItem = _.cloneDeep(item);
              cloneItem.childrenGroup = item.childrenGroup.map((children) => {
                return children.filter((child) => {
                  if (child.data.label === '受限金额') {
                    child.unit = '万元';
                  }
                  if (child.data.label === '单位') {
                    child.hide = true;
                  }
                  return child;
                });
              });
              result.push(cloneItem);
            } else {
              result.push(item);
            }
          } else {
            result.push(item);
          }
        });
        return { ...group, data: result };
      });
      return resultTree;
    },

    fileId() {
      return (doc_type) =>
        this.detail.files.find((item) => item.doc_type === doc_type).id;
    },
  },
};
</script>

<style scoped lang="scss">
.disclosure-extract-field {
  .answer-list {
    padding: 0 20px;
  }
}
</style>
