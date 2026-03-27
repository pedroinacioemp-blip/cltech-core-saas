# Guia Rápido: Deploy + Mobile

## 🚀 DEPLOY NA RENDER (5 Minutos)

1. Push no GitHub
2. Criar Postgres na Render (copiar connection string)
3. Criar Web Service backend: `.NET`
4. Criar Static Site frontend: `React`
5. Criar Redis
6. Conectar tudo

**URLs Finais:**
- Frontend: `https://seu-app.onrender.com`
- API: `https://seu-api.onrender.com/swagger`

---

## 📱 ACESSAR NO CELULAR (Opções)

### Rápido (WiFi Local)
```
http://192.168.1.100:3000
```
(Troque IP pelo seu PC)

### De Qualquer Lugar (Ngrok)
```powershell
.\ngrok.exe http 3000
```
Copie a URL que aparecer.

### Produção (Render)
```
https://seu-app.onrender.com
```

---

## ⚡ COMANDOS IMPORTANTES

### Descobrir IP PC
```powershell
ipconfig
```

### Testar Portas
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

### Iniciar Ngrok
```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

### Start Backend
```powershell
cd C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\backend\src\ClTechCore.Api
dotnet run
```

### Start Frontend
```powershell
cd C:\Users\Administrator\Desktop\CL-TECH-CORE\saas\frontend
npm run dev
```

---

## 📋 Checklist Deploy

- [ ] Repositório no GitHub
- [ ] Conta Render criada
- [ ] PostgreSQL criado na Render
- [ ] Backend deployado
- [ ] Frontend deployado
- [ ] Redis criado
- [ ] Environment vars atualizadas
- [ ] Teste no navegador funciona
- [ ] Teste no celular funciona

---

Leia os arquivos completos:
- `DEPLOY_RENDER.md` - Instruções detalhadas
- `ACESSO_MOBILE.md` - Todas as opções de mobile
