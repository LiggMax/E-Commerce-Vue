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
            <v-card :key="`order-detail-${orderInfo.orderNo}`" class="mb-4" variant="outlined">
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
                    <img alt="" class="mr-2" :src="payment.icon" style="width: 30px">
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
            @click="goToOrderPage"
          >
            跳转订单页面
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

    <!-- 支付成功弹窗 -->
    <v-dialog v-model="showPaymentSuccessDialog" max-width="500">
      <v-card class="d-flex align-center text-center pa-6">
        <v-icon class="mb-4" color="success" size="80">mdi-check-circle</v-icon>
        <v-card-title class="text-h5 justify-center mb-2">
          支付成功
        </v-card-title>
        <v-card-text>
          <p class="text-body-1 mb-4">订单号：{{ orderInfo.orderNo }}</p>
          <p class="text-h6 mb-2">支付金额：<span class="text-primary">¥{{ orderInfo.totalAmount }}</span></p>
          <p class="text-body-2 text-medium-emphasis">
            页面将在 <span class="text-primary font-weight-bold">{{ successCountdown }}</span> 秒后自动跳转到订单详情页
          </p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            @click="goToOrderPage"
          >
            立即跳转
          </v-btn>
          <v-btn
            color="primary"
            @click="goToHome"
          >
            返回首页
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import AILPAY from '@/assets/icon/ailpay.svg'
  import BANKCARD from '@/assets/icon/bank-card.svg'
  import WECHAT from '@/assets/icon/wechat.svg'
  import { getOrderDetailService, payOrderService } from '@/http/client/order'
  import router from '@/router'
  import { useNotification } from '@/utils/notification.ts'

  const { showError } = useNotification()
  const route = useRoute()

  // 规格值接口
  interface SpecValue {
    id: number
    value: string
  }

  // 订单信息接口
  interface OrderInfo {
    orderNo: string
    userId?: string
    totalAmount: number
    status: string
    quantity: number
    remark?: string
    expireTime: number
    specValues: (SpecValue | null)[]
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
    paymentStatus?: string
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
    specValues: [],
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
  })

  const selectedPaymentMethod = ref('')
  const paying = ref(false)
  const remainingSeconds = ref(0)
  const showPaymentSuccessDialog = ref(false)
  const successCountdownValue = ref(5)
  let countdownTimer: number | null = null
  let successCountdownTimer: number | null = null

  const specText = computed(() => {
    if (!orderInfo.value.specValues || !Array.isArray(orderInfo.value.specValues)) {
      return ''
    }
    return orderInfo.value.specValues
      .filter((spec): spec is SpecValue => spec !== null && spec !== undefined && Boolean(spec.value))
      .map(spec => spec.value)
      .join(' / ')
  })

  // 倒计时文本格式化
  const countdownText = computed(() => {
    const seconds = remainingSeconds.value
    if (seconds <= 0) return '00:00'

    const minutes = Math.floor(seconds / 60)
    const remainingSecs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`
  })

  // 支付成功倒计时文本
  const successCountdown = computed(() => {
    return successCountdownValue.value
  })

  // 支付方式配置
  const paymentMethods = ref([
    {
      value: 'WX_PAY',
      name: '微信支付',
      description: '推荐使用，安全便捷',
      icon: WECHAT,
    },
    {
      value: 'ALI_PAY',
      name: '支付宝',
      description: '支持花呗分期',
      icon: AILPAY,
    },
    {
      value: 'BANK_CARD',
      name: '银行卡支付',
      description: '支持各大银行',
      icon: BANKCARD,
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

  // 启动支付成功后的倒计时
  function startSuccessCountdown () {
    successCountdownValue.value = 5

    if (successCountdownTimer) {
      clearInterval(successCountdownTimer)
    }

    successCountdownTimer = setInterval(() => {
      successCountdownValue.value--

      if (successCountdownValue.value <= 0) {
        clearInterval(successCountdownTimer!)
        successCountdownTimer = null
        goToOrderPage()
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
        paymentStatus: orderData.paymentStatus,
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
      await payOrderService(params)
      // 显示支付成功弹窗
      showPaymentSuccessDialog.value = true
      // 启动支付成功倒计时
      startSuccessCountdown()
    } catch (error) {
      console.error('支付失败:', error)
    } finally {
      paying.value = false
    }
  }

  // 查看订单详情
  function goToOrderPage () {
    showPaymentSuccessDialog.value = false
    router.push(`/client/UserCenter?tab=orders`)
  }

  // 返回首页
  function goToHome () {
    showPaymentSuccessDialog.value = false
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

    if (successCountdownTimer) {
      clearInterval(successCountdownTimer)
      successCountdownTimer = null
    }
  })
</script>

<style scoped>
</style>
