# CL TECH CORE - Backend & Database Architecture

## 📊 Visão Geral da Arquitetura

```
┌─────────────────────┐
│   Cliente Desktop   │ (Electron App)
│   (CL TECH CORE)    │
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│   API Backend       │ (Node.js + Express)
│   (Port 3000)       │
└──────────┬──────────┘
           │
    ┌──────┴──────────┐
    ↓                 ↓
┌─────────┐      ┌──────────┐
│JWT Auth │      │ Database │
│ System  │      │ (SQLite) │
└─────────┘      └──────────┘
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais:

#### 1. **users** - Usuários do Sistema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **projects** - Projetos de Código
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. **files** - Arquivos de Código
```sql
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  filename VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### 4. **executions** - Histórico de Execuções
```sql
CREATE TABLE executions (
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
);
```

#### 5. **compilation_logs** - Logs de Compilação
```sql
CREATE TABLE compilation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id INTEGER NOT NULL,
  compiler_output TEXT,
  warnings TEXT,
  errors TEXT,
  compilation_status VARCHAR(50),
  compiled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);
```

## 🔐 Sistema de Autenticação

### Fluxo de Login:
1. Usuário envia username + password
2. Backend valida credenciais
3. Se válido, gera JWT token com expiração de 24h
4. Cliente armazena token em localStorage
5. Todas as requisições incluem token no header Authorization

### JWT Structure:
```javascript
{
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    id: user_id,
    username: 'usuario',
    email: 'user@example.com',
    iat: timestamp,
    exp: timestamp + 86400000
  },
  signature: HMAC_SHA256
}
```

## 🚀 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/refresh` - Renovar token JWT

### Projetos
- `GET /api/projects` - Listar projetos do usuário
- `POST /api/projects` - Criar novo projeto
- `GET /api/projects/:id` - Obter detalhes do projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Arquivos
- `GET /api/projects/:projectId/files` - Listar arquivos
- `POST /api/projects/:projectId/files` - Criar arquivo
- `GET /api/files/:id` - Obter conteúdo do arquivo
- `PUT /api/files/:id` - Atualizar arquivo
- `DELETE /api/files/:id` - Deletar arquivo

### Compilação & Execução
- `POST /api/compile` - Compilar código
- `POST /api/execute` - Executar código
- `GET /api/executions/:projectId` - Histórico de execuções
- `GET /api/compilations/:fileId` - Histórico de compilações

### Busca
- `POST /api/search` - Buscar código nos projetos do usuário

## 📦 Stack Tecnológico Recomendado

### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados leve e portável
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Variáveis de ambiente
- **cors** - Controle de acesso
- **helmet** - Segurança HTTP

### Cliente (Electron)
- **axios** - Cliente HTTP
- **jwt-decode** - Decodificar JWT
- **crypto** - Criptografia local

## 🔑 Variáveis de Ambiente (.env)

```
# Servidor
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria
JWT_EXPIRATION=24h

# Database
DB_PATH=./data/cltech.db

# CORS
CORS_ORIGIN=http://localhost:3000,https://seu-dominio.com

# Compiladores
CPP_COMPILER=g++
JAVA_COMPILER=javac

# Git Integration
GIT_REPO_PATH=./repos
```

## 🔄 Fluxo de Uso

### 1. Usuário Novo
```
[Registrar] → Username + Email + Senha → Backend cria user → Retorna JWT
```

### 2. Usuário Existente
```
[Login] → Username + Senha → Backend valida → Retorna JWT
```

### 3. Criar Projeto
```
[Novo Projeto] → Backend cria project → Retorna ID → Cliente armazena localmente
```

### 4. Criar Arquivo
```
[Novo Arquivo] → Backend cria file → Cliente envia conteúdo → Backend salva
```

### 5. Compilar/Executar
```
[Compilar/Run] → Backend recebe code → Executa localmente → Retorna output → Cliente mostra resultado
```

## 🌐 Deployment Options

### Opção 1: Railway.app (Recomendado)
- Deploy gratuito para aplicações pequenas
- Conecta direto com GitHub
- Hospeda backend + banco de dados

### Opção 2: Heroku
- Platform-as-a-Service
- Fácil de usar
- Tier gratuito limitado

### Opção 3: DigitalOcean
- Droplet (servidor virtual) por $5/mês
- Controle total
- Hospedagem de git

### Opção 4: Seu PC com ngrok
- Para desenvolvimento/testes
- Exponha servidor local na internet
- Perfeito para começar

## 📁 Estrutura de Pastas do Backend

```
cl-tech-core-backend/
├── server.js              # Entry point
├── package.json           # Dependências
├── .env                   # Variáveis de ambiente
├── .gitignore             # Ignorar arquivos
├── config/
│   ├── database.js        # Configuração SQLite
│   └── jwt.js             # Configuração JWT
├── routes/
│   ├── auth.js            # Rotas de autenticação
│   ├── projects.js        # Rotas de projetos
│   ├── files.js           # Rotas de arquivos
│   ├── compile.js         # Rotas de compilação
│   └── search.js          # Rotas de busca
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── fileController.js
│   └── compileController.js
├── middleware/
│   ├── auth.js            # Verificar JWT
│   ├── errorHandler.js    # Tratamento de erros
│   └── validation.js      # Validação de dados
├── models/
│   └── database.js        # Schema e queries
├── utils/
│   ├── crypto.js          # Funções de segurança
│   └── logger.js          # Logging
└── data/
    └── cltech.db          # Banco de dados SQLite
```

## 🛡️ Segurança

### Implementações Necessárias:
- ✅ Hash de senhas com bcryptjs (salt rounds: 10)
- ✅ JWT tokens com expiração
- ✅ HTTPS em produção
- ✅ Rate limiting em endpoints de autenticação
- ✅ Validação de entrada (sanitização)
- ✅ CORS restritivo
- ✅ Headers de segurança (Helmet)
- ✅ SQL Injection prevention (prepared statements)
- ✅ Senhas fortes (min 8 caracteres, mix)
- ✅ Refresh tokens para renovação segura

## 📊 Métricas & Monitoramento

### O que Monitorar:
- Requisições login/registro por hora (DDoS detection)
- Taxa de erro da API
- Tempo de resposta dos compiladores
- Espaço em disco do banco de dados
- Active users e sessões
- CPU/Memory do servidor

## 🚀 Roadmap de Implementação

### Fase 1: Backend Core
- [x] Setup Node.js + Express
- [x] Configurar SQLite
- [x] Implementar autenticação JWT
- [x] Criar API endpoints básicos

### Fase 2: Cliente Integration
- [x] Conectar Electron ao backend
- [x] Armazenar JWT localmente
- [x] Implementar login/register no UI
- [x] Sync de projetos

### Fase 3: Recursos Avançados
- [ ] Compartilhamento de projetos
- [ ] Colaboração em tempo real (WebSocket)
- [ ] Sistema de templates
- [ ] Marketplace de snippets

### Fase 4: Deployment
- [ ] Setup em servidor de produção
- [ ] HTTPS/SSL
- [ ] SSL/TLS
- [ ] Backup automático
- [ ] Monitoramento

---

**Próxima etapa**: Implementar o `server.js` e criar os arquivos de backend!

**Data**: 22 de Março de 2026  
**Versão**: 1.0.2
