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