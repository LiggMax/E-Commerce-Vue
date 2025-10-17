<template>
  <v-container class="py-8" max-width="1200">
    <v-row>
      <!-- 左侧：订单信息 -->
      <v-col cols="12" md="8">
        <v-card class="mb-0" elevation="2" rounded="lg">
          <v-card-title class="text-h6">订单信息</v-card-title>
          <v-divider />
          <v-card-text>
            <div v-if="orderData.product" class="d-flex ga-4">
              <v-img
                cover
                height="120"
                rounded="lg"
                :src="orderData.product.images.largeImage"
                width="120"
              />
              <div class="flex-grow-1">
                <div class="text-h6">{{ orderData.product.title }}</div>
                <div class="text-body-2 text-medium-emphasis mt-2">
                  规格：{{ orderData.specText }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  数量：{{ orderData.quantity }}
                </div>
                <div class="text-h6 text-primary mt-2">
                  ¥{{ ((orderData.finalPrice || 0) * orderData.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 收货地址 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6">收货地址</v-card-title>
          <v-divider />
          <v-card-text>
            <!-- 地址列表 -->
            <div v-if="addresses.length > 0">
              <v-row>
                <!-- 显示前三个地址 -->
                <v-col
                  v-for="address in displayedAddresses"
                  :key="address.id"
                  cols="12"
                  lg="4"
                  md="6"
                >
                  <v-card
                    class="address-card v-card--hover h-100"
                    :color="selectedAddress?.id === address.id ? 'primary' : undefined"
                    elevation="0"
                    :variant="selectedAddress?.id === address.id ? 'outlined' : undefined"
                    @click="selectAddress(address)"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center justify-space-between mb-3">
                        <div class="text-h6 font-weight-bold">{{ address.recipientName }}</div>
                        <v-chip
                          v-if="address.isDefault"
                          color="primary"
                          size="small"
                          variant="flat"
                        >
                          默认
                        </v-chip>
                      </div>
                      <div class="text-body-1 text-medium-emphasis mb-2">
                        <v-icon class="mr-2" icon="mdi-phone" size="16" />
                        {{ address.phone }}
                      </div>
                      <div class="text-body-1 mb-2">
                        <v-icon class="mr-2" icon="mdi-map-marker" size="16" />
                        {{ address.province }} {{ address.city }} {{ address.district }}
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        {{ address.detailAddress }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- 更多地址按钮 -->
                <v-col
                  v-if="addresses.length > 3"
                  class="justify-end"
                  cols="12"
                >
                  <v-btn
                    class="more-address-btn"
                    :color="showAllAddresses ? 'primary' : 'default'"
                    variant="text"
                    @click="showAllAddresses = !showAllAddresses"
                  >
                    <v-icon
                      class="mr-2"
                      :icon="showAllAddresses ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                      size="20"
                    />
                    {{ showAllAddresses ? '收起' : `更多地址 (${addresses.length - 3})` }}
                  </v-btn>
                </v-col>
              </v-row>

              <!-- 展开显示所有地址 -->
              <v-expand-transition>
                <div v-if="showAllAddresses && addresses.length > 3">
                  <v-divider class="my-4" />
                  <v-row>
                    <v-col
                      v-for="address in hiddenAddresses"
                      :key="address.id"
                      cols="12"
                      lg="4"
                      md="6"
                    >
                      <v-card
                        class="address-card h-100"
                        :color="selectedAddress?.id === address.id ? 'primary' : undefined"
                        elevation="0"
                        :variant="selectedAddress?.id === address.id ? 'outlined' : undefined"
                        @click="selectAddress(address)"
                      >
                        <v-card-text class="pa-4">
                          <div class="d-flex align-center justify-space-between mb-3">
                            <div class="text-h6 font-weight-bold">{{ address.recipientName }}</div>
                            <v-chip
                              v-if="address.isDefault"
                              color="primary"
                              size="small"
                              variant="flat"
                            >
                              默认
                            </v-chip>
                          </div>
                          <div class="text-body-1 text-medium-emphasis mb-2">
                            <v-icon class="mr-2" icon="mdi-phone" size="16" />
                            {{ address.phone }}
                          </div>
                          <div class="text-body-1 mb-2">
                            <v-icon class="mr-2" icon="mdi-map-marker" size="16" />
                            {{ address.province }} {{ address.city }} {{ address.district }}
                          </div>
                          <div class="text-body-2 text-medium-emphasis">
                            {{ address.detailAddress }}
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </div>

            <!-- 无地址时的提示 -->
            <div v-else class="text-center py-6">
              <v-icon class="mb-3" color="grey-lighten-1" icon="mdi-map-marker-outline" size="48" />
              <div class="text-h6 text-medium-emphasis mb-2">暂无收货地址</div>
              <div class="text-body-2 text-medium-emphasis mb-4">请先添加收货地址</div>
              <v-btn
                color="primary"
                variant="outlined"
                @click="goToAddressManagement"
              >
                去添加地址
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- 订单备注 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6">订单备注</v-card-title>
          <v-divider />
          <v-card-text>
            <v-textarea
              v-model="orderRemark"
              counter="200"
              label="备注信息（选填）"
              placeholder="请输入订单备注信息，如特殊配送要求等..."
              rows="3"
              :rules="remarkRules"
              variant="outlined"
            />
          </v-card-text>
        </v-card>

        <!-- 支付方式 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6">支付方式</v-card-title>
          <v-divider />
          <v-card-text>
            <v-radio-group v-model="paymentMethod" inline>
              <v-radio label="微信支付" value="WX_PAY" />
              <v-radio label="支付宝" value="alipay" />
              <v-radio label="银行卡" value="bank" />
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右侧：订单摘要 -->
      <v-col cols="12" md="4">
        <v-card class="sticky-card" elevation="2" rounded="lg">
          <v-card-title class="text-h6">订单摘要</v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span>商品金额</span>
              <span>¥{{ ((orderData.finalPrice || 0) * orderData.quantity).toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>运费</span>
              <span>¥0.00</span>
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between text-h6 font-weight-bold">
              <span>应付金额</span>
              <span class="text-primary">¥{{ ((orderData.finalPrice || 0) * orderData.quantity).toFixed(2) }}</span>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              block
              color="primary"
              :disabled="!selectedAddress"
              rounded="lg"
              size="large"
              @click="submitOrder"
            >
              提交订单
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { Base64 } from 'js-base64'
  import { useRoute } from 'vue-router'
  import { createOrderService } from '@/http/client/order'
  import { getAddressService } from '@/http/client/user'
  import router from '@/router'
  import { useNotification } from '@/utils/notification.ts'

  const { showSuccess } = useNotification()
  const route = useRoute()

  // 订单数据接口
  interface OrderData {
    productId: string
    quantity: number
    spec: Array<{
      id: number
      specValue: any
    }>
    product?: any
    specText?: string
    finalPrice?: number
  }

  // 地址接口
  interface Address {
    id: number
    recipientName: string
    phone: string
    province: string
    city: string
    district: string
    detailAddress: string
    isDefault: boolean
  }

  const orderData = ref<OrderData>({
    productId: '',
    quantity: 1,
    spec: [],
  })

  const addresses = ref<Address[]>([])
  const selectedAddress = ref<Address | null>(null)
  const paymentMethod = ref('WX_PAY')
  const showAllAddresses = ref(false)
  const orderRemark = ref('')

  // 计算属性：显示前三个地址
  const displayedAddresses = computed(() => {
    return addresses.value.slice(0, 3)
  })

  // 计算属性：隐藏的地址（第4个及以后）
  const hiddenAddresses = computed(() => {
    return addresses.value.slice(3)
  })

  // 备注验证规则
  const remarkRules = [
    (v: string) => !v || v.length <= 200 || '备注信息不能超过200个字符',
  ]

  // 从路由参数获取订单数据
  onMounted(() => {
    if (route.query.data) {
      try {
        // 使用 js-base64 解码（自动处理 UTF-8 + URL-safe）
        const json = Base64.decode(route.query.data as string)
        orderData.value = JSON.parse(json)
        console.log('接收到的订单数据:', orderData.value)
      } catch (error) {
        console.error('解析订单数据失败:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  })

  // 获取收货地址
  async function getAddresses () {
    try {
      const response = await getAddressService()
      addresses.value = response.data.map((item: any) => ({
        id: item.id,
        recipientName: item.receiverName,
        phone: item.receiverPhone,
        province: item.province,
        city: item.city,
        district: item.district,
        detailAddress: item.detailAddress,
        isDefault: item.isDefault,
      }))

      // 自动选择默认地址
      const defaultAddress = addresses.value.find(addr => addr.isDefault)
      if (defaultAddress) {
        selectedAddress.value = defaultAddress
      } else if (addresses.value.length > 0) {
        // 如果没有默认地址，选择第一个
        selectedAddress.value = addresses.value[0]
      }
    } catch (error) {
      console.error('获取地址失败:', error)
    }
  }

  // 选择收货地址
  function selectAddress (address: Address) {
    selectedAddress.value = address
  }

  // 跳转到地址管理页面
  function goToAddressManagement () {
    router.push('/client/UserCenter?tab=addresses')
  }

  // 提交订单
  async function submitOrder () {
    if (!selectedAddress.value) {
      alert('请选择收货地址')
      return
    }

    try {
      const params = {
        productId: orderData.value.productId,
        quantity: orderData.value.quantity,
        addressId: selectedAddress.value.id,
        payType: paymentMethod.value,
        remark: orderRemark.value,
        spec: orderData.value.spec.map(item => ({
          id: item.id,
          specValue: {
            id: item.specValue.id,
          },
        })),
      }

      await createOrderService(params).then(response => {
        showSuccess('订单提交成功')
        router.push(`/client/OrderPayment?orderNo=${response.data}`)
      })
    } catch (error) {
      console.error('提交订单失败:', error)
    }
  }

  onMounted(() => {
    getAddresses()
  })
</script>

<style scoped>
  .sticky-card {
    position: sticky;
    top: 20px;
  }

  .address-card {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .address-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .more-address-btn {
    margin-top: 16px;
  }

</style>
