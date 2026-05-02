# 🚀 QUICKSTART - CL TECH CORE

## ⚡ Instalação Ultra-Rápida

### 1️⃣ Instale Node.js
[Download Node.js](https://nodejs.org/) - Versão LTS recomendada

### 2️⃣ Clone/Descompacte o Projeto
```bash
cd CL-TECH-CORE
```

### 3️⃣ Instale Dependências
```bash
npm install
```

### 4️⃣ Execute!
```bash
npm start
```

---

## 📚 Exemplos Rápidos

### ✅ Exemplo C++ (Hello World)

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "[CL TECH CORE] Hello, World!" << endl;
    cout << "C++ Funcionando!" << endl;
    return 0;
}
```

**Como testar:**
1. Cole o código no editor
2. Pressione `Ctrl+Enter` (RUN)
3. Veja o resultado no console!

### ✅ Exemplo Java (Hello World)

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("[CL TECH CORE] Hello, World!");
        System.out.println("Java Funcionando!");
    }
}
```

**Como testar:**
1. Cole o código no editor
2. Pressione `Ctrl+Enter` (RUN)
3. Veja o resultado no console!

---

## 🎮 Atalhos Principais

| Atalho | Ação |
|--------|------|
| `Ctrl+Enter` | Compilar + Executar |
| `Ctrl+Shift+C` | Apenas Compilar |
| `Ctrl+L` | Limpar Console |
| `Ctrl+O` | Abrir Arquivo |

---

## ⚙️ Pré-requisitos do Sistema

### Windows
```bash
# g++ (para C++)
choco install mingw

# Java (para Java)
choco install openjdk
```

Ou baixe manualmente:
- [MinGW](https://www.mingw-w64.org/)
- [OpenJDK](https://adoptopenjdk.net/)

### Verificar Instalação
```bash
# Verificar g++
g++ --version

# Verificar java
java -version
javac -version
```

---

## 🆘 Problemas Comuns?

### ❌ "g++ não encontrado"
- Instale MinGW
- Adicione ao PATH do Windows
- Reinicie a aplicação

### ❌ "java: command not found"
- Instale JDK
- Configure JAVA_HOME
- Reinicie a aplicação

### ❌ "Aplicação não abre"
- Verifique Node.js: `node --version`
- Reinstale dependências: `npm install`
- Tente novamente: `npm start`

---

## 📦 Build Final (Instalador)

Para gerar `.exe` / `.msi`:

```bash
npm run build
```

Instaladores aparecem em: `dist/`

---

## 🎨 Interface

| Seção | Descrição |
|-------|-----------|
| **Header** | Branding + Status |
| **Controls** | Botões de ação |
| **Editor** | Área de código |
| **Console** | Output terminal |

---

## 💬 Dúvidas?

Confira o **README.md** completo para mais informações!

---

**Bom desenvolvimento! 🚀💻**
