module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['vuetify',
  'eslint:recommended',
  'plugin:vue/recommended'],
  plugins: [
    'vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: 'off',
    'vue/script-indent': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
}
