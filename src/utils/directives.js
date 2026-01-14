export const loadMoreSelectOptions = {
  bind(el, binding) {
    const selectDropdownEl = el.querySelector(
      '.el-select-dropdown .el-select-dropdown__wrap',
    );
    selectDropdownEl.addEventListener('scroll', function () {
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (condition) {
        binding.value();
      }
    });
  },
};

/**
 * 拖拽指令
 * 使用方式：v-drag
 * 功能：使元素可以通过鼠标拖拽移动
 * 适用于：Dialog、Modal、浮动面板等需要拖拽的组件
 */
export const drag = {
  inserted(el) {
    // 查找可拖拽的容器：包含 dialog/modal 关键字的元素，或父元素
    const dialog =
      el.closest('[class*="dialog"], [class*="modal"]') || el.parentElement;
    if (!dialog) return;

    el.style.cursor = 'move';
    el.onmousedown = (e) => {
      const disX = e.clientX - dialog.offsetLeft;
      const disY = e.clientY - dialog.offsetTop;

      document.onmousemove = (e) => {
        const left = e.clientX - disX;
        const top = e.clientY - disY;

        dialog.style.left =
          Math.max(0, Math.min(left, window.innerWidth - dialog.offsetWidth)) +
          'px';
        dialog.style.top =
          Math.max(0, Math.min(top, window.innerHeight - dialog.offsetHeight)) +
          'px';
        dialog.style.marginTop = '0';
        dialog.style.marginLeft = '0';
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };

      return false;
    };
  },
};

/**
 * 功能：拖动“分割条”改变左右两侧容器的宽度
 * 使用方式：v-splitter="{ leftEl: leftEl, rightEl: rightEl, minLeftRatio: 0.3, maxLeftRatio: 0.7, saveToLocalstorage: true, localStorageKey: 'MY_SPLITTER' }"
 * 参数说明:
 * @param {Element} el 指令绑定的元素
 * @param {Object} binding 包含指令相关信息的对象
 * @param {Object} binding.value 指令的绑定值，包含配置选项
 * @param {Element} binding.value.leftEl 左侧容器（必须）
 * @param {Element} binding.value.rightEl 右侧容器（必须）
 * @param {number} binding.value.minLeftRatio 左侧容器最小宽度比例
 * @param {number} binding.value.maxLeftRatio 左侧容器最大宽度比例
 * @param {boolean} binding.value.saveToLocalstorage 是否启用本地持久化保存
 * @param {string} binding.value.localStorageKey localStorage 保存宽度的键名
 */
export const splitter = {
  inserted(el, binding) {
    const options = binding.value || {};
    const leftEl = options.leftEl;
    const rightEl = options.rightEl;

    const minLeftRatio =
      typeof options.minLeftRatio === 'number' ? options.minLeftRatio : 0.5;
    const maxLeftRatio =
      typeof options.maxLeftRatio === 'number' ? options.maxLeftRatio : 0.7;

    if (!leftEl || !rightEl) {
      console.warn('v-splitter: missing left or right element');
      return;
    }

    const storageKey = options.localStorageKey || 'DEFAULT_SPLITTER';
    const saveToLocalstorage = options.saveToLocalstorage === true;

    // 如果开启了 localStorage 持久化，则读取上次保存的宽度
    if (saveToLocalstorage) {
      const savedWidth = localStorage.getItem(storageKey);
      if (savedWidth) {
        leftEl.style.width = savedWidth + 'px';
      }
    }

    // 避免重复绑定
    if (el.__splitter_inited) return;
    el.__splitter_inited = true;

    // 基础样式
    el.style.cursor = 'col-resize';
    el.style.userSelect = 'none';

    let startX = 0;
    let startWidth = 0;

    const onMouseMove = (e) => {
      const delta = e.clientX - startX;
      const screenWidth = window.innerWidth;
      const minWidth = screenWidth * minLeftRatio;
      const maxWidth = screenWidth * maxLeftRatio;
      const newWidth = Math.min(
        Math.max(startWidth + delta, minWidth),
        maxWidth,
      );
      leftEl.style.width = newWidth + 'px';
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (saveToLocalstorage) {
        const finalWidth = leftEl.offsetWidth;
        localStorage.setItem(storageKey, finalWidth);
      }
    };

    const onMouseDown = (e) => {
      startX = e.clientX;
      startWidth = leftEl.offsetWidth;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    el.addEventListener('mousedown', onMouseDown);
  },
  componentUpdated(el, binding) {
    // Vue 虚拟 DOM 更新后重新应用宽度
    splitter.inserted(el, binding);
  },
};
