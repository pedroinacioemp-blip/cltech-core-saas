# CL TECH CORE - Backend API

Backend Node.js + Express para o CL TECH CORE IDE. Fornece API REST para autenticação, gerenciamento de projetos, compilação e execução de código.

## 📋 Pré-requisitos

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+
- **g++** (para compilar C++) - [MinGW no Windows](https://www.mingw-w64.org/)
- **javac** (para compilar Java) - [JDK](https://www.oracle.com/java/technologies/downloads/)
- **Git** (para versionamento)

## 🚀 Instalação Local

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/cl-tech-core.git
cd cl-tech-core/backend
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo example
cp .env.example .env

# Editar .env com seus valores
# Mude especialmente JWT_SECRET para uma chave aleatória forte
```

### 4. Inicializar Banco de Dados
```bash
npm run init-db
```

### 5. Iniciar Servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🧪 Testando a API

### Registrar Novo Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "senha123456",
    "confirmPassword": "senha123456"
  }'
```

### Fazer Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "senha123456"
  }'
```

### Criar Projeto
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "name": "Meu Primeiro Projeto",
    "description": "Um projeto de teste",
    "language": "cpp"
  }'
```

### Compilar C++
```bash
curl -X POST http://localhost:3000/api/compile/cpp-run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "code": "#include <iostream>\nusing namespace std;\nint main() {\n cout << \"Hello World!\";\n return 0;\n}",
    "projectId": 1
  }'
```

## 🌐 Deployment

### Opção 1: Railway (Recomendado para Iniciantes)

1. Criar conta em [Railway.app](https://railway.app)
2. Conectar seu repositório do GitHub
3. Railway detectará `package.json` e configurará automaticamente
4. Definir variáveis de ambiente no painel
5. Deploy é feito automaticamente em cada push

**Vantagens:**
- Gratuito para começar
- Deploy automático
- Banco de dados incluso
- HTTPS automático

### Opção 2: DigitalOcean Droplet

1. Criar Droplet com Ubuntu 22.04
2. SSH para o servidor:
   ```bash
   ssh root@SEU_IP
   ```

3. Instalar Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Instalar g++ e Java:
   ```bash
   sudo apt-get install -y build-essential openjdk-11-jdk
   ```

5. Clonar repositório:
   ```bash
   git clone https://github.com/seu-usuario/cl-tech-core.git
   cd cl-tech-core/backend
   npm install
   ```

6. Instalar PM2 para gerenciar processo:
   ```bash
   sudo npm install -g pm2
   ```

7. Criar arquivo `.env`:
   ```bash
   cp .env.example .env
   nano .env  # Editar valores
   ```

8. Iniciar com PM2:
   ```bash
   pm2 start server.js --name "cl-tech-core"
   pm2 startup
   pm2 save
   ```

9. Instalar Nginx como reverse proxy:
   ```bash
   sudo apt-get install -y nginx
   ```

10. Configurar Nginx:
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Adicionar:
    ```nginx
    server {
      listen 80;
      server_name seu-dominio.com;

      location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
      }
    }
    ```

11. Instalar SSL com Certbot:
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d seu-dominio.com
    ```

### Opção 3: Vercel/Netlify

Vercel não suporta bem aplicações de longa duração como servidores Express. Recomenda-se Railway ou DigitalOcean.

## 📊 Estrutura do Projeto

```
backend/
├── server.js              # Servidor principal
├── package.json           # Dependências
├── .env.example           # Template de configuração
├── .gitignore             # Arquivos a ignorar
├── README.md              # Este arquivo
│
├── config/
│   └── database.js        # Configuração SQLite
│
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── errorHandler.js    # Error handling
│
├── routes/
│   ├── auth.js            # Autenticação
│   ├── projects.js        # Gerenciamento de projetos
│   ├── files.js           # Gerenciamento de arquivos
│   └── compile.js         # Compilação e execução
│
└── data/
    └── cltech.db          # Banco de dados SQLite
```

## 🔐 Segurança

### Checklist de Segurança:
- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT tokens com expiração
- ✅ HTTPS em produção (Certbot + Nginx)
- ✅ CORS restritivo
- ✅ Headers de segurança (Helmet)
- ✅ Validação de entrada
- ✅ Rate limiting (implementar com express-rate-limit)

### Habilitar Rate Limiting (Adicionar depois):
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});

app.use('/api/', limiter);
```

## 🐛 Troubleshooting

### "g++ command not found"
- Windows: Instalar [MinGW](https://www.mingw-w64.org/)
- macOS: `brew install gcc`
- Linux: `sudo apt-get install build-essential`

### "javac command not found"
- Instalar JDK ([Download](https://www.oracle.com/java/technologies/downloads/))
- Adicionar ao PATH

### Porta 3000 já em uso
```bash
# Windows
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
# Kill process
kill -9 <PID>
```

## 📈 Monitoramento em Produção

### Logs
```bash
# Ver logs em tempo real
pm2 logs

# Ver logs históricos
pm2 logs --lines 100
```

### Métricas
```bash
# Dashboard PM2
pm2 monit

# Status dos processos
pm2 status
```

## 🔄 Atualizações & Manutenção

### Sincronizar com GitHub
```bash
git pull origin main
npm install  # Se teve novas dependências
pm2 restart all
```

### Backup do Banco de Dados
```bash
cp data/cltech.db data/cltech.db.backup.$(date +%Y%m%d)
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Abra uma [Issue no GitHub](https://github.com/seu-usuario/cl-tech-core/issues)
2. Describe o erro detalhadamente
3. Inclua arquivos de log relevantes

## 📄 Licença

MIT - Veja LICENSE para detalhes

---

**Versão**: 1.0.2  
**Última Atualização**: 22 de Março de 2026
