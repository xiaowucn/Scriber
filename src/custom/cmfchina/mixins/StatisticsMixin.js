import dayjs from 'dayjs';

export default {
  data() {
    return {
      filter: {},
      originalData: [],
      tableData: {
        all: [],
        items: [],
        pager: {
          page: 1,
          size: 20,
          total: 0,
        },
      },
      activeBarIndex: 0,
    };
  },
  methods: {
    search(params) {
      this.filter = params;
      this.activeBarIndex = 0;
      this.tableData.pager.page = 1;
      this.$refs.table.clearSort();
      this.getStatData(params);
    },
    formatDate(timestamp) {
      const formatTypes = {
        0: 'YYYY-MM-DD',
        1: 'YYYY-MM',
      };
      return dayjs(timestamp * 1000).format(formatTypes[this.filter.type]);
    },
    convertToTableData(data, callback) {
      if (data.length === 0) {
        this.tableData.items = [];
        this.tableData.pager.page = 1;
        this.tableData.pager.total = 0;
        return;
      }

      const result = {};

      data[this.activeBarIndex].items.forEach((item) => {
        callback(item, result);
      });

      const items = Object.values(result);
      this.tableData.all = items;
      this.tableData.pager.total = items.length;
      const start = (this.tableData.pager.page - 1) * this.tableData.pager.size;
      const end = this.tableData.pager.page * this.tableData.pager.size;
      this.tableData.items = items.slice(start, end);
    },
    changeSort(sort) {
      switch (sort.order) {
        case 'ascending':
          this.tableData.all.sort((a, b) => a[sort.prop] - b[sort.prop]);
          break;
        case 'descending':
          this.tableData.all.sort((a, b) => b[sort.prop] - a[sort.prop]);
          break;
        default:
          this.tableData.all.sort(
            (a, b) => new Date(a.date) - new Date(b.date),
          );
          break;
      }
      this.tableData.pager.page = 1;
      this.tableData.items = this.tableData.all.slice(
        0,
        this.tableData.pager.size,
      );
    },
    convertPieData(data, title, seriesNames, attr1, attr2) {
      const total = data.reduce(
        (item, current) => {
          item[attr1] += current[attr1];
          item[attr2] += current[attr2];
          return item;
        },
        { [attr1]: 0, [attr2]: 0 },
      );
      this.chartData.pie = {
        title: title,
        seriesData: [
          { name: seriesNames[0], value: total[attr1] },
          { name: seriesNames[1], value: total[attr2] },
        ],
      };
    },
    convertBarData(data, seriesNames, attr1, attr2) {
      this.chartData.bar = {
        xAxisData: data.map((item) => item.name),
        series: [
          {
            name: seriesNames[0],
            data: data.map((item) => item[attr1]),
          },
          {
            name: seriesNames[1],
            data: data.map((item) => item[attr2]),
          },
        ],
      };
    },
    convertLineData(data, title, attr1, attr2, type = 'total') {
      this.chartData.line = {
        title: title,
        xAxisData:
          data[0]?.items.map((item) => this.formatDate(item.date)) || [],
        series: data.map((item, index) => {
          return {
            name: `${item.name}-${index}`,
            data: item.items.map((item) =>
              type === 'total' ? item[attr1] + item[attr2] : item[type],
            ),
          };
        }),
      };
    },
    formattLineChartTooltipContent(params) {
      let content = `<h4 style="margin-bottom:5px;">${params[0].name}</h4>`;
      content += `<div style="display:flex;flex-wrap:wrap;gap:5px;max-width:600px;margin-bottom:5px;">`;
      params.forEach((param) => {
        content += `<span style="min-width:145px;">${param.marker}${
          param.seriesName.split('-')[0]
        }: ${param.value}</span>`;
      });
      content += `</div>`;
      return content;
    },
    handleBarClicked(index) {
      this.activeBarIndex = index;
      this.tableData.pager.page = 1;
      this.$refs.table.clearSort();
      this.getTableData(this.originalData);
    },
    changeTablePage(page) {
      this.tableData.pager.page = page;
      const start = (this.tableData.pager.page - 1) * this.tableData.pager.size;
      const end = this.tableData.pager.page * this.tableData.pager.size;
      this.tableData.items = this.tableData.all.slice(start, end);
    },
    changeTableSize(size) {
      this.tableData.pager.size = size;
      this.changeTablePage(1);
    },
  },
};
