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
                请尽快完成支付，订单将在 <span class="text-error font-weight-bold">{{ countdownText }}</span> 后过期
              </div>
            </div>

            <!-- 订单详情 -->
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-3">
                  <v-img
                    class="mr-4"
                    cover
                    height="110"
                    rounded="lg"
                    :src="orderInfo.product?.image"
                    width="80"
                  />
                  <div class="flex-grow-1">
                    <div class="text-h6">{{ orderInfo.product?.title }}</div>
                    <div class="text-body-2 text-medium-emphasis">
                      规格：{{ specText }}
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
                      {{ orderInfo.address?.receiverName }} {{ orderInfo.address?.receiverPhone }}
                    </div>
                    <div class="text-body-2">
                      {{ orderInfo.address?.province }} {{ orderInfo.address?.city }} {{ orderInfo.address?.district }}
                    </div>
                    <div class="text-body-2">{{ orderInfo.address?.detailAddress }}</div>
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
            class="text-h6 font-weight-bold"
            color="primary"
            :disabled="!selectedPaymentMethod"
            height="50px"
            :loading="paying"
            min-width="300px"
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
    userId?: string
    totalAmount: number
    status: string
    quantity: number
    remark?: string
    expireTime: number
    specValues: [
      {
        id: number
        value: string
      },
    ]
    address: {
      id: number
      receiverName: string
      receiverPhone: string
      province: string
      city: string
      district: string
      detailAddress: string
    }
    product: {
      id: string
      title: string
      image: string
    }
    paymentStatus: string
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
    userId: '',
    totalAmount: 0,
    status: '',
    quantity: 0,
    remark: '',
    expireTime: 0,
    specValues: [{
      id: 0,
      value: '',
    }],
    address: {
      id: 0,
      receiverName: '',
      receiverPhone: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
    },
    product: {
      id: '',
      title: '',
      image: '',
    },
    paymentStatus: '',
  })

  const selectedPaymentMethod = ref('')
  const paying = ref(false)
  const remainingSeconds = ref(0)
  let countdownTimer: number | null = null

  const specText = computed(() =>
    (orderInfo.value.specValues || [])
      .map(spec => spec.value)
      .filter(Boolean)
      .join(' / '),
  )

  // 倒计时文本格式化
  const countdownText = computed(() => {
    const seconds = remainingSeconds.value
    if (seconds <= 0) return '00:00'

    const minutes = Math.floor(seconds / 60)
    const remainingSecs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`
  })

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

  // 启动倒计时
  function startCountdown (seconds: number) {
    // 清除之前的定时器
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }

    remainingSeconds.value = seconds

    countdownTimer = setInterval(() => {
      remainingSeconds.value--

      if (remainingSeconds.value <= 0) {
        clearInterval(countdownTimer!)
        countdownTimer = null
        showError('订单已过期，请重新下单')
        // 可以跳转到首页或订单列表
        // router.push('/')
      }
    }, 1000)
  }

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

      // 后端结构映射到本地状态
      orderInfo.value = {
        orderNo: orderData.orderNo || '',
        userId: orderData.userId || '',
        totalAmount: Number(orderData.totalAmount || 0),
        status: orderData.status || '',
        quantity: Number(orderData.quantity || 0),
        remark: orderData.remark || '',
        expireTime: Number(orderData.expireTime || 0),
        specValues: Array.isArray(orderData.specValues) ? orderData.specValues : [],
        address: orderData.address || {
          id: 0,
          receiverName: '',
          receiverPhone: '',
          province: '',
          city: '',
          district: '',
          detailAddress: '',
        },
        product: orderData.product || {
          id: '',
          title: '',
          image: '',
        },
        paymentStatus: orderData.paymentStatus || '',
      }

      // 启动倒计时
      if (orderInfo.value.expireTime > 0) {
        startCountdown(orderInfo.value.expireTime)
      }

      // 如果后端返回支付方式，可在此设置；当前响应未包含
      // selectedPaymentMethod.value = orderData.payType || ''
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

  // 页面卸载时清理定时器
  onUnmounted(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  })
</script>

<style scoped>
</style>
