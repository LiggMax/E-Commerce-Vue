<template>
  <v-dialog v-model="dialog" max-height="90vh" max-width="800px" persistent>
    <v-card class="order-detail-dialog d-flex flex-column" style="height: 90vh;">
      <!-- 头部 -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon class="mr-3" color="primary" size="32">mdi-package-variant</v-icon>
        <span class="text-h6">订单详情</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="handleClose"
        />
      </v-card-title>

      <v-divider />

      <!-- 内容 -->
      <v-card-text class="pa-6 flex-grow-1" style="overflow-y: auto;">
        <div v-if="props.loading" class="text-center py-8">
          <v-progress-circular color="primary" indeterminate size="48" />
          <p class="text-body-2 text-medium-emphasis mt-4">加载订单详情中...</p>
        </div>

        <div v-else-if="props.orderDetail">
          <!-- 订单基本信息 -->
          <v-card class="mb-4" elevation="1">
            <v-card-subtitle class="text-h6 pa-4 pb-2">订单信息</v-card-subtitle>
            <v-card-text class="pt-0">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-2">
                    <span class="text-body-2 text-medium-emphasis">订单号：</span>
                    <span class="text-body-1">{{ props.orderDetail.orderNo }}</span>
                  </div>
                  <div class="detail-item mb-2">
                    <span class="text-body-2 text-medium-emphasis">订单状态：</span>
                    <v-chip
                      :color="getStatusColor(props.orderDetail.status)"
                      size="small"
                    >
                      {{ getStatusText(props.orderDetail.status) }}
                    </v-chip>
                  </div>
                  <div class="detail-item mb-2">
                    <span class="text-body-2 text-medium-emphasis">订单金额：</span>
                    <span class="text-h6 text-primary font-weight-bold">¥{{ props.orderDetail.totalAmount }}</span>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-2">
                    <span class="text-body-2 text-medium-emphasis">商品数量：</span>
                    <span class="text-body-1">{{ props.orderDetail.quantity }} 件</span>
                  </div>
                  <div v-if="props.orderDetail.remark" class="detail-item mb-2">
                    <span class="text-body-2 text-medium-emphasis">备注：</span>
                    <span class="text-body-1">{{ props.orderDetail.remark }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- 商品信息 -->
          <v-card class="mb-4" elevation="1">
            <v-card-subtitle class="text-h6 pa-4 pb-2">商品信息</v-card-subtitle>
            <v-card-text class="pt-0">
              <div class="d-flex align-center">
                <v-avatar class="mr-4" size="80">
                  <v-img :src="props.orderDetail.product.image" />
                </v-avatar>
                <div class="flex-grow-1">
                  <h4 class="text-subtitle-1 font-weight-medium mb-2">{{ props.orderDetail.product.title }}</h4>
                  <div v-if="specText" class="text-body-2 text-medium-emphasis mb-2">
                    规格：{{ specText }}
                  </div>
                  <div class="text-h6 font-weight-bold text-primary">
                    ¥{{ props.orderDetail.totalAmount }}
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- 收货地址 -->
          <v-card elevation="1">
            <v-card-subtitle class="text-h6 pa-4 pb-2">收货地址</v-card-subtitle>
            <v-card-text class="pt-0">
              <div class="detail-item mb-2">
                <span class="text-body-2 text-medium-emphasis">收货人：</span>
                <span class="text-body-1">{{ props.orderDetail.address.receiverName }}</span>
              </div>
              <div class="detail-item mb-2">
                <span class="text-body-2 text-medium-emphasis">联系电话：</span>
                <span class="text-body-1">{{ props.orderDetail.address.receiverPhone }}</span>
              </div>
              <div class="detail-item">
                <span class="text-body-2 text-medium-emphasis">收货地址：</span>
                <span class="text-body-1">
                  {{ props.orderDetail.address.province }} {{ props.orderDetail.address.city }}
                  {{ props.orderDetail.address.district }} {{ props.orderDetail.address.detailAddress }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <div v-else class="text-center py-8">
          <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-alert-circle" size="48" />
          <p class="text-body-1 text-medium-emphasis">加载订单详情失败</p>
        </div>
      </v-card-text>

      <v-divider />

      <!-- 操作按钮 -->
      <v-card-actions class="pa-6 flex-shrink-0">
        <v-spacer />
        <v-btn
          color="primary"
          variant="outlined"
          @click="handleClose"
        >
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  // Props
  interface Props {
    modelValue: boolean
    orderDetail?: any
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    orderDetail: null,
    loading: false,
  })

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
  }

  const emit = defineEmits<Emits>()

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  // 规格文本
  const specText = computed(() => {
    if (!props.orderDetail?.specValues || !Array.isArray(props.orderDetail.specValues)) {
      return ''
    }
    return props.orderDetail.specValues
      .filter((spec: any): spec is { id: number, value: string } =>
        spec !== null && spec !== undefined && Boolean(spec?.value),
      )
      .map((spec: { id: number, value: string }) => spec.value)
      .join(' / ')
  })

  // 获取状态文本
  function getStatusText (status: string) {
    const statusMap: Record<string, string> = {
      UNPAID: '待支付',
      PAID: '已支付',
      DELIVERED: '已发货',
      COMPLETED: '已收货',
      CANCELED: '已取消',
      REFUNDING: '退款中',
      REFUNDED: '已退款',
    }
    return statusMap[status] || status
  }

  // 获取状态颜色
  function getStatusColor (status: string) {
    const colorMap: Record<string, string> = {
      UNPAID: 'warning',
      PAID: 'info',
      DELIVERED: 'primary',
      COMPLETED: 'success',
      CANCELED: 'error',
      REFUNDING: 'orange',
      REFUNDED: 'grey',
    }
    return colorMap[status] || 'grey'
  }

  // 处理关闭
  function handleClose () {
    dialog.value = false
  }
</script>

<style scoped>
.order-detail-dialog {
  border-radius: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
