<template>
  <v-app-bar
    :elevation="2"
    height="70"
  >
    <v-container class="px-4" fluid>
      <v-row align="center" no-gutters>
        <!-- 手机：徽标 + 菜单切换 -->
        <v-col class="d-flex align-center justify-space-between d-md-none" cols="12">
          <!-- Mobile Menu Toggle -->
          <v-app-bar-nav-icon @click="drawer = !drawer" />

          <!-- Logo -->
          <v-btn to="/" variant="text">
            <v-icon class="mr-1" color="primary" icon="mdi-storefront" size="24" />
            <span class="text-h6 font-weight-bold">ShopVue</span>
          </v-btn>

          <!-- Mobile Actions -->
          <div class="d-flex align-center">
            <v-btn icon="mdi-magnify" variant="text" @click="searchDialog = true" />
          </div>
        </v-col>

        <!-- 桌面版：完整标题 -->
        <template v-if="$vuetify.display.mdAndUp">
          <!-- Logo -->
          <v-col cols="2">
            <v-btn to="/" variant="text">
              <v-icon class="mr-2" color="primary" icon="mdi-storefront" size="32" />
              <span class="text-h5 font-weight-bold primary--text">ShopVue</span>
            </v-btn>
          </v-col>

          <!-- 导航菜单 -->
          <v-col cols="4">
            <v-btn-toggle class="ml-4" variant="text">
              <v-btn
                v-for="item in navItems"
                :key="item.title"
                class="mx-1"
                :to="item.to"
                variant="text"
              >
                {{ item.title }}
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <!-- Search Bar -->
          <v-col cols="4">
            <v-text-field
              v-model="searchQuery"
              class="mx-4"
              density="compact"
              hide-details
              placeholder="搜索产品..."
              prepend-inner-icon="mdi-magnify"
              rounded
              variant="outlined"
            >
              <template #append-inner>
                <v-btn
                  color="primary"
                  icon="mdi-magnify"
                  size="small"
                  variant="flat"
                  @click="handleSearch"
                />
              </template>
            </v-text-field>
          </v-col>

          <!-- User Actions -->
          <v-col class="text-right">
            <!-- Theme Toggle -->
            <v-btn
              class="mr-2"
              :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              variant="text"
              @click="toggleTheme"
            >
              <v-icon />
              <v-tooltip activator="parent" location="bottom">
                {{ isDark ? '切换到浅色模式' : '切换到深色模式' }}
              </v-tooltip>
            </v-btn>

            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-account-circle"
                  variant="text"
                  v-bind="props"
                />
              </template>
              <v-list>
                <v-list-item
                  v-for="item in userMenuItems"
                  :key="item.title"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  @click="item.action"
                />
              </v-list>
            </v-menu>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" location="left" temporary>
    <v-list>
      <v-list-item
        prepend-icon="mdi-account-circle"
        subtitle="游客"
        title="欢迎回来"
      />
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
      />
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in userMenuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="item.action"
      />

      <v-list-item
        :prepend-icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :title="isDark ? '浅色模式' : '深色模式'"
        @click="toggleTheme"
      />
    </v-list>
  </v-navigation-drawer>

  <!-- 移动搜索对话框 -->
  <v-navigation-drawer v-model="searchDialog" location="end">
    <v-text-field
      class="ma-5"
      label="搜索商品"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import { useThemeToggle } from '@/composables/useTheme.ts'

  const display = useDisplay()
  const searchQuery = ref('')
  const drawer = ref(false)
  const searchDialog = ref(false)

  // 主题切换功能
  const { isDark, toggleTheme } = useThemeToggle()

  const navItems = [
    { title: '首页', to: '/', icon: 'mdi-home' },
    { title: '分类', to: '/categories', icon: 'mdi-view-grid' },
    { title: '热销', to: '/bestsellers', icon: 'mdi-fire' },
    { title: '新品', to: '/new-arrivals', icon: 'mdi-new-box' },
    { title: '优惠', to: '/deals', icon: 'mdi-tag' },
  ]

  const userMenuItems = [
    { title: '我的账户', icon: 'mdi-account', action: () => console.log('账户') },
    { title: '订单历史', icon: 'mdi-package-variant', action: () => console.log('订单') },
    { title: '收藏夹', icon: 'mdi-heart', action: () => console.log('收藏') },
    { title: '设置', icon: 'mdi-cog', action: () => console.log('设置') },
    { title: '退出登录', icon: 'mdi-logout', action: () => console.log('退出') },
  ]
  function closeSearchDialog () {
    searchDialog.value = false
  }

  function handleSearch () {
    if (!searchQuery.value.trim()) return
    console.log('搜索:', searchQuery.value)
    // 这里可以添加实际的搜索逻辑
    setTimeout(() => {
      closeSearchDialog()
    }, 1000)
  }

  watch(() => display.mdAndUp.value, isMdAndUp => {
    if (isMdAndUp) {
      // 切换到桌面端时，关闭所有移动端抽屉
      drawer.value = false
      searchDialog.value = false
    }
  })
</script>

<style scoped>
:deep(.v-field--appended) {
  padding-inline-end: 0 !important;
}
</style>
