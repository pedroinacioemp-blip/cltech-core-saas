// ==========================================
// FILES ROUTES
// ==========================================

const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const db = require('../config/database');

const router = express.Router();

// Middleware: Verificar token em todas as rotas
router.use(verifyToken);

// ==========================================
// LISTAR ARQUIVOS DO PROJETO - GET /api/files/:projectId
// ==========================================

router.get('/:projectId', async (req, res, next) => {
  try {
    // Verificar se projeto pertence ao usuário
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.projectId, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    const files = await db.all(
      'SELECT id, filename, language, created_at, updated_at FROM files WHERE project_id = ? ORDER BY created_at',
      [req.params.projectId]
    );

    res.json({
      success: true,
      files
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// OBTER CONTEÚDO DO ARQUIVO - GET /api/files/:projectId/:fileId
// ==========================================

router.get('/:projectId/:fileId', async (req, res, next) => {
  try {
    // Verificar se projeto pertence ao usuário
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.projectId, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    const file = await db.get(
      'SELECT id, filename, content, language, created_at, updated_at FROM files WHERE id = ? AND project_id = ?',
      [req.params.fileId, req.params.projectId]
    );

    if (!file) {
      throw new AppError('Arquivo não encontrado', 'FILE_NOT_FOUND', 404);
    }

    res.json({
      success: true,
      file
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// CRIAR ARQUIVO - POST /api/files/:projectId
// ==========================================

router.post('/:projectId', async (req, res, next) => {
  try {
    const { filename, content, language } = req.body;

    // Verificar se projeto pertence ao usuário
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.projectId, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    if (!filename) {
      throw new AppError('Nome do arquivo é obrigatório', 'MISSING_FIELD', 400);
    }

    const result = await db.run(
      'INSERT INTO files (project_id, filename, content, language) VALUES (?, ?, ?, ?)',
      [req.params.projectId, filename, content || '', language || 'unknown']
    );

    const file = {
      id: result.id,
      project_id: req.params.projectId,
      filename,
      content: content || '',
      language: language || 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Arquivo criado com sucesso',
      file
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// ATUALIZAR ARQUIVO - PUT /api/files/:projectId/:fileId
// ==========================================

router.put('/:projectId/:fileId', async (req, res, next) => {
  try {
    const { content, filename, language } = req.body;

    // Verificar se projeto pertence ao usuário
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.projectId, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    const file = await db.get(
      'SELECT id FROM files WHERE id = ? AND project_id = ?',
      [req.params.fileId, req.params.projectId]
    );

    if (!file) {
      throw new AppError('Arquivo não encontrado', 'FILE_NOT_FOUND', 404);
    }

    const setClauses = [];
    const params = [];

    if (content !== undefined) {
      setClauses.push('content = ?');
      params.push(content);
    }
    if (filename) {
      setClauses.push('filename = ?');
      params.push(filename);
    }
    if (language) {
      setClauses.push('language = ?');
      params.push(language);
    }

    if (setClauses.length === 0) {
      throw new AppError('Nenhum campo para atualizar', 'NO_UPDATE_FIELDS', 400);
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.fileId);

    await db.run(
      `UPDATE files SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    const updatedFile = await db.get(
      'SELECT id, filename, content, language, created_at, updated_at FROM files WHERE id = ?',
      [req.params.fileId]
    );

    res.json({
      success: true,
      message: 'Arquivo atualizado com sucesso',
      file: updatedFile
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// DELETAR ARQUIVO - DELETE /api/files/:projectId/:fileId
// ==========================================

router.delete('/:projectId/:fileId', async (req, res, next) => {
  try {
    // Verificar se projeto pertence ao usuário
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.projectId, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    const file = await db.get(
      'SELECT id FROM files WHERE id = ? AND project_id = ?',
      [req.params.fileId, req.params.projectId]
    );

    if (!file) {
      throw new AppError('Arquivo não encontrado', 'FILE_NOT_FOUND', 404);
    }

    await db.run('DELETE FROM files WHERE id = ?', [req.params.fileId]);

    res.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
