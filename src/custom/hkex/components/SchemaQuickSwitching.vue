<template>
  <div v-if="showSchemaQuickSwitching" class="schema-quick-switching">
    <el-button
      type="primary"
      v-for="(item, index) in schemaList"
      :key="index"
      size="mini"
      plain
      @click="swtichSchema(item)">
      To {{ item.label }}
    </el-button>
  </div>
</template>

<script>
import FileMarkableMixin from '../../../components/mixins/FileMarkableMixin';

const needSwtichingSchemas = [
  {
    mold: 29,
    label: 'helper',
  },
  {
    mold: 5,
    label: 'A',
  },
  {
    mold: 15,
    label: 'B',
  },
  {
    mold: 18,
    label: 'C',
  },
];

export default {
  name: 'schema-quick-switching',
  mixins: [FileMarkableMixin],
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      schemaList: [],
    };
  },
  computed: {
    showSchemaQuickSwitching() {
      const currentMold = Number(this.$route.query.schemaId);
      return needSwtichingSchemas.map((s) => s.mold).includes(currentMold);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getFiles();
      this.setSwtichingSchemaList();
    },
    async getFiles() {
      this.$store.commit('detailModule/SET_DIR_ID', this.$route.query.treeId);
      await this.$store.dispatch('detailModule/fetchFileList');
    },
    setSwtichingSchemaList() {
      if (!this.file.questions) {
        return;
      }

      const needSwtichingSchemaIds = needSwtichingSchemas.map((i) => i.mold);
      const schemas = this.file.questions.filter((item) =>
        needSwtichingSchemaIds.includes(item.mold),
      );
      const currentShemaId = Number(this.$route.query.schemaId);
      const { pid, tree_id, id, name, question_status, pdf_parse_status } =
        this.file;

      needSwtichingSchemas.forEach((item) => {
        schemas.forEach((i) => {
          if (i.mold === item.mold) {
            Object.assign(item, i, {
              pid,
              tree_id,
              id,
              qid: i.id,
              name,
              question_status,
              pdf_parse_status,
            });
          }
        });
      });
      this.schemaList = needSwtichingSchemas.filter(
        (i) => i.mold !== currentShemaId,
      );
    },
    swtichSchema(item) {
      this.previewFileByRemark(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-quick-switching {
  display: flex;
  align-items: center;
}
</style>
