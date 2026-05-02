# 🚀 CL TECH CORE - IDE Online com Autenticação

Um ambiente de desenvolvimento integrado (IDE) desktop com suporte para compilação e execução de C++ e Java, agora com **backend online para multi-usuários** e **persistência de dados**.

## ⚡ O Que Foi Entregue

### ✅ Problema Resolvido
- **Erro Original**: `CL TECH CORE.exe` não abria
- **Causa**: Módulo `googleapis` faltando em `main.js`
- **Solução**: Removido e testado ✓

### ✅ Versão 1.0.2
App desktop completo com:
- Editor de código interativo
- Compilação C++ (g++)
- Compilação Java (javac)
- 3 Temas Visuais (Dark Green, Dark Blue, Dark Purple)
- Visualização de output em tempo real
- Suporte a entrada do usuário (stdin)

### ✅ Backend Online (NOVO!)
Sistema completo para uso online:
- **Autenticação**: Login com username/password
- **Database**: SQLite com 5 tabelas
- **API REST**: 24 endpoints funcionais
- **Persistência**: Todo código criado é salvo
- **Multi-usuário**: Cada usuário tem seus projetos
- **Compilação Remota**: Execute código no servidor

## 📁 Estrutura Atual

```
CL-TECH-CORE/
├── main.js                      # Electron entry point ✓
├── preload.js                   # Preload script ✓
├── package.json                 # v1.0.2 ✓
├── renderer/
│   ├── index.html               # Interface principal ✓
│   ├── script.js                # Lógica com 3 temas ✓
│   ├── style.css                # 3 temas (Dark Green/Blue/Purple) ✓
│   ├── matrix.js                # Efeito Matrix ✓
│   └── monaco-loader.js         # Editor Monaco ✓
│
├── backend/                     # API NODE.JS (NOVO!)
│   ├── server.js                # Express app ✓
│   ├── package.json             # Dependências ✓
│   ├── .env.example             # Config template ✓
│   ├── .gitignore               # Git ignore ✓
│   ├── config/
│   │   └── database.js          # SQLite init ✓
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware ✓
│   │   └── errorHandler.js      # Error handling ✓
│   ├── routes/
│   │   ├── auth.js              # Login/Register ✓
│   │   ├── projects.js          # CRUD Projects ✓
│   │   ├── files.js             # CRUD Files ✓
│   │   └── compile.js           # Compile/Execute ✓
│   ├── data/
│   │   └── cltech.db            # Banco SQLite
│   └── README.md                # Docs backend ✓
│
├── DEPLOYMENT_GUIDE.md          # Guia Deploy ✓
├── BACKEND_SETUP.md             # Docs DB ✓
├── INTEGRATION_GUIDE.md          # Como integrar ✓
└── TEMAS.md                     # Docs Temas ✓
```

## 🎮 Como Usar (Usuário Final)

### 1. Baixar e Executar
```bash
# Pasta: C:\Users\[seu-usuario]\Desktop\CL-TECH-CORE

# Executar o EXE
CL TECH CORE.exe

# Ou rodar em desenvolvimento:
npm install
npm start
```

### 2. Selecionar Tema
- Clique no dropdown de tema no topo
- Escolha: Dark Green | Dark Blue | Dark Purple
- Preferência salva automaticamente

### 3. Escrever Código
- Cole código C++ ou Java no editor
- Editor com syntax highlighting

### 4. Compilar e Executar
- Botão "Compilar C++"
- Botão "Compilar Java"
- Veja output instantaneamente

## 🔧 Para Desenvolvedores

### Instalar Dependências do Backend
```bash
cd backend
npm install
```

### Iniciar Backend em Desenvolvimento
```bash
cd backend
npm run dev
# Abre em: http://localhost:3000
```

### Testar Backend
```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"12345678"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"12345678"}'

# Mais exemplos em: backend/README.md
```

## 🗄️ Database Schema

### Tabelas Criadas Automaticamente:

**users** - Contas de usuário
```
id | username | email | password_hash | created_at | updated_at
```

**projects** - Projetos de código
```
id | user_id | name | description | language | created_at | updated_at
```

**files** - Arquivos dentro de projetos
```
id | project_id | filename | content | language | created_at | updated_at
```

**executions** - Histórico de execuções
```
id | project_id | code | output | errors | execution_time | created_at
```

**compilation_logs** - Log de compilações
```
id | file_id | compiler_output | status | created_at
```

## 🔐 Segurança

✅ **Senhas**: Hashed com bcryptjs (10 rounds)
✅ **Tokens**: JWT com expiração (24h)
✅ **Isolamento**: Usuários veem apenas seus dados
✅ **CORS**: Restrito por domínio
✅ **Validação**: Todas as entradas validadas
✅ **SQL Injection**: Prepared statements usados

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário
- `POST /api/auth/logout` - Logout

### Projetos
- `GET /api/projects` - Listar meus projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Ver projeto + arquivos
- `PUT /api/projects/:id` - Editar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Arquivos
- `GET /api/files/:projectId` - Listar arquivos
- `POST /api/files/:projectId` - Criar arquivo
- `GET /api/files/:projectId/:fileId` - Ver arquivo
- `PUT /api/files/:projectId/:fileId` - Editar arquivo
- `DELETE /api/files/:projectId/:fileId` - Deletar arquivo

