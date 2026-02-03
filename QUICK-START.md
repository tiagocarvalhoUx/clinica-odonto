# 🚀 Setup Rápido - Criar Login

## Passo 1: Criar as Tabelas no Banco

Abra o MySQL Workbench ou linha de comando do MySQL e execute:

```sql
CREATE DATABASE IF NOT EXISTS clinica_gygy;
USE clinica_gygy;
```

Depois execute o arquivo `setup-database.sql` ou copie e cole o conteúdo dele no MySQL.

**OU** execute via linha de comando:

```bash
mysql -u root -p < setup-database.sql
```

## Passo 2: Criar Usuários de Login

No terminal do backend, execute:

```bash
npm run create-user
```

Isso vai criar 2 usuários:

### 👤 **ADMINISTRADOR**

- **Email:** `admin@clinica.com`
- **Senha:** `admin123`

### 👤 **FUNCIONÁRIA**

- **Email:** `funcionaria@clinica.com`
- **Senha:** `funcionaria123`

## Passo 3: Iniciar o Backend

```bash
npm run dev
```

Aguarde a mensagem: `🚀 Server running on port 3000`

## Passo 4: Iniciar o Frontend

Abra OUTRO terminal na pasta frontend:

```bash
cd ..\frontend
npm run dev
```

## Passo 5: Fazer Login

1. Acesse no navegador: **http://localhost:5173**
2. Na tela de login, use:
   - **Email:** `admin@clinica.com`
   - **Senha:** `admin123`
3. Clique em **Entrar**

## ✅ Pronto!

Você estará logado e poderá usar o sistema!

---

## 🆘 Se der erro na criação do usuário

Execute manualmente no MySQL:

```sql
USE clinica_gygy;

-- Criar admin (senha: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@clinica.com', '$2b$10$YourHashedPassword', 'ADMIN');

-- Criar funcionária (senha: funcionaria123)
INSERT INTO users (name, email, password, role)
VALUES ('Maria Funcionária', 'funcionaria@clinica.com', '$2b$10$YourHashedPassword', 'FUNCIONARIA');
```

Mas é melhor usar o script `npm run create-user` que já criptografa as senhas corretamente!
