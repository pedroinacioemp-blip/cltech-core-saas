const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  // Executar comando via IPC
  runCommand: (command) => {
    return ipcRenderer.invoke('run-command', command);
  },

  // Compilar C++
  compileCpp: (filePath) => {
    return ipcRenderer.invoke('compile-cpp', filePath);
  },

  // Executar C++
  runCppExe: (exePath) => {
    return ipcRenderer.invoke('run-exe', exePath);
  },

  // Compilar Java
  compileJava: (filePath) => {
    return ipcRenderer.invoke('compile-java', filePath);
  },

  // Executar Java
  runJava: (filePath) => {
    return ipcRenderer.invoke('run-java', filePath);
  },

  // Google Search
  googleSearch: (params) => {
    return ipcRenderer.invoke('google-search', params);
  },

  // Ler arquivo
  readFile: (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  },

  // Salvar arquivo
  saveFile: (filePath, content) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf8', (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ success: true });
        }
      });
    });
  },

  // Detectar linguagem
  detectLanguage: (content) => {
    if (content.includes('#include')) return 'cpp';
    if (content.includes('public class') || content.includes('class ')) return 'java';
    return 'unknown';
  },

  // Variáveis de path
  path: path,
  require: undefined // Bloqueia require direto
});
