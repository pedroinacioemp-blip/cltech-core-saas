// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const db = require('../config/database');

const router = express.Router();

// ==========================================
// REGISTRO - POST /api/auth/register
// ==========================================

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validações
    if (!username || !email || !password) {
      throw new AppError('Username, email e password são obrigatórios', 'MISSING_FIELDS', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('As senhas não correspondem', 'PASSWORD_MISMATCH', 400);
    }

    if (password.length < 8) {
      throw new AppError('A senha deve ter no mínimo 8 caracteres', 'PASSWORD_TOO_SHORT', 400);
    }

    // Verificar se usuário já existe
    const existingUser = await db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      throw new AppError('Usuário ou email já cadastrado', 'USER_EXISTS', 400);
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar usuário
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const userId = result.id;

    // Gerar token
    const token = generateToken(userId, username, email);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: userId,
        username,
        email
      }
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// LOGIN - POST /api/auth/login
// ==========================================

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username || !password) {
      throw new AppError('Username e password são obrigatórios', 'MISSING_FIELDS', 400);
    }

    // Buscar usuário
    const user = await db.get(
      'SELECT id, username, email, password_hash FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      throw new AppError('Usuário ou senha incorretos', 'INVALID_CREDENTIALS', 401);
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError('Usuário ou senha incorretos', 'INVALID_CREDENTIALS', 401);
    }

    // Gerar token
    const token = generateToken(user.id, user.username, user.email);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// VERIFICAR TOKEN - GET /api/auth/me
// ==========================================

router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await db.get(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      throw new AppError('Usuário não encontrado', 'USER_NOT_FOUND', 404);
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// LOGOUT - POST /api/auth/logout
// ==========================================

router.post('/logout', verifyToken, (req, res) => {
  // JWT é stateless, então logout é apenas uma operação do cliente
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

module.exports = router;
