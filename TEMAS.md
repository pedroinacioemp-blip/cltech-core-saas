# CL TECH CORE - Sistema de Temas

## 🎨 Temas Disponíveis

O CL TECH CORE agora possui 3 temas diferentes que podem ser selecionados no seletor de temas na barra de ferramentas.

### 1. **Dark Green** (Padrão)
- **Cores Principais**: Verde (#00ff00), Ciano (#00ffff), Amarelo (#ffff00)
- **Descrit**: Tema clássico "hacker" com cores verde neon sobre fundo preto
- **Ideal para**: Desenvolvedores que preferem o estilo tradicional de terminal hacker
- **Características**:
  - Background: Preto puro (#000000)
  - Texto Principal: Verde neon (#00ff00)
  - Destaque: Ciano (#00ffff)
  - Efeito de brilho (glow) verde

### 2. **Dark Blue** (Cyberpunk)
- **Cores Principais**: Ciano (#00d4ff), Magenta (#ff006e), Amarelo (#ffbe0b)
- **Descrição**: Tema estilo cyberpunk com cores futuristas azuis e magentas
- **Ideal para**: Desenvolvedores que gostam de estética futurista/cyberpunk
- **Características**:
  - Background: Azul escuro profundo (#0a0e27)
  - Texto Principal: Ciano brilhante (#00d4ff)
  - Destaque: Magenta (#ff006e)
  - Efeito de brilho (glow) ciano

### 3. **Dark Purple** (Synthwave)
- **Cores Principais**: Magenta (#ff10f0), Ciano (#ffff00), Amarelo (#00ffff)
- **Descrição**: Tema synthwave/vaporwave com cores retrô dos anos 80/90
- **Ideal para**: Desenvolvedores que apreciam estética retrô e synthwave
- **Características**:
  - Background: Roxo escuro (#1a0033)
  - Texto Principal: Magenta brilhante (#ff10f0)
  - Destaque: Ciano (#ffff00)
  - Efeito de brilho (glow) magenta

## 🎯 Como Usar

1. Abra o CL TECH CORE
2. Na barra de ferramentas (toolbar), localize o seletor de temas com o ícone 🎨
3. Clique no dropdown e escolha entre:
   - Dark Green
   - Dark Blue
   - Dark Purple
4. O tema será aplicado imediatamente
5. Sua seleção é salva automaticamente no localStorage

## 💾 Persistência

A preferência de tema é salva automaticamente no `localStorage` do navegador, então quando você abrir o CL TECH CORE novamente, ele carregará o tema que você escolheu pela última vez.

## 🔧 Personalização

Para adicionar mais temas, edite o arquivo `style.css`:

1. Adicione uma nova classe de tema:
```css
body.theme-seu-tema {
  --color-black: #XXXXXX;
  --color-green: #XXXXXX;
  /* ... outras variáveis ... */
}
```

2. Adicione a opção ao `index.html`:
```html
<option value="seu-tema">Sua Descrição do Tema</option>
```

3. Atualize a função `applyTheme()` em `script.js`:
```javascript
case 'seu-tema':
  document.body.classList.add('theme-seu-tema');
  this.addConsoleLog('✓ Seu Tema aplicado', 'success');
  break;
```

## 📝 Variáveis CSS por Tema

Cada tema define as seguintes variáveis CSS:

- `--color-black`: Cor de fundo principal
- `--color-green`: Cor de texto principal
- `--color-green-dark`: Variação escura da cor principal
- `--color-green-light`: Variação clara da cor principal
- `--color-red`: Cor para erros
- `--color-yellow`: Cor para avisos
- `--color-cyan`: Cor para destaque
- `--color-gray`: Cor para elementos secundários
- `--color-gray-light`: Cor para elementos terciários
- `--glow-green`: Efeito de brilho principal
- `--glow-red`: Efeito de brilho para erros
- `--glow-yellow`: Efeito de brilho para avisos

---

**Versão**: 1.0.2  
**Data**: 22 de Março de 2026
