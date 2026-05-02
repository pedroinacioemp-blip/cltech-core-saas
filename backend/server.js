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

db.init().then(() => {
  console.log('✓ Banco de dados inicializado com sucesso');
}).catch(err => {
  console.error('✗ Erro ao inicializar banco de dados:', err);
  process.exit(1);
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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(errorHandler);

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
