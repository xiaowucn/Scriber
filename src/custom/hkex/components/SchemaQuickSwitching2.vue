<template>
  <div v-if="show" class="remark-quick-switching">
    <el-button
      type="primary"
      v-for="(item, index) in schemaList"
      :key="index"
      size="mini"
      plain
      @click="switchUrl(item)">
      To {{ item.name }}
    </el-button>
  </div>
</template>

<script>
import { fetchPollMeta } from '../../../store/api/hkex.api';

const switchingSchemas = [
  {
    molds: [33, 37],
    modules: [
      {
        name: 'POLL',
        url: '',
      },
      {
        name: 'MR',
        url: '',
      },
    ],
  },
  {
    molds: [34, 38],
    modules: [
      {
        name: 'AGM',
        url: '',
      },
      {
        name: 'MR',
        url: '',
      },
    ],
  },
  {
    molds: [36],
    modules: [
      {
        name: 'AGM',
        url: '',
      },
      {
        name: 'POLL',
        url: '',
      },
    ],
  },
];

export default {
  name: 'schema-quick-switching2',
  data() {
    return {
      schemaList: [],
    };
  },
  computed: {
    show() {
      const currentMold = Number(this.$route.query.schemaId);
      return switchingSchemas.find((s) => s.molds.includes(currentMold));
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.show) {
        this.getPollMeta();
      }
    },
    async getPollMeta() {
      try {
        const { fileId: file_id, schemaId: mold_id } = this.$route.query;
        const res = await fetchPollMeta({ file_id, mold_id });
        this.schemaList =
          switchingSchemas.find((s) => s.molds.includes(Number(mold_id)))
            ?.modules || [];
        this.schemaList.forEach((item) => {
          item.url = res[item.name.toLowerCase()].url;
        });
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
        });
      }
    },
    switchUrl(item) {
      if (!item.url) {
        this.$notify({
          title: 'Info',
          message: `No valid ${item.name.toLowerCase()} found`,
          type: 'info',
          duration: 1500,
          offset: 40,
        });
        return;
      }

      window.location.href = item.url;
    },
  },
};
</script>

<style lang="scss" scoped>
.remark-quick-switching {
  display: flex;
  align-items: center;
}
</style>
