# CL-TECH CORE - Prompt de Modificação

## Objetivo
Transformar o sistema atual em uma plataforma de gerenciamento de mídias e automação de SaaS com foco em envio de imagens e legendas via API.

## Diretrizes de Implementação
1. **Foco na API**: Priorizar a interface direta entre o frontend e os endpoints de imagem.
2. **Painel de Controle**: Manter o dashboard limpo com estatísticas de uso de armazenamento e envios.
3. **Render Server**: Configurar as variáveis de ambiente para apontar para o servidor de produção no Render (`RENDER_EXTERNAL_URL`).
4. **Armazenamento de Imagens**: Utilizar Cloudinary como storage principal, salvando apenas as referências (URL e Public ID) no banco de dados PostgreSQL.

## Checklist de Alterações Realizadas
- [x] Criação da tabela `images` no banco de dados com suporte a legendas.
- [x] Implementação de rotas de Upload via `multer` e `cloudinary`.
- [x] Nova página de Galeria no Frontend com preview em tempo real.
- [x] Integração de ícones modernos (`lucide-react`) para melhor UX.

## Próximos Passos (Para a IA)
"Baseado na estrutura atual de `api/src/routes/images.js` e `frontend/src/pages/Images.jsx`, melhore a visualização da galeria permitindo a edição das legendas sem precisar re-enviar a imagem. Além disso, verifique a conexão com o banco de dados no ambiente Render."
