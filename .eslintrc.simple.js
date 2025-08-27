module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    es2020: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.js.map'
  ]
};