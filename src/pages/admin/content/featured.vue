<template>
  <AdminLayout>
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
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">
            {{ dialogMode === 'add' ? 'mdi-plus' : 'mdi-pencil' }}
          </v-icon>
          {{ dialogMode === 'add' ? '添加精选商品' : '编辑精选商品' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <!-- 商品名称 -->
              <v-col cols="12">
                <v-text-field
                  v-model="editForm.title"
                  label="商品名称"
                  prepend-inner-icon="mdi-tag"
                  :rules="[v => !!v || '请输入商品名称']"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editForm.description"
                  label="商品描述"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  :rules="[v => !!v || '请输入描述信息',
                           v => (v && v.length <= 200 || '商品描述不能超过200个字符')]"
                  variant="outlined"
                />
              </v-col>

              <!-- 图片上传 -->
              <v-col cols="12">
                <span class="text-caption text-medium-emphasis">封面上传</span>
                <v-file-upload
                  v-model="editForm.imageFile"
                  clearable
                  density="compact"
                  show-size
                  title="将图片文件拖放到此处"
                  variant="compact"
                />
                <!-- 文件要求提示 -->
                <div class="text-caption text-medium-emphasis mt-1">
                  <v-icon :class="[imageFileError != ''? 'text-error mr-1' : 'mr-1']" size="small">
                    mdi-information
                  </v-icon>
                  <span :class="[imageFileError != ''? 'text-error text-caption mt-1 ' : '']">
                    {{ imageFileError != ''? imageFileError : '支持 JPG、PNG、GIF、WebP 格式，文件大小不超过 2MB' }}
                  </span>
                </div>
              </v-col>

              <!-- 价格信息 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.originalPrice"
                  label="原价"
                  prepend-inner-icon="mdi-currency-usd"
                  :rules="[v => v > 0 || '原价必须大于0']"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.currentPrice"
                  label="现价"
                  prepend-inner-icon="mdi-currency-usd"
                  :rules="[
                    v => v > 0 || '现价必须大于0',
                    v => v <= editForm.originalPrice || '现价不能高于原价'
                  ]"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <!-- 评分和评论数 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.rating"
                  label="商品评分"
                  max="5"
                  min="0"
                  prepend-inner-icon="mdi-star"
                  :rules="[
                    v => v >= 0 && v <= 10 || '评分范围为0-10'
                  ]"
                  step="0.1"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.reviews"
                  label="评论数"
                  min="0"
                  prepend-inner-icon="mdi-comment"
                  :rules="[v => v >= 0 || '评论数不能为负']"
                  type="number"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="saving"
            @click="saveFeatured"
          >
            {{ dialogMode === 'add' ? '添加' : '保存' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
          确认删除
        </v-card-title>
        <v-card-text>
          <p>确定要删除该商品 "{{ itemToDelete?.title }}" 吗？</p>
          <p class="text-medium-emphasis">此操作无法撤销。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="deleteFeatured(itemToDelete!)"
          >
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script lang="ts" setup>
  import { addFeatured, deleteFeaturedById, getFeatured, updateFeatured } from '@/http/admin/featured.ts'
  import { useNotification } from '@/utils/notification'

  // 响应数据
  const imageFileError = ref('')
  const deleteDialog = ref(false)
  const deleting = ref(false)
  const itemToDelete = ref<FeaturedItem>()

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
  const saving = ref(false)
  const valid = ref(false)
  const search = ref('')
  const dialogMode = ref<'add' | 'edit'>('add')
  const form = ref()
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

  // 编辑表单数据
  const editForm = reactive<FeaturedItem>({
    id: '',
    title: '',
    description: '',
    images: {
      largeImage: '',
      smallImage: '',
    },
    imageFile: undefined,
    originalPrice: 0,
    currentPrice: 0,
    reviews: 0,
    rating: 0,
    createdAt: '',
  })

  // 精选商品数据
  const featuredList = ref<FeaturedItem[]>([])

  // 校验图片文件类型
  function validateImageType (file: File): boolean {
    imageFileError.value = ''
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    return allowedTypes.includes(file.type)
  }

  // 校验文件大小
  function validateFileSize (file: File): boolean {
    const maxSize = 2 * 1024 * 1024
    return file.size <= maxSize
  }

  // 文件上传校验
  function validateImageFile (file: File): boolean {
    if (!validateImageType(file)) {
      imageFileError.value = '只支持 JPG、PNG、GIF、WebP 格式的图片文件'
      return false
    }

    if (!validateFileSize(file)) {
      imageFileError.value = '文件大小不能超过 2MB'
      return false
    }

    return true
  }

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

    if (mode === 'edit' && item) {
      Object.assign(editForm, { ...item, imageFile: null })
    } else {
      // 重置表单
      Object.assign(editForm, {
        id: '',
        title: '',
        description: '',
        images: {
          largeImage: '',
          smallImage: '',
        },
        imageFile: undefined,
        originalPrice: 0,
        currentPrice: 0,
        reviews: 0,
        rating: 5,
        createdAt: '',
      })
    }

    dialog.value = true
  }

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
    form.value?.reset()
  }

  // 保存精选商品
  async function saveFeatured () {
    if (!valid.value) return

    // 校验文件
    if (editForm.imageFile && !validateImageFile(editForm.imageFile)) {
      return
    }

    saving.value = true

    try {
      const formData = new FormData()

      // 添加表单数据
      formData.append('title', editForm.title)
      formData.append('description', editForm.description)
      formData.append('originalPrice', editForm.originalPrice.toString())
      formData.append('currentPrice', editForm.currentPrice.toString())
      formData.append('reviews', editForm.reviews.toString())
      formData.append('rating', editForm.rating.toString())

      // 添加图片文件
      if (editForm.imageFile) {
        formData.append('imageFile', editForm.imageFile)
      }

      if (dialogMode.value === 'add') {
        if (!editForm.imageFile) {
          imageFileError.value = '请选择有效的图片文件'
          return
        }
        await addFeatured(formData)
        // 添加成功后刷新数据
        await fetchFeaturedList()
        closeDialog()
      } else {
        // 编辑模式
        if (editForm.id) {
          formData.append('id', editForm.id)
          await updateFeatured(formData)
          // 编辑成功后刷新列表
          await fetchFeaturedList()
          closeDialog()
        }
      }
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      saving.value = false
    }
  }

  // 打开删除确认框
  function openDeleteDialog (item: FeaturedItem) {
    itemToDelete.value = item
    deleteDialog.value = true
  }

  // 删除精选商品
  async function deleteFeatured (item: FeaturedItem) {
    try {
      await deleteFeaturedById(item.id)

      featuredList.value = featuredList.value.filter(i => i.id !== itemToDelete.value!.id)

      showSuccess(`${item.title}删除成功`)
      deleteDialog.value = false
      // 刷新数据
      // await fetchFeaturedList()
    } catch (error) {
      console.error('删除失败:', error)
    }
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
