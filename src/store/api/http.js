import Axios from 'axios';
import qs from 'qs';
import router from 'env-router';
import store from '@/store';
import i18n from '@/i18n';
import platformPerimeter from '@/perimeters/platform.perimeter';
import { httpExceptionHandler } from '../../utils/httpExceptionHandler';
import { redirectToSSO } from '@/custom/hkex/common/utils';
import {
  dataEncrypt,
  dataDecrypt,
  decryptAES256GCM,
  updateBinaryKey,
  handleBufferToData,
} from '../../utils/encrypt';
import { isENLang } from '@/store/constants';

export const baseURL = 'api/v1';
export const baseURL_v2 = 'api/v2';
export const tridentApiVersion = '/api/v1';

const isProdEnv = import.meta.env.PROD;
let isNeedEncrypt = true;
let isUpdatedEncryptKey = false;

export const uploadTimeout = 10 * 60 * 1000;

export function getTokenFromUrl() {
  const token = new URLSearchParams(location.hash.split('?')[1]).get('token');
  return {
    hasToken: !!token,
    tokenValue: `Bearer ${token}`,
  };
}

const http = Axios.create({
  baseURL,
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
  timeout: 60e3,
  responseType: 'arraybuffer',
});

const http_v2 = Axios.create({
  baseURL: baseURL_v2,
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
  timeout: 60e3,
  responseType: 'arraybuffer',
});

