<template>
  <v-app>
    <!-- 直接渲染页面内容，不添加额外的头部和底部 -->
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
  import { useThemeToggle } from '@/composables/useTheme'

  // 初始化主题
  const { loadTheme } = useThemeToggle()
  loadTheme()
</script>
