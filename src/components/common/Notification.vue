<template>
  <v-snackbar
    v-model="notification.snackbar.show"
    :color="notification.snackbar.color"
    :timeout="notification.snackbar.timeout"
  >
    {{ notification.snackbar.text }}
    <template #actions>
      <v-btn
        variant="text"
        @click="notification.snackbar.show = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
  import notification from '@/utils/notification'
</script>
