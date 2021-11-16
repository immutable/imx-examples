module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'fp-ts'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:fp-ts/all',
    'airbnb-typescript/base',
    // @NOTE: Make sure this is always the last element in the array.
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'error',
    'no-nested-ternary': 'off',
    'no-console': 'off',
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'class-methods-use-this': 'off',
    'no-async-promise-executor': 'off',
    'no-restricted-properties': 'off',
    'import/no-cycle': 'off',
  },
};
