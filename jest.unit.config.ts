import config from './jest.config';

const configsToAdd = {
  testMatch: ['**/*.spec.ts'],
};

Object.assign(config, configsToAdd);

export default config;
