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
            <v-btn
              class="logo-btn"
              variant="text"
              @click="router.push('/')"
            >
              <v-icon
                class="mr-2"
                color="primary"
                icon="mdi-storefront"
                size="32"
              />
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
              class="mx-4 "
              density="compact"
              hide-details
              placeholder="搜索产品..."
              rounded
              variant="outlined"
              @keyup.enter="handleSearch"
            >
              <template #append-inner>
                <v-btn
                  class="search-btn"
                  color="primary"
                  size="small"
                  variant="flat"
                  @click="handleSearch"
                >
                  <v-icon class="mr-1" icon="mdi-magnify" size="16" />
                  搜索
                </v-btn>
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

            <v-btn
              v-if="!token"
              icon="mdi-account-circle"
              variant="text"
              @click="authDialog = true"
            />

            <v-menu v-else-if="token">
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
  <v-navigation-drawer v-model="searchDialog" location="end" temporary>
    <v-text-field
      class="ma-5"
      label="搜索商品"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />
  </v-navigation-drawer>

  <AuthDialog v-if="authDialog" v-model="authDialog" />
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import AuthDialog from '@/components/client/AuthDialog.vue'
  import { useThemeToggle } from '@/composables/useTheme.ts'
  import router from '@/router'
  import { userTokenStore } from '@/stores/client/clientToken.ts'

  const display = useDisplay()
  const searchQuery = ref('')
  const drawer = ref(false)
  const searchDialog = ref(false)
  const authDialog = ref(false)

  // 主题切换功能
  const { isDark, toggleTheme } = useThemeToggle()
  const { token } = userTokenStore()

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
    { title: '退出登录', icon: 'mdi-logout', action: () => logout() },
  ]

  function closeSearchDialog () {
    searchDialog.value = false
  }

  function handleSearch () {
    if (!searchQuery.value.trim()) return
    router.push({
      path: '/client/Search',
      query: {
        keyword: searchQuery.value,
      },
    })
  }

  /**
   * 登出
   */
  function logout () {
    console.log('登出')
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
/* 椭圆形搜索按钮样式 */
.search-btn {
  border-radius: 20px !important;
  padding: 8px 16px !important;
  min-width: 80px !important;
  height: 36px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

.search-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

/* 修正按钮在搜索框内的位置  */
:deep(.v-field--appended) {
  padding-inline-end: 3px !important;
}
</style>
