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

      <v-card-text>
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
            <div class="my-2 rounded-lg overflow-hidden" style="width: 80px; height: 80px;">
              <v-img :alt="item.name" cover :src="item.images?.largeImage || ''" />
            </div>
          </template>

          <!-- 价格信息 -->
          <template #item.price="{ item }">
            <div>
              <div class="text-success font-weight-bold">¥{{ item.currentPrice }}</div>
              <div v-if="item.originalPrice !== item.currentPrice" class="text-decoration-line-through text-medium-emphasis">
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

          <!-- 操作 -->
          <template #item.actions="{ item }">
            <div class="d-flex ga-1">
              <v-btn
                color="primary"
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="openDialog('edit', item)"
              />
              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="deleteFeatured(item)"
              />
            </div>
          </template>
        </v-data-table>

        <!-- 分页控件 -->
        <div class="d-flex align-center justify-space-between mt-4 px-4">
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
      </v-card-text>
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
                  v-model="editForm.name"
                  label="商品名称"
                  prepend-inner-icon="mdi-tag"
                  :rules="[v => !!v || '请输入商品名称']"
                  variant="outlined"
                />
              </v-col>

              <!-- 图片上传 -->
              <v-col cols="12">
                <v-file-input
                  v-model="editForm.imageFile"
                  accept="image/*"
                  label="商品图片"
                  prepend-inner-icon="mdi-image"
                  :rules="dialogMode === 'add' ? [v => !!v || '请选择图片'] : []"
                  show-size
                  @change="handleImageUpload"
                />

                <!-- 图片预览 -->
                <div v-if="editForm.images?.largeImage" class="mt-4">
                  <v-img
                    :alt="editForm.name"
                    class="rounded-lg"
                    cover
                    height="200"
                    :src="editForm.images.largeImage"
                  />
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
                    v => v >= 0 && v <= 5 || '评分范围为0-5'
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
  </AdminLayout>
</template>

<script lang="ts" setup>
  import { addFeatured, deleteFeaturedById, getFeatured } from '@/http/admin/featured.ts'

  // 定义精选商品项目的接口
  interface FeaturedItem {
    id: string
    name: string
    images: {
      largeImage: string
      smallImage: string
    }
    imageFile?: File | null
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

  // 分页相关数据
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  })

  // 表格头部配置
  const headers = [
    { title: '图片', key: 'image', sortable: false, width: 100 },
    { title: '商品名称', key: 'name', sortable: true },
    { title: '价格', key: 'price', sortable: true, width: 120 },
    { title: '评分', key: 'rating', sortable: true, width: 200 },
    { title: '创建时间', key: 'createdAt', sortable: true, width: 150 },
    { title: '操作', key: 'actions', sortable: false, width: 120 },
  ]

  // 编辑表单数据
  const editForm = reactive<FeaturedItem>({
    id: '',
    name: '',
    images: {
      largeImage: '',
      smallImage: '',
    },
    imageFile: null,
    originalPrice: 0,
    currentPrice: 0,
    reviews: 0,
    rating: 5,
    createdAt: '',
  })

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
        name: string
        images: {
          largeImage: string
          smallImage: string
        }
        originalPrice: number
        currentPrice: number
        reviews: number
        rating: number
        createdAt?: string
      }) => ({
        id: item.id,
        name: item.name,
        images: item.images,
        originalPrice: item.originalPrice,
        currentPrice: item.currentPrice,
        reviews: item.reviews,
        rating: item.rating,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
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
    fetchFeaturedList()
  }

  // 每页条数变化处理
  function handlePageSizeChange (newSize: number) {
    pagination.pageSize = newSize
    pagination.page = 1 // 重置为第一页
    fetchFeaturedList()
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
        name: '',
        images: {
          largeImage: '',
          smallImage: '',
        },
        imageFile: null,
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

  // 处理图片上传
  function handleImageUpload (event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        editForm.images.largeImage = e.target?.result as string
      })
      reader.readAsDataURL(file)
    }
  }

  // 保存精选商品
  async function saveFeatured () {
    if (!valid.value) return

    saving.value = true

    try {
      const formData = new FormData()

      // 添加表单数据
      formData.append('title', editForm.name)
      formData.append('originalPrice', editForm.originalPrice.toString())
      formData.append('currentPrice', editForm.currentPrice.toString())
      formData.append('reviews', editForm.reviews.toString())
      formData.append('rating', editForm.rating.toString())

      // 添加图片文件
      if (editForm.imageFile) {
        formData.append('imageFile', editForm.imageFile)
      }

      if (dialogMode.value === 'add') {
        const result = await addFeatured(formData)
        // 添加成功后刷新列表
        await fetchFeaturedList()
        closeDialog()
      } else {
        // 编辑模式
        if (editForm.id) {
          // TODO 实现编辑
          // const result = await updateFeatured(formData)

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

  // 删除精选商品
  async function deleteFeatured (item: FeaturedItem) {
    if (confirm('确定要删除这个精选商品吗？')) {
      try {
        await deleteFeaturedById(item.id)

        // 刷新数据
        await fetchFeaturedList()
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  onMounted(() => {
    fetchFeaturedList()
  })
</script>

<style scoped>
.pagination-select {
  max-width: 100px;
}
</style>
