module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/**.{ts,tsx}', '!**/index.{ts,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
};
