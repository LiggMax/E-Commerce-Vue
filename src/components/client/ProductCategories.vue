<template>
  <v-row class="fill-height" no-gutters>
    <v-col>
      <v-row class="fill-height" no-gutters>
        <!-- 第一行卡片 -->
        <v-col class="pa-2" cols="6">
          <!-- 热门 -->
          <v-card
            class="h-100 category-card"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory(SearchSort.HOT)"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-1" color="orange" size="40">mdi-fire</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-orange-darken-2">热门商品</div>
                  <div class="text-caption text-orange-darken-1">热度商品推荐</div>
                </div>
              </div>
              <div class="mt-3">
                <v-icon class="mr-2" color="orange" size="24">mdi-cellphone</v-icon>
                <v-icon class="mr-2" color="orange" size="24">mdi-cellphone-text</v-icon>
                <v-icon class="mr-2" color="orange" size="24">mdi-hanger</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="pa-2" cols="6">
          <v-card
            class="h-100 category-card"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory(SearchSort.RATING)"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-1" color="blue" size="40">mdi-star-settings-outline</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-blue-darken-2">好评商品</div>
                  <div class="text-caption text-blue-darken-1">为您推荐高评分商品</div>
                </div>
              </div>
              <div class="mt-3">
                <v-icon class="mr-2" color="blue" size="24">mdi-star-circle</v-icon>
                <v-icon class="mr-2" color="blue" size="24">mdi-star-face</v-icon>
                <v-icon class="mr-2" color="blue" size="24">mdi-star-four-points</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 第二行卡片 -->
        <v-col class="pa-2" cols="6">
          <v-card
            class="h-100 category-card"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory(SearchSort.PRICE)"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-1" color="green" size="40">mdi-cash-multiple</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-green-darken-2">特价商品</div>
                  <div class="text-caption text-green-darken-1">优惠商品推荐</div>
                </div>
              </div>
              <div class="mt-3">
                <v-icon class="mr-2" color="green" size="24">mdi-cash-100</v-icon>
                <v-icon class="mr-2" color="green" size="24">mdi-cash</v-icon>
                <v-icon class="mr-2" color="green" size="24">mdi-currency-usd</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="pa-2" cols="6">
          <v-card
            class="h-100 category-card"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory(SearchSort.DEFAULT)"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-1" color="pink" size="40">mdi-shopping-outline</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-pink-darken-2">精选商品</div>
                  <div class="text-caption text-pink-darken-1">为您推荐精选商品</div>
                </div>
              </div>
              <div class="mt-3">
                <v-chip class="mr-2" color="pink" size="small" variant="tonal">¥5</v-chip>
                <v-chip class="mr-2" color="pink" size="small" variant="tonal">¥799</v-chip>
                <v-chip color="pink" size="small" variant="tonal">¥35</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { SearchSort } from '@/composables/enums/Sort.ts'
  import router from '@/router'

  const selectedCategory = ref<number | null>(null)

  // 选择分类
  function selectCategory (category: any) {
    selectedCategory.value = category.id
    console.log('选择分类:', category.name)
  // 这里可以添加路由跳转或状态管理逻辑
  }

  // 导航到分类页面
  function navigateToCategory (category: SearchSort) {
    console.log('导航到分类:', category)
    router.push({
      path: '/client/Search',
      query: {
        category,
      },
    })
  // 这里可以添加路由跳转逻辑
  }
</script>

<style scoped>
.category-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.category-card:active {
  transform: translateY(-2px);
}
</style>
