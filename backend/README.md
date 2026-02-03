# Backend - Clínica Gygy

API REST para o sistema de orçamentos odontológicos.

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://usuario:senha@localhost:3306/clinica_gygy"
JWT_SECRET=seu_secret_key_aqui
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Banco de Dados

1. Crie o banco de dados:

```sql
CREATE DATABASE clinica_gygy;
```

2. Execute as migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

3. (Opcional) Abra o Prisma Studio para visualizar os dados:

```bash
npm run prisma:studio
```

### Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Documentação da API

### Health Check

```
GET /health
```

### Autenticação

#### Registrar

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@clinica.com",
  "password": "senha123",
  "role": "FUNCIONARIA"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "maria@clinica.com",
  "password": "senha123"
}
```

#### Perfil

```
GET /api/auth/profile
Authorization: Bearer {token}
```

### Pacientes

#### Listar todos

```
GET /api/patients
Authorization: Bearer {token}
```

#### Obter por ID

```
GET /api/patients/:id
Authorization: Bearer {token}
```

#### Criar

```
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "(11) 98765-4321",
  "email": "joao@email.com"
}
```

#### Atualizar

```
PUT /api/patients/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Santos",
  "phone": "(11) 98765-4321"
}
```

#### Excluir

```
DELETE /api/patients/:id
Authorization: Bearer {token}
```

### Orçamentos

#### Listar todos

```
GET /api/budgets
Authorization: Bearer {token}
```

#### Obter por ID

```
GET /api/budgets/:id
Authorization: Bearer {token}
```

#### Listar por paciente

```
GET /api/budgets/patient/:patientId
Authorization: Bearer {token}
```

#### Criar

```
POST /api/budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": 1,
  "items": [
    {
      "description": "Limpeza dentária",
      "price": 150.00
    },
    {
      "description": "Restauração",
      "price": 250.00
    }
  ],
  "notes": "Paciente solicitou desconto"
}
```

#### Atualizar

```
PUT /api/budgets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "description": "Limpeza dentária",
      "price": 150.00
    }
  ],
  "notes": "Orçamento revisado"
}
```

#### Atualizar Status

```
PATCH /api/budgets/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "ACEITO"
}
```

Status válidos: `EM_NEGOCIACAO`, `ACEITO`, `RECUSADO`

#### Excluir

```
DELETE /api/budgets/:id
Authorization: Bearer {token}
```

## 🏗️ Arquitetura

O backend segue a arquitetura MVC com camada de Services:

- **Controllers**: Gerenciam requisições HTTP
- **Services**: Contêm a lógica de negócio
- **Models**: Definidos no Prisma Schema
- **Middlewares**: Autenticação e tratamento de erros
- **Validators**: Validação de entrada de dados

## 🔒 Segurança

- Senhas criptografadas com bcrypt (10 rounds)
- Autenticação via JWT
- Validação de dados com express-validator
- Proteção contra SQL Injection via Prisma
- CORS configurado

## 📦 Dependências Principais

- **express**: Framework web
- **@prisma/client**: ORM para MySQL
- **jsonwebtoken**: Geração de tokens JWT
- **bcrypt**: Criptografia de senhas
- **express-validator**: Validação de dados
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Gerenciamento de variáveis de ambiente

## 🛠️ Scripts

```bash
npm run dev              # Desenvolvimento com nodemon
npm start                # Produção
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre Prisma Studio
```

## 📝 Notas

- O token JWT expira em 7 dias por padrão
- Todas as rotas (exceto auth) requerem autenticação
- Os timestamps são gerados automaticamente
- Exclusões de pacientes/orçamentos são em cascata
