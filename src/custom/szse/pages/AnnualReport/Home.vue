<template>
  <div class="annual-report-home">
    <div>
      <div class="common-list task-list">
        <div class="common-header task-header">
          <div class="title">任务列表</div>
          <el-button type="text">查看全部</el-button>
        </div>
        <ul class="common-details task-details">
          <li v-for="(item, index) in taskList" :key="index">
            <span>{{ item }}</span>
            <el-button type="text" size="small">去复核 >></el-button>
          </li>
        </ul>
      </div>
      <div class="common-list quiry-list">
        <div class="common-header">
          <div class="title">问询比例</div>
          <el-select v-model="quiryYearSelected" size="mini">
            <el-option value="2020" label="2020"></el-option>
          </el-select>
        </div>
        <div class="common-details quiry-details">
          <div
            v-for="quiryItem in quiryPieOptions"
            class="quiry-percentage"
            :class="quiryItem.key"
            :key="quiryItem.key">
            <div class="quiry-pie" :ref="quiryItem.key"></div>
            <ul class="quiry-data">
              <li
                v-for="item in quiryItem.data"
                :key="item.name"
                :style="{ color: item.itemStyle.color }">
                <span>{{ item.name }}</span>
                <span>{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="common-list company-list">
      <div class="common-header company-header">
        <div class="title">公司列表</div>
        <div class="search">
          <dl>
            <dt class="attention-icon"></dt>
            <dd>关注数量</dd>
            <dt class="quiry-icon el-icon-question"></dt>
            <dd>提问数量</dd>
            <dt class="track-icon"></dt>
            <dd>追踪报告</dd>
          </dl>
          <el-input
            v-model="companyListSearchFilter.code"
            placeholder="请输入公司代码"
            size="mini"
            suffix-icon="el-icon-search"
            clearable
            @keyup.enter.native="getCompanyList({ page: 1 })"
            @clear="getCompanyList({ page: 1 })"></el-input>
        </div>
      </div>
      <div class="common-details company-details">
        <el-table
          :data="companyList.items"
          :header-cell-style="{ background: '#fafafa' }">
          <el-table-column
            prop="code"
            label="公司代码"
            align="center"></el-table-column>
          <el-table-column
            prop="name"
            label="公司名称"
            align="center"></el-table-column>
          <template v-for="year in companyList.yearColumns">
            <el-table-column
              :key="year"
              :label="`${year}年`"
              align="center"
              min-width="150px">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.grouped_projects[year]"
                  class="project-detail">
                  <div>
                    <el-button
                      type="text"
                      @click="
                        gotoProjectAudit(scope.row.grouped_projects[year])
                      ">
                      {{ scope.row.grouped_projects[year].date }}
                    </el-button>
                    <div class="project-summary">
                      <template
                        v-if="scope.row.grouped_projects[year].attention_count">
                        <i class="attention-icon"></i>
                        <span>{{
                          scope.row.grouped_projects[year].attention_count
                        }}</span>
                      </template>
                      <template
                        v-if="scope.row.grouped_projects[year].question_count">
                        <i class="quiry-icon el-icon-question"></i
                        ><span>{{
                          scope.row.grouped_projects[year].question_count
                        }}</span>
                      </template>
                    </div>
                  </div>
                  <i
                    v-if="scope.row.grouped_projects[year].is_track"
                    class="track-icon"></i>
                </div>
                <span v-else>未发布</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="`${year}-rating`"
              label="评级"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.grouped_projects[year]">{{
                  scope.row.grouped_projects[year].rating
                }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          background
          layout="total,prev, pager, next"
          :current-page="companyList.page"
          :page-size="companyList.size"
          :total="companyList.total"
          @current-change="(page) => getCompanyList({ page })">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchCompany } from '@/store/api/szse-annual.api';

const taskMockData = [
  '公司002010传化智联于2021.7.231400披露了2020年年报,A预审已完成',
  '公司300352北信源2020年年报,已提交初审',
  '公司300352北信源于2021.7.2314:00披露了2020年年报,A预审已完成',
  '公司002010传化智联于2021.7.2314:00披露了2020年年报,A预审已完成',
  '公司300352北信源2020年年报,已复审通过',
];

const quiryPercentageMockData = {
  2020: {
    first: [
      { name: '问询', value: 280, itemStyle: { color: '#1890FF ' } },
      { name: '主板', value: 720, itemStyle: { color: '#E1EDFC' } },
    ],
    second: [
      { name: '问询', value: 220, itemStyle: { color: '#5DDEAD' } },
      { name: '创业板', value: 780, itemStyle: { color: '#E1F2EC' } },
    ],
  },
};