[http, http_v2].forEach((axios) => {
  axios.interceptors.request.use((config) => {
    const { hasToken, tokenValue } = getTokenFromUrl();
    if (hasToken) {
      config.headers['Authorization'] = tokenValue;
    }

    const userInfo = store.getters['loginUser'];
    if (userInfo && userInfo._xsrf) {
      config.headers['X-Csrftoken'] = userInfo._xsrf;
    }

    const configuration = store.getters.configuration;
    const method = config.method.toUpperCase();
    if (
      configuration.http_secure_map &&
      configuration.http_secure_map[method]
    ) {
      config.url += `/${method.toLowerCase()}`;
      config.method = configuration.http_secure_map[method].toLowerCase();
    }

    const encryptUrls = configuration.encrypted_request_routes;

    if (
      ['put', 'post'].includes(config.method) &&
      !(config.data instanceof FormData) &&
      config.data &&
      encryptUrls &&
      (encryptUrls.includes('all') || encryptUrls.includes(config.url)) &&
      isNeedEncrypt
    ) {
      config.headers[config.method]['Content-Type'] = 'application/binary+json';
      config.data = dataEncrypt(config.data);
    }

    return config;
  });

  axios.interceptors.response.use(
    async (response) => {
      getConfigHeader(response);
      if (!isUpdatedEncryptKey) {
        if (response.headers['x-binary-key']) {
          updateBinaryKey(response.headers['x-binary-key']);
          store.commit('SET_NEED_ENCRYPT', true);
        } else {
          isNeedEncrypt = false;
        }
        isUpdatedEncryptKey = true;
      }
      switch (response.headers['content-type']) {
        case 'application/octet-stream': {
          return response;
        }
        case 'application/binary-json': {
          if (response.headers['x-binary-alg'] === 'HexSm4') {
            response.data = dataDecrypt(response.data, 'sm4');
          } else {
            response.data = dataDecrypt(response.data);
          }
          if (response.data?.status === 'error') {
            return Promise.reject(response.data);
          }
          return response.data;
        }
        case 'application/json': {
          response.data = handleBufferToData(response.data);
          if (response.config.responseType === 'blob') {
            response.data = await new Response(response.data).json();
          }
          if (response.data?.status === 'error') {
            return Promise.reject(response.data);
          }
          return response.data;
        }
        case undefined: {
          // 状态码204时 ContentType 为 undefined
          return response;
        }
        default: {
          httpExceptionHandler(response);
          return response;
        }
      }
    },
    async (error) => {
      const { response } = error;
      getConfigHeader(response);
      const configuration = store.getters.configuration;

      if (error.code === 'ERR_CANCELED') {
        if (platformPerimeter.isNafmiiEnv()) {
          return Promise.reject({
            status: 'canceled',
            message: '请求已取消',
          });
        } else {
          return;
        }
      }

      if (error.code === 'ECONNABORTED') {
        const locale = isENLang ? 'en' : 'cn';
        const timeoutMessage = i18n[locale].message['请求超时，请稍后再试'];
        return Promise.reject(
          new Error(error.config?.timeoutMessage || timeoutMessage),
        );
      }

      // 响应类型为 blob 时，将响应数据转为 json
      if (response.config.responseType === 'blob') {
        response.data = await new Response(response.data).json();
      } else if (
        response.headers['content-type'] === 'application/binary-json'
      ) {
        if (response.headers['x-binary-alg'] === 'HexSm4') {
          response.data = dataDecrypt(response.data, 'sm4');
        } else {
          response.data = dataDecrypt(response.data);
        }
      } else {
        response.data = handleBufferToData(response.data);
      }

      // 响应类型非预期，抛出异常
      const expectedResponseHeaders = [
        'application/octet-stream',
        'application/json',
        'application/binary-json',
      ];
      if (!expectedResponseHeaders.includes(response.headers['content-type'])) {
        httpExceptionHandler(response);
      }

      const httpError = getHttpError(response);

      switch (response.status) {
        case 401: {
          if (
            configuration.trident_url &&
            isProdEnv &&
            location.hostname !== 'localhost'
          ) {
            if (platformPerimeter.isCmfchinaEnv()) {
              window.location.href = `${configuration.trident_url}/api/v1/user/customer-logout`;
              return;
            }
            window.location.href = configuration.trident_url;
          } else {
            const redirect = encodeURIComponent(
              window.location.hash.substring(2),
            );
            if (redirect.indexOf('login') === -1) {
              if (
                platformPerimeter.isCscOctopusEnv() &&
                redirect.includes('csc-octopus')
              ) {
                return;
              }

              if (platformPerimeter.isHkexEnv()) {
                localStorage.removeItem('HKEX_HOME_FILTERS');
                if (redirectToSSO()) {
                  return;
                }
              }

              if (
                configuration.trident_url &&
                configuration.client_name === 'guosen'
              ) {
                const origin = encodeURIComponent(`/${location.hash}`);
                window.location.href = `${location.origin}/api/v1/guosen/sso-login?origin=${origin}&app=scriber`;
                return;
              }

              router.push({
                path: `/login?redirect=${redirect}`,
              });
            }
          }
          return httpError;
        }
        case 402: {
          store.commit('SET_SYSTEM_AUTH_EXPIRED', true);
          router.push({
            path: `/auth-expired`,
          });
          return httpError;
        }
        case 403: {
          if (platformPerimeter.isHkexEnv()) {
            router.push({ path: '/hkex/no-access' });
          }
          return httpError;
        }
        default: {
          return httpError;
        }
      }
    },
  );
});

function getHttpError(response) {
  const locale = isENLang ? 'en' : 'cn';
  const messages = i18n[locale].message;
  const msg = {
    400: messages['错误的请求'],
    401: messages['会话已过期, 请重新登录'],
    402: messages['系统授权已到期'],
    403: messages['禁止'],
    404: messages['未找到'],
    405: messages['不允许的方法'],
    410: messages['请求的资源已经被永久删除'],
    422: messages['参数错误'],
    500: messages['服务器内部错误'],
    502: messages['网关错误'],
    503: messages['服务不可用'],
    504: messages['网关超时'],
  };
  const message = !response
    ? messages['未知错误']
    : response.data.message || msg[response.status] || messages['网络错误'];
  const errorMsg = {
    status: 'error',
    status_code: response.status,
    message: message,
  };

  return Promise.reject(errorMsg);
}

function getConfigHeader(response) {
  const data = response.headers['x-pai-protobuf'];
  if (!data) {
    return;
  }
  const configHeader = decryptAES256GCM(data);
  store.commit('SET_CONFIG_HEADER', configHeader);
  return configHeader;
}

export { http, http_v2 };
