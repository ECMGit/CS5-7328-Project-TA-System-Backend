/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  moduleNameMapper: require('jest-module-name-mapper').default(),
};