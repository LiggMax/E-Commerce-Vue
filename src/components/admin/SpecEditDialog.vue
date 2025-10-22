<template>
  <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-clipboard-list</v-icon>
        编辑{{ productTitle }}商品规格
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- 规格管理区域 -->
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6">商品规格列表</h3>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="small"
            variant="tonal"
            @click="addSpec"
          >
            添加规格
          </v-btn>
        </div>

        <!-- 规格列表 -->
        <v-expansion-panels
          v-if="specs.length > 0"
          class="mb-4"
          variant="accordion"
        >
          <v-expansion-panel
            v-for="(spec, specIndex) in specs"
            :key="specIndex"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-label</v-icon>
                  <span class="font-weight-bold">
                    {{ spec.name || '未命名规格' }}
                  </span>
                  <v-chip
                    class="ml-3"
                    color="primary"
                    size="x-small"
                    variant="tonal"
                  >
                    {{ spec.specValues.length }} 个规格值
                  </v-chip>
                </div>
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  size="x-small"
                  variant="text"
                  @click.stop="removeSpec(specIndex)"
                />
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <!-- 规格基本信息 -->
              <v-row class="mb-4">
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="spec.name"
                    density="compact"
                    hide-details
                    label="规格名称 *"
                    placeholder="如：颜色、尺寸、型号"
                    prepend-inner-icon="mdi-tag"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="spec.sort"
                    density="compact"
                    hide-details
                    label="排序"
                    prepend-inner-icon="mdi-sort"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <!-- 规格值列表 -->
              <div class="mb-3">
                <div class="d-flex align-center justify-space-between mb-3">
                  <span class="text-subtitle-2 font-weight-bold">规格值列表</span>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    size="x-small"
                    variant="text"
                    @click="addSpecValue(specIndex)"
                  >
                    添加规格值
                  </v-btn>
                </div>

                <!-- 规格值卡片 -->
                <v-card
                  v-for="(specValue, valueIndex) in spec.specValues"
                  :key="valueIndex"
                  class="mb-2"
                  variant="outlined"
                >
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="5">
                        <v-text-field
                          v-model="specValue.value"
                          density="compact"
                          hide-details
                          label="规格值 *"
                          placeholder="如：红色、13寸"
                          prepend-inner-icon="mdi-checkbox-blank-circle"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="specValue.price"
                          density="compact"
                          hide-details
                          label="加价金额"
                          min="0"
                          prefix="¥"
                          step="0.01"
                          type="number"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="specValue.sort"
                          density="compact"
                          hide-details
                          label="排序"
                          type="number"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col class="d-flex align-center" cols="12" md="1">
                        <v-btn
                          color="error"
                          icon="mdi-close"
                          size="small"
                          variant="text"
                          @click="removeSpecValue(specIndex, valueIndex)"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- 空状态提示 -->
                <v-alert
                  v-if="spec.specValues.length === 0"
                  density="compact"
                  icon="mdi-information"
                  text="请添加至少一个规格值"
                  type="warning"
                  variant="tonal"
                />
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 空状态提示 -->
        <v-alert
          v-else
          class="mb-4"
          density="comfortable"
          icon="mdi-information"
          type="info"
          variant="tonal"
        >
          <div>
            <div class="font-weight-bold mb-1">暂无规格</div>
            <div class="text-caption">点击上方"添加规格"按钮创建商品规格</div>
          </div>
        </v-alert>

        <!-- 使用说明 -->
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="info">mdi-help-circle</v-icon>
              使用说明
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-numeric-1-circle">
                  <v-list-item-title>规格名称：如颜色、尺寸、型号等商品属性</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-numeric-2-circle">
                  <v-list-item-title>规格值：具体的属性值，如红色、13寸、Pro版</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-numeric-3-circle">
                  <v-list-item-title>加价金额：选择该规格值需要额外增加的价格</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-numeric-4-circle">
                  <v-list-item-title>排序：数值越小越靠前显示</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!isValid"
          :loading="saving"
          @click="handleSave"
        >
          保存规格
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
// 定义规格值接口
  import { addSpecification } from '@/http/admin/spec.ts'
  import notification from '@/utils/notification.ts'

  interface SpecValue {
    id?: number
    value: string
    price: number
    sort: number
    createTime?: string
    updateTime?: string
  }

  // 定义规格接口
  interface Spec {
    id?: number
    name: string
    sort: number
    createTime?: string
    updateTime?: string
    specValues: SpecValue[]
  }

  // Props
  interface Props {
    modelValue: boolean
    productId: string
    productTitle: string
    initialSpecs?: Spec[]
  }

  const props = withDefaults(defineProps<Props>(), {
    initialSpecs: () => [],
  })

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save-success', specs: Spec[]): void
  }

  const emit = defineEmits<Emits>()

  // 响应式数据
  const saving = ref(false)
  const specs = ref<Spec[]>([])

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  // 验证是否有效
  const isValid = computed(() => {
    if (specs.value.length === 0) return true // 允许没有规格

    // 检查每个规格
    for (const spec of specs.value) {
      if (!spec.name.trim()) return false
      if (spec.specValues.length === 0) return false

      // 检查每个规格值
      for (const specValue of spec.specValues) {
        if (!specValue.value.trim()) return false
      }
    }

    return true
  })

  // 添加规格
  function addSpec () {
    specs.value.push({
      name: '',
      sort: 50,
      specValues: [],
    })
  }

  // 移除规格
  function removeSpec (specIndex: number) {
    if (confirm('确定要删除这个规格吗？')) {
      specs.value.splice(specIndex, 1)
    }
  }

  // 添加规格值
  function addSpecValue (specIndex: number) {
    specs.value[specIndex].specValues.push({
      value: '',
      price: 0,
      sort: 50,
    })
  }

  // 移除规格值
  function removeSpecValue (specIndex: number, valueIndex: number) {
    specs.value[specIndex].specValues.splice(valueIndex, 1)
  }

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
  }

  // 保存数据
  async function handleSave () {
    if (!isValid.value) {
      alert('请填写完整的规格信息')
      return
    }

    // 验证规格数据
    for (const spec of specs.value) {
      if (!spec.name.trim()) {
        alert('规格名称不能为空')
        return
      }
      if (spec.specValues.length === 0) {
        alert(`规格"${spec.name}"至少需要一个规格值`)
        return
      }
      for (const specValue of spec.specValues) {
        if (!specValue.value.trim()) {
          alert(`规格"${spec.name}"的规格值不能为空`)
          return
        }
      }
    }

    saving.value = true

    try {
      // 构建数据
      const specsData = {
        productId: props.productId,
        specs: structuredClone(specs.value).map((specs: any) => ({
          name: specs.name,
          sort: specs.sort,
          specValues: specs.specValues.map((value: any) => ({
            value: value.value,
            sort: value.sort,
            price: value.price,
          })),
        })),
      }
      await addSpecification(specsData)
      notification.showSuccess('保存规格成功')
      closeDialog()
    } catch (error) {
      console.error('保存规格失败:', error)
      alert('保存规格失败，请重试')
    } finally {
      saving.value = false
    }
  }

  // 监听对话框打开，初始化规格数据
  watch(dialog, newValue => {
    if (newValue) {
      // 深拷贝初始规格数据
      specs.value = structuredClone(props.initialSpecs || [])
    }
  })
</script>

<style scoped>
</style>
