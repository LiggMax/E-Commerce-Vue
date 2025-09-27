<template>
  <v-container class="py-8">
    <v-row no-gutters>
      <!-- 左侧分类侧边栏 -->
      <v-col class="pr-4" cols="3">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="bg-primary text-white">
            <v-icon left>mdi-menu</v-icon>
            商品分类
          </v-card-title>
          <v-list density="compact">
            <v-list-item
              v-for="category in sidebarCategories"
              :key="category.id"
              class="ma-1 rounded"
              @click="selectCategory(category)"
            >
              <template #prepend>
                <v-icon color="grey-darken-1" :icon="category.icon" />
              </template>
              <v-list-item-title class="text-body-2">
                {{ category.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- 右侧特色商品区域 -->
      <v-col class="pl-4" cols="9">
        <v-row no-gutters>
          <!-- 衣橱捡漏 -->
          <v-col class="pa-2" cols="6">
            <v-card
              class="bg-warning-lighten-4"
              elevation="3"
              height="200"
              rounded="lg"
            >
              <v-card-text class="d-flex flex-column h-100 pa-4">
                <div class="d-flex flex-column h-100">
                  <div class="mb-4">
                    <h3 class="text-h6 font-weight-bold d-flex align-center">
                      衣橱捡漏
                      <v-icon class="ml-2" small>mdi-arrow-right</v-icon>
                    </h3>
                    <p class="text-caption text-medium-emphasis">时尚美衣低价淘</p>
                  </div>
                  <div class="d-flex align-center ga-3 flex-1">
                    <v-img
                      class="elevation-2"
                      height="80"
                      src="https://via.placeholder.com/80x80/FFB6C1/FFFFFF?text=鞋"
                      width="80"
                    />
                    <div class="position-relative">
                      <v-img
                        class="elevation-2"
                        height="80"
                        rounded="lg"
                        src="https://via.placeholder.com/60x80/000000/FFFFFF?text=裙"
                        width="60"
                      />
                      <v-chip
                        class="position-absolute"
                        color="black"
                        size="x-small"
                        style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                      >
                        ¥69
                      </v-chip>
                    </div>
                    <div class="position-relative">
                      <v-img
                        class="elevation-2"
                        height="80"
                        rounded="lg"
                        src="https://via.placeholder.com/60x80/333333/FFFFFF?text=鞋"
                        width="60"
                      />
                      <v-chip
                        class="position-absolute"
                        color="black"
                        size="x-small"
                        style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                      >
                        ¥58
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 手机数码 -->
          <v-col class="pa-2" cols="6">
            <v-card
              class="bg-info-lighten-4"
              elevation="3"
              height="200"
              rounded="lg"
            >
              <v-card-text class="d-flex flex-column h-100 pa-4">
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold d-flex align-center">
                    手机数码
                    <v-icon class="ml-2" small>mdi-arrow-right</v-icon>
                  </h3>
                  <p class="text-caption text-medium-emphasis">热门装备省心入</p>
                </div>
                <div class="d-flex align-center ga-3 flex-1">
                  <v-img
                    class="elevation-2"
                    height="80"
                    rounded="lg"
                    src="https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=相机"
                    width="80"
                  />
                  <div class="position-relative">
                    <v-img
                      class="elevation-2"
                      height="80"
                      rounded="lg"
                      src="https://via.placeholder.com/60x80/666666/FFFFFF?text=手机"
                      width="60"
                    />
                    <v-chip
                      class="position-absolute"
                      color="black"
                      size="x-small"
                      style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                    >
                      ¥7699
                    </v-chip>
                  </div>
                  <div class="position-relative">
                    <v-img
                      class="elevation-2"
                      height="80"
                      rounded="lg"
                      src="https://via.placeholder.com/60x80/999999/FFFFFF?text=手机"
                      width="60"
                    />
                    <v-chip
                      class="position-absolute"
                      color="black"
                      size="x-small"
                      style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                    >
                      ¥85
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 二次元 -->
          <v-col class="pa-2" cols="6">
            <v-card
              class="bg-success-lighten-4"
              elevation="3"
              height="200"
              rounded="lg"
            >
              <v-card-text class="d-flex flex-column h-100 pa-4">
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold d-flex align-center">
                    二次元
                    <v-icon class="ml-2" small>mdi-arrow-right</v-icon>
                  </h3>
                  <p class="text-caption text-medium-emphasis">烫门新品随手入</p>
                </div>
                <div class="d-flex align-center ga-3 flex-1">
                  <v-img
                    class="elevation-2"
                    height="80"
                    rounded="lg"
                    src="https://via.placeholder.com/80x80/FFEB3B/000000?text=角色"
                    width="80"
                  />
                  <div class="position-relative">
                    <v-img
                      class="elevation-2"
                      height="80"
                      rounded="lg"
                      src="https://via.placeholder.com/60x80/FF69B4/FFFFFF?text=手办"
                      width="60"
                    />
                    <v-chip
                      class="position-absolute"
                      color="black"
                      size="x-small"
                      style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                    >
                      ¥1000
                    </v-chip>
                  </div>
                  <div class="position-relative">
                    <v-img
                      class="elevation-2"
                      height="80"
                      rounded="lg"
                      src="https://via.placeholder.com/60x80/2196F3/FFFFFF?text=插画"
                      width="60"
                    />
                    <v-chip
                      class="position-absolute"
                      color="black"
                      size="x-small"
                      style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                    >
                      ¥190
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 省钱卡券 -->
          <v-col class="pa-2" cols="6">
            <v-card
              class="bg-success-lighten-4"
              elevation="3"
              height="200"
              rounded="lg"
            >
              <v-card-text class="d-flex flex-column h-100 pa-4">
                <div class="mb-4">
                  <h3 class="text-h6 font-weight-bold d-flex align-center">
                    省钱卡券
                    <v-icon class="ml-2" small>mdi-arrow-right</v-icon>
                  </h3>
                  <p class="text-caption text-medium-emphasis">吃喝玩乐放心购</p>
                </div>
                <div class="d-flex align-center ga-3 flex-1">
                  <v-img
                    class="elevation-2"
                    height="80"
                    rounded="lg"
                    src="https://via.placeholder.com/80x80/9C27B0/FFFFFF?text=钱包"
                    width="80"
                  />
                  <div class="position-relative">
                    <v-img
                      class="elevation-2"
                      height="80"
                      rounded="lg"
                      src="https://via.placeholder.com/60x80/00BCD4/FFFFFF?text=游泳"
                      width="60"
                    />
                    <v-chip
                      class="position-absolute"
                      color="black"
                      size="x-small"
                      style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                    >
                      ¥10
                    </v-chip>
                  </div>
                  <div class="position-relative">
                    <v-img
                      class="elevation-2"
                      height="80"
                      rounded="lg"
                      src="https://via.placeholder.com/60x80/4CAF50/FFFFFF?text=充值"
                      width="60"
                    />
                    <v-chip
                      class="position-absolute"
                      color="black"
                      size="x-small"
                      style="bottom: -20px; left: 50%; transform: translateX(-50%);"
                    >
                      ¥96.88
                    </v-chip>
                  </div>
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
  // 侧边栏分类数据
  const sidebarCategories = [
    { id: 1, name: '手机/数码/电脑', icon: 'mdi-camera' },
    { id: 2, name: '服饰/箱包/运动', icon: 'mdi-shoe-print' },
    { id: 3, name: '技能/卡券/潮玩', icon: 'mdi-wallet' },
    { id: 4, name: '母婴/美妆/个护', icon: 'mdi-baby-bottle' },
    { id: 5, name: '家具/家电/家装', icon: 'mdi-lamp' },
    { id: 6, name: '文玩/珠宝/礼品', icon: 'mdi-gift' },
    { id: 7, name: '食品/宠物/花卉', icon: 'mdi-food' },
    { id: 8, name: '图书/游戏/音像', icon: 'mdi-book-open' },
    { id: 9, name: '汽车/电动车/租房', icon: 'mdi-car' },
    { id: 10, name: '五金/设备/农牧', icon: 'mdi-wrench' },
  ]

  // 选择分类
  function selectCategory (category: any) {
    console.log('选择分类:', category.name)
    // 这里可以添加路由跳转或状态管理逻辑
  }
</script>

<style scoped>
</style>
