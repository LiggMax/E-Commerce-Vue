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
          <v-card class="address-card" elevation="1">
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
                @click=""
              >
                删除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

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

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.postalCode"
                  label="邮政编码"
                  :rules="postalCodeRules"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="formData.isDefault"
                  color="primary"
                  label="设为默认地址"
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
  import { useNotification } from '@/utils/notification.ts'

  const { showSuccess, showError } = useNotification()

  // 响应式数据
  const loading = ref(false)
  const saving = ref(false)
  const addressDialog = ref(false)
  const valid = ref(false)
  const addressForm = ref()
  const editingAddress = ref<any>(null)

  // 地址数据
  interface Address {
    id: string
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
  const provinces = ref<string[]>(['北京市', '上海市', '广东省', '江苏省', '浙江省'])
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

  const postalCodeRules = [
    (v: string) => !v || /^\d{6}$/.test(v) || '邮政编码格式不正确',
  ]

  // 获取地址列表
  // async function fetchAddresses () {
  //   loading.value = true
  //   try {
  //     const res = await getAddressesService()
  //     addresses.value = res.data || []
  //   } catch (error) {
  //     console.error('获取地址列表失败:', error)
  //     showError('获取地址列表失败')
  //   } finally {
  //     loading.value = false
  //   }
  // }

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
      handleProvinceChange(address.province)
      handleCityChange(address.city)
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

    // 模拟城市数据
    const cityMap: Record<string, string[]> = {
      北京市: ['东城区', '西城区', '朝阳区', '海淀区'],
      上海市: ['黄浦区', '徐汇区', '长宁区', '静安区'],
      广东省: ['广州市', '深圳市', '珠海市', '汕头市'],
      江苏省: ['南京市', '苏州市', '无锡市', '常州市'],
      浙江省: ['杭州市', '宁波市', '温州市', '嘉兴市'],
    }
    cities.value = cityMap[province] || []
  }

  // 处理城市变化
  function handleCityChange (city: string) {
    formData.district = ''

    // 模拟区县数据
    const districtMap: Record<string, string[]> = {
      广州市: ['天河区', '越秀区', '海珠区', '荔湾区'],
      深圳市: ['罗湖区', '福田区', '南山区', '宝安区'],
      南京市: ['玄武区', '秦淮区', '建邺区', '鼓楼区'],
      杭州市: ['上城区', '下城区', '江干区', '拱墅区'],
    }
    districts.value = districtMap[city] || []
  }

  // 保存地址
  // async function saveAddress () {
  //   if (!valid.value) return
  //
  //   saving.value = true
  //   try {
  //     if (editingAddress.value) {
  //       // 更新地址
  //       await updateAddressService(editingAddress.value.id, formData)
  //       showSuccess('地址更新成功')
  //     } else {
  //       // 新增地址
  //       await addAddressService(formData)
  //       showSuccess('地址添加成功')
  //     }
  //
  //     closeAddressDialog()
  //     fetchAddresses()
  //   } catch (error) {
  //     console.error('保存地址失败:', error)
  //     showError('保存地址失败')
  //   } finally {
  //     saving.value = false
  //   }
  // }

  // 设为默认地址
  // async function setDefault (addressId: string) {
  //   try {
  //     await setDefaultAddressService(addressId)
  //     showSuccess('已设为默认地址')
  //     fetchAddresses()
  //   } catch (error) {
  //     console.error('设置默认地址失败:', error)
  //     showError('设置默认地址失败')
  //   }
  // }

  // 删除地址
  // async function deleteAddress (addressId: string) {
  //   try {
  //     await deleteAddressService(addressId)
  //     showSuccess('地址删除成功')
  //     fetchAddresses()
  //   } catch (error) {
  //     console.error('删除地址失败:', error)
  //     showError('删除地址失败')
  //   }
  // }

  // 页面初始化
  onMounted(() => {
    // fetchAddresses()
  })
</script>

<style scoped>
.addresses-tab {
  max-width: 1200px;
  margin: 0 auto;
}

.address-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.position-absolute {
  position: absolute;
}
</style>
