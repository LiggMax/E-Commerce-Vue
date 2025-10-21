<template>
  <v-container class="ma-auto" fluid max-width="1600">
    <v-row>
      <!-- 侧边栏 -->
      <v-col cols="12" md="3">
        <v-card class="sticky-sidebar" elevation="2">
          <!-- 用户信息卡片 -->
          <v-card class="ma-4" elevation="0">
            <v-card-text class="text-center pa-6">
              <v-avatar class="mb-4" size="80">
                <v-img v-if="userInfo?.avatar" :src="userInfo.avatar" />
                <v-icon v-else color="primary" icon="mdi-account-circle" size="80" />
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">
                {{ userInfo?.nickName || userInfo?.account || '用户' }}
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ userInfo?.email || '暂无邮箱' }}
              </p>
            </v-card-text>
          </v-card>

          <!-- 导航菜单 -->
          <v-list density="compact" nav>
            <v-list-item
              v-for="item in menuItems"
              :key="item.key"
              :active="activeTab === item.key"
              class="text-md-h5"
              :color="activeTab === item.key ? 'primary' : undefined"
              :prepend-icon="item.icon"
              :title="item.title"
              @click="handleMenuClick(item.key)"
            />
          </v-list>
        </v-card>
      </v-col>

      <!-- 主内容区 -->
      <v-col cols="12" md="9">
        <v-card elevation="2" min-width="600px">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" :icon="currentMenuItem?.icon" />
            {{ currentMenuItem?.title }}
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <!-- 个人资料 -->
            <div v-if="activeTab === 'profile'">
              <ProfileTab :user-info="userInfo" @update="handleUserUpdate" />
            </div>

            <!-- 订单管理 -->
            <div v-else-if="activeTab === 'orders'">
              <OrdersTab />
            </div>

            <!-- 收藏夹 -->
            <div v-else-if="activeTab === 'favorites'">
              <FavoritesTab />
            </div>

            <!-- 地址管理 -->
            <div v-else-if="activeTab === 'addresses'">
              <AddressesTab />
            </div>

            <!-- 账户设置 -->
            <!--            <div v-else-if="activeTab === 'settings'">-->
            <!--              <SettingsTab />-->
            <!--            </div>-->

            <!-- 默认显示 -->
            <div v-else class="text-center py-12">
              <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-account-circle" size="64" />
              <h3 class="text-h6 text-medium-emphasis">欢迎来到用户中心</h3>
              <p class="text-body-2 text-medium-emphasis">请选择左侧菜单项开始使用</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import AddressesTab from '@/components/client/user/AddressesTab.vue'
  import FavoritesTab from '@/components/client/user/FavoritesTab.vue'
  import OrdersTab from '@/components/client/user/OrdersTab.vue'
  import ProfileTab from '@/components/client/user/ProfileTab.vue'

  // import SettingsTab from '@/components/client/user/SettingsTab.vue'
  import { getUserInfoService } from '@/http/client/user.ts'
  import router from '@/router'
  import { userTokenStore } from '@/stores/client/clientToken.ts'
  import { useNotification } from '@/utils/notification.ts'

  const { showError } = useNotification()
  const tokenStore = userTokenStore()
  const route = useRoute()

  // 用户信息接口
  interface UserInfo {
    nickName: string
    account: string
    email: string
    avatar: string
    role: string
    createTime: string
    lastLoginTime: string
  }

  // 响应式数据
  const userInfo = ref<UserInfo>()
  const loading = ref(false)

  // 从路由中获取查询参数
  const activeTab = ref(route.query.tab as string || 'profile')

  // 菜单项配置
  const menuItems = [
    {
      key: 'profile',
      title: '个人资料',
      icon: 'mdi-account-edit',
    },
    {
      key: 'orders',
      title: '我的订单',
      icon: 'mdi-package-variant',
    },
    {
      key: 'favorites',
      title: '我的收藏',
      icon: 'mdi-heart',
    },
    {
      key: 'addresses',
      title: '收货地址',
      icon: 'mdi-map-marker',
    },
    {
      key: 'settings',
      title: '账户设置',
      icon: 'mdi-cog',
    },
  ]

  // 计算属性：当前菜单项
  const currentMenuItem = computed(() =>
    menuItems.find(item => item.key === activeTab.value),
  )

  // 获取用户信息
  async function getUserInfo () {
    if (!tokenStore.token) return

    loading.value = true
    try {
      const res = await getUserInfoService()
      userInfo.value = res.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      showError('获取用户信息失败')
    } finally {
      loading.value = false
    }
  }

  // 菜单点击
  function handleMenuClick (tabKey: string) {
    activeTab.value = tabKey
    router.replace({
      path: route.path,
      query: { ...route.query, tab: tabKey },
    })
  }

  // 处理用户信息更新
  function handleUserUpdate (updatedUserInfo: UserInfo) {
    userInfo.value = updatedUserInfo
  }

  // 页面初始化
  onMounted(() => {
    getUserInfo()
  })

  // 监听路由变化，同步activeTab
  watch(() => route.query.tab, newTab => {
    if (newTab && typeof newTab === 'string') {
      activeTab.value = newTab
    }
  })

  // 监听登录状态变化
  watch(() => tokenStore.token, newToken => {
    if (newToken) {
      getUserInfo()
    } else {
      userInfo.value = undefined
    }
  })
</script>

<style scoped>
  .sticky-sidebar {
    position: sticky;
    top: 80px;
    height: fit-content;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
  }

  /* 确保侧边栏在移动端不粘性定位 */
  @media (max-width: 960px) {
    .sticky-sidebar {
      position: static;
      max-height: none;
    }
  }
</style>
