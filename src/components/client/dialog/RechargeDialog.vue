<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary" icon="mdi-credit-card-outline" />
        账户充值
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- 当前余额显示 -->
        <div class="text-center mb-6">
          <div class="text-h6 text-grey-darken-1 mb-2">当前余额</div>
          <div class="text-h3 font-weight-bold text-primary">
            ¥{{ currentBalance }}
          </div>
        </div>

        <!-- 充值金额选择 -->
        <div class="mb-4">
          <div class="text-subtitle-1 font-weight-medium mb-3">选择充值金额</div>
          <v-row>
            <v-col v-for="amount in presetAmounts" :key="amount" cols="4">
              <v-btn
                block
                color="primary"
                :variant="selectedAmount === amount ? 'flat' : 'outlined'"
                @click="selectAmount(amount)"
              >
                ¥{{ amount }}
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- 自定义金额输入 -->
        <div class="mb-4">
          <v-text-field
            v-model.number="customAmount"
            label="自定义金额"
            placeholder="请输入充值金额"
            prepend-inner-icon="mdi-cash"
            :rules="amountRules"
            suffix="元"
            type="number"
            variant="outlined"
            @input="onCustomAmountInput"
          />
        </div>

        <!-- 支付方式选择 -->
        <div class="mb-1">
          <div class="text-subtitle-1 font-weight-medium">选择支付方式</div>
          <v-radio-group v-model="paymentMethod" inline>
            <v-radio
              v-for="payment in paymentMethods"
              :key="payment.value"
              color="primary"
              :value="payment.value"
            >
              <template #label>
                <div class="d-flex align-center">
                  <img :alt="payment.name" class="mr-2" :src="payment.icon" style="width: 24px; height: 24px;">
                  {{ payment.name }}
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>

        <!-- 充值说明 -->
        <v-alert
          type="info"
          variant="tonal"
        >
          <div class="text-body-2">
            <div class="font-weight-medium mb-1">充值说明：</div>
            <ul class="ma-0 pa-0" style="list-style: none;">
              <li>• 充值金额将立即到账</li>
              <li>• 支持支付宝、微信支付、银行卡</li>
              <li>• 单次充值金额：10-5000元</li>
              <li>• 如有问题请联系客服</li>
            </ul>
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 actions-sticky">
        <v-spacer />
        <v-btn
          color="grey"
          variant="outlined"
          @click="closeDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!canRecharge"
          :loading="loading"
          variant="flat"
          @click="handleRecharge"
        >
          确认充值 ¥{{ finalAmount }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import AILPAY from '@/assets/icon/ailpay.svg'
  import BANKCARD from '@/assets/icon/bank-card.svg'
  import WECHAT from '@/assets/icon/wechat.svg'

  interface Props {
    modelValue: boolean
    currentBalance: number
  }

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

  interface Emits {
    (e: 'update:modelValue', value: boolean): void

    (e: 'recharge', data: { amount: number, paymentMethod: string }): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 响应式数据
  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const loading = ref(false)
  const selectedAmount = ref<number | null>(null)
  const customAmount = ref<number | null>(null)
  const paymentMethod = ref('WX_PAY')

  // 预设充值金额
  const presetAmounts = [50, 100, 200, 500, 1000, 2000]

  // 表单验证规则
  const amountRules = [
    (v: number) => (v !== null && v !== undefined) || '请输入充值金额',
    (v: number) => v >= 10 || '充值金额不能少于10元',
    (v: number) => v <= 5000 || '充值金额不能超过5000元',
    (v: number) => Number.isInteger(v) || '请输入整数金额',
  ]

  // 计算最终充值金额
  const finalAmount = computed(() => {
    return customAmount.value || selectedAmount.value || 0
  })

  // 是否可以充值
  const canRecharge = computed(() => {
    return finalAmount.value >= 10 && finalAmount.value <= 5000 && paymentMethod.value
  })

  // 选择预设金额
  function selectAmount (amount: number) {
    selectedAmount.value = amount
    customAmount.value = null
  }

  // 自定义金额输入
  function onCustomAmountInput () {
    selectedAmount.value = null
  }

  // 关闭弹窗
  function closeDialog () {
    dialog.value = false
    // 重置表单
    selectedAmount.value = null
    customAmount.value = null
  }

  // 处理充值
  async function handleRecharge () {
    if (!canRecharge.value) return

    try {
      loading.value = true

      // 发送充值事件
      emit('recharge', {
        amount: finalAmount.value,
        paymentMethod: paymentMethod.value,
      })
      closeDialog()
    } catch (error) {
      console.error('充值失败:', error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
/* 让操作按钮始终在弹窗底部可见 */
.actions-sticky {
  position: sticky;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
}

.pa-6 {
  overflow: auto;
}
</style>
