<template>
  <v-app>
    <!-- 头部导航 - 只在非管理后台页面显示 -->
    <ECommerceHeader v-if="!isAdminRoute" />
    
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
    
    <!-- 页脚 - 只在非管理后台页面显示 -->
    <ECommerceFooter v-if="!isAdminRoute" />
  </v-app>
</template>

<script lang="ts" setup>
  import { useThemeToggle } from '@/composables/useTheme'
  import ECommerceHeader from '@/components/client/ECommerceHeader.vue'
  import ECommerceFooter from '@/components/client/ECommerceFooter.vue'

  // 初始化主题
  const { loadTheme } = useThemeToggle()
  loadTheme()

  // 检查是否为管理后台路由
  const route = useRoute()
  const isAdminRoute = computed(() => {
    return route.path.startsWith('/admin')
  })
</script>
