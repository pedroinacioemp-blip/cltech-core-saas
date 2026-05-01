# CL TECH CORE Mobile

Aplicativo mobile (React Native + Expo) para se conectar ao backend do CL TECH CORE.

## Requisitos
- Node.js 18+
- Expo CLI
- Yarn (opcional)

## Instalação

```bash
cd mobile
npm install
```

## Execução

```bash
npm run start
```

Após abrir o QR code com o Expo Go (Android/iOS), o app iniciará.

## Configuração do backend

No arquivo `App.js`, configure:

```js
const API_BASE_URL = 'https://cl-tech-core-backend.onrender.com/api';
```

## Funcionalidade atual

- Login (POST `/api/auth/login`)
- Exibe status de autenticação e token

## Próximos passos

- Registro de usuário
- CRUD de projetos e arquivos
- Compilação remota (C++/Java)
- Histórico de execuções
