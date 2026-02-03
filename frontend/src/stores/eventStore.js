import { writable } from "svelte/store";

function createEventStore() {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    trigger: (event) => {
      set({ type: event, timestamp: Date.now() });
    },
    clear: () => set(null),
  };
}

export const events = createEventStore();

// Event types
export const EVENT_TYPES = {
  BUDGET_CREATED: "BUDGET_CREATED",
  BUDGET_UPDATED: "BUDGET_UPDATED",
  BUDGET_DELETED: "BUDGET_DELETED",
  PATIENT_CREATED: "PATIENT_CREATED",
  PATIENT_UPDATED: "PATIENT_UPDATED",
  PATIENT_DELETED: "PATIENT_DELETED",
};
