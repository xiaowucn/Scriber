import { http } from './http';

export const fetchModelAccuracyScore = (reportYears) => {
  return http.get(`/plugins/hkex/compliance_score?${reportYears}`);
};

export const exportTable = (reportYears) => {
  return http.get(
    `/plugins/hkex/compliance_score?is_export=true&${reportYears}`,
    {
      params: { v: new Date().getTime() },
    },
  );
};

export const fetchSummaryHistoryByRule = (rule, reportYear) => {
  return http.get(`/plugins/hkex/summary_history/${rule}?${reportYear}`);
};
