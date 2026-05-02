# 🏗️ ARQUITETURA - CL TECH CORE

## 📐 Visão Geral

CL TECH CORE é uma aplicação Electron que segue o padrão:
- **Main Process** (Node.js)
- **Renderer Process** (Navegador)
- **IPC Bridge** (Comunicação segura)

---

## 🔄 Fluxo de Execução

### 1. Inicialização

```
app.ready
  ↓
createWindow()
  ↓
BrowserWindow criada (preload.js)
  ↓
index.html carregado
  ↓
matrix.js executa
  ↓
script.js executa
  ↓
CLTechCore() instanciada
  ↓
checkCompilers() verifica g++ e javac
  ↓
App pronta para usar
```

### 2. Compilação C++

```
User → RUN Button
            ↓
    CLTechCore.runCode()
            ↓
    compileCpp(filePath)
            ↓
    electronAPI.compileCpp()
            ↓
    preload.js
            ↓
    ipcRenderer.invoke('compile-cpp', filePath)
            ↓
    Main Process IPC Handler
            ↓
    child_process.exec("g++ file.cpp -o file.exe")
            ↓
    Promise resolve
            ↓
    console.log() → screen
```

### 3. Diálogo de Arquivo

```
fileInput (hidden input[type="file"])
↓
loadFile(event)
↓
readFile(filePath)
↓
preload.js fs.readFile()
↓
codeEditor.value = content
```

---

## 📁 Camadas da Arquitetura

### Camada 1: Hardware/SO
```
Windows
├── g++/GCC (compilador C++)
├── javac (compilador Java)
└── java runtime
```

### Camada 2: Node.js Runtime
```
main.js (Electron Main Process)
├── BrowserWindow
├── ipcMain handlers
├── child_process (g++, javac, java)
└── fs (file system)
```

### Camada 3: Electron Bridge (IPC)
```
preload.js (Context Isolation)
├── Expõe electronAPI
├── ipcRenderer proxy
└── File system API
```

### Camada 4: Lógica de Aplicação
```
renderer/script.js (CLTechCore)
├── Gerenciador de estado
├── Detecção de linguagem
├── Chamadas de compilação
└── UI updates
```

### Camada 5: UI/Apresentação
```
renderer/
├── index.html (DOM)
├── style.css (Estilos)
├── matrix.js (Efeitos visuais)
└── browser APIs (DOM, CSS, Canvas)
```

---

## 🔐 Segurança em Camadas

```
┌─────────────────────────────────────────────┐
│  Renderer (Sandbox)                         │
│  - Sem acesso a Node.js                     │
│  - Sem require()                            │
│  - Sem sistema de arquivos nativo           │
└──────────────┬──────────────────────────────┘
               │ (apenas IPC permitido)
┌──────────────▼──────────────────────────────┐
│  Preload (Context Isolation)                │
│  - Expõe apenas funções permitidas          │
│  - contextBridge.exposeInMainWorld()        │
│  - Whitelist de APIs                        │
└──────────────┬──────────────────────────────┘
               │ (ipcRenderer.invoke)
┌──────────────▼──────────────────────────────┐
│  Main Process (Full Node.js)                │
│  - Acesso a child_process                   │
│  - Acesso a fs (arquivo)                    │
│  - Executa comandos do sistema              │
└─────────────────────────────────────────────┘
```

---

## 💾 Fluxo de Dados

### State Management

```javascript
// Mantido em CLTechCore instance (singleton)
{
  currentFile: String,          // Caminho do arquivo
  currentLanguage: 'cpp'|'java'|'unknown',
  compiling: Boolean,           // Flag de compilação
  codeEditor: TextArea,         // Referência DOM
  console: HTMLElement          // Referência DOM
}
```

### Transformação de Dados

```
File System
    ↓
readFile() → String (código fonte)
    ↓
codeEditor.value = code
    ↓
User edita código
    ↓
script.js detectLanguage(code)
    ↓
compileCpp/compileJava(filePath)
    ↓
g++ ou javac executa
    ↓
stdout/stderr → addConsoleLog()
    ↓
console.innerHTML atualizado
```

---

## 🎯 Componentes do Sistema

### 1. Editor de Código
```
<textarea id="codeEditor">
├── placeholder
├── spellcheck="false"
├── value = código do usuário
└── event listeners:
    └── input → detectLanguage()
```

### 2. Sistema de Console
```
<div id="console">
├── .console-line (cada linha)
│   ├── .console-prompt (">")
│   └── .console-text (mensagem)
└── Classes CSS:
    ├── .error (vermelho)
    ├── .success (verde)
    ├── .warning (amarelo)
    └── .info (ciano)
```

### 3. Sistema de Status
```
Status Indicator
├── .status-dot (piscante)
├── #status-text
└── Estados:
    ├── "Ready" (verde)
    ├── "Compiling..." (amarelo)
    ├── "Error" (vermelho)
    └── "Warning" (laranja)
```

