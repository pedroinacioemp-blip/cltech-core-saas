const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

let mainWindow;
let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadURL(`data:text/html,
    <html>
      <head>
        <style>
          body { 
            background: linear-gradient(135deg, #ff69b4, #8a2be2); 
            color: white; 
            font-family: Arial, sans-serif; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
          }
          .loader { 
            border: 4px solid #f3f3f3; 
            border-top: 4px solid #3498db; 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            animation: spin 2s linear infinite; 
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h1 { font-size: 18px; margin-bottom: 20px; }
          p { font-size: 14px; opacity: 0.8; }
        </style>
      </head>
      <body>
        <h1>CL TECH CORE</h1>
        <div class="loader"></div>
        <p>Carregando sistema...</p>
        <p id="status">Inicializando...</p>
      </body>
    </html>
  `);

  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('renderer/index.html');

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.destroy();
      mainWindow.show();
    }, 2000);
  });

  // Descomenta para debug
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ==========================================
// IPC HANDLERS
// ==========================================

// Executar comando
ipcMain.handle('run-command', (event, command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({
          error: error.message,
          stderr: stderr
        });
      } else {
        resolve({
          stdout: stdout,
          stderr: stderr
        });
      }
    });
  });
});

// Compilar C++
ipcMain.handle('compile-cpp', (event, filePath) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filePath, '.cpp');
    const outputExe = path.join(path.dirname(filePath), `${fileName}.exe`);
    const command = `g++ "${filePath}" -o "${outputExe}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({
          error: error.message,
          stderr: stderr || 'Erro na compilação C++'
        });
      } else {
        resolve({
          success: true,
          exePath: outputExe,
          message: 'C++ compilado com sucesso!'
        });
      }
    });
  });
});

// Executar EXE
ipcMain.handle('run-exe', (event, exePath) => {
  return new Promise((resolve, reject) => {
    exec(`"${exePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject({
          error: error.message,
          stderr: stderr || stdout
        });
      } else {
        resolve({
          stdout: stdout
        });
      }
    });
  });
});

// Compilar Java
ipcMain.handle('compile-java', (event, filePath) => {
  return new Promise((resolve, reject) => {
    const command = `javac "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({
          error: error.message,
          stderr: stderr || 'Erro na compilação Java'
        });
      } else {
        resolve({
          success: true,
          message: 'Java compilado com sucesso!'
        });
      }
    });
  });
});

// Executar Java
ipcMain.handle('run-java', (event, filePath) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const className = path.basename(filePath, '.java');
    const command = `cd "${dir}" && java ${className}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({
          error: error.message,
          stderr: stderr || stdout
        });
      } else {
        resolve({
          stdout: stdout
        });
      }
    });
  });
});

// Google Search
ipcMain.handle('google-search', async (event, { query, apiKey, cx }) => {
  try {
    const customsearch = google.customsearch('v1');
    const response = await customsearch.cse.list({
      auth: apiKey,
      cx: cx,
      q: query,
      num: 10
    });
    return {
      success: true,
      results: response.data.items || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// ==========================================
// APP EVENTS
// ==========================================

app.on('ready', () => {
  createSplashWindow();
  setTimeout(createWindow, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
