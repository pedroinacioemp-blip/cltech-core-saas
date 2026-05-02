// Carrega Monaco Editor dinamicamente
function loadMonaco(callback) {
  if (window.monaco) return callback();
  const loaderScript = document.createElement('script');
  loaderScript.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
  loaderScript.onload = () => {
    window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
    window.require(['vs/editor/editor.main'], () => {
      callback();
    });
  };
  document.body.appendChild(loaderScript);
}
