<template>
  <div class="identify-aside" v-show="!isShowRemarkType">
    <el-tabs
      ref="tabs"
      v-model="activeName"
      :stretch="true"
      @tab-click="handleTabClick(activeName)">
      <el-tab-pane v-if="isShowKeywordsTab" label="关键字" name="keywords">
        <keywords-aside
          ref="keywords"
          selectedType="widget-keywords"
          :data="keywordsAnswers"
          @update-answers="updateAnswers" />
      </el-tab-pane>
      <el-tab-pane
        v-if="isShowSensitiveWordsTab"
        label="敏感词"
        name="sensitiveWords">
        <sensitive-words-aside
          ref="sensitiveWords"
          selectedType="widget-sensitive-words"
          :data="answersData.sensitive_word"
          @update-answers="updateAnswers" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EventBus from '@/components/remark/remark-tree/EventBus';
import KeywordsAside from '@/custom/nafmii/components/KeywordsAside';
import SensitiveWordsAside from '@/custom/nafmii/components/SensitiveWordsAside';
import { nafmii as nafmiiApi } from '../../../store/api';
import { UPDATE_ANSWERS_FIELD } from '../common/constant';

export default {
  name: 'identify-aside',
  components: {
    KeywordsAside,
    SensitiveWordsAside,
  },
  props: {
    isShowRemarkType: {
      type: Boolean,
      default: true,
    },
    answersData: {
      type: Object,
      default: () => {},
    },
    fileId: {
      type: Number,
      required: true,
    },
    viewerReady: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: 'keywords',
      widgetTypes: [
        {
          type: 'rect',
          subType: 'widget-keywords',
          classNames: ['widget-keywords'],
          operations: [],
        },
        {
          type: 'rect',
          subType: 'widget-sensitive-words',
          classNames: ['widget-sensitive-words'],
          operations: [],
        },
      ],
    };
  },
  watch: {
    remarkTaskTypes: {
      handler() {
        this.getActiveName();
      },
      immediate: true,
    },
    '$route.query.type'() {
      this.getActiveName();
    },
    viewerReady() {
      if (this.viewerReady) {
        EventBus.$emit('set-widget-types', this.widgetTypes);
      }
    },
  },
  computed: {
    ...mapGetters('remarkModule', ['remarkTaskTypes']),
    ...mapGetters('remarkModule', ['remarkFile']),

    isShowKeywordsTab() {
      return (
        this.remarkTaskTypes.includes('keywords') && this.answersData?.keyword
      );
    },
    isShowSensitiveWordsTab() {
      return (
        this.remarkTaskTypes.includes('sensitiveWords') &&
        this.answersData.sensitive_word
      );
    },
    keywordsAnswers() {
      const keywords = this.remarkFile.keywords;
      const answers = keywords.map((keyword) => {
        const hasDataIndex = this.answersData.keyword.findIndex(
          (item) => item.key === keyword,
        );
        if (hasDataIndex !== -1) {
          return this.answersData.keyword[hasDataIndex];
        } else {
          return {
            key: keyword,
            items: [],
          };
        }
      });
      return answers;
    },
  },
  methods: {
    getActiveName() {
      if (this.isShowKeywordsTab) {
        this.activeName = 'keywords';
      } else if (this.isShowSensitiveWordsTab) {
        this.activeName = 'sensitiveWords';
      }
      if (!this.isShowRemarkType) {
        this.$store.commit('remarkModule/SET_REMARK_TAB', this.activeName);
      }
    },
    handleTabClick(name) {
      this.$store.commit('remarkModule/SET_REMARK_TAB', name);
    },
    async updateAnswers(answers, type) {
      try {
        const data = {
          field: UPDATE_ANSWERS_FIELD[this.activeName],
          words: answers,
        };
        await nafmiiApi.updateAnswers(this.fileId, data);
        this.$emit('answers-updated-success');
        this.$notify({
          title: '成功',
          message: `${type}成功`,
          type: 'success',
        });
      } catch (error) {
        this.$notify({
          title: '提示',
          message: error.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.identify-aside {
  ::v-deep .el-tabs {
    width: 100%;
  }
}
</style>
