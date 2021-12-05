import config from './jest.config';

const configsToAdd = {
  testMatch: ['**/*.test.ts'],
};

Object.assign(config, configsToAdd);

export default config;
