# 📋 Guia Rápido: Testes e CI/CD

## 🚀 Início Rápido

### Backend

```bash
cd backend
npm install
npm test                # Executar testes
npm run test:coverage   # Com cobertura
```

### Frontend

```bash
cd frontend
npm install
npm test                # Executar testes
npm run test:ui         # Interface interativa
```

## 📊 O que foi implementado

### ✅ Testes Automatizados

#### Backend (Jest + Supertest)

- ✓ Testes de autenticação (login/register)
- ✓ Testes de API de pacientes
- ✓ Testes de API de orçamentos
- ✓ Mocks do Prisma Client
- ✓ Cobertura de código

#### Frontend (Vitest + Testing Library)

- ✓ Testes de componentes (Login, Navbar, Loading)
- ✓ Testes de stores (authStore)
- ✓ Mocks de localStorage e fetch
- ✓ Ambiente jsdom

### ✅ CI/CD (GitHub Actions)

#### Pipeline Principal

- ✓ Testes automáticos em cada push
- ✓ Matriz de testes (Node 18.x e 20.x)
- ✓ Deploy automático para Vercel (main)
- ✓ Scan de segurança
- ✓ Relatórios de cobertura

#### Workflows Adicionais

- ✓ Checks automáticos em Pull Requests
- ✓ Verificação semanal de dependências
- ✓ Comentários automáticos em PRs

## 📁 Arquivos Criados

```
clinica-gygy/
├── .github/workflows/
│   ├── ci-cd.yml              # Pipeline principal
│   ├── pr-checks.yml          # Verificação de PRs
│   └── dependency-check.yml   # Atualização de deps
├── backend/
│   ├── __tests__/
│   │   ├── auth.test.js
│   │   ├── budget.test.js
│   │   └── patient.test.js
│   ├── jest.config.js
│   ├── jest.setup.js
│   └── .env.test
├── frontend/
│   ├── src/__tests__/
│   │   ├── setup.js
│   │   ├── Login.test.js
│   │   ├── Navbar.test.js
│   │   ├── Loading.test.js
│   │   └── authStore.test.js
│   └── vitest.config.js
├── TESTING.md                 # Guia completo de testes
├── CI-CD.md                   # Guia completo de CI/CD
└── .gitignore                 # Atualizado
```

## 🎯 Próximos Passos

### 1. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Executar Testes Localmente

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### 3. Configurar GitHub Actions

Para habilitar deploy automático:

1. **Criar conta na Vercel** (se ainda não tiver)
2. **Obter credenciais:**

   ```bash
   npm i -g vercel
   vercel login
   cd backend && vercel link
   cd ../frontend && vercel link
   ```

3. **Adicionar Secrets no GitHub:**
   - Vá em: `Settings` → `Secrets and variables` → `Actions`
   - Adicione:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID_BACKEND`
     - `VERCEL_PROJECT_ID_FRONTEND`

### 4. Push para GitHub

```bash
git add .
git commit -m "feat: adicionar testes automatizados e CI/CD"
git push origin main
```

Os workflows serão executados automaticamente! 🎉

## 📖 Documentação Completa

- **[TESTING.md](./TESTING.md)** - Guia detalhado de testes
- **[CI-CD.md](./CI-CD.md)** - Guia detalhado de CI/CD

## 🔧 Comandos Úteis

### Backend

```bash
npm test                  # Executar testes
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

### Frontend

```bash
npm test                 # Executar testes
npm run test:ui          # UI interativa
npm run test:coverage    # Com cobertura
```

### CI/CD

```bash
# Ver status dos workflows
gh workflow list         # (requer GitHub CLI)

# Executar workflow manualmente
gh workflow run "CI/CD Pipeline"
```

## ✨ Recursos

- 🧪 **Testes Unitários**: Cobertura de código
- 🔄 **Integração Contínua**: Testes automáticos
- 🚀 **Deploy Automático**: Vercel em cada push
- 🔒 **Segurança**: Scan de vulnerabilidades
- 📊 **Relatórios**: Cobertura e qualidade

## 🐛 Problemas Comuns

### Testes não executam?

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### CI/CD não executa?

- Verifique se os secrets estão configurados
- Confirme que está na branch correta (main/develop)
- Verifique permissões do GitHub Actions

### Deploy falha?

- Teste o build localmente primeiro
- Verifique as credenciais da Vercel
- Consulte logs na aba Actions

## 🎓 Aprender Mais

- [Jest](https://jestjs.io/) - Framework de testes
- [Vitest](https://vitest.dev/) - Testes para Vite
- [GitHub Actions](https://docs.github.com/actions) - CI/CD
- [Vercel](https://vercel.com/docs) - Deploy

---

**Pronto para começar!** Execute `npm test` e veja a mágica acontecer! ✨
