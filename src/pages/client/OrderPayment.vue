<template>
  <v-container class="py-8" max-width="800">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- 订单信息卡片 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h5 d-flex align-center">
            <v-icon class="mr-3" color="success" icon="mdi-check-circle" />
            订单提交成功
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <div class="text-center mb-6">
              <div class="text-h6 mb-2">订单号：{{ orderInfo.orderNo }}</div>
              <div class="text-body-1 text-medium-emphasis">
                请尽快完成支付，订单将在30分钟后自动取消
              </div>
            </div>

            <!-- 订单详情 -->
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-3">
                  <v-img
                    class="mr-4"
                    cover
                    height="80"
                    rounded="lg"
                    :src="orderInfo.productImage"
                    width="80"
                  />
                  <div class="flex-grow-1">
                    <div class="text-h6">{{ orderInfo.productTitle }}</div>
                    <div class="text-body-2 text-medium-emphasis">
                      规格：{{ orderInfo.specText }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      数量：{{ orderInfo.quantity }}
                    </div>
                  </div>
                  <div class="text-h6 text-primary">
                    ¥{{ orderInfo.totalAmount }}
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- 收货地址 -->
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="pa-4">
                <div class="d-flex align-start">
                  <v-icon class="mr-3 mt-1" icon="mdi-map-marker" />
                  <div>
                    <div class="text-body-1 font-weight-bold">
                      {{ orderInfo.receiverName }} {{ orderInfo.receiverPhone }}
                    </div>
                    <div class="text-body-2">
                      {{ orderInfo.province }} {{ orderInfo.city }} {{ orderInfo.district }}
                    </div>
                    <div class="text-body-2">{{ orderInfo.detailAddress }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- 订单备注 -->
            <v-card v-if="orderInfo.remark" variant="outlined">
              <v-card-text class="pa-4">
                <div class="d-flex align-start">
                  <v-icon class="mr-3 mt-1" icon="mdi-note-text" />
                  <div>
                    <div class="text-body-1 font-weight-bold mb-1">订单备注</div>
                    <div class="text-body-2">{{ orderInfo.remark }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>

        <!-- 支付方式选择 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-title class="text-h6">选择支付方式</v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <v-radio-group v-model="selectedPaymentMethod" class="mb-4">
              <v-radio
                v-for="payment in paymentMethods"
                :key="payment.value"
                class="mb-3"
                :value="payment.value"
              >
                <template #label>
                  <div class="d-flex align-center">
                    <v-img
                      class="mr-3"
                      height="32"
                      :src="payment.icon"
                      width="32"
                    />
                    <div>
                      <div class="text-body-1 font-weight-medium">{{ payment.name }}</div>
                      <div class="text-body-2 text-medium-emphasis">{{ payment.description }}</div>
                    </div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- 支付金额 -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div class="text-h6">应付金额</div>
              <div class="text-h4 text-primary font-weight-bold">
                ¥{{ orderInfo.totalAmount }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 支付按钮 -->
        <div class="text-center">
          <v-btn
            class="payment-btn"
            color="primary"
            :disabled="!selectedPaymentMethod"
            :loading="paying"
            rounded="lg"
            size="x-large"
            @click="handlePayment"
          >
            <v-icon class="mr-2" icon="mdi-credit-card" />
            立即支付 ¥{{ orderInfo.totalAmount }}
          </v-btn>
        </div>

        <!-- 其他操作 -->
        <div class="text-center mt-4">
          <v-btn
            color="medium-emphasis"
            variant="text"
            @click="goToOrderDetail"
          >
            查看订单详情
          </v-btn>
          <v-btn
            class="ml-4"
            color="medium-emphasis"
            variant="text"
            @click="goToHome"
          >
            返回首页
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { getOrderDetailService, payOrderService } from '@/http/client/order'
  import { useNotification } from '@/utils/notification.ts'

  const { showSuccess, showError } = useNotification()
  const route = useRoute()
  const router = useRouter()

  // 订单信息接口
  interface OrderInfo {
    orderNo: string
    productTitle: string
    productImage: string
    specText: string
    quantity: number
    totalAmount: string
    receiverName: string
    receiverPhone: string
    province: string
    city: string
    district: string
    detailAddress: string
    remark?: string
    payType: string
    status: string
  }

  // 支付方式接口
  interface PaymentMethod {
    value: string
    name: string
    description: string
    icon: string
  }

  // 响应式数据
  const orderInfo = ref<OrderInfo>({
    orderNo: '',
    productTitle: '',
    productImage: '',
    specText: '',
    quantity: 0,
    totalAmount: '0.00',
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    payType: '',
    status: '',
  })

  const selectedPaymentMethod = ref('')
  const paying = ref(false)

  // 支付方式配置
  const paymentMethods = ref<PaymentMethod[]>([
    {
      value: 'WX_PAY',
      name: '微信支付',
      description: '推荐使用，安全便捷',
      icon: '/icons/wechat-pay.png',
    },
    {
      value: 'ALIPAY',
      name: '支付宝',
      description: '支持花呗分期',
      icon: '/icons/alipay.png',
    },
    {
      value: 'BANK_CARD',
      name: '银行卡支付',
      description: '支持各大银行',
      icon: '/icons/bank-card.png',
    },
  ])

  // 获取订单详情
  async function getOrderDetail () {
    const orderNo = route.query.orderNo as string
    if (!orderNo) {
      showError('订单号不存在')
      await router.push('/')
      return
    }

    try {
      const response = await getOrderDetailService(orderNo)
      const orderData = response.data

      // 数据转换
      orderInfo.value = {
        orderNo: orderData.orderNo,
        productTitle: orderData.productTitle || '商品标题', // 需要从商品信息获取
        productImage: orderData.productImage || '/default-product.png', // 需要从商品信息获取
        specText: orderData.specText || '默认规格', // 需要从规格信息获取
        quantity: orderData.quantity || 1, // 需要从订单项获取
        totalAmount: orderData.totalAmount.toFixed(2), // 格式化金额
        receiverName: orderData.receiverName || '收货人', // 需要从地址信息获取
        receiverPhone: orderData.receiverPhone || '手机号', // 需要从地址信息获取
        province: orderData.province || '省份', // 需要从地址信息获取
        city: orderData.city || '城市', // 需要从地址信息获取
        district: orderData.district || '区县', // 需要从地址信息获取
        detailAddress: orderData.detailAddress || '详细地址', // 需要从地址信息获取
        remark: orderData.remark || '',
        payType: orderData.payType,
        status: orderData.status,
      }

      selectedPaymentMethod.value = orderInfo.value.payType
    } catch (error) {
      console.error('获取订单详情失败:', error)
    }
  }

  // 处理支付
  async function handlePayment () {
    if (!selectedPaymentMethod.value) {
      showError('请选择支付方式')
      return
    }

    paying.value = true
    try {
      const params = {
        orderNo: orderInfo.value.orderNo,
        payType: selectedPaymentMethod.value,
      }
      const response = await payOrderService(params)
      showSuccess('支付成功')
    } catch (error) {
      console.error('支付失败:', error)
    } finally {
      paying.value = false
    }
  }

  // 微信支付处理
  function handleWechatPay (payData: any) {
    // 这里应该调用微信支付SDK
    console.log('微信支付数据:', payData)
    showSuccess('正在跳转到微信支付...')
    // 模拟支付成功
    setTimeout(() => {
      showSuccess('支付成功！')
      router.push('/client/UserCenter?tab=orders')
    }, 2000)
  }

  // 支付宝支付处理
  function handleAlipay (payData: any) {
    // 跳转到支付宝支付页面
    window.open(payData.payUrl, '_blank')
    showSuccess('正在跳转到支付宝支付...')
  }

  // 银行卡支付处理
  function handleBankPay (payData: any) {
    // 跳转到银行支付页面
    window.open(payData.payUrl, '_blank')
    showSuccess('正在跳转到银行支付...')
  }

  // 查看订单详情
  function goToOrderDetail () {
    router.push(`/client/UserCenter?tab=orders`)
  }

  // 返回首页
  function goToHome () {
    router.push('/')
  }

  // 页面初始化
  onMounted(() => {
    getOrderDetail()
  })
</script>

<style scoped>
  .payment-btn {
    min-width: 300px;
    height: 56px;
    font-size: 18px;
    font-weight: 600;
  }

  .payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.3);
  }
</style>
