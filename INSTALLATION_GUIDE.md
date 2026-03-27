# 🐳 Guia de Instalação do Docker

## ⚠️ Status Atual
Docker Desktop **NÃO está instalado** no seu Windows.

---

## ✅ Pré-requisitos

### 1. **Windows Pro / Enterprise / Education**
Docker Desktop requer Windows 10/11 Pro, Enterprise ou Education Edition.

**Verificar sua edição:**
- Pressione `Windows + R`
- Digite: `winver`
- Procure por "Windows 10/11" e a edição

### 2. **WSL 2 (Windows Subsystem for Linux 2)**
Necessário para Docker Desktop rodar no Windows.

---

## 🚀 Instalação Passo a Passo

### Opção A: Instalação Completa (Recomendada)

#### Passo 1: Habilitar WSL 2
```powershell
# Abrir PowerShell como ADMINISTRADOR
wsl --install

# Reiniciar o Windows
# Após reiniciar, continuar...

# Verificar instalação
wsl --list --verbose
```

#### Passo 2: Baixar Docker Desktop
https://www.docker.com/products/docker-desktop

**OU** via Chocolatey (se tiver instalado):
```powershell
choco install docker-desktop
```

#### Passo 3: Instalar Docker Desktop
1. Execute o instalador `.exe` baixado
2. Marque **"Install required Windows components for WSL 2"**
3. Clique em Install
4. Restart quando solicitado

#### Passo 4: Verificar Instalação
```powershell
# Abrir novo PowerShell
docker --version
docker run hello-world
```

---

### Opção B: Instalação via Windows Package Manager (Mais Rápido)

```powershell
# Como ADMINISTRADOR
winget install Docker.DockerDesktop
```

---

## 🎯 Após Instalar Docker

Volte para este diretório:

```powershell
cd C:\Users\Administrator\Desktop\CL-TECH-CORE-ECOSYSTEM
```

E execute:

```powershell
# Iniciar todos os serviços
docker compose up -d

# OU (versão antiga)
docker-compose up -d
```

---

## 🔍 Verificar Status dos Serviços

```powershell
# Ver todos os containers rodando
docker ps

# Ver logs da API
docker compose logs api

# Ver logs do Frontend
docker compose logs frontend

# Ver logs do SQL Server
docker compose logs sqlserver

# Ver logs do Redis
docker compose logs redis
```

---

## 🌐 Acessar o Projeto

Após iniciar com sucesso:

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | admin@cltech.com / Admin@123 |
| API Swagger | http://localhost:5000/swagger | (use JWT do login) |
| Hangfire Dashboard | http://localhost:5000/hangfire | Sem autenticação |
| SQL Server | localhost:1433 | sa / CL@TechCore2024 |
| Redis | localhost:6379 | (sem senha default) |

---

## ⚡ Comandos Úteis

```powershell
# Parar todos os serviços
docker compose down

# Ver logs em tempo real
docker compose logs -f

# Reconstruir imagens
docker compose build

# Remover dados persistidos
docker compose down -v

# Executar comando no container API
docker compose exec api dotnet --version

# Executar comando no container Frontend
docker compose exec frontend npm --version
```

---

## 🆘 Troubleshooting

### "Docker daemon is not running"
- Abra **Docker Desktop** (ícone na barra de tarefas)
- Aguarde até aparecer o ícone verde
- Tente novamente

### "WSL 2 installation incomplete"
```powershell
# Como ADMINISTRADOR
wsl --install -d Ubuntu-22.04
```

### "Port already in use"
Se porta 3000, 5000, 1433 ou 6379 estão ocupadas:

```powershell
# Encontrar o processo usando a porta
netstat -ano | findstr :3000

# Matar o processo (substitua PID)
taskkill /PID 12345 /F
```

### "Permission denied"
Reinicie o Docker Desktop como ADMINISTRADOR

---

## 📱 Próximos Passos Após Instalar

1. ✅ Instalar Docker Desktop
2. ✅ Executar `docker compose up -d`
3. ✅ Acessar http://localhost:3000
4. ✅ Fazer login com admin@cltech.com / Admin@123
5. ✅ Ler GETTING_STARTED.md para usar o sistema

---

## 🎓 Referências

- **Docker Official**: https://docs.docker.com/desktop/install/windows-install/
- **WSL 2 Setup**: https://docs.microsoft.com/en-us/windows/wsl/install
- **Docker Compose**: https://docs.docker.com/compose/

---

## ✨ Resumo

**Versão Curta:**
1. Baixar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instalar
3. Executar: `docker compose up -d`
4. Acessar: http://localhost:3000

**Tempo estimado**: 10-15 minutos

---

**Status**: Aguardando instalação do Docker Desktop ⏳
