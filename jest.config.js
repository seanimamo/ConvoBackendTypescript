module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest'],
  },
  setupFiles: ["./setupJestDynalite.js"],
};
