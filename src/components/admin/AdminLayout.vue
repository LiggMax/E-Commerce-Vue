<template>
  <v-app>
    <!-- 侧边导航栏 -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!mobile"
      :temporary="mobile"
      width="280"
      color="surface"
    >
      <!-- Logo区域 -->
      <v-list-item class="px-4 py-3">
        <template #prepend>
          <v-icon color="primary" size="32">mdi-shield-crown</v-icon>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          后台管理系统
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <!-- 导航菜单 -->
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :value="item.value"
          color="primary"
          rounded="xl"
          class="mx-2 my-1"
        />
      </v-list>

      <!-- 底部用户信息 -->
      <template #append>
        <v-divider />
        <v-list>
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="管理员"
            subtitle="admin@example.com"
          >
            <template #append>
              <v-btn
                icon="mdi-logout"
                variant="text"
                size="small"
                @click="handleLogout"
              />
            </template>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- 顶部应用栏 -->
    <v-app-bar color="surface" elevation="1">
      <!-- 移动端菜单按钮 -->
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
      />

      <!-- 面包屑导航 -->
      <v-breadcrumbs
        :items="breadcrumbs"
        class="pa-0"
      >
        <template #prepend>
          <v-icon size="small">mdi-home</v-icon>
        </template>
        <template #divider>
          <v-icon size="small">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <v-spacer />

      <!-- 右侧工具栏 -->
      <v-btn
        icon="mdi-bell"
        variant="text"
        size="small"
      />
      
      <v-btn
        icon="mdi-cog"
        variant="text"
        size="small"
      />

      <!-- 主题切换 -->
      <v-btn
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        size="small"
        @click="toggleTheme"
      />
    </v-app-bar>

    <!-- 主要内容区域 -->
    <v-main>
      <v-container fluid class="pa-4">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { useDisplay } from 'vuetify'

// 主题管理
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

// 响应式设计
const { mobile } = useDisplay()
const drawer = ref(!mobile.value)

// 路由相关
const router = useRouter()
const route = useRoute()

// 菜单项配置
const menuItems = [
  {
    title: '仪表盘',
    icon: 'mdi-view-dashboard',
    value: 'dashboard',
    to: '/admin/dashboard'
  },
  {
    title: '用户管理',
    icon: 'mdi-account-group',
    value: 'users',
    to: '/admin/users'
  },
  {
    title: '内容管理',
    icon: 'mdi-file-document',
    value: 'content',
    to: '/admin/content'
  },
  {
    title: '订单管理',
    icon: 'mdi-shopping',
    value: 'orders',
    to: '/admin/orders'
  },
  {
    title: '系统设置',
    icon: 'mdi-cog',
    value: 'settings',
    to: '/admin/settings'
  }
]

// 面包屑导航
const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const crumbs = [
    { title: '首页', to: '/admin/dashboard' }
  ]

  if (pathSegments.length > 1) {
    const currentMenuItem = menuItems.find(item => 
      item.to === route.path
    )
    if (currentMenuItem) {
      crumbs.push({ 
        title: currentMenuItem.title, 
        to: route.path 
      })
    }
  }

  return crumbs
})

// 退出登录
const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('remember_user')
  // 跳转到登录页面
  router.push('/admin/login')
}

// 监听屏幕尺寸变化
watch(mobile, (newVal) => {
  drawer.value = !newVal
})
</script>

<style scoped>
/* 自定义样式 */
.v-navigation-drawer {
  border-right: 1px solid rgb(var(--v-theme-surface-variant));
}

.v-app-bar {
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

/* 优化移动端体验 */
@media (max-width: 960px) {
  .v-container {
    padding: 12px !important;
  }
}
</style> 