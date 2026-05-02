@echo off
REM ==========================================
REM CL TECH CORE - Create Basic Icon Script
REM ==========================================

echo.
echo Creating placeholder icons...
echo.

REM Usando PowerShell para gerar imagem placeholder
powershell -Command "
# Criar imagem placeholder simples
[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null

# Criar bitmap 512x512
$bitmap = New-Object System.Drawing.Bitmap(512, 512)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fundo preto
$graphics.Clear([System.Drawing.Color]::Black)

# Desenhar quadrado verde
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 255, 0))
$graphics.FillRectangle($brush, 50, 50, 412, 412)

# Salvar como PNG
$bitmap.Save('assets/icon.png')
Write-Host '[OK] icon.png criado (512x512)'

$graphics.Dispose()
$bitmap.Dispose()
"

echo.
echo [INFO] Icon básico criado com sucesso!
echo [INFO] Substituir por ícone profissional via: https://icoconvert.com/
echo [INFO] Veja: ICON_GUIDE.md para mais detalhes
echo.

pause
