export default {
  name: 'project-list-mixin',
  filters: {
    getAIParseStatus(status) {
      switch (status) {
        case -1:
          return '不需要预测';
        case 0:
          return '排队中';
        case 1:
          return '预测中';
        case 2:
          return '预测失败';
        case 3:
          return '已提取';
        case 4:
          return '未绑定模型, 不预测';
        default:
          return '排队中';
      }
    },
    getComplianceAIParseStatus(status) {
      switch (status) {
        case -1:
          return '不需要预测';
        case 0:
          return '排队中';
        case 1:
          return '预测中';
        case 2:
          return '预测失败';
        case 3:
          return '已完成';
        case 4:
          return '未绑定模型, 不预测';
        default:
          return '排队中';
      }
    },
    getAIParseProgress(status) {
      switch (status) {
        case -1:
          return 0;
        case 0:
          return 10;
        case 1:
          return 60;
        case 2:
          return 0;
        case 3:
          return 100;
        case 4:
          return 0;
        default:
          return 0;
      }
    },
    getFillInStatus(status) {
      switch (status) {
        case 0:
          return '待填报';
        case 1:
          return '填报中';
        case 2:
          return '已提交';
        default:
          return '-';
      }
    },
  },
  data() {
    return {
      reportYears: [
        {
          label: '2020',
          value: '2020',
        },
        {
          label: '2019',
          value: '2019',
        },
        {
          label: '2018',
          value: '2018',
        },
      ],
    };
  },
};
