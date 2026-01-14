import { http, http_v2 } from './http';

export const fetchIssuerHeader = (stockCode, dt) => {
  return http.get(`/plugins/hkex/issuer_header`, {
    params: {
      stock_code: stockCode,
      dt,
    },
  });
};

export const fetchIssuerBody = (stockCode) => {
  return http.get(`/plugins/hkex/issuer_body`, {
    params: {
      stock_code: stockCode,
    },
  });
};

export const fetchResultsAnnouncementAnalysisByIssuer = (stockCode) => {
  return http.get(`/plugins/hkex/issuer_body_v3`, {
    params: {
      stock_code: stockCode,
    },
  });
};

export const fetchEsgIssuerSummary = (stockCode) => {
  return http.get(`/plugins/hkex/esg_issuer_summary`, {
    params: {
      stock_code: stockCode,
    },
  });
};

export const fetchCgIssuerSummary = (params) => {
  return http_v2.get(`/cg/issuer-summary`, {
    params,
  });
};

export const exportIssuer = (stockCode, params) => {
  return http.get(`/plugins/hkex/export_issuer/${stockCode}`, {
    params: { ...params, v: new Date().getTime() },
  });
};
