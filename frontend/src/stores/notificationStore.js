import { writable } from "svelte/store";

function createNotificationStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    add: (message, type = "info", duration = 3000) => {
      const id = Date.now();
      update((notifications) => [...notifications, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          update((notifications) => notifications.filter((n) => n.id !== id));
        }, duration);
      }
    },
    remove: (id) => {
      update((notifications) => notifications.filter((n) => n.id !== id));
    },
    success: (message, duration) => {
      return createNotificationStore().add(message, "success", duration);
    },
    error: (message, duration) => {
      return createNotificationStore().add(message, "error", duration);
    },
    warning: (message, duration) => {
      return createNotificationStore().add(message, "warning", duration);
    },
  };
}

export const notifications = createNotificationStore();
