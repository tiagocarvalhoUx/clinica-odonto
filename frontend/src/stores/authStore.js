import { writable } from "svelte/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  // Check if user is logged in on initialization
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    set({
      user: JSON.parse(storedUser),
      token: storedToken,
      isAuthenticated: true,
      loading: false,
    });
  } else {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  }

  return {
    subscribe,
    login: async (email, password) => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao fazer login");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        });

        return data;
      } catch (error) {
        throw error;
      }
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    },
    checkAuth: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token inválido");
        }

        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));

        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    },
  };
}

export const authStore = createAuthStore();
