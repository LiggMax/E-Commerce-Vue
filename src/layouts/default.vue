<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useThemeToggle } from '@/composables/useTheme'

  // 初始化主题
  const { loadTheme } = useThemeToggle()
  loadTheme()
</script>
