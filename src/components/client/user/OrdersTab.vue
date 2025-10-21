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

    <div v-else-if="displayOrders.length === 0" class="text-center py-12">
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
        v-for="order in displayOrders"
        :key="order.id"
        class="mb-4"
        elevation="1"
      >
        <!-- 订单头部 -->
        <v-card-subtitle class="d-flex justify-space-between align-center">
          <div>
            <span class="text-h6">订单号：{{ order.orderNo }}</span>
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

        <!-- 商品信息 -->
        <v-card-text>
          <div class="d-flex align-center mb-3">
            <v-avatar class="mr-4" size="65">
              <v-img :src="order.image" />
            </v-avatar>
            <div class="flex-grow-1">
              <h4 class="text-subtitle-1 font-weight-medium">{{ order.title }}</h4>
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2">数量：{{ order.quantity }}</span>
                <span class="text-h6 font-weight-bold text-primary">
                  ¥{{ order.totalAmount }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- 订单底部 -->
        <v-card-actions class="pa-4">
          <div class="flex-grow-1">
            <span class="text-body-2">共 {{ order.quantity }} 件商品</span>
            <span class="text-h6 font-weight-bold text-primary ml-2">
              合计：¥{{ order.totalAmount }}
            </span>
          </div>

          <div class="d-flex gap-2">
            <v-btn
              v-if="order.status === 'UNPAID'"
              color="primary"
              variant="flat"
              @click=""
            >
              立即付款
            </v-btn>

            <v-btn
              v-if="order.status === 'DELIVERED'"
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
              v-if="order.status === 'UNPAID'"
              color="error"
              variant="text"
              @click="cancelOrder(order)"
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

  <!-- 确认取消订单弹窗 -->
  <ConfirmDeleteDialog
    v-model="showCancelDialog"
    cancel-text="继续保留"
    confirm-text="确认取消"
    :loading="cancelLoading"
    message="确定要取消这个订单吗？"
    :show-details="true"
    title="确认取消订单"
    @cancel="handleCancelDelete"
    @confirm="handleConfirmCancel"
  >
    <template #details>
      <div v-if="selectedOrder" class="text-left">
        <p class="mb-2"><strong>订单号：</strong>{{ selectedOrder.orderNo }}</p>
        <p class="mb-2"><strong>商品：</strong>{{ selectedOrder.title }}</p>
        <p class="mb-2"><strong>金额：</strong>¥{{ selectedOrder.totalAmount }}</p>
        <p class="text-error text-body-2">取消后订单将无法恢复，请谨慎操作</p>
      </div>
    </template>
  </ConfirmDeleteDialog>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import ConfirmDeleteDialog from '@/components/client/ConfirmDeleteDialog.vue'
  import { cancelOrderService, getOrderListService } from '@/http/client/order.ts'
  import { useNotification } from '@/utils/notification.ts'

  const route = useRoute()
  const router = useRouter()
  const { showSuccess } = useNotification()

  // 响应式数据
  const loading = ref(false)
  const activeStatus = ref('all')
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  // 确认删除弹窗相关
  const showCancelDialog = ref(false)
  const cancelLoading = ref(false)
  const selectedOrder = ref<OrderItem | null>(null)

  // 订单数据
  interface OrderItem {
    id: number
    title: string
    image: string
    quantity: number
    orderNo: string
    totalAmount: number
    payType: string | null
    status: string
    addressId: number
    remark: string
    createTime: string
    payTime: string | null
  }

  interface OrderResponse {
    total: number
    pages: number
    list: OrderItem[]
  }

  const orders = ref<OrderItem[]>([])
  const totalCount = ref(0)
  const totalPages = ref(0)

  // 计算属性 - 直接使用后端返回的数据，不进行前端分页
  const displayOrders = computed(() => {
    return orders.value
  })

  // 获取状态文本
  function getStatusText (status: string) {
    const statusMap: Record<string, string> = {
      UNPAID: '待支付',
      PAID: '已支付',
      DELIVERED: '已发货',
      COMPLETED: '已收货',
      CANCELED: '已取消',
      REFUNDING: '退款中',
      REFUNDED: '已退款',
    }
    return statusMap[status] || status
  }

  // 获取状态颜色
  function getStatusColor (status: string) {
    const colorMap: Record<string, string> = {
      UNPAID: 'warning',
      PAID: 'info',
      DELIVERED: 'primary',
      COMPLETED: 'success',
      CANCELED: 'error',
      REFUNDING: 'orange',
      REFUNDED: 'grey',
    }
    return colorMap[status] || 'grey'
  }

  // 格式化日期
  function formatDate (dateString: string) {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 获取订单列表
  async function getOrderList () {
    loading.value = true
    try {
      // 构建请求参数
      const params: any = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
      }

      // 添加状态筛选参数
      if (activeStatus.value !== 'all') {
        const statusMap: Record<string, string> = {
          pending: 'UNPAID',
          paid: 'PAID',
          shipped: 'DELIVERED',
          completed: 'COMPLETED',
          cancelled: 'CANCELED',
        }
        const targetStatus = statusMap[activeStatus.value]
        if (targetStatus) {
          params.status = targetStatus
        }
      }

      // 添加搜索参数
      if (searchKeyword.value) {
        params.keyword = searchKeyword.value
      }

      const response = await getOrderListService(params)
      const data = response.data as OrderResponse

      orders.value = data.list
      totalCount.value = data.total
      totalPages.value = data.pages

      console.log('获取订单列表成功:', response)
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 取消订单
  function cancelOrder (order: OrderItem) {
    selectedOrder.value = order
    showCancelDialog.value = true
  }

  // 确认取消订单
  async function handleConfirmCancel () {
    if (!selectedOrder.value) return

    cancelLoading.value = true
    try {
      await cancelOrderService(selectedOrder.value.orderNo)
      showSuccess('订单已取消')
      showCancelDialog.value = false
      // 重新获取订单列表
      await getOrderList()
    } catch (error) {
      console.error('取消订单失败:', error)
    } finally {
      cancelLoading.value = false
    }
  }

  // 取消删除操作
  function handleCancelDelete () {
    selectedOrder.value = null
    showCancelDialog.value = false
  }

  // 查看订单详情
  function viewOrderDetail (order: OrderItem) {
    // 跳转到订单详情页
    // this.$router.push(`/orders/${order.id}`)
    console.log('查看订单详情:', order)
  }

  // 更新路由参数
  function updateRoute () {
    const query: Record<string, string> = {}

    if (activeStatus.value !== 'all') {
      query.status = activeStatus.value
    }

    if (currentPage.value > 1) {
      query.page = currentPage.value.toString()
    }

    if (searchKeyword.value) {
      query.search = searchKeyword.value
    }

    // 使用 replace 避免在浏览器历史中产生过多记录
    router.replace({
      path: route.path,
      query: Object.keys(query).length > 0 ? query : undefined,
    })
  }

  // 从路由参数初始化状态
  function initFromRoute () {
    const { status, page, search } = route.query

    if (status && typeof status === 'string') {
      activeStatus.value = status
    }

    if (page && typeof page === 'string') {
      const pageNum = Number.parseInt(page, 10)
      if (pageNum > 0) {
        currentPage.value = pageNum
      }
    }

    if (search && typeof search === 'string') {
      searchKeyword.value = search
    }
  }

  // 分页处理
  function handlePageChange (page: number) {
    currentPage.value = page
    updateRoute()
    // 不在这里调用 getOrderList()，让路由监听器处理
  }

  // 搜索处理
  function handleSearch () {
    currentPage.value = 1 // 重置到第一页
    updateRoute()
    // 不在这里调用 getOrderList()，让路由监听器处理
  }

  // 监听状态变化
  watch(activeStatus, () => {
    currentPage.value = 1
    updateRoute()
    // 不在这里调用 getOrderList()，让路由监听器处理
  })

  // 监听路由变化
  watch(() => route.query, () => {
    initFromRoute()
    getOrderList()
  }, { deep: true })

  // 页面初始化
  onMounted(() => {
    initFromRoute()
    getOrderList()
  })
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
