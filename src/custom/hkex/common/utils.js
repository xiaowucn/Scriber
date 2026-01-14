import store from '@/store';
import { notify } from '@/utils/reset-elementui.js';
import { dataDecrypt, dataEncrypt } from '@/utils/encrypt';

const key = 'HKEX_HOME_FILTERS';

export function saveDataInStorage(data) {
  const needEncrypt = store.getters['needEncrypt'];
  const auditType = store.getters['hkexModule/auditType'];

  try {
    const localData = localStorage.getItem(key);
    let parsedData;
    if (!localData) {
      parsedData = {};
    } else {
      parsedData = needEncrypt
        ? dataDecrypt(JSON.parse(localData))
        : JSON.parse(localData);
    }
    parsedData[auditType] = { ...parsedData[auditType], ...data };
    const encodedData = needEncrypt
      ? Array.from(dataEncrypt(parsedData))
      : parsedData;
    localStorage.setItem(key, JSON.stringify(encodedData));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function readDataFromStorage() {
  try {
    const needEncrypt = store.getters['needEncrypt'];
    const auditType = store.getters['hkexModule/auditType'];
    const localData = localStorage.getItem(key);
    if (!localData) {
      return {};
    }
    const parsedData = needEncrypt
      ? dataDecrypt(JSON.parse(localData))
      : JSON.parse(localData);
    return parsedData[auditType] || {};
  } catch (error) {
    return {};
  }
}

export function preventWindowClose(event) {
  event.preventDefault();
  event.returnValue = false;
}

export function getPdfAsideWidthFromStorage() {
  const defaultWidth = '60%';
  const storageData = readDataFromStorage();
  if (storageData && storageData.pdfAsideWidth) {
    return storageData.pdfAsideWidth;
  }
  return defaultWidth;
}

export function getRightPanelHeightFromStorage() {
  const heightMap = {
    ruleListHeight: '',
    ruleDescriptionHeight: '',
  };
  const storageData = readDataFromStorage();
  if (storageData && storageData.ruleListHeight) {
    heightMap.ruleListHeight = storageData.ruleListHeight;
  }
  if (storageData && storageData.ruleDescriptionHeight) {
    heightMap.ruleDescriptionHeight = storageData.ruleDescriptionHeight;
  }
  return heightMap;
}

export const checkUnsubmitAnswer = () => {
  const hasUnsubmitChange = store.getters['hkexModule/hasUnsubmitChange'];
  if (hasUnsubmitChange) {
    notify({
      title: 'Warning',
      message:
        'There is an unsubmitted answer on the current page, please submit it first',
      type: 'warning',
    });

    return true;
  }

  return false;
};

export const redirectToSSO = () => {
  const redirect = encodeURIComponent(window.location.hash.substring(2));
  const urlSearchParams = new URLSearchParams(location.href.split('?')[1]);

  if (['gekko', 'sso'].includes(urlSearchParams.get('_from'))) {
    window.location.href = `api/v2/saml/sso?redirect=${redirect}`;
    return true;
  }
  return false;
};
