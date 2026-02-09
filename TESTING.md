# 🧪 Guia de Testes Automatizados

## Visão Geral

Este projeto possui testes automatizados implementados tanto para o backend (Node.js/Express) quanto para o frontend (Svelte).

## Backend - Testes com Jest

### Estrutura de Testes

```
backend/
├── __tests__/              # Diretório de testes
│   ├── auth.test.js        # Testes de autenticação
│   ├── budget.test.js      # Testes de orçamentos
│   └── patient.test.js     # Testes de pacientes
├── jest.config.js          # Configuração do Jest
├── jest.setup.js           # Setup global dos testes
└── .env.test               # Variáveis de ambiente para testes
```

### Executar Testes do Backend

```bash
cd backend

# Instalar dependências (primeira vez)
npm install

# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Tecnologias Utilizadas

- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP
- **Mocks**: Prisma Client mockado para isolar testes

## Frontend - Testes com Vitest

### Estrutura de Testes

```
frontend/
├── src/
│   └── __tests__/              # Diretório de testes
│       ├── setup.js            # Configuração global
│       ├── Login.test.js       # Testes da página de login
│       ├── Navbar.test.js      # Testes do navbar
│       ├── Loading.test.js     # Testes do componente loading
│       └── authStore.test.js   # Testes do store de autenticação
└── vitest.config.js            # Configuração do Vitest
```

### Executar Testes do Frontend

```bash
cd frontend

# Instalar dependências (primeira vez)
npm install

# Executar todos os testes
npm test

# Executar testes com UI interativa
npm run test:ui

# Executar testes com cobertura
npm run test:coverage
```

### Tecnologias Utilizadas

- **Vitest**: Framework de testes rápido e moderno
- **Testing Library**: Testes de componentes Svelte
- **jsdom**: Simulação do ambiente DOM

## Cobertura de Testes

Os relatórios de cobertura são gerados em:
- Backend: `backend/coverage/`
- Frontend: `frontend/coverage/`

Para visualizar a cobertura em HTML:
- Backend: Abra `backend/coverage/lcov-report/index.html`
- Frontend: Abra `frontend/coverage/index.html`

## Boas Práticas

### Escrevendo Testes

1. **Teste o comportamento, não a implementação**
2. **Use nomes descritivos** para os testes
3. **Arrange-Act-Assert**: Organize seus testes em três seções
4. **Teste casos de sucesso e erro**
5. **Mantenha testes isolados** e independentes

### Exemplo de Teste Backend

```javascript
describe('POST /api/auth/login', () => {
  test('deve retornar erro quando credenciais não fornecidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
```

### Exemplo de Teste Frontend

```javascript
describe('Login Component', () => {
  it('deve renderizar o formulário de login', () => {
    render(Login);
    
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
```

## Mocks e Stubs

### Backend
- **Prisma Client**: Mockado no `jest.setup.js`
- **Variáveis de Ambiente**: Definidas no `.env.test`

### Frontend
- **localStorage**: Mockado no setup
- **fetch API**: Mockado para chamadas HTTP
- **Rotas**: Mockadas quando necessário

## Debugging

### Jest (Backend)
```bash
# Executar teste específico
npm test -- auth.test.js

# Debug com Node
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Vitest (Frontend)
```bash
# Executar teste específico
npm test -- Login.test.js

# UI interativa para debug
npm run test:ui
```

## Integração Contínua

Os testes são executados automaticamente no GitHub Actions em:
- Cada push para `main` ou `develop`
- Cada pull request
- Matriz de testes com Node.js 18 e 20

Veja [CI-CD.md](./CI-CD.md) para mais detalhes.

## Troubleshooting

### Erro "Cannot find module"
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Testes falhando após mudanças no schema
```bash
cd backend
npx prisma generate
npm test
```

### Erro de timeout nos testes
- Aumente o timeout no arquivo de configuração
- Jest: `testTimeout: 10000` no `jest.config.js`
- Vitest: `test.testTimeout: 10000` no `vitest.config.js`

## Recursos Adicionais

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
