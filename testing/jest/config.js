const path = require('path')
module.exports = {
	testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [path.resolve(__dirname, './setup.js')],
  collectCoverageFrom: [
		'**/*.js',
    '!index.js',
    'jest.config.js',
		'!**/*.test.js',
	],
	coverageThreshold: {
		global: {
			statements: 90,
			branches: 75,
			functions: 85,
			lines: 90,
		},
  }
}
