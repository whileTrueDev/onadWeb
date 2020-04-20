module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: true
    }
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  transformIgnorePatterns: ['./node_modules/'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testEnvironment: 'node',
  // testMatch: ['**/test/**/*.test.(ts|tsx)'],
  // setupFilesAfterEnv: ['./src/test/setUpTest.ts']
};
