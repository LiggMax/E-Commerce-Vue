<template>
  <!-- 页面标题和操作 -->
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <h1 class="text-h4 font-weight-bold mb-2">精选商品管理</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        管理精选商品信息
      </p>
    </div>
    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      @click="openDialog('add')"
    >
      添加商品
    </v-btn>
  </div>

  <!-- 统计卡片 -->
  <v-row class="mb-3">
    <v-col cols="12" md="3" sm="3">
      <v-card class="text-center pa-4">
        <v-icon class="mb-2" color="primary" size="48">mdi-star</v-icon>
        <div class="text-h4 font-weight-bold">{{ pagination.totalItems }}</div>
        <div class="text-subtitle-2 text-medium-emphasis">精选商品总数</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3" sm="3">
      <v-card class="text-center pa-4">
        <v-icon class="mb-2" color="success" size="48">mdi-currency-usd</v-icon>
        <div class="text-h4 font-weight-bold">{{ averagePrice }}</div>
        <div class="text-subtitle-2 text-medium-emphasis">平均价格</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3" sm="3">
      <v-card class="text-center pa-4">
        <v-icon class="mb-2" color="warning" size="48">mdi-star-outline</v-icon>
        <div class="text-h4 font-weight-bold">{{ averageRating.toFixed(1) }}</div>
        <div class="text-subtitle-2 text-medium-emphasis">平均评分</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3" sm="3">
      <v-card class="text-center pa-4">
        <v-icon class="mb-2" color="info" size="48">mdi-comment</v-icon>
        <div class="text-h4 font-weight-bold">{{ totalReviews }}</div>
        <div class="text-subtitle-2 text-medium-emphasis">总评论数</div>
      </v-card>
    </v-col>
  </v-row>

  <!-- 精选商品列表 -->
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-star</v-icon>
        精选商品列表
      </div>

      <!-- 搜索 -->
      <div class="d-flex align-center ga-2">
        <v-text-field
          v-model="search"
          density="compact"
          hide-details
          placeholder="搜索商品..."
          prepend-inner-icon="mdi-magnify"
          style="width: 300px;"
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
        :items="filteredFeaturedList"
        :items-per-page="-1"
        :loading="loading"
        :search="search"
      >
        <!-- 商品图片 -->
        <template #item.image="{ item }">
          <div class="my-2 rounded-lg overflow-hidden" style="width: 160px; height: 80px;">
            <v-img :alt="item.title" cover :src="item.images?.largeImage || ''" />
          </div>
        </template>

        <template #item.title="{ item }">
          <div class="my-2 rounded-lg overflow-hidden">
            <div class="text-sm-h6 font-weight-bold">{{ item.title }}</div>
          </div>
        </template>

        <!-- 价格信息 -->
        <template #item.price="{ item }">
          <div>
            <div class="text-success font-weight-bold">¥{{ item.currentPrice }}</div>
            <div
              v-if="item.originalPrice !== item.currentPrice"
              class="text-decoration-line-through text-medium-emphasis"
            >
              ¥{{ item.originalPrice }}
            </div>
          </div>
        </template>

        <!-- 评分 -->
        <template #item.rating="{ item }">
          <div class="d-flex align-center">
            <v-rating
              v-model="item.rating"
              color="warning"
              density="compact"
              readonly
              size="small"
            />
            <span class="ml-2 text-body-2">({{ item.reviews }})</span>
          </div>
        </template>

        <!-- 创建时间-->
        <template #item.createdAt="{item}">
          <div>{{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '' }}</div>
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
              <v-list-item @click="openDialog('edit', item)">
                <template #prepend>
                  <v-icon icon="mdi-pencil" />
                </template>
                <v-list-item-title>编辑</v-list-item-title>
              </v-list-item>
              <!--上传图片-->
              <v-list-item @click="openUploadDialog(item)">
                <template #prepend>
                  <v-icon icon="mdi-upload" />
                </template>
                <v-list-item-title>图片</v-list-item-title>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <template #prepend>
                  <v-icon icon="mdi-delete" />
                </template>
                <v-list-item-title>删除</v-list-item-title>
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

  <!-- 添加/编辑对话框 -->
  <FeaturedEditDialog
    v-model="dialog"
    :item="editItem"
    :mode="dialogMode"
    @save-success="handleSaveSuccess"
  />

  <!-- 删除确认对话框 -->
  <DeleteConfirmDialog
    v-model="deleteDialog"
    :item-title="itemToDelete?.title || ''"
    item-type="商品"
    @confirm="handleDeleteConfirm"
  />

  <!-- 图片上传对话框 -->
  <ImageUploadDialog
    v-model="uploadDialog"
    :item-id="itemToUpload?.id"
    :item-title="itemToUpload?.title || ''"
    @upload-success="handleUploadSuccess"
  />
</template>

