# Frontend - Clínica Odontológica

Interface do usuário desenvolvida com Svelte e Tailwind CSS.

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Configure a URL da API (opcional):

```env
VITE_API_URL=http://localhost:3000/api
```

### Executar

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Páginas

### Públicas

- `/login` - Página de autenticação

### Protegidas (requerem login)

- `/dashboard` - Dashboard com estatísticas
- `/patients` - Lista de pacientes
- `/patients/:id` - Detalhes do paciente
- `/budgets` - Lista de orçamentos
- `/budgets/new` - Criar novo orçamento
- `/budgets/:id` - Detalhes do orçamento

## 🧩 Componentes

### Layout

- **Navbar** - Barra de navegação com menu e logout
- **Modal** - Modal reutilizável para formulários
- **Loading** - Indicador de carregamento
- **Notification** - Sistema de notificações toast

### Páginas

- **Login** - Formulário de autenticação
- **Dashboard** - Visão geral com estatísticas
- **Patients** - CRUD de pacientes
- **PatientDetail** - Detalhes e histórico do paciente
- **Budgets** - Lista de orçamentos com filtros
- **BudgetNew** - Criar novo orçamento
- **BudgetDetail** - Visualizar e editar orçamento

## 🗂️ Estrutura

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.svelte
│   │   ├── Modal.svelte
│   │   ├── Loading.svelte
│   │   └── Notification.svelte
│   ├── pages/
│   │   ├── Login.svelte
│   │   ├── Dashboard.svelte
│   │   ├── Patients.svelte
│   │   ├── PatientDetail.svelte
│   │   ├── Budgets.svelte
│   │   ├── BudgetNew.svelte
│   │   └── BudgetDetail.svelte
│   ├── services/
│   │   └── api.js              # Cliente da API
│   ├── stores/
│   │   ├── authStore.js        # Estado de autenticação
│   │   └── notificationStore.js # Sistema de notificações
│   ├── App.svelte              # Componente raiz com rotas
│   ├── main.js                 # Ponto de entrada
│   └── app.css                 # Estilos globais + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Estilos

O projeto usa **Tailwind CSS** com classes customizadas:

### Botões

```html
<button class="btn btn-primary">Botão Primário</button>
<button class="btn btn-secondary">Botão Secundário</button>
<button class="btn btn-danger">Botão Perigo</button>
```

### Inputs

```html
<input class="input" type="text" placeholder="Digite aqui" />
```

### Cards

```html
<div class="card">
  <!-- Conteúdo do card -->
</div>
```

### Badges

```html
<span class="badge badge-success">Aceito</span>
<span class="badge badge-warning">Em Negociação</span>
<span class="badge badge-danger">Recusado</span>
```

## 📦 Stores (Estado Global)

### authStore

Gerencia o estado de autenticação do usuário.

```javascript
import { authStore } from "./stores/authStore.js";

// Login
await authStore.login(email, password);

// Logout
authStore.logout();

// Verificar autenticação
await authStore.checkAuth();

// Acessar estado
$authStore.user;
$authStore.token;
$authStore.isAuthenticated;
```

### notificationStore

Sistema de notificações toast.

```javascript
import { notifications } from "./stores/notificationStore.js";

// Adicionar notificação
notifications.add("Operação realizada!", "success");
notifications.add("Erro ao processar", "error");
notifications.add("Atenção!", "warning");

// Remover notificação
notifications.remove(id);
```

## 🔌 Serviço de API

O arquivo `api.js` centraliza todas as chamadas à API:

```javascript
import { api } from "./services/api.js";

// Pacientes
await api.patients.getAll();
await api.patients.getById(id);
await api.patients.create(data);
await api.patients.update(id, data);
await api.patients.delete(id);

// Orçamentos
await api.budgets.getAll();
await api.budgets.getById(id);
await api.budgets.getByPatientId(patientId);
await api.budgets.create(data);
await api.budgets.update(id, data);
await api.budgets.updateStatus(id, status);
await api.budgets.delete(id);
```

## 🎯 Funcionalidades

### Autenticação

- Login com email e senha
- Armazenamento de token no localStorage
- Proteção de rotas privadas
- Logout com limpeza de sessão

### Pacientes

- Listagem com contador de orçamentos
- Criação com validação
- Edição de dados
- Exclusão com confirmação
- Visualização detalhada com histórico

### Orçamentos

- Criação com múltiplos itens
- Cálculo automático do total
- Edição de itens e valores
- Atualização de status (Em Negociação, Aceito, Recusado)
- Adição de observações
- Visualização detalhada

### Dashboard

- Contadores de orçamentos por status
- Total de pacientes
- Lista de orçamentos recentes

## 📱 Responsividade

O design é **mobile-first** e totalmente responsivo:

- Breakpoints do Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
- Menus adaptáveis
- Tabelas com scroll horizontal em telas pequenas
- Layout em grid adaptável

## 🎨 Tema

Cores primárias configuradas no Tailwind:

```javascript
primary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  // ... até 900
}
```

## 🛠️ Scripts

```bash
npm run dev      # Servidor de desenvolvimento (porta 5173)
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

## 📝 Notas

- O Vite usa Hot Module Replacement (HMR)
- Svelte compila para JavaScript vanilla
- Tailwind remove classes não utilizadas no build
- Tokens são renovados automaticamente
- Notificações desaparecem após 3 segundos
