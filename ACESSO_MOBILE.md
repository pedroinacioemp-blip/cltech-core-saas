# Acessar App em Celulares (Local e Produção)

## OPÇÃO 1: Via WiFi do mesmo PC (Local)

### Android e iPhone

1. **Descobrir IP do PC:**
   - Abra PowerShell como admin
   - Execute: `ipconfig`
   - Procure por "IPv4 Address" (Ex: 192.168.1.100)
   - Copie o valor (não use 127.0.0.1 ou localhost)

2. **No celular (Android/iPhone):**
   - Conecte à mesma rede WiFi do PC
   - Abra navegador (Chrome, Safari, etc)
   - Acesse: `http://SEU_IP:3000`
   - Exemplo: `http://192.168.1.100:3000`

3. **Testar API:**
   - Acesse: `http://SEU_IP:5000/swagger`

### Troubleshooting Local

- Celular não encontra IP:
  - Desative firewall do Windows (Win+R → firewall.cpl)
  - Ou libere portas 3000 e 5000 no firewall
  
- Conexão recusada:
  - Verifique se frontend/backend estão rodando
  - Confirme IP com `ipconfig` novamente

---

## OPÇÃO 2: Via Ngrok (Acessar de qualquer lugar)

### Instalação Ngrok

1. Baixe em: https://ngrok.com/download
2. Descompacte em: `C:\ngrok`
3. Execute no PowerShell:
   ```powershell
   cd C:\ngrok
   .\ngrok.exe http 3000
   ```
4. **Copie a URL gerada** (ex: `https://abc123.ngrok.io`)
5. Acesse no celular: `https://abc123.ngrok.io`

### Para API:
```powershell
.\ngrok.exe http 5000
```

**Vantagem**: Funciona de qualquer lugar do mundo, não precisa mesma rede

---

## OPÇÃO 3: Deploy Já Publicado (Render/Cloud)

### Acesso Simples

1. Abra o navegador do celular
2. Digite a URL do Deploy:
   - Frontend: `https://cltech-frontend.onrender.com`
   - API: `https://cltech-api.onrender.com/swagger`
3. Pronto! Funciona em qualquer rede

---

## PASSO A PASSO COMPLETO: Acessar no Celular (WiFi Local)

### 1. Iniciar Backend e Frontend

```powershell
# Terminal 1 - Backend
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\backend\src\ClTechCore.Api"
dotnet run

# Terminal 2 - Frontend
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\frontend"
npm run dev
```

### 2. Descobrir IP do PC

```powershell
ipconfig
```

Procure pela linha:
```
IPv4 Address . . . . . . . . . . . : 192.168.1.100
```

### 3. Ir ao Celular

**iPhone:**
1. Abra Safari
2. Digite: `http://192.168.1.100:3000`
3. Pressione "Go"

**Android:**
1. Abra Chrome
2. Digite: `http://192.168.1.100:3000`
3. Pressione "Enter"

### 4. Testar Funcionamento

- Página deve carregar com o logo e menu
- Tente fazer login
- Se funcionar no celular, está tudo certo!

---

## OPÇÃO MOBILE ESPECÍFICA: React Native (Aplicativo)

Se quiser um APP de verdade no celular (sem navegador):

```bash
cd "C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\mobile"
npm install
npm start
```

Scan o QR code com Expo Go app:
- iOS: https://apps.apple.com/app/expo-go/id982107779
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

---

## TABELA DE ACESSO

| Local/Rede | URL | Dispositivo | Como |
|-----------|-----|-----------|------|
| Mesmo WiFi | `http://192.168.1.100:3000` | Qualquer | IP + Porta |
| De qualquer lugar | `https://abc123.ngrok.io` | Qualquer | Ngrok |
| Produção | `https://cltech-frontend.onrender.com` | Qualquer | Direto pela web |
| APP Nativo | Expo Go | Android/iOS | React Native |

---

## RESOLUÇÃO DE PROBLEMAS

### "Não consigo acessar de forma alguma"

1. Verifique se backend/frontend estão rodando:
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   ```

2. Se não aparecer nada, start os serviços novamente

3. Desative o firewall temporariamente para testar:
   - Win+R → `firewall.cpl`
   - Clique "Turn Windows Firewall on or off"
   - "Off" (apenas teste)

### "Conecta mas a página não carrega"

- Limpe cache do navegador do celular (Ctrl+Shift+Del)
- Ou abra em modo privado/incógnito
- Verifique IP novamente

### "API mostra erro 401/403"

- Backend pode estar com CORS desabilitado
- Adicione no `Program.cs`:
```csharp
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

---

## MELHOR OPÇÃO RECOMENDADA

✅ **Para Testes**: WiFi Local (Opção 1)
✅ **Para Demonstrar**: Ngrok (Opção 2)
✅ **Para Produção**: Render Deploy (Opção 3)
✅ **Para APP Nativo**: React Native + Expo (Opção 4)
