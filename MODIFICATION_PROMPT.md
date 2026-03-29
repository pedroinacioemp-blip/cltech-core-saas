# CL-TECH CORE - Prompt Mestre de Evolução (V2)

## Contexto do Projeto
Você é um Engenheiro de Software Sênior encarregado de evoluir o **CL-TECH CORE**, um SaaS de gerenciamento de mídias e automação de mensagens. O sistema utiliza:
- **Backend**: Node.js + Express (API)
- **Frontend**: React + Vite + Tailwind CSS
- **Storage**: Cloudinary (Imagens)
- **Database**: PostgreSQL (Banco relacional)
- **Cache**: Redis (Sessões e filas)
- **Infra**: Render (Deploy via Blueprints)

## Objetivo da Modificação
Transformar a prova de conceito atual em um produto SaaS robusto, seguro e com UX de alta qualidade, focando em automação de mídias com legendas.

## Tarefas de Implementação (Prioritárias)

### 1. UX & Interface (Frontend)
- **Notificações**: Instale `react-hot-toast` e substitua todos os `alert()` por toasts elegantes (sucesso, erro, carregando).
- **Funcionalidade de Cópia**: Na [Galeria de Imagens](file:///c:/Users/Administrator/Documents/trae_projects/CL-TECH/cltech-core-saas/frontend/src/pages/Images.jsx), adicione um botão para copiar a URL direta da imagem da API para o clipboard.
- **Skeleton Loaders**: Implemente componentes de "esqueleto" durante o `fetchImages` para evitar saltos de layout.
- **Preview de Upload**: Melhore a área de upload com suporte a drag-and-drop e compressão de imagem no client-side (usando `browser-image-compression`).

### 2. Segurança & Robustez (API)
- **Validação de Dados**: Use `joi` para validar o corpo das requisições nos endpoints de upload e login, garantindo tipos de dados corretos e prevenindo injeções.
- **Rate Limiting**: Implemente `express-rate-limit` para proteger os endpoints da API contra ataques de força bruta e abusos de upload.
- **Edição de Legendas**: Adicione uma rota `PATCH /api/images/:id` para permitir que o usuário altere a legenda de uma imagem sem precisar reenviar o arquivo.

### 3. Documentação & Integração (SaaS)
- **Swagger/OpenAPI**: Configure o `swagger-ui-express` para gerar documentação interativa da API em `/api-docs`.
- **Sincronização com Bot**: Crie um endpoint de Webhook (`/api/webhooks/bot-status`) para que o [Bot de WhatsApp](file:///c:/Users/Administrator/Documents/trae_projects/CL-TECH/cltech-core-saas/bot/src/index.js) possa reportar o sucesso/falha no envio de imagens.
- **Fila de Envio**: Prepare a estrutura para usar `bull` com o Redis já configurado no [render.yaml](file:///c:/Users/Administrator/Documents/trae_projects/CL-TECH/cltech-core-saas/render.yaml) para processar envios em massa.

## Diretrizes Técnicas
1. **Padrão de Código**: Mantenha o estilo de importação `require` no backend e `ESM` no frontend.
2. **Variáveis de Ambiente**: Nunca exponha chaves sensíveis; use sempre o arquivo `.env` e as definições do Render Blueprint.
3. **Resiliência**: Trate erros de rede e de banco de dados com mensagens amigáveis ao usuário via toast.

---
*Este prompt serve como guia definitivo para a próxima fase de desenvolvimento do CL-TECH CORE.*
