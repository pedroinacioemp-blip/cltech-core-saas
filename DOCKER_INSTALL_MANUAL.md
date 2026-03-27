# 🐳 INSTALAÇÃO MANUAL DO DOCKER DESKTOP

## ⚡ Método Mais Rápido (Recomendado)

### Passo 1️⃣: Download
Baixe o instalador Docker Desktop: https://www.docker.com/products/docker-desktop

### Passo 2️⃣: Executar Instalador
1. Abra o arquivo `Docker Desktop Installer.exe`
2. Marque a opção: **"Install required Windows components for WSL 2"**
3. Clique em **"Install"**
4. Aguarde a instalação (3-5 minutos)
5. Reinicie o Windows quando solicitado

### Passo 3️⃣: Verificar Instalação
Abra PowerShell e execute:
```powershell
docker --version
docker compose version
```

Deve aparecer as versões do Docker.

---

## ⚙️ Alternativa: Instalar via Package Manager (Se tiver winget)

```powershell
# Abrir PowerShell como ADMINISTRADOR
winget install Docker.DockerDesktop
```

---

## 🍫 Alternativa 2: Instalar Chocolatey Primeiro

Se preferir usar Chocolatey:

```powershell
# Abrir PowerShell como ADMINISTRADOR

# Instalar Chocolatey
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Fechar e reabrir PowerShell como ADMINISTRADOR

# Instalar Docker Desktop
choco install docker-desktop -y
```

---

## ✅ Após Instalar Docker

Retorne para este diretório e execute:

```bash
cd C:\Users\Administrator\Desktop\CL-TECH-CORE-ECOSYSTEM
docker compose up -d
```

Aguarde 2-3 minutos para os serviços iniciarem.

---

## 🌐 Acessar o Projeto

Após iniciar:

```
Frontend:  http://localhost:3000
API:       http://localhost:5000/swagger
Hangfire:  http://localhost:5000/hangfire

Login:
Email: admin@cltech.com
Senha: Admin@123
```

---

## ⚠️ Se você estiver bloqueado por Políticas de Domínio

Se sua máquina é controlada por domínio corporativo:

1. Solicite ao seu administrador IT para instalar Docker Desktop
2. Ou use Docker Desktop via WSL 2 (Windows Subsystem for Linux 2)

---

**Total estimado até ter tudo rodando: 10-15 minutos** ⏱️
