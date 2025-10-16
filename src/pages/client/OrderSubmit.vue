<template>
  <v-container class="py-8" max-width="1200">
    <v-row>
      <!-- 左侧：订单信息 -->
      <v-col cols="12" md="8">
        <v-card class="mb-6" elevation="2" rounded="lg">
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
            <v-btn color="primary" variant="outlined" @click="selectAddress">
              选择收货地址
            </v-btn>
            <div v-if="selectedAddress" class="mt-4">
              <div class="text-body-1 font-weight-bold">{{ selectedAddress.name }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ selectedAddress.phone }}</div>
              <div class="text-body-2">{{ selectedAddress.fullAddress }}</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 支付方式 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6">支付方式</v-card-title>
          <v-divider />
          <v-card-text>
            <v-radio-group v-model="paymentMethod" inline>
              <v-radio label="微信支付" value="wechat" />
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
  import { useRoute, useRouter } from 'vue-router'
  import { createOrderService } from '@/http/client/order.ts'

  const route = useRoute()
  const router = useRouter()

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
    name: string
    phone: string
    fullAddress: string
  }

  const orderData = ref<OrderData>({
    productId: '',
    quantity: 1,
    spec: [],
  })

  const selectedAddress = ref<Address | null>(null)
  const paymentMethod = ref('wechat')

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

  // 选择收货地址
  function selectAddress () {
    // TODO: 实现地址选择逻辑
    console.log('选择收货地址')
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
        spec: orderData.value.spec,
        addressId: selectedAddress.value.id,
        paymentMethod: paymentMethod.value,
      }

      console.log('提交订单参数:', params)

      // TODO: 调用创建订单API
      // const orderService = createOrderService()
      // const result = await orderService.createOrder(params)

      // 模拟成功
      alert('订单提交成功！')
      router.push('/user/orders')
    } catch (error) {
      console.error('提交订单失败:', error)
      alert('提交订单失败，请重试')
    }
  }
</script>

<style scoped>
  .sticky-card {
    position: sticky;
    top: 20px;
  }
</style>
