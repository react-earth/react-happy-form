module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
  ],
  // setupFilesAfterEnv: ['<rootDir>/jest/jestSetupTests.ts'],
  collectCoverageFrom: [
    'client/**/**.{ts,tsx}',
    '!**/index.{ts,tsx}',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
};
