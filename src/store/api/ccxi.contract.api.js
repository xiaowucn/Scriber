import { http } from './http';

export const fetchContracts = (params) => {
  return http.get('/plugins/ccxi/market/contracts', { params });
};

export const fetchContractDetail = (id) =>
  http.get(`/plugins/ccxi/market/contract/${id}`);
