/**
 * Configuração do Vite para o projeto NASA Farm Navigators
 * Inclui otimizações para desenvolvimento e produção
 */
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  // Configurações básicas
  root: '.',
  base: './',
  
  // Plugins
  plugins: [
    // Suporte para navegadores legados
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  
  // Configurações do servidor de desenvolvimento
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  
  // Configurações de preview
  preview: {
    port: 4173,
    host: true,
    open: true
  },
  
  // Configurações de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'es2015',
    
    // Configurações de rollup
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demo: resolve(__dirname, 'demo-space-background.html'),
        testMap: resolve(__dirname, 'test-map-only.html'),
        testMaplibre: resolve(__dirname, 'test-maplibre.html')
      },
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks
          vendor: ['axios']
        }
      }
    },
    
    // Configurações de otimização
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Configurações de resolução
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
  
  // Configurações de CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  
  // Configurações de assets
  assetsInclude: ['**/*.md'],
  
  // Configurações de otimização de dependências
  optimizeDeps: {
    include: ['axios'],
    exclude: []
  },
  
  // Configurações de definições globais
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  }
});