import { http_v2 } from '../store/api/http';
import platformPerimeter from '../perimeters/platform.perimeter';
import store from '@/store';

/**
 *  http响应异常处理函数
 * @param {Object} exception 异常信息对象
 */
export function httpExceptionHandler(exception) {
  const debugApiUrl = '/debug/diagnoses';
  const user = store.getters['loginUser'];

  if (exception.config.url.includes(debugApiUrl) || !user.id) {
    return;
  }

  const data = {
    error_type: 'HTTP_EXCEPTION', // 异常类型
    url: decodeURIComponent(exception.request.responseURL), // 请求 url
    method: exception.config.method, // 请求 method
    request_header: exception.config.headers, // 请求头
    request_body: exception.config.data, // 请求 body
    response_header: exception.headers, // 响应头
    response_body: exception.data, // 响应 body
    status_code: exception.status, // 响应状态码
    extra: {
      user_agent: navigator.userAgent, // 浏览器用户代理标头
      message: 'Unsupported http response type', // 异常信息
    },
  };

  // 将异常信息上报给后台（暂仅支持「港交所」环境）
  if (platformPerimeter.isHkexEnv()) {
    http_v2.post(debugApiUrl, { b64_str: jsonToBase64(data) });
  } else {
    console.warn(`Exception information: ${data}`);
  }
}

/**
 * 将JSON对象编码为Base64字符串
 * @param {Object} json - 要转换的JSON对象
 * @returns {string} - 转换得到的Base64字符串
 */
function jsonToBase64(json) {
  const jsonString = JSON.stringify(json);
  const base64String = window.btoa(encodeURIComponent(jsonString));
  return base64String;
}
