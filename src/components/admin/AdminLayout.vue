<template>
  <v-app>
    <!-- 侧边导航栏 -->
    <v-navigation-drawer
      v-model="drawer"
      color="surface"
      :permanent="!mobile"
      :temporary="mobile"
      width="240"
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
        <template v-for="item in menuItems" :key="item.value">
          <!-- 有子菜单的项目 -->
          <v-list-group v-if="item.children" :value="item.value">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                class="mx-2 my-1"
                color="primary"
                :prepend-icon="item.icon"
                rounded="xl"
                :title="item.title"
              />
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.value"
              class="mx-2 my-1 ml-4"
              color="primary"
              density="compact"
              :prepend-icon="child.icon"
              rounded="xl"
              :title="child.title"
              :to="child.to"
              :value="child.value"
            />
          </v-list-group>

          <!-- 没有子菜单的项目 -->
          <v-list-item
            v-else
            class="mx-2 my-1"
            color="primary"
            :prepend-icon="item.icon"
            rounded="xl"
            :title="item.title"
            :to="item.to"
            :value="item.value"
          />
        </template>
      </v-list>

      <!-- 底部用户信息 -->
      <template #append>
        <v-divider />
        <v-list>
          <v-list-item
            prepend-icon="mdi-account-circle"
            subtitle="admin@example.com"
            title="管理员"
          >
            <template #append>
              <v-btn
                icon="mdi-logout"
                size="small"
                variant="text"
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
        class="pa-0"
        :items="breadcrumbs"
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
        size="small"
        variant="text"
      />

      <v-btn
        icon="mdi-cog"
        size="small"
        variant="text"
      />

      <!-- 主题切换 -->
      <v-btn
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        size="small"
        variant="text"
        @click="toggleTheme"
      />
    </v-app-bar>

    <!-- 主要内容区域 -->
    <v-main>
      <v-container class="pa-4" fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useDisplay, useTheme } from 'vuetify'

  // 主题管理
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)

  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  // 响应式设计
  const { mobile } = useDisplay()
  const drawer = ref(!mobile.value)

  // 路由相关
  const router = useRouter()
  const route = useRoute()

  // 菜单项配置（支持二级菜单）
  const menuItems = [
    {
      title: '仪表盘',
      icon: 'mdi-view-dashboard',
      value: 'dashboard',
      to: '/admin/dashboard',
    },
    {
      title: '用户管理',
      icon: 'mdi-account-group',
      value: 'users',
      to: '/admin/users',
    },
    {
      title: '内容管理',
      icon: 'mdi-file-document',
      value: 'content',
      children: [
        {
          title: '轮播图管理',
          icon: 'mdi-view-carousel',
          value: 'carousel',
          to: '/admin/content/carousel',
        },
        {
          title: '文章管理',
          icon: 'mdi-post',
          value: 'articles',
          to: '/admin/content/articles',
        },
        {
          title: '页面管理',
          icon: 'mdi-web',
          value: 'pages',
          to: '/admin/content/pages',
        },
      ],
    },
    {
      title: '订单管理',
      icon: 'mdi-shopping',
      value: 'orders',
      to: '/admin/orders',
    },
    {
      title: '系统设置',
      icon: 'mdi-cog',
      value: 'settings',
      to: '/admin/settings',
    },
  ]

  // 获取所有菜单项（包括子菜单）
  function getAllMenuItems () {
    const allItems: any[] = []
    for (const item of menuItems) {
      if (item.children) {
        allItems.push(...item.children)
      } else if (item.to) {
        allItems.push(item)
      }
    }
    return allItems
  }

  // 面包屑导航
  const breadcrumbs = computed(() => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const crumbs = [
      { title: '首页', to: '/admin/dashboard' },
    ]

    if (pathSegments.length > 1) {
      const allMenuItems = getAllMenuItems()
      const currentMenuItem = allMenuItems.find(item =>
        item.to === route.path,
      )

      if (currentMenuItem) {
        // 如果是子菜单项，添加父菜单到面包屑
        const parentMenu = menuItems.find(parent =>
          parent.children?.some(child => child.to === route.path),
        )

        if (parentMenu) {
          crumbs.push({
            title: parentMenu.title,
            to: '#',
          })
        }

        crumbs.push({
          title: currentMenuItem.title,
          to: route.path,
        })
      }
    }

    return crumbs
  })

  // 退出登录
  function handleLogout () {
    // 清除登录状态
    localStorage.removeItem('remember_user')
    // 跳转到登录页面
    router.push('/admin/login')
  }

  // 监听屏幕尺寸变化
  watch(mobile, newVal => {
    drawer.value = !newVal
  })
</script>

<style scoped>
</style>
