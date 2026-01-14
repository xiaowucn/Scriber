module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-unused-vars': 'off',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
