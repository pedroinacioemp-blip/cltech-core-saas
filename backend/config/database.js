// ==========================================
// DATABASE CONFIGURATION & INITIALIZATION
// ==========================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/cltech.db');
const dataDir = path.dirname(dbPath);

// Criar diretório data se não existir
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`✓ Diretório de dados criado: ${dataDir}`);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('✗ Erro ao conectar ao banco de dados:', err);
  } else {
    console.log(`✓ Conectado ao banco de dados: ${dbPath}`);
  }
});

// Habilitar foreign keys
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
});

// ==========================================
// DATABASE INITIALIZATION
// ==========================================

const init = async () => {
  return new Promise((resolve, reject) => {
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
        if (err) reject(err);
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
        if (err) reject(err);
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
        if (err) reject(err);
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
        if (err) reject(err);
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
          reject(err);
        } else {
          resolve();
        }
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
