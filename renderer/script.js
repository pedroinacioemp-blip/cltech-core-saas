// ==========================================
// CL TECH CORE - MAIN APPLICATION (MODULAR)
// ==========================================

class CLTechCore {
	constructor() {
		this.currentFile = null;
		this.currentLanguage = 'unknown';
		this.compiling = false;
		this.initElements();
		this.setupEventListeners();
		this.checkCompilers();
		this.initConsole();
		this.applyTheme();
	}

	// ==========================================
	// Modular Element Initialization
	// ==========================================
	initElements() {
		this.codeEditor = document.getElementById('codeEditor');
		this.console = document.getElementById('console');
		this.runBtn = document.getElementById('runBtn');
		this.compileBtn = document.getElementById('compileBtn');
		this.clearBtn = document.getElementById('clearBtn');
		this.openFileBtn = document.getElementById('openFileBtn');
		this.fileInput = document.getElementById('fileInput');
		this.languageBadge = document.getElementById('language-badge');
		this.fileName = document.getElementById('file-name');
		this.statusIndicator = document.getElementById('status-indicator');
		this.statusText = document.getElementById('status-text');
		this.compilerStatus = document.getElementById('compiler-status');
		this.consoleActionBtn = document.getElementById('consoleAction');

		// Search elements
		this.searchBtn = document.getElementById('searchBtn');
		this.searchQuery = document.getElementById('searchQuery');
		this.apiKey = document.getElementById('apiKey');
		this.cx = document.getElementById('cx');
		this.searchResults = document.getElementById('searchResults');
		this.themeSelect = document.getElementById('themeSelect');
		this.loadThemeBtn = document.getElementById('loadThemeBtn');
	}

	// ==========================================
	// Event Listeners
	// ==========================================
	setupEventListeners() {
		this.runBtn.addEventListener('click', () => this.runCode());
		this.compileBtn.addEventListener('click', () => this.compileCode());
		this.clearBtn.addEventListener('click', () => this.clearConsole());
		this.openFileBtn.addEventListener('click', () => this.fileInput.click());
		this.fileInput.addEventListener('change', (e) => this.loadFile(e));
		this.consoleActionBtn.addEventListener('click', () => this.copyConsoleOutput());

		// Search event listener
		if (this.searchBtn) this.searchBtn.addEventListener('click', () => this.performGoogleSearch());
		if (this.loadThemeBtn) this.loadThemeBtn.addEventListener('click', () => this.applyTheme());
		if (this.themeSelect) this.themeSelect.addEventListener('change', () => this.applyTheme());
		document.addEventListener('keydown', (e) => this.handleShortcuts(e));
		this.codeEditor.addEventListener('input', () => this.detectLanguage());

		// Toolbar buttons
		this.addToolbarHandlers();
	}

	addToolbarHandlers() {
		const toolbarActions = {
			themeBtn: () => this.openThemePanel(),
			syntaxBtn: () => this.toggleSyntaxHighlight(),
			minimapBtn: () => this.toggleMinimap(),
			snippetsBtn: () => this.openSnippets(),
			historyBtn: () => this.openHistory(),
			exportBtn: () => this.exportProject(),
			gitBtn: () => this.openGitPanel(),
			terminalBtn: () => this.openTerminal(),
			copilotBtn: () => this.openCopilot(),
			collabBtn: () => this.openCollab()
		};
		Object.keys(toolbarActions).forEach(id => {
			const btn = document.getElementById(id);
			if (btn) btn.addEventListener('click', toolbarActions[id]);
		});
	}

	// Placeholders for advanced features
	openThemePanel() { alert('Seleção de temas em breve!'); }
	toggleSyntaxHighlight() { alert('Highlight de sintaxe ativado!'); }
	toggleMinimap() { alert('Minimapa ativado!'); }
	openSnippets() { alert('Snippets em breve!'); }
	openHistory() { alert('Histórico de execução em breve!'); }
	exportProject() { alert('Exportação de projeto em breve!'); }
	openGitPanel() { alert('Integração Git em breve!'); }
	openTerminal() { alert('Terminal avançado em breve!'); }
	openCopilot() { alert('Copilot Chat em breve!'); }
	openCollab() { alert('Colaboração em breve!'); }

	// ==========================================
	// Keyboard Shortcuts
	// ==========================================
	handleShortcuts(e) {
		if (e.ctrlKey && e.key === 'Enter') {
			e.preventDefault();
			this.runCode();
		} else if (e.ctrlKey && e.shiftKey && e.key === 'C') {
			e.preventDefault();
			this.compileCode();
		} else if (e.ctrlKey && e.key === 'l') {
			e.preventDefault();
			this.clearConsole();
		} else if (e.ctrlKey && e.key === 'o') {
			e.preventDefault();
			this.fileInput.click();
		}
	}

