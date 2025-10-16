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
              :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              size="large"
              variant="text"
              @click="toggleTheme"
            >
              <v-icon />
              <v-tooltip activator="parent" location="bottom">
                {{ isDark ? '切换到浅色模式' : '切换到深色模式' }}
              </v-tooltip>
            </v-btn>

            <v-btn
              v-if="!isLoggedIn"
              icon="mdi-account-circle"
              size="large"
              variant="text"
              @click="authDialog = true"
            />

            <v-menu v-else>
              <template #activator="{ props }">
                <v-avatar
                  v-if="userInfo?.avatar"
                  v-bind="props"
                  class="cursor-pointer"
                  size="40"
                >
                  <v-img :src="userInfo.avatar" />
                </v-avatar>
                <v-btn
                  v-else
                  icon="mdi-account-circle"
                  size="large"
                  variant="text"
                  v-bind="props"
                />
              </template>
              <v-list>
                <!-- 用户信息显示 -->
                <v-list-item v-if="userInfo">
                  <template #prepend>
                    <v-avatar size="40">
                      <v-img v-if="userInfo.avatar" :src="userInfo.avatar" />
                      <v-icon v-else icon="mdi-account-circle" />
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ userInfo.nickName || userInfo.account }}</v-list-item-title>
                  <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider />

                <!-- 用户菜单项 -->
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

  <!-- 移动导航抽滑器 -->
  <v-navigation-drawer v-model="drawer" location="left" temporary>
    <v-list v-if="!isLoggedIn" class="cursor-pointer">
      <v-list-item
        prepend-icon="mdi-account-circle"
        subtitle="游客"
        title="登录"
        @click="authDialog = true"
      />
    </v-list>
    <div v-if="userInfo" class="pa-3 d-flex align-center">
      <v-avatar size="40">
        <v-img v-if="userInfo.avatar" :src="userInfo.avatar" />
        <v-icon v-else icon="mdi-account-circle" />
      </v-avatar>
      <div class="ml-2">
        <v-list-item-title>{{ userInfo.nickName || userInfo.account }}</v-list-item-title>
        <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
      </div>
    </div>

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

  <AuthDialog
    v-if="authDialog"
    v-model="authDialog"
    @login-success="handleLoginSuccess"
  />
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import AuthDialog from '@/components/client/AuthDialog.vue'
  import { useThemeToggle } from '@/composables/useTheme.ts'
  import { getUserInfoService } from '@/http/client/user.ts'
  import router from '@/router'
  import { useAppStore } from '@/stores/client/app.ts'
  import { userTokenStore } from '@/stores/client/clientToken.ts'

  const display = useDisplay()
  const searchQuery = ref('')
  const drawer = ref(false)
  const searchDialog = ref(false)
  const appStore = useAppStore()
  const authDialog = computed({
    get: () => appStore.authDialog,
    set: (v: boolean) => appStore.setAuthDialog(v),
  })

  // 主题切换功能
  const { isDark, toggleTheme } = useThemeToggle()
  const tokenStore = userTokenStore()

  // 计算属性：检查用户是否已登录
  const isLoggedIn = computed(() => !!tokenStore.token)

  interface UserInfo {
    nickName: string
    account: string
    email: string
    avatar: string
    role: string
    createTime: string
    lastLoginTime: string
  }

  const userInfo = ref<UserInfo>()

  const navItems = [
    { title: '首页', to: '/', icon: 'mdi-home' },
    { title: '分类', to: '/categories', icon: 'mdi-view-grid' },
    { title: '热销', to: '/bestsellers', icon: 'mdi-fire' },
    { title: '新品', to: '/new-arrivals', icon: 'mdi-new-box' },
    { title: '优惠', to: '/deals', icon: 'mdi-tag' },
  ]

  const userMenuItems = [
    { title: '个人中心', icon: 'mdi-account', action: () => gotoPersonalCenter() },
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
   * goto 个人中心
   */
  function gotoPersonalCenter () {
    router.push('/client/UserCenter')
  }

  /**
   * 处理登录成功事件
   */
  async function handleLoginSuccess () {
    // 关闭认证对话框
    authDialog.value = false
    // 获取用户信息
    await getUserInfo()
    console.log('登录成功，用户状态已更新')
  }

  /**
   * 获取用户信息
   */
  async function getUserInfo () {
    const res = await getUserInfoService()
    userInfo.value = res.data
  }

  /**
   * 登出
   */
  function logout () {
    tokenStore.removeToken()
    authDialog.value = false
    console.log('用户已登出')
  }

  // 监听登录状态变化，自动获取用户信息
  watch(isLoggedIn, async newValue => {
    if (newValue && !userInfo.value) {
      // 用户已登录但还没有用户信息，获取用户信息
      await getUserInfo()
    } else if (!newValue) {
      // 用户登出，清空用户信息
      userInfo.value = undefined
    }
  }, { immediate: true })

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

/* 用户头像样式 */
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
  transform: scale(1.05);
  transition: all 0.2s ease;
}
</style>