### 4. IPC Channel Handlers
```
Main Process
├── compile-cpp → g++ fileName.cpp
├── run-exe → ./fileName.exe
├── compile-java → javac fileName.java
├── run-java → java ClassName
└── run-command → exec(comando)
```

---

## 🔄 Ciclo de Vida da Compilação

```
START
  │
  ├─➤ CLTechCore.runCode()
  │    ├─ Valida código não vazio
  │    ├─ Detecta linguagem
  │    └─ Limpa console
  │
  ├─➤ compileCode(shouldRun=true)
  │    ├─ Desabilita botões
  │    ├─ setStatus('Compilando...')
  │    └─ Chama compileCpp() ou compileJava()
  │
  ├─➤ compileCpp(shouldRun)
  │    ├─ addConsoleLog('Compilando...')
  │    ├─ electronAPI.compileCpp()
  │    │    └─ ipcRenderer.invoke('compile-cpp')
  │    │        └─ Main: exec(g++ ...)
  │    │
  │    └─ IF erro:
  │        ├─ addConsoleLog(stderr, 'error')
  │        ├─ setStatus('Error', 'error')
  │        └─ return
  │
  │    ELSE sucesso:
  │        ├─ addConsoleLog('✓ Sucesso', 'success')
  │        │
  │        └─ IF shouldRun:
  │            ├─ Executa .exe
  │            ├─ addConsoleLog(stdout, 'success')
  │            └─ setStatus('Ready', 'ready')
  │
  └─➤ END
      ├─ Reabilita botões
      └─ Aguarda próxima ação
```

---

## 📊 Diagrama de Módulos

```
CL TECH CORE
├── Electron App (main.js)
│   ├── BrowserWindow Manager
│   └── IPC Handlers
│       ├── compile-cpp
│       ├── run-exe
│       ├── compile-java
│       └── run-java
│
├── Preload API (preload.js)
│   ├── compileCpp()
│   ├── runCppExe()
│   ├── compileJava()
│   ├── runJava()
│   ├── readFile()
│   ├── saveFile()
│   └── detectLanguage()
│
├── Renderer (index.html)
│   ├── Canvas (matrix.js)
│   ├── UI Elements
│   │   ├── Editor
│   │   ├── Console
│   │   └── Controls
│   │
│   └── Logic (script.js)
│       └── CLTechCore Class
│           ├── Compilação
│           ├── Execução
│           ├── UI Control
│           └── File Management
│
└── Styles (style.css)
    ├── Tema (cores, fontes)
    ├── Animações
    ├── Responsive
    └── Scanlines effect
```

---

## 🚀 Fluxo de Instalação

```
npm install
├── Baixa node_modules/
│   ├── electron
│   └── electron-builder
│
└── Cria package-lock.json

npm start
├── Executa electron . 
├── main.js carregado
├── index.html carregado
├── renderer/script.js carregado
└── App pronta

npm run build
├── electron-builder inicia
├── Compila Node-native modules
├── Compila assets
├── Cria .exe (NSIS)
├── Cria .msi (Windows Installer)
└── Artifacts em dist/
```

---

## 🔧 Configuração do Sistema

### package.json build
```json
{
  "appId": "com.cltech.core",
  "productName": "CL TECH CORE",
  "files": [
    "main.js",
    "preload.js",
    "renderer/**/*",
    "assets/**/*"
  ],
  "win": {
    "target": ["nsis", "msi"],
    "icon": "assets/icon.ico"
  }
}
```

### Estrutura de Diretórios (runtime)
```
CL-TECH-CORE/
├── node_modules/        (dependências)
├── .git/               (controle de versão)
├── dist/               (saída do build)
├── renderer/           (código do navegador)
├── assets/             (recursos)
├── main.js             (entry point)
└── preload.js          (API bridge)
```

---

## 📈 Escalabilidade Futura

### Para Adicionar Novas Linguagens

1. **Adicione compiler handler em main.js**
2. **Exponha em preload.js**
3. **Use em script.js**
4. **Detecte em detectLanguage()**

### Para Adicionar Features UI

1. **Crie novo arquivo JS em renderer/**
2. **Importe em index.html**
3. **Integre com CLTechCore class**
4. **Estilize em style.css**

### Para Temas

1. **Crie novo arquivo CSS**
2. **Sobrescreva variáveis :root**
3. **Adicione toggle em script.js**

---

## 📝 Padrões de Código

### Naming Conventions
- **Classes:** PascalCase (CLTechCore)
- **Functions:** camelCase (compileCpp)
- **Variables:** camelCase (currentFile)
- **Constants:** UPPER_SNAKE_CASE (MAX_FILE_SIZE)
- **CSS Classes:** kebab-case (console-line)

### Code Style
- **Indentation:** 2 spaces
- **Semicolons:** Obrigatório
- **Quotes:** Prefer double (")
- **Comments:** // para uma linha

---

**Arquitetura robusta e segura! 🏗️**
