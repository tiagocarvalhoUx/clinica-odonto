<script>
  import { link, navigate } from 'svelte-routing';
  import { authStore } from '../stores/authStore.js';

  $: isAuthenticated = $authStore.isAuthenticated;
  $: user = $authStore.user;
  
  let mobileMenuOpen = false;

  function handleLogout() {
    authStore.logout();
    navigate('/login');
    mobileMenuOpen = false;
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

{#if isAuthenticated}
  <nav class="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-gray-100">
    <div class="container-custom">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <a href="/dashboard" use:link class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
            <span class="text-lg sm:text-xl">🦷</span>
          </div>
          <span class="text-lg sm:text-xl font-bold text-gradient hidden sm:inline">Clínica Gygy</span>
          <span class="text-base font-bold text-gradient sm:hidden">Gygy</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <a href="/dashboard" use:link class="nav-link">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          <a href="/patients" use:link class="nav-link">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Pacientes
          </a>
          <a href="/budgets" use:link class="nav-link">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Orçamentos
          </a>
        </div>

        <!-- User Menu & Mobile Toggle -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- User Info (Desktop) -->
          <div class="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div class="text-sm">
              <p class="font-medium text-gray-900">{user?.name}</p>
              <p class="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Administrador' : 'Funcionária'}</p>
            </div>
          </div>

          <!-- Logout Button (Desktop) -->
          <button on:click={handleLogout} class="hidden md:flex btn btn-secondary btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>

          <!-- Mobile Menu Button -->
          <button
            on:click={toggleMobileMenu}
            class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
            aria-label="Toggle menu"
          >
            {#if mobileMenuOpen}
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-gray-100 bg-white animate-slide-down">
        <div class="container-custom py-4 space-y-2">
          <!-- User Info Mobile -->
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 mb-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="font-semibold text-gray-900">{user?.name}</p>
              <p class="text-sm text-gray-600">{user?.role === 'ADMIN' ? 'Administrador' : 'Funcionária'}</p>
            </div>
          </div>

          <!-- Mobile Nav Links -->
          <a 
            href="/dashboard" 
            use:link 
            on:click={closeMobileMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>

          <a 
            href="/patients" 
            use:link 
            on:click={closeMobileMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Pacientes
          </a>

          <a 
            href="/budgets" 
            use:link 
            on:click={closeMobileMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Orçamentos
          </a>

          <!-- Mobile Logout -->
          <button 
            on:click={handleLogout}
            class="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-danger-50 transition-colors text-danger-600 font-medium mt-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </div>
    {/if}
  </nav>
{/if}
