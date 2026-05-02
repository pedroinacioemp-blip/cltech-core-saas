@echo off
:: Pré-carregar compiladores antes de abrir o app
where g++ >nul 2>&1
if errorlevel 1 (
  echo [ERRO] g++ não encontrado no PATH. Instale o MinGW ou GCC e reinicie.
  pause
  exit /b 1
)
where javac >nul 2>&1
if errorlevel 1 (
  echo [ERRO] javac não encontrado no PATH. Instale o Java JDK e reinicie.
  pause
  exit /b 1
)
:: Abrir o CL TECH CORE
start "CL TECH CORE" electron .
