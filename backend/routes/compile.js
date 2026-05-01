// ==========================================
// COMPILATION & EXECUTION ROUTES
// ==========================================

const express = require('express');
const { execSync } = require('child_process');
const { verifyToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Middleware: Verificar token em todas as rotas
router.use(verifyToken);

// Criar diretório temporário se não existir
const tempDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ==========================================
// COMPILAR C++ - POST /api/compile/cpp
// ==========================================

router.post('/cpp', async (req, res, next) => {
  try {
    const { code, filename = 'main.cpp', projectId } = req.body;

    if (!code) {
      throw new AppError('Código é obrigatório', 'MISSING_CODE', 400);
    }

    // Verificar se projeto pertence ao usuário
    if (projectId) {
      const project = await db.get(
        'SELECT id FROM projects WHERE id = ? AND user_id = ?',
        [projectId, req.user.id]
      );

      if (!project) {
        throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
      }
    }

    const cppFile = path.join(tempDir, `${Date.now()}_${filename}`);
    const exeFile = cppFile.replace('.cpp', '.exe');

    try {
      // Escrever código em arquivo
      fs.writeFileSync(cppFile, code);

      // Compilar
      const startTime = Date.now();
      try {
        execSync(`g++ "${cppFile}" -o "${exeFile}"`, { encoding: 'utf-8' });
      } catch (compileErr) {
        throw new AppError(compileErr.message || 'Erro na compilação', 'COMPILE_ERROR', 400);
      }
      const compilationTime = Date.now() - startTime;

      // Salvar log de compilação se projectId fornecido
      if (projectId) {
        const file = await db.get(
          'SELECT id FROM files WHERE project_id = ? AND filename = ?',
          [projectId, filename]
        );

        if (file) {
          await db.run(
            'INSERT INTO compilation_logs (file_id, compiler_output, compilation_status, compiled_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [file.id, 'Compilação bem-sucedida', 'success']
          );
        }
      }

      res.json({
        success: true,
        message: 'Compilação bem-sucedida',
        compilationTime,
        exePath: exeFile
      });

    } finally {
      // Limpar
      if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
    }

  } catch (err) {
    next(err);
  }
});

// ==========================================
// COMPILAR E EXECUTAR C++ - POST /api/compile/cpp-run
// ==========================================

router.post('/cpp-run', async (req, res, next) => {
  try {
    const { code, filename = 'main.cpp', projectId, input = '' } = req.body;

    if (!code) {
      throw new AppError('Código é obrigatório', 'MISSING_CODE', 400);
    }

    // Verificar projeto
    if (projectId) {
      const project = await db.get(
        'SELECT id FROM projects WHERE id = ? AND user_id = ?',
        [projectId, req.user.id]
      );

      if (!project) {
        throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
      }
    }

    const cppFile = path.join(tempDir, `${Date.now()}_${filename}`);
    const exeFile = cppFile.replace('.cpp', '.exe');

    try {
      fs.writeFileSync(cppFile, code);

      // Compilar
      const compileStart = Date.now();
      try {
        execSync(`g++ "${cppFile}" -o "${exeFile}"`, { encoding: 'utf-8' });
      } catch (compileErr) {
        throw new AppError(compileErr.message || 'Erro na compilação', 'COMPILE_ERROR', 400);
      }
      const compilationTime = Date.now() - compileStart;

      // Executar
      const execStart = Date.now();
      let output = '';
      let errors = '';

      try {
        output = execSync(`"${exeFile}"`, {
          encoding: 'utf-8',
          input: input,
          timeout: 5000,
          stdio: ['pipe', 'pipe', 'pipe']
        });
      } catch (execErr) {
        errors = execErr.message || 'Erro na execução';
        output = execErr.stdout || '';
      }

      const executionTime = Date.now() - execStart;

      // Salvar execução
      if (projectId) {
        await db.run(
          'INSERT INTO executions (project_id, code_snippet, language, output, errors, execution_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [projectId, code.substring(0, 500), 'cpp', output, errors, executionTime / 1000, errors ? 'error' : 'success']
        );
      }

      res.json({
        success: true,
        output,
        errors,
        compilationTime,
        executionTime,
        status: errors ? 'error' : 'success'
      });

    } finally {
      if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
      if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
    }

  } catch (err) {
    next(err);
  }
});

// ==========================================
// COMPILAR JAVA - POST /api/compile/java
// ==========================================

router.post('/java', async (req, res, next) => {
  try {
    const { code, className = 'Main', projectId } = req.body;

    if (!code) {
      throw new AppError('Código é obrigatório', 'MISSING_CODE', 400);
    }

    // Verificar projeto
    if (projectId) {
      const project = await db.get(
        'SELECT id FROM projects WHERE id = ? AND user_id = ?',
        [projectId, req.user.id]
      );

      if (!project) {
        throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
      }
    }

    const javaFile = path.join(tempDir, `${className}.java`);
    const classFile = path.join(tempDir, `${className}.class`);

    try {
      fs.writeFileSync(javaFile, code);

      // Compilar
      const startTime = Date.now();
      try {
        execSync(`javac "${javaFile}"`, { encoding: 'utf-8' });
      } catch (compileErr) {
        throw new AppError(compileErr.message || 'Erro na compilação', 'COMPILE_ERROR', 400);
      }
      const compilationTime = Date.now() - startTime;

      // Salvar log
      if (projectId) {
        const file = await db.get(
          'SELECT id FROM files WHERE project_id = ? AND filename = ?',
          [projectId, className + '.java']
        );

        if (file) {
          await db.run(
            'INSERT INTO compilation_logs (file_id, compiler_output, compilation_status) VALUES (?, ?, ?)',
            [file.id, 'Compilação bem-sucedida', 'success']
          );
        }
      }

      res.json({
        success: true,
        message: 'Compilação Java bem-sucedida',
        compilationTime,
        className
      });

    } finally {
      if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
      if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
    }

  } catch (err) {
    next(err);
  }
});

// ==========================================
// COMPILAR E EXECUTAR JAVA - POST /api/compile/java-run
// ==========================================

router.post('/java-run', async (req, res, next) => {
  try {
    const { code, className = 'Main', projectId, input = '' } = req.body;

    if (!code) {
      throw new AppError('Código é obrigatório', 'MISSING_CODE', 400);
    }

    if (projectId) {
      const project = await db.get(
        'SELECT id FROM projects WHERE id = ? AND user_id = ?',
        [projectId, req.user.id]
      );

      if (!project) {
        throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
      }
    }

    const javaFile = path.join(tempDir, `${className}.java`);
    const classFile = path.join(tempDir, `${className}.class`);

    try {
      fs.writeFileSync(javaFile, code);

      // Compilar
      const compileStart = Date.now();
      try {
        execSync(`javac "${javaFile}"`, { encoding: 'utf-8' });
      } catch (compileErr) {
        throw new AppError(compileErr.message || 'Erro na compilação', 'COMPILE_ERROR', 400);
      }
      const compilationTime = Date.now() - compileStart;

      // Executar
      const execStart = Date.now();
      let output = '';
      let errors = '';

      try {
        output = execSync(`java -cp "${tempDir}" ${className}`, {
          encoding: 'utf-8',
          input: input,
          timeout: 5000
        });
      } catch (execErr) {
        errors = execErr.message || 'Erro na execução';
        output = execErr.stdout || '';
      }

      const executionTime = Date.now() - execStart;

      // Salvar execução
      if (projectId) {
        await db.run(
          'INSERT INTO executions (project_id, code_snippet, language, output, errors, execution_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [projectId, code.substring(0, 500), 'java', output, errors, executionTime / 1000, errors ? 'error' : 'success']
        );
      }

      res.json({
        success: true,
        output,
        errors,
        compilationTime,
        executionTime,
        status: errors ? 'error' : 'success'
      });

    } finally {
      if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
      if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
    }

  } catch (err) {
    next(err);
  }
});

// ==========================================
// HISTÓRICO DE EXECUÇÕES - GET /api/compile/history/:projectId
// ==========================================

router.get('/history/:projectId', async (req, res, next) => {
  try {
    // Verificar projeto
    const project = await db.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [req.params.projectId, req.user.id]
    );

    if (!project) {
      throw new AppError('Projeto não encontrado', 'PROJECT_NOT_FOUND', 404);
    }

    const executions = await db.all(
      'SELECT id, language, status, execution_time, created_at FROM executions WHERE project_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.params.projectId]
    );

    res.json({
      success: true,
      executions
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
