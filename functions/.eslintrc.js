module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
  /* eslint-disable array-callback-return */
  extends: ['eslint:recommended', 'google'],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    'object-curly-spacing': ['error', 'always'],
    quotes: [2, 'single', { avoidEscape: true }],
    'quote-props': ['error', 'as-needed'],
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
  /* eslint-enable array-callback-return */
};
