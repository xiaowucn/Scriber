import { http_v2 } from './http';

export const fetchEsgLLMCondition = (params) => {
  return http_v2.get(`/external/esg/condition`, {
    params,
  });
};

export const fetchEsgLLMPrompt = (params) => {
  return http_v2.get(`/external/esg/prompt`, {
    params,
  });
};

export const fetchEsgLLMResult = (data) => {
  return http_v2.post(`/external/esg/predict`, data);
};

export const fetchEsgLLMResultWithImage = (data) => {
  return http_v2.post(`/external/esg/vllm-predict`, data);
};
