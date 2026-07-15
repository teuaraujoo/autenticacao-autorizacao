# Autenticação e Autorização

Este repositório contém uma API de estudo/desafio para autenticação e autorização em Node.js com TypeScript, Express, Prisma e MySQL. O projeto implementa cadastro de usuários, login com JWT, refresh token, proteção de rotas e envio de e-mails de confirmação em background.

## Visão geral

A aplicação foi pensada como uma API backend para gerenciar autenticação de usuários com fluxo completo de:

- cadastro de usuários
- login com validação de credenciais
- emissão de access token e refresh token
- renovação de token via refresh token
- logout com revogação do refresh token
- confirmação de e-mail
- envio de e-mail assíncrono usando fila e worker.

## O que o projeto faz

### Funcionalidades implementadas

- Cadastro de usuários com validação de senha e e-mail
- Login com verificação de senha via bcrypt
- Geração e armazenamento de refresh tokens no banco
- Proteção de rotas por middleware de access token
- Renovação de access token com refresh token
- Logout e revogação de refresh token
- Confirmação de e-mail via endpoint específico
- Envio de e-mails de confirmação em fila com BullMQ + Redis
- Rate limiting nas rotas de login
- Cache para informações de me
- Middleware global de tratamento de erros

## Stack principal

- Node.js 22
- TypeScript
- Express
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcrypt
- Zod para validação
- BullMQ + Redis para filas
- Resend para envio de e-mails
- Helmet, compression, cookie-parser, express-rate-limit

## Arquitetura

A API segue uma estrutura modular, com separação entre:

- rotas
- controllers
- services
- repositories
- middlewares
- lib/helpers
- workers/queues

### Fluxo principal de autenticação

1. O usuário cria uma conta via endpoint de cadastro.
2. O sistema cria o usuário e enfileira um job para enviar e-mail de confirmação.
3. O usuário realiza login.
4. A API gera:
   - um access token para autenticação curta
   - um refresh token para renovação
5. Os tokens são enviados via cookies HTTP-only.
6. Rotas protegidas validam o access token com middleware.
7. O refresh token pode renovar o access token ou ser revogado no logout.

## Estrutura do projeto

```text
api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── database/
│   ├── error/
│   ├── lib/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   └── users/
│   ├── queues/
│   ├── workers/
│   │   └── email/
│   └── index.ts
```

## Endpoints principais

### Saúde da API

- GET /health

### Usuários

- POST /api/users
  - Cria um novo usuário

### Autenticação

- POST /api/login
- POST /api/logout
- POST /api/refresh
- GET /api/me
- GET /api/confirm-email/:userId

## Modelos de dados

O banco utiliza Prisma com os seguintes modelos principais:

- USERS
  - ID
  - NAME
  - EMAIL
  - PASSWORD_HASH
  - IS_ACTIVE
  - EMAIL_VERIFY
  - CREATED_AT
  - UPDATED_AT

- REFRESH_TOKENS
  - ID
  - USER_ID
  - TOKEN_HASH
  - EXPIRES_AT
  - REVOKED_AT
  - CREATED_AT

## Variáveis de ambiente

Crie um arquivo .env na pasta api com as seguintes variáveis:

```env
NODE_ENV=development
PORT=3000

DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=seu-banco
DATABASE_URL=mysql://usuario:senha@host:3306/banco

JWT_SECRET=seu-segredo-jwt

REDIS_URL=redis://localhost:6379

RESEND_API_KEY=sua-chave-resend
RESEND_FROM_EMAIL=seu-email-verificado@resend.com
API_URL=http://localhost:3000
```

## Como rodar localmente

### 1. Instale as dependências

```bash
cd api
yarn install
```

### 2. Configure o banco de dados

```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Inicie a API

```bash
yarn dev
```

### 4. Inicie o worker de e-mail

Em outro terminal:

```bash
cd api
yarn worker
```

## Scripts disponíveis

No package.json, os principais scripts são:

```bash
yarn dev        # inicia a API em modo desenvolvimento
yarn build      # compila TypeScript
yarn typecheck  # valida tipos
yarn worker     # inicia o worker de e-mail
yarn start      # executa a build compilada
```

## Integrações externas

### Banco de dados

- MySQL hospedado em Aiven
- conexão feita via Prisma com adapter MariaDB

### Redis / filas

- BullMQ usa Redis para enfileirar e processar tarefas assíncronas
- o worker de e-mail consome os jobs da fila "emails"
- Redis é usado para guardar informações do endpoint api/me em cache (aprendizado)

### Envio de e-mail

- Resend é usado para envio real de e-mail
- o fluxo de confirmação de conta é disparado no cadastro do usuário

## Deploy

O projeto conta com uma **pipeline CI/CD** utilizando **GitHub Actions**. Cada push para a branch **main** dispara a pipeline responsável por instalar as dependências, gerar o Prisma Client, validar o código com TypeScript, compilar a aplicação e, somente após todas as etapas serem concluídas com sucesso, realizar o deploy automático através do **Deploy Hook do Render**.

## Observações importantes

- A autenticação é baseada em cookies HTTP-only para access e refresh tokens.
- O projeto usa JWT simples e armazenamento de refresh tokens no banco para fins didáticos.
- A autorização atual é basicamente a proteção de rotas autenticadas; não há implementação completa de papéis ou permissões.
- O projeto é bem adequado para estudar fluxos de login, refresh token, filas assíncronas e integração com serviços externos.
