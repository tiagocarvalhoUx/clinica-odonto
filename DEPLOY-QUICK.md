# 🚀 Deploy Rápido - Vercel CLI

## Instalar Vercel CLI

```bash
npm i -g vercel
```

## Deploy Frontend

```bash
cd frontend
vercel --prod

# Adicionar variável de ambiente após deploy
vercel env add VITE_API_URL
# Cole a URL do backend: https://seu-backend.vercel.app/api
```

## Deploy Backend

```bash
cd backend
vercel --prod

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
# Cole sua connection string MySQL

vercel env add JWT_SECRET
# Cole sua chave secreta (gerar com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

vercel env add CORS_ORIGIN
# Cole a URL do frontend: https://seu-frontend.vercel.app

vercel env add NODE_ENV
# Digite: production
```

## Atualizar e Redeployar

```bash
# Frontend
cd frontend
vercel --prod

# Backend
cd backend
vercel --prod
```

Pronto! Acesse seu app em: https://seu-frontend.vercel.app
