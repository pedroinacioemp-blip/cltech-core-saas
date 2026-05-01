// ==========================================
// PROJECTS ROUTES
// ==========================================

const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const db = require('../config/database');

const router = express.Router();

// Middleware: Verificar token em todas as rotas
router.use(verifyToken);

// ==========================================
// LISTAR PROJETOS - GET /api/projects
// ==========================================

router.get('/', async (req, res, next) => {
  try {
    const projects = await db.all(
      'SELECT id, name, description, language, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      projects
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// CRIAR PROJETO - POST /api/projects
// ==========================================

router.post('/', async (req, res, next) => {
  try {
    const { name, description, language } = req.body;

    if (!name) {
      throw new AppError('Nome do projeto é obrigatório', 'MISSING_FIELD', 400);
    }

    const result = await db.run(
      'INSERT INTO projects (user_id, name, description, language) VALUES (?, ?, ?, ?)',
      [req.user.id, name, description || '', language || 'unknown']
    );

    const project = {
      id: result.id,
      user_id: req.user.id,
      name,
      description: description || '',
      language: language || 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Projeto criado com sucesso',
      project
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// OBTER PROJETO - GET /api/projects/:id
// ==========================================

router.get('/:id', async (req, res, next) => {
  try {
    const project = await db.get(
      'SELECT id, name, description, language, created_at, updated_at FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    // Obter arquivos do projeto
    const files = await db.all(
      'SELECT id, filename, language, created_at, updated_at FROM files WHERE project_id = ?',
      [project.id]
    );

    res.json({
      success: true,
      project: { ...project, files }
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// ATUALIZAR PROJETO - PUT /api/projects/:id
// ==========================================

router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, language } = req.body;

    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    const updateData = {
      name: name || undefined,
      description: description !== undefined ? description : undefined,
      language: language || undefined
    };

    const setClauses = [];
    const params = [];

    if (updateData.name) {
      setClauses.push('name = ?');
      params.push(updateData.name);
    }
    if (updateData.description !== undefined) {
      setClauses.push('description = ?');
      params.push(updateData.description);
    }
    if (updateData.language) {
      setClauses.push('language = ?');
      params.push(updateData.language);
    }

    if (setClauses.length === 0) {
      throw new AppError('Nenhum campo para atualizar', 'NO_UPDATE_FIELDS', 400);
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    await db.run(
      `UPDATE projects SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    const updatedProject = await db.get(
      'SELECT id, name, description, language, created_at, updated_at FROM projects WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Projeto atualizado com sucesso',
      project: updatedProject
    });

  } catch (err) {
    next(err);
  }
});

// ==========================================
// DELETAR PROJETO - DELETE /api/projects/:id
// ==========================================

router.delete('/:id', async (req, res, next) => {
  try {
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    await db.run('DELETE FROM projects WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Projeto deletado com sucesso'
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
