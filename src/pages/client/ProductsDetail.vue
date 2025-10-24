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
          <v-sheet>
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
                <div class="text-h4 font-weight-bold text-primary">¥{{ (finalCurrentPrice * quantity).toFixed(2) }}</div>
                <div class="text-subtitle-2 text-medium-emphasis text-decoration-line-through">¥{{ (finalOriginalPrice * quantity).toFixed(2) }}</div>
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
                :max="productDetail.stock"
                style="max-width: 80px"
                type="number"
                @input="validateQuantity"
              />
              <v-btn density="comfortable" icon="mdi-plus" variant="outlined" @click="quantity = Math.min(productDetail.stock, quantity + 1)" />
              <div class="font-weight-bold text-medium-emphasis">库存: {{ productDetail.stock }}</div>
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
          <v-tabs
            v-model="activeTab"
            color="primary"
            grow
          >
            <v-tab value="detail">详情</v-tab>
            <v-tab value="review">评价</v-tab>
            <v-tab value="spec">参数</v-tab>
          </v-tabs>
          <v-divider />
          <v-card-text>
            <v-window v-model="activeTab">
              <!-- 详情 Tab -->
              <v-window-item value="detail">
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
              </v-window-item>

              <!-- 评价 Tab -->
              <v-window-item value="review">
                <!-- 发表评价框 -->
                <v-card class="mb-6" elevation="1" rounded="lg">
                  <v-card-title class="text-h6">发表评价</v-card-title>
                  <v-divider />
                  <v-card-text class="pa-4">
                    <v-form ref="reviewForm" v-model="reviewFormValid">
                      <!-- 评分 -->
                      <div class="mb-4">
                        <div class="text-body-2 text-medium-emphasis mb-2">评分</div>
                        <v-rating
                          v-model="newReview.rating"
                          color="amber"
                          half-increments
                          size="large"
                        />
                      </div>

                      <!-- 评价内容 -->
                      <div class="mb-4">
                        <v-textarea
                          v-model="newReview.content"
                          label="分享您的使用体验..."
                          placeholder="请详细描述您对商品的感受，帮助其他用户做出选择"
                          rows="4"
                          variant="outlined"
                        />
                      </div>

                      <!-- 图片上传 -->
                      <div class="mb-4">
                        <div class="text-body-2 text-medium-emphasis mb-2">上传图片（最多9张）</div>
                        <div class="d-flex flex-wrap ga-2">
                          <!-- 已上传的图片 -->
                          <div
                            v-for="(img, index) in newReview.images"
                            :key="index"
                            class="position-relative"
                          >
                            <v-img
                              class="rounded"
                              height="80"
                              :src="img"
                              width="80"
                            />
                            <v-btn
                              class="position-absolute"
                              color="error"
                              density="compact"
                              icon="mdi-close"
                              size="small"
                              style="top: -8px; right: -8px;"
                              @click="removeImage(index)"
                            />
                          </div>
                          <!-- 上传按钮 -->
                          <v-btn
                            v-if="newReview.images.length < 9"
                            class="d-flex flex-column align-center justify-center"
                            color="grey-lighten-3"
                            height="80"
                            variant="outlined"
                            width="80"
                            @click="triggerImageUpload"
                          >
                            <v-icon icon="mdi-camera-plus" size="24" />
                            <span class="text-caption mt-1">添加图片</span>
                          </v-btn>
                        </div>
                        <input
                          ref="imageInput"
                          accept="image/*"
                          multiple
                          style="display: none;"
                          type="file"
                          @change="handleImageUpload"
                        >
                      </div>

                      <!-- 表情选择 -->
                      <div class="mb-4">
                        <div class="text-body-2 text-medium-emphasis mb-2">选择表情</div>
                        <div class="d-flex ga-2">
                          <v-btn
                            v-for="emoji in emojis"
                            :key="emoji"
                            :color="newReview.emoji === emoji ? 'primary' : 'grey-lighten-3'"
                            size="small"
                            :variant="newReview.emoji === emoji ? 'flat' : 'outlined'"
                            @click="newReview.emoji = emoji"
                          >
                            {{ emoji }}
                          </v-btn>
                        </div>
                      </div>

                      <!-- 提交按钮 -->
                      <div class="d-flex justify-end">
                        <v-btn
                          color="primary"
                          :disabled="!reviewFormValid || !newReview.rating || !newReview.content.trim()"
                          :loading="submittingReview"
                          variant="flat"
                          @click="submitReview"
                        >
                          发表评价
                        </v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-card>

                <div class="mb-6">
                  <div class="d-flex align-center mb-4">
                    <v-rating
                      color="amber"
                      half-increments
                      :model-value="productDetail.rating / 2"
                      readonly
                      size="large"
                    />
                    <div class="ml-4">
                      <div class="text-h4 font-weight-bold">{{ productDetail.rating }}</div>
                      <div class="text-body-2 text-medium-emphasis">基于 {{ productDetail.reviews }} 条评价</div>
                    </div>
                  </div>

                  <!-- 评价统计 -->
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-list density="compact">
                        <v-list-item
                          v-for="(rating, index) in ratingStats"
                          :key="index"
                          class="px-0"
                        >
                          <template #prepend>
                            <span class="text-body-2">{{ 5 - index }}星</span>
                          </template>
                          <v-progress-linear
                            color="amber"
                            height="8"
                            :model-value="rating.percentage"
                            rounded
                          />
                          <template #append>
                            <span class="text-body-2 text-medium-emphasis">{{ rating.count }}</span>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </div>

                <!-- 评价列表 -->
                <div v-if="reviews.length > 0">
                  <v-card
                    v-for="review in reviews"
                    :key="review.id"
                    class="mb-4"
                    elevation="1"
                    rounded="lg"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-start">
                        <v-avatar class="mr-4" size="40">
                          <v-img :src="review.userAvatar" />
                        </v-avatar>
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-medium">{{ review.userName }}</span>
                            <v-rating
                              class="ml-2"
                              color="amber"
                              :model-value="review.rating"
                              readonly
                              size="small"
                            />
                            <span class="text-caption text-medium-emphasis ml-2">{{ review.createTime }}</span>
                          </div>
                          <p class="text-body-2 mb-2">{{ review.content }}</p>
                          <div v-if="review.images && review.images.length > 0" class="d-flex ga-2 mb-2">
                            <v-img
                              v-for="(img, idx) in review.images"
                              :key="idx"
                              class="rounded"
                              height="60"
                              :src="img"
                              width="60"
                              @click="previewImage(img)"
                            />
                          </div>
                          <div v-if="review.specs" class="text-caption text-medium-emphasis">
                            规格：{{ review.specs }}
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <div v-else class="text-center py-8">
                  <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-comment-outline" size="64" />
                  <h3 class="text-h6 text-medium-emphasis">暂无评价</h3>
                  <p class="text-body-2 text-medium-emphasis">成为第一个评价此商品的用户</p>
                </div>
              </v-window-item>

              <!-- 参数 Tab -->
              <v-window-item value="spec">
                <v-list density="compact" subheader>
                  <v-list-subheader>详细参数</v-list-subheader>
                  <v-list-item subtitle="IPS" title="面板" />
                  <v-list-item subtitle="3840 x 2160" title="分辨率" />
                  <v-list-item subtitle="144Hz" title="刷新率" />
                  <v-list-item subtitle="HDMI 2.1 / DP 1.4 / Type‑C" title="接口" />
                  <v-list-item subtitle="27英寸" title="屏幕尺寸" />
                  <v-list-item subtitle="1ms" title="响应时间" />
                  <v-list-item subtitle="HDR400" title="HDR支持" />
                  <v-list-item subtitle="FreeSync Premium Pro" title="同步技术" />
                </v-list>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { Base64 } from 'js-base64'
  import { useRoute } from 'vue-router'
  import { getFeaturedDetailServer } from '@/http/client/product.ts'
  import { publishCommentService } from '@/http/client/user.ts'
  import router from '@/router'
  import { useAppStore } from '@/stores/client/app.ts'
  import { userTokenStore } from '@/stores/client/clientToken.ts'
  import { useNotification } from '@/utils/notification.ts'

  const route = useRoute()
  const appStore = useAppStore()
  const { showWarning } = useNotification()

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
    stock: number | 0
    description: string | null
    detailImages: DetailImage[]
    specs: Spec[]
  }

  const productDetail = ref<Product>()
  const activeIndex = ref(0)
  const quantity = ref(1)
  const activeTab = ref('detail')

  // 选中的规格，key为规格id，value为规格值id
  const selectedSpecs = ref<Record<number, number>>({})

  // 评价数据
  interface Review {
    id: number
    userName: string
    userAvatar: string
    rating: number
    content: string
    createTime: string
    images?: string[]
    specs?: string
  }

  const reviews = ref<Review[]>([])

  // 评价统计数据
  const ratingStats = ref([
    { count: 45, percentage: 75 },
    { count: 12, percentage: 20 },
    { count: 2, percentage: 3 },
    { count: 1, percentage: 2 },
    { count: 0, percentage: 0 },
  ])

  // 新评价表单数据
  interface NewReview {
    rating: number
    content: string
    images: string[]
    imageFiles: File[]
    emoji: string
  }

  const newReview = ref<NewReview>({
    rating: 0,
    content: '',
    images: [],
    imageFiles: [],
    emoji: '',
  })

  const reviewFormValid = ref(false)
  const submittingReview = ref(false)
  const reviewForm = ref()
  const imageInput = ref()

  // 表情选项
  const emojis = ref(['😊', '😍', '👍', '👎', '😢', '😡', '🤔', '😴'])

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

  // 预览图片
  function previewImage (imageUrl: string) {
    // 这里可以实现图片预览功能
    console.log('预览图片:', imageUrl)
  }

  // 触发图片上传
  function triggerImageUpload () {
    imageInput.value?.click()
  }

  // 处理图片上传
  function handleImageUpload (event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files) return

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/') && newReview.value.images.length < 9) {
        // 保存原始文件对象
        newReview.value.imageFiles.push(file)

        const reader = new FileReader()
        reader.addEventListener('load', e => {
          const result = e.target?.result as string
          if (result) {
            newReview.value.images.push(result)
          }
        })
        reader.readAsDataURL(file)
      }
    }

    // 清空 input 值，允许重复选择同一文件
    target.value = ''
  }

  // 移除图片
  function removeImage (index: number) {
    newReview.value.images.splice(index, 1)
    newReview.value.imageFiles.splice(index, 1)
  }

  // 提交评价
  async function submitReview () {
    if (!newReview.value.rating || !newReview.value.content.trim()) {
      return
    }

    submittingReview.value = true
    try {
      const reviewData = {
        productId: productDetail.value!.id,
        rating: newReview.value.rating,
        content: newReview.value.content,
        images: newReview.value.images,
        specs: selectedSpecsText.value,
      }

      const formData = new FormData()
      formData.append('productId', productDetail.value!.id)
      formData.append('rating', newReview.value.rating.toString())
      formData.append('content', newReview.value.content)
      for (const [index, file] of newReview.value.imageFiles.entries()) {
        formData.append('imageFiles', file)
      }

      await publishCommentService(formData)

      // 重置表单
      newReview.value = {
        rating: 0,
        content: '',
        images: [],
        imageFiles: [],
        emoji: '',
      }

      console.log('评价提交成功:', reviewData)
    } catch (error) {
      console.error('提交评价失败:', error)
    } finally {
      submittingReview.value = false
    }
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

  // 验证库存是否充足
  function validateStock () {
    if (!productDetail.value) return false
    if (quantity.value > productDetail.value.stock) {
      showWarning(`库存不足，当前库存为 ${productDetail.value.stock}`)
      return false
    }
    return true
  }

  function addToCart () {
    if (!validateSpecs()) return
    if (!validateStock()) return
    console.log('加入购物车', {
      product: productDetail.value,
      quantity: quantity.value,
      selectedSpecs: selectedSpecsText.value,
      finalPrice: finalCurrentPrice.value,
      totalPrice: finalCurrentPrice.value * quantity.value,
    })
  }

  async function buyNow () {
    // 登录校验：未登录则打开登录弹窗
    const tokenStore = userTokenStore()
    if (!tokenStore.token) {
      appStore.openAuthDialog()
      return
    }
    if (!validateSpecs()) return
    if (!validateStock()) return
    // 构建参数
    const params = {
      productId: productDetail.value!.id,
      quantity: quantity.value,
      spec: productDetail.value!.specs.map(spec => {
        return {
          id: spec.id,
          specValue: spec.specValues.find(v => v.id === selectedSpecs.value[spec.id]),
        }
      }),
      product: productDetail.value,
      specText: selectedSpecsText.value,
      finalPrice: finalCurrentPrice.value,
    }

    // 使用 js-base64 进行 UTF-8 的 URL-safe Base64 编码
    const encodedData = Base64.encodeURL(JSON.stringify(params))
    await router.push({
      path: '/client/OrderSubmit',
      query: {
        data: encodedData,
      },
    })
  }

  // 验证数量是否超过库存
  function validateQuantity () {
    if (productDetail.value && quantity.value > productDetail.value.stock) {
      quantity.value = productDetail.value.stock
      showWarning(`数量不能超过库存 ${productDetail.value.stock}`)
    } else if (quantity.value < 1) {
      quantity.value = 1
    }
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

  /**
   * 获取评价数据
   */
  async function getReviews () {
    console.log('开始加载评价数据...')
    // 模拟评价数据
    reviews.value = [
      {
        id: 1,
        userName: '张三',
        userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 5,
        content: '显示器质量很好，色彩鲜艳，144Hz刷新率玩游戏很流畅。包装也很仔细，物流很快。',
        createTime: '2024-01-15',
        images: [
          'https://picsum.photos/200/200?random=1',
          'https://picsum.photos/200/200?random=2',
        ],
        specs: '颜色：黑色，尺寸：27英寸',
      },
      {
        id: 2,
        userName: '李四',
        userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        rating: 4,
        content: '整体不错，但是支架有点松动，不过不影响使用。画质清晰，性价比很高。',
        createTime: '2024-01-10',
        specs: '颜色：白色，尺寸：27英寸',
      },
      {
        id: 3,
        userName: '王五',
        userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 5,
        content: '非常满意！4K分辨率看电影效果很棒，HDR效果也很不错。推荐购买！',
        createTime: '2024-01-08',
        images: [
          'https://picsum.photos/200/200?random=3',
        ],
        specs: '颜色：黑色，尺寸：27英寸',
      },
      {
        id: 4,
        userName: '赵六',
        userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        rating: 3,
        content: '显示器还可以，但是有个坏点，联系客服后很快就处理了。服务态度不错。',
        createTime: '2024-01-05',
        specs: '颜色：银色，尺寸：27英寸',
      },
      {
        id: 5,
        userName: '钱七',
        userAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        rating: 5,
        content: '完美！从下单到收货只用了2天，显示器没有任何问题，画质清晰，色彩准确。',
        createTime: '2024-01-03',
        images: [
          'https://picsum.photos/200/200?random=4',
          'https://picsum.photos/200/200?random=5',
          'https://picsum.photos/200/200?random=6',
        ],
        specs: '颜色：黑色，尺寸：27英寸',
      },
    ]
    console.log('评价数据加载完成:', reviews.value.length, '条评价')
  }

  onMounted(() => {
    getProduct()
    getReviews()
  })
</script>

<style scoped>
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>
