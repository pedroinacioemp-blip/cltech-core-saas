// ==========================================
// ERROR HANDLER MIDDLEWARE
// ==========================================

const errorHandler = (err, req, res, next) => {
  console.error('✗ Erro:', err.message);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Classe de erro customizada
class AppError extends Error {
  constructor(message, code = 'ERROR', status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

module.exports = {
  errorHandler,
  AppError
};
