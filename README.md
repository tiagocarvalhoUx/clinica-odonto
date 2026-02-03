# 🦷 Clínica Gygy - Sistema de Orçamentos Odontológicos

Sistema completo de gestão de orçamentos odontológicos desenvolvido com **Svelte**, **Tailwind CSS**, **Express.js**, **Prisma** e **MySQL**.

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)

## ✨ Características

- ✅ **Autenticação segura** com JWT
- ✅ **Gestão completa de pacientes**
- ✅ **Criação e edição de orçamentos** com múltiplos itens
- ✅ **Acompanhamento de status** de negociação
- ✅ **Histórico completo** por paciente
- ✅ **Dashboard** com estatísticas
- ✅ **Exportação para Excel** com formatação profissional
- ✅ **Interface responsiva** e moderna
- ✅ **Validação de dados** no frontend e backend
- ✅ **Tratamento de erros** robusto

## 🚀 Tecnologias

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas
- **express-validator** - Validação de dados
- **ExcelJS** - Geração de relatórios Excel

### Frontend

- **Svelte** - Framework JavaScript reativo
- **Tailwind CSS** - Framework CSS utilitário
- **Svelte Routing** - Roteamento
- **Vite** - Build tool

## 📦 Pré-requisitos

- **Node.js** >= 16.x
- **MySQL** >= 8.0
- **npm** ou **yarn**

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd clinica-gygy
```

### 2. Instale as dependências do Backend

```bash
cd backend
npm install
```

### 3. Instale as dependências do Frontend

```bash
cd frontend
npm install
```

## ⚙️ Configuração

### Backend

1. **Crie o arquivo `.env`** na pasta `backend/`:

```bash
cp .env.example .env
```

2. **Configure as variáveis de ambiente** no arquivo `.env`:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="mysql://usuario:senha@localhost:3306/clinica_gygy"

JWT_SECRET=seu_secret_key_super_seguro_aqui
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

3. **Crie o banco de dados MySQL**:

```sql
CREATE DATABASE clinica_gygy;
```

4. **Execute as migrations do Prisma**:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

5. **(Opcional) Crie um usuário admin inicial**:

```bash
# Execute este comando no MySQL ou crie via API
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@clinica.com', '$2b$10$hashedpassword', 'ADMIN');
```

### Frontend

1. **Crie o arquivo `.env`** na pasta `frontend/`:

```bash
cp .env.example .env
```

2. **Configure a URL da API** (se necessário):

```env
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Executando o Projeto

### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
clinica-gygy/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Schema do banco de dados
│   ├── src/
│   │   ├── config/                # Configurações (DB, Auth)
│   │   ├── controllers/           # Controllers da API
│   │   ├── services/              # Lógica de negócio
│   │   ├── routes/                # Rotas da API
│   │   ├── middlewares/           # Middlewares (Auth, Errors)
│   │   ├── validators/            # Validadores de dados
│   │   └── app.js                 # Configuração do Express
│   ├── server.js                  # Ponto de entrada
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/            # Componentes reutilizáveis
    │   ├── pages/                 # Páginas da aplicação
    │   ├── stores/                # Svelte stores (estado global)
    │   ├── services/              # Services para API
    │   ├── App.svelte             # Componente raiz
    │   ├── main.js                # Ponto de entrada
    │   └── app.css                # Estilos globais
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint             | Descrição              | Auth |
| ------ | -------------------- | ---------------------- | ---- |
| POST   | `/api/auth/register` | Registrar novo usuário | Não  |
| POST   | `/api/auth/login`    | Login                  | Não  |
| GET    | `/api/auth/profile`  | Obter perfil           | Sim  |

### Pacientes

| Método | Endpoint            | Descrição                 | Auth |
| ------ | ------------------- | ------------------------- | ---- |
| GET    | `/api/patients`     | Listar todos os pacientes | Sim  |
| GET    | `/api/patients/:id` | Obter paciente por ID     | Sim  |
| POST   | `/api/patients`     | Criar novo paciente       | Sim  |
| PUT    | `/api/patients/:id` | Atualizar paciente        | Sim  |
| DELETE | `/api/patients/:id` | Excluir paciente          | Sim  |

### Orçamentos

| Método | Endpoint                          | Descrição                        | Auth |
| ------ | --------------------------------- | -------------------------------- | ---- |
| GET    | `/api/budgets`                    | Listar todos os orçamentos       | Sim  |
| GET    | `/api/budgets/:id`                | Obter orçamento por ID           | Sim  |
| GET    | `/api/budgets/patient/:patientId` | Listar orçamentos de um paciente | Sim  |
| POST   | `/api/budgets`                    | Criar novo orçamento             | Sim  |
| PUT    | `/api/budgets/:id`                | Atualizar orçamento              | Sim  |
| PATCH  | `/api/budgets/:id/status`         | Atualizar status                 | Sim  |
| DELETE | `/api/budgets/:id`                | Excluir orçamento                | Sim  |

## 💡 Funcionalidades

### 1. **Autenticação**

- Login seguro com email e senha
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração configurável
- Proteção de rotas por autenticação

### 2. **Gestão de Pacientes**

- Cadastro de pacientes com nome, telefone e email
- Listagem com contador de orçamentos
- Edição e exclusão de pacientes
- Visualização detalhada com histórico de orçamentos

### 3. **Gestão de Orçamentos**

- Criação de orçamentos com múltiplos itens
- Cálculo automático do valor total
- Três status: Em Negociação, Aceito, Recusado
- Adição de observações sobre a negociação
- Edição de itens e valores
- Histórico completo por paciente

### 4. **Dashboard**

- Estatísticas gerais do sistema
- Contadores de orçamentos por status
- Total de pacientes cadastrados
- Lista de orçamentos recentes

### 5. **Interface**

- Design responsivo (mobile-first)
- Feedback visual de ações (notificações)
- Modais para criação e edição
- Tabelas com ordenação
- Cores e badges indicativos de status

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Validação de dados no backend
- ✅ Proteção contra SQL Injection (Prisma)
- ✅ CORS configurado
- ✅ Variáveis de ambiente para dados sensíveis

## 📝 Scripts Disponíveis

### Backend

```bash
npm run dev        # Inicia servidor em modo desenvolvimento
npm start          # Inicia servidor em modo produção
npm run prisma:generate  # Gera o Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre Prisma Studio
```

### Frontend

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

## 🎯 Próximos Passos (Funcionalidades Futuras)

- [ ] Envio de orçamentos por WhatsApp/Email
- [ ] Exportação de orçamentos em PDF
- [ ] Dashboard com gráficos e métricas
- [ ] Notificações automáticas
- [ ] Sistema de agendamentos
- [ ] Histórico de alterações
- [ ] Backup automático

## 📄 Licença

Este projeto está sob a licença ISC.

## 👥 Autor

Desenvolvido para Clínica Gygy

---

**Desenvolvido com ❤️ usando Svelte, Express e Prisma**
