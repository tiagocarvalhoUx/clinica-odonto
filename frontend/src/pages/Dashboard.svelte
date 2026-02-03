<script>
  import { onMount, onDestroy } from 'svelte';
  import { link } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import { events, EVENT_TYPES } from '../stores/eventStore.js';
  import Loading from '../components/Loading.svelte';

  let budgets = [];
  let patients = [];
  let loading = true;
  let unsubscribe;

  let stats = {
    totalBudgets: 0,
    budgetsInNegotiation: 0,
    budgetsAccepted: 0,
    budgetsRejected: 0,
    totalPatients: 0,
  };

  onMount(async () => {
    await loadData();
    
    // Subscribe to events to reload data automatically
    unsubscribe = events.subscribe((event) => {
      if (event && [
        EVENT_TYPES.BUDGET_CREATED,
        EVENT_TYPES.BUDGET_UPDATED,
        EVENT_TYPES.BUDGET_DELETED,
        EVENT_TYPES.PATIENT_CREATED,
        EVENT_TYPES.PATIENT_UPDATED,
        EVENT_TYPES.PATIENT_DELETED,
      ].includes(event.type)) {
        loadData();
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  async function loadData() {
    loading = true;
    try {
      const [budgetsData, patientsData] = await Promise.all([
        api.budgets.getAll(),
        api.patients.getAll(),
      ]);

      budgets = budgetsData;
      patients = patientsData;

      // Calculate stats
      stats.totalBudgets = budgets.length;
      stats.budgetsInNegotiation = budgets.filter(b => b.status === 'EM_NEGOCIACAO').length;
      stats.budgetsAccepted = budgets.filter(b => b.status === 'ACEITO').length;
      stats.budgetsRejected = budgets.filter(b => b.status === 'RECUSADO').length;
      stats.totalPatients = patients.length;
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar dados', 'error');
    } finally {
      loading = false;
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  }

  function getStatusBadge(status) {
    const badges = {
      EM_NEGOCIACAO: 'badge-warning',
      ACEITO: 'badge-success',
      RECUSADO: 'badge-danger',
    };
    return badges[status] || 'badge-warning';
  }

  function getStatusLabel(status) {
    const labels = {
      EM_NEGOCIACAO: 'Em Negociação',
      ACEITO: 'Aceito',
      RECUSADO: 'Recusado',
    };
    return labels[status] || status;
  }
</script>

<div class="container-custom animate-fade-in">
  <!-- Header -->
  <div class="mb-6 sm:mb-8">
    <h1 class="text-gradient mb-2">Dashboard</h1>
    <p class="text-sm sm:text-base text-gray-600">Visão geral do sistema de orçamentos</p>
  </div>

  <Loading isLoading={loading}>
    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <!-- Total Orçamentos -->
      <div class="stat-card from-primary-500 to-primary-600 text-white col-span-2 lg:col-span-1">
        <div class="flex items-start justify-between">
          <div>
            <p class="stat-label text-primary-100">Total</p>
            <p class="stat-value mt-1">{stats.totalBudgets}</p>
            <p class="text-xs sm:text-sm text-primary-100 mt-1">Orçamentos</p>
          </div>
          <div class="stat-icon bg-white/20">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Em Negociação -->
      <div class="stat-card from-warning-400 to-warning-500 text-white">
        <div class="stat-icon bg-white/20 mb-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="stat-value">{stats.budgetsInNegotiation}</p>
        <p class="stat-label text-warning-100">Em Negociação</p>
      </div>

      <!-- Aceitos -->
      <div class="stat-card from-success-400 to-success-500 text-white">
        <div class="stat-icon bg-white/20 mb-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="stat-value">{stats.budgetsAccepted}</p>
        <p class="stat-label text-success-100">Aceitos</p>
      </div>

      <!-- Recusados -->
      <div class="stat-card from-danger-400 to-danger-500 text-white">
        <div class="stat-icon bg-white/20 mb-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="stat-value">{stats.budgetsRejected}</p>
        <p class="stat-label text-danger-100">Recusados</p>
      </div>

      <!-- Total Pacientes -->
      <div class="stat-card from-purple-400 to-purple-500 text-white col-span-2 lg:col-span-1">
        <div class="stat-icon bg-white/20 mb-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="stat-value">{stats.totalPatients}</p>
        <p class="stat-label text-purple-100">Pacientes</p>
      </div>
    </div>

    <!-- Recent Budgets -->
    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Orçamentos Recentes</h2>
          <p class="text-xs sm:text-sm text-gray-600 mt-1">Últimos orçamentos cadastrados</p>
        </div>
        <a href="/budgets" use:link class="btn btn-primary btn-sm">
          Ver Todos
        </a>
      </div>
      
      {#if budgets.length === 0}
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="empty-state-title">Nenhum orçamento cadastrado</h3>
          <p class="empty-state-text">Comece criando seu primeiro orçamento</p>
          <a href="/budgets/new" use:link class="btn btn-primary">
            Criar Orçamento
          </a>
        </div>
      {:else}
        <!-- Desktop Table -->
        <div class="hidden md:block table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {#each budgets.slice(0, 5) as budget}
                <tr>
                  <td>
                    <div class="font-medium text-gray-900">{budget.patient.name}</div>
                    <div class="text-xs text-gray-500">{budget.patient.phone || 'Sem telefone'}</div>
                  </td>
                  <td class="text-gray-600">
                    {formatDate(budget.createdAt)}
                  </td>
                  <td class="font-semibold text-gray-900">
                    {formatCurrency(budget.finalTotal)}
                  </td>
                  <td>
                    <span class="badge {getStatusBadge(budget.status)}">
                      {getStatusLabel(budget.status)}
                    </span>
                  </td>
                  <td class="text-right">
                    <a href="/budgets/{budget.id}" use:link class="btn btn-secondary btn-sm">
                      Ver Detalhes
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-3">
          {#each budgets.slice(0, 5) as budget}
            <a href="/budgets/{budget.id}" use:link class="mobile-card card-interactive block">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-gray-900">{budget.patient.name}</h3>
                  <p class="text-xs text-gray-500 mt-0.5">{formatDate(budget.createdAt)}</p>
                </div>
                <span class="badge {getStatusBadge(budget.status)}">
                  {getStatusLabel(budget.status)}
                </span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <span class="text-sm text-gray-600">Valor Total</span>
                <span class="text-lg font-bold text-primary-600">{formatCurrency(budget.finalTotal)}</span>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </Loading>
</div>
