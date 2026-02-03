# 🚀 Guia de Deploy - Clínica Gygy

Este guia explica como fazer deploy do sistema na Vercel (frontend e backend).

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com) (recomendado)
- Database MySQL hospedado (Railway, PlanetScale, Render, etc.)

## 🗄️ 1. Configurar Database em Produção

### Opções de Hospedagem MySQL:

#### **Opção A: Railway** (Recomendado - Fácil e gratuito)

1. Acesse [Railway.app](https://railway.app)
2. Crie novo projeto → Add MySQL
3. Copie a connection string no formato:
   ```
   mysql://user:password@containers-us-west-123.railway.app:6789/railway
   ```

#### **Opção B: PlanetScale** (MySQL serverless - Grátis 5GB)

1. Acesse [PlanetScale](https://planetscale.com)
2. Crie database → Copie connection string
3. Formato:
   ```
   mysql://user:password@aws.connect.psdb.cloud/dbname?sslaccept=strict
   ```

#### **Opção C: Render** (Grátis com limitações)

1. Acesse [Render.com](https://render.com)
2. New → PostgreSQL ou MySQL
3. Copie connection string

### 🔧 Executar Migrations no Database de Produção

1. Atualize `.env` do backend com DATABASE_URL de produção
2. Execute:

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

3. Crie usuários iniciais:
   ```bash
   node create-user.js
   ```

## 🎨 2. Deploy do Frontend na Vercel

### Via GitHub (Recomendado)

1. **Criar repositório no GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/clinica-gygy.git
   git push -u origin main
   ```

2. **Importar projeto na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Click em "Add New Project"
   - Selecione seu repositório do GitHub
   - Configure:
     - **Root Directory:** `frontend`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Variáveis de Ambiente:**
   Não são necessárias para o frontend (API URL será configurada depois)

4. **Deploy:**
   - Click em "Deploy"
   - Aguarde build finalizar
   - Copie a URL: `https://seu-app.vercel.app`

### Via CLI da Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Na pasta frontend
cd frontend
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Seu usuário
# - Link to existing project? No
# - Project name? clinica-gygy-frontend
# - Directory? ./
# - Override settings? No

# Deploy para produção
vercel --prod
```

## 🔧 3. Deploy do Backend na Vercel

### Via GitHub

1. **Importar projeto na Vercel:**
   - New Project → Mesmo repositório
   - Configure:
     - **Root Directory:** `backend`
     - **Framework Preset:** Other
     - **Build Command:** `npm install && npx prisma generate`
     - **Output Directory:** deixe vazio

2. **Variáveis de Ambiente (IMPORTANTE!):**

   Adicione em Settings → Environment Variables:

   ```
   DATABASE_URL=mysql://user:password@host:port/database
   JWT_SECRET=sua_chave_secreta_jwt_muito_segura
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://seu-frontend.vercel.app
   NODE_ENV=production
   ```

3. **Deploy:**
   - Click em "Deploy"
   - Copie a URL: `https://seu-backend.vercel.app`

### Via CLI

```bash
cd backend
vercel

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add CORS_ORIGIN
vercel env add NODE_ENV

# Deploy para produção
vercel --prod
```

## 🔗 4. Conectar Frontend ao Backend

1. **Atualizar URL da API no Frontend:**

   Edite `frontend/src/services/api.js`:

   ```javascript
   const API_URL =
     import.meta.env.VITE_API_URL || "https://seu-backend.vercel.app";
   ```

2. **Adicionar variável de ambiente no Frontend:**

   Vercel → Frontend Project → Settings → Environment Variables:

   ```
   VITE_API_URL=https://seu-backend.vercel.app
   ```

3. **Atualizar CORS no Backend:**

   Vercel → Backend Project → Settings → Environment Variables:

   ```
   CORS_ORIGIN=https://seu-frontend.vercel.app
   ```

4. **Redeployar ambos:**
   ```bash
   # Ou fazer commit no GitHub que auto-deploya
   git add .
   git commit -m "Update API URLs"
   git push
   ```

## 📱 5. Testar Aplicação

1. Acesse `https://seu-frontend.vercel.app`
2. Faça login com:
   - **Email:** admin@clinica.com
   - **Senha:** admin123

3. Teste as funcionalidades:
   - ✅ Login
   - ✅ Dashboard
   - ✅ Criar paciente
   - ✅ Criar orçamento
   - ✅ Exportar Excel

## 🔒 6. Segurança Pós-Deploy

1. **Trocar JWT_SECRET:**

   ```bash
   # Gerar nova chave
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Atualizar senhas dos usuários**

3. **Configurar domínio customizado (opcional):**
   - Vercel → Settings → Domains
   - Adicionar seu domínio (ex: clinica-gygy.com.br)

## 🔄 7. CI/CD Automático

Com GitHub conectado, cada push na branch `main` faz deploy automático!

```bash
git add .
git commit -m "Nova feature"
git push
# 🚀 Deploy automático iniciado!
```

## 🐛 8. Troubleshooting

### Erro: "Invalid `prisma.xxx.findMany()` invocation"

- Verifique DATABASE_URL nas variáveis de ambiente
- Execute `npx prisma generate` no projeto

### Erro: CORS

- Verifique CORS_ORIGIN no backend
- URL deve ser exatamente como aparece no navegador

### Erro: 500 Internal Server Error

- Check logs: Vercel → Project → Deployments → View Function Logs
- Verifique variáveis de ambiente

### Build Failed

- Verifique package.json tem todas as dependências
- Root Directory está correto?

## 📊 9. Monitoramento

- **Logs:** Vercel Dashboard → Deployments → Logs
- **Analytics:** Vercel Analytics (grátis)
- **Uptime:** Vercel → Project → Settings → Monitoring

## 💡 10. Alternativas ao Deploy Backend na Vercel

Se preferir hospedar o backend separadamente:

### Railway (Recomendado)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login e deploy
railway login
cd backend
railway init
railway up
```

### Render

1. Acesse render.com
2. New → Web Service
3. Connect GitHub
4. Configure e deploy

---

## 📝 Checklist de Deploy

- [ ] Database MySQL em produção configurado
- [ ] Migrations executadas no database de produção
- [ ] Usuários criados no database
- [ ] Frontend deployed na Vercel
- [ ] Backend deployed na Vercel (ou Railway/Render)
- [ ] Variáveis de ambiente configuradas
- [ ] CORS_ORIGIN atualizado
- [ ] API_URL atualizado no frontend
- [ ] Teste de login funcionando
- [ ] Teste de criação de paciente
- [ ] Teste de criação de orçamento
- [ ] Teste de export Excel
- [ ] JWT_SECRET trocado para produção
- [ ] Domínio customizado configurado (opcional)

---

## 🎉 Pronto!

Seu sistema está no ar! 🚀

**URLs importantes:**

- Frontend: https://seu-frontend.vercel.app
- Backend: https://seu-backend.vercel.app
- API Health: https://seu-backend.vercel.app/health

**Suporte:**

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Prisma Docs](https://www.prisma.io/docs)
