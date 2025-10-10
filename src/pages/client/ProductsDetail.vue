<template>
  <v-container v-if="productDetail != null" class="py-8" max-width="1700">
    <v-row>
      <!-- 左侧：图片画廊 -->
      <v-col cols="12" md="7">
        <v-card
          class="d-flex flex-column"
          elevation="0"
          lg="7"
          rounded="lg"
          style="height: 600px;"
        >
          <div class="flex-grow-1 d-flex align-center justify-center" style="min-height: 0;">
            <v-img
              aspect-ratio="16/9"
              class="w-100 h-100 rounded-lg"
              cover
              :src="activeImage"
              style="max-height: 100%; object-fit: cover;"
            />
          </div>
          <v-divider />
          <v-sheet class="pa-3">
            <v-slide-group show-arrows>
              <v-slide-group-item
                v-for="(img, idx) in allImages"
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
      <v-col cols="12" md="5">
        <v-card
          class="pa-6"
          elevation="0"
          lg="5"
          rounded="lg"
          style="height: 600px;"
        >
          <div class="h-100 overflow-y-auto">
            <div class="text-h5 font-weight-bold">{{ productDetail.title }}</div>
            <div class="d-flex align-center ">
              <v-rating
                color="amber"
                half-increments
                :model-value="productDetail.rating / 2"
                readonly
                size="small"
              />
              <span class="text-caption ml-2">{{ productDetail.rating }} 分 · {{ productDetail.reviews }} 条评价</span>
            </div>

            <v-sheet class=" mb-4 rounded-lg">
              <div class="d-flex align-end ga-3">
                <div class="text-h4 font-weight-bold text-primary">¥{{ finalCurrentPrice.toFixed(2) }}</div>
                <div class="text-subtitle-2 text-medium-emphasis text-decoration-line-through">¥{{ finalOriginalPrice.toFixed(2) }}</div>
                <v-chip color="error" size="small" variant="flat">直降 ¥{{ (finalOriginalPrice - finalCurrentPrice).toFixed(2) }}</v-chip>
              </div>
              <div v-if="selectedSpecsPrice > 0" class="mt-2 text-caption text-medium-emphasis">
                基础价格 ¥{{ productDetail.currentPrice.toFixed(2) }} + 规格价格 ¥{{ selectedSpecsPrice.toFixed(2) }}
              </div>
            </v-sheet>

            <!-- 规格选择 -->
            <div v-if="productDetail.specs && productDetail.specs.length > 0" class="mb-4">
              <div v-for="spec in productDetail.specs" :key="spec.id" class="mb-3">
                <div class="text-body-2 text-medium-emphasis mb-2">{{ spec.name }}</div>
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="specValue in spec.specValues"
                    :key="specValue.id"
                    :color="selectedSpecs[spec.id] === specValue.id ? 'primary' : ''"
                    :variant="selectedSpecs[spec.id] === specValue.id ? 'flat' : 'outlined'"
                    @click="selectSpec(spec.id, specValue.id)"
                  >
                    {{ specValue.value }}
                  </v-chip>
                </div>
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
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 下方：详情/参数/评价 Tab -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-tabs color="primary" grow>
            <v-tab value="detail">详情</v-tab>
            <v-tab value="spec">参数</v-tab>
            <v-tab value="review">评价</v-tab>
          </v-tabs>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <p class="text-body-1 mb-4">{{ productDetail.description }}</p>
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
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { getFeaturedDetailServer } from '@/http/client/featured.ts'

  const route = useRoute()

  // 数据模型
  interface DetailImage {
    id: number
    sort: number
    url: string
  }

  interface SpecValue {
    id: number
    value: string
    sort: number
    price: number
    createTime: string
    updateTime: string
  }

  interface Spec {
    id: number
    name: string
    sort: number
    createTime: string
    updateTime: string
    specValues: SpecValue[]
  }

  interface Product {
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
    createdAt: string
    description: string | null
    detailImages: DetailImage[]
    specs: Spec[]
  }

  const productDetail = ref<Product>()
  const activeIndex = ref(0)
  const quantity = ref(1)

  // 选中的规格，key为规格id，value为规格值id
  const selectedSpecs = ref<Record<number, number>>({})

  // 计算所有图片数组，第一张是largeImage，后面是detailImages中的所有url
  const allImages = computed(() => {
    if (!productDetail.value) return []
    return [
      productDetail.value.images.largeImage,
      ...productDetail.value.detailImages.map(img => img.url),
    ]
  })

  // 计算当前显示的图片
  const activeImage = computed(() => {
    return allImages.value[activeIndex.value] || ''
  })

  function selectImage (idx: number) {
    activeIndex.value = idx
  }

  // 选择规格
  function selectSpec (specId: number, specValueId: number) {
    selectedSpecs.value[specId] = specValueId
  }

  // 获取已选择的规格文本
  const selectedSpecsText = computed(() => {
    if (!productDetail.value?.specs) return ''
    const texts: string[] = []
    for (const spec of productDetail.value.specs) {
      const selectedValueId = selectedSpecs.value[spec.id]
      if (selectedValueId) {
        const specValue = spec.specValues.find(v => v.id === selectedValueId)
        if (specValue) {
          texts.push(`${spec.name}: ${specValue.value}`)
        }
      }
    }
    return texts.join(', ')
  })

  // 计算选中规格的总价格
  const selectedSpecsPrice = computed(() => {
    if (!productDetail.value?.specs) return 0
    let totalPrice = 0
    for (const spec of productDetail.value.specs) {
      const selectedValueId = selectedSpecs.value[spec.id]
      if (selectedValueId) {
        const specValue = spec.specValues.find(v => v.id === selectedValueId)
        if (specValue && specValue.price) {
          totalPrice += specValue.price
        }
      }
    }
    return totalPrice
  })

  // 计算最终显示的当前价格（基础价格 + 规格价格）
  const finalCurrentPrice = computed(() => {
    if (!productDetail.value) return 0
    return productDetail.value.currentPrice + selectedSpecsPrice.value
  })

  // 计算最终显示的原价（基础原价 + 规格价格）
  const finalOriginalPrice = computed(() => {
    if (!productDetail.value) return 0
    return productDetail.value.originalPrice + selectedSpecsPrice.value
  })

  function addToCart () {
    if (!validateSpecs()) return
    console.log('加入购物车', {
      product: productDetail.value,
      quantity: quantity.value,
      selectedSpecs: selectedSpecsText.value,
      finalPrice: finalCurrentPrice.value,
      totalPrice: finalCurrentPrice.value * quantity.value,
    })
  }

  function buyNow () {
    if (!validateSpecs()) return
    console.log('立即购买', {
      product: productDetail.value,
      quantity: quantity.value,
      selectedSpecs: selectedSpecsText.value,
      finalPrice: finalCurrentPrice.value,
      totalPrice: finalCurrentPrice.value * quantity.value,
    })
  }

  // 验证是否所有规格都已选择
  function validateSpecs () {
    if (!productDetail.value?.specs || productDetail.value.specs.length === 0) {
      return true
    }

    const unselectedSpecs = productDetail.value.specs.filter(
      spec => !selectedSpecs.value[spec.id],
    )

    if (unselectedSpecs.length > 0) {
      const specNames = unselectedSpecs.map(s => s.name).join('、')
      alert(`请选择${specNames}`)
      return false
    }

    return true
  }

  /**
   * 获取商品数据
   */
  async function getProduct () {
    const productId = route.query.productId
    if (productId != null) {
      const res = await getFeaturedDetailServer(productId.toString())
      productDetail.value = res.data
      // 重置图片索引
      activeIndex.value = 0
      // 重置选中的规格
      selectedSpecs.value = {}
      // 如果有规格，默认选中每个规格的第一个值
      if (res.data.specs && res.data.specs.length > 0) {
        for (const spec of res.data.specs) {
          if (spec.specValues && spec.specValues.length > 0) {
            selectedSpecs.value[spec.id] = spec.specValues[0].id
          }
        }
      }
    }
  }

  onMounted(() => {
    getProduct()
  })
</script>

<style scoped>
</style>
