<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import { events, EVENT_TYPES } from '../stores/eventStore.js';
  import Loading from '../components/Loading.svelte';
  import Modal from '../components/Modal.svelte';

  let patients = [];
  let dentists = [];
  let loading = true;
  let submitting = false;
  let showNewDentistModal = false;
  let creatingDentist = false;

  let form = {
    patientId: '',
    dentistId: '',
    notes: '',
    items: [{ description: '', price: '' }],
  };

  let newDentist = {
    name: '',
    cro: '',
    phone: '',
    email: '',
    specialty: '',
  };

  // Check for patientId in URL params
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientIdParam = urlParams.get('patientId');
    
    if (patientIdParam) {
      form.patientId = patientIdParam;
    }

    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      const [patientsData, dentistsData] = await Promise.all([
        api.patients.getAll(),
        api.dentists.getActive(),
      ]);
      patients = patientsData;
      dentists = dentistsData;
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar dados', 'error');
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

  function openNewDentistModal() {
    newDentist = { name: '', cro: '', phone: '', email: '', specialty: '' };
    showNewDentistModal = true;
  }

  function closeNewDentistModal() {
    showNewDentistModal = false;
  }

  async function handleCreateDentist() {
    if (!newDentist.name.trim() || !newDentist.cro.trim()) {
      notifications.add('Nome e CRO são obrigatórios', 'error');
      return;
    }

    creatingDentist = true;
    try {
      const dentist = await api.dentists.create(newDentist);
      dentists = [...dentists, dentist];
      form.dentistId = dentist.id;
      notifications.add('Dentista criado com sucesso!', 'success');
      closeNewDentistModal();
    } catch (error) {
      notifications.add(error.message || 'Erro ao criar dentista', 'error');
    } finally {
      creatingDentist = false;
    }
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
        dentistId: form.dentistId ? parseInt(form.dentistId) : null,
        notes: form.notes || null,
        items: validItems.map(item => ({
          description: item.description.trim(),
          price: parseFloat(item.price),
        })),
      };

      const budget = await api.budgets.create(data);
      notifications.add('Orçamento criado com sucesso!', 'success');
      events.trigger(EVENT_TYPES.BUDGET_CREATED);
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

      <!-- Dentist Selection -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Informações do Dentista</h2>
          <button
            type="button"
            on:click={openNewDentistModal}
            class="btn btn-secondary text-sm"
          >
            + Novo Dentista
          </button>
        </div>
        
        <div>
          <label for="dentist" class="block text-sm font-medium text-gray-700 mb-2">
            Dentista Responsável
          </label>
          <select
            id="dentist"
            bind:value={form.dentistId}
            class="input"
          >
            <option value="">Selecione um dentista</option>
            {#each dentists as dentist}
              <option value={dentist.id}>
                {dentist.name}{dentist.cro ? ` (CRO: ${dentist.cro})` : ''}{dentist.specialty ? ` - ${dentist.specialty}` : ''}
              </option>
            {/each}
          </select>
          <p class="text-sm text-gray-500 mt-1">
            Selecione o dentista responsável por este orçamento ou cadastre um novo.
          </p>
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

<!-- New Dentist Modal -->
<Modal show={showNewDentistModal} title="Novo Dentista" on:close={closeNewDentistModal}>
  <div class="space-y-4">
    <div>
      <label for="dentist-name" class="block text-sm font-medium text-gray-700 mb-2">
        Nome *
      </label>
      <input
        id="dentist-name"
        type="text"
        bind:value={newDentist.name}
        class="input"
        placeholder="Nome completo do dentista"
      />
    </div>

    <div>
      <label for="dentist-cro" class="block text-sm font-medium text-gray-700 mb-2">
        CRO *
      </label>
      <input
        id="dentist-cro"
        type="text"
        bind:value={newDentist.cro}
        class="input"
        placeholder="Ex: 12345-SP"
      />
    </div>

    <div>
      <label for="dentist-specialty" class="block text-sm font-medium text-gray-700 mb-2">
        Especialidade
      </label>
      <input
        id="dentist-specialty"
        type="text"
        bind:value={newDentist.specialty}
        class="input"
        placeholder="Ex: Ortodontia, Endodontia..."
      />
    </div>

    <div>
      <label for="dentist-phone" class="block text-sm font-medium text-gray-700 mb-2">
        Telefone
      </label>
      <input
        id="dentist-phone"
        type="tel"
        bind:value={newDentist.phone}
        class="input"
        placeholder="(00) 00000-0000"
      />
    </div>

    <div>
      <label for="dentist-email" class="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        id="dentist-email"
        type="email"
        bind:value={newDentist.email}
        class="input"
        placeholder="email@exemplo.com"
      />
    </div>
  </div>

  <div slot="footer" class="flex justify-end space-x-3">
    <button
      type="button"
      on:click={closeNewDentistModal}
      class="btn btn-secondary"
      disabled={creatingDentist}
    >
      Cancelar
    </button>
    <button
      type="button"
      on:click={handleCreateDentist}
      class="btn btn-primary"
      disabled={creatingDentist}
    >
      {creatingDentist ? 'Criando...' : 'Criar Dentista'}
    </button>
  </div>
</Modal>