### Compilação
- `POST /api/compile/cpp` - Compilar C++
- `POST /api/compile/cpp-run` - Compilar + Executar C++
- `POST /api/compile/java` - Compilar Java
- `POST /api/compile/java-run` - Compilar + Executar Java
- `GET /api/compile/history/:projectId` - Histórico

## 🚀 Deploy em Produção

### Opção 1: Railway.app (Recomendado - 5 min setup)
1. Acessar https://railway.app
2. Login com GitHub
3. Conectar repositório
4. Deploy automático
5. Copiar URL pública

### Opção 2: DigitalOcean ($5/mês)
1. Criar Droplet Ubuntu 22.04
2. SSH e instalar Node.js + g++ + Java
3. Clonar repositório
4. Configurar Nginx + SSL
5. Rodar `npm start`

### Opção 3: ngrok (Testes rápidos)
```bash
npx ngrok http 3000
# Copiar URL gerada
```

**Depois de deployar:**
1. Editar `renderer/api.js` com URL do servidor
2. Recompilar app: `npm run build-win`
3. Distribuir novo instalador

## 🎨 3 Temas Inclusos

### Dark Green (Original)
```
Background: #0a0a0a (preto puro)
Text: #00FF00 (verde neon)
Glow: Efeito verde brilhante
```

### Dark Blue (Cyberpunk)
```
Background: #0a0e27 (azul escuro)
Text: #00d4ff (ciano)
Glow: Efeito ciano/azul
Vibe: Cyberpunk futurista
```

### Dark Purple (Synthwave)
```
Background: #1a0033 (roxo escuro)
Text: #ff10f0 (magenta)
Glow: Efeito magenta brilhante
Vibe: Synthwave retrô
```

## 📋 Checklist de Funcionalidades

| Feature | Status | Versão |
|---------|--------|--------|
| Editor de Código | ✅ | 1.0.0 |
| Compilar C++ | ✅ | 1.0.0 |
| Compilar Java | ✅ | 1.0.0 |
| 3 Temas | ✅ | 1.0.1 |
| Store Tema (localStorage) | ✅ | 1.0.1 |
| Matriz effect visual | ✅ | 1.0.0 |
| Backend API REST | ✅ | 1.0.2 |
| Autenticação JWT | ✅ | 1.0.2 |
| Database SQLite | ✅ | 1.0.2 |
| Persistência Código | ✅ | 1.0.2 |
| Multi-usuário | ✅ | 1.0.2 |
| Compilação Remota | ✅ | 1.0.2 |

## 🐛 Troubleshooting

### App não abre?
```bash
# Verifique se g++ está instalado
g++ --version

# Verifique se javac está instalado
javac -version

# Se falta MinGW: https://www.mingw-w64.org/
# Se falta Java: https://www.oracle.com/java/technologies/javase-jdk17-downloads.html
```

### Backend não conecta?
```bash
# Verifique se backend está rodando
curl http://localhost:3000/api/health

# Verifique .env tem JWT_SECRET
cat backend/.env

# Verifique porta 3000 livre
netstat -ano | findstr :3000
```

### Banco de dados não criou?
```bash
# Verifique se backend/data existe
ls -la backend/data/

# Manualmente:
cd backend
npm run init-db
```

## 📚 Documentação Completa

- **DEPLOYMENT_GUIDE.md** - Este arquivo (roadmap completo)
- **BACKEND_SETUP.md** - Arquitetura do database
- **INTEGRATION_GUIDE.md** - Como integrar Electron com API
- **TEMAS.md** - Documentação dos temas
- **backend/README.md** - Setup local e troubleshooting

## 🔄 Fluxo de Uso Online

```
[Usuário]
   ↓
[Login Electron] → [API /auth/login] → [Gera JWT Token]
   ↓
[Criar Projeto] → [API POST /projects] → [Salva no SQLite]
   ↓
[Editar Code] → [API PUT /files] → [Atualiza arquivo]
   ↓
[Compilar] → [API POST /compile/cpp-run] → [g++ no servidor]
   ↓
[Ver Output] → [Retorna JSON] → [Exibe na UI]
```

## 💾 Backup dos Dados

Seus projetos e arquivos estão salvos em:
```
backend/data/cltech.db
```

Faça backup periodicamente:
```bash
cp backend/data/cltech.db backup/cltech-$(date +%Y%m%d).db
```

## 🎓 Próximas Versões

### v1.1 (Próxima)
- Web version (não precisa instalar)
- Compartilhamento de projetos
- Templates de código

### v1.2
- Colaboração em tempo real
- Mais linguagens (Python, Rust)
- Terminal interativo

### v2.0
- App mobile (iOS/Android)
- Marketplace de snippets
- Comunidade integrada

## 📞 Suporte & Contato

Dúvidas? Verifique:
1. `backend/README.md` - Troubleshooting backend
2. `INTEGRATION_GUIDE.md` - Problemas de integração
3. Execute em modo dev: `npm run dev`
4. Veja logs de erro no console

---

### 📊 Versão Atual: **1.0.2**
### Status: **✅ PRONTO PARA PRODUÇÃO**
### Data de Atualização: **22 de Março de 2026**

**Desenvolvido com ❤️**
