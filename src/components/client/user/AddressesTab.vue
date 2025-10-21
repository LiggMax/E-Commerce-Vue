<template>
  <div class="addresses-tab">
    <!-- 地址管理头部 -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h3 class="text-h5 font-weight-bold">收货地址</h3>
        <p class="text-body-2 text-medium-emphasis">
          共 {{ addresses.length }} 个地址
        </p>
      </div>

      <v-btn
        color="primary"
        variant="flat"
        @click="openAddressDialog()"
      >
        <v-icon icon="mdi-plus" start />
        新增地址
      </v-btn>
    </div>

    <!-- 地址列表 -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular color="primary" indeterminate size="64" />
      <p class="text-body-2 text-medium-emphasis mt-4">加载地址中...</p>
    </div>

    <div v-else-if="addresses.length === 0" class="text-center py-12">
      <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-map-marker-outline" size="64" />
      <h3 class="text-h6 text-medium-emphasis">暂无收货地址</h3>
      <p class="text-body-2 text-medium-emphasis">添加您的第一个收货地址</p>
      <v-btn
        class="mt-4"
        color="primary"
        variant="outlined"
        @click="openAddressDialog()"
      >
        添加地址
      </v-btn>
    </div>

    <div v-else>
      <v-row>
        <v-col
          v-for="address in addresses"
          :key="address.id"
          cols="12"
          lg="4"
          md="6"
        >
          <v-card class="" elevation="1">
            <!-- 默认地址标识 -->
            <v-chip
              v-if="address.isDefault"
              class="position-absolute"
              color="primary"
              size="small"
              style="top: 12px; right: 12px; z-index: 2;"
            >
              默认地址
            </v-chip>

            <v-card-text class="pa-4">
              <div class="d-flex align-start mb-3">
                <v-icon class="mr-3 mt-1" icon="mdi-account" />
                <div>
                  <h4 class="text-subtitle-1 font-weight-medium">
                    {{ address.recipientName }}
                  </h4>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ address.phone }}
                  </p>
                </div>
              </div>

              <div class="d-flex align-start">
                <v-icon class="mr-3 mt-1" icon="mdi-map-marker" />
                <div class="flex-grow-1">
                  <p class="text-body-1 mb-2">
                    {{ address.province }} {{ address.city }} {{ address.district }}
                  </p>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ address.detailAddress }}
                  </p>
                  <v-chip
                    v-if="address.postalCode"
                    class="mt-2"
                    size="small"
                    variant="outlined"
                  >
                    邮编：{{ address.postalCode }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-4">
              <v-btn
                v-if="!address.isDefault"
                color="primary"
                size="small"
                variant="text"
                @click=""
              >
                设为默认
              </v-btn>

              <v-spacer />

              <v-btn
                color="primary"
                size="small"
                variant="text"
                @click="openAddressDialog(address)"
              >
                编辑
              </v-btn>

              <v-btn
                color="error"
                size="small"
                variant="text"
                @click="confirmDeleteAddress(address)"
              >
                删除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="450px" persistent>
      <v-card>
        <v-card-title>
          确认删除
        </v-card-title>
        <v-card-text>
          您确定要删除{
          {{ addressToDelete?.province }}
          {{ addressToDelete?.city }}
          {{ addressToDelete?.district }}
          }地址吗？此操作无法撤销。
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            variant="flat"
            @click="deleteAddress(addressToDelete!.id)"
          >
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 地址编辑对话框 -->
    <v-dialog v-model="addressDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          {{ editingAddress ? '编辑地址' : '新增地址' }}
        </v-card-title>

        <v-divider />

        <v-form ref="addressForm" v-model="valid" @submit.prevent="">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.recipientName"
                  label="收货人姓名"
                  required
                  :rules="recipientNameRules"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="手机号码"
                  required
                  :rules="phoneRules"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.province"
                  :items="provinces"
                  label="省份"
                  required
                  :rules="provinceRules"
                  variant="outlined"
                  @update:model-value="handleProvinceChange"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.city"
                  :items="cities"
                  label="城市"
                  required
                  :rules="cityRules"
                  variant="outlined"
                  @update:model-value="handleCityChange"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.district"
                  :items="districts"
                  label="区县"
                  required
                  :rules="districtRules"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.detailAddress"
                  label="详细地址"
                  required
                  rows="3"
                  :rules="detailAddressRules"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn
              variant="text"
              @click="closeAddressDialog"
            >
              取消
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              :loading="saving"
              type="submit"
              variant="flat"
              @click.prevent="saveAddress"
            >
              保存
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import area from '@/assets/area.json'
  import {
    addAddressService,
    deleteAddressService,
    getAddressService,
    setDefaultAddressService,
    updateAddressService,
  } from '@/http/client/user.ts'
  import { useNotification } from '@/utils/notification.ts'

  const { showSuccess, showError } = useNotification()

  // 响应式数据
  const loading = ref(false)
  const saving = ref(false)
  const addressDialog = ref(false)
  const deleteDialog = ref(false)
  const deleting = ref(false)
  const valid = ref(false)
  const addressForm = ref()
  const editingAddress = ref<any>(null)
  const addressToDelete = ref<Address | null>(null)

  // 地址数据
  interface Address {
    id: number
    recipientName: string
    phone: string
    province: string
    city: string
    district: string
    detailAddress: string
    postalCode?: string
    isDefault: boolean
  }

  const addresses = ref<Address[]>([])

  // 表单数据
  const formData = reactive({
    recipientName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    postalCode: '',
    isDefault: false,
  })

  // 地区数据
  const provinces = ref<string[]>(Object.values<any>(area).map((p: any) => p.n))
  const cities = ref<string[]>([])
  const districts = ref<string[]>([])

  // 表单验证规则
  const recipientNameRules = [
    (v: string) => !!v || '请输入收货人姓名',
    (v: string) => (v && v.length >= 2) || '收货人姓名至少2个字符',
  ]

  const phoneRules = [
    (v: string) => !!v || '请输入手机号码',
    (v: string) => /^1[3-9]\d{9}$/.test(v) || '请输入正确的手机号码',
  ]

  const provinceRules = [(v: string) => !!v || '请选择省份']
  const cityRules = [(v: string) => !!v || '请选择城市']
  const districtRules = [(v: string) => !!v || '请选择区县']

  const detailAddressRules = [
    (v: string) => !!v || '请输入详细地址',
    (v: string) => (v && v.length >= 5) || '详细地址至少5个字符',
  ]

  // 打开地址对话框
  function openAddressDialog (address?: Address) {
    editingAddress.value = address
    if (address) {
      // 编辑模式
      Object.assign(formData, {
        recipientName: address.recipientName,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detailAddress: address.detailAddress,
        postalCode: address.postalCode || '',
        isDefault: address.isDefault,
      })

      // 编辑模式下需要初始化城市和区县选项
      nextTick(() => {
        // 先加载城市选项
        const provinceEntry = Object.values<any>(area).find((p: any) => p.n === address.province)
        if (provinceEntry && provinceEntry.c) {
          cities.value = Object.values<any>(provinceEntry.c).map((c: any) => c.n)
        }

        // 再加载区县选项
        if (address.city) {
          const cityEntry = Object.values<any>(provinceEntry.c).find((c: any) => c.n === address.city)
          if (cityEntry && cityEntry.c) {
            districts.value = Object.values<any>(cityEntry.c).map((d: any) => d.n)
          }
        }
      })
    } else {
      // 新增模式
      resetForm()
    }
    addressDialog.value = true
  }

  // 关闭地址对话框
  function closeAddressDialog () {
    addressDialog.value = false
    editingAddress.value = null
    resetForm()
  }

  // 重置表单
  function resetForm () {
    Object.assign(formData, {
      recipientName: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
      postalCode: '',
      isDefault: false,
    })
    cities.value = []
    districts.value = []
  }

  // 处理省份变化
  function handleProvinceChange (province: string) {
    formData.city = ''
    formData.district = ''
    districts.value = []

    // 筛选城市
    const provinceEntry = Object.values<any>(area).find((p: any) => p.n === province)
    if (!provinceEntry || !provinceEntry.c) {
      cities.value = []
      return
    }
    cities.value = Object.values<any>(provinceEntry.c).map((c: any) => c.n)
  }

  // 处理城市变化
  function handleCityChange (city: string) {
    formData.district = ''

    // 筛选区县
    const provinceEntry = Object.values<any>(area).find((p: any) => p.n === formData.province)
    if (!provinceEntry || !provinceEntry.c) {
      districts.value = []
      return
    }
    const cityEntry = Object.values<any>(provinceEntry.c).find((c: any) => c.n === city)
    if (!cityEntry || !cityEntry.c) {
      districts.value = []
      return
    }
    districts.value = Object.values<any>(cityEntry.c).map((d: any) => d.n)
  }

  /**
   * 获取收货地址
   */
  async function fetchAddresses () {
    getAddressService().then(response => {
      addresses.value = response.data.map((item: any) => ({
        id: item.id,
        recipientName: item.receiverName,
        phone: item.receiverPhone,
        province: item.province,
        city: item.city,
        district: item.district,
        detailAddress: item.detailAddress,
        postalCode: item.postalCode,
        isDefault: item.isDefault,
      }))
    })
  }

  // 保存地址
  async function saveAddress () {
    if (!valid.value) return

    saving.value = true
    try {
      // 构建请求数据
      const requestData = {
        receiverName: formData.recipientName,
        receiverPhone: formData.phone,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        detailAddress: formData.detailAddress,
      }
      if (editingAddress.value) {
        const updateData = {
          id: editingAddress.value.id,
          ...requestData,
        }
        // 更新地址
        await updateAddressService(updateData)
        showSuccess('地址更新成功')
      } else {
        // 新增地址
        await addAddressService(requestData)
        showSuccess('地址添加成功')
        await fetchAddresses()
      }

      closeAddressDialog()
    } catch (error) {
      console.error('保存地址失败:', error)
    } finally {
      saving.value = false
    }
  }

  // 设为默认地址
  // TODO: 待完善
  async function setDefault (addressId: number) {
    try {
      await setDefaultAddressService(addressId)
      showSuccess('已设为默认地址')
      await fetchAddresses()
    } catch (error) {
      console.error('设置默认地址失败:', error)
      showError('设置默认地址失败')
    }
  }

  // 打开确认删除地址对话框
  function confirmDeleteAddress (address: Address) {
    addressToDelete.value = address
    deleteDialog.value = true
  }

  // 删除地址
  async function deleteAddress (addressId: number) {
    try {
      await deleteAddressService(addressId)
      showSuccess('地址删除成功')
      await fetchAddresses()
      deleteDialog.value = false
    } catch (error) {
      console.error('删除地址失败:', error)
      showError('删除地址失败')
    }
  }

  // 页面初始化
  onMounted(() => {
    fetchAddresses()
  })
</script>

<style scoped>
.addresses-tab {
  max-width: 1200px;
  margin: 0 auto;
}

.position-absolute {
  position: absolute;
}
</style>
