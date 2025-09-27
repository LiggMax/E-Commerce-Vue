<template>
  <v-container class="pa-0" fluid>
    <!-- Main Layout: Sidebar + Content -->
    <v-row no-gutters>
      <!-- Left Sidebar -->
      <v-col class="pa-4" cols="12" md="3">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <h3 class="text-h6 font-weight-bold mb-4">商品分类</h3>
          <v-list density="compact">
            <v-list-item
              v-for="sidebarCategory in sidebarCategories"
              :key="sidebarCategory.id"
              class="mb-1"
              hover
              :prepend-icon="sidebarCategory.icon"
              rounded="lg"
              :title="sidebarCategory.name"
            />
          </v-list>
        </v-card>
      </v-col>

      <!-- Main Content Area -->
      <v-col class="pa-4" cols="12" md="9">

        <!-- 2x2 Category Grid -->
        <v-row v-if="categories.length > 0" class="mb-6">
          <v-col
            v-for="category in categories"
            :key="category.id"
            class="pa-2"
            cols="12"
            md="6"
          >
            <v-card
              class="category-card"
              elevation="4"
              hover
              rounded="xl"
              :to="category.link"
            >
              <v-card-text class="pa-6">
                <!-- Category Header -->
                <v-row align="center" class="mb-4">
                  <v-col cols="8">
                    <h3 class="text-h5 font-weight-bold mb-1">
                      {{ category.name }}
                    </h3>
                    <p class="text-body-1 mb-2">{{ category.description }}</p>
                  </v-col>
                  <v-col class="text-center" cols="4">
                    <v-img
                      class="mx-auto"
                      height="80"
                      :src="category.iconImage"
                      width="80"
                    />
                  </v-col>
                </v-row>

                <!-- Product Previews -->
                <v-row>
                  <v-col
                    v-for="product in category.products"
                    :key="product.id"
                    class="pa-1"
                    cols="4"
                  >
                    <v-card
                      class="pa-2"
                      color="white"
                      elevation="2"
                      rounded="lg"
                    >
                      <v-img
                        class="rounded mb-2"
                        cover
                        height="80"
                        :src="product.image"
                      />
                      <div class="text-center">
                        <span class="text-body-2 font-weight-bold text-pink">
                          ¥{{ product.price }}
                        </span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Product Listings Grid -->
        <v-row>
          <v-col
            v-for="product in productListings"
            :key="product.id"
            class="pa-2"
            cols="12"
            lg="2"
            md="4"
            sm="6"
          >
            <v-card
              class="product-card"
              elevation="2"
              hover
              rounded="lg"
            >
              <v-img
                class="rounded-t-lg"
                cover
                height="200"
                :src="product.image"
              />
              <v-card-text class="pa-3">
                <h4 class="text-body-1 font-weight-medium mb-2 line-clamp-2">
                  {{ product.title }}
                </h4>
                <div class="d-flex align-center justify-space-between">
                  <span class="text-h6 font-weight-bold text-pink">
                    ¥{{ product.price }}
                  </span>
                  <span
                    v-if="product.originalPrice"
                    class="text-caption text-grey text-decoration-line-through"
                  >
                    ¥{{ product.originalPrice }}
                  </span>
                </div>
                <div
                  v-if="product.wantedCount"
                  class="text-caption text-grey mt-1"
                >
                  {{ product.wantedCount }}人想要
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  const categories = [
    {
      id: 1,
      name: '衣橱捡漏',
      englishTitle: 'APPAREL',
      description: '时尚美衣低价淘',
      bgClass: 'apparel-bg',
      iconImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      link: '/category/apparel',
      products: [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 69,
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 58,
        },
      ],
    },
    {
      id: 2,
      name: '手机数码',
      englishTitle: 'DIGITAL',
      description: '热门装备省心入',
      bgClass: 'digital-bg',
      iconImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      link: '/category/digital',
      products: [
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 7699,
        },
        {
          id: 4,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 85,
        },
      ],
    },
    {
      id: 3,
      name: '二次元',
      englishTitle: 'MODEL',
      description: '烫门新品随手入',
      bgClass: 'anime-bg',
      iconImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      link: '/category/anime',
      products: [
        {
          id: 5,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 1000,
        },
        {
          id: 6,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 190,
        },
      ],
    },
    {
      id: 4,
      name: '省钱卡券',
      englishTitle: 'COUPON',
      description: '吃喝玩乐放心购',
      bgClass: 'coupon-bg',
      iconImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      link: '/category/coupon',
      products: [
        {
          id: 7,
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 10,
        },
        {
          id: 8,
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          price: 96.88,
        },
      ],
    },
  ]
</script>

<style scoped>
</style>
