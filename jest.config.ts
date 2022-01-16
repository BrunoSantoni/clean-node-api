export default {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
