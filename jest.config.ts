const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/*.test.ts'],
	verbose: true,
	testTimeout: 30000,
	setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
};

export default config;
