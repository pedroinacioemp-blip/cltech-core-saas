# 💻 DESENVOLVIMENTO - CL TECH CORE

## 📚 Estrutura do Projeto

```
CL-TECH-CORE/
├── main.js                      # Processo principal Electron + IPC Handlers
├── preload.js                   # API segura entre render e main
├── package.json                 # Dependências e scripts
├── INSTALL.md                   # Guia de instalação
├── QUICKSTART.md                # Guia rápido
├── README.md                    # Documentação completa
├── DEVELOPMENT.md               # Este arquivo
├── ARCHITECTURE.md              # Arquitetura da aplicação
│
├── renderer/
│   ├── index.html               # Interface HTML
│   ├── style.css                # Estilos (dark + neon)
│   ├── script.js                # Lógica principal (classe CLTechCore)
│   └── matrix.js                # Efeito Matrix no canvas
│
├── assets/
│   ├── icon.png                 # Ícone 512x512
│   └── icon.ico                 # Ícone Windows
│
├── examples/
│   ├── example.cpp              # Exemplo C++
│   └── Example.java             # Exemplo Java
│
├── dist/                        # Build output (gerado com npm run build)
│   ├── CL TECH CORE.exe         # Instalador NSIS
│   └── CL TECH CORE.msi         # Instalador MSI
│
└── .gitignore                   # Arquivos ignorados pelo git
```

---

## 🔧 Fluxo de Dados

### Arquitetura IPC (Inter-Process Communication)

```
┌─────────────────────────────────────────────┐
│      RENDERER PROCESS (Navegador)           │
│  - script.js (CLTechCore class)             │
│  - Interage com: window.electronAPI         │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │    preload.js       │
        │ (Context Isolation) │
        │ Expõe API segura    │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   IPC.invoke()      │
        │ (Promessas)         │
        └──────────┬──────────┘
                   │
┌──────────────────▼──────────────────────────┐
│    MAIN PROCESS (Node.js)                   │
│  - main.js (IPC Handlers)                   │
│  - child_process (executa g++ e javac)      │
│  - fs (leitura/escrita de arquivos)         │
└─────────────────────────────────────────────┘
```

---

## 📋 Fluxo de Compilação C++

1. **Usuário clica RUN/COMPILE**
2. Script JS chama `electronAPI.compileCpp(filePath)`
3. Preload.js invoca IPC: `ipcRenderer.invoke('compile-cpp', filePath)`
4. Main.js recebe e executa: `g++ arquivo.cpp -o arquivo.exe`
5. Retorna resultado via Promise
6. Script JS atualiza console com saída

```
User Action
    ↓
script.js (CLTechCore.compileCpp)
    ↓
window.electronAPI.compileCpp()
    ↓
preload.js ipcRenderer.invoke()
    ↓
main.js IPC Handler
    ↓
child_process.exec(g++ ...)
    ↓
Promise resolve/reject
    ↓
script.js addConsoleLog()
```

---

## 🎨 Componentes Principais

### 1. Classe `CLTechCore` (script.js)

**Responsável por:**
- Gerenciamento do editor
- Detecção automática de linguagem
- Acionamento de compilação/execução
- Atualização do console
- Gerenciamento de arquivo

**Métodos principais:**
```javascript
- initElements()           // Referências DOM
- setupEventListeners()    // Atalhos e eventos
- detectLanguage()         // Detecta C++ ou Java
- runCode()               // Compila + executa
- compileCode()           // Apenas compila
- compileCpp()            // Compilação C++ específica
- compileJava()           // Compilação Java específica
- addConsoleLog()         // Adiciona linha ao console
- setStatus()             // Atualiza status
- checkCompilers()        // Verifica g++ e javac
```

### 2. Handlers IPC (main.js)

```javascript
- handle('compile-cpp')    // g++ arquivo.cpp -o arquivo.exe
- handle('run-exe')        // Executa .exe gerado
- handle('compile-java')   // javac arquivo.java
- handle('run-java')       // java NomeDaClasse
- handle('run-command')    // Comando genérico
```

### 3. Efeito Matrix (matrix.js)

Classe autônoma que:
- Cria canvas para efeito matrix
- Anima caracteres caindo
- Responsivo ao redimensionar

### 4. Estilos (style.css)

- **Variáveis CSS** para cores e efeitos
- **Animações** (glow, pulse, slideInLeft)
- **Scanlines** efímeras
- **Temas de cores** por tipo (erro, sucesso, aviso)

---

## 🚀 Desenvolvimento

### Scripts NPM

