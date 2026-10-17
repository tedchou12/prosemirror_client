module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['react'],
  extends: ['eslint:recommended'],
  rules: {
    'no-prototype-builtins': 'off',
    'no-undef': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    'no-useless-escape': 'off',
    'react/jsx-uses-vars': 'error',
  },
  globals: {
    add_user: 'readonly',
    delete_user: 'readonly',
    hide_message: 'readonly',
    show_message: 'readonly',
  },
};
