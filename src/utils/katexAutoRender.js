import KatexAutoRender from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

export default function (el, binding) {
  let options = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: true },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true },
    ],
  };
  if (binding.value) {
    options = binding.value;
  }
  KatexAutoRender(el, options);
}

/**
 * 检查字符串是否类似于 LaTeX 数学表达式
 * 通过检查定界符、常见 LaTeX 命令和数学结构来判断
 *
 * @param {string} str - 要检查的字符串
 * @returns {boolean} - 如果字符串类似于 LaTeX 表达式则返回 true，否则返回 false
 */
export function isLatexLike(str) {
  // 常见的 LaTeX 数学命令
  const commonCommands = [
    '\\frac',
    '\\sqrt',
    '\\sum',
    '\\int',
    '\\alpha',
    '\\beta',
    '\\gamma',
    '\\delta',
    '\\theta',
    '\\pi',
    '\\sigma',
    '\\omega',
    '\\begin{',
    '\\end{',
    '\\left',
    '\\right',
    '\\times',
    '\\div',
  ];

  // 是否有定界符
  const hasDelimiter = /(\$|\\\[|\\\(|\\begin\{)/.test(str);

  // 是否有常见的 LaTeX 命令
  const hasCommand = commonCommands.some((cmd) => str?.includes(cmd));

  // 是否有上下标结构
  const hasMathStructure = /[\^_]\{.*\}/.test(str);

  return hasDelimiter || hasCommand || hasMathStructure;
}

/**
 * 检查字符串是否包含 LaTeX 公式定界符
 * 支持的分隔符格式包括：
 * - $$...$$ : 双美元符号包围
 * - $...$ : 单美元符号包围
 * - \[...\] : 反斜杠方括号包围
 * - \(...\) : 反斜杠圆括号包围
 *
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 如果字符串包含任何一种定界符则返回true，否则返回false
 */
export function hasMathDelimiter(str) {
  return (
    /\$\$[\s\S]+?\$\$/.test(str) ||
    /\$[^$]+\$/.test(str) ||
    /\\\[[\s\S]+?\\\]/.test(str) ||
    /\\\([\s\S]+?\\\)/.test(str)
  );
}
