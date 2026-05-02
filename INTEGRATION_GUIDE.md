# CL TECH CORE - Integração Electron + Backend

Guia completo para integrar o CL TECH CORE Electron com o Backend API.

## 🔗 Configuração de Conexão

### 1. Instalar Bibliotecas Necessárias

Adicione ao `package.json` do Electron:
```bash
npm install axios jwt-decode
```

### 2. Criar Serviço de API

Criar arquivo `renderer/api.js`:

```javascript
const axios = require('axios');
const jwt_decode = require('jwt-decode');

class APIService {
  constructor() {
    this.baseURL = process.env.API_URL || 'http://localhost:3000/api';
    this.token = localStorage.getItem('authToken');
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token expirado - fazer logout
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    if (!this.token) return false;
    
    try {
      const decoded = jwt_decode(this.token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    window.location.reload();
  }

  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================

  async register(username, email, password, confirmPassword) {
    const response = await axios.post(`${this.baseURL}/auth/register`, {
      username,
      email,
      password,
      confirmPassword
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response.data;
  }

  async login(username, password) {
    const response = await axios.post(`${this.baseURL}/auth/login`, {
      username,
      password
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response.data;
  }

  async getMe() {
    const response = await axios.get(`${this.baseURL}/auth/me`);
    return response.data;
  }

  // ==========================================
  // PROJETOS
  // ==========================================

  async listProjects() {
    const response = await axios.get(`${this.baseURL}/projects`);
    return response.data.projects;
  }

  async createProject(name, description, language) {
    const response = await axios.post(`${this.baseURL}/projects`, {
      name,
      description,
      language
    });
    return response.data.project;
  }

  async getProject(projectId) {
    const response = await axios.get(`${this.baseURL}/projects/${projectId}`);
    return response.data.project;
  }

  async updateProject(projectId, name, description, language) {
    const response = await axios.put(`${this.baseURL}/projects/${projectId}`, {
      name,
      description,
      language
    });
    return response.data.project;
  }

  async deleteProject(projectId) {
    await axios.delete(`${this.baseURL}/projects/${projectId}`);
  }

  // ==========================================
  // ARQUIVOS
  // ==========================================

  async listFiles(projectId) {
    const response = await axios.get(`${this.baseURL}/files/${projectId}`);
    return response.data.files;
  }

  async getFile(projectId, fileId) {
    const response = await axios.get(`${this.baseURL}/files/${projectId}/${fileId}`);
    return response.data.file;
  }

  async createFile(projectId, filename, content, language) {
    const response = await axios.post(`${this.baseURL}/files/${projectId}`, {
      filename,
      content,
      language
    });
    return response.data.file;
  }

  async updateFile(projectId, fileId, content, filename, language) {
    const response = await axios.put(
      `${this.baseURL}/files/${projectId}/${fileId}`,
      { content, filename, language }
    );
    return response.data.file;
  }

  async deleteFile(projectId, fileId) {
    await axios.delete(`${this.baseURL}/files/${projectId}/${fileId}`);
  }

  // ==========================================
  // COMPILAÇÃO & EXECUÇÃO
  // ==========================================

  async compileCpp(code, filename = 'main.cpp', projectId = null) {
    const response = await axios.post(`${this.baseURL}/compile/cpp`, {
      code,
      filename,
      projectId
    });
    return response.data;
  }

  async compileCppAndRun(code, filename = 'main.cpp', projectId = null, input = '') {
    const response = await axios.post(`${this.baseURL}/compile/cpp-run`, {
      code,
      filename,
      projectId,
      input
    });
    return response.data;
  }

  async compileJava(code, className = 'Main', projectId = null) {
    const response = await axios.post(`${this.baseURL}/compile/java`, {
      code,
      className,
      projectId
    });
    return response.data;
  }

  async compileJavaAndRun(code, className = 'Main', projectId = null, input = '') {
    const response = await axios.post(`${this.baseURL}/compile/java-run`, {
      code,
      className,
      projectId,
      input
    });
    return response.data;
  }

  async getExecutionHistory(projectId, limit = 50) {
    const response = await axios.get(
      `${this.baseURL}/compile/history/${projectId}?limit=${limit}`
    );
    return response.data.executions;
  }
}

module.exports = new APIService();
```

### 3. Integrar com script.js Existente

Adicione ao início do `script.js`:

```javascript
const api = require('./api');

class CLTechCore {
  constructor() {
    this.currentFile = null;
    this.currentLanguage = 'unknown';
    this.currentProjectId = null;  // NOVO
    this.compiling = false;
    this.user = null;  // NOVO
    this.projects = [];  // NOVO
    this.initElements();
    this.setupEventListeners();
    this.checkAuthentication();  // NOVO - ao invés de checkCompilers()
  }

  async checkAuthentication() {
    try {
      if (!api.isAuthenticated()) {
        this.showLoginScreen();  // NOVO
        return;
      }

      const user = await api.getMe();
      this.user = user;
      this.setStatus('✓ Autenticado como ' + user.username, 'ready');
      
      this.loadProjects();  // NOVO
    } catch (err) {
      this.showLoginScreen();  // NOVO
    }
  }

  showLoginScreen() {
    // TODO: Implementar tela de login/registro
    // Por enquanto, mostrar alerta
    alert('Por favor, faça login para continuar');
  }

  async loadProjects() {
    try {
      this.projects = await api.listProjects();
      this.addConsoleLog(`✓ ${this.projects.length} projetos carregados`, 'success');
    } catch (err) {
      this.addConsoleLog(`✗ Erro ao carregar projetos: ${err.message}`, 'error');
    }
  }

  // Modificar método runCode()
  async runCode() {
    if (this.compiling) {
      this.addConsoleLog('Compilação em andamento...', 'warning');
      return;
    }

    const code = this.codeEditor.value.trim();
    if (!code) {
      this.addConsoleLog('Por favor, escreva algum código', 'warning');
      return;
    }

    if (this.currentLanguage === 'unknown') {
      this.addConsoleLog('Linguagem não detectada', 'error');
      return;
    }

    this.clearConsole();
    this.compiling = true;
    this.setStatus('Compilando...', 'compiling');

    try {
      let result;

      if (this.currentLanguage === 'cpp') {
        result = await api.compileCppAndRun(
          code,
          'main.cpp',
          this.currentProjectId
        );
      } else if (this.currentLanguage === 'java') {
        result = await api.compileJavaAndRun(
          code,
          'Main',
          this.currentProjectId
        );
      }

      if (result.output) {
        this.addConsoleLog(result.output, 'success');
      }
      if (result.errors) {
        this.addConsoleLog('ERROS: ' + result.errors, 'error');
      }

      this.addConsoleLog(
        `Tempo de execução: ${result.executionTime}ms`,
        'info'
      );
      this.setStatus('✓ Execução concluída', 'ready');

    } catch (err) {
      this.addConsoleLog('✗ Erro: ' + err.message, 'error');
      this.setStatus('Erro na compilação', 'error');
    } finally {
      this.compiling = false;
    }
  }
}
```

