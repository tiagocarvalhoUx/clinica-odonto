# 🚀 Guia de Configuração Inicial

Siga este passo a passo para configurar o sistema pela primeira vez.

## 1️⃣ Configurar Banco de Dados MySQL

### Opção A: Se você já tem MySQL instalado

Abra o MySQL e execute:

```sql
CREATE DATABASE clinica_gygy;
```

### Opção B: Se você NÃO tem MySQL instalado

**Windows:**

1. Baixe o MySQL em: https://dev.mysql.com/downloads/installer/
2. Instale escolhendo "Developer Default"
3. Durante a instalação, defina uma senha para o usuário root
4. Após instalar, abra o MySQL Workbench e crie o banco:
   ```sql
   CREATE DATABASE clinica_gygy;
   ```

## 2️⃣ Configurar o arquivo .env

Edite o arquivo `backend/.env` e configure a URL do banco:

```env
# Se você usa usuário "root" e senha "suasenha":
DATABASE_URL="mysql://root:suasenha@localhost:3306/clinica_gygy"

# Exemplo com usuário diferente:
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/clinica_gygy"
```

**⚠️ IMPORTANTE:** Substitua `suasenha` pela senha que você definiu no MySQL!

## 3️⃣ Instalar Dependências

Abra o terminal na pasta `backend`:

```bash
cd backend
npm install
```

## 4️⃣ Executar Migrations (Criar Tabelas)

Ainda na pasta `backend`, execute:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Quando perguntar o nome da migration, digite: `init`

## 5️⃣ Criar Usuário Inicial

Execute o script para criar os usuários padrão:

```bash
npm run create-user
```

Isso criará 2 usuários:

**👤 ADMINISTRADOR:**

- Email: `admin@clinica.com`
- Senha: `admin123`

**👤 FUNCIONÁRIA:**

- Email: `funcionaria@clinica.com`
- Senha: `funcionaria123`

## 6️⃣ Iniciar o Backend

```bash
npm run dev
```

O servidor estará rodando em: http://localhost:3000

## 7️⃣ Configurar e Iniciar o Frontend

Abra OUTRO terminal na pasta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará em: http://localhost:5173

## 8️⃣ Fazer Login

1. Acesse: http://localhost:5173
2. Use uma das credenciais criadas:
   - Email: `admin@clinica.com`
   - Senha: `admin123`

## ✅ Pronto!

Agora você já pode usar o sistema completo!

---

## 🆘 Problemas Comuns

### Erro: "Can't connect to MySQL server"

- ✅ Verifique se o MySQL está rodando
- ✅ Confira usuário e senha no arquivo .env
- ✅ Teste a conexão no MySQL Workbench

### Erro: "Unknown database 'clinica_gygy'"

- ✅ Crie o banco de dados:
  ```sql
  CREATE DATABASE clinica_gygy;
  ```

### Erro ao executar migrations

- ✅ Verifique se a DATABASE_URL está correta
- ✅ Execute: `npx prisma db push` como alternativa

### Porta 3000 ou 5173 já em uso

- ✅ Feche outros processos ou mude a porta no .env
