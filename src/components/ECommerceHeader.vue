<template>
  <v-app-bar
    :elevation="2"
    height="80"
  >
    <v-container class="px-4" fluid>
      <v-row align="center" no-gutters>
        <!-- Logo -->
        <v-col cols="2">
          <v-btn
            class=""
            to="/"
            variant="text"
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

        <!-- Navigation Menu -->
        <v-col cols="4">
          <v-btn-toggle
            class="ml-4"
            variant="text"
          >
            <v-btn
              v-for="item in navItems"
              :key="item.title"
              class="mx-1 "
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
        <v-col class="text-right" cols="2">
          <!-- Theme Toggle -->
          <v-btn
            class="mr-2"
            :icon="isDark ? 'mdi-heart-outline' : 'mdi-heart-outline'"
            variant="text"
            @click="toggleTheme"
          >
            <v-tooltip activator="parent" location="bottom">
              {{ isDark ? '切换到浅色模式' : '切换到深色模式' }}
            </v-tooltip>
          </v-btn>

          <v-btn
            class="mr-2"
            icon="mdi-heart-outline"
            variant="text"
          >
            <v-icon />
            <v-badge
              v-if="wishlistCount > 0"
              color="error"
              :content="wishlistCount"
              floating
            />
          </v-btn>

          <v-btn
            class="mr-2"
            icon="mdi-cart-outline"
            variant="text"
          >
            <v-icon />
            <v-badge
              v-if="cartCount > 0"
              color="primary"
              :content="cartCount"
              floating
            />
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
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useThemeToggle } from '@/composables/useTheme'

  const searchQuery = ref('')
  const cartCount = ref(3)
  const wishlistCount = ref(5)

  // 主题切换功能
  const { isDark, toggleTheme } = useThemeToggle()

  const navItems = [
    { title: '首页', to: '/' },
    { title: '分类', to: '/categories' },
    { title: '热销', to: '/bestsellers' },
    { title: '新品', to: '/new-arrivals' },
    { title: '优惠', to: '/deals' },
  ]

  const userMenuItems = [
    { title: '我的账户', icon: 'mdi-account', action: () => console.log('账户') },
    { title: '订单历史', icon: 'mdi-package-variant', action: () => console.log('订单') },
    { title: '收藏夹', icon: 'mdi-heart', action: () => console.log('收藏') },
    { title: '设置', icon: 'mdi-cog', action: () => console.log('设置') },
    { title: '退出登录', icon: 'mdi-logout', action: () => console.log('退出') },
  ]

  function handleSearch () {
    console.log('搜索:', searchQuery.value)
  }
</script>

<style scoped>
:deep(.v-field--appended) {
  padding-inline-end: 0 !important;
}
</style>
