<template>
  <v-container class="pa-0" fluid>
    <!-- Main Layout: Sidebar + Content -->
    <v-row no-gutters>
      <!-- 左侧边栏 -->
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

      <!-- 右侧主要内容领域 -->
      <v-col class="pa-4" cols="12" md="9">

        <!-- 2x2 类别网格 -->
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
              :color="category.color"
              elevation="4"
              hover
              rounded="xl"
              :to="category.link"
            >
              <v-card-text class="pa-6">
                <v-row align="center" class="h-100">
                  <!-- 左侧文案区域 -->
                  <v-col cols="6">
                    <div class="d-flex flex-column h-100 justify-center">
                      <h3 class="text-h4 font-weight-bold mb-2 text-white">
                        {{ category.name }}
                      </h3>
                      <p class="text-h6 mb-1 text-white opacity-80">
                        {{ category.englishTitle }}
                      </p>
                      <p class="text-body-1 mb-4 text-white">
                        {{ category.description }}
                      </p>
                    </div>
                  </v-col>
                  <!-- 右侧图片区域 -->
                  <v-col class="text-center" cols="6">
                    <v-img
                      class="mx-auto"
                      height="120"
                      :src="category.iconImage"
                      width="120"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  // 侧边栏分类数据
  const sidebarCategories = [
    { id: 1, name: '手机/数码/电脑', icon: 'mdi-cellphone' },
    { id: 2, name: '服饰/箱包/运动', icon: 'mdi-tshirt-crew' },
    { id: 3, name: '技能/卡券/潮玩', icon: 'mdi-gift' },
    { id: 4, name: '母婴/美妆/个护', icon: 'mdi-baby-face' },
    { id: 5, name: '家具/家电/家装', icon: 'mdi-sofa' },
    { id: 6, name: '文玩/珠宝/礼品', icon: 'mdi-diamond-stone' },
    { id: 7, name: '食品/宠物/花卉', icon: 'mdi-food-apple' },
  ]

  // 主要分类数据
  const categories = [
    {
      id: 1,
      name: '衣橱捡漏',
      englishTitle: 'APPAREL',
      description: '时尚美衣低价淘',
      color: 'orange',
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
      color: 'blue',
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
      color: 'green',
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
      color: 'pink',
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
