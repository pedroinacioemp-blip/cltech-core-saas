# 🔧 GUIA DE INSTALAÇÃO - CL TECH CORE

## 📋 Pré-requisitos do Sistema

### 1. Node.js
**Versão Mínima:** 14.0+

**Download:** [nodejs.org](https://nodejs.org/)

**Como instalar:**
1. Baixe a versão LTS (Long Term Support)
2. Execute o instalador
3. Aceite os termos
4. Escolha o local de instalação (padrão é OK)
5. Finalize a instalação

**Verificar instalação:**
```bash
node --version
npm --version
```

---

### 2. g++ e GCC (Para C++)

#### Opção A: MinGW-w64 (Recomendado)

**Download:** [mingw-w64.org](https://www.mingw-w64.org/downloads/)

**Intalação Rápida:**
1. Baixe o instalador completo
2. Execute o instalador
3. Escolha configurações:
   - Version: Mais recente
   - Architecture: x86_64
   - Threads: posix
   - Exception: seh
4. Instale em `C:\mingw-w64`

**Configurar PATH:**
1. Abra "Variáveis de Ambiente"
   - Pesquise "Editar as variáveis de ambiente do sistema"
2. Clique em "Variáveis de ambiente"
3. Sob "Variáveis de Sistema", selecione "Path"
4. Clique "Editar"
5. Clique "Novo"
6. Adicione: `C:\mingw-w64\bin`
7. Clique "OK" e feche as janelas

**Verificar instalação:**
```bash
g++ --version
gcc --version
```

#### Opção B: Chocolatey (Mais Fácil)

Se você tem Chocolatey instalado:
```bash
choco install mingw
```

---

### 3. Java JDK

**Download:** [adoptopenjdk.net](https://adoptopenjdk.net/) ou [oracle.com](https://www.oracle.com/java/technologies/downloads/)

**Instalação:**
1. Baixe JDK 11+ (versão LTS recomendada)
2. Execute o instalador
3. Aceite as termos
4. Instale em local padrão (geralmente `C:\Program Files\Java`)

**Configurar JAVA_HOME:**
1. Abra "Variáveis de Ambiente"
2. Clique "Nova" (em Variáveis de Sistema)
3. Nome: `JAVA_HOME`
4. Valor: `C:\Program Files\Java\jdk-11` (ajuste conforme sua versão)
5. Clique "OK"

**Adicionar Java ao PATH:**
1. Abra "Variáveis de Ambiente" novamente
2. Edite "Path" (em Variáveis de Sistema)
3. Clique "Novo"
4. Adicione: `%JAVA_HOME%\bin`
5. Clique "OK"

**Verificar instalação:**
```bash
java -version
javac -version
```

---

## 🚀 Instalação do CL TECH CORE

### Passo 1: Preparar o Projeto

```bash
# Navegue até a pasta do projeto
cd C:\Users\SEU_USUARIO\Desktop\CL-TECH-CORE

# Ou use:
cd %USERPROFILE%\Desktop\CL-TECH-CORE
```

### Passo 2: Instalar Dependências

```bash
npm install
```

Isso vai instalar:
- **Electron** - Framework de desktop
- **Electron-builder** - Gerador de instaladores

*Aguarde de 2-5 minutos. Velocidade depende da conexão.*

### Passo 3: Iniciar Aplicação

```bash
npm start
```

A aplicação abrirá automaticamente!

---

## 🛠️ Troubleshooting

### ❌ "npm: command not found"
- **Problema:** Node.js não está instalado ou PATH não está configurado
- **Solução:**
  1. Instale Node.js novamente
  2. Reinicie o terminal (ou computador)
  3. Tente `node --version`

### ❌ "g++ não encontrado"
- **Problema:** MinGW não está instalado ou PATH não está configurado
- **Solução:**
  1. Instale MinGW-w64
  2. Adicione a pasta `bin` ao PATH
  3. Reinicie o terminal
  4. Teste com `g++ --version`

### ❌ "java: command not found"
- **Problema:** JDK não está instalado ou PATH não está configurado
- **Solução:**
  1. Instale JDK 11+
  2. Configure JAVA_HOME
  3. Adicione `%JAVA_HOME%\bin` ao PATH
  4. Reinicie o terminal
  5. Teste com `java -version`

### ❌ "npm install falha"
- **Problema:** Conexão com internet ou problema no Node.js
- **Solução:**
  ```bash
  npm cache clean --force
  npm install
  ```

### ❌ "Aplicação não abre"
- **Problema:** Arquivo corrompido ou NODE_MODULES ausente
- **Solução:**
  ```bash
  npm install
  npm start
  ```

---

## 📦 Gerar Instalador (Opcional)

Depois de tudo funcionando:

```bash
npm run build
```

Isso gera:
- `.exe` (Windows)
- `.msi` (Windows Installer)

Os arquivos estarão em `dist/`

---

## 🎯 Verificar Tudo

Execute este comando para tudo de uma vez:

```bash
node --version && npm --version && g++ --version && java -version
```

Se todos retornem versões (sem erros), você está pronto!

---

## 💡 Dicas

- **Reinicie o terminal** após instalar qualquer programa
- **Use Windows PowerShell** ou **Cmd** como administrador se tiver problemas
- **Verifique o PATH** frequentemente:
  ```bash
  echo %PATH%
  ```

---

## 🎓 Próximos Passos

1. Leia o **README.md** para aprender todos os recursos
2. Veja o **QUICKSTART.md** para exemplos rápidos
3. Abra os arquivos `example.cpp` e `Example.java` para testar

---

**Bom desenvolvimento! 🚀**
