<template>
  <div class="orders-tab">
    <!-- 订单筛选 -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-tabs
          v-model="activeStatus"
          align-tabs="start"
          color="primary"
        >
          <v-tab value="all">全部订单</v-tab>
          <v-tab value="pending">待付款</v-tab>
          <v-tab value="paid">待发货</v-tab>
          <v-tab value="shipped">待收货</v-tab>
          <v-tab value="completed">已完成</v-tab>
          <v-tab value="cancelled">已取消</v-tab>
        </v-tabs>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchKeyword"
          density="compact"
          hide-details
          label="搜索订单号"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @input="handleSearch"
        />
      </v-col>
    </v-row>

    <!-- 订单列表 -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular color="primary" indeterminate size="64" />
      <p class="text-body-2 text-medium-emphasis mt-4">加载订单中...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-package-variant-closed" size="64" />
      <h3 class="text-h6 text-medium-emphasis">暂无订单</h3>
      <p class="text-body-2 text-medium-emphasis">您还没有相关订单</p>
      <v-btn
        class="mt-4"
        color="primary"
        variant="outlined"
        @click=""
      >
        去购物
      </v-btn>
    </div>

    <div v-else>
      <v-card
        v-for="order in paginatedOrders"
        :key="order.id"
        class="mb-4"
        elevation="1"
      >
        <!-- 订单头部 -->
        <v-card-subtitle class="d-flex justify-space-between align-center">
          <div>
            <span class="text-h6">订单号：{{ order.orderNumber }}</span>
            <v-chip
              class="ml-3"
              :color="getStatusColor(order.status)"
              size="small"
            >
              {{ getStatusText(order.status) }}
            </v-chip>
          </div>
          <span class="text-body-2 text-medium-emphasis">
            {{ formatDate(order.createTime) }}
          </span>
        </v-card-subtitle>

        <v-divider />

        <!-- 商品列表 -->
        <v-card-text>
          <div
            v-for="item in order.items"
            :key="item.id"
            class="d-flex align-center mb-3"
          >
            <v-avatar class="mr-4" size="60">
              <v-img :src="item.image" />
            </v-avatar>
            <div class="flex-grow-1">
              <h4 class="text-subtitle-1 font-weight-medium">{{ item.name }}</h4>
              <p class="text-body-2 text-medium-emphasis mb-1">
                规格：{{ item.specification }}
              </p>
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2">数量：{{ item.quantity }}</span>
                <span class="text-h6 font-weight-bold text-primary">
                  ¥{{ item.price }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- 订单底部 -->
        <v-card-actions class="pa-4">
          <div class="flex-grow-1">
            <span class="text-body-2">共 {{ order.items.length }} 件商品</span>
            <span class="text-h6 font-weight-bold text-primary ml-2">
              合计：¥{{ order.totalAmount }}
            </span>
          </div>

          <div class="d-flex gap-2">
            <v-btn
              v-if="order.status === 'pending'"
              color="primary"
              variant="flat"
              @click=""
            >
              立即付款
            </v-btn>

            <v-btn
              v-if="order.status === 'shipped'"
              color="success"
              variant="outlined"
              @click=""
            >
              确认收货
            </v-btn>

            <v-btn
              variant="outlined"
              @click="viewOrderDetail(order)"
            >
              查看详情
            </v-btn>

            <v-btn
              v-if="order.status === 'pending'"
              color="error"
              variant="text"
              @click=""
            >
              取消订单
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>

      <!-- 分页 -->
      <v-pagination
        v-model="currentPage"
        class="mt-6"
        :length="totalPages"
        :total-visible="5"
        @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useNotification } from '@/utils/notification.ts'

  const { showSuccess } = useNotification()

  // 响应式数据
  const loading = ref(false)
  const activeStatus = ref('all')
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  // 订单数据
  interface OrderItem {
    id: string
    name: string
    image: string
    price: number
    quantity: number
    specification: string
  }

  interface Order {
    id: string
    orderNumber: string
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
    createTime: string
    totalAmount: number
    items: OrderItem[]
  }

  const orders = ref<Order[]>([])

  // 计算属性
  const filteredOrders = computed(() => {
    let filtered = orders.value

    // 按状态筛选
    if (activeStatus.value !== 'all') {
      filtered = filtered.filter(order => order.status === activeStatus.value)
    }

    // 按关键词搜索
    if (searchKeyword.value) {
      filtered = filtered.filter(order =>
        order.orderNumber.includes(searchKeyword.value),
      )
    }

    return filtered
  })

  const totalPages = computed(() =>
    Math.ceil(filteredOrders.value.length / pageSize.value),
  )

  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredOrders.value.slice(start, end)
  })

  // 获取状态文本
  function getStatusText (status: string) {
    const statusMap: Record<string, string> = {
      pending: '待付款',
      paid: '待发货',
      shipped: '待收货',
      completed: '已完成',
      cancelled: '已取消',
    }
    return statusMap[status] || '未知状态'
  }

  // 获取状态颜色
  function getStatusColor (status: string) {
    const colorMap: Record<string, string> = {
      pending: 'warning',
      paid: 'info',
      shipped: 'primary',
      completed: 'success',
      cancelled: 'error',
    }
    return colorMap[status] || 'grey'
  }

  // 格式化日期
  function formatDate (dateString: string) {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 查看订单详情
  function viewOrderDetail (order: Order) {
    // 跳转到订单详情页
    // this.$router.push(`/orders/${order.id}`)
    console.log('查看订单详情:', order)
  }

  // 搜索处理
  function handleSearch () {
    currentPage.value = 1 // 重置到第一页
  }

  // 分页处理
  function handlePageChange (page: number) {
    currentPage.value = page
  }

  // 监听状态变化
  watch(activeStatus, () => {
    currentPage.value = 1
  })

  // 页面初始化
  onMounted(() => {})
</script>

<style scoped>
.orders-tab {
  max-width: 1000px;
  margin: 0 auto;
}

.gap-2 {
  gap: 8px;
}
</style>
