<script>
  import { onMount } from 'svelte';
  import { link, navigate } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import Loading from '../components/Loading.svelte';

  export let id;

  let patient = null;
  let budgets = [];
  let loading = true;

  onMount(async () => {
    await loadPatient();
  });

  async function loadPatient() {
    loading = true;
    try {
      patient = await api.patients.getById(id);
      budgets = patient.budgets || [];
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar paciente', 'error');
      navigate('/patients');
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
    return new Date(date).toLocaleDateString('pt-BR');
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

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/patients" use:link class="text-primary-600 hover:text-primary-800 flex items-center">
      ← Voltar para Pacientes
    </a>
  </div>

  <Loading {loading}>
    {#if patient}
      <!-- Patient Info Card -->
      <div class="card mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{patient.name}</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">Telefone</p>
            <p class="text-lg font-medium">{patient.phone || '-'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="text-lg font-medium">{patient.email || '-'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Cadastrado em</p>
            <p class="text-lg font-medium">{formatDate(patient.createdAt)}</p>
          </div>
        </div>
      </div>

      <!-- Budgets List -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Histórico de Orçamentos</h2>
          <a href="/budgets/new?patientId={patient.id}" use:link class="btn btn-primary">
            + Novo Orçamento
          </a>
        </div>

        {#if budgets.length === 0}
          <p class="text-gray-500 text-center py-8">Nenhum orçamento cadastrado para este paciente</p>
        {:else}
          <div class="space-y-4">
            {#each budgets as budget}
              <div class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <span class="badge {getStatusBadge(budget.status)}">
                        {getStatusLabel(budget.status)}
                      </span>
                      <span class="text-sm text-gray-500">
                        {formatDate(budget.createdAt)}
                      </span>
                    </div>
                    
                    <div class="mb-3">
                      <p class="text-2xl font-bold text-gray-900">{formatCurrency(budget.totalValue)}</p>
                      <p class="text-sm text-gray-500">
                        {budget.items.length} {budget.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>

                    {#if budget.notes}
                      <div class="bg-gray-50 rounded p-3 mb-3">
                        <p class="text-sm text-gray-700">{budget.notes}</p>
                      </div>
                    {/if}

                    <div class="space-y-1">
                      {#each budget.items as item}
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-700">{item.description}</span>
                          <span class="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                        </div>
                      {/each}
                    </div>
                  </div>

                  <div class="ml-4">
                    <a
                      href="/budgets/{budget.id}"
                      use:link
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Ver detalhes →
                    </a>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </Loading>
</div>