	// ==========================================
	// Theme System (Future-Proof)
	// ==========================================
	applyTheme() {
		const theme = this.themeSelect ? this.themeSelect.value : 'dark-green';
		document.body.classList.remove('theme-dark-green', 'theme-dark-blue', 'theme-dark-purple');
		document.body.classList.add(`theme-${theme}`);
		// Future: Load theme config from JSON or API
	}

	// ==========================================
	// Compiler Check
	// ==========================================
	async checkCompilers() {
		this.setStatus('Verificando compiladores...', 'checking');
		let gppExists = false;
		let javacExists = false;
		try {
			await window.electronAPI.runCommand('where g++ >nul 2>&1');
			gppExists = true;
		} catch {}
		try {
			await window.electronAPI.runCommand('where javac >nul 2>&1');
			javacExists = true;
		} catch {}
		let statusMsg = '';
		if (gppExists && javacExists) {
			statusMsg = '✓ g++ & javac disponíveis';
			this.setStatus(statusMsg, 'ready');
		} else {
			let missing = [];
			if (!gppExists) missing.push('g++');
			if (!javacExists) missing.push('javac');
			statusMsg = `⚠ Faltando: ${missing.join(', ')}`;
			this.setStatus(statusMsg, 'warning');
			this.addConsoleLog(`Aviso: ${missing.join(' e ')} não encontrado(s). Configure o PATH corretamente.`, 'warning');
		}
		this.compilerStatus.textContent = statusMsg;
	}

	// ==========================================
	// File Management
	// ==========================================
	async loadFile(event) {
		const file = event.target.files[0];
		if (!file) return;
		this.currentFile = file.path;
		this.fileName.textContent = `📄 ${file.name}`;
		try {
			const content = await window.electronAPI.readFile(this.currentFile);
			this.codeEditor.value = content;
			this.detectLanguage();
			this.addConsoleLog(`Arquivo carregado: ${file.name}`, 'success');
		} catch (error) {
			this.addConsoleLog(`Erro ao carregar arquivo: ${error.message}`, 'error');
		}
	}

	// ==========================================
	// Language Detection
	// ==========================================
	detectLanguage() {
		const content = this.codeEditor.value;
		const detected = window.electronAPI.detectLanguage(content);
		let language = 'Unknown';
		let color = '';
		switch (detected) {
			case 'cpp':
				language = 'C++';
				color = '#00ff00';
				this.currentLanguage = 'cpp';
				break;
			case 'java':
				language = 'Java';
				color = '#ffff00';
				this.currentLanguage = 'java';
				break;
			default:
				language = 'Desconhecido';
				color = '#cccccc';
				this.currentLanguage = 'unknown';
		}
		this.languageBadge.textContent = language;
		this.languageBadge.style.borderColor = color;
		this.languageBadge.style.color = color;
	}

	// ==========================================
	// Compilation & Execution
	// ==========================================
	async runCode() {
		if (this.compiling) {
			this.addConsoleLog('Compilação em andamento...', 'warning');
			return;
		}
		const code = this.codeEditor.value.trim();
		if (!code) {
			this.addConsoleLog('Por favor, escreva algum código', 'warning');
			return;
		}
		if (this.currentLanguage === 'unknown') {
			this.addConsoleLog('Linguagem não detectada. Use #include para C++ ou class para Java', 'error');
			return;
		}
		this.clearConsole();
		await this.compileCode(true);
	}

	async compileCode(shouldRun = false) {
		if (this.compiling) {
			this.addConsoleLog('Compilação em andamento...', 'warning');
			return;
		}
		if (!this.currentFile && this.currentLanguage === 'unknown') {
			this.addConsoleLog('Salve o arquivo primeiro ou abra um arquivo existente', 'error');
			return;
		}
		this.compiling = true;
		this.setStatus('Compilando...', 'compiling');
		this.runBtn.disabled = true;
		this.compileBtn.disabled = true;
		try {
			if (this.currentLanguage === 'cpp') {
				await this.compileCpp(shouldRun);
			} else if (this.currentLanguage === 'java') {
				await this.compileJava(shouldRun);
			}
		} catch (error) {
			this.setStatus('Erro na compilação', 'error');
		} finally {
			this.compiling = false;
			this.runBtn.disabled = false;
			this.compileBtn.disabled = false;
		}
	}

