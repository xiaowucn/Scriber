import { http } from './http';
import featuresPerimeter from '../../perimeters/features.perimeter';
import { dataEncrypt } from '../../utils/encrypt';

function shouldEncryptData() {
  return featuresPerimeter.enableEncryptData();
}

export const login = (user) => {
  if (shouldEncryptData()) {
    user = dataEncrypt(user);
  }

  return http.post(`/login`, user);
};

export const loginByToken = (_timestamp, _token) =>
  http.get('/login_by_token', {
    params: {
      _timestamp,
      _token,
    },
  });

export const fetchUserInfo = () =>
  http.get('/user/me', {
    headers: {
      'X-Date': new Date().toUTCString(),
    },
  });

export const logout = () => http.post(`/logout`);

export const tridentLogout = () => http.post(`/trident/logout`);

export const fetchUsers = (params) => http.get('/user', { params });

export const saveUser = (user) => {
  if (shouldEncryptData()) {
    user = dataEncrypt(user);
  }

  return http.post(`/user`, user);
};
export const updateUser = (id, user) => {
  if (shouldEncryptData()) {
    user = dataEncrypt(user);
  }

  return http.put(`/user/${id}`, user);
};

export const deleteUser = (id) => http.delete(`/user/${id}`);

export const getAccessToken = () => {
  return http.post('/user/access-token');
};
