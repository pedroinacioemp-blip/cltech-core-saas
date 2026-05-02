// ==========================================
// DATABASE CONFIGURATION & INITIALIZATION
// ==========================================

const path = require('path');
const os = require('os');
const fs = require('fs');

let sqlite3;
let useInMemory = false;

try {
  sqlite3 = require('sqlite3').verbose();
} catch (err) {
  console.warn('⚠ SQLite3 module not available, using in-memory fallback:', err.message);
  useInMemory = true;
}

const isVercel = !!process.env.VERCEL;
const dbPath = !useInMemory 
  ? (process.env.DB_PATH || (isVercel
      ? path.join(os.tmpdir(), 'cltech.db')
      : path.join(__dirname, '../data/cltech.db')))
  : ':memory:';

let db;

if (!useInMemory) {
  const dataDir = path.dirname(dbPath);
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`✓ Diretório de dados criado: ${dataDir}`);
    }
  } catch (e) {
    console.warn('⚠ Não foi possível criar diretório de dados, usando in-memory:', e.message);
    useInMemory = true;
  }
}

try {
  db = new (sqlite3 || require('better-sqlite3'))(dbPath, (err) => {
    if (err) {
      console.warn('⚠ Database connection warning:', err.message);
    } else {
      console.log(`✓ Conectado ao banco de dados: ${dbPath}`);
    }
  });
} catch (e) {
  console.warn('⚠ SQLite3 initialization failed, using stub database:', e.message);
  // Criar stub db para não quebrar a aplicação
  db = {
    serialize: (fn) => fn(),
    run: (sql, params, cb) => {
      if (typeof cb === 'function') cb(null);
    },
    get: (sql, params, cb) => {
      if (typeof cb === 'function') cb(null, null);
    },
    all: (sql, params, cb) => {
      if (typeof cb === 'function') cb(null, []);
    },
    close: (cb) => {
      if (typeof cb === 'function') cb(null);
    }
  };
  useInMemory = true;
}

// Habilitar foreign keys (segura contra erro)
if (db && db.serialize) {
  db.serialize(() => {
    if (db.run) {
      db.run('PRAGMA foreign_keys = ON', () => {});
    }
  });
}

// ==========================================
// DATABASE INITIALIZATION
// ==========================================

const init = async () => {
  return new Promise((resolve) => {
    // Em modo in-memory ou stub, não fazer nada
    if (useInMemory || !sqlite3) {
      console.log('ℹ Database in stub mode (read-only for Vercel)');
      return resolve();
    }

    db.serialize(() => {
      // Tabela: users
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        )
      `, (err) => {
        if (err) console.warn('⚠ Tabela users:', err.message);
      });

      // Tabela: projects
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          language VARCHAR(50),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.warn('⚠ Tabela projects:', err.message);
      });

      // Tabela: files
      db.run(`
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          filename VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          language VARCHAR(50),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.warn('⚠ Tabela files:', err.message);
      });

      // Tabela: executions
      db.run(`
        CREATE TABLE IF NOT EXISTS executions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          code_snippet TEXT,
          language VARCHAR(50),
          output TEXT,
          errors TEXT,
          execution_time REAL,
          status VARCHAR(50),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.warn('⚠ Tabela executions:', err.message);
      });

      // Tabela: compilation_logs
      db.run(`
        CREATE TABLE IF NOT EXISTS compilation_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          file_id INTEGER NOT NULL,
          compiler_output TEXT,
          warnings TEXT,
          errors TEXT,
          compilation_status VARCHAR(50),
          compiled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.warn('⚠ Erro ao criar tabela compilation_logs:', err.message);
        }
        // Sempre resolver, nunca rejeitar para não quebrar serverless
        resolve();
      });
    });
  });
};

// ==========================================
// DATABASE QUERY HELPERS
// ==========================================

const run = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const get = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const all = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✓ Conexão com banco de dados fechada');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  init,
  run,
  get,
  all,
  close
};
