module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: true
              }
            }
          ],
          '@babel/preset-typescript'
        ],
        plugins: ['@vue/babel-plugin-jsx']
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  }
}
