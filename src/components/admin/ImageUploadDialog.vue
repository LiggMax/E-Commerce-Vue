<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-upload</v-icon>
        上传图片 - {{ itemTitle }}
      </v-card-title>

      <v-card-text>
        <!-- 多文件上传组件 -->
        <v-file-input
          v-model="uploadFiles"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          clearable
          density="compact"
          label="选择图片文件"
          multiple
          prepend-icon="mdi-camera"
          :rules="fileValidationRules"
          show-size
          variant="outlined"
          @update:model-value="handleUploadFilesChange"
        />

        <!-- 文件要求提示 -->
        <div class="text-caption text-medium-emphasis mt-2">
          <v-icon class="mr-1" size="small">mdi-information</v-icon>
          支持 JPG、PNG、GIF、WebP 格式，每张图片不超过 2MB，可同时上传多张图片
        </div>

        <!-- 警告提示 -->
        <div v-if="!itemId" class="text-caption text-warning mt-2">
          <v-icon class="mr-1" size="small">mdi-alert</v-icon>
          请先保存商品信息，然后才能上传图片
        </div>

        <!-- 文件预览区域 -->
        <div v-if="uploadFiles.length > 0" class="mt-4">
          <h4 class="text-subtitle-1 mb-3">文件预览</h4>
          <v-list density="compact">
            <v-list-item
              v-for="(file, index) in uploadFiles"
              :key="index"
              class="px-0"
            >
              <template #prepend>
                <v-img
                  class="rounded-lg mx-3"
                  cover
                  height="60"
                  :src="getFilePreview(file)"
                  width="100"
                />
              </template>
              <v-list-item-title>{{ file.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatFileSize(file.size) }}
              </v-list-item-subtitle>

              <!-- 上传进度条 -->
              <div v-if="uploading && fileProgress[index] !== undefined" class="mt-2">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-caption">上传进度</span>
                  <span class="text-caption">{{ Math.round(fileProgress[index] || 0) }}%</span>
                </div>
                <v-progress-linear
                  color="primary"
                  height="6"
                  :model-value="fileProgress[index] || 0"
                  rounded
                />
              </div>

              <!-- 状态文字 -->
              <div v-else-if="fileProgress[index] === 100" class="text-caption text-success mt-1">
                上传完成
              </div>
              <div v-else-if="fileErrors[index]" class="text-caption text-error mt-1">
                上传失败
              </div>
              <div v-else class="text-caption text-medium-emphasis mt-1">
                等待上传
              </div>

              <!-- 状态指示 -->
              <template #append>
                <div class="d-flex align-center">
                  <v-progress-circular
                    v-if="uploading && fileProgress[index] !== undefined && fileProgress[index] < 100"
                    color="primary"
                    :model-value="fileProgress[index]"
                    size="24"
                    width="3"
                  />
                  <v-icon
                    v-else-if="fileProgress[index] === 100"
                    color="success"
                    icon="mdi-check"
                    size="24"
                  />
                  <v-icon
                    v-else-if="fileErrors[index]"
                    color="error"
                    icon="mdi-alert"
                    size="24"
                  />
                  <v-btn
                    v-if="fileErrors[index]"
                    color="primary"
                    icon="mdi-refresh"
                    size="small"
                    variant="text"
                    @click="retryUpload(index)"
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!canUpload"
          :loading="uploading"
          @click="handleUpload"
        >
          开始上传
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { UPLOAD_IMAGE } from '@/http/admin/api.ts'
  import request from '@/http/request.ts'
  import { useNotification } from '@/utils/notification'

  // Props
  interface Props {
    modelValue: boolean
    itemTitle: string
    itemId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    itemId: '',
  })

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'upload-success'): void
  }

  const emit = defineEmits<Emits>()

  // 响应式数据
  const uploadFiles = ref<File[]>([])
  const uploading = ref(false)
  const uploadProgress = reactive({
    current: 0,
    total: 0,
  })

  // 每个文件的上传进度和状态
  const fileProgress = ref<(number | undefined)[]>([])
  const fileErrors = ref<boolean[]>([])

  const { showSuccess, showWarning } = useNotification()

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const canUpload = computed(() => {
    // 基础条件检查
    if (uploadFiles.value.length === 0 || !props.itemId) return false

    // 如果正在上传中，禁用按钮
    if (uploading.value) return false

    // 简化逻辑：只有所有文件都未开始上传时才允许点击
    return fileProgress.value.every(progress => progress === undefined)
  })

  // 文件校验规则
  const fileValidationRules = [
    (files: File[] | null) => {
      if (!files || files.length === 0) return true

      // 检查每个文件
      for (const file of files) {
        // 检查文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          return '只支持 JPG、PNG、GIF、WebP 格式的图片文件'
        }

        // 检查文件大小 (2MB)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
          return '文件大小不能超过 2MB'
        }
      }

      return true
    },
  ]

  // 获取文件预览URL
  function getFilePreview (file: File): string {
    return URL.createObjectURL(file)
  }

  // 处理上传文件变化
  function handleUploadFilesChange (files: File | File[] | null) {
    if (!files) {
      uploadFiles.value = []
      fileProgress.value = []
      fileErrors.value = []
      return
    }

    // 直接使用传入的文件，因为v-file-input已经通过rules进行了校验
    uploadFiles.value = Array.isArray(files) ? files : [files]

    // 初始化进度和错误状态数组
    fileProgress.value = Array.from({ length: uploadFiles.value.length }, () => undefined)
    fileErrors.value = Array.from({ length: uploadFiles.value.length }, () => false)
  }

  // 重试上传单个文件
  async function retryUpload (index: number) {
    if (!props.itemId || !uploadFiles.value[index]) return

    const file = uploadFiles.value[index]

    // 重置该文件的状态
    fileErrors.value[index] = false
    fileProgress.value[index] = 0

    try {
      const formData = new FormData()
      formData.append('imageFile', file)
      formData.append('featuredId', props.itemId)

      await request.post(UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            fileProgress.value[index] = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        },
      })

      fileProgress.value[index] = 100
      showSuccess(`文件 ${file.name} 重新上传成功`)
    } catch (error) {
      console.error(`文件 ${file.name} 重试上传失败:`, error)
      fileErrors.value[index] = true
      fileProgress.value[index] = 0
      showWarning(`文件 ${file.name} 重新上传失败`)
    }
  }

  // 格式化文件大小
  function formatFileSize (bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
    uploadFiles.value = []
    uploading.value = false
    uploadProgress.current = 0
    uploadProgress.total = 0
    fileProgress.value = []
    fileErrors.value = []
  }

  // 上传图片
  async function handleUpload () {
    if (uploadFiles.value.length === 0 || !props.itemId) return

    uploading.value = true
    uploadProgress.total = uploadFiles.value.length
    uploadProgress.current = 0

    // 重置所有文件的进度和错误状态
    fileProgress.value = Array.from({ length: uploadFiles.value.length }, () => 0)
    fileErrors.value = Array.from({ length: uploadFiles.value.length }, () => false)

    try {
      // 并发上传所有图片，每个文件独立处理进度
      const uploadPromises = uploadFiles.value.map(async (file, index) => {
        const formData = new FormData()
        formData.append('imageFile', file)
        formData.append('featuredId', props.itemId)

        try {
          // 使用 Axios 直接上传，监听进度
          await request.post(UPLOAD_IMAGE, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent: any) => {
              if (progressEvent.total) {
                fileProgress.value[index] = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              }
            },
          })

          // 上传完成，设置进度为100%
          fileProgress.value[index] = 100
          uploadProgress.current++
        } catch (error) {
          console.error(`文件 ${file.name} 上传失败:`, error)
          fileErrors.value[index] = true
          fileProgress.value[index] = 0
          throw error
        }
      })

      await Promise.all(uploadPromises)

      showSuccess(`成功上传 ${uploadFiles.value.length} 张图片`)
      // closeDialog()

      // 触发上传成功事件
      emit('upload-success')
    } catch (error) {
      console.error('上传失败:', error)
      const errorMessage = error instanceof Error ? error.message : '上传失败，请重试'
      showWarning(errorMessage)
    } finally {
      uploading.value = false
    }
  }

  // 监听对话框关闭，重置状态
  watch(dialog, newValue => {
    if (!newValue) {
      uploadFiles.value = []
      uploading.value = false
      uploadProgress.current = 0
      uploadProgress.total = 0
      fileProgress.value = []
      fileErrors.value = []
    }
  })
</script>

<style scoped>
</style>
