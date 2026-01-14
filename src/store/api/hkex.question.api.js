import { http, http_v2 } from './http';

export const fetchQuestionMeta = (questionId, params) => {
  return http.get(`/plugins/hkex/question/${questionId}/meta`, { params });
};

export const fetchScoreSummary = (stockCode, reportYear) => {
  return http.get(`/plugins/hkex/question_summary`, {
    params: {
      stock_code: stockCode,
      report_year: reportYear,
    },
  });
};

export const compareAnswer = (qid) => {
  return http.get(`/plugins/hkex/question/${qid}/answer_compare`, {
    method: 'POST',
  });
};

export const fetchRuleMergeDetail = (
  stockCode,
  reportYear,
  rule,
  yearEnd,
  size,
  page,
) => {
  return http.get(`/plugins/hkex/document/${stockCode}/meta`, {
    params: {
      report_year: reportYear,
      rule: rule,
      year_end: yearEnd,
      size,
      page,
    },
  });
};

export const fetchRuleMergeImgUrl = (fileId, page) => {
  return (
    `/plugins/hkex/document/${fileId}/jpg`,
    {
      params: {
        page: page,
      },
    }
  );
};

export const fetchQuestionMetaByQuery = (reportYear, stockCode, dt) => {
  return http.get(`/plugins/hkex/meta`, {
    params: {
      report_year: reportYear,
      stock_code: stockCode,
      dt,
    },
  });
};

export const fetchRuleDocumentUrl = (fileId) => {
  return `/plugins/hkex/document/${fileId}/pdf`;
};

export const fetchRuleHistory = (stockCode, reportYear, delist) => {
  return http.get(`/plugins/hkex/rule_history`, {
    params: {
      stock_code: stockCode,
      report_year: reportYear,
      delist,
    },
  });
};

export const flagOrMarkAnnualReport = (markStatus, questionId) => {
  return http.post(`/plugins/hkex/ar_mark`, {
    mark_status: markStatus,
    question_id: questionId,
  });
};

export const fetchAnnualReportMarkedStatus = (questionId) => {
  return http.get(`/plugins/hkex/ar_mark`, {
    params: {
      question_id: questionId,
    },
  });
};

export const fetchExchangeVersionMeta = (stockCode, reportYear) => {
  return http.get(`/plugins/hkex/exchange_meta`, {
    params: {
      stock_code: stockCode,
      report_year: reportYear,
    },
  });
};

export const fetchPDFDocument = (url, onDownloadProgress) => {
  return http.get(url, {
    responseType: 'arraybuffer',
    onDownloadProgress,
    timeout: 0,
  });
};

/* ********************** HKEX v1+v2融合版本相关api ********************** */
/**
 * 获取某条rule(A1,A2, ...,B1,B2, ...)的详细信息
 * @param {String} rule
 * @param {Number} qid
 * @param {Number} delist
 */
export const fetchRuleDetails = (rule, qid, delist) => {
  return http.get(`/plugins/hkex/rule/${rule}`, {
    params: {
      qid,
      delist,
    },
  });
};

/**
 * 保存(提交)某条rule(A1,A2, ...,B1,B2, ...)的标注信息
 * @param {String} rule
 * @param {Number} qid
 * @param {Object} data
 */
export const saveRuleDetails = (rule, qid, data) => {
  return http.put(`/plugins/hkex/rule/${rule}?qid=${qid}`, data);
};

/**
 * 根据question_id查找对应的file_id
 * @param {Number} qid
 */
export const fetchQuestionMetaData = (params) => {
  return http.get(`/plugins/hkex/question/metadata`, { params });
};

export const addFundraisingEventType = (qid, rule, data) => {
  return http_v2.post(`/questions/${qid}/${rule}/manual-group-answers`, data);
};

export const deleteFundraisingEventType = (qid, rule, groupId) => {
  return http_v2.delete(
    `/questions/${qid}/${rule}/manual-group-answers/${groupId}`,
  );
};
