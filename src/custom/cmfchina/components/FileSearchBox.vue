<template>
  <search-box :searchData="searchData" @search="searchFiles" />
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import SearchBox from './SearchBox';
import {
  PDF_PARSE_STATUS_SEARCH_OPTION,
  AI_STATUS_SEARCH_OPTION,
} from '../common/constant';
import SearchProjectOrFileMixin from '../mixins/SearchProjectOrFileMixin';

export default {
  name: 'file-search-box',
  components: { SearchBox },
  mixins: [SearchProjectOrFileMixin],
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    treeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      searchData: {
        dateOptions: [
          {
            value: 'created_utc',
            label: '上传时间',
          },
          {
            value: 'updated_utc',
            label: '修改时间',
          },
        ],
        contentOptions: [
          {
            value: 'name',
            label: '文件名称',
          },
          {
            value: 'id',
            label: '文件ID',
          },
          {
            value: 'user_name',
            label: '上传用户',
          },
          PDF_PARSE_STATUS_SEARCH_OPTION,
          AI_STATUS_SEARCH_OPTION,
          {
            value: 'mid',
            label: '场景名称',
            options: [],
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('projectModule', ['projectSearchParams']),
    ...mapGetters('detailModule', ['fileViewer']),
  },
  methods: {
    validateSearchVal(searchParams) {
      let reg = /^[0-9]*$/;
      if (searchParams.id && !reg.test(searchParams.id)) {
        this.$notify({
          title: '警告',
          message: '文件ID必须为数字',
          type: 'warning',
        });
        return false;
      }
      return true;
    },
    goBackProjectDetail() {
      const pager = {
        ...this.fileViewer.pager,
        page: 1,
      };
      const routeParams = {
        name: 'projectDetail',
        params: { treeId: this.treeId, projectId: this.projectId },
      };
      this.$router.push(routeParams);
      this.$store.commit('detailModule/SET_FILES_PAGER', pager);
    },
    async searchFiles(searchParams) {
      if (!this.validateSearchVal(searchParams)) {
        return;
      }

      if (_.isEmpty(searchParams)) {
        this.goBackProjectDetail();
        return;
      }

      const routeParams = {
        name: 'fileSearch',
        query: {
          projectId: this.projectId,
          treeId: this.treeId,
          ...searchParams,
        },
      };
      this.$router.push(routeParams);
    },
  },
};
</script>
