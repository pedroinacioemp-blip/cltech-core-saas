// ==========================================
// CL TECH CORE - BACKEND API SERVER
// ==========================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const fileRoutes = require('./routes/files');
const compileRoutes = require('./routes/compile');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

// Segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Parse JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// INICIALIZAR BANCO DE DADOS
// ==========================================

let dbInitialized = false;

db.init().then(() => {
  console.log('✓ Banco de dados inicializado com sucesso');
  dbInitialized = true;
}).catch(err => {
  console.error('✗ Erro ao inicializar banco de dados:', err);
  // Não fazer process.exit em ambiente serverless
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: dbInitialized ? 'ok' : 'initializing',
    db: dbInitialized ? 'connected' : 'connecting',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// ROTAS
// ==========================================

// Autenticação
app.use('/api/auth', authRoutes);

// Projetos
app.use('/api/projects', projectRoutes);

// Arquivos
app.use('/api/files', fileRoutes);

// Compilação e Execução
app.use('/api/compile', compileRoutes);

// Health Check consolidado
app.get('/api/health', (req, res) => {
  res.json({
    status: dbInitialized ? 'ok' : 'initializing',
    db: dbInitialized ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Rota raiz para debug
app.get('/', (req, res) => {
  res.json({
    message: 'CL TECH CORE - Backend API',
    version: '1.0.2',
    health: '/api/health'
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('✗ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   CL TECH CORE - Backend API Server    ║
║   🚀 Rodando na porta ${PORT}
║                                        ║
║   API Base URL:                        ║
║   http://localhost:${PORT}/api         ║
║                                        ║
║   Saúde: GET /api/health              ║
╚════════════════════════════════════════╝
    `);

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n✓ Encerrando servidor...');
      db.close();
      process.exit(0);
    });
  });
}

module.exports = app;
