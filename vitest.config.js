/**
 * Configuração do Vitest para testes do projeto NASA Farm Navigators
 * Inclui configurações para testes unitários e de integração
 */
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Configurações básicas
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    
    // Configurações de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.js',
        'js/phaser.min.js'
      ]
    },
    
    // Configurações de arquivos de teste
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Configurações de timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Configurações de watch
    watch: false,
    
    // Configurações de relatórios
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './tests/results/test-results.json',
      html: './tests/results/test-results.html'
    }
  },
  
  // Configurações de resolução (herda do vite.config.js)
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@js': resolve(__dirname, './js'),
      '@css': resolve(__dirname, './css'),
      '@assets': resolve(__dirname, './assets'),
      '@systems': resolve(__dirname, './js/systems'),
      '@ui': resolve(__dirname, './js/ui'),
      '@core': resolve(__dirname, './js/core'),
      '@data': resolve(__dirname, './js/data')
    }
  },
  
  // Configurações de definições globais
  define: {
    __DEV__: true,
    __PROD__: false
  }
});