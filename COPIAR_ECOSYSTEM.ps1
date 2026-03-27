# ============================================================================
#  CL-TECH-CORE ECOSYSTEM INTEGRATION SCRIPT
#  Copia todos os arquivos do ECOSYSTEM para a pasta saas/
#  Autor: GitHub Copilot | Data: Março 24, 2026
# ============================================================================

param(
    [switch]$SkipCopy = $false,
    [switch]$VerboseLog = $true
)

# Cores para output
$Colors = @{
    Success = 'Green'
    Error = 'Red'
    Warning = 'Yellow'
    Info = 'Cyan'
}

function Log {
    param([string]$Message, [string]$Level = 'Info')
    $timestamp = Get-Date -Format 'HH:mm:ss'
    Write-Host "[$timestamp] " -NoNewline
    
    if ($Level -eq 'Success') { Write-Host "✓ $Message" -ForegroundColor $Colors['Success'] }
    elseif ($Level -eq 'Error') { Write-Host "✗ $Message" -ForegroundColor $Colors['Error'] }
    elseif ($Level -eq 'Warning') { Write-Host "⚠ $Message" -ForegroundColor $Colors['Warning'] }
    else { Write-Host "ℹ $Message" -ForegroundColor $Colors['Info'] }
}

# Definir paths
$EcosystemPath = "C:\Users\Administrator\Desktop\CL-TECH-CORE-ECOSYSTEM"
$SaasPath = "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas"

# Validar caminhos
if (-not (Test-Path $EcosystemPath)) {
    Log "Pasta ECOSYSTEM não encontrada: $EcosystemPath" "Error"
    exit 1
}

if (-not (Test-Path $SaasPath)) {
    Log "Pasta saas não encontrada: $SaasPath" "Error"
    exit 1
}

Log "================================" "Info"
Log "Iniciando integração ECOSYSTEM" "Info"
Log "================================" "Info"

# ============================================================================
# FASE 1: COPIAR ARQUIVOS
# ============================================================================

if (-not $SkipCopy) {
    Log "FASE 1: Copiando arquivos..." "Info"
    
    # Backend
    Log "Copiando backend..." "Info"
    Copy-Item "$EcosystemPath\backend\*" "$SaasPath\backend" -Recurse -Force
    Log "Backend copiado" "Success"
    
    # Frontend
    Log "Copiando frontend..." "Info"
    Copy-Item "$EcosystemPath\frontend\*" "$SaasPath\frontend" -Recurse -Force
    Log "Frontend copiado" "Success"
    
    # Bot
    Log "Copiando bot..." "Info"
    Copy-Item "$EcosystemPath\bot\*" "$SaasPath\bot" -Recurse -Force
    Log "Bot copiado" "Success"
    
    # Mobile
    if (Test-Path "$EcosystemPath\mobile") {
        Log "Copiando mobile..." "Info"
        Copy-Item "$EcosystemPath\mobile\*" "$SaasPath\mobile" -Recurse -Force
        Log "Mobile copiado" "Success"
    }
    
    # Infra (Docker, CI/CD)
    Log "Copiando infra..." "Info"
    if (Test-Path "$EcosystemPath\docker-compose.yml") {
        Copy-Item "$EcosystemPath\docker-compose.yml" "$SaasPath\" -Force
    }
    if (Test-Path "$EcosystemPath\Dockerfile.*") {
        Copy-Item "$EcosystemPath\Dockerfile.*" "$SaasPath\infra\" -Force
    }
    if (Test-Path "$EcosystemPath\.github") {
        Copy-Item "$EcosystemPath\.github" "$SaasPath\infra\" -Recurse -Force
    }
    Log "Infra copiada" "Success"
    
    # Docs
    Log "Copiando documentação..." "Info"
    Get-ChildItem "$EcosystemPath\*.md" | ForEach-Object {
        Copy-Item $_ "$SaasPath\docs\" -Force
    }
    Log "Documentação copiada" "Success"
    
    # .env files
    Log "Copiando arquivos de configuração..." "Info"
    Get-ChildItem "$EcosystemPath\.env*" | ForEach-Object {
        Copy-Item $_ "$SaasPath\" -Force
    }
    Log "Configurações copiadas" "Success"
    
    Log "FASE 1 CONCLUÍDA ✓" "Success"
} else {
    Log "Pulando cópia de arquivos (--SkipCopy)" "Warning"
}

# ============================================================================
# FASE 2: VALIDAR ESTRUTURA
# ============================================================================

Log "" "Info"
Log "FASE 2: Validando estrutura..." "Info"

$RequiredDirs = @(
    'backend',
    'frontend',
    'bot',
    'mobile',
    'infra',
    'docs'
)

$AllValid = $true
foreach ($dir in $RequiredDirs) {
    $path = Join-Path $SaasPath $dir
    if (Test-Path $path) {
        $fileCount = (Get-ChildItem $path -Recurse -File).Count
        Log "✓ $dir/ ($fileCount arquivos)" "Success"
    } else {
        Log "✗ $dir/ (NÃO ENCONTRADO)" "Error"
        $AllValid = $false
    }
}

if (-not $AllValid) {
    Log "Alguns diretórios não foram criados" "Error"
    exit 1
}

Log "FASE 2 CONCLUÍDA ✓" "Success"

# ============================================================================
# FASE 3: VERIFICAR FERRAMENTAS
# ============================================================================

Log "" "Info"
Log "FASE 3: Verificando ferramentas..." "Info"

$tools = @{
    'node' = 'Node.js'
    'npm' = 'npm'
    'dotnet' = '.NET SDK'
    'git' = 'Git'
}

$RequiredTools = @()

foreach ($tool in $tools.GetEnumerator()) {
    try {
        $version = & $tool.Key --version 2>$null
        Log "$($tool.Value): $version" "Success"
    } catch {
        Log "$($tool.Value): NÃO INSTALADO" "Error"
        $RequiredTools += $tool.Value
    }
}

if ($RequiredTools.Count -gt 0) {
    Log "" "Warning"
    Log "Ferramentas não instaladas: $($RequiredTools -join ', ')" "Warning"
    Log "Instale em: https://nodejs.org, https://dotnet.microsoft.com, https://docker.com" "Info"
}

# ============================================================================
# FASE 4: PRÓXIMOS PASSOS
# ============================================================================

Log "" "Info"
Log "================================" "Success"
Log "Integração concluída!" "Success"
Log "================================" "Success"
Log "" "Info"

Log "PRÓXIMOS PASSOS:" "Info"
Log "1. Instale as ferramentas acima (se necessário)" "Info"
Log "2. Rode: cd C:\Users\Administrator\Desktop\CL-TECH-CORE\saas" "Info"
Log "3. Rode: docker compose up -d" "Info"
Log "4. Acesse: http://localhost:3000" "Info"
Log "5. Login: admin@cltech.com / Admin@123" "Info"
Log "" "Info"

Log "Documentação: $SaasPath\GUIA_EXECUCAO_COMPLETO.md" "Success"
Log "Status: PRONTO PARA INICIAR ✓" "Success"

# ============================================================================
