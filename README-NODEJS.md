# NASA Farm Navigators - Configuração Node.js

Este documento descreve como configurar e usar as funcionalidades Node.js adicionadas ao projeto NASA Farm Navigators.

## 🚀 Funcionalidades Adicionadas

### Backend (Node.js + Express)
- **API REST** para dados da NASA, fazendas e meteorologia
- **Socket.IO** para funcionalidades em tempo real
- **Persistência de dados** com sistema de backup
- **Integração com APIs externas** (NASA, OpenWeatherMap)
- **Sistema de cache** e otimizações

### Ferramentas de Desenvolvimento
- **Vite** para build moderno e desenvolvimento rápido
- **ESLint** para padronização de código
- **Prettier** para formatação automática
- **Vitest** para testes unitários
- **Concurrently** para executar múltiplos processos

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Chaves de API** (opcional):
  - NASA API Key (gratuita em https://api.nasa.gov/)
  - OpenWeatherMap API Key (gratuita em https://openweathermap.org/api)

## 🛠️ Instalação

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env com suas chaves de API
notepad .env
```

### 3. Executar em Desenvolvimento
```bash
# Apenas frontend (Vite)
npm run dev

# Apenas backend (Express)
npm run server

# Frontend + Backend simultaneamente
npm run dev:full
```

## 📚 Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Inicia servidor de desenvolvimento Vite
- `npm run server` - Inicia servidor Express
- `npm run dev:full` - Inicia frontend e backend simultaneamente

### Build e Deploy
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run serve` - Serve arquivos estáticos

### Qualidade de Código
- `npm run lint` - Executa ESLint
- `npm run format` - Formata código com Prettier
- `npm run test` - Executa testes unitários

## 🌐 APIs Disponíveis

### Dados da NASA (`/api/nasa/`)
- `GET /api/nasa/power/daily` - Dados diários de energia solar
- `GET /api/nasa/power/monthly` - Dados mensais meteorológicos
- `GET /api/nasa/imagery/earth` - Imagens de satélite
- `GET /api/nasa/apod` - Imagem Astronômica do Dia
- `GET /api/nasa/neo/feed` - Objetos próximos à Terra
- `GET /api/nasa/mars/weather` - Clima em Marte

### Gerenciamento de Fazendas (`/api/farm/`)
- `GET /api/farm/list` - Lista todas as fazendas
- `GET /api/farm/:id` - Dados de uma fazenda específica
- `POST /api/farm/create` - Cria nova fazenda
- `PUT /api/farm/:id` - Atualiza fazenda
- `DELETE /api/farm/:id` - Remove fazenda
- `POST /api/farm/:id/plot` - Adiciona parcela
- `GET /api/farm/:id/stats` - Estatísticas da fazenda

### Dados Meteorológicos (`/api/weather/`)
- `GET /api/weather/current` - Clima atual
- `GET /api/weather/forecast` - Previsão 5 dias
- `GET /api/weather/alerts` - Alertas meteorológicos
- `GET /api/weather/agricultural` - Dados agrícolas específicos

### Persistência de Dados (`/api/data/`)
- `GET /api/data/saves` - Lista saves disponíveis
- `GET /api/data/save/:id` - Carrega save específico
- `POST /api/data/save` - Salva dados do jogo
- `PUT /api/data/save/:id` - Atualiza save
- `DELETE /api/data/save/:id` - Remove save
- `GET /api/data/backups` - Lista backups
- `POST /api/data/restore/:filename` - Restaura backup
- `GET /api/data/export/:id` - Exporta save

## 🔧 Configuração Avançada

### Vite (vite.config.js)
- Configurado para múltiplas páginas HTML
- Aliases para importações simplificadas
- Otimizações para produção
- Suporte a navegadores legados

### ESLint (.eslintrc.js)
- Regras para JavaScript moderno
- Configurações específicas para Phaser
- Ignorar arquivos minificados

### Prettier (.prettierrc.js)
- Formatação consistente
- Configurações por tipo de arquivo
- Integração com ESLint

### Vitest (vitest.config.js)
- Ambiente de teste configurado
- Mocks para Phaser e APIs do navegador
- Cobertura de código

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Servir Arquivos Estáticos
```bash
npm run serve
```

### Deploy com Backend
```bash
# Definir variáveis de ambiente de produção
set NODE_ENV=production
set PORT=3000

# Executar servidor
npm run server
```

## 🔍 Monitoramento

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Logs do Servidor
O servidor Express registra automaticamente:
- Requisições HTTP
- Erros de API
- Conexões Socket.IO
- Tarefas agendadas

## 🤝 Integração com Frontend

### Usando as APIs no Frontend
```javascript
// Exemplo: Buscar dados meteorológicos
const response = await fetch('/api/weather/current?lat=-23.5505&lon=-46.6333');
const weatherData = await response.json();

// Exemplo: Salvar dados do jogo
const saveData = {
  playerId: 'player123',
  gameState: { /* dados do jogo */ },
  timestamp: new Date().toISOString()
};

await fetch('/api/data/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(saveData)
});
```

### Socket.IO em Tempo Real
```javascript
// Conectar ao servidor Socket.IO
const socket = io('http://localhost:3001');

// Escutar atualizações da fazenda
socket.on('farm:updated', (data) => {
  console.log('Fazenda atualizada:', data);
});

// Enviar atualização
socket.emit('farm:update', farmData);
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de porta em uso**
   ```bash
   # Verificar processos na porta
   netstat -ano | findstr :3001
   # Matar processo se necessário
   taskkill /PID <PID> /F
   ```

2. **Dependências não instaladas**
   ```bash
   # Limpar cache e reinstalar
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Problemas de CORS**
   - Verificar configuração em `server/index.js`
   - Atualizar `CLIENT_URL` no `.env`

4. **APIs da NASA/Weather não funcionam**
   - Verificar chaves de API no `.env`
   - Testar endpoints diretamente

## 📖 Documentação Adicional

- [Vite Documentation](https://vitejs.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [NASA API Documentation](https://api.nasa.gov/)
- [OpenWeatherMap API](https://openweathermap.org/api)

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verificar logs do servidor
2. Consultar documentação das APIs
3. Verificar configurações de ambiente
4. Testar endpoints individualmente