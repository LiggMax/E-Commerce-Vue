<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card class="confirm-dialog">
      <!-- 头部 -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon class="mr-3" color="error" size="32">mdi-alert-circle</v-icon>
        <span class="text-h6">{{ title }}</span>
      </v-card-title>

      <v-divider />

      <!-- 内容 -->
      <v-card-text class="pa-6 pt-4">
        <div class="text-center">
          <p class="text-body-1 mb-4">{{ message }}</p>
          <div v-if="showDetails" class="text-body-2 text-medium-emphasis">
            <slot name="details" />
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <!-- 操作按钮 -->
      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn
          color="grey"
          variant="outlined"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          class="ml-3"
          color="error"
          :loading="loading"
          variant="flat"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  // Props
  interface Props {
    modelValue: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    showDetails?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '确认删除',
    message: '此操作不可撤销，确定要继续吗？',
    confirmText: '确认删除',
    cancelText: '取消',
    loading: false,
    showDetails: false,
  })

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm' | 'cancel'): void
  }

  const emit = defineEmits<Emits>()

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  // 处理确认
  function handleConfirm () {
    emit('confirm')
  }

  // 处理取消
  function handleCancel () {
    emit('cancel')
    dialog.value = false
  }
</script>

<style scoped>
  .confirm-dialog {
    border-radius: 12px;
  }
</style>
