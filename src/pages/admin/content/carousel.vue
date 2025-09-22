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
          <div class="text-h4 font-weight-bold">{{ carouselList.length }}</div>
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
          :items="filteredCarouselList"
          :loading="loading"
          :search="search"
        >
          <!-- 轮播图预览 -->
          <template #item.image="{ item }">
            <v-avatar class="my-2" rounded="lg" size="80">
              <v-img :alt="item.title" cover :src="item.image" />
            </v-avatar>
          </template>

          <!-- 状态 -->
          <template #item.status="{ item }">
            <v-chip
              :color="item.status === 'active' ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ item.status === 'active' ? '启用' : '禁用' }}
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
                :color="item.status === 'active' ? 'warning' : 'success'"
                :icon="item.status === 'active' ? 'mdi-pause' : 'mdi-play'"
                size="small"
                variant="text"
                @click="toggleStatus(item)"
              />
              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="deleteCarousel(item)"
              />
            </div>
          </template>
        </v-data-table>
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
                  variant="outlined"
                  @change="handleImageUpload"
                />

                <!-- 图片预览 -->
                <div v-if="editForm.image" class="mt-4">
                  <v-img
                    :alt="editForm.title"
                    class="rounded-lg"
                    cover
                    height="200"
                    :src="editForm.image"
                  />
                </div>
              </v-col>

              <!-- 链接和按钮 -->
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="editForm.link"
                  label="跳转链接（可选）"
                  prepend-inner-icon="mdi-link"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editForm.buttonText"
                  label="按钮文字"
                  prepend-inner-icon="mdi-button-cursor"
                  variant="outlined"
                />
              </v-col>

              <!-- 描述 -->
              <v-col cols="12">
                <v-textarea
                  v-model="editForm.description"
                  label="描述"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  variant="outlined"
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
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="editForm.status"
                  :items="[
                    { title: '启用', value: 'active' },
                    { title: '禁用', value: 'inactive' }
                  ]"
                  label="状态"
                  prepend-inner-icon="mdi-toggle-switch"
                  variant="outlined"
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
              :src="previewItem.image"
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
  </AdminLayout>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'
  // 响应式数据
  const dialog = ref(false)
  const previewDialog = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const valid = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const dialogMode = ref<'add' | 'edit'>('add')
  const previewItem = ref<any>(null)
  const form = ref()

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
    { title: '启用', value: 'active' },
    { title: '禁用', value: 'inactive' },
  ]

  // 编辑表单数据
  const editForm = reactive({
    id: null,
    title: '',
    subtitle: '',
    description: '',
    image: '',
    imageFile: null,
    link: '',
    buttonText: '了解更多',
    sort: 1,
    status: 'active',
    target: '_self',
    views: 0,
  })

  // 模拟轮播图数据
  const carouselList = ref([
    {
      id: 1,
      title: '春季新品上市',
      subtitle: '全场8折优惠',
      description: '精选春季新品，品质保证，限时优惠',
      image: 'https://picsum.photos/800/400?random=1',
      link: '/products/spring',
      buttonText: '立即购买',
      sort: 1,
      status: 'active',
      target: '_self',
      views: 1234,
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: '夏日清仓大促',
      subtitle: '低至3折起',
      description: '夏季商品清仓，机会难得',
      image: 'https://picsum.photos/800/400?random=2',
      link: '/products/summer',
      buttonText: '查看详情',
      sort: 2,
      status: 'active',
      target: '_blank',
      views: 856,
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      title: '会员专享',
      subtitle: 'VIP特权',
      description: '会员专享优惠，更多特权等你来',
      image: 'https://picsum.photos/800/400?random=3',
      link: '/vip',
      buttonText: '成为会员',
      sort: 3,
      status: 'inactive',
      target: '_self',
      views: 423,
      createdAt: '2024-01-03',
    },
  ])

  // 计算属性
  const activeCount = computed(() =>
    carouselList.value.filter(item => item.status === 'active').length,
  )

  const inactiveCount = computed(() =>
    carouselList.value.filter(item => item.status === 'inactive').length,
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
  function openDialog (mode: 'add' | 'edit', item?: any) {
    dialogMode.value = mode

    if (mode === 'edit' && item) {
      Object.assign(editForm, { ...item, imageFile: null })
    } else {
      // 重置表单
      Object.assign(editForm, {
        id: null,
        title: '',
        subtitle: '',
        description: '',
        image: '',
        imageFile: null,
        link: '',
        buttonText: '了解更多',
        sort: carouselList.value.length + 1,
        status: 'active',
        target: '_self',
        views: 0,
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
        editForm.image = e.target?.result as string
      })
      reader.readAsDataURL(file)
    }
  }

  // 保存轮播图
  async function saveCarousel () {
    if (!valid.value) return

    saving.value = true

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (dialogMode.value === 'add') {
        const newItem = {
          ...editForm,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
        }
        carouselList.value.push(newItem)
      } else {
        const index = carouselList.value.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          carouselList.value[index] = { ...editForm }
        }
      }

      closeDialog()
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      saving.value = false
    }
  }

  // 切换状态
  function toggleStatus (item: any) {
    item.status = item.status === 'active' ? 'inactive' : 'active'
  }

  // 删除轮播图
  function deleteCarousel (item: any) {
    if (confirm('确定要删除这个轮播图吗？')) {
      const index = carouselList.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        carouselList.value.splice(index, 1)
      }
    }
  }

  // 调整排序
  function changeSort (item: any, direction: 'up' | 'down') {
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
    }
  }

  // 预览轮播图
  function previewCarousel (item: any) {
    previewItem.value = item
    previewDialog.value = true
  }
</script>

<style scoped>
</style>
