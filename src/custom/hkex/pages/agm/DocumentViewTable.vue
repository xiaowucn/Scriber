<template>
  <div class="hkex-v2-document-view__table">
    <el-table v-show="showDocumentTable" :data="documentFlows" stripe>
      <el-table-column>
        <el-table-column align="center" width="50px">
          <template slot="header" slot-scope="{}"></template>
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="125px">
          <template slot="header" slot-scope="{}">
            <el-button type="text" @click="sortDocument('stock_code')">
              Stock Code
              <i
                :class="[
                  documentSort.stock_code === 1 && documentFilter.desc === 1
                    ? 'el-icon-caret-top'
                    : 'el-icon-caret-bottom',
                  documentSort.stock_code === 1 ? 'active' : '',
                ]"></i>
            </el-button>
          </template>

          <template slot-scope="scope">
            {{ scope.row.stock_code }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120px">
          <template slot="header" slot-scope="{}">
            <el-button type="text" @click="sortDocument('company_name')">
              Company Name
              <i
                :class="[
                  documentSort.company_name === 1 && documentFilter.desc === 1
                    ? 'el-icon-caret-top'
                    : 'el-icon-caret-bottom',
                  documentSort.company_name === 1 ? 'active' : '',
                ]"></i>
            </el-button>
          </template>

          <template slot-scope="scope">
            {{ scope.row.company_name }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" min-width="200px">
          <template slot="header" slot-scope="{}">
            <el-button type="text">Headline</el-button>
          </template>
          <template slot-scope="scope">
            <p class="headline" :title="scope.row.headline">
              {{ scope.row.headline }}
            </p>
            <router-link
              :to="{
                name: reportReviewRouterName,
                params: {
                  qid: scope.row.qid,
                },
                query: {
                  fileId: scope.row.fid,
                  schemaId: scope.row.mold_id,
                  rule: rules[0] && rules[0].rule,
                },
              }">
              {{ scope.row.title }}
            </router-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" width="145px">
          <template slot="header" slot-scope="{}">
            <el-button type="text"> No. of Non-Compliance </el-button>
          </template>
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="hkex-popper"
              :disabled="scope.row.nc_stats.length === 0">
              <template>
                <h4>Disclosure</h4>
                <ul>
                  <li v-for="(nc, index) in scope.row.nc_stats" :key="index">
                    <router-link
                      :to="{
                        name: reportReviewRouterName,
                        params: {
                          qid: scope.row.qid,
                        },
                        query: {
                          fileId: scope.row.fid,
                          schemaId: scope.row.mold_id,
                          rule: nc.rule,
                        },
                      }">
                      {{ nc.main_alias }}
                    </router-link>
                  </li>
                </ul>
              </template>
              <el-button
                type="text"
                slot="reference"
                :class="[scope.row.nc_stats.length === 0 ? 'unavailable' : '']">
                {{ scope.row.nc_stats.length }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" width="135px">
          <template slot="header" slot-scope="{}">
            <el-button type="text" @click="sortDocument('release_time')">
              Release Time
              <i
                :class="[
                  documentSort.release_time === 1 && documentFilter.desc === 1
                    ? 'el-icon-caret-top'
                    : 'el-icon-caret-bottom',
                  documentSort.release_time === 1 ? 'active' : '',
                ]"></i>
            </el-button>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.release_time | datetime }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { hkexReportType } from '@/store/constants';

export default {
  name: 'document-view-for-result-announcement-by-document',
  props: {
    showDocumentTable: {
      type: Boolean,
      required: false,
      default: true,
    },
    documentFlows: {
      type: Array,
      required: true,
    },
    documentFilter: {
      type: Object,
      required: true,
    },
    documentSort: {
      type: Object,
      required: true,
    },
    sortDocument: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType']),
    ...mapGetters('hkexModule/ruleModule', ['rules']),
    reportReviewRouterName() {
      return hkexReportType[this.auditType].reportReviewRouterName;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../../common/color.scss';
::v-deep .el-table {
  thead {
    th {
      border-right: none;
    }
    tr:first-child {
      display: none;
    }
  }
  .cell {
    .el-button--text {
      color: $--color-primary;
      &.unavailable {
        cursor: default;
        color: #333;
      }
    }
    .headline {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 5px;
    }
  }
}
</style>

<style lang="scss">
@import '../../common/color.scss';
.hkex-popper {
  min-width: 100px;
  text-align: center;
  ul {
    li {
      margin: 5px 0;
      list-style: none;
    }
  }
  :is(a) {
    color: $--color-primary;
    text-decoration: underline;
  }
  i {
    font-size: 12px;
    color: $--color-primary;
  }
}
</style>