<script lang="ts" setup>
  import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog.vue'
  import FeaturedEditDialog from '@/components/admin/FeaturedEditDialog.vue'
  import ImageUploadDialog from '@/components/admin/ImageUploadDialog.vue'
  import { deleteFeaturedById, getFeatured } from '@/http/admin/featured.ts'
  import { useNotification } from '@/utils/notification'

  // 响应数据
  const deleteDialog = ref(false)
  const itemToDelete = ref<FeaturedItem>()

  // 图片上传相关
  const uploadDialog = ref(false)
  const itemToUpload = ref<FeaturedItem>()

  const { showSuccess } = useNotification()
  // 定义精选商品项目的接口
  interface FeaturedItem {
    id: string
    title: string
    description: string
    images: {
      largeImage: string
      smallImage: string
    }
    imageFile?: File | undefined
    originalPrice: number
    currentPrice: number
    reviews: number
    rating: number
    createdAt: string
  }

  // 响应式数据
  const dialog = ref(false)
  const loading = ref(false)
  const search = ref('')
  const dialogMode = ref<'add' | 'edit'>('add')
  const editItem = ref<FeaturedItem>()
  const route = useRoute()
  const router = useRouter()

  // 分页相关数据
  const pagination = reactive({
    page: Number.parseInt(route.query.page as string) || 1,
    pageSize: Number.parseInt(route.query.pageSize as string) || 10,
    totalItems: 0,
    totalPages: 0,
  })

  // 表格头部配置
  const headers = [
    { title: '图片', key: 'image', sortable: false, width: 100 },
    { title: '商品名称', key: 'title', sortable: true, minWidth: 150 },
    { title: '价格', key: 'price', sortable: true, minWidth: 100 },
    { title: '评分', key: 'rating', sortable: true, width: 200 },
    { title: '创建时间', key: 'createdAt', sortable: true, minWidth: 150 },
    { title: '操作', key: 'actions', sortable: false, width: 120 },
  ]

  // 精选商品数据
  const featuredList = ref<FeaturedItem[]>([])

  // 获取精选商品数据
  async function fetchFeaturedList () {
    loading.value = true
    try {
      const response = await getFeatured(pagination.page, pagination.pageSize)
      const featuredData = response.data.list || []
      // 更新分页信息
      pagination.totalItems = response.data.total || 0
      pagination.totalPages = response.data.pages || 1

      featuredList.value = featuredData.map((item: {
        id: string
        title: string
        images: {
          largeImage: string
          smallImage: string
        }
        description: string
        originalPrice: number
        currentPrice: number
        reviews: number
        rating: number
        createdAt?: string
      }) => ({
        id: item.id,
        title: item.title,
        images: item.images,
        originalPrice: item.originalPrice,
        currentPrice: item.currentPrice,
        reviews: item.reviews,
        rating: item.rating,
        description: item.description,
        createdAt: item.createdAt,
      }))
    } catch (error) {
      console.error('获取精选商品数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 页码变化处理
  function handlePageChange (newPage: number) {
    pagination.page = newPage
    // 更新路由中的页码参数
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
    pagination.page = 1 // 重置为第一页
    // 更新路由中的每页条数参数
    router.push({
      query: {
        ...route.query,
        pageSize: newSize.toString(),
        page: '1',
      },
    })
  }

  // 计算属性
  const averagePrice = computed(() => {
    if (featuredList.value.length === 0) return '¥0'
    const total = featuredList.value.reduce((sum, item) => sum + item.currentPrice, 0)
    return `¥${Math.round(total / featuredList.value.length)}`
  })

  const averageRating = computed(() => {
    if (featuredList.value.length === 0) return 0
    const total = featuredList.value.reduce((sum, item) => sum + item.rating, 0)
    return total / featuredList.value.length
  })

  const totalReviews = computed(() =>
    featuredList.value.reduce((sum, item) => sum + item.reviews, 0),
  )

  const filteredFeaturedList = computed(() => {
    return featuredList.value
  })

  // 打开对话框
  function openDialog (mode: 'add' | 'edit', item?: FeaturedItem) {
    dialogMode.value = mode
    editItem.value = item
    dialog.value = true
  }

  // 处理保存成功
  async function handleSaveSuccess () {
    await fetchFeaturedList()
  }

  // 打开删除确认框
  function openDeleteDialog (item: FeaturedItem) {
    itemToDelete.value = item
    deleteDialog.value = true
  }

  // 处理删除确认
  async function handleDeleteConfirm () {
    if (!itemToDelete.value) return

    try {
      await deleteFeaturedById(itemToDelete.value.id)
      featuredList.value = featuredList.value.filter(i => i.id !== itemToDelete.value!.id)
      showSuccess(`${itemToDelete.value.title}删除成功`)
      deleteDialog.value = false
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 打开图片上传对话框
  function openUploadDialog (item: FeaturedItem) {
    itemToUpload.value = item
    uploadDialog.value = true
  }

  // 处理上传成功
  async function handleUploadSuccess () {
    // 刷新数据
    await fetchFeaturedList()
  }

  onMounted(() => {
    fetchFeaturedList()
  })

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
      fetchFeaturedList()
    },
    { immediate: true },
  )
</script>

<style scoped>
.pagination-select {
  max-width: 100px;
}
</style>
