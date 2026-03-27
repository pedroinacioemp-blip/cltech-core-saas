# ⚡ GETTING STARTED - 5 Minutos

## 🎯 Objetivo
Você terá um **SaaS completo rodando localmente** com Backend .NET 8, Frontend React, WhatsApp Bot e SQL Server.

---

## ✅ PASSO 1: Preparação (2 min)

### 1.1 Abrir Terminal PowerShell
```powershell
cd C:\Users\Administrator\Desktop\CL-TECH-CORE-ECOSYSTEM
```

### 1.2 Verificar Docker
```powershell
docker --version
docker-compose --version
```

Se não tiver Docker, instale em: https://www.docker.com/products/docker-desktop

---

## 🚀 PASSO 2: Iniciar Tudo (2 min)

### 2.1 Copiar Variáveis de Ambiente
```powershell
Copy-Item .env.development .env
```

### 2.2 Iniciar Docker Compose
```powershell
docker-compose up -d
```

**Aguarde ~2 min para services iniciarem...**

### 2.3 Verificar Status
```powershell
docker-compose ps
```

Você deve ver:
- ✅ **api** (Running)
- ✅ **frontend** (Running)
- ✅ **sqlserver** (Running)
- ✅ **redis** (Running)

---

## 🌐 PASSO 3: Acessar Plataforma (1 min)

| Serviço | URL | Credencial |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | admin@cltech.com / Admin@123 |
| **API** | http://localhost:5000 | (JWT Token necessário) |
| **Swagger** | http://localhost:5000/swagger | Documentação interativa |
| **Hangfire** | http://localhost:5000/hangfire | Job dashboard |

### Primeiro Login:
1. Abra http://localhost:3000
2. Email: `admin@cltech.com`
3. Senha: `Admin@123`

---

## 🔥 Comandos Úteis

```powershell
# Ver logs em tempo real
docker-compose logs -f api

# Entrar em um container
docker-compose exec api bash

# Stop todos services
docker-compose down

# Reset banco de dados
docker-compose down -v
docker-compose up -d

# Rebuild (se mudou código)
docker-compose build --no-cache
docker-compose up -d

# SQL Server - Query
docker-compose exec sqlserver sqlcmd -S localhost -U sa -P YourStrongPassword123! -Q "SELECT @@VERSION"

# Redis - Test
docker-compose exec redis redis-cli ping
```

---

## 📊 Próximos Passos

### 1️⃣ Explorar API
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@cltech.com",
    "password":"Admin@123"
  }'

# Copiar o accessToken da resposta

# Criar Bot
curl -X POST http://localhost:5000/api/v1/bots \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Bot Teste",
    "phoneNumber":"+5511999999999",
    "enableAI":true
  }'
```

### 2️⃣ Customizar Frontend
```powershell
cd frontend
npm install
npm run dev  # Roda em http://localhost:3000 com hot reload
```

### 3️⃣ Desenvolver Backend
```powershell
cd backend/src/ClTechCore.Api
dotnet run  # Roda em http://localhost:5000
```

### 4️⃣ Ligar Bot WhatsApp
```powershell
cd bot
npm install
npm run dev
# Scan QR code com seu WhatsApp
```

---

## 🔑 Credenciais Admin

**Email**: `admin@cltech.com`  
**Senha**: `Admin@123`  
**Role**: Admin (acesso total)

---

## 🆘 Troubleshooting

### "Port 5000 já está em uso"
```powershell
# Achar processo usando porta 5000
netstat -ano | findstr :5000

# Matar processo (substitua PID)
taskkill /PID 1234 /F

# Ou mudar port em docker-compose.yml
```

### "Cannot connect to SQL Server"
```powershell
# Verificar se container está rodando
docker-compose ps sqlserver

# Ver logs
docker-compose logs sqlserver

# Tentar reconectar
docker-compose restart sqlserver
```

### "API retorna erro 500"
```powershell
# Ver logs detalhados
docker-compose logs api | findstr ERROR

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 📚 Documentação Completa

Verifique estes arquivos para aprofundar:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura e padrões
- **[README.md](./README.md)** - Documentação completa
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deploy em produção
- **[.github/workflows/main.yml](./.github/workflows/main.yml)** - CI/CD Pipeline

---

## 🎓 Estrutura de Arquivos - Entendendo o Projeto

```
backend/
├── src/
│   ├── ClTechCore.Api/           ← Controllers REST
│   ├── ClTechCore.Application/   ← Serviços de negócio
│   ├── ClTechCore.Domain/        ← Entidades
│   └── ClTechCore.Infrastructure/ ← Banco de Dados, EF Core
└── tests/                        ← Testes unitários

frontend/
├── src/
│   ├── pages/       ← Páginas (Login, Dashboard)
│   ├── components/  ← Componentes React reutilizáveis
│   ├── store/       ← Estado global (Zustand)
│   ├── services/    ← Chamadas de API
│   └── App.jsx      ← Componente raiz
└── package.json

bot/                 ← WhatsApp Bot (Node.js)
├── src/
│   ├── index.js     ← Engine do bot
│   └── services/    ← IA, mensagens

infra/
├── docker/
│   ├── docker-compose.yml     ← Orquestração
│   ├── Dockerfile.api         ← Build .NET
│   └── Dockerfile.frontend    ← Build React
```

---

## 🏗️ O que foi Implementado

✅ **Backend Profissional**
- Clean Architecture (Application, Domain, Infrastructure)
- JWT Authentication + Refresh Token
- RBAC (Roles & Permissions)
- Repository Pattern
- Soft Delete & Auditoria
- EF Core + Migrations

✅ **Frontend Moderno**
- React 18 + Vite (Fast!)
- TailwindCSS (styling)
- Zustand (state management)
- Protected Routes
- Modern UI

✅ **Bot WhatsApp Inteligente**
- Node.js + Baileys SDK
- Integração OpenAI
- Auto-resposta com IA
- Queue processing

✅ **Infraestrutura Profissional**
- Docker multi-stage builds
- SQL Server (database)
- Redis (cache)
- Hangfire (background jobs)
- Health checks
- CI/CD pronto

✅ **Segurança**
- JWT com expiração
- Bcrypt password hashing
- Soft delete (GDPR ready)
- Audit logs
- SQL Injection protection

---

## 💡 Dicas Pro

1. **Cache com Redis**: Todas queries frequentes vão para cache
2. **Background Jobs**: Hangfire roda em `/hangfire`
3. **API Docs**: Swagger completo em `/swagger`
4. **Logging**: Serilog escreve logs em `logs/`
5. **Multi-tenant**: Cada usuário isolado pelo `TenantId`

---

## 🚀 Pronto para Produção?

Para rodar em produção, veja [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

Alterar em:
- ✅ JWT__SecretKey em appsettings.json
- ✅ SQL Server password padrão
- ✅ CORS para seu domínio
- ✅ HTTPS/SSL certificates
- ✅ Email SMTP configurado
- ✅ OpenAI API key real

---

## 📞 Suporte

Dúvidas? Abra uma issue: https://github.com/pedroinacioemp-blip/cl-tech-core/issues

---

**Versão**: 1.0.0  
**Status**: Production Ready ✅

---

Enjoy! 🎉
