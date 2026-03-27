# Guia de Configuração Nativa - CL-TECH-CORE SaaS Ecosystem

Este guia fornece instruções passo a passo para configurar e executar o CL-TECH-CORE com o ecossistema SaaS **sem virtualização** (sem Docker), executando todos os serviços nativamente no Windows.

## Pré-requisitos

- Windows 10 Pro ou superior
- .NET 8 SDK (já instalado)
- Node.js 18+ (já instalado)
- npm (já instalado)
- Git (já instalado)
- **SQL Server 2022 (JÁ INSTALADO)** ✅
- Redis para Windows

## Passo 1: Verificar SQL Server

O SQL Server 2022 já está instalado no sistema. Verifique se o serviço está rodando:

1. Abra Serviços do Windows (services.msc)
2. Procure por "SQL Server (MSSQLSERVER)"
3. Certifique-se de que o status é "Executando"
4. Se não estiver, clique com o botão direito e selecione "Iniciar"

## Passo 2: Instalar Redis para Windows

1. Baixe o Redis para Windows: https://github.com/microsoftarchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi
2. Execute o instalador MSI
3. Instale no diretório padrão
4. Após instalação, inicie o serviço Redis:
   - Abra Serviços do Windows (services.msc)
   - Encontre "Redis" e inicie o serviço
   - Ou execute no PowerShell: `Start-Service Redis`

## Passo 3: Preparar o Projeto

Os arquivos já foram copiados pelo script de integração. Se necessário, execute novamente:

```powershell
cd "C:\Users\Administrator\Desktop"
.\INTEGRAR-SIMPLES.ps1
```

## Passo 4: Configurar Conexões

As configurações já foram ajustadas para localhost:

- **SQL Server**: `Server=localhost,1433;Database=ClTechCoreDB;User Id=sa;Password=YourStrongPassword123!;TrustServerCertificate=True;`
- **Redis**: `localhost:6379`

## Passo 5: Instalar Dependências

### Backend (.NET)
```powershell
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\backend\src\ClTechCore.Api"
dotnet restore
```

### Frontend (React)
```powershell
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\frontend"
npm install
```

### Bot (Node.js)
```powershell
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\bot"
npm install
```

## Passo 6: Executar os Serviços

### 1. Verificar SQL Server
Certifique-se de que o SQL Server está rodando (serviço MSSQLSERVER iniciado).

### 2. Iniciar Redis
Certifique-se de que o Redis está rodando (serviço Redis iniciado).

### 3. Iniciar Backend (.NET API)
```powershell
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\backend\src\ClTechCore.Api"
dotnet run
```
A API estará disponível em: http://localhost:5000/swagger

### 4. Iniciar Frontend (React)
```powershell
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\frontend"
npm run dev
```
O frontend estará disponível em: http://localhost:3000

### 5. Iniciar Bot (WhatsApp)
```powershell
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\bot"
node src/index.js
```
Siga as instruções no console para conectar o WhatsApp via QR Code.

## Passo 7: Verificar Funcionamento

1. Acesse o frontend: http://localhost:3000
2. Acesse a API: http://localhost:5000/swagger
3. Teste as funcionalidades:
   - Cadastro de usuários
   - Login
   - Integração WhatsApp
   - Funcionalidades de IA

## Scripts Automatizados

Para facilitar, crie um script PowerShell `START-NATIVE.ps1`:

```powershell
# START-NATIVE.ps1
Write-Host "Iniciando CL-TECH-CORE SaaS Ecosystem (Nativo)" -ForegroundColor Green

# Verificar serviços
Write-Host "Verificando SQL Server..." -ForegroundColor Cyan
# (Adicione verificação se necessário)

Write-Host "Verificando Redis..." -ForegroundColor Cyan
# (Adicione verificação se necessário)

# Iniciar backend em background
Write-Host "Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd 'C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\backend\src\ClTechCore.Api'; dotnet run" -NoNewWindow

# Iniciar frontend em background
Write-Host "Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd 'C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\frontend'; npm run dev" -NoNewWindow

# Iniciar bot em background
Write-Host "Iniciando Bot..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd 'C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\bot'; node src/index.js" -NoNewWindow

Write-Host "Todos os serviços iniciados!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Yellow
```

## Solução de Problemas

### SQL Server não conecta
- Verifique se o serviço MSSQLSERVER está rodando
- Confirme a senha do SA
- Use `sqlcmd -S localhost -U sa -P YourStrongPassword123!` para testar

### Redis não conecta
- Verifique se o serviço Redis está rodando
- Teste com `redis-cli ping` (deve retornar PONG)

### Porta ocupada
- Mude as portas nas configurações se necessário
- Backend: Program.cs (UseUrls)
- Frontend: vite.config.js (port)
- Bot: index.js (API_BASE_URL)

### Erro de dependências
- Execute `dotnet restore` no backend
- Execute `npm install` no frontend/bot

## Próximos Passos

- Configure variáveis de ambiente para produção
- Configure HTTPS
- Implemente logging avançado
- Configure backup do banco
- Considere hospedagem em nuvem (AWS/Azure)

---

**Nota**: Esta configuração é para desenvolvimento local. Para produção, considere usar containers Docker ou serviços gerenciados na nuvem.</content>
<parameter name="filePath">c:\Users\Administrator\Desktop\CL-TECH-CORE\saas\GUIA_NATIVE.md