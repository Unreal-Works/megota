/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    verbose: false,
    setupFilesAfterEnv: ['./jest.setup.ts'],
};
