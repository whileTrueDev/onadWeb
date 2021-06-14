module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'no-useless-constructor': 'off',
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
      },
    ],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-use-before-define': 'off',
    'linebreak-style': 'off',
    camelcase: 'warn',
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        jsx: 'never',
        tsx: 'never',
      },
    ],
    'no-underscore-dangle': 0,
    // react
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 1,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // typescript
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-use-before-define': 2,
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
  ignorePatterns: ['generated/**/*.tsx'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    },
  },
};