	async compileCpp(shouldRun = false) {
		if (!this.currentFile) {
			const tempFile = require('path').join(require('os').tmpdir(), 'cltechcore_' + Date.now() + '.cpp');
			try {
				await window.electronAPI.saveFile(tempFile, this.codeEditor.value);
				this.currentFile = tempFile;
			} catch (error) {
				this.addConsoleLog('Erro ao criar arquivo temporário: ' + error.message, 'error');
				return;
			}
		}
		this.addConsoleLog(`> Compilando C++ (${this.currentFile})...`, 'info');
		try {
			const result = await window.electronAPI.compileCpp(this.currentFile);
			this.addConsoleLog('✓ Compilação bem-sucedida!', 'success');
			if (shouldRun) {
				this.addConsoleLog('> Executando...', 'info');
				this.addConsoleLog('━━━━━━━━━━━━━━━━[OUTPUT]━━━━━━━━━━━━━━━━', 'info');
				try {
					const runResult = await window.electronAPI.runCppExe(result.exePath);
					const output = runResult.stdout || '(sem saída)';
					this.addConsoleLog(output, 'success');
				} catch (runError) {
					this.addConsoleLog('Erro na execução:', 'error');
					this.addConsoleLog(runError.stderr || runError.error, 'error');
				}
			}
			this.setStatus('Pronto', 'ready');
		} catch (error) {
			this.addConsoleLog('✗ Erro na compilação:', 'error');
			this.addConsoleLog(error.stderr || error.error, 'error');
			this.setStatus('Erro na compilação', 'error');
		}
	}

	async compileJava(shouldRun = false) {
		if (!this.currentFile) {
			this.addConsoleLog('Salve o arquivo Java primeiro', 'error');
			return;
		}
		this.addConsoleLog(`> Compilando Java (${this.currentFile})...`, 'info');
		try {
			const result = await window.electronAPI.compileJava(this.currentFile);
			this.addConsoleLog('✓ Compilação bem-sucedida!', 'success');
			if (shouldRun) {
				this.addConsoleLog('> Executando...', 'info');
				this.addConsoleLog('━━━━━━━━━━━━━━━━[OUTPUT]━━━━━━━━━━━━━━━━', 'info');
				try {
					const runResult = await window.electronAPI.runJava(this.currentFile);
					const output = runResult.stdout || '(sem saída)';
					this.addConsoleLog(output, 'success');
				} catch (runError) {
					this.addConsoleLog('Erro na execução:', 'error');
					this.addConsoleLog(runError.stderr || runError.error, 'error');
				}
			}
			this.setStatus('Pronto', 'ready');
		} catch (error) {
			this.addConsoleLog('✗ Erro na compilação:', 'error');
			this.addConsoleLog(error.stderr || error.error, 'error');
			this.setStatus('Erro na compilação', 'error');
		}
	}

	// ==========================================
	// Console
	// ==========================================
	addConsoleLog(message, type = 'text') {
		const line = document.createElement('div');
		line.className = 'console-line';
		const prompt = document.createElement('span');
		prompt.className = 'console-prompt';
		prompt.textContent = '>';
		const text = document.createElement('span');
		text.className = `console-text ${type}`;
		text.textContent = message;
		line.appendChild(prompt);
		line.appendChild(text);
		this.console.appendChild(line);
		this.console.scrollTop = this.console.scrollHeight;
	}

	clearConsole() {
		this.console.innerHTML = '';
		this.addConsoleLog('Console limpo', 'info');
	}

	copyConsoleOutput() {
		const text = Array.from(this.console.querySelectorAll('.console-line'))
			.map(line => line.textContent.replace('>', '').trim())
			.join('\n');
		navigator.clipboard.writeText(text).then(() => {
			const btn = this.consoleActionBtn;
			const original = btn.textContent;
			btn.textContent = '✓ Copiado!';
			setTimeout(() => {
				btn.textContent = original;
			}, 1500);
		});
	}

	// ==========================================
	// Status
	// ==========================================
	setStatus(message, status = 'ready') {
		this.statusText.textContent = message;
		switch (status) {
			case 'ready':
				this.statusIndicator.style.backgroundColor = '#00ff00';
				this.statusIndicator.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.8)';
				break;
			case 'compiling':
				this.statusIndicator.style.backgroundColor = '#ffff00';
				this.statusIndicator.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.8)';
				break;
			case 'error':
				this.statusIndicator.style.backgroundColor = '#ff0033';
				this.statusIndicator.style.boxShadow = '0 0 10px rgba(255, 0, 51, 0.8)';
				break;
			case 'warning':
				this.statusIndicator.style.backgroundColor = '#ffaa00';
				this.statusIndicator.style.boxShadow = '0 0 10px rgba(255, 170, 0, 0.8)';
				break;
			case 'checking':
				this.statusIndicator.style.backgroundColor = '#00ffff';
				this.statusIndicator.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
				break;
		}
	}
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		new CLTechCore();
	});
} else {
	new CLTechCore();
}




