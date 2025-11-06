<template>
  <!-- 页面标题和操作 -->
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <h1 class="text-h4 font-weight-bold mb-2">订单管理</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        管理系统订单信息
      </p>
    </div>
  </div>

  <!-- 订单列表 -->
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-shopping</v-icon>
        订单列表
      </div>

      <!-- 搜索和筛选 -->
      <div class="d-flex align-center ga-2">
        <v-text-field
          v-model="search"
          density="compact"
          hide-details
          placeholder="搜索订单号/用户名..."
          prepend-inner-icon="mdi-magnify"
          style="width: 250px;"
          variant="outlined"
        />
        <v-select
          v-model="statusFilter"
          density="compact"
          hide-details
          :items="statusOptions"
          label="订单状态"
          style="width: 150px;"
          variant="outlined"
        />
        <v-select
          v-model="sortOrder"
          density="compact"
          hide-details
          :items="sortOptions"
          label="时间排序"
          style="width: 150px;"
          variant="outlined"
        />
      </div>
    </v-card-title>

    <v-card-text class="overflow-y-auto" style="max-height: 600px;">
      <!-- 数据表格 -->
      <v-data-table
        class="elevation-0"
        :headers="headers"
        hide-default-footer
        :items="orderList"
        :items-per-page="-1"
        :loading="loading"
      >
        <template #header.orderNo="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-identifier</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.userName="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-account</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.totalAmount="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-currency-cny</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.status="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-information</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.createdAt="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-calendar</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.actions="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-cog</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <!-- 订单号 -->
        <template #item.orderNo="{ item }">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <div
                v-bind="props"
                class="text-body-1 font-weight-medium text-primary text-truncate"
                style="max-width: 200px; cursor: help;"
                @click="copyOrderNo(item.orderNo)"
              >
                {{ item.orderNo }}
                <v-icon class="ml-1" size="small">mdi-content-copy</v-icon>
              </div>
            </template>
            <span>点击复制订单号</span>
          </v-tooltip>
        </template>

        <!-- 用户名 -->
        <template #item.userName="{ item }">
          <div class="text-body-2">{{ item.user.nickName }}</div>
        </template>

        <!-- 商品信息 -->
        <template #item.products="{ item }">
          <div class="text-body-2">
            {{ item.product.title }}
          </div>
          <div class="text-caption text-medium-emphasis">
            数量: {{ item.quantity }}
            <span v-if="item.product.product_spec?.length">
              · 规格: {{ item.product.product_spec.map(s => s.value).join(', ') }}
            </span>
          </div>
        </template>

        <!-- 订单金额 -->
        <template #item.totalAmount="{ item }">
          <div class="text-body-2 font-weight-medium text-success">
            ¥{{ item.totalAmount.toFixed(2) }}
          </div>
        </template>

        <!-- 订单状态 -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="tonal"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <!-- 创建时间 -->
        <template #item.createdAt="{ item }">
          <div>{{ TimeFormatter.formatDateTime(item.createTime) }}</div>
        </template>

        <!-- 操作 -->
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                color="primary"
                icon="mdi-dots-vertical"
                size="small"
                v-bind="props"
              />
            </template>
            <v-list>
              <v-list-item @click="viewOrderDetail(item)">
                <template #prepend>
                  <v-icon icon="mdi-eye" />
                </template>
                <v-list-item-title>查看详情</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="item.status === OrderStatus.UNPAID"
                @click="handleOrderStatus(item, OrderStatus.PAID)"
              >
                <template #prepend>
                  <v-icon icon="mdi-check" />
                </template>
                <v-list-item-title>确认支付</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="item.status === OrderStatus.PAID"
                @click="handleOrderStatus(item, OrderStatus.DELIVERED)"
              >
                <template #prepend>
                  <v-icon icon="mdi-truck" />
                </template>
                <v-list-item-title>发货</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="item.status === OrderStatus.DELIVERED"
                @click="handleOrderStatus(item, OrderStatus.COMPLETED)"
              >
                <template #prepend>
                  <v-icon icon="mdi-check-circle" />
                </template>
                <v-list-item-title>完成订单</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="[OrderStatus.UNPAID, OrderStatus.PAID].includes(item.status)"
                @click="handleOrderStatus(item, OrderStatus.CANCELED)"
              >
                <template #prepend>
                  <v-icon icon="mdi-close-circle" />
                </template>
                <v-list-item-title>取消订单</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- 分页控件 -->
    <div class="my-3 d-flex align-center justify-space-between mt-4 px-4">
      <div class="text-body-2 text-medium-emphasis">
        共 {{ pagination.totalItems }} 条记录，第 {{ pagination.page }}/{{ pagination.totalPages }} 页
      </div>

      <v-pagination
        v-model="pagination.page"
        density="compact"
        :length="pagination.totalPages"
        :total-visible="5"
        @update:model-value="handlePageChange"
      />

      <div class="d-flex align-center">
        <span class="mr-2">每页</span>
        <v-select
          v-model="pagination.pageSize"
          class="pagination-select"
          density="compact"
          hide-details
          :items="[10, 20, 50, 100]"
          style="width: 100px;"
          variant="outlined"
          @update:model-value="handlePageSizeChange"
        />
        <span class="ml-2">条</span>
      </div>
    </div>
  </v-card>

  <!-- 订单详情对话框 -->
  <v-dialog v-model="detailDialog" max-width="800">
    <v-card v-if="selectedOrder">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-file-document</v-icon>
        订单详情
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                订单号
              </div>
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-body-1 font-weight-medium text-truncate"
                    style="max-width: 100%; cursor: help;"
                    @click="copyOrderNo(selectedOrder.orderNo)"
                  >
                    {{ selectedOrder.orderNo }}
                    <v-icon class="ml-1" size="small">mdi-content-copy</v-icon>
                  </div>
                </template>
                <span>点击复制订单号</span>
              </v-tooltip>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                订单状态
              </div>
              <v-chip
                :color="getStatusColor(selectedOrder.status)"
                size="small"
                variant="tonal"
              >
                {{ getStatusText(selectedOrder.status) }}
              </v-chip>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                用户名
              </div>
              <div class="text-body-1">{{ selectedOrder.user.nickName }}</div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                订单金额
              </div>
              <div class="text-h6 text-success font-weight-bold">
                ¥{{ selectedOrder.totalAmount.toFixed(2) }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                支付方式
              </div>
              <div class="text-body-1">
                {{ getPayTypeText(selectedOrder.payType) }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                创建时间
              </div>
              <div class="text-body-1">
                {{ TimeFormatter.formatDateTime(selectedOrder.createTime) }}
              </div>
            </div>
          </v-col>
          <v-col v-if="selectedOrder.payTime" cols="12" md="6">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                支付时间
              </div>
              <div class="text-body-1">
                {{ TimeFormatter.formatDateTime(selectedOrder.payTime) }}
              </div>
            </div>
          </v-col>
          <v-col v-if="selectedOrder.remark" cols="12">
            <div class="mb-4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                备注
              </div>
              <div class="text-body-1">{{ selectedOrder.remark }}</div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div class="mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">商品信息</div>
          <v-list>
            <v-list-item>
              <template #prepend>
                <v-avatar size="64">
                  <v-img
                    v-if="selectedOrder.product.image"
                    :src="selectedOrder.product.image"
                  />
                  <v-icon v-else>mdi-image</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ selectedOrder.product.title }}</v-list-item-title>
              <v-list-item-subtitle>
                数量: {{ selectedOrder.quantity }} × ¥{{ (selectedOrder.totalAmount / selectedOrder.quantity).toFixed(2) }}
                <span v-if="selectedOrder.product.product_spec?.length">
                  <br>规格: {{ selectedOrder.product.product_spec.map(s => s.value).join(', ') }}
                </span>
              </v-list-item-subtitle>
              <template #append>
                <div class="text-body-1 font-weight-medium">
                  ¥{{ selectedOrder.totalAmount.toFixed(2) }}
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-4" />

        <div v-if="selectedOrder.address" class="mb-2">
          <div class="text-subtitle-1 font-weight-bold mb-2">收货地址</div>
          <div class="text-body-1">
            {{ selectedOrder.address.receiverName }} {{ selectedOrder.address.receiverPhone }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ selectedOrder.address.province }} {{ selectedOrder.address.city }} {{ selectedOrder.address.district }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ selectedOrder.address.detailAddress }}
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="detailDialog = false">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { OrderStatus } from '@/composables/enums/orderStatus.ts'
  import { Sort } from '@/composables/enums/Sort.ts'
  import { getOrderList, updateOrderStatusService } from '@/http/admin/order.ts'
  import { useNotification } from '@/utils/notification'
  import { TimeFormatter } from '@/utils/timeForm'

  // 定义订单接口
  interface ProductSpec {
    id: number
    value: string
  }

  interface OrderProduct {
    productId: string
    title: string
    image: string
    product_spec: ProductSpec[]
  }

  interface OrderUser {
    userId: string
    nickName: string
  }

  interface OrderAddress {
    id: number
    receiverName: string
    receiverPhone: string
    province: string
    city: string
    district: string
    detailAddress: string
  }

  interface Order {
    orderNo: string
    user: OrderUser
    product: OrderProduct
    totalAmount: number
    payType: string
    status: OrderStatus
    quantity: number
    remark: string
    createTime: string
    updateTime: string | null
    payTime: string | null
    address: OrderAddress
  }

  // 响应式数据
  const loading = ref(false)
  const route = useRoute()
  const router = useRouter()
  const search = ref((route.query.search as string) || '')
  const statusFilter = ref<OrderStatus | 'all'>((route.query.status as OrderStatus) || 'all')
  const sortOrder = ref<Sort>((route.query.sortOrder as Sort) || Sort.DESC)
  const detailDialog = ref(false)
  const selectedOrder = ref<Order | null>(null)
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
  let isFilterTriggeredRouteChange = false // 标记是否是筛选触发的路由变化

  const { showSuccess, showError } = useNotification()

  // 分页相关数据
  const pagination = reactive({
    page: Number.parseInt(route.query.page as string) || 1,
    pageSize: Number.parseInt(route.query.pageSize as string) || 10,
    totalItems: 0,
    totalPages: 0,
  })

  // 订单状态选项
  const statusOptions = [
    { title: '全部', value: 'all' },
    { title: '待支付', value: OrderStatus.UNPAID },
    { title: '已支付', value: OrderStatus.PAID },
    { title: '已发货', value: OrderStatus.DELIVERED },
    { title: '已完成', value: OrderStatus.COMPLETED },
    { title: '已取消', value: OrderStatus.CANCELED },
    { title: '退款中', value: OrderStatus.REFUNDING },
    { title: '已退款', value: OrderStatus.REFUNDED },
  ]

  // 排序选项
  const sortOptions = [
    { title: '时间倒序', value: Sort.DESC },
    { title: '时间升序', value: Sort.ASC },
  ]

  // 表格头部配置
  const headers = [
    { title: '订单号', key: 'orderNo', sortable: true, minWidth: 200 },
    { title: '用户名', key: 'userName', sortable: true, minWidth: 120 },
    { title: '商品信息', key: 'products', sortable: false, minWidth: 200 },
    { title: '订单金额', key: 'totalAmount', sortable: true, minWidth: 120 },
    { title: '订单状态', key: 'status', sortable: true, minWidth: 120 },
    { title: '创建时间', key: 'createdAt', sortable: true, minWidth: 180 },
    { title: '操作', key: 'actions', sortable: false, width: 100 },
  ]

  // 订单列表
  const orderList = ref<Order[]>([])

  // 获取订单状态颜色
  function getStatusColor (status: OrderStatus) {
    const colorMap: Record<OrderStatus, string> = {
      [OrderStatus.UNPAID]: 'warning',
      [OrderStatus.PAID]: 'info',
      [OrderStatus.DELIVERED]: 'primary',
      [OrderStatus.COMPLETED]: 'success',
      [OrderStatus.CANCELED]: 'error',
      [OrderStatus.REFUNDING]: 'warning',
      [OrderStatus.REFUNDED]: 'default',
    }
    return colorMap[status] || 'default'
  }

  // 获取订单状态文本
  function getStatusText (status: OrderStatus) {
    const textMap: Record<OrderStatus, string> = {
      [OrderStatus.UNPAID]: '待支付',
      [OrderStatus.PAID]: '已支付',
      [OrderStatus.DELIVERED]: '已发货',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELED]: '已取消',
      [OrderStatus.REFUNDING]: '退款中',
      [OrderStatus.REFUNDED]: '已退款',
    }
    return textMap[status] || status
  }

  // 获取支付方式文本
  function getPayTypeText (payType: string) {
    const payTypeMap: Record<string, string> = {
      WX_PAY: '微信支付',
      ALI_PAY: '支付宝',
      CASH: '现金',
    }
    return payTypeMap[payType] || payType
  }

  // 复制订单号
  async function copyOrderNo (orderNo: string) {
    try {
      await navigator.clipboard.writeText(orderNo)
      showSuccess('订单号已复制到剪贴板')
    } catch {
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement('textarea')
      textArea.value = orderNo
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.append(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        showSuccess('订单号已复制到剪贴板')
      } catch (error_) {
        console.error('复制失败:', error_)
        showError('复制失败，请手动复制')
      } finally {
        textArea.remove()
      }
    }
  }

  // 获取订单列表
  async function fetchOrderList () {
    loading.value = true
    try {
      const status = statusFilter.value === 'all' ? undefined : statusFilter.value
      const keyword = search.value && search.value.trim() ? search.value.trim() : undefined
      const response = await getOrderList(pagination.page, pagination.pageSize, status, keyword, sortOrder.value)
      const orderData = response.data.list || []
      pagination.totalItems = response.data.total || 0
      pagination.totalPages = response.data.pages || 1

      orderList.value = orderData
    } catch (error) {
      console.error('获取订单数据失败:', error)
      showError('获取订单数据失败')
    } finally {
      loading.value = false
    }
  }

  // 页码变化处理
  function handlePageChange (newPage: number) {
    pagination.page = newPage
    router.push({
      query: {
        ...route.query,
        page: newPage.toString(),
        pageSize: pagination.pageSize.toString(),
      },
    })
  }

  // 每页条数变化处理
  function handlePageSizeChange (newSize: number) {
    pagination.pageSize = newSize
    pagination.page = 1
    router.push({
      query: {
        ...route.query,
        pageSize: newSize.toString(),
        page: '1',
      },
    })
  }

  // 查看订单详情
  function viewOrderDetail (order: Order) {
    selectedOrder.value = order
    detailDialog.value = true
  }

  // 处理订单状态变更
  async function handleOrderStatus (order: Order, newStatus: OrderStatus) {
    try {
      await updateOrderStatusService(order.orderNo, newStatus)
      order.status = newStatus
      showSuccess(`订单 ${order.orderNo} 状态已更新为：${getStatusText(newStatus)}`)
      await fetchOrderList()
    } catch (error) {
      console.error('更新订单状态失败:', error)
      showError('更新订单状态失败')
    }
  }

  // 防抖搜索处理函数
  function handleSearchDebounce () {
    // 清除之前的定时器
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = null
    }
    searchDebounceTimer = setTimeout(() => {
      pagination.page = 1
      const query: Record<string, string> = {
        ...route.query,
        page: '1',
        pageSize: pagination.pageSize.toString(),
      }
      if (search.value && search.value.trim()) {
        query.search = search.value.trim()
      } else {
        delete query.search
      }
      // 添加状态筛选参数
      if (statusFilter.value === 'all') {
        delete query.status
      } else {
        query.status = statusFilter.value
      }
      // 添加排序参数
      query.sortOrder = sortOrder.value
      isFilterTriggeredRouteChange = true
      router.push({ query }).finally(() => {
        // 路由更新完成后重置标志
        setTimeout(() => {
          isFilterTriggeredRouteChange = false
        }, 0)
      })
      // 清除定时器引用
      searchDebounceTimer = null
    }, 500)
  }

  // 处理状态筛选变化
  function handleStatusFilterChange () {
    pagination.page = 1
    // 构建查询参数
    const query: Record<string, string> = {
      ...route.query,
      page: '1',
      pageSize: pagination.pageSize.toString(),
    }
    // 添加搜索参数
    if (search.value && search.value.trim()) {
      query.search = search.value.trim()
    } else {
      delete query.search
    }
    // 添加状态筛选参数
    if (statusFilter.value === 'all') {
      delete query.status
    } else {
      query.status = statusFilter.value
    }
    // 添加排序参数
    query.sortOrder = sortOrder.value
    // 标记这是筛选触发的路由变化
    isFilterTriggeredRouteChange = true
    router.push({ query }).finally(() => {
      // 路由更新完成后重置标志
      setTimeout(() => {
        isFilterTriggeredRouteChange = false
      }, 0)
    })
  }

  // 监听搜索内容变化
  watch(
    () => search.value,
    () => {
      handleSearchDebounce()
    },
  )

  // 监听状态筛选变化
  watch(
    () => statusFilter.value,
    () => {
      handleStatusFilterChange()
    },
  )

  // 监听排序变化
  watch(
    () => sortOrder.value,
    () => {
      handleStatusFilterChange()
    },
  )

  // 监听路由变化
  watch(
    () => route.query,
    newQuery => {
      if (newQuery.page) {
        pagination.page = Number.parseInt(newQuery.page as string)
      }
      if (newQuery.pageSize) {
        pagination.pageSize = Number.parseInt(newQuery.pageSize as string)
      }
      // 只在非筛选触发的路由变化时同步筛选值（避免循环触发）
      if (!isFilterTriggeredRouteChange) {
        // 同步搜索框的值
        if (newQuery.search !== undefined && newQuery.search !== search.value) {
          search.value = (newQuery.search as string) || ''
        } else if (newQuery.search === undefined && search.value) {
          search.value = ''
        }
        // 同步状态筛选的值
        if (newQuery.status !== undefined && newQuery.status !== statusFilter.value) {
          statusFilter.value = (newQuery.status as OrderStatus) || 'all'
        } else if (newQuery.status === undefined && statusFilter.value !== 'all') {
          statusFilter.value = 'all'
        }
        // 同步排序的值
        if (newQuery.sortOrder !== undefined && newQuery.sortOrder !== sortOrder.value) {
          sortOrder.value = (newQuery.sortOrder as Sort) || Sort.DESC
        } else if (newQuery.sortOrder === undefined && sortOrder.value !== Sort.DESC) {
          sortOrder.value = Sort.DESC
        }
      }
      fetchOrderList()
    },
    { immediate: true },
  )

  // 组件卸载时清理定时器
  onBeforeUnmount(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = null
    }
  })
</script>

<style scoped>
.pagination-select {
  max-width: 100px;
}
</style>
