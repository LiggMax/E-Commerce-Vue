<template>
  <ECommerceHeader />
  <v-container v-if="productDetail != null" class="py-8" max-width="1400">
    <v-row>
      <!-- 左侧：图片画廊 -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg">
          <v-img aspect-ratio="4/3" cover :src="images[activeIndex]" />
          <v-divider />
          <v-sheet class="pa-3">
            <v-slide-group show-arrows>
              <v-slide-group-item
                v-for="(img, idx) in images"
                :key="idx"
              >
                <v-card
                  class="ma-2"
                  :elevation="activeIndex === idx ? 4 : 1"
                  height="80"
                  rounded="lg"
                  width="110"
                  @click="selectImage(idx)"
                >
                  <v-img cover height="80" :src="img" />
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-sheet>
        </v-card>
      </v-col>

      <!-- 右侧：商品信息与操作 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2" rounded="lg">
          <div class="text-h5 font-weight-bold mb-2">{{ productDetail.title }}</div>
          <div class="d-flex align-center mb-2">
            <v-rating
              color="amber"
              half-increments
              :model-value="productDetail.rating / 2"
              readonly
              size="small"
            />
            <span class="text-caption ml-2">{{ productDetail.rating }} 分 · {{ productDetail.reviews }} 条评价 · 销量 {{ product.sales }}</span>
          </div>

          <v-sheet class="pa-4 mb-4 bg-grey-lighten-4 rounded-lg">
            <div class="d-flex align-end ga-3">
              <div class="text-h4 font-weight-bold text-primary">¥{{ productDetail.currentPrice }}</div>
              <div class="text-subtitle-2 text-medium-emphasis text-decoration-line-through">¥{{ productDetail.originalPrice }}</div>
              <v-chip color="error" size="small" variant="flat">直降 {{ productDetail.discount }}%</v-chip>
            </div>
            <div class="mt-2 text-body-2 text-medium-emphasis">{{ product.delivery }}</div>
          </v-sheet>

          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-2">规格</div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip v-for="sp in product.specs" :key="sp" variant="outlined">{{ sp }}</v-chip>
            </div>
          </div>

          <div class="mb-6 d-flex align-center ga-4">
            <div class="text-body-2 text-medium-emphasis">数量</div>
            <v-btn density="comfortable" icon="mdi-minus" variant="outlined" @click="quantity = Math.max(1, quantity - 1)" />
            <v-text-field
              v-model.number="quantity"
              density="compact"
              hide-details
              style="max-width: 80px"
              type="number"
            />
            <v-btn density="comfortable" icon="mdi-plus" variant="outlined" @click="quantity++" />
          </div>

          <div class="d-flex ga-4">
            <v-btn color="primary" rounded="lg" size="large" @click="addToCart">
              <v-icon icon="mdi-cart-plus" start /> 加入购物车
            </v-btn>
            <v-btn
              color="error"
              rounded="lg"
              size="large"
              variant="flat"
              @click="buyNow"
            >
              立即购买
            </v-btn>
            <v-btn icon="mdi-heart-outline" variant="outlined" />
          </div>

          <v-divider class="my-6" />

          <div class="d-flex flex-wrap ga-3">
            <v-chip
              v-for="srv in product.services"
              :key="srv"
              color="success"
              size="small"
              variant="tonal"
            >
              <v-icon icon="mdi-check-decagram" start /> {{ srv }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 下方：详情/参数/评价 Tab -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-tabs bg-color="white" color="primary" grow>
            <v-tab value="detail">详情</v-tab>
            <v-tab value="spec">参数</v-tab>
            <v-tab value="review">评价</v-tab>
          </v-tabs>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <p class="text-body-1 mb-4">{{ productDetail.description }}</p>
                <v-img class="mb-4" cover height="320" src="https://via.placeholder.com/900x320/EEEEEE/222222?text=产品详情图" />
                <v-img cover height="320" src="https://via.placeholder.com/900x320/DDDDDD/222222?text=更多展示" />
              </v-col>
              <v-col cols="12" md="4">
                <v-list density="compact" subheader>
                  <v-list-subheader>规格参数</v-list-subheader>
                  <v-list-item subtitle="IPS" title="面板" />
                  <v-list-item subtitle="3840 x 2160" title="分辨率" />
                  <v-list-item subtitle="144Hz" title="刷新率" />
                  <v-list-item subtitle="HDMI 2.1 / DP 1.4 / Type‑C" title="接口" />
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <ECommerceFooter />
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { getFeaturedDetailServer } from '@/http/client/featured.ts'

  const route = useRoute()

  // 数据模型
  interface Product {
    id: string
    title: string
    originalPrice: number
    currentPrice: number
    reviews: number
    rating: number
    discount: number
    delivery: string
    description: string
  }
  const productDetail = ref<Product>()
  const images = [
    'https://via.placeholder.com/800x600/EEEEEE/222222?text=主图1',
    'https://via.placeholder.com/800x600/DDDDDD/222222?text=主图2',
    'https://via.placeholder.com/800x600/CCCCCC/222222?text=主图3',
    'https://via.placeholder.com/800x600/BBBBBB/222222?text=主图4',
  ]
  const activeIndex = ref(0)

  function selectImage (idx: number) {
    activeIndex.value = idx
  }

  const product = {
    title: '超清 4K 显示器 27 寸 IPS 144Hz',
    price: 1999,
    originalPrice: 2599,
    rating: 4.5,
    reviews: 328,
    sales: 1520,
    delivery: '顺丰包邮 · 48 小时内发货',
    services: ['7 天无理由', '一年质保', '正规发票'],
    specs: ['27 寸', '4K', '144Hz', 'Type‑C 90W 供电'],
  }

  const quantity = ref(1)

  function addToCart () {
    console.log('加入购物车', { product, quantity: quantity.value })
  }

  function buyNow () {
    console.log('立即购买', { product, quantity: quantity.value })
  }

  /**
   * 商品商品数据
   */
  async function getProduct () {
    const productId = route.query.productId
    if (productId != null) {
      const res = await getFeaturedDetailServer(productId.toString())
      productDetail.value = res.data
    }
  }

  onMounted(() => {
    getProduct()
  })
</script>

<style scoped>
</style>
