<template>
  <v-container class="py-12">
    <v-row>
      <v-col class="text-center mb-8" cols="12">
        <h2 class="text-h3 font-weight-bold mb-4">热门推荐</h2>
        <p class="text-h6 text-medium-emphasis">精选优质商品，为您推荐最受欢迎的产品</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="product in featuredProducts"
        :key="product.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
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
              height="240"
              :src="product.image"
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
            <v-btn
              class="favorite-btn"
              color="white"
              elevation="2"
              icon="mdi-heart-outline"
              size="small"
              @click.stop="toggleFavorite(product.id)"
            />

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
              {{ product.name }}
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
  import { ref } from 'vue'

  const favoriteProducts = ref<number[]>([])

  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 9999,
      originalPrice: 10_999,
      discount: 9,
      rating: 4.8,
      reviews: 1247,
    },
    {
      id: 2,
      name: 'MacBook Air M3 芯片',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 8999,
      originalPrice: null,
      discount: null,
      rating: 4.9,
      reviews: 856,
    },
    {
      id: 3,
      name: 'Nike Air Max 270 运动鞋',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 899,
      originalPrice: 1299,
      discount: 31,
      rating: 4.6,
      reviews: 2341,
    },
    {
      id: 4,
      name: '戴森 V15 无线吸尘器',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 3999,
      originalPrice: 4599,
      discount: 13,
      rating: 4.7,
      reviews: 567,
    },
    {
      id: 5,
      name: 'AirPods Pro 第三代',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 1899,
      originalPrice: null,
      discount: null,
      rating: 4.8,
      reviews: 1893,
    },
    {
      id: 6,
      name: 'Kindle Paperwhite 电子书',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 899,
      originalPrice: 1099,
      discount: 18,
      rating: 4.5,
      reviews: 3421,
    },
    {
      id: 7,
      name: 'Sony WH-1000XM5 耳机',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 2399,
      originalPrice: 2799,
      discount: 14,
      rating: 4.9,
      reviews: 1156,
    },
    {
      id: 8,
      name: '小米智能手环 8',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      currentPrice: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.4,
      reviews: 5672,
    },
  ]

  function toggleFavorite (productId: number) {
    const index = favoriteProducts.value.indexOf(productId)
    if (index === -1) {
      favoriteProducts.value.push(productId)
    } else {
      favoriteProducts.value.splice(index, 1)
    }
  }

  function addToCart (product: any) {
    console.log('添加到购物车:', product.name)
  // 这里可以添加实际的购物车逻辑
  }

  function quickView (product: any) {
    console.log('快速预览:', product.name)
  // 这里可以打开产品详情弹窗
  }
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