## 🔐 Tela de Login

Crie um arquivo `renderer/login.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CL TECH CORE - Login</title>
  <link rel="stylesheet" href="login-style.css">
</head>
<body>
  <div class="login-container">
    <div class="login-box">
      <h1>CL TECH CORE</h1>
      <p>Hacker IDE para C++ & Java</p>

      <form id="loginForm">
        <div class="form-group">
          <input type="text" id="username" placeholder="Usuário" required>
        </div>
        <div class="form-group">
          <input type="password" id="password" placeholder="Senha" required>
        </div>
        <button type="submit" class="btn-login">Login</button>
      </form>

      <p class="toggle-text">
        Não tem conta? <a href="#" onclick="toggleRegister(event)">Registre-se</a>
      </p>

      <form id="registerForm" style="display:none;">
        <div class="form-group">
          <input type="text" id="reg-username" placeholder="Usuário" required>
        </div>
        <div class="form-group">
          <input type="email" id="reg-email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <input type="password" id="reg-password" placeholder="Senha" required>
        </div>
        <div class="form-group">
          <input type="password" id="reg-confirm" placeholder="Confirmar Senha" required>
        </div>
        <button type="submit" class="btn-login">Registrar</button>
      </form>

      <p class="toggle-text" id="backToLogin" style="display:none;">
        Já tem conta? <a href="#" onclick="toggleRegister(event)">Login</a>
      </p>

      <div id="loginError" class="error-message"></div>
    </div>
  </div>

  <script src="api.js"></script>
  <script src="login.js"></script>
</body>
</html>
```

Crie `renderer/login.js`:

```javascript
const api = require('./api');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    await api.login(username, password);
    window.location.href = 'index.html';  // Redirecionar para app
  } catch (err) {
    document.getElementById('loginError').textContent = 
      err.response?.data?.message || err.message;
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm').value;

  try {
    await api.register(username, email, password, confirmPassword);
    window.location.href = 'index.html';
  } catch (err) {
    document.getElementById('loginError').textContent = 
      err.response?.data?.message || err.message;
  }
});

function toggleRegister(e) {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 
    document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = 
    document.getElementById('registerForm').style.display === 'none' ? 'block' : 'none';
  document.getElementById('backToLogin').style.display = 
    document.getElementById('backToLogin').style.display === 'none' ? 'block' : 'none';
}
```

## 🌍 Variáveis de Ambiente

Crie `.env` na raiz do projeto:

```
# Desenvolvimento
API_URL=http://localhost:3000/api

# Produção
# API_URL=https://seu-servidor.com/api
```

## 🚀 Fluxo de Uso

1. **Usuário abre app** → Verifica autenticação
2. **Sem token** → Mostra tela de login
3. **Faz login/registro** → Recebe JWT token
4. **Token salvo** → localStorage / sessionStorage
5. **App carrega** → Busca projetos do usuário
6. **Cria/edita projeto** → Sincroniza com backend
7. **Compila código** → Envia para backend
8. **Backend compila** → Retorna resultado
9. **App mostra output** → No console

## 🔄 Sincronização Offline

Para suportar modo offline:

```javascript
// Salvar projetos em localStorage
localStorage.setItem(
  'localProjects',
  JSON.stringify(this.projects)
);

// Sincronizar quando voltar online
window.addEventListener('online', async () => {
  // TODO: Sync local changes with server
});
```

## 📱 Arquitetura

```
┌─────────────────────────────┐
│   CL TECH CORE (Electron)   │
├─────────────────────────────┤
│ index.html (UI)             │
│ script.js (Lógica)          │
│ api.js ← (Chamadas HTTP)    │
└────────────┬────────────────┘
             │ HTTP/HTTPS
             ↓
┌─────────────────────────────┐
│   Backend Node.js/Express   │
├─────────────────────────────┤
│ /api/auth                   │
│ /api/projects               │
│ /api/files                  │
│ /api/compile                │
└────────────┬────────────────┘
             │ SQL
             ↓
┌─────────────────────────────┐
│   SQLite Database           │
└─────────────────────────────┘
```

## 🧪 Teste de Integração

1. Inicie backend: `npm run dev` (na pasta backend)
2. Inicie app: `npm start` (na pasta raiz)
3. Registre novo usuário
4. Crie projeto
5. Crie arquivo
6. Compile e execute código

---

**Versão**: 1.0.2  
**Data**: 22 de Março de 2026
