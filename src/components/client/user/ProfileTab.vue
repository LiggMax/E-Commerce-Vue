<template>
  <div class="profile-tab">
    <v-form ref="form" v-model="valid" @submit="">
      <v-row>
        <!-- 头像上传 -->
        <v-col class="text-center" cols="12">
          <div class="avatar-section mb-6">
            <v-avatar class="mb-4" size="120">
              <v-img v-if="formData.avatar" :src="formData.avatar" />
              <v-icon v-else color="primary" icon="mdi-account-circle" size="120" />
            </v-avatar>
            <div>
              <v-btn
                color="primary"
                size="small"
                variant="outlined"
                @click="selectAvatar"
              >
                <v-icon icon="mdi-camera" start />
                更换头像
              </v-btn>
              <input
                ref="avatarInput"
                accept="image/*"
                style="display: none"
                type="file"
                @change="handleAvatarChange"
              >
            </div>
          </div>
        </v-col>

        <!-- 基本信息 -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.nickName"
            label="昵称"
            prepend-inner-icon="mdi-account"
            :rules="nickNameRules"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.email"
            label="邮箱"
            prepend-inner-icon="mdi-email"
            :rules="emailRules"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            disabled
            label="用户名"
            :model-value="userInfo?.account"
            prepend-inner-icon="mdi-account-circle"
            readonly
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            disabled
            label="注册时间"
            :model-value="formatDate(userInfo?.createTime)"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
          />
        </v-col>

        <!-- 最后登录时间 -->
        <v-col cols="12" md="6">
          <v-text-field
            disabled
            label="最后登录"
            :model-value="formatDate(userInfo?.lastLoginTime)"
            prepend-inner-icon="mdi-clock"
            readonly
            variant="outlined"
          />
        </v-col>

        <!-- 用户角色 -->
        <v-col cols="12" md="6">
          <v-text-field
            disabled
            label="用户角色"
            :model-value="getRoleText(userInfo?.role)"
            prepend-inner-icon="mdi-shield-account"
            readonly
            variant="outlined"
          />
        </v-col>

        <!-- 操作按钮 -->
        <v-col class="text-center" cols="12">
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            size="large"
            type="submit"
            variant="flat"
          >
            <v-icon icon="mdi-content-save" start />
            保存修改
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
  import { useNotification } from '@/utils/notification.ts'

  interface Props {
    userInfo?: {
      nickName: string
      account: string
      email: string
      avatar: string
      role: string
      createTime: string
      lastLoginTime: string
    }
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    update: [userInfo: any]
  }>()

  const { showSuccess, showError } = useNotification()

  // 响应式数据
  const form = ref()
  const valid = ref(false)
  const loading = ref(false)
  const avatarInput = ref<HTMLInputElement>()

  // 表单数据
  const formData = reactive({
    nickName: '',
    email: '',
    avatar: '',
  })

  // 表单验证规则
  const nickNameRules = [
    (v: string) => !!v || '请输入昵称',
    (v: string) => (v && v.length >= 2) || '昵称至少需要2个字符',
    (v: string) => (v && v.length <= 20) || '昵称不能超过20个字符',
  ]

  const emailRules = [
    (v: string) => !!v || '请输入邮箱',
    (v: string) => /.+@.+\..+/.test(v) || '邮箱格式不正确',
  ]

  // 监听用户信息变化，更新表单数据
  watch(() => props.userInfo, newUserInfo => {
    if (newUserInfo) {
      formData.nickName = newUserInfo.nickName || ''
      formData.email = newUserInfo.email || ''
      formData.avatar = newUserInfo.avatar || ''
    }
  }, { immediate: true })

  // 选择头像
  function selectAvatar () {
    avatarInput.value?.click()
  }

  // 处理头像变化
  function handleAvatarChange (event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      // 检查文件大小（限制2MB）
      if (file.size > 2 * 1024 * 1024) {
        showError('头像文件大小不能超过2MB')
        return
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        showError('请选择图片文件')
        return
      }

      // 创建预览URL
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        formData.avatar = e.target?.result as string
      })
      reader.readAsDataURL(file)
    }
  }

  // 格式化日期
  function formatDate (dateString?: string) {
    if (!dateString) return '暂无'
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 获取角色文本
  function getRoleText (role?: string) {
    const roleMap: Record<string, string> = {
      USER: '普通用户',
      ADMIN: '管理员',
      VIP: 'VIP用户',
    }
    return roleMap[role || 'USER'] || '普通用户'
  }

</script>

<style scoped>
.profile-tab {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-section {
  padding: 20px;
  border: 2px dashed rgb(var(--v-theme-outline));
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}
</style>
