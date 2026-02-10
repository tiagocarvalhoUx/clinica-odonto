import { authStore } from "../stores/authStore.js";
import { get } from "svelte/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const auth = get(authStore);
  return {
    "Content-Type": "application/json",
    ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
  };
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      authStore.logout();
    }
    throw new Error(data.error || "Erro na requisição");
  }

  return data;
}

export const api = {
  // Auth endpoints
  login: (email, password) => authStore.login(email, password),
  logout: () => authStore.logout(),

  // Report endpoints
  reports: {
    exportBudgets: async () => {
      const auth = get(authStore);
      const response = await fetch(`${API_URL}/reports/export/budgets`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao exportar relatório");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-orcamentos-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },

    exportPatients: async () => {
      const auth = get(authStore);
      const response = await fetch(`${API_URL}/reports/export/patients`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao exportar relatório");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-pacientes-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  },

  // Patient endpoints
  patients: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/patients`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Dentist endpoints
  dentists: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/dentists`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getActive: async () => {
      const response = await fetch(`${API_URL}/dentists/active`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_URL}/dentists/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await fetch(`${API_URL}/dentists`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await fetch(`${API_URL}/dentists/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/dentists/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Budget endpoints
  budgets: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/budgets`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_URL}/budgets/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByPatientId: async (patientId) => {
      const response = await fetch(`${API_URL}/budgets/patient/${patientId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    create: async (data) => {
      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (id, data) => {
      const response = await fetch(`${API_URL}/budgets/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    updateStatus: async (id, status) => {
      const response = await fetch(`${API_URL}/budgets/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/budgets/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },
};
