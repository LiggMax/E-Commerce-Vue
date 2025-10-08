<template>
  <div class="login-container">
    <div class="login-content">
      <v-card class="login-card" elevation="8" rounded="lg">
        <!-- Header -->
        <v-card-title class="text-center pa-6">
          <div class="login-header">
            <v-icon
              class="mb-4"
              color="primary"
              size="48"
            >
              mdi-shield-account
            </v-icon>
            <h2 class="text-h4 font-weight-bold text-primary">
              后台管理
            </h2>
            <p class="text-subtitle-1 text-medium-emphasis mt-2">
              请输入您的登录凭据
            </p>
          </div>
        </v-card-title>

        <!-- Login Form -->
        <v-card-text class="px-6 pb-6">
          <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
            <!-- Username Field -->
            <v-text-field
              v-model="loginForm.username"
              class="mb-3"
              color="primary"
              :error-messages="errors.username"
              label="用户名"
              prepend-inner-icon="mdi-account"
              :rules="usernameRules"
              variant="outlined"
              @input="clearError('username')"
            />

            <!-- Password Field -->
            <v-text-field
              v-model="loginForm.password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              class="mb-3"
              color="primary"
              :error-messages="errors.password"
              label="密码"
              prepend-inner-icon="mdi-lock"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              @click:append-inner="showPassword = !showPassword"
              @input="clearError('password')"
            />

            <!-- Remember Me -->
            <v-checkbox
              v-model="loginForm.remember"
              class="mb-4"
              color="primary"
              hide-details
              label="记住我"
            />

            <!-- Error Message -->
            <v-alert
              v-if="errorMessage"
              class="mb-4"
              closable
              :text="errorMessage"
              type="error"
              variant="tonal"
              @click:close="errorMessage = ''"
            />

            <!-- Login Button -->
            <v-btn
              block
              class="mb-3"
              color="primary"
              :disabled="!valid"
              :loading="loading"
              size="large"
              type="submit"
              variant="flat"
            >
              <v-icon start>mdi-login</v-icon>
              登录
            </v-btn>

            <!-- Forgot Password Link -->
            <div class="text-center">
              <v-btn
                color="primary"
                size="small"
                variant="text"
                @click="handleForgotPassword"
              >
                忘记密码？
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useThemeToggle } from '@/composables/useTheme.ts'
  import { login } from '@/http/admin/login.ts'
  import { userTokenStore } from '@/stores/token.ts'

  // 路由实例
  const router = useRouter()

  // 初始化主题
  const { loadTheme } = useThemeToggle()
  loadTheme()

  const { setToken } = userTokenStore()

  // 响应式数据
  const form = ref()
  const valid = ref(false)
  const loading = ref(false)
  const showPassword = ref(false)
  const errorMessage = ref('')

  // 登录表单数据
  const loginForm = reactive({
    username: '',
    password: '',
    remember: false,
  })

  // 表单错误信息
  const errors = reactive({
    username: '',
    password: '',
  })

  // 表单验证规则
  const usernameRules = [
    (v: string) => !!v || '请输入用户名',
    (v: string) => (v && v.length >= 6) || '用户名至少需要6个字符',
    (v: string) => (v && v.length < 30) || '用户名不能超过20个字符',
  ]

  const passwordRules = [
    (v: string) => !!v || '请输入密码',
    (v: string) => (v && v.length >= 6) || '密码至少需要6个字符',
    (v: string) => (v && v.length < 30) || '密码不能超过30个字符',
  ]

  // 清除特定字段错误
  function clearError (field: keyof typeof errors) {
    errors[field] = ''
    errorMessage.value = ''
  }

  // 处理登录
  async function handleLogin () {
    if (!valid.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      const response = await login(loginForm.username, loginForm.password)
      // 保存token
      setToken(response.data)
      await router.push('/admin/dashboard')
    } finally {
      loading.value = false
    }
  }

  // 处理忘记密码
  function handleForgotPassword () {
    // 这里可以打开忘记密码对话框或跳转到忘记密码页面
    console.log('忘记密码功能')
    // 示例：显示提示信息
    errorMessage.value = ''
  // 可以添加忘记密码的逻辑
  }

  // 页面挂载时检查是否有记住的用户名
  onMounted(() => {
    // const rememberedUser = localStorage.getItem('remember_user')
    // if (rememberedUser) {
    //   loginForm.username = rememberedUser
    //   loginForm.remember = true
    // }
  })
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.login-content {
  width: 90vw;
  max-width: 450px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.login-header {
  text-align: center;
}

</style>
