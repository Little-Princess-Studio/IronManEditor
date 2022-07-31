module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-cycle': 'off',
    'import/extensions': 'off',
    'import/no-duplicates': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-self-import': 'off',
    'import/order': 'off',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/no-array-index-key': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'class-methods-use-this': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-param-reassign': 'warn',
    'no-restricted-globals': 'warn',
    'no-plusplus': 'off',
    'no-shadow': 'warn',
    'object-shorthand': 'warn',
    'consistent-return': 'off',
    'prefer-destructuring': 'off',
    'prefer-promise-reject-errors': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-throw-literal': 'warn',
    '@typescript-eslint/no-shadow': 'warn',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
