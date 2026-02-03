<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import Loading from '../components/Loading.svelte';

  let patients = [];
  let loading = true;
  let submitting = false;

  let form = {
    patientId: '',
    notes: '',
    items: [{ description: '', price: '' }],
  };

  // Check for patientId in URL params
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientIdParam = urlParams.get('patientId');
    
    if (patientIdParam) {
      form.patientId = patientIdParam;
    }

    await loadPatients();
  });

  async function loadPatients() {
    loading = true;
    try {
      patients = await api.patients.getAll();
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar pacientes', 'error');
    } finally {
      loading = false;
    }
  }

  function addItem() {
    form.items = [...form.items, { description: '', price: '' }];
  }

  function removeItem(index) {
    if (form.items.length > 1) {
      form.items = form.items.filter((_, i) => i !== index);
    }
  }

  function calculateTotal() {
    return form.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + price;
    }, 0);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  async function handleSubmit() {
    // Validate
    if (!form.patientId) {
      notifications.add('Selecione um paciente', 'error');
      return;
    }

    const validItems = form.items.filter(
      item => item.description.trim() && item.price
    );

    if (validItems.length === 0) {
      notifications.add('Adicione pelo menos um item ao orçamento', 'error');
      return;
    }

    submitting = true;
    try {
      const data = {
        patientId: parseInt(form.patientId),
        notes: form.notes || null,
        items: validItems.map(item => ({
          description: item.description.trim(),
          price: parseFloat(item.price),
        })),
      };

      const budget = await api.budgets.create(data);
      notifications.add('Orçamento criado com sucesso!', 'success');
      navigate(`/budgets/${budget.id}`);
    } catch (error) {
      notifications.add(error.message || 'Erro ao criar orçamento', 'error');
    } finally {
      submitting = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Novo Orçamento</h1>

  <Loading {loading}>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <!-- Patient Selection -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações do Paciente</h2>
        
        <div>
          <label for="patient" class="block text-sm font-medium text-gray-700 mb-2">
            Paciente *
          </label>
          <select
            id="patient"
            bind:value={form.patientId}
            required
            class="input"
          >
            <option value="">Selecione um paciente</option>
            {#each patients as patient}
              <option value={patient.id}>{patient.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Items -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Itens do Orçamento</h2>
          <button
            type="button"
            on:click={addItem}
            class="btn btn-secondary text-sm"
          >
            + Adicionar Item
          </button>
        </div>

        <div class="space-y-4">
          {#each form.items as item, index}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start space-x-4">
                <div class="flex-1 space-y-4">
                  <div>
                    <label for="description-{index}" class="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <input
                      id="description-{index}"
                      type="text"
                      bind:value={item.description}
                      required
                      class="input"
                      placeholder="Ex: Limpeza dentária"
                    />
                  </div>

                  <div>
                    <label for="price-{index}" class="block text-sm font-medium text-gray-700 mb-2">
                      Valor (R$) *
                    </label>
                    <input
                      id="price-{index}"
                      type="number"
                      step="0.01"
                      min="0"
                      bind:value={item.price}
                      required
                      class="input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {#if form.items.length > 1}
                  <button
                    type="button"
                    on:click={() => removeItem(index)}
                    class="text-red-600 hover:text-red-900 mt-8"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <!-- Total -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium text-gray-900">Total do Orçamento:</span>
            <span class="text-2xl font-bold text-primary-600">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Observações</h2>
        
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Notas sobre a negociação
          </label>
          <textarea
            id="notes"
            bind:value={form.notes}
            rows="4"
            class="input"
            placeholder="Adicione observações relevantes sobre este orçamento..."
          ></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          on:click={() => navigate('/budgets')}
          class="btn btn-secondary"
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Criando...' : 'Criar Orçamento'}
        </button>
      </div>
    </form>
  </Loading>
</div>
