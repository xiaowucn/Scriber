const start = () => {
  const el = document.querySelector('.file-remark-answer');
  return new Promise((resolve) => {
    el && el.classList.add('loading');

    setTimeout(() => {
      resolve();
    }, 100);
  });
};

const close = () => {
  const el = document.querySelector('.file-remark-answer');
  el && el.classList.remove('loading');
};

export const RemarkTreeLoading = { start, close };
