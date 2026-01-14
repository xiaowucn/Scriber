<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'CITICS-TG-App',
  data() {
    return {};
  },
  async created() {
    this.fetchSchemas();
    this.fetchSchemaItems();
    this.getBusinessGroups();
    this.fetchAllTemplates();
    this.fetchProductTypes();
    document.title = '参数提取稽核';
  },
  methods: {
    async fetchSchemas() {
      try {
        await this.$store.dispatch('citicsTgModule/fetchSchemas');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchSchemaItems() {
      try {
        await this.$store.dispatch('citicsTgModule/fetchSchemaItems');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async getBusinessGroups() {
      try {
        await this.$store.dispatch('citicsTgModule/fetchBusinessGroups');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchAllTemplates() {
      try {
        await this.$store.dispatch('citicsTgModule/fetchAllTemplates');
      } catch (error) {
        this.$notify({
          title: '错误',
          message: error.message,
          type: 'error',
        });
      }
    },
    async fetchProductTypes() {
      try {
        await this.$store.dispatch('citicsTgModule/fetchProductTypes');
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
<style lang="scss">
@import './style.scss';
</style>
