/**
 * API Service - Cliente HTTP para comunicação com backend
 * Responsável por fazer requisições à API em produção
 */

class APIService {
  constructor() {
    // MUDE AQUI PARA SUA URL DO RENDER:
    // this.baseURL = 'http://localhost:3000/api'; // Desenvolvimento
    this.baseURL = 'https://cl-tech-core-backend.onrender.com/api'; // Produção Render
    
    this.token = this.getToken();
  }

  // ==========================================
  // Autenticação
  // ==========================================

  async register(username, email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (data.token) {
        this.saveToken(data.token);
        this.token = data.token;
      }
      return data;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.token) {
        this.saveToken(data.token);
        this.token = data.token;
      }
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('jwt_token');
    this.token = null;
  }

  // ==========================================
  // Projetos
  // ==========================================

  async getProjects() {
    return this._fetch(`${this.baseURL}/projects`, 'GET');
  }

  async createProject(name, description, language) {
    return this._fetch(`${this.baseURL}/projects`, 'POST', {
      name, description, language
    });
  }

  async updateProject(id, name, description) {
    return this._fetch(`${this.baseURL}/projects/${id}`, 'PUT', {
      name, description
    });
  }

  async deleteProject(id) {
    return this._fetch(`${this.baseURL}/projects/${id}`, 'DELETE');
  }

  // ==========================================
  // Compilação
  // ==========================================

  async compileCppAndRun(code, projectId, input = '') {
    return this._fetch(`${this.baseURL}/compile/cpp-run`, 'POST', {
      code,
      projectId,
      input,
      filename: 'main.cpp'
    });
  }

  async compileJavaAndRun(code, projectId, input = '') {
    return this._fetch(`${this.baseURL}/compile/java-run`, 'POST', {
      code,
      projectId,
      input,
      filename: 'Main.java'
    });
  }

  // ==========================================
  // Helpers
  // ==========================================

  async _fetch(url, method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  saveToken(token) {
    localStorage.setItem('jwt_token', token);
  }

  getToken() {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Instância global
const api = new APIService();