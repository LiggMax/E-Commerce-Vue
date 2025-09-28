<template>
  <v-container v-if="featuredProducts.length > 0">

    <v-row>
      <v-col class="text-center mb-2" cols="12">
        <h2 class="text-h3 font-weight-bold mb-4">热门精选</h2>
        <p class="text-h6 text-medium-emphasis">精选优质商品，为您精选最受欢迎的产品</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="product in featuredProducts"
        :key="product.id"
        cols="12"
        lg="2"
        md="3"
        sm="5"
      >
        <v-card
          class="product-card mx-auto"
          elevation="4"
          hover
          max-width="320"
          rounded="lg"
        >
          <div class="product-image-container">
            <v-img
              class="product-image"
              cover
              height="230"
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

            <!-- Favorite Button -->
            <!--            <v-btn-->
            <!--              class="favorite-btn"-->
            <!--              color="white"-->
            <!--              elevation="2"-->
            <!--              icon="mdi-heart-outline"-->
            <!--              size="small"-->
            <!--              @click.stop="toggleFavorite(product.id)"-->
            <!--            />-->

            <!-- Quick View Overlay -->
            <div class="quick-view-overlay">
              <v-btn
                color="primary"
                rounded
                @click.stop="quickView(product)"
              >
                <v-icon icon="mdi-eye" start />
                快速预览
              </v-btn>
            </div>
          </div>

          <v-card-title class="pa-4 pb-2">
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

          <v-card-text class="px-4 py-2">
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

          <v-card-actions class="px-4 pb-4">
            <v-btn
              block
              color="primary"
              rounded
              variant="flat"
              @click="addToCart(product)"
            >
              <v-icon icon="mdi-cart-plus" start />
              加入购物车
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col class="text-center" cols="12">
        <v-btn
          append-icon="mdi-arrow-right"
          color="primary"
          rounded
          size="large"
          to="/products"
          variant="outlined"
        >
          查看更多商品
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { getFeaturedServer } from '@/http/client/featured.ts'

  const favoriteProducts = ref<number[]>([])

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

  // function toggleFavorite (productId: string) {
  //   const index = favoriteProducts.value.indexOf(productId)
  //   if (index === -1) {
  //     favoriteProducts.value.push(productId)
  //   } else {
  //     favoriteProducts.value.splice(index, 1)
  //   }
  // }

  function addToCart (product: any) {
    console.log('添加到购物车:', product.name)
  // 这里可以添加实际的购物车逻辑
  }

  function quickView (product: any) {
    console.log('快速预览:', product.name)
  // 这里可以打开产品详情弹窗
  }

  /**
   * 获取精选商品列表
   */
  async function getFeaturedProducts () {
    try {
      const data = await getFeaturedServer()
      featuredProducts.value = data.data
    } finally {}
  }
  onMounted(() => {
    getFeaturedProducts()
  })
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.quick-view-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .quick-view-overlay {
  opacity: 1;
}
</style>
