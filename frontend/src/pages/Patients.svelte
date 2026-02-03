<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-routing';
  import { api } from '../services/api.js';
  import { notifications } from '../stores/notificationStore.js';
  import Modal from '../components/Modal.svelte';
  import Loading from '../components/Loading.svelte';

  let patients = [];
  let loading = true;
  let showModal = false;
  let editingPatient = null;

  let form = {
    name: '',
    phone: '',
    email: '',
  };

  onMount(async () => {
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

  function openCreateModal() {
    editingPatient = null;
    form = { name: '', phone: '', email: '' };
    showModal = true;
  }

  function openEditModal(patient) {
    editingPatient = patient;
    form = {
      name: patient.name,
      phone: patient.phone || '',
      email: patient.email || '',
    };
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingPatient = null;
    form = { name: '', phone: '', email: '' };
  }

  async function handleSubmit() {
    try {
      if (editingPatient) {
        await api.patients.update(editingPatient.id, form);
        notifications.add('Paciente atualizado com sucesso!', 'success');
      } else {
        await api.patients.create(form);
        notifications.add('Paciente criado com sucesso!', 'success');
      }
      closeModal();
      await loadPatients();
    } catch (error) {
      notifications.add(error.message || 'Erro ao salvar paciente', 'error');
    }
  }

  async function handleDelete(patient) {
    if (!confirm(`Deseja realmente excluir o paciente ${patient.name}?`)) {
      return;
    }

    try {
      await api.patients.delete(patient.id);
      notifications.add('Paciente excluído com sucesso!', 'success');
      await loadPatients();
    } catch (error) {
      notifications.add(error.message || 'Erro ao excluir paciente', 'error');
    }
  }

  async function exportToExcel() {
    try {
      await api.reports.exportPatients();
      notifications.add('Relatório exportado com sucesso!', 'success');
    } catch (error) {
      notifications.add(error.message || 'Erro ao exportar relatório', 'error');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Pacientes</h1>
    <div class="flex space-x-3">
      <button on:click={exportToExcel} class="btn btn-secondary">
        📊 Exportar Excel
      </button>
      <button on:click={openCreateModal} class="btn btn-primary">
        + Novo Paciente
      </button>
    </div>
  </div>

  <Loading {loading}>
    <div class="card">
      {#if patients.length === 0}
        <p class="text-gray-500 text-center py-8">Nenhum paciente cadastrado</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orçamentos</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each patients as patient}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{patient.name}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.phone || '-'}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.email || '-'}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="badge badge-success">
                      {patient._count.budgets}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <a
                      href="/patients/{patient.id}"
                      use:link
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Ver
                    </a>
                    <button
                      on:click={() => openEditModal(patient)}
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      on:click={() => handleDelete(patient)}
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
  title={editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
  onClose={closeModal}
>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Nome *
      </label>
      <input
        id="name"
        type="text"
        bind:value={form.name}
        required
        class="input"
        placeholder="Nome completo do paciente"
      />
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
        Telefone
      </label>
      <input
        id="phone"
        type="tel"
        bind:value={form.phone}
        class="input"
        placeholder="(00) 00000-0000"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        id="email"
        type="email"
        bind:value={form.email}
        class="input"
        placeholder="email@exemplo.com"
      />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button type="button" on:click={closeModal} class="btn btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary">
        {editingPatient ? 'Atualizar' : 'Criar'}
      </button>
    </div>
  </form>
</Modal>
