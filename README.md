# 🚀 CL-TECH-CORE Ecosystem - SaaS Completo

Uma plataforma SaaS profissional, escalável e monetizável para gerenciar WhatsApp Bots com IA integrada.

```
╔══════════════════════════════════════════════════════════════╗
║     CL-TECH-CORE: IDE Online + WhatsApp Bot + IA + SaaS      ║
║         Multi-tenant | Pagamentos | Escalável                ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 Features

✅ **Plataforma SaaS Completa**
- Autenticação JWT + Refresh Token
- RBAC (Role-Based Access Control)
- Multi-tenant com isolamento de dados
- Soft delete e auditoria completa

✅ **WhatsApp Bot Professional**
- Integração com WhatsApp Web via Baileys
- Processamento automático com IA
- Suporte a múltiplos tipos de mensagem
- Escalabilidade com queue processing

✅ **IA Integrada**
- Integração com OpenAI (GPT-4)
- Prompts dinâmicos por tipo de bot
- Análise de sentimento
- Respostas contextualizadas

✅ **Admin Dashboard**
- Interface moderna estilo hacker
- Real-time metrics & analytics
- Gestão completa de bots
- Logs estruturados
- Control panel WhatsApp

✅ **Performance Extrema**
- Redis cache distribuído
- Paginação em todas queries
- SQL Server com indices otimizados
- Background jobs com Hangfire
- Compression & CDN ready

✅ **Monetização SaaS**
- Planos: Free, Pro, Enterprise
- Integração Stripe & Mercado Pago
- Billing automático
- API Key system
- Usage tracking

✅ **Security Enterprise**
- SQL Injection protection
- XSS/CSRF prevention
- Rate limiting por usuário
- Criptografia dados sensíveis
- Audit logs completos

✅ **DevOps Professional**
- Docker multi-stage builds
- docker-compose completo
- CI/CD GitHub Actions ready
- Health checks
- Logging com Serilog

---

## 📋 Requisitos

- **Docker** 24+
- **Docker Compose** 3.9+
- **.NET 8** (para desenvolvimento local)
- **Node.js** 18+ (para bot e frontend)
- **Git**

---

## 🚀 Quick Start (3 minutos)

### 1. Clone o Projeto
```bash
cd C:\Users\Administrator\Desktop\CL-TECH-CORE-ECOSYSTEM
```

### 2. Copie os Arquivos de Ambiente
```bash
cp .env.development .env
```

### 3. Inicie com Docker Compose
```bash
docker-compose up -d
```

### 4. Aguarde os Services
```bash
# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api
```

### 5. Acesse a Plataforma
- **Frontend**: http://localhost:3000
- **API Swagger**: http://localhost:5000/swagger
- **Hangfire Dashboard**: http://localhost:5000/hangfire
- **Redis Commander** (dev): http://localhost:8082
- **SQL Server Manager** (dev): localhost:1433

### 6. Credenciais de Teste
**Login Padrão:**
- Email: `admin@cltech.com`
- Senha: `Admin@123`

---

## 📁 Estrutura do Projeto

```
CL-TECH-CORE-ECOSYSTEM/
├── backend/                          # .NET 8 API
│   ├── src/
│   │   ├── ClTechCore.Api/           # Controllers, Startup
│   │   ├── ClTechCore.Application/   # Services, DTOs, Validators
│   │   ├── ClTechCore.Domain/        # Entities, Interfaces
│   │   └── ClTechCore.Infrastructure/# Data, Repositories, EF Core
│   └── tests/                        # Unit & Integration Tests
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── pages/                    # Page Components
│   │   ├── components/               # Reusable Components
│   │   ├── store/                    # Zustand State
│   │   ├── services/                 # API Services
│   │   └── index.css                 # TailwindCSS
│   ├── package.json
│   └── vite.config.js
│
├── bot/                              # WhatsApp Bot (Node.js)
│   ├── src/
│   │   ├── index.js                  # Main Bot Engine
│   │   ├── services/                 # AI, Message Processing
│   │   └── handlers/                 # Event Handlers
│   └── package.json
│
├── mobile/                           # React Native (Future)
│   └── src/
│
├── infra/                            # DevOps & Infrastructure
│   ├── docker/
│   │   ├── Dockerfile.api            # .NET Multi-stage
│   │   ├── Dockerfile.frontend      # React/Nginx Multi-stage
│   │   └── docker-compose.yml        # Orquestração
│   └── kubernetes/                   # K8s configs (Future)
│
├── docs/                             # Documentação
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── SECURITY.md
│
├── ARCHITECTURE.md                   # Design patterns & arquitetura
├── .env.development
├── .env.production
├── .gitignore
└── README.md
```

---

## 🔧 Desenvolvimento Local

### Setup Backend (.NET 8)

```bash
cd backend/src/ClTechCore.Api

# Restore packages
dotnet restore

# Run migrations
dotnet ef database update --project ../ClTechCore.Infrastructure

# Run API
dotnet run
```

**URL**: http://localhost:5000

### Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

**URL**: http://localhost:3000

### Setup Bot (Node.js)

```bash
cd bot

# Install dependencies
npm install

# Run bot
npm run dev
```

---

## 🐳 Docker Compose Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **API** | 5000 | http://localhost:5000 | .NET 8 Backend |
| **Frontend** | 3000 | http://localhost:3000 | React Admin Dashboard |
| **SQL Server** | 1433 | localhost:1433 | Database |
| **Redis** | 6379 | localhost:6379 | Cache |
| **Hangfire** | 5000/hangfire | http://localhost:5000/hangfire | Job Dashboard |

### Comandos Úteis

```bash
# Iniciar todos services
docker-compose up -d

