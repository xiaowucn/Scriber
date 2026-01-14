<template>
  <div class="hkex-v2-document-view__table">
    <el-table
      v-show="showDocumentTable"
      :data="documentFlows"
      :span-method="documentTableSpan"
      stripe>
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
        <el-table-column align="center" width="160px">
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
        <el-table-column align="center" min-width="150px">
          <template slot="header" slot-scope="{}">
            <el-button type="text">Headline</el-button>
          </template>
          <template slot-scope="scope">
            <p>{{ scope.row.headline }}</p>
            <router-link
              :to="{
                name: reportReviewRouterName,
                params: {
                  qid: scope.row.qid,
                },
                query: {
                  fileId: scope.row.fid,
                  delist: isDelisted ? 1 : 0,
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
            <el-button type="text">
              Disclosure - No. of Non-Compliance/Red Flag(Non-Critical)
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="hkex-popper"
              :disabled="
                scope.row.flag_info.disclosure_check.non_critical_flags
                  .length === 0
              ">
              <template>
                <h4>Disclosure</h4>
                <ul>
                  <li
                    v-for="(disclosure, index) in scope.row.flag_info
                      .disclosure_check.non_critical_flags"
                    :key="index">
                    <router-link
                      :to="{
                        name: reportReviewRouterName,
                        params: {
                          qid: scope.row.qid,
                        },
                        query: {
                          fileId: scope.row.fid,
                          rule: disclosure.rule,
                          delist: isDelisted ? 1 : 0,
                        },
                      }">
                      {{ disclosure.main_alias }}
                    </router-link>
                  </li>
                </ul>
              </template>
              <el-button
                type="text"
                slot="reference"
                :class="[
                  scope.row.flag_info.disclosure_check.non_critical_flags
                    .length === 0
                    ? 'unavailable'
                    : '',
                ]">
                {{
                  scope.row.flag_info.disclosure_check.non_critical_flags.length
                }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" width="110px">
          <template slot="header" slot-scope="{}">
            <el-button type="text">Disclosure - Critical Flag</el-button>
          </template>
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.flag_info.disclosure_check.critical_flags.length === 0
              ">
              -
            </template>
            <ul v-else slot="reference">
              <li
                v-for="(disclosure, index) in scope.row.flag_info
                  .disclosure_check.critical_flags"
                :key="index">
                <router-link
                  :to="{
                    name: reportReviewRouterName,
                    params: {
                      qid: scope.row.qid,
                    },
                    query: {
                      fileId: scope.row.fid,
                      rule: disclosure.rule,
                      delist: isDelisted ? 1 : 0,
                    },
                  }">
                  {{ disclosure.main_alias }}
                </router-link>
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" width="110px">
          <template slot="header" slot-scope="{}">
            <el-button type="text"> Ratio - No. of Red Flag </el-button>
          </template>
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="hkex-popper"
              :disabled="scope.row.flag_info.ratio_check.length === 0">
              <template>
                <h4>Ratio</h4>
                <ul>
                  <li
                    v-for="(ratio, index) in scope.row.flag_info.ratio_check"
                    :key="index">
                    <router-link
                      :to="{
                        name: reportReviewRouterName,
                        params: {
                          qid: scope.row.qid,
                        },
                        query: {
                          fileId: scope.row.fid,
                          ratio: ratio,
                          delist: isDelisted ? 1 : 0,
                        },
                      }">
                      {{ ratio }}
                    </router-link>
                  </li>
                </ul>
              </template>
              <el-button
                type="text"
                slot="reference"
                :class="[
                  scope.row.flag_info.ratio_check.length === 0
                    ? 'unavailable'
                    : '',
                ]">
                {{ scope.row.flag_info.ratio_check.length }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column>
        <el-table-column align="center" width="135px">
          <template slot="header" slot-scope="{}">
            <el-button type="text" @click="sortDocument('release_date')">
              Release Time
              <i
                :class="[
                  documentSort.release_date === 1 && documentFilter.desc === 1
                    ? 'el-icon-caret-top'
                    : 'el-icon-caret-bottom',
                  documentSort.release_date === 1 ? 'active' : '',
                ]"></i>
            </el-button>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.release_date | datetime }}</span>
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
    reportYearOptions: {
      type: Array,
      required: true,
    },
    documentTableSpan: {
      type: Function,
      required: true,
    },
    sortDocument: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType', 'isDelisted']),
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
