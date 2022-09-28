module.exports = {
  extends: ['@vexip-ui/eslint-config'],
  root: true,
  overrides: [
    {
      files: ['scripts/**'],
      rules: {
        'no-sequences': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
