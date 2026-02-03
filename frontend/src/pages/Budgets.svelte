<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import Modal from '../components/Modal.svelte';
  import Loading from '../components/Loading.svelte';

  let budgets = [];
  let loading = true;
  let showModal = false;
  let selectedBudget = null;

  onMount(async () => {
    await loadBudgets();
  });

  async function loadBudgets() {
    loading = true;
    try {
      budgets = await api.budgets.getAll();
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar orçamentos', 'error');
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

  function openStatusModal(budget) {
    selectedBudget = budget;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedBudget = null;
  }

  async function updateStatus(status) {
    try {
      await api.budgets.updateStatus(selectedBudget.id, status);
      notifications.add('Status atualizado com sucesso!', 'success');
      closeModal();
      await loadBudgets();
    } catch (error) {
      notifications.add(error.message || 'Erro ao atualizar status', 'error');
    }
  }

  async function handleDelete(budget) {
    if (!confirm(`Deseja realmente excluir o orçamento de ${budget.patient.name}?`)) {
      return;
    }

    try {
      await api.budgets.delete(budget.id);
      notifications.add('Orçamento excluído com sucesso!', 'success');
      await loadBudgets();
    } catch (error) {
      notifications.add(error.message || 'Erro ao excluir orçamento', 'error');
    }
  }

  async function exportToExcel() {
    try {
      await api.reports.exportBudgets();
      notifications.add('Relatório exportado com sucesso!', 'success');
    } catch (error) {
      notifications.add(error.message || 'Erro ao exportar relatório', 'error');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Orçamentos</h1>
    <div class="flex space-x-3">
      <button on:click={exportToExcel} class="btn btn-secondary">
        📊 Exportar Excel
      </button>
      <a href="/budgets/new" use:link class="btn btn-primary">
        + Novo Orçamento
      </a>
    </div>
  </div>

  <Loading {loading}>
    <div class="card">
      {#if budgets.length === 0}
        <p class="text-gray-500 text-center py-8">Nenhum orçamento cadastrado</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each budgets as budget}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{budget.patient.name}</div>
                    {#if budget.patient.phone}
                      <div class="text-xs text-gray-500">{budget.patient.phone}</div>
                    {/if}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(budget.createdAt)}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(budget.finalTotal || budget.totalValue)}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {budget.items.length}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <button
                      on:click={() => openStatusModal(budget)}
                      class="badge {getStatusBadge(budget.status)} cursor-pointer hover:opacity-80"
                    >
                      {getStatusLabel(budget.status)}
                    </button>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <a
                      href="/budgets/{budget.id}"
                      use:link
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Ver
                    </a>
                    <button
                      on:click={() => handleDelete(budget)}
                      class="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </Loading>
</div>

<Modal
  show={showModal}
  title="Atualizar Status do Orçamento"
  onClose={closeModal}
>
  {#if selectedBudget}
    <div class="space-y-4">
      <p class="text-gray-700">
        Paciente: <strong>{selectedBudget.patient.name}</strong>
      </p>
      <p class="text-gray-700">
        Valor: <strong>{formatCurrency(selectedBudget.finalTotal || selectedBudget.totalValue)}</strong>
      </p>
      
      <div class="pt-4 space-y-2">
        <button
          on:click={() => updateStatus('EM_NEGOCIACAO')}
          class="btn btn-secondary w-full"
          disabled={selectedBudget.status === 'EM_NEGOCIACAO'}
        >
          Em Negociação
        </button>
        <button
          on:click={() => updateStatus('ACEITO')}
          class="btn bg-green-600 text-white hover:bg-green-700 w-full"
          disabled={selectedBudget.status === 'ACEITO'}
        >
          Aceitar
        </button>
        <button
          on:click={() => updateStatus('RECUSADO')}
          class="btn btn-danger w-full"
          disabled={selectedBudget.status === 'RECUSADO'}
        >
          Recusar
        </button>
      </div>
    </div>
  {/if}
</Modal>
