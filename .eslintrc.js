module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'no-tabs': 'off',
    'no-useless-escape': 'off',
    'no-sparse-arrays': 'off',
    'no-mixed-operators': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-callback-literal': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
