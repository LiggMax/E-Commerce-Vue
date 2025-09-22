<template>
  <v-app>
    <template v-if="!isAdminRoute">
      <!-- Header Navigation -->
      <ECommerceHeader />
    </template>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <template v-if="!isAdminRoute">
      <ECommerceFooter />
    </template>
  </v-app>
</template>

<script lang="ts" setup>
import { useThemeToggle } from '@/composables/useTheme'

// 初始化主题
const { loadTheme } = useThemeToggle()
loadTheme()

// 获取当前路由
const route = useRoute()

// 判断是否为管理后台路由
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>
