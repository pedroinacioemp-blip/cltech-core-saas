# Deploy na Render.com

## Pré-requisitos
- Conta Render (grátis em https://render.com)
- GitHub com projeto pushado
- Variáveis de ambiente configuradas

## Passo 1: Preparar GitHub

1. Crie repositório no GitHub:
   ```bash
   cd C:\Users\Administrator\Desktop\CL-TECH-CORE\saas
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEUSEUSUARIO/cltech-core-saas.git
   git push -u origin main
   ```

## Passo 2: Criar PostgreSQL (Banco na Nuvem)

1. Acesse https://render.com
2. Clique em "New +" → "PostgreSQL"
3. Nome: `cltech-db`
4. Region: Frankfurt (menor latência para Brasil)
5. Deixar os defaults
6. Clique "Create Database"
7. **Copie a connectionString (você usará depois)**

## Passo 3: Deploy Backend (.NET)

1. Volte ao Dashboard Render
2. Clique "New +" → "Web Service"
3. Selecione seu repositório GitHub
4. Configure:
   - **Name**: `cltech-api`
   - **Environment**: Selecione `.NET`
   - **Build Command**: `dotnet build`
   - **Start Command**: `dotnet run --urls http://0.0.0.0:$PORT`
   - **Branch**: main
   - **Plan**: Free (ou pago conforme necessário)
5. Clique "Environment" e defina:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ConnectionStrings__DefaultConnection=[Cole aqui a string do PostgreSQL]
   Redis__ContainerName=redis-dominio.onrender.com:6379
   Jwt__SecretKey=seu-secret-key-muuuito-longo-aqui
   ```
6. Clique "Create Web Service"
7. **Aguarde 5-10 minutos o deploy completar**
8. Copie a URL: `https://cltech-api.onrender.com`

## Passo 4: Deploy Frontend (React)

1. Volte ao Dashboard Render
2. Clique "New +" → "Static Site"
3. Selecione seu repositório
4. Configure:
   - **Name**: `cltech-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Branch**: main
5. Clique "Environment" e defina:
   ```
   VITE_API_URL=https://cltech-api.onrender.com
   ```
6. Clique "Create Static Site"
7. **Aguarde 3-5 minutos**
8. Copie a URL: `https://cltech-frontend.onrender.com`

## Passo 5: Deploy Redis (Cache)

1. Volte ao Dashboard Render
2. Clique "New +" → "Redis"
3. Nome: `cltech-redis`
4. Region: Frankfurt
5. Clique "Create"
6. **Copie a connectionString Redis**

## Passo 6: Atualizar Backend com Redis

1. Volte ao serviço `cltech-api` no Render
2. Clique em "Environment"
3. Atualize: `Redis__ContainerName=sua-url-redis.onrender.com:XXXX`
4. Clique "Save"
5. Render fará redeploy automaticamente

## Passo 7: Deploy Bot (Node.js - Opcional)

1. Volte ao Dashboard
2. Clique "New +" → "Web Service"
3. Configure:
   - **Name**: `cltech-bot`
   - **Runtime**: Node
   - **Build Command**: `cd bot && npm install`
   - **Start Command**: `cd bot && node src/index.js`
4. Defina environment:
   ```
   API_URL=https://cltech-api.onrender.com
   OPENAI_API_KEY=sua-chave-openai
   ```
5. Clique "Create Web Service"

## Passo 8: Atualizar Config Local (depois do Deploy)

Altere `appsettings.json` do backend para apontar para os URLs da Render:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "[PostgreSQL connection string]"
  },
  "Redis": {
    "ContainerName": "[Redis URL da Render]"
  },
  "ApiBaseUrl": "https://cltech-api.onrender.com"
}
```

## Passo 9: Acessar no Navegador

- Frontend: `https://cltech-frontend.onrender.com`
- API: `https://cltech-api.onrender.com/swagger`
- Hangfire: `https://cltech-api.onrender.com/hangfire`

## Troubleshooting

### Erro "Build failed"
- Verifique se todos os pacotes estão instalados localmente
- Execute `dotnet restore` e `npm install` antes de fazer push

### Banco de dados não conecta
- Copie a connectionString corretamente
- Adicione `;Trust Server Certificate=true;` no final

### Serviço fica "Building" muito tempo
- Pode estar resolvendo dependências grandes
- Aguarde 15-20 minutos antes de cancelar

### Redis não conecta
- Verifique se Redis foi criado com sucesso
- Redis gratuito na Render dorme após inatividade (5 minutos)

## URLs Finais

```
Frontend:  https://cltech-frontend.onrender.com
API:       https://cltech-api.onrender.com
Swagger:   https://cltech-api.onrender.com/swagger
Hangfire:  https://cltech-api.onrender.com/hangfire
```

## Custo

- PostgreSQL: R$ 0 (free tier)
- Redis: R$ 0 (free tier)
- Web Services: R$ 0 (free tier, com limite de recursos)
- Total: **GRÁTIS** com free tier da Render
