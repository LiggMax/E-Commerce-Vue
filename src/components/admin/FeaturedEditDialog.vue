<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">
          {{ mode === 'add' ? 'mdi-plus' : 'mdi-pencil' }}
        </v-icon>
        {{ mode === 'add' ? '添加商品' : '编辑商品' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <!-- 商品名称 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="标题"
                prepend-inner-icon="mdi-tag"
                :rules="[v => !!v || '请输入商品名称']"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="商品描述"
                prepend-inner-icon="mdi-text"
                rows="3"
                :rules="[v => !!v || '请输入描述信息',
                         v => (v && v.length <= 200 || '商品描述不能超过200个字符')]"
                variant="outlined"
              />
            </v-col>

            <!-- 图片上传 -->
            <v-col cols="12">
              <span class="text-caption text-medium-emphasis">封面上传</span>
              <v-file-upload
                v-model="formData.imageFile"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                clearable
                density="compact"
                show-size
                title="将图片文件拖放到此处"
                variant="compact"
              />
              <!-- 文件要求提示 -->
              <div class="text-caption text-medium-emphasis mt-1">
                <v-icon :class="[imageFileError != ''? 'text-error mr-1' : 'mr-1']" size="small">
                  mdi-information
                </v-icon>
                <span :class="[imageFileError != ''? 'text-error text-caption mt-1 ' : '']">
                  {{ imageFileError != ''? imageFileError : '支持 JPG、PNG、GIF、WebP 格式，文件大小不超过 2MB' }}
                </span>
              </div>
            </v-col>

            <!-- 价格信息 -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.originalPrice"
                label="原价"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[v => v > 0 || '原价必须大于0']"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.currentPrice"
                label="现价"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[
                  v => v > 0 || '现价必须大于0',
                  v => v <= formData.originalPrice || '现价不能高于原价'
                ]"
                type="number"
                variant="outlined"
              />
            </v-col>

            <!-- 评分和评论数 -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.rating"
                label="商品评分"
                max="5"
                min="0"
                prepend-inner-icon="mdi-star"
                :rules="[
                  v => v >= 0 && v <= 10 || '评分范围为0-10'
                ]"
                step="0.1"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.reviews"
                label="评论数"
                min="0"
                prepend-inner-icon="mdi-comment"
                :rules="[v => v >= 0 || '评论数不能为负']"
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
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
          :disabled="!valid"
          :loading="saving"
          @click="handleSave"
        >
          {{ mode === 'add' ? '添加' : '保存' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { addFeatured, updateFeatured } from '@/http/admin/featured.ts'

  // 定义精选商品项目的接口
  interface FeaturedItem {
    id: string
    title: string
    description: string
    images: {
      largeImage: string
      smallImage: string
    }
    imageFile?: File | undefined
    originalPrice: number
    currentPrice: number
    reviews: number
    rating: number
    createdAt: string
  }

  // Props
  interface Props {
    modelValue: boolean
    mode: 'add' | 'edit'
    item?: FeaturedItem
  }

  const props = withDefaults(defineProps<Props>(), {
    item: undefined,
  })

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save-success'): void
  }

  const emit = defineEmits<Emits>()

  // 响应式数据
  const form = ref()
  const valid = ref(false)
  const saving = ref(false)
  const imageFileError = ref('')

  // 表单数据
  const formData = reactive<FeaturedItem>({
    id: '',
    title: '',
    description: '',
    images: {
      largeImage: '',
      smallImage: '',
    },
    imageFile: undefined,
    originalPrice: 0,
    currentPrice: 0,
    reviews: 0,
    rating: 0,
    createdAt: '',
  })

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
    const maxSize = 2 * 1024 * 1024
    return file.size <= maxSize
  }

  // 文件上传校验
  function validateImageFile (file: File): boolean {
    imageFileError.value = ''

    if (!validateImageType(file)) {
      imageFileError.value = '只支持 JPG、PNG、GIF、WebP 格式的图片文件'
      return false
    }

    if (!validateFileSize(file)) {
      imageFileError.value = '文件大小不能超过 2MB'
      return false
    }

    return true
  }

  // 重置表单
  function resetForm () {
    Object.assign(formData, {
      id: '',
      title: '',
      description: '',
      images: {
        largeImage: '',
        smallImage: '',
      },
      imageFile: undefined,
      originalPrice: 0,
      currentPrice: 0,
      reviews: 0,
      rating: 0,
      createdAt: '',
    })
    imageFileError.value = ''
  }

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
    form.value?.reset()
    resetForm()
  }

  // 保存数据
  async function handleSave () {
    if (!valid.value) return

    // 校验文件
    if (formData.imageFile && !validateImageFile(formData.imageFile)) {
      return
    }

    saving.value = true

    try {
      const data = new FormData()

      // 添加表单数据
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('originalPrice', formData.originalPrice.toString())
      data.append('currentPrice', formData.currentPrice.toString())
      data.append('reviews', formData.reviews.toString())
      data.append('rating', formData.rating.toString())

      // 添加图片文件
      if (formData.imageFile) {
        data.append('imageFile', formData.imageFile)
      }

      if (props.mode === 'add') {
        if (!formData.imageFile) {
          imageFileError.value = '请选择有效的图片文件'
          return
        }
        await addFeatured(data)
      } else {
        // 编辑模式
        if (formData.id) {
          data.append('id', formData.id)
          await updateFeatured(data)
        }
      }

      closeDialog()
      emit('save-success')
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      saving.value = false
    }
  }

  // 监听对话框打开，初始化表单数据
  watch(dialog, newValue => {
    if (newValue) {
      if (props.mode === 'edit' && props.item) {
        Object.assign(formData, { ...props.item, imageFile: undefined })
      } else {
        resetForm()
      }
    }
  })
</script>

<style scoped>
</style>