```bash
npm start           # Inicia em modo desenvolvimento
npm run dev         # Mesmo que npm start
npm run build       # Gera instaladores (.exe, .msi)
npm run build-win   # Build apenas Windows
```

### Estrutura de Pastas

Criar novo arquivo renderizado:
```
renderer/
├── novo-arquivo.js
└── novo-arquivo.css
```

Importar em `index.html`:
```html
<script src="novo-arquivo.js"></script>
<link rel="stylesheet" href="novo-arquivo.css">
```

---

## 🐛 Debug

### Ativar DevTools

Descomente em `main.js`:
```javascript
// mainWindow.webContents.openDevTools();
```

### Logs do Main Process

```javascript
// Em main.js
console.log('Debug message');
```

Aparece no terminal onde você rodou `npm start`.

### Inspecionar Elementos

DevTools permite:
- Inspecionar elementos HTML
- Ver console JS
- Network (IPC)
- Performance
- Aplicação

---

## 📦 Build do Instalador

### Comando
```bash
npm run build
```

### O que gera
- `dist/CL TECH CORE.exe` (NSIS)
- `dist/CL TECH CORE.msi` (MSI)

### Configuração (package.json)

```json
"build": {
  "appId": "com.cltech.core",
  "productName": "CL TECH CORE",
  "win": {
    "target": ["nsis", "msi"],
    "icon": "assets/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true
  }
}
```

---

## 🎨 Customização

### Adicionar Novo Compilador

1. Adicione handler em `main.js`:
```javascript
ipcMain.handle('compile-python', (event, filePath) => {
  return new Promise((resolve, reject) => {
    exec(`python "${filePath}"`, (error, stdout, stderr) => {
      // ... logica
    });
  });
});
```

2. Exponha em `preload.js`:
```javascript
compilePython: (filePath) => {
  return ipcRenderer.invoke('compile-python', filePath);
}
```

3. Use em `script.js`:
```javascript
await window.electronAPI.compilePython(filePath);
```

### Alterar Cores

Edite variáveis CSS em `style.css`:
```css
:root {
  --color-green: #00ff00;      /* Verde neon */
  --color-red: #ff0033;        /* Vermelho */
  --color-yellow: #ffff00;     /* Amarelo */
  --color-cyan: #00ffff;       /* Ciano */
}
```

### Alterar Tema

Crie novo arquivo CSS e importe em `index.html`:
```html
<link rel="stylesheet" href="tema-novo.css">
```

---

## ⚡ Performance

### Otimizações Implementadas

- ✅ Context Isolation (segurança)
- ✅ Node Integration desabilitado
- ✅ Preload.js expõe apenas API necessária
- ✅ Child processes executam em processo separado
- ✅ Auto-scroll do console feito com JS nativo
- ✅ Scanlines com CSS (GPU acelerado)

### Pontos de Melhoria Futuro

- [ ] Syntax highlighting (highlight.js)
- [ ] File watcher (recompila ao salvar)
- [ ] Histórico de compilações
- [ ] Cache de compilações
- [ ] Temas plugáveis
- [ ] Suporte a mais linguagens

---

## 🔒 Segurança

### Implementações

- **Context Isolation:** Renderer e Main completamente isolados
- **Preload Script:** Única ponte entre processos
- **API Whitelist:** Apenas funções específicas expostas
- **No Direct IPC:** child_process executado no Main
- **No Node Require:** Renderer não pode requer módulos

### Best Practices

Nunca faça isso em script.js:
```javascript
// ❌ ERRADO
require('child_process').exec(...)

// ✅ CORRETO
window.electronAPI.compileCpp(filePath)
```

---

## 🧪 Testes Manuais

Checklist antes de compilar:

- [ ] Editar código no editor
- [ ] Detectar linguagem (C++ ou Java)
- [ ] Compilar com sucesso
- [ ] Executar com sucesso
- [ ] Exibir output no console
- [ ] Abrir arquivo .cpp
- [ ] Abrir arquivo .java
- [ ] Limpar console
- [ ] Atalhos de teclado funcionam
- [ ] Status indicator muda corretamente
- [ ] Sem erros no console DevTools

---

## 📚 Referências

- [Documentação Electron](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Node.js Child Process](https://nodejs.org/api/child_process.html)
- [IPC no Electron](https://www.electronjs.org/docs/api/ipc-main)

---

## 👥 Contribuindo

Para adicionar features:

1. Crie uma branch
2. Faça suas mudanças
3. Teste manualmente
4. Faça commit com mensagem clara
5. Abra um PR

---

**Happy coding! 🚀💻**