export default {
  name: 'szse-annual-report-home',
  data() {
    return {
      taskList: taskMockData,
      quiryPercentage: quiryPercentageMockData,
      companyList: {
        page: 1,
        size: 10,
        total: 0,
        items: [],
        yearColumns: [],
      },
      quiryYearSelected: '',
      companyListSearchFilter: {
        code: '',
      },
    };
  },
  computed: {
    quiryPieOptions() {
      if (this.quiryYearSelected) {
        const data = this.quiryPercentage[this.quiryYearSelected];

        return Object.keys(data).map((key) => ({
          key,
          percent: Math.trunc((data[key][0].value / data[key][1].value) * 100),
          data: data[key],
        }));
      }

      return [];
    },
  },
  watch: {
    async quiryPieOptions() {
      await this.$nextTick();

      this.quiryPieOptions.forEach((item) => {
        const chart = this.$echarts.init(this.$refs[item.key][0]);
        chart.setOption({
          title: {
            text: '问询比例',
            textStyle: {
              color: 'rgba(0,0,0,0.45)',
              fontWeight: 'normal',
              fontSize: 14,
            },
            subtext: item.percent + '%',
            subtextStyle: {
              color: '#000',
              fontWeight: 'normal',
              fontSize: 20,
            },
            top: '36%',
            left: 'center',
          },
          series: [
            {
              type: 'pie',
              label: {
                show: false,
              },
              radius: ['50%', '70%'],
              data: item.data,
            },
          ],
        });
      });
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      await Promise.all([this.getQuiryPercentage(), this.getCompanyList()]);
    },
    async getQuiryPercentage() {
      this.quiryYearSelected = '2020';
    },
    async getCompanyList(params = {}) {
      const { page, size } = this.companyList;
      let filter = {};
      if (this.companyListSearchFilter.code) {
        filter = {
          field: 'code',
          keyword: this.companyListSearchFilter.code,
        };
      }

      const { data } = await fetchCompany({
        page,
        size,
        ...filter,
        ...params,
      });

      const yearColumnsSet = new Set();
      data.items.forEach((item) =>
        Object.keys(item.grouped_projects).forEach((year) =>
          yearColumnsSet.add(year),
        ),
      );
      const yearColumns = Array.from(yearColumnsSet)
        .map(Number)
        .sort()
        .reverse();

      this.companyList = { ...data, yearColumns };
    },
    gotoProjectAudit(project) {
      this.$router.push({
        path: `/szse/audit/${project.id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
$menu-height: 65px;

* {
  box-sizing: border-box;
}

.attention-icon {
  display: block;
  width: 12px;
  height: 12px;
  background: url('~@/custom/szse/assets/attention.svg') no-repeat;
  background-size: contain;
}

.track-icon {
  display: block;
  width: 12px;
  height: 12px;
  background: url('~@/custom/szse/assets/track.svg') no-repeat;
  background-size: contain;
}

.quiry-icon {
  color: #4b7dd0;
}

.annual-report-home {
  display: flex;
  flex-flow: column;
  row-gap: 20px;
  padding: 30px;
  width: 100vw;
  height: calc(100vh - #{$menu-height});
  overflow: auto;
  background: #f0f2f5;
  font-size: 14px;
  color: #666666;

  & > div:first-of-type {
    display: flex;
    flex-flow: row;
    column-gap: 20px;

    & > .common-list {
      flex: 1;
    }
  }
}

.common-list {
  background: white;
}

.quiry-list {
  display: flex;
  flex-flow: column;
}

.company-list {
  width: 100%;
}

.common-header {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 50px;
  border-bottom: 1px solid #e9e9e9;

  .title {
    &::before {
      content: '';
      display: inline-block;
      margin-right: 10px;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: #4b7dd0;
    }
  }
}

.task-header {
  button {
    font-weight: normal;
  }
}

.company-header {
  .search {
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 20px;

    dl {
      display: flex;
      flex-flow: row;
      align-items: center;
      white-space: nowrap;

      dt {
        margin-right: 10px;

        &:not(:first-of-type) {
          margin-left: 20px;
        }
      }
    }
  }
}

.common-details {
  padding: 10px;
}

.task-details {
  list-style: none;

  li {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    height: 40px;
    border-bottom: 1px solid #e9e9e9;

    button {
      display: none;
      font-weight: normal;
    }

    &:hover {
      button {
        display: block;
      }
    }
  }
}

.quiry-details {
  flex: 1;
  display: flex;
  flex-flow: row;

  .quiry-percentage {
    flex: 1;
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 20px;

    .quiry-pie {
      width: 200px;
      height: 200px;
    }

    .quiry-data {
      flex: 1;

      li {
        margin-bottom: 10px;

        span {
          display: inline-block;
          font-size: 14px;
          color: #333333;

          &:first-of-type {
            margin-right: 10px;
            width: 50px;
            border-right: 1px solid #e9e9e9;
          }
        }
      }
    }
  }
}

.company-details {
  .project-detail {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;

    & > div {
      display: flex;
      flex-flow: column;
      align-items: center;
    }

    button {
      padding-top: 4px;
      padding-bottom: 4px;
      text-decoration: underline;
    }

    .track-icon {
      margin-left: 10px;
      width: 16px;
      height: 16px;
    }
  }

  .project-summary {
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 10px;

    span {
      white-space: nowrap;
    }
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
