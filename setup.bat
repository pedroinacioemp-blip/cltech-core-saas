@echo off
REM ==========================================
REM CL TECH CORE - Setup Script
REM ==========================================

echo.
echo ╔════════════════════════════════════════╗
echo ║  CL TECH CORE - Setup Automatico      ║
echo ╚════════════════════════════════════════╝
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] Node.js nao encontrado!
    echo    Por favor instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [✓] Node.js encontrado
    node --version
)

REM Verificar g++
echo.
echo [2/5] Verificando g++...
g++ --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [⚠] g++ nao encontrado (opcional para Java)
) else (
    echo [✓] g++ encontrado
    g++ --version | findstr /C:"g++" 
)

REM Verificar javac
echo.
echo [3/5] Verificando javac...
javac -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [⚠] javac nao encontrado (opcional para C++)
) else (
    echo [✓] javac encontrado
    javac -version
)

REM Instalar dependencias
echo.
echo [4/5] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [✗] Erro ao instalar dependencias!
    pause
    exit /b 1
) else (
    echo [✓] Dependencias instaladas
)

REM Iniciar aplicacao
echo.
echo [5/5] Iniciando CL TECH CORE...
echo.
echo ╔════════════════════════════════════════╗
echo ║  Aplicacao iniciada!                  ║
echo ║  A janela deve aparecer em segundos   ║
echo ╚════════════════════════════════════════╝
echo.

call npm start
