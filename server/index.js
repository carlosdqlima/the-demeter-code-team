/**
 * Servidor Express para o projeto NASA Farm Navigators
 * Fornece APIs para dados da NASA, persistência e funcionalidades em tempo real
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurações de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do servidor
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Inicialização do Express
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middlewares de segurança e otimização
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.nasa.gov", "wss:"]
    }
  }
}));

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Importar rotas
import nasaRoutes from './routes/nasa.js';
import farmRoutes from './routes/farm.js';
import weatherRoutes from './routes/weather.js';
import dataRoutes from './routes/data.js';

// Configurar rotas
app.use('/api/nasa', nasaRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/data', dataRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// Servir arquivos estáticos em produção
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Configurações do Socket.IO para funcionalidades em tempo real
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  // Eventos de fazenda em tempo real
  socket.on('farm:update', (data) => {
    socket.broadcast.emit('farm:updated', data);
  });
  
  socket.on('weather:subscribe', (location) => {
    socket.join(`weather:${location}`);
    console.log(`Cliente ${socket.id} inscrito em atualizações do tempo para ${location}`);
  });
  
  socket.on('nasa:subscribe', (dataType) => {
    socket.join(`nasa:${dataType}`);
    console.log(`Cliente ${socket.id} inscrito em dados NASA: ${dataType}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Tarefas agendadas para atualização de dados
cron.schedule('0 */6 * * *', async () => {
  console.log('Executando atualização agendada de dados da NASA...');
  try {
    // Aqui você pode adicionar lógica para atualizar dados da NASA
    io.emit('nasa:data-updated', { timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Erro na atualização agendada:', error);
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      status: 404,
      path: req.originalUrl
    }
  });
});

// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor NASA Farm Navigators rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${NODE_ENV}`);
  console.log(`🌐 Socket.IO habilitado para funcionalidades em tempo real`);
  
  if (NODE_ENV === 'development') {
    console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  }
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

export default app;