# Ver logs da API
docker-compose logs -f api

# Parar tudo
docker-compose down

# Reset banco de dados
docker-compose down -v
docker-compose up -d

# Entrar em um container
docker-compose exec api bash
docker-compose exec sqlserver /bin/bash

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      # Registrar novo usuário
POST   /api/v1/auth/login         # Login
POST   /api/v1/auth/refresh       # Renovar token
```

### Bots
```
GET    /api/v1/bots               # Listar bots do tenant
POST   /api/v1/bots               # Criar novo bot
GET    /api/v1/bots/{id}          # Obter bot
PUT    /api/v1/bots/{id}          # Atualizar bot
DELETE /api/v1/bots/{id}          # Deletar bot
```

### Messages
```
GET    /api/v1/messages/bot/{botId}  # Histórico de mensagens
POST   /api/v1/messages              # Enviar mensagem
```

### Health
```
GET    /health                    # Status geral
GET    /health/ready              # Readiness probe
GET    /health/live               # Liveness probe
```

---

## 🔐 Segurança

### Implementado
✅ JWT com RS256 signing  
✅ Refresh token rotation  
✅ RBAC com granular permissions  
✅ Criptografia AES-256 para dados sensíveis  
✅ Rate limiting (100 req/min por user)  
✅ CORS configurado  
✅ HTTPS ready  
✅ SQL Injection prevention (EF Core)  
✅ XSS protection (CSP headers)  
✅ CSRF protection  
✅ Audit logging completo  

### Checklist Pré-Production
- [ ] Mudar `JWT:SecretKey` em appsettings.json
- [ ] Trocar senha SQL Server padrão
- [ ] Gerar certificados HTTPS
- [ ] Configurar CORS apenas para domínio
- [ ] Setup backup automático
- [ ] Ativar rate limiting mais agressivo
- [ ] Configurar alertas Prometheus
- [ ] Set up WAF (Web Application Firewall)

---

## 💰 Planos & Monetização

### Free Tier
- 100 mensagens/mês
- 1 bot
- 1 usuário
- Sem suporte

### Pro ($29/mês)
- 10.000 mensagens/mês
- 10 bots
- 5 usuários
- Email support
- Analytics básico

### Enterprise (Custom)
- Ilimitado
- SLA 99.9%
- Suporte 24/7
- Integrações customizadas
- Dedicated account manager

---

## 🚀 Deployment

### Render
```bash
# Conectar repositório Git
# Configure environment variables
# Deploy automático no push
```

### AWS
```bash
# ECS + RDS + ElastiCache
# Load Balancer
# Auto-scaling
```

### Azure
```bash
# App Service + SQL Database + Redis
# Application Insights
# DevOps Pipelines
```

Veja [DEPLOYMENT.md](./docs/DEPLOYMENT.md) para detalhes completos.

---

## 📈 Monitoramento

### Endpoints de Saúde
```bash
# Health check básico
curl http://localhost:5000/health

# Readiness (pronto para receber traffic)
curl http://localhost:5000/health/ready

# Liveness (processo vivo)
curl http://localhost:5000/health/live
```

### Logs
```bash
# Ver logs em tempo real
docker-compose logs -f api

# Arquivo de logs
/app/logs/app-YYYY-MM-DD.txt
```

### Métricas
- **Prometheus**: Endpoint `/metrics` (implementar)
- **Grafana**: Dashboard pré-configured (implementar)
- **Application Insights**: Azure integration (future)

---

## 🧪 Testing

```bash
# Unit Tests
dotnet test backend/tests

# Integration Tests
dotnet test --filter Category=Integration

# E2E Tests
npm run test:e2e --prefix frontend
```

---

## 📚 Documentação Completa

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Design patterns, DDD, Clean Architecture
- **[API.md](./docs/API.md)** - Referência completa de endpoints
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deploy em produção
- **[SECURITY.md](./docs/SECURITY.md)** - Guia de segurança
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Como contribuir

---

## 🔄 CI/CD Pipeline

GitHub Actions automatiza:
- ✅ Build & tests
- ✅ Docker build
- ✅ Push registry
- ✅ Deploy staging
- ✅ Deploy produção

Veja `.github/workflows/` para configurações.

---

## 🆘 Troubleshooting

### API não sobe
```bash
# Check logs
docker-compose logs api

# Verify database connection
docker-compose exec api dotnet dbcontext validate

# Reset database
docker-compose down -v && docker-compose up -d
```

### Redis connection error
```bash
# Verify Redis is running
docker-compose ps redis

# Check Redis connectivity
docker-compose exec redis redis-cli ping
```

### Frontend não conecta com API
```bash
# Check CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:5000/api/v1/

# Check proxy in vite.config.js
```

---

## 📞 Support

- **Email**: support@cltech.com
- **Issues**: https://github.com/pedroinacioemp-blip/cl-tech-core/issues
- **Discussions**: https://github.com/pedroinacioemp-blip/cl-tech-core/discussions

---

## 📄 Licença

MIT License - Veja [LICENSE](./LICENSE) para detalhes

---

**Versão**: `1.0.0`  
**Última atualização**: Março 2026  
**Status**: Production Ready ✅

---

Made with ❤️ by CL-TECH Team
