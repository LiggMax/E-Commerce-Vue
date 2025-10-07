<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-upload</v-icon>
        上传图片 - {{ itemTitle }}
      </v-card-title>

      <v-card-text>
        <!-- 多文件上传组件 -->
        <v-file-upload
          v-model="uploadFiles"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          clearable
          multiple
          show-size
          title="将图片文件拖放到此处，支持多张图片同时上传"
          variant="outlined"
          @update:model-value="handleUploadFilesChange"
        />

        <!-- 文件要求提示 -->
        <div class="text-caption text-medium-emphasis mt-2">
          <v-icon class="mr-1" size="small">mdi-information</v-icon>
          支持 JPG、PNG、GIF、WebP 格式，每张图片不超过 2MB，可同时上传多张图片
        </div>

        <!-- 上传文件列表 -->
        <div v-if="uploadFiles.length > 0" class="mt-4">
          <h4 class="text-subtitle-1 mb-3">待上传文件列表</h4>
          <v-list density="compact">
            <v-list-item
              v-for="(file, index) in uploadFiles"
              :key="index"
              class="px-0"
            >
              <template #prepend>
                <v-icon color="primary">mdi-image</v-icon>
              </template>
              <v-list-item-title>{{ file.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
              <template #append>
                <v-btn
                  color="error"
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click="removeUploadFile(index)"
                />
              </template>
            </v-list-item>
          </v-list>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploading" class="mt-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2">上传进度</span>
            <span class="text-caption">{{ uploadProgress.current }}/{{ uploadProgress.total }}</span>
          </div>
          <v-progress-linear
            color="primary"
            height="8"
            :model-value="(uploadProgress.current / uploadProgress.total) * 100"
            rounded
          />
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
          :disabled="uploadFiles.length === 0"
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

  const { showSuccess } = useNotification()

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  // 校验图片文件类型
  function validateImageType (file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    return allowedTypes.includes(file.type)
  }

  // 校验文件大小
  function validateFileSize (file: File): boolean {
    const maxSize = 2 * 1024 * 1024 // 2MB
    return file.size <= maxSize
  }

  // 文件上传校验
  function validateImageFile (file: File): boolean {
    if (!validateImageType(file)) {
      showSuccess('只支持 JPG、PNG、GIF、WebP 格式的图片文件')
      return false
    }

    if (!validateFileSize(file)) {
      showSuccess('文件大小不能超过 2MB')
      return false
    }

    return true
  }

  // 处理上传文件变化
  function handleUploadFilesChange (files: File[]) {
    // 过滤有效的图片文件
    const validFiles = files.filter(file => validateImageFile(file))
    uploadFiles.value = validFiles
  }

  // 移除上传文件
  function removeUploadFile (index: number) {
    uploadFiles.value.splice(index, 1)
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
  }

  // 上传图片
  async function handleUpload () {
    if (uploadFiles.value.length === 0) return

    uploading.value = true
    uploadProgress.total = uploadFiles.value.length
    uploadProgress.current = 0

    try {
      // 并发上传所有图片
      const uploadPromises = uploadFiles.value.map(async file => {
        const formData = new FormData()
        formData.append('imageFile', file)
        if (props.itemId) {
          formData.append('featuredId', props.itemId)
        }

        // 这里需要调用实际的上传API
        // await uploadFeaturedImage(formData)

        // 模拟上传延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        uploadProgress.current++
      })

      await Promise.all(uploadPromises)

      showSuccess(`成功上传 ${uploadFiles.value.length} 张图片`)
      closeDialog()

      // 触发上传成功事件
      emit('upload-success')
    } catch (error) {
      console.error('上传失败:', error)
      showSuccess('上传失败，请重试')
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
    }
  })
</script>

<style scoped>
</style>
