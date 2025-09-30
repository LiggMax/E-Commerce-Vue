<template>
  <v-row class="fill-height" no-gutters>
    <v-col>
      <v-row class="fill-height" no-gutters>
        <!-- 第一行卡片 -->
        <v-col class="pa-2" cols="6">
          <!-- 衣橱捡漏 -->
          <v-card
            class="h-100 category-card"
            color="orange-lighten-5"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory('wardrobe')"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-2" color="orange" size="24">mdi-wardrobe</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-orange-darken-2">衣橱捡漏</div>
                  <div class="text-caption text-orange-darken-1">时尚美衣低价淘</div>
                </div>
              </div>
              <div class="flex-grow-1 d-flex align-center justify-center">
                <v-img
                  class="rounded"
                  max-height="80"
                  max-width="120"
                  src="https://via.placeholder.com/120x80/FF6B6B/FFFFFF?text=👗"
                />
              </div>
              <div class="mt-3">
                <v-chip class="mr-2" color="orange" size="small" variant="tonal">¥310</v-chip>
                <v-chip class="mr-2" color="orange" size="small" variant="tonal">¥100</v-chip>
                <v-chip color="orange" size="small" variant="tonal">¥50</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="pa-2" cols="6">
          <!-- 手机数码 -->
          <v-card
            class="h-100 category-card"
            color="blue-lighten-5"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory('digital')"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-2" color="blue" size="24">mdi-cellphone</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-blue-darken-2">手机数码</div>
                  <div class="text-caption text-blue-darken-1">热门装备省心入</div>
                </div>
              </div>
              <div class="flex-grow-1 d-flex align-center justify-center">
                <v-img
                  class="rounded"
                  max-height="80"
                  max-width="120"
                  src="https://via.placeholder.com/120x80/4ECDC4/FFFFFF?text=📱"
                />
              </div>
              <div class="mt-3">
                <v-chip class="mr-2" color="blue" size="small" variant="tonal">¥1028</v-chip>
                <v-chip class="mr-2" color="blue" size="small" variant="tonal">¥1488</v-chip>
                <v-chip color="blue" size="small" variant="tonal">¥8800</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 第二行卡片 -->
        <v-col class="pa-2" cols="6">
          <!-- Anime -->
          <v-card
            class="h-100 category-card"
            color="green-lighten-5"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory('anime')"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-2" color="green" size="24">mdi-heart</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-green-darken-2">动漫</div>
                  <div class="text-caption text-green-darken-1">烫门新品随手入</div>
                </div>
              </div>
              <div class="flex-grow-1 d-flex align-center justify-center">
                <v-img
                  class="rounded"
                  max-height="80"
                  max-width="120"
                  src="https://via.placeholder.com/120x80/45B7D1/FFFFFF?text=🎌"
                />
              </div>
              <div class="mt-3">
                <v-chip class="mr-2" color="green" size="small" variant="tonal">¥1000</v-chip>
                <v-chip class="mr-2" color="green" size="small" variant="tonal">¥1</v-chip>
                <v-chip color="green" size="small" variant="tonal">¥25.5</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="pa-2" cols="6">
          <!-- 省钱卡券 -->
          <v-card
            class="h-100 category-card"
            color="pink-lighten-5"
            elevation="2"
            rounded="xl"
            @click="navigateToCategory('coupons')"
          >
            <v-card-text class="pa-4 h-100 d-flex flex-column">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-2" color="pink" size="24">mdi-ticket</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold text-pink-darken-2">省钱卡券</div>
                  <div class="text-caption text-pink-darken-1">吃喝玩乐放心购</div>
                </div>
              </div>
              <div class="flex-grow-1 d-flex align-center justify-center">
                <v-img
                  class="rounded"
                  max-height="80"
                  max-width="120"
                  src="https://via.placeholder.com/120x80/F8BBD9/FFFFFF?text=🎫"
                />
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
  const selectedCategory = ref<number | null>(null)

  // 选择分类
  function selectCategory (category: any) {
    selectedCategory.value = category.id
    console.log('选择分类:', category.name)
    // 这里可以添加路由跳转或状态管理逻辑
  }

  // 导航到分类页面
  function navigateToCategory (category: string) {
    console.log('导航到分类:', category)
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
