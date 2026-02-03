<script>
  import { notifications } from '../stores/notificationStore.js';
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
  {#each $notifications as notification (notification.id)}
    <div
      class="p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 {
        notification.type === 'success' ? 'bg-green-500 text-white' :
        notification.type === 'error' ? 'bg-red-500 text-white' :
        notification.type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
      }"
    >
      <div class="flex items-center justify-between">
        <p class="font-medium">{notification.message}</p>
        <button
          on:click={() => notifications.remove(notification.id)}
          class="ml-4 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  {/each}
</div>
