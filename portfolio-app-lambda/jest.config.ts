import type { Config } from '@jest/types';

/**
 * Jest Configuration options
 */
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "./coverage",
  verbose: true,
  rootDir:"./"
};

export default config;