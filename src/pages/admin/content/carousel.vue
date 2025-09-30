<template>
  <AdminLayout>
    <!-- 页面标题和操作 -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">轮播图管理</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          管理首页轮播图片和链接
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openDialog('add')"
      >
        添加轮播图
      </v-btn>
    </div>

    <!-- 统计卡片 -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" sm="6">
        <v-card class="text-center pa-4">
          <v-icon class="mb-2" color="primary" size="48">mdi-view-carousel</v-icon>
          <div class="text-h4 font-weight-bold">{{ pagination.totalItems }}</div>
          <div class="text-subtitle-2 text-medium-emphasis">总轮播图</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-card class="text-center pa-4">
          <v-icon class="mb-2" color="success" size="48">mdi-check-circle</v-icon>
          <div class="text-h4 font-weight-bold">{{ activeCount }}</div>
          <div class="text-subtitle-2 text-medium-emphasis">启用中</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-card class="text-center pa-4">
          <v-icon class="mb-2" color="warning" size="48">mdi-pause-circle</v-icon>
          <div class="text-h4 font-weight-bold">{{ inactiveCount }}</div>
          <div class="text-subtitle-2 text-medium-emphasis">已禁用</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-card class="text-center pa-4">
          <v-icon class="mb-2" color="info" size="48">mdi-eye</v-icon>
          <div class="text-h4 font-weight-bold">{{ totalViews }}</div>
          <div class="text-subtitle-2 text-medium-emphasis">总点击量</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 轮播图列表 -->
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-view-carousel</v-icon>
          轮播图列表
        </div>

        <!-- 搜索和筛选 -->
        <div class="d-flex align-center ga-2">
          <v-text-field
            v-model="search"
            density="compact"
            hide-details
            placeholder="搜索轮播图..."
            prepend-inner-icon="mdi-magnify"
            style="width: 300px;"
            variant="outlined"
          />
          <v-select
            v-model="statusFilter"
            density="compact"
            hide-details
            :items="statusOptions"
            style="width: 120px;"
            variant="outlined"
          />
        </div>
      </v-card-title>

      <v-card-text>
        <!-- 数据表格 -->
        <v-data-table
          class="elevation-0"
          :headers="headers"
          hide-default-footer
          :items="filteredCarouselList"
          :items-per-page="-1"
          :loading="loading"
          :search="search"
        >
          <!-- 轮播图预览 -->
          <template #item.image="{ item }">
            <div class="my-2 rounded-lg overflow-hidden" style="width: 160px; height: 90px;">
              <v-img :alt="item.title" cover :src="item.images?.largeImage" />
            </div>
          </template>

          <!-- 状态 -->
          <template #item.status="{ item }">
            <v-chip
              :color="item.status ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ item.status ? '启用' : '禁用' }}
            </v-chip>
          </template>

          <!-- 排序 -->
          <template #item.sort="{ item }">
            <div class="d-flex align-center ga-1">
              <v-btn
                :disabled="item.sort === 1"
                icon="mdi-arrow-up"
                size="small"
                variant="text"
                @click="changeSort(item, 'up')"
              />
              <span class="text-body-2 font-weight-bold">{{ item.sort }}</span>
              <v-btn
                :disabled="item.sort === carouselList.length"
                icon="mdi-arrow-down"
                size="small"
                variant="text"
                @click="changeSort(item, 'down')"
              />
            </div>
          </template>

          <!-- 操作 -->
          <template #item.actions="{ item }">
            <div class="d-flex ga-1">
              <v-btn
                color="info"
                icon="mdi-eye"
                size="small"
                variant="text"
                @click="previewCarousel(item)"
              />
              <v-btn
                color="primary"
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="openDialog('edit', item)"
              />
              <v-btn
                :color="item.status ? 'warning' : 'success'"
                :icon="item.status ? 'mdi-pause' : 'mdi-play'"
                size="small"
                variant="text"
                @click="toggleStatus(item)"
              />
              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="confirmDelete(item)"
              />
            </div>
          </template>
        </v-data-table>

        <!-- 分页控件 -->
        <div class="d-flex align-center justify-space-between mt-4 px-4">
          <div class="text-body-2 text-medium-emphasis">
            共 {{ pagination.totalItems }} 条记录，第 {{ pagination.page }}/{{ pagination.totalPages }} 页
          </div>

          <v-pagination
            v-model="pagination.page"
            density="compact"
            :length="pagination.totalPages"
            :total-visible="5"
            @update:model-value="handlePageChange"
          />

          <div class="d-flex align-center">
            <span class="mr-2">每页</span>
            <v-select
              v-model="pagination.pageSize"
              class="pagination-select"
              density="compact"
              hide-details
              :items="[10, 20, 50, 100]"
              style="width: 100px;"
              variant="outlined"
              @update:model-value="handlePageSizeChange"
            />
            <span class="ml-2">条</span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- 添加/编辑对话框 -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">
            {{ dialogMode === 'add' ? 'mdi-plus' : 'mdi-pencil' }}
          </v-icon>
          {{ dialogMode === 'add' ? '添加轮播图' : '编辑轮播图' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <!-- 基本信息 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.title"
                  label="轮播图标题"
                  prepend-inner-icon="mdi-format-title"
                  :rules="[v => !!v || '请输入标题']"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.subtitle"
                  label="副标题（可选）"
                  prepend-inner-icon="mdi-format-text"
                  variant="outlined"
                />
              </v-col>

              <!-- 图片上传 -->
              <v-col cols="12">
                <v-file-input
                  v-model="editForm.imageFile"
                  accept="image/*"
                  label="轮播图片"
                  prepend-inner-icon="mdi-image"
                  :rules="dialogMode === 'add' ? [v => !!v || '请选择图片'] : []"
                  show-size
                  @change="handleImageUpload"
                />

                <!-- 图片预览 -->
                <div v-if="editForm.imageFile" class="mt-4">
                  <v-img
                    :alt="editForm.title"
                    class="rounded-lg"
                    cover
                    height="300"
                    :src="editForm.images?.largeImage"
                  />
                </div>
              </v-col>

              <!-- 链接和按钮 -->
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="editForm.link"
                  label="跳转链接（可选）"
                  prepend-inner-icon="mdi-link"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editForm.buttonText"
                  label="按钮文字"
                  prepend-inner-icon="mdi-button-cursor"
                />
              </v-col>

              <!-- 描述 -->
              <v-col cols="12">
                <v-textarea
                  v-model="editForm.description"
                  label="描述"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  :rules="[v => !!v || '请输入描述信息']"
                />
              </v-col>

              <!-- 设置 -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editForm.sort"
                  label="排序"
                  prepend-inner-icon="mdi-sort"
                  :rules="[v => v > 0 || '排序必须大于0']"
                  type="number"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="editForm.target"
                  :items="[
                    { title: '当前窗口', value: '_self' },
                    { title: '新窗口', value: '_blank' }
                  ]"
                  label="打开方式"
                  prepend-inner-icon="mdi-open-in-new"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="editForm.status"
                  color="success"
                  hide-details
                  inset
                  :label="editForm.status ? '启用' : '禁用'"
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
            @click="saveCarousel"
          >
            {{ dialogMode === 'add' ? '添加' : '保存' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 预览对话框 -->
    <v-dialog v-model="previewDialog" max-width="900px">
      <v-card>
        <v-card-title>轮播图预览</v-card-title>
        <v-card-text>
          <div v-if="previewItem" class="position-relative">
            <v-img
              :alt="previewItem.title"
              class="rounded-lg"
              cover
              height="400"
              :src="previewItem.images?.largeImage"
            >
              <!-- 轮播图内容覆盖层 -->
              <div class="carousel-overlay">
                <div class="text-white">
                  <h2 class="text-h4 font-weight-bold mb-2">{{ previewItem.title }}</h2>
                  <p v-if="previewItem.subtitle" class="text-h6 mb-4">{{ previewItem.subtitle }}</p>
                  <p v-if="previewItem.description" class="mb-4">{{ previewItem.description }}</p>
                  <v-btn
                    v-if="previewItem.buttonText"
                    color="primary"
                    size="large"
                  >
                    {{ previewItem.buttonText }}
                  </v-btn>
                </div>
              </div>
            </v-img>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="previewDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
          确认删除
        </v-card-title>
        <v-card-text>
          <p>确定要删除轮播图 "{{ itemToDelete?.title }}" 吗？</p>
          <p class="text-medium-emphasis">此操作无法撤销。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="deleteCarousel"
          >
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script lang="ts" setup>
  import {
    addCarousel, deleteCarouselById,
    getCarousel,
    updateCarousel, updateCarouselSort,
    updateCarouselStatus,
  } from '@/http/admin/carousel.ts'
  import { useNotification } from '@/utils/notification'

  // 定义轮播图项目的接口
  interface CarouselItem {
    id: number
    title: string
    subtitle: string
    description: string
    images: {
      largeImage: string
      smallImage: string
    }
    imageFile?: File | null
    link: string
    buttonText: string
    sort: number
    status: boolean
    target: string
    views: number
    createdAt: string
  }

  // 使用通知
  const { showSuccess, showError } = useNotification()

  // 响应式数据
  const dialog = ref(false)
  const previewDialog = ref(false)
  const deleteDialog = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref<'all' | boolean>('all')
  const dialogMode = ref<'add' | 'edit'>('add')
  const previewItem = ref<CarouselItem | null>(null)
  const form = ref()
  const itemToDelete = ref<CarouselItem | null>(null)

  // 分页相关数据
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  })

  // 表格头部配置
  const headers = [
    { title: '预览', key: 'image', sortable: false, width: 100 },
    { title: '标题', key: 'title', sortable: true },
    { title: '副标题', key: 'subtitle', sortable: false },
    { title: '状态', key: 'status', sortable: true, width: 100 },
    { title: '排序', key: 'sort', sortable: true, width: 120 },
    { title: '点击量', key: 'views', sortable: true, width: 100 },
    { title: '操作', key: 'actions', sortable: false, width: 200 },
  ]

  // 状态筛选选项
  const statusOptions = [
    { title: '全部', value: 'all' },
    { title: '启用', value: true },
    { title: '禁用', value: false },
  ]

  // 编辑表单数据
  const editForm = reactive<CarouselItem>({
    id: 0,
    title: '',
    subtitle: '',
    description: '',
    images: {
      largeImage: '',
      smallImage: '',
    },
    imageFile: null,
    link: '',
    buttonText: '了解更多',
    sort: 1,
    status: true,
    target: '_self',
    views: 0,
    createdAt: '',
  })

  // 轮播图数据
  const carouselList = ref<CarouselItem[]>([])

  // 获取轮播图数据
  async function fetchCarouselList () {
    loading.value = true
    try {
      const response = await getCarousel(pagination.page, pagination.pageSize)
      const carouselData = response.data.list || []
      // 更新分页信息
      pagination.totalItems = response.data.total || 0
      pagination.totalPages = response.data.pages || 1

      carouselList.value = carouselData.map((item: {
        id: number
        title: string
        subtitle: string
        description: string
        images: {
          largeImage: string
          smallImage: string
        }
        link: string
        buttonText: string
        sort: number
        status: boolean
        target: string
      }) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        images: item.images,
        link: item.link,
        buttonText: item.buttonText,
        sort: item.sort,
        status: item.status,
        target: item.target,
        views: 0,
        createdAt: '',
      }))
    } catch (error) {
      console.error('获取轮播图数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 页码变化处理
  function handlePageChange (newPage: number) {
    pagination.page = newPage
    fetchCarouselList()
  }

  // 每页条数变化处理
  function handlePageSizeChange (newSize: number) {
    pagination.pageSize = newSize
    pagination.page = 1 // 重置为第一页
    fetchCarouselList()
  }

  // 计算属性
  const activeCount = computed(() =>
    carouselList.value.filter(item => item.status).length,
  )

  const inactiveCount = computed(() =>
    carouselList.value.filter(item => !item.status).length,
  )

  const totalViews = computed(() =>
    carouselList.value.reduce((sum, item) => sum + item.views, 0),
  )

  const filteredCarouselList = computed(() => {
    let filtered = carouselList.value

    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter.value)
    }

    return filtered
  })

  // 打开对话框
  function openDialog (mode: 'add' | 'edit', item?: CarouselItem) {
    dialogMode.value = mode

    if (mode === 'edit' && item) {
      Object.assign(editForm, { ...item, imageFile: null })
    } else {
      // 重置表单
      Object.assign(editForm, {
        id: 0,
        title: '',
        subtitle: '',
        description: '',
        images: {
          largeImage: '',
          smallImage: '',
        },
        imageFile: null,
        link: '',
        buttonText: '了解更多',
        sort: carouselList.value.length + 1,
        status: true,
        target: '_self',
        views: 0,
        createdAt: '',
      })
    }

    dialog.value = true
  }

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
    form.value?.reset()
  }

  // 处理图片上传
  function handleImageUpload (event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        editForm.images.largeImage = e.target?.result as string
      })
      reader.readAsDataURL(file)
    }
  }

  // 保存轮播图
  async function saveCarousel () {
    if (!valid.value) return

    saving.value = true

    try {
      const formData = new FormData()

      // 添加表单数据
      formData.append('title', editForm.title)
      formData.append('subtitle', editForm.subtitle)
      formData.append('description', editForm.description)
      formData.append('link', editForm.link)
      formData.append('buttonText', editForm.buttonText)
      formData.append('sort', editForm.sort.toString())
      formData.append('status', editForm.status.toString())
      formData.append('target', editForm.target)

      // 添加图片文件
      if (editForm.imageFile) {
        formData.append('imageFile', editForm.imageFile)
      }

      if (dialogMode.value === 'add') {
        await addCarousel(formData)
        // 添加成功后刷新列表
        await fetchCarouselList()
        closeDialog()
        showSuccess('轮播图添加成功')
      } else {
        // 编辑模式
        if (editForm.id) {
          formData.append('id', editForm.id.toString())
          await updateCarousel(formData)
          // 编辑成功后刷新列表
          await fetchCarouselList()
          closeDialog()
          showSuccess('轮播图更新成功')
        }
      }
    } catch (error) {
      console.error('保存失败:', error)
      showError('保存失败')
    } finally {
      saving.value = false
    }
  }

  // 切换状态
  async function toggleStatus (item: CarouselItem) {
    try {
      item.status = !item.status
      await updateCarouselStatus(item.id, item.status)
      showSuccess(`轮播图已${item.status ? '启用' : '禁用'}`)
    } catch (error) {
      console.error('状态更新失败:', error)
      showError('状态更新失败')
    }
  }

  // 确认删除
  function confirmDelete (item: CarouselItem) {
    itemToDelete.value = item
    deleteDialog.value = true
  }

  // 删除轮播图
  async function deleteCarousel () {
    if (!itemToDelete.value) return

    deleting.value = true
    try {
      await deleteCarouselById(itemToDelete.value.id)

      // 删除表单中的数据
      carouselList.value = carouselList.value.filter(i => i.id !== itemToDelete.value!.id)
      deleteDialog.value = false
      showSuccess('轮播图删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      showError('删除失败')
    } finally {
      deleting.value = false
    }
  }

  // 调整排序
  async function changeSort (item: CarouselItem, direction: 'up' | 'down') {
    const currentIndex = carouselList.value.findIndex(i => i.id === item.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex >= 0 && targetIndex < carouselList.value.length) {
      // 交换位置
      const temp = carouselList.value[currentIndex]
      carouselList.value[currentIndex] = carouselList.value[targetIndex]
      carouselList.value[targetIndex] = temp

      // 更新排序值
      for (const [index, item] of carouselList.value.entries()) {
        item.sort = index + 1
      }

      // 只更新当前轮播图的排序
      try {
        await updateCarouselSort(item.id, item.sort)
        showSuccess('排序更新成功')
      } catch (error) {
        console.error('排序更新失败:', error)
        showError('排序更新失败')
      }
    }
  }

  // 预览轮播图
  function previewCarousel (item: CarouselItem) {
    previewItem.value = item
    previewDialog.value = true
  }

  onMounted(() => {
    fetchCarouselList()
  })
</script>

<style scoped>

</style>
