<script>
  import { onMount } from 'svelte';
  import { link, navigate } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import Modal from '../components/Modal.svelte';
  import Loading from '../components/Loading.svelte';

  export let id;

  let budget = null;
  let loading = true;
  let showStatusModal = false;
  let showEditModal = false;
  let editForm = {
    notes: '',
    items: [],
  };

  onMount(async () => {
    await loadBudget();
  });

  async function loadBudget() {
    loading = true;
    try {
      budget = await api.budgets.getById(id);
      editForm.notes = budget.notes || '';
      editForm.items = budget.items.map(item => ({ ...item }));
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar orçamento', 'error');
      navigate('/budgets');
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  async function updateStatus(status) {
    try {
      await api.budgets.updateStatus(budget.id, status);
      notifications.add('Status atualizado com sucesso!', 'success');
      showStatusModal = false;
      await loadBudget();
    } catch (error) {
      notifications.add(error.message || 'Erro ao atualizar status', 'error');
    }
  }

  function addItem() {
    editForm.items = [...editForm.items, { description: '', price: '' }];
  }

  function removeItem(index) {
    if (editForm.items.length > 1) {
      editForm.items = editForm.items.filter((_, i) => i !== index);
    }
  }

  function calculateTotal() {
    return editForm.items.reduce((sum, item) => {
      const price = parseFloat(item.price || item.unitPrice) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
  }

  async function handleEdit() {
    try {
      const data = {
        notes: editForm.notes || null,
        items: editForm.items.map(item => ({
          description: item.description,
          price: parseFloat(item.price),
        })),
      };

      await api.budgets.update(budget.id, data);
      notifications.add('Orçamento atualizado com sucesso!', 'success');
      showEditModal = false;
      await loadBudget();
    } catch (error) {
      notifications.add(error.message || 'Erro ao atualizar orçamento', 'error');
    }
  }

  async function handleDelete() {
    if (!confirm('Deseja realmente excluir este orçamento?')) {
      return;
    }

    try {
      await api.budgets.delete(budget.id);
      notifications.add('Orçamento excluído com sucesso!', 'success');
      navigate('/budgets');
    } catch (error) {
      notifications.add(error.message || 'Erro ao excluir orçamento', 'error');
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="mb-6">
    <a href="/budgets" use:link class="text-primary-600 hover:text-primary-800 flex items-center">
      ← Voltar para Orçamentos
    </a>
  </div>

  <Loading {loading}>
    {#if budget}
      <!-- Header -->
      <div class="card mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Orçamento #{budget.id}</h1>
            <p class="text-gray-500">{formatDate(budget.createdAt)}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              on:click={() => showStatusModal = true}
              class="badge {getStatusBadge(budget.status)} text-base cursor-pointer hover:opacity-80"
            >
              {getStatusLabel(budget.status)}
            </button>
          </div>
        </div>
      </div>

      <!-- Patient Info -->
      <div class="card mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações do Paciente</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">Nome</p>
            <p class="text-lg font-medium">
              <a href="/patients/{budget.patient.id}" use:link class="text-primary-600 hover:text-primary-800">
                {budget.patient.name}
              </a>
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Telefone</p>
            <p class="text-lg font-medium">{budget.patient.phone || '-'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="text-lg font-medium">{budget.patient.email || '-'}</p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Itens do Orçamento</h2>
          <button on:click={() => showEditModal = true} class="btn btn-secondary text-sm">
            Editar
          </button>
        </div>

        <div class="space-y-3">
          {#each budget.items as item}
            <div class="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
              <div>
                <span class="text-gray-700">{item.description}</span>
                {#if item.quantity && item.quantity > 1}
                  <span class="text-sm text-gray-500 ml-2">({item.quantity}x {formatCurrency(item.unitPrice)})</span>
                {/if}
              </div>
              <span class="font-medium text-gray-900">{formatCurrency(item.total)}</span>
            </div>
          {/each}
        </div>

        {#if budget.discount > 0}
          <div class="mt-4 flex justify-between items-center text-gray-600">
            <span>Subtotal:</span>
            <span>{formatCurrency(budget.total)}</span>
          </div>
          <div class="flex justify-between items-center text-success-600">
            <span>Desconto:</span>
            <span>- {formatCurrency(budget.discount)}</span>
          </div>
        {/if}

        <div class="mt-6 pt-6 border-t border-gray-300">
          <div class="flex justify-between items-center">
            <span class="text-xl font-semibold text-gray-900">Total:</span>
            <span class="text-3xl font-bold text-primary-600">
              {formatCurrency(budget.finalTotal)}
            </span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      {#if budget.notes}
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Observações</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{budget.notes}</p>
        </div>
      {/if}

      <!-- Created By -->
      <div class="card mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Criado por</h2>
        <p class="text-gray-700">
          <strong>{budget.user.name}</strong> ({budget.user.email})
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button on:click={handleDelete} class="btn btn-danger">
          Excluir Orçamento
        </button>
      </div>
    {/if}
  </Loading>
</div>

<!-- Status Modal -->
<Modal
  show={showStatusModal}
  title="Atualizar Status do Orçamento"
  onClose={() => showStatusModal = false}
>
  <div class="space-y-2">
    <button
      on:click={() => updateStatus('EM_NEGOCIACAO')}
      class="btn btn-secondary w-full"
      disabled={budget?.status === 'EM_NEGOCIACAO'}
    >
      Em Negociação
    </button>
    <button
      on:click={() => updateStatus('ACEITO')}
      class="btn bg-green-600 text-white hover:bg-green-700 w-full"
      disabled={budget?.status === 'ACEITO'}
    >
      Aceitar
    </button>
    <button
      on:click={() => updateStatus('RECUSADO')}
      class="btn btn-danger w-full"
      disabled={budget?.status === 'RECUSADO'}
    >
      Recusar
    </button>
  </div>
</Modal>

<!-- Edit Modal -->
<Modal
  show={showEditModal}
  title="Editar Orçamento"
  onClose={() => showEditModal = false}
>
  <form on:submit|preventDefault={handleEdit} class="space-y-4">
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">
          Itens *
        </label>
        <button type="button" on:click={addItem} class="text-sm text-primary-600 hover:text-primary-800">
          + Adicionar
        </button>
      </div>
      
      <div class="space-y-3">
        {#each editForm.items as item, index}
          <div class="border border-gray-200 rounded p-3 space-y-2">
            <input
              type="text"
              bind:value={item.description}
              required
              class="input text-sm"
              placeholder="Descrição"
            />
            <div class="flex space-x-2">
              <input
                type="number"
                step="0.01"
                min="0"
                bind:value={item.price}
                required
                class="input text-sm flex-1"
                placeholder="Valor"
              />
              {#if editForm.items.length > 1}
                <button
                  type="button"
                  on:click={() => removeItem(index)}
                  class="text-red-600 hover:text-red-900"
                >
                  Remover
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-3 text-right">
        <span class="text-lg font-bold text-primary-600">
          Total: {formatCurrency(calculateTotal())}
        </span>
      </div>
    </div>

    <div>
      <label for="edit-notes" class="block text-sm font-medium text-gray-700 mb-2">
        Observações
      </label>
      <textarea
        id="edit-notes"
        bind:value={editForm.notes}
        rows="3"
        class="input"
        placeholder="Notas sobre a negociação..."
      ></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button type="button" on:click={() => showEditModal = false} class="btn btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary">
        Salvar
      </button>
    </div>
  </form>
</Modal>
