<template>
  <div v-if="featuredProducts.length > 0">
    <v-row>
      <v-col class="text-center" cols="12">
        <h2 class="text-h3 font-weight-bold mb-4">热门精选</h2>
        <p class="text-h6 text-medium-emphasis">精选优质商品，为您精选最受欢迎的产品</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="product in featuredProducts"
        :key="product.id"
        cols="6"
        lg="2"
        md="3"
        sm="4"
      >
        <v-card
          class="product-card"
          elevation="0"
          hover
          rounded="lg"
          @click="viewDetail(product.id)"
        >
          <v-img
            class="rounded-lg"
            cover
            height="200"
            :src="product.images.largeImage"
          />

          <!-- Discount Badge -->
          <v-chip
            v-if="product.discount"
            class="discount-badge"
            color="error"
            label
            size="small"
          >
            -{{ product.discount }}%
          </v-chip>

          <v-card-title class="pa-4 pb-0">
            <h3 class="text-subtitle-1 font-weight-bold text-truncate">
              {{ product.title }}
            </h3>
          </v-card-title>

          <v-card-subtitle class="px-4 py-0">
            <v-rating
              color="amber"
              density="compact"
              half-increments
              :model-value="product.rating"
              readonly
              size="small"
            />
            <span class="text-caption ml-2">({{ product.reviews }})</span>
          </v-card-subtitle>

          <v-card-text class="px-4 py-0">
            <div class="d-flex align-center">
              <span class="text-h6 font-weight-bold text-primary">
                ¥{{ product.currentPrice }}
              </span>
              <span
                v-if="product.originalPrice"
                class="text-body-2 text-decoration-line-through text-medium-emphasis ml-2"
              >
                ¥{{ product.originalPrice }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 加载状态指示器 -->
    <v-row v-if="loading" class="mt-4">
      <v-col class="text-center" cols="12">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32"
        />
        <p class="text-body-2 text-medium-emphasis mt-2">正在加载更多商品...</p>
      </v-col>
    </v-row>

    <!-- 没有更多数据提示 -->
    <v-row v-else-if="!hasMore && featuredProducts.length > 0" class="mt-4">
      <!--水平布局-->
      <v-col class="text-center d-flex justify-center align-center" cols="12">
        <span class="text-sm-h6 mr-2">
          --------------------------------------------------------
        </span>
        <img
          alt="Arrow Down"
          height="20px"
          :src="mad"
        >
        <p class="text-body-2 text-medium-emphasis mr-2 mx-3 ml-2">这是我的底线</p>
        <span class="text-sm-h6">
          --------------------------------------------------------
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import mad from '@/assets/mad.svg'
  import { getFeaturedServer } from '@/http/client/featured.ts'
  import router from '@/router'

  interface CarouselItem {
    id: string
    title: string
    images: {
      largeImage: string
      smallImage: string
    }
    originalPrice: number
    currentPrice: number
    reviews: number
    rating: number
    discount: number
  }

  const featuredProducts = ref<CarouselItem[]>([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalItems = ref(0)
  const loading = ref(false)
  const hasMore = ref(true)

  function viewDetail (productId: string) {
    console.log('查看详情:', productId)
    router.push({
      path: `/client/ProductsDetail`,
      query: { productId: productId },
    })
  }

  async function getFeaturedProducts (page = 1, isLoadMore = false) {
    if (loading.value) return

    try {
      loading.value = true
      const result = await getFeaturedServer(page)

      // 更新总数和总页数
      totalPages.value = result.data.pages
      totalItems.value = result.data.total

      isLoadMore
        // 加载更多时追加到现有数据
        ? featuredProducts.value = [...featuredProducts.value, ...result.data.list]
        // 首次加载时替换数据
        : featuredProducts.value = result.data.list

      // 使用总页数检查是否还有更多数据
      hasMore.value = currentPage.value < totalPages.value
    } catch (error) {
      console.error('获取商品数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 加载更多数据
  async function loadMore () {
    if (!hasMore.value || loading.value) return

    currentPage.value += 1
    await getFeaturedProducts(currentPage.value, true)
  }

  // 防抖函数
  function debounce (func: Function, wait: number) {
    let timeout: number | undefined
    return function executedFunction (...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // 滚动监听
  function handleScroll () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // 当滚动到距离底部100px时触发加载
    if (scrollTop + windowHeight >= documentHeight - 250) {
      loadMore()
    }
  }

  // 防抖的滚动处理函数
  const debouncedHandleScroll = debounce(handleScroll, 100)

  onMounted(() => {
    getFeaturedProducts(1)
    window.addEventListener('scroll', debouncedHandleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', debouncedHandleScroll)
  })
</script>

<style scoped>

.product-card:hover {
  transform: translateY(-4px);
  transition: all 0.3s ease-in-out;
}

/* 折扣徽章 */
.discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

</style>
