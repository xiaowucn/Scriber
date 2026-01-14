export const copyTextToClipboard = async (text) => {
  if (text) {
    if (window.navigator.clipboard) {
      await window.navigator.clipboard.writeText(text);
    } else {
      const range = document.createRange();
      window.getSelection().removeAllRanges();
      const editableEl = document.createElement('pre');
      editableEl.innerText = text;
      document.body.appendChild(editableEl);
      range.selectNode(editableEl);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      editableEl.remove();
    }
  }
};
