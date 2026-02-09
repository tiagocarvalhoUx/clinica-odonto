<script>
  import { navigate } from 'svelte-routing';
  import { authStore } from '../stores/authStore.js';
  import { notifications } from '../stores/notificationStore.js';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let loading = false;
  let showPassword = false;

  onMount(() => {
    if ($authStore.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  });

  async function handleLogin() {
    loading = true;
    try {
      await authStore.login(email, password);
      notifications.add('Login realizado com sucesso!', 'success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      notifications.add(error.message || 'Erro ao fazer login', 'error');
    } finally {
      loading = false;
    }
  }

  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-pattern px-4 py-8">
  <div class="w-full max-w-md animate-fade-in">
    <!-- Logo & Title Card -->
    <div class="text-center mb-6 sm:mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-lg mb-4 animate-slide-down">
        <span class="text-3xl sm:text-4xl">🦷</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Clínica Odontológica</h1>
      <p class="text-sm sm:text-base text-gray-600">Sistema de Orçamentos Odontológicos</p>
    </div>

    <!-- Login Card -->
    <div class="card animate-slide-up">
      <div class="mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Bem-vindo!</h2>
        <p class="text-sm text-gray-600 mt-1">Entre com suas credenciais para continuar</p>
      </div>

      <form on:submit|preventDefault={handleLogin} class="space-y-5">
        <!-- Email Field -->
        <div>
          <label for="email" class="label">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </span>
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            class="input"
            placeholder="seu@email.com"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="label">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Senha
            </span>
          </label>
          <div class="relative">
            {#if showPassword}
              <input
                id="password"
                type="text"
                bind:value={password}
                required
                autocomplete="current-password"
                class="input pr-12"
                placeholder="••••••••"
              />
            {:else}
              <input
                id="password"
                type="password"
                bind:value={password}
                required
                autocomplete="current-password"
                class="input pr-12"
                placeholder="••••••••"
              />
            {/if}
            <button
              type="button"
              on:click={togglePassword}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {#if showPassword}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              {:else}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading}
          class="btn btn-primary btn-lg w-full mt-6"
        >
          {#if loading}
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Entrando...
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Entrar
          {/if}
        </button>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p class="text-xs sm:text-sm font-medium text-blue-900 mb-2">Credenciais de demonstração:</p>
        <div class="space-y-1 text-xs sm:text-sm text-blue-700">
          <p><strong>Admin:</strong> admin@clinica.com / admin123</p>
          <p><strong>Funcionária:</strong> funcionaria@clinica.com / funcionaria123</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-6 text-xs sm:text-sm text-gray-600">
      <p>© 2026 Clínica Odontológica. Todos os direitos reservados.</p>
    </div>
  </div>
</div>
