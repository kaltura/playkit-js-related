module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|ts)$': ['ts-jest', {tsconfig: 'test/tsconfig.test.json'}]
  }
};
