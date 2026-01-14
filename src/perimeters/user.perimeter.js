import { createPerimeter } from 'vue-kindergarten';
import store from '@/store';
import { userRole } from '@/store/constants';
import platformPerimeter from './platform.perimeter';

export default createPerimeter({
  purpose: 'user',

  isAdminUser() {
    const user = store.getters['loginUser'];
    const isAdmin = userRole.isAdmin;
    if (platformPerimeter.isHkexEnv()) {
      return user.role === isAdmin;
    }
    return user.id === isAdmin;
  },

  // 中诚信普通用户（有且仅有remark权限）
  isCcxiNormalUser() {
    if (platformPerimeter.isCcxiEnv()) {
      const user = store.getters['loginUser'];
      const normalUserPerms = ['manage_prj', 'remark'];
      const perms =
        user && user.perm && user.perm.filter((item) => item !== 'browse');
      if (perms) {
        const isNormalUser =
          normalUserPerms.sort().join('') === perms.sort().join('');
        return isNormalUser;
      }
      return false;
    }
    return false;
  },
  // 中信托管部参数提取稽核用户（定制）
  isCiticsTgCustomUser() {
    if (platformPerimeter.isCiticsTGEnv()) {
      const user = store.getters['loginUser'];
      return user && user.param_perms?.length > 0;
    }
    return false;
  },
  // 中信托管部文档智能提取用户（通用）
  isCiticsTgNormalUser() {
    if (platformPerimeter.isCiticsTGEnv()) {
      const user = store.getters['loginUser'];
      const normalUserPerms = ['remark', 'browse', 'inspect'];
      return user && user.perm?.length > normalUserPerms.length;
    }
    return false;
  },
  expose: [
    'isAdminUser',
    'isCcxiNormalUser',
    'isCiticsTgCustomUser',
    'isCiticsTgNormalUser',
  ],
});
