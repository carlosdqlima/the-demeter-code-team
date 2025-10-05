/**
 * Configuração do Prettier para o projeto NASA Farm Navigators
 * Define regras de formatação consistente para todo o código
 */
module.exports = {
  // Configurações básicas
  semi: true,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // Configurações específicas por tipo de arquivo
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always'
      }
    },
    {
      files: '*.css',
      options: {
        printWidth: 120
      }
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'css'
      }
    }
  ],
  
  // Configurações de quebra de linha
  endOfLine: 'lf',
  insertPragma: false,
  requirePragma: false,
  
  // Configurações de objetos e arrays
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // Configurações de strings
  quoteProps: 'as-needed'
};