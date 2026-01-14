import { http } from './http';

export const fetchConfig = () => http.get('/config');
