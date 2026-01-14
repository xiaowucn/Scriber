import {
  CONFIRM_STATUS,
  CONFIRM_STATUS_CODE,
  SYSTEM_LOG_TYPE_OPTIONS,
  SYSTEM_LOG_STATUS_CODE,
  SYSTEM_LOG_STATUS_OPTIONS,
} from './constant';

export const isFileConfirmed = (status) => {
  return status === CONFIRM_STATUS_CODE.confirmed;
};

export const isFileSourceByLocalUpload = (source) => {
  return source === '本地上传';
};

export const getConfirmStatusText = (status) => {
  return CONFIRM_STATUS[status] || '-';
};

export const getNafmiiTaskType = (types) => {
  return types.includes('文本识别') ? 'remark' : 'other';
};

export const isRemarkType = (type) => {
  return !type || type == 'remark';
};

export const getSystemLogType = (type) => {
  return SYSTEM_LOG_TYPE_OPTIONS.find((item) => item.value === type).label;
};

export const getSystemLogStatus = (status) => {
  return SYSTEM_LOG_STATUS_OPTIONS.find((item) => item.value === status).label;
};

export const isSystemLogSuccessed = (status) => {
  return status === SYSTEM_LOG_STATUS_CODE.success;
};
