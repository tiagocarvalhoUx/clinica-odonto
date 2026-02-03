<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { authStore } from './stores/authStore.js';
  
  import Navbar from './components/Navbar.svelte';
  import Notification from './components/Notification.svelte';
  
  import Login from './pages/Login.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Patients from './pages/Patients.svelte';
  import PatientDetail from './pages/PatientDetail.svelte';
  import Budgets from './pages/Budgets.svelte';
  import BudgetNew from './pages/BudgetNew.svelte';
  import BudgetDetail from './pages/BudgetDetail.svelte';

  export let url = '';

  onMount(() => {
    authStore.checkAuth();
  });

  $: if (!$authStore.loading && !$authStore.isAuthenticated && url !== '/login') {
    navigate('/login', { replace: true });
  }
</script>

<Router {url}>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <Notification />
    
    <main>
      {#if !$authStore.loading}
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/patients" component={Patients} />
        <Route path="/patients/:id" let:params>
          <PatientDetail id={params.id} />
        </Route>
        <Route path="/budgets" component={Budgets} />
        <Route path="/budgets/new" component={BudgetNew} />
        <Route path="/budgets/:id" let:params>
          <BudgetDetail id={params.id} />
        </Route>
        <Route path="/" component={Dashboard} />
      {:else}
        <div class="flex items-center justify-center min-h-screen">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      {/if}
    </main>
  </div>
</Router>
