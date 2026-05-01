// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido',
      code: 'NO_TOKEN'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = decoded;
    next();
  });
};

// Gerar Token JWT
const generateToken = (userId, username, email) => {
  const payload = {
    id: userId,
    username: username,
    email: email
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '24h'
  });

  return token;
};

// Decodificar token sem verificar
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
};

module.exports = {
  verifyToken,
  generateToken,
  decodeToken,
  JWT_SECRET
};
