# 🚀 Deploy das Alterações - Modelo Dentista

Este guia explica como aplicar as alterações do banco de dados em produção.

## 📋 Resumo das Alterações

- ✅ Novo modelo `Dentist` (tabela `dentists`)
- ✅ Relação entre `Budget` e `Dentist` (coluna `dentist_id`)
- ✅ Todas as APIs e frontend atualizados

---

## 🛠️ Opção 1: Aplicar Migration via Prisma DB Push (Recomendado)

Esta é a forma mais segura para ambientes serverless como Vercel.

### Passo 1: Backup do Banco (IMPORTANTE!)
Antes de qualquer alteração, faça backup do seu banco de dados MySQL.

### Passo 2: Configurar Variável de Ambiente Local
```bash
# No arquivo backend/.env, certifique-se que DATABASE_URL aponta para produção
DATABASE_URL="mysql://user:password@host:port/database"
```

### Passo 3: Aplicar Migration
```bash
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Aplicar alterações no banco (CREATE TABLE dentists, ALTER TABLE budgets)
npx prisma db push
```

> ⚠️ **Atenção:** `db push` vai criar a tabela e adicionar a coluna diretamente. É irreversível.

---

## 🛠️ Opção 2: Executar SQL Manualmente

Se preferir executar o SQL manualmente no console do seu provedor de banco (Railway, PlanetScale, etc.):

### SQL para Executar:

```sql
-- Create Dentists table
CREATE TABLE `dentists` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `cro` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `specialty` VARCHAR(100) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    
    UNIQUE INDEX `dentists_cro_key`(`cro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add dentist_id column to budgets table
ALTER TABLE `budgets` ADD COLUMN `dentist_id` INT NULL;

-- Add foreign key constraint
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_dentist_id_fkey` 
    FOREIGN KEY (`dentist_id`) REFERENCES `dentists`(`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Create index for better performance
CREATE INDEX `budgets_dentist_id_idx` ON `budgets`(`dentist_id`);
```

### Onde Executar:

#### Railway:
1. Acesse [railway.app](https://railway.app)
2. Selecione seu projeto → Database MySQL
3. Aba "Query" ou "Data"
4. Cole e execute o SQL acima

#### PlanetScale:
1. Acesse [planetscale.com](https://planetscale.com)
2. Selecione seu database
3. Console → New Query
4. Cole e execute o SQL acima

---

## 📤 Deploy na Vercel

### Passo 1: Commit das Alterações
```bash
# Adicionar todos os arquivos modificados
git add .

# Commit
git commit -m "feat: add dentist management to budgets

- Add Dentist model with CRO, specialty, contact info
- Update Budget model to include dentist relation
- Create dentist API endpoints (CRUD)
- Add dentist selection in budget form
- Include dentist info in Excel export
- Update budget detail to show dentist"

# Push para GitHub
git push origin main
```

### Passo 2: Deploy Automático
Com GitHub conectado à Vercel, o deploy será automático após o push!

Verifique em:
- Dashboard Vercel → seu projeto → Deployments

---

## ✅ Verificação Pós-Deploy

### 1. Testar API de Dentistas
```bash
# Listar dentistas (deve retornar array vazio inicialmente)
curl https://seu-backend.vercel.app/api/dentists \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 2. Criar Primeiro Dentista
```bash
curl -X POST https://seu-backend.vercel.app/api/dentists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Dr. João Silva",
    "cro": "12345-SP",
    "specialty": "Ortodontia",
    "phone": "(11) 98765-4321",
    "email": "joao@clinica.com"
  }'
```

### 3. Testar Criação de Orçamento
1. Acesse o frontend
2. Vá em "Novo Orçamento"
3. Selecione um paciente
4. **Selecione ou crie um dentista** ← Nova funcionalidade!
5. Adicione itens e salve

### 4. Verificar Excel
1. Exporte o relatório de orçamentos
2. Verifique as colunas "Dentista" e "CRO"

---

## 🐛 Troubleshooting

### Erro: "The table `dentists` does not exist"
**Solução:** A migration não foi aplicada. Execute `npx prisma db push` local com DATABASE_URL de produção.

### Erro: "Unknown column `dentist_id`"
**Solução:** A coluna não foi adicionada à tabela budgets. Verifique a migration.

### Erro: "Foreign key constraint fails"
**Solução:** Verifique se a tabela dentists foi criada antes de adicionar a FK em budgets.

### Erro: "Prisma Client requires `prisma generate`"
**Solução:** O build na Vercel deve incluir `prisma generate`. Verifique se `vercel.json` está correto:
```json
{
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

E `package.json` deve ter:
```json
"scripts": {
  "postinstall": "prisma generate",
  ...
}
```

---

## 📊 Checklist Final

- [ ] Backup do banco feito
- [ ] Migration aplicada (`db push` ou SQL manual)
- [ ] Código commitado no GitHub
- [ ] Deploy na Vercel concluído
- [ ] API de dentistas respondendo
- [ ] Form de orçamento mostrando seção de dentista
- [ ] Excel export incluindo colunas de dentista

---

## 🎯 Próximos Passos

Após o deploy, considere:
1. Cadastrar os dentistas da clínica
2. Atualizar orçamentos antigos (se desejar)
3. Treinar usuários sobre a nova funcionalidade

**Suporte:** Se tiver problemas, verifique os logs na Vercel Dashboard → Functions.
