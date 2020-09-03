module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'generator-star-spacing': 'off',
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    'no-console': ['off'],
    'no-empty': ['off'],
    'new-cap': ['off'],
  },
};
