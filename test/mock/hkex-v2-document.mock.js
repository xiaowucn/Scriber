export const progressSummary = {
  status: 'ok',
  data: {
    completed_ar_cnt: 1109,
    to_start_ar_cnt: 153,
    total_ar_cnt: 1262,
    total_flagged_cnt: 12,
  },
};

export const documentData = {
  status: 'ok',
  data: {
    page: 1,
    size: 10,
    total: 1,
    items: [
      {
        stock_code: '00388',
        company_name: 'HKEX',
        related_ars: [
          {
            financial_year: 2018,
            published_time: null,
            ar_status: 0,
            file_id: null,
            tree_id: null,
            project_id: null,
            question_id: null,
          },
          {
            financial_year: 2017,
            published_time: 'Apr 26 2017',
            ar_status: 1,
            file_id: 123,
            tree_id: 321,
            project_id: 123,
            question_id: 123,
          },
          {
            financial_year: 2016,
            published_time: 'Apr 26 2016',
            ar_status: 7,
            file_id: 123,
            tree_id: 321,
            project_id: 123,
            question_id: 123,
          },
        ],
      },
    ],
  },
};

export const flaggedData = {
  status: 'ok',
  data: {
    page: 1,
    size: 10,
    total: 1, // 年报总数
    items: [
      {
        id: 33, // 年报id
        tree_id: 9, // 年报目录id
        pid: 4, // 年报所属项目id
        stock_code: '00018',
        published_time: '1567047273', // unix timestamp with utc+8(s)
        company_name_en: 'HKEX', // 公司名(英文)
        company_name_cn: '香港证券交易所', // 公司名(中文)
        name: '300 Shenji Group Kunming Machine Tool Co. Ltd. - 2017.pdf', // 文件名(带后缀)
        hash: 'ec1205bfcc16470a35f53fd9443c18cd',
        pdf: 'ec1205bfcc16470a35f53fd9443c18cd',
        pdf_flag: null,
        tags: [],
        qid: 8920, // 关联的question_id
        page: 215,
        size: 1223919,
        mold: 5, // 关联的schema_id
        pdf_parse_status: 4,
        mark_uids: null,
        mark_users: null,
        last_mark_utc: null,
        pdfinsight: '233f7aba357446753e37b28f61e2e92b',
        progress: null,
        question_status: 0,
        question_health: 2,
        my_answer: null,
        preset_answer: true,
        question_ai_status: 1,
        origin_health: 2,
        working_by: null,
      },
    ],
  },
};

export const documentSummary = {
  status: 'ok',
  data: {
    '2019': {
      available_ar_cnt: 0,
      to_be_released_ar_cnt: 10,
      flagged_ar_cnt: 0,
      completed_ar_cnt: 0,
    },
    '2018': {
      available_ar_cnt: 10,
      to_be_released_ar_cnt: 0,
      flagged_ar_cnt: 1,
      completed_ar_cnt: 9,
    },
    '2017': {
      available_ar_cnt: 10,
      to_be_released_ar_cnt: 0,
      flagged_ar_cnt: 1,
      completed_ar_cnt: 10,
    },
    '2016': {
      available_ar_cnt: 10,
      to_be_released_ar_cnt: 0,
      flagged_ar_cnt: 0,
      completed_ar_cnt: 10,
    },
  },
};
