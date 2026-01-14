import { Notification, Message } from 'element-ui';
import platformPerimeter from '../perimeters/platform.perimeter';

let notificationInstance = null;
let notificationTimer = null;
const NOTIFICATION_DURATION = 4500;

const createNotification = (options) => {
  if (platformPerimeter.isCmfchinaEnv()) {
    if (options.type === 'error') {
      options.message = options.message.replace(/Schema/gi, '场景');
    }
  }
  return platformPerimeter.isNafmiiEnv()
    ? Message(options)
    : Notification(options);
};

const resetNotification = (options) => {
  if (
    options.isNotRepeatNotify &&
    notificationInstance?.message === options.message
  ) {
    options.duration = 0;
    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }
    if (!notificationInstance || notificationInstance.closed) {
      notificationInstance = createNotification(options);
    }
    notificationTimer = setTimeout(() => {
      notificationInstance.close();
      notificationInstance = null;
      notificationTimer = null;
    }, NOTIFICATION_DURATION);
  } else {
    if (notificationInstance) {
      notificationInstance.close();
    }
    notificationInstance = createNotification(options);
  }
};

['error', 'success', 'info', 'warning'].forEach((type) => {
  resetNotification[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return resetNotification(options);
  };
});

export const notify = resetNotification;
