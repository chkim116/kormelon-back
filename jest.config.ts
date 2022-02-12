const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__test__/*.test.ts'],
	verbose: true,
	testTimeout: 30000,
	setupFilesAfterEnv: ['<rootDir>/src/__test__/jest.setup.ts'],
};

export default config;
