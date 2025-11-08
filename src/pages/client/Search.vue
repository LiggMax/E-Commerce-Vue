<template>
  <v-container class="py-8" max-width="1700">
    <!-- 搜索结果头部 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 v-if="keyword != null" class="text-h4 font-weight-bold">
              搜索结果
              <span v-if="keyword" class="text-primary">"{{ keyword }}"</span>
            </h1>
            <p class="text-body-2 text-medium-emphasis mt-2">
              共找到 {{ total }} 个商品
            </p>
          </div>
          <v-select
            v-model="sortBy"
            density="compact"
            hide-details
            item-title="label"
            item-value="value"
            :items="sortOptions"
            label="排序方式"
            style="max-width: 200px"
            variant="outlined"
            @update:model-value="handleSortChange"
          />
        </div>
      </v-col>
    </v-row>

    <!-- 加载状态 -->
    <v-row v-if="loading">
      <v-col
        v-for="n in 12"
        :key="n"
        cols="6"
        lg="2"
        md="3"
        sm="4"
      >
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <!-- 空状态 -->
    <v-row v-else-if="!loading && productList.length === 0">
      <v-col cols="12">
        <v-card class="pa-12 text-center" elevation="0">
          <v-icon color="grey-lighten-1" size="120">mdi-magnify</v-icon>
          <h2 class="text-h5 mt-4 mb-2">未找到相关商品</h2>
          <p class="text-body-2 text-medium-emphasis">
            请尝试其他关键词或浏览推荐商品
          </p>
          <v-btn class="mt-4" color="primary" to="/" variant="outlined">
            返回首页
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- 商品列表 -->
    <v-row v-else>
      <v-col
        v-for="product in productList"
        :key="product.id"
        cols="6"
        lg="2"
        md="3"
        sm="4"
      >
        <v-card
          class="product-card h-100"
          elevation="0"
          hover
          rounded="lg"
          @click="goToDetail(product.id)"
        >
          <!-- 商品图片 -->
          <div class="position-relative">
            <v-img
              aspect-ratio="1"
              class="rounded-b-lg"
              cover
              :src="product.url.largeImage"
            />
            <!-- 折扣标签 -->
            <v-chip
              v-if="product.discount && product.discount > 0"
              class="position-absolute"
              color="error"
              label
              size="small"
              style="top: 12px; left: 12px;"
            >
              -{{ product.discount }}%
            </v-chip>
          </div>

          <!-- 商品信息 -->
          <v-card-title class="pa-4 pb-2">
            <h3 class="text-subtitle-1 font-weight-bold text-truncate">
              {{ product.title }}
            </h3>
          </v-card-title>

          <v-card-subtitle class="px-4 py-0 d-flex align-center">
            <v-rating
              v-if="product.reviews > 0"
              color="amber"
              density="compact"
              half-increments
              :model-value="(product.reviews) / 2"
              readonly
              size="small"
            />
            <span v-if="product.reviews > 0" class="text-caption ml-2">({{ product.reviews }})</span>
          </v-card-subtitle>

          <v-card-text class="px-4 py-2">
            <div class="d-flex align-center">
              <span class="text-h6 font-weight-bold text-primary">
                ¥{{ product.currentPrice }}
              </span>
              <span
                v-if="product.originalPrice > product.currentPrice"
                class="text-body-2 text-decoration-line-through text-medium-emphasis ml-2"
              >
                ¥{{ product.originalPrice }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 分页 -->
    <v-row v-if="!loading && productList.length > 0" class="mt-8">
      <v-col class="d-flex justify-center" cols="12">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="handlePageChange"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { SearchSort } from '@/composables/enums/Sort.ts'
  import { searchServer } from '@/http/client/search.ts'

  const route = useRoute()
  const router = useRouter()

  // 数据模型
  interface ProductItem {
    id: string
    title: string
    url: {
      largeImage: string
      smallImage: string
    }
    originalPrice: number
    currentPrice: number
    reviews: number
    rating: number
    discount: number
  }

  interface SearchResponse {
    code: number
    message: string
    data: {
      total: number
      pages: number
      list: ProductItem[]
    }
  }

  // 状态管理
  const keyword = computed(() => route.query.keyword as string)
  const productList = ref<ProductItem[]>([])
  const total = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const loading = ref(false)
  const sortBy = ref(SearchSort.DEFAULT)

  const sortOptions = [
    { label: '综合排序', value: SearchSort.DEFAULT },
    { label: '价格排序', value: SearchSort.PRICE },
    { label: '评分排序', value: SearchSort.RATING },
    { label: '热门排序', value: SearchSort.HOT },
  ]

  /**
   * 搜索商品
   */
  async function handleSearch () {
    loading.value = true
    try {
      const result: SearchResponse = await searchServer(keyword.value,
                                                        currentPage.value,
                                                        sortBy.value,
      )

      productList.value = result.data.list
      total.value = result.data.total
      totalPages.value = result.data.pages
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 页码变化
   */
  function handlePageChange (page: number) {
    currentPage.value = page
    handleSearch()
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * 排序更新时更新路由
   */
  function handleSortChange (value: SearchSort) {
    sortBy.value = value
    router.replace({
      query: {
        ...route.query,
        categorzy: value,
      },
    })
    handleSearch()
  }

  /**
   * 跳转到商品详情
   */
  function goToDetail (productId: string) {
    router.push({
      path: '/client/ProductsDetail',
      query: { productId: productId },
    })
  }

  // 初始化
  onMounted(() => {
    handleSearch()
  })

  // 监听路由变化
  watch(() => route.query.category, () => {
    sortBy.value = route.query.category as SearchSort
    handleSearch()
    currentPage.value = 1
  })

  // 监听关键词变化
  watch(() => keyword.value, () => {
    handleSearch()
    currentPage.value = 1
  })
</script>

<style scoped>
  .product-card {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .product-card:hover {
    transform: translateY(-4px);
  }
</style>
