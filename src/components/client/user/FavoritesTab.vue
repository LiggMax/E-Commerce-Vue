<template>
  <div class="favorites-tab">
    <!-- 收藏夹头部 -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h3 class="text-h5 font-weight-bold">我的收藏</h3>
        <p class="text-body-2 text-medium-emphasis">
          共 {{ favorites.length }} 件商品
        </p>
      </div>

      <v-btn
        v-if="selectedItems.length > 0"
        color="error"
        variant="outlined"
        @click=""
      >
        <v-icon icon="mdi-delete" start />
        删除选中 ({{ selectedItems.length }})
      </v-btn>
    </div>

    <!-- 收藏夹筛选 -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedCategory"
          clearable
          density="compact"
          hide-details
          :items="categories"
          label="按分类筛选"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchKeyword"
          density="compact"
          hide-details
          label="搜索收藏商品"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <!-- 收藏商品列表 -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular color="primary" indeterminate size="64" />
      <p class="text-body-2 text-medium-emphasis mt-4">加载收藏中...</p>
    </div>

    <div v-else-if="filteredFavorites.length === 0" class="text-center py-12">
      <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-heart-outline" size="64" />
      <h3 class="text-h6 text-medium-emphasis">暂无收藏商品</h3>
      <p class="text-body-2 text-medium-emphasis">快去收藏一些喜欢的商品吧</p>
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
      <!-- 网格布局 -->
      <v-row>
        <v-col
          v-for="item in paginatedFavorites"
          :key="item.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <v-card class="favorite-card" elevation="1">
            <!-- 商品图片 -->
            <v-img
              cover
              height="200"
              :src="item.image"
              @click="viewProduct(item.productId)"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="primary" indeterminate />
                </div>
              </template>
            </v-img>

            <!-- 商品信息 -->
            <v-card-text class="pa-4">
              <h4 class="text-subtitle-1 font-weight-medium mb-2 line-clamp-2">
                {{ item.name }}
              </h4>

              <div class="d-flex align-center mb-2">
                <v-rating
                  color="warning"
                  density="compact"
                  :model-value="item.rating"
                  readonly
                  size="small"
                />
                <span class="text-body-2 text-medium-emphasis ml-2">
                  ({{ item.reviewCount }})
                </span>
              </div>

              <div class="d-flex justify-space-between align-center">
                <span class="text-h6 font-weight-bold text-primary">
                  ¥{{ item.price }}
                </span>
                <v-chip
                  :color="item.inStock ? 'success' : 'error'"
                  size="small"
                  variant="tonal"
                >
                  {{ item.inStock ? '有库存' : '缺货' }}
                </v-chip>
              </div>
            </v-card-text>

            <!-- 操作按钮 -->
            <v-card-actions class="pa-4 pt-0">
              <v-btn
                v-if="item.inStock"
                block
                color="primary"
                size="small"
                variant="flat"
                @click="router.push({
                  path: '/client/ProductsDetail',
                  query: {productId: item.productId}
                })"
              >
                <v-icon icon="mdi-cart-plus" start />
                查看商品
              </v-btn>

              <v-btn
                v-else
                block
                color="grey"
                disabled
                size="small"
                variant="outlined"
              >
                <v-icon icon="mdi-cart-off" start />
                缺货
              </v-btn>
            </v-card-actions>

            <!-- 收藏时间 -->
            <v-card-subtitle class="text-body-2 text-medium-emphasis">
              收藏于 {{ formatDate(item.favoriteTime) }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

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
  import { computed, onMounted, ref } from 'vue'
  import { getCollectFeaturedServer } from '@/http/client/user.ts'
  import router from '@/router'
  import { useNotification } from '@/utils/notification.ts'

  const { showSuccess, showError } = useNotification()

  // 响应式数据
  const loading = ref(false)
  const selectedCategory = ref('')
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(12)
  const selectedItems = ref<string[]>([])

  // 收藏商品数据
  interface FavoriteItem {
    id: string
    productId: string
    name: string
    image: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount: number
    stock: number
    category: string
    inStock: boolean
    favoriteTime: string
  }

  const favorites = ref<FavoriteItem[]>([])
  const categories = ref<string[]>([])

  // 计算属性
  const filteredFavorites = computed(() => {
    let filtered = favorites.value

    // 按分类筛选
    if (selectedCategory.value && selectedCategory.value !== '全部') {
      filtered = filtered.filter(item => item.category === selectedCategory.value)
    }

    // 按关键词搜索
    if (searchKeyword.value) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
      )
    }

    return filtered
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredFavorites.value.length / pageSize.value)),
  )

  const paginatedFavorites = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredFavorites.value.slice(start, end)
  })

  // 切换选择状态
  function toggleSelection (itemId: string) {
    const index = selectedItems.value.indexOf(itemId)
    if (index === -1) {
      selectedItems.value.push(itemId)
    } else {
      selectedItems.value.splice(index, 1)
    }
  }

  // 查看商品详情
  function viewProduct (productId: string) {
    console.log('查看商品详情:', productId)
  }

  // 加入购物车
  function addToCart (item: FavoriteItem) {
    console.log('加入购物车:', item)
    showSuccess('已加入购物车')
  }

  // 格式化日期
  function formatDate (dateString: string) {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  // 分页处理
  function handlePageChange (page: number) {
    currentPage.value = page
  }

  // 获取收藏商品数据并适配后端结构
  async function getFavorites () {
    loading.value = true
    try {
      const res = await getCollectFeaturedServer()
      const data = res?.data ?? []
      favorites.value = data.map((it: any) => ({
        id: String(it.productId),
        productId: String(it.productId),
        name: it.title ?? '',
        image: it.imagePath ?? '',
        price: Number(it.currentPrice ?? 0),
        originalPrice: Number(it.originalPrice ?? 0),
        rating: Number(it.rating ?? 0),
        reviewCount: Number(it.views ?? 0),
        stock: Number(it.stock ?? 0),
        category: '全部',
        inStock: Number(it.stock ?? 0) > 0,
        favoriteTime: new Date().toISOString(),
      }))
      // 初始化分类
      categories.value = ['全部']
    } catch (error) {
      console.error(error)
      showError('获取收藏数据失败')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getFavorites()
  })
</script>

<style scoped>
.favorites-tab {
  max-width: 1200px;
  margin: 0 auto;
}

.favorite-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.position-absolute {
  position: absolute;
}
</style>
