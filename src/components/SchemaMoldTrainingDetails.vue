<template>
  <div class="schema-mold-training">
    <el-container>
      <el-main>
        <div>
          <el-button type="text" icon="el-icon-back" @click="goback"
            >返回</el-button
          >
        </div>
        <el-table :data="modelData.fieldList" style="width: 100%">
          <el-table-column prop="name" min-width="80" label="字段名称">
          </el-table-column>
          <el-table-column
            prop="rate"
            sortable
            align="center"
            width="200"
            label="准确率">
            <template slot-scope="scope">
              {{ scope.row.rate | conversionPercet }}
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'schema-mold-training-details',
  computed: {
    ...mapGetters('schemaModule', ['modelData']),
  },
  props: {
    schemaId: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.getModelFieldList();
  },
  methods: {
    async getModelFieldList() {
      const testId = Number(this.$route.query.testId);
      if (this.modelData.testList.length === 0) {
        await this.$store.dispatch('schemaModule/fetchModelTestList', {
          vid: Number(this.$route.query.vid),
        });
      }
      const modelFieldList = this.modelData.testList.find((item) => {
        return item.id === testId;
      });
      this.$store.commit(
        'schemaModule/SET_MODEL_TEST_FIELD_LIST',
        modelFieldList.data.result,
      );
    },
    goback() {
      history.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
