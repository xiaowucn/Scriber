import { searchScene } from '../../../store/api/cmfchina.api';

export default {
  name: 'cmfchina-search-mixin',
  created() {
    this.getSchemas();
  },
  methods: {
    async getSchemas() {
      try {
        const params = {
          page: 1,
          size: 9999,
        };
        const res = await searchScene(params);
        const schemaItems = res.data.items.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.searchData.contentOptions.find(
          (item) => item.value === 'mid',
        ).options = schemaItems;
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
