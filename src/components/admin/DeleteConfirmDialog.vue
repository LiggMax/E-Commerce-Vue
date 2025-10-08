<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
        确认删除
      </v-card-title>
      <v-card-text>
        <p>确定要删除该{{ itemType }} "{{ itemTitle }}" 吗？</p>
        <p class="text-medium-emphasis">此操作无法撤销。</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="error"
          :loading="deleting"
          @click="handleConfirm"
        >
          确认删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  // Props
  interface Props {
    modelValue: boolean
    itemTitle: string
    itemType?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    itemType: '项目',
  })

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
  }

  const emit = defineEmits<Emits>()

  // 响应式数据
  const deleting = ref(false)

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
  }

  // 确认删除
  function handleConfirm () {
    deleting.value = true
    emit('confirm')
  }

  // 监听删除状态，重置loading状态
  watch(dialog, newValue => {
    if (!newValue) {
      deleting.value = false
    }
  })
</script>

<style scoped>
</style>
