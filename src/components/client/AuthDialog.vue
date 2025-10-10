<template>
  <v-dialog v-model="dialog" max-width="450px" persistent>
    <v-card class="auth-card">
      <!-- Header -->
      <v-card-title class="text-center py-2">
        <div class="auth-header">
          <v-icon
            class="mb-4"
            color="primary"
            size="48"
          >
            {{ isLogin ? 'mdi-account-circle' : 'mdi-account-plus' }}
          </v-icon>
          <h2 class="text-h4 font-weight-bold text-primary">
            {{ isLogin ? '用户登录' : '用户注册' }}
          </h2>
          <p class="text-subtitle-1 text-medium-emphasis mt-2">
            {{ isLogin ? '请输入您的登录凭据' : '创建您的账户' }}
          </p>
        </div>
      </v-card-title>

      <!-- Auth Form -->
      <v-card-text class="px-6 pb-6">
        <v-form ref="form" v-model="valid" @submit.prevent="handleAuth">
          <!-- Username Field -->
          <v-text-field
            v-model="authForm.username"
            class="mb-2"
            color="primary"
            :error-messages="errors.username"
            label="用户名"
            prepend-inner-icon="mdi-account"
            :rules="usernameRules"
            variant="outlined"
            @input="clearError('username')"
          />

          <!-- Email Field (仅注册时显示) -->
          <v-text-field
            v-if="!isLogin"
            v-model="authForm.email"
            class="mb-2"
            color="primary"
            :error-messages="errors.email"
            label="邮箱"
            prepend-inner-icon="mdi-email"
            :rules="emailRules"
            variant="outlined"
            @input="clearError('email')"
          />

          <!-- Password Field -->
          <v-text-field
            v-model="authForm.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            class="mb-2"
            color="primary"
            :error-messages="errors.password"
            label="密码"
            prepend-inner-icon="mdi-lock"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showPassword = !showPassword"
            @input="handlePasswordInput"
          />

          <!-- Confirm Password Field (仅注册时显示) -->
          <v-text-field
            v-if="!isLogin"
            v-model="authForm.confirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            class="mb-2"
            color="primary"
            :error-messages="errors.confirmPassword"
            label="确认密码"
            prepend-inner-icon="mdi-lock-check"
            :rules="confirmPasswordRules"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            @input="clearError('confirmPassword')"
          />

          <!-- Captcha Field (仅注册时显示，且在输入密码后) -->
          <div v-if="!isLogin && showCaptcha">
            <div class="d-flex align-center mb-2">
              <v-text-field
                v-model="authForm.captcha"
                class="flex-grow-1 mr-2"
                color="primary"
                :error-messages="errors.captcha"
                label="验证码"
                prepend-inner-icon="mdi-shield-check"
                :rules="captchaRules"
                variant="outlined"
                @input="clearError('captcha')"
              />
              <v-img
                v-if="captcha"
                class="rounded-lg mb-4"
                :src="'data:image/png;base64,'+ captcha?.captcha"
                @click="getCaptcha"
              />
            </div>
          </div>

          <!-- Remember Me (仅登录时显示) -->
          <v-checkbox
            v-if="isLogin"
            v-model="authForm.remember"
            color="primary"
            hide-details
            label="记住我"
          />

          <!-- Auth Button -->
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
            <v-icon :start="true">
              {{ isLogin ? 'mdi-login' : 'mdi-account-plus' }}
            </v-icon>
            {{ isLogin ? '登录' : '注册' }}
          </v-btn>

          <!-- Switch Auth Mode Link -->
          <div class="text-center">
            <span class="text-medium-emphasis">
              {{ isLogin ? '还没有账户？' : '已有账户？' }}
            </span>
            <v-btn
              color="primary"
              size="small"
              variant="text"
              @click="switchAuthMode"
            >
              {{ isLogin ? '立即注册' : '立即登录' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { getCaptchaService } from '@/http/client/captcha.ts'
  import { loginService, registerService } from '@/http/client/user.ts'
  import { userTokenStore } from '@/stores/client/clientToken.ts'
  import { useNotification } from '@/utils/notification.ts'

  // Props
  interface Props {
    modelValue: boolean
  }

  const props = defineProps<Props>()

  // Emits
  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'login-success'): void
  }

  const emit = defineEmits<Emits>()

  const { setToken } = userTokenStore()
  const { showSuccess } = useNotification()

  // 响应式数据
  const form = ref()
  const valid = ref(false)
  const loading = ref(false)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const isLogin = ref(true) // true为登录模式，false为注册模式
  const showCaptcha = ref(false)

  // 认证表单数据
  const authForm = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: '',
    remember: false,
  })

  // 表单错误信息
  const errors = reactive({
    username: '',
    email: '',
    password: '',
    captcha: '',
    confirmPassword: '',
  })

  interface Captcha {
    uuid: string
    captcha: string
  }

  // 验证码
  const captcha = ref<Captcha>()

  // 表单验证规则
  const usernameRules = [
    (v: string) => !!v || '请输入用户名',
    (v: string) => (v && v.length >= 6) || '用户名至少需要个6字符',
    (v: string) => (v && v.length < 30) || '用户名不能超过30个字符',
    (v: string) => v !== '123456' || '账号过于简单',
  ]

  const emailRules = [
    (v: string) => !!v || '请输入邮箱',
    (v: string) => /.+@.+\..+/.test(v) || '邮箱格式不正确',
  ]

  const passwordRules = [
    (v: string) => !!v || '请输入密码',
    (v: string) => (v && v.length >= 6) || '密码至少需要6个字符',
    (v: string) => (v && v.length < 30) || '密码不能超过30个字符',
    (v: string) => v !== '123456' || '密码于简单',
  ]

  const confirmPasswordRules = [
    (v: string) => !!v || '请确认密码',
    (v: string) => v === authForm.password || '两次输入的密码不一致',
  ]

  const captchaRules = [
    (v: string) => !!v || '请输入验证码',
    (v: string) => (v && v.length === 6) || '验证码为6位字符',
  ]

  // 计算属性
  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  // 清除特定字段错误
  function clearError (field: keyof typeof errors) {
    errors[field] = ''
  }

  // 关闭对话框
  function closeDialog () {
    dialog.value = false
  }

  // 切换认证模式（登录/注册）
  function switchAuthMode () {
    isLogin.value = !isLogin.value
    resetForm()
  }

  // 处理密码输入事件
  function handlePasswordInput () {
    clearError('password')
    // 在注册模式下且密码不为空时才显示验证码
    if (!isLogin.value && authForm.password) {
      showCaptcha.value = true
      // 如果还没有获取过验证码，则获取验证码
      if (!captcha.value) {
        getCaptcha()
      }
    }
  }

  /**
   * 获取验证码
   */
  async function getCaptcha () {
    try {
      const res = await getCaptchaService()
      captcha.value = res.data
    } catch (error) {
      console.error('获取验证码失败:', error)
    }
  }

  // 处理认证（登录或注册）
  async function handleAuth () {
    if (!valid.value) return

    loading.value = true

    try {
      if (isLogin.value) {
        // 登录
        const res = await loginService({
          account: authForm.username,
          password: authForm.password,
        })
        setToken(res.data)
        showSuccess('登录成功')
        closeDialog()
      } else {
        // 注册
        await registerService({
          account: authForm.username,
          password: authForm.password,
          email: authForm.email,
          code: authForm.captcha,
          uuid: captcha.value!.uuid,
        })
        showSuccess('注册成功')
        switchAuthMode()
        emit('login-success')// 发射登录成功事件
      }

      // 重置表单
      resetForm()
    } finally {
      loading.value = false
    }
  }

  // 重置表单
  function resetForm () {
    authForm.username = ''
    authForm.email = ''
    authForm.password = ''
    authForm.confirmPassword = ''
    authForm.captcha = ''
    authForm.remember = false
    showCaptcha.value = false
    if (form.value) {
      form.value.resetValidation()
    }
  }

  // 监听对话框关闭，重置表单
  watch(dialog, newValue => {
    if (!newValue) {
      // 延迟重置，确保动画完成
      setTimeout(() => {
        isLogin.value = true
        resetForm()
      }, 300)
    }
  })
</script>

<style scoped>
.auth-header {
  text-align: center;
}
</style>
