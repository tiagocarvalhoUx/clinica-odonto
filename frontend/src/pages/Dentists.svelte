<script>
  import { onMount } from 'svelte';
  import { link, navigate } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import { events, EVENT_TYPES } from '../stores/eventStore.js';
  import Loading from '../components/Loading.svelte';
  import Modal from '../components/Modal.svelte';

  let dentists = [];
  let loading = true;
  let showAddModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let selectedDentist = null;
  let submitting = false;

  let form = {
    name: '',
    cro: '',
    specialty: '',
    phone: '',
    email: '',
    active: true,
  };

  onMount(() => {
    loadDentists();

    // Subscribe to events
    const unsubscribe = events.subscribe(EVENT_TYPES.BUDGET_CREATED, () => {
      loadDentists();
    });

    return () => {
      unsubscribe();
    };
  });

  async function loadDentists() {
    loading = true;
    try {
      dentists = await api.dentists.getAll();
    } catch (error) {
      notifications.add(error.message || 'Erro ao carregar dentistas', 'error');
    } finally {
      loading = false;
    }
  }

  function openAddModal() {
    form = { name: '', cro: '', specialty: '', phone: '', email: '', active: true };
    showAddModal = true;
  }

  function openEditModal(dentist) {
    selectedDentist = dentist;
    form = {
      name: dentist.name,
      cro: dentist.cro,
      specialty: dentist.specialty || '',
      phone: dentist.phone || '',
      email: dentist.email || '',
      active: dentist.active,
    };
    showEditModal = true;
  }

  function openDeleteModal(dentist) {
    selectedDentist = dentist;
    showDeleteModal = true;
  }

  function closeModals() {
    showAddModal = false;
    showEditModal = false;
    showDeleteModal = false;
    selectedDentist = null;
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.cro.trim()) {
      notifications.add('Nome e CRO são obrigatórios', 'error');
      return;
    }

    submitting = true;
    try {
      await api.dentists.create(form);
      notifications.add('Dentista criado com sucesso!', 'success');
      closeModals();
      await loadDentists();
    } catch (error) {
      notifications.add(error.message || 'Erro ao criar dentista', 'error');
    } finally {
      submitting = false;
    }
  }

  async function handleEdit() {
    if (!form.name.trim() || !form.cro.trim()) {
      notifications.add('Nome e CRO são obrigatórios', 'error');
      return;
    }

    submitting = true;
    try {
      await api.dentists.update(selectedDentist.id, form);
      notifications.add('Dentista atualizado com sucesso!', 'success');
      closeModals();
      await loadDentists();
    } catch (error) {
      notifications.add(error.message || 'Erro ao atualizar dentista', 'error');
    } finally {
      submitting = false;
    }
  }

  async function handleDelete() {
    submitting = true;
    try {
      await api.dentists.delete(selectedDentist.id);
      notifications.add('Dentista excluído com sucesso!', 'success');
      closeModals();
      await loadDentists();
    } catch (error) {
      notifications.add(error.message || 'Erro ao excluir dentista', 'error');
    } finally {
      submitting = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dentistas</h1>
      <p class="text-gray-600 mt-1">Gerencie os dentistas da clínica</p>
    </div>
    <button on:click={openAddModal} class="btn btn-primary">
      + Novo Dentista
    </button>
  </div>

  <!-- Dentists List -->
  <Loading {loading}>
    {#if dentists.length === 0}
      <div class="card text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum dentista cadastrado</h3>
        <p class="text-gray-500 mb-4">Cadastre dentistas para associá-los aos orçamentos.</p>
        <button on:click={openAddModal} class="btn btn-primary">
          Cadastrar Primeiro Dentista
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each dentists as dentist}
          <div class="card hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{dentist.name}</h3>
                  <p class="text-sm text-gray-500">CRO: {dentist.cro}</p>
                </div>
              </div>
              {#if !dentist.active}
                <span class="badge badge-danger text-xs">Inativo</span>
              {:else}
                <span class="badge badge-success text-xs">Ativo</span>
              {/if}
            </div>

            {#if dentist.specialty}
              <div class="mt-3">
                <span class="text-sm text-gray-600">
                  <span class="font-medium">Especialidade:</span> {dentist.specialty}
                </span>
              </div>
            {/if}

            <div class="mt-3 space-y-1">
              {#if dentist.phone}
                <p class="text-sm text-gray-500 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {dentist.phone}
                </p>
              {/if}
              {#if dentist.email}
                <p class="text-sm text-gray-500 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {dentist.email}
                </p>
              {/if}
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                on:click={() => openEditModal(dentist)}
                class="btn btn-secondary text-sm"
              >
                Editar
              </button>
              <button
                on:click={() => openDeleteModal(dentist)}
                class="btn btn-danger text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </Loading>
</div>

<!-- Add Modal -->
<Modal show={showAddModal} title="Novo Dentista" on:close={closeModals}>
  <form on:submit|preventDefault={handleAdd} class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nome *
      </label>
      <input
        type="text"
        bind:value={form.name}
        class="input"
        placeholder="Nome completo"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        CRO *
      </label>
      <input
        type="text"
        bind:value={form.cro}
        class="input"
        placeholder="Ex: 12345-SP"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Especialidade
      </label>
      <input
        type="text"
        bind:value={form.specialty}
        class="input"
        placeholder="Ex: Ortodontia"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Telefone
      </label>
      <input
        type="tel"
        bind:value={form.phone}
        class="input"
        placeholder="(00) 00000-0000"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        type="email"
        bind:value={form.email}
        class="input"
        placeholder="email@exemplo.com"
      />
    </div>

    <div class="flex items-center">
      <input
        type="checkbox"
        id="active"
        bind:checked={form.active}
        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      <label for="active" class="ml-2 block text-sm text-gray-900">
        Ativo
      </label>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button type="button" on:click={closeModals} class="btn btn-secondary" disabled={submitting}>
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" disabled={submitting}>
        {submitting ? 'Criando...' : 'Criar'}
      </button>
    </div>
  </form>
</Modal>

<!-- Edit Modal -->
<Modal show={showEditModal} title="Editar Dentista" on:close={closeModals}>
  <form on:submit|preventDefault={handleEdit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nome *
      </label>
      <input
        type="text"
        bind:value={form.name}
        class="input"
        placeholder="Nome completo"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        CRO *
      </label>
      <input
        type="text"
        bind:value={form.cro}
        class="input"
        placeholder="Ex: 12345-SP"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Especialidade
      </label>
      <input
        type="text"
        bind:value={form.specialty}
        class="input"
        placeholder="Ex: Ortodontia"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Telefone
      </label>
      <input
        type="tel"
        bind:value={form.phone}
        class="input"
        placeholder="(00) 00000-0000"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        type="email"
        bind:value={form.email}
        class="input"
        placeholder="email@exemplo.com"
      />
    </div>

    <div class="flex items-center">
      <input
        type="checkbox"
        id="edit-active"
        bind:checked={form.active}
        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      <label for="edit-active" class="ml-2 block text-sm text-gray-900">
        Ativo
      </label>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button type="button" on:click={closeModals} class="btn btn-secondary" disabled={submitting}>
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  </form>
</Modal>

<!-- Delete Modal -->
<Modal show={showDeleteModal} title="Confirmar Exclusão" on:close={closeModals}>
  <div class="text-center">
    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
      <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      Excluir {selectedDentist?.name}?
    </h3>
    <p class="text-sm text-gray-500 mb-4">
      Esta ação não pode ser desfeita. O dentista será removido permanentemente.
    </p>
    <div class="flex justify-center space-x-3">
      <button on:click={closeModals} class="btn btn-secondary" disabled={submitting}>
        Cancelar
      </button>
      <button on:click={handleDelete} class="btn btn-danger" disabled={submitting}>
        {submitting ? 'Excluindo...' : 'Excluir'}
      </button>
    </div>
  </div>
</Modal>
