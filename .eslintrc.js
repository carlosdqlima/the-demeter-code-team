/**
 * Configuração do ESLint para o projeto NASA Farm Navigators
 * Inclui regras para JavaScript moderno e boas práticas
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    Phaser: 'readonly',
    __DEV__: 'readonly',
    __PROD__: 'readonly'
  },
  rules: {
    // Regras de qualidade de código
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    
    // Regras de estilo
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // Regras de boas práticas
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'camelcase': ['error', { properties: 'never' }],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    
    // Regras específicas para o projeto
    'max-len': ['warn', { 
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    'no-magic-numbers': ['warn', { 
      ignore: [-1, 0, 1, 2],
      ignoreArrayIndexes: true
    }]
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'js/phaser.min.js',
    '*.min.js'
  ]
};