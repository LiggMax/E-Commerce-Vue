<template>
  <v-dialog v-model="dialog" max-width="450px" persistent>
    <v-card class="auth-card">
      <!-- Header -->
      <v-card-title class="text-center py-2">
        <div class="align-center">
          <v-icon
            class="mb-4"
            color="primary"
            size="48"
          >
            {{ isForgotPassword ? 'mdi-lock-reset' : isLogin ? 'mdi-account-circle' : 'mdi-account-plus' }}
          </v-icon>
          <h2 class="text-h4 font-weight-bold text-primary">
            {{ isForgotPassword ? '找回密码' : isLogin ? '用户登录' : '用户注册' }}
          </h2>
          <p class="text-subtitle-1 text-medium-emphasis mt-2">
            {{ isForgotPassword ? '请输入您的账号信息重置密码' : isLogin ? '请输入您的登录凭据' : '创建您的账户' }}
          </p>
        </div>
      </v-card-title>

      <!-- Auth Form -->
      <v-card-text class="px-6 pb-6">
        <v-form v-model="valid">
          <!-- Email Field -->
          <v-text-field
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
            autocomplete="current-password"
            class="mb-2"
            color="primary"
            :error-messages="errors.password"
            :label="isForgotPassword?'输入新密码':'密码'"
            prepend-inner-icon="mdi-lock"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showPassword = !showPassword"
            @input="handlePasswordInput"
          />

          <!-- Confirm Password Field (注册和找回密码时显示) -->
          <v-text-field
            v-if="!isLogin"
            v-model="authForm.confirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            autocomplete="new-password"
            class="mb-2"
            color="primary"
            :error-messages="errors.confirmPassword"
            :label="isForgotPassword ? '确认密码密码' : '确认密码'"
            prepend-inner-icon="mdi-lock-check"
            :rules="confirmPasswordRules"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            @input="clearError('confirmPassword')"
          />

          <!-- Captcha Field (注册和找回密码时显示，且在输入密码后) -->
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
              <div class="d-flex align-center justify-center mb-5" style="min-width: 150px;min-height: 60px">
                <v-img
                  v-if="captcha && !captchaLoading"
                  class="rounded-lg cursor-pointer"
                  :src="'data:image/png;base64,' + captcha?.captcha"
                  @click="debouncedGetCaptcha"
                >
                  <v-tooltip
                    activator="parent"
                    location="top"
                  >
                    点击刷新验证码
                  </v-tooltip>
                </v-img>
                <div
                  v-else
                  class="captcha-loading"
                >
                  <v-progress-circular
                    color="primary"
                    indeterminate
                    size="40"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-end">
            <v-btn
              v-if="isLogin && !isForgotPassword"
              color="primary"
              size="large"
              variant="text"
              @click="switchToForgotPassword"
            >
              忘记密码？
            </v-btn>
          </div>
          <!-- Remember Me (仅登录时显示) -->
          <v-checkbox
            v-if="isLogin && !isForgotPassword"
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
            variant="flat"
            @click="handleAuth"
          >
            <v-icon :start="true">
              {{ isForgotPassword ? 'mdi-lock-reset' : isLogin ? 'mdi-login' : 'mdi-account-plus' }}
            </v-icon>
            {{ isForgotPassword ? '重置密码' : isLogin ? '登录' : '注册' }}
          </v-btn>

          <!-- Switch Auth Mode Link -->
          <div class="text-center">
            <span class="text-medium-emphasis">
              {{ isForgotPassword ? '记起密码了？' : isLogin ? '还没有账户？' : '已有账户？' }}
            </span>
            <v-btn
              color="primary"
              size="small"
              variant="text"
              @click="isForgotPassword ? switchToLogin() : switchAuthMode()"
            >
              {{ isForgotPassword ? '返回登录' : isLogin ? '立即注册' : '立即登录' }}
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
  import { forgetPasswordService, loginService, registerService } from '@/http/client/user.ts'
  import router from '@/router'
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

  const tokenStore = userTokenStore()
  const { showSuccess } = useNotification()

  // 响应式数据
  const form = ref()
  const valid = ref(false)
  const loading = ref(false)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const isLogin = ref(true) // true为登录模式，false为注册模式
  const isForgotPassword = ref(false) // true为找回密码模式
  const showCaptcha = ref(false)
  const captchaLoading = ref(false)

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

  // 切换到找回密码模式
  function switchToForgotPassword () {
    isForgotPassword.value = true
    isLogin.value = false
    resetForm()
  }

  // 切换回登录模式
  function switchToLogin () {
    isForgotPassword.value = false
    isLogin.value = true
    resetForm()
  }

  // 切换认证模式（登录/注册）
  function switchAuthMode () {
    isForgotPassword.value = false
    isLogin.value = !isLogin.value
    resetForm()
  }

  // 创建防抖函数
  const debouncedGetCaptcha = debounce(getCaptcha, 500)

  // 防抖函数实现
  function debounce (func: Function, wait: number) {
    let timeout: number | undefined
    return function (...args: any[]) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func(...args)
      }, wait) as unknown as number
    }
  }

  // 处理密码输入事件
  function handlePasswordInput () {
    clearError('password')
    // 在注册模式或找回密码模式下且密码不为空时才显示验证码
    if (!isLogin.value && authForm.password) {
      showCaptcha.value = true
      // 如果还没有获取过验证码，则获取验证码
      if (!captcha.value) {
        debouncedGetCaptcha()
      }
    }
  }

  /**
   * 获取验证码
   */
  async function getCaptcha () {
    captchaLoading.value = true
    try {
      if (captcha.value?.uuid) {
        const res = await getCaptchaService(captcha.value?.uuid.toString())
        return captcha.value = res.data
      } else {
        const res = await getCaptchaService()
        if (res.data) {
          return captcha.value = res.data
        }
      }
    } finally {
      captchaLoading.value = false
    }
  }

  // 处理认证（登录、注册或找回密码）
  async function handleAuth () {
    if (!valid.value) return

    loading.value = true

    try {
      if (isForgotPassword.value) {
        // 找回密码
        const email = authForm.email
        await forgetPasswordService({
          email: email,
          password: authForm.password,
          code: authForm.captcha,
          uuid: captcha.value!.uuid,
        })
        showSuccess('已发送重置密码邮件,请完成验证')
        await router.push({
          path: '/client/RegisterVerify',
          query: {
            email,
            forget: 'true',
          },
        })
      } else if (isLogin.value) {
        // 登录
        const res = await loginService({
          email: authForm.email,
          password: authForm.password,
        })
        tokenStore.setToken(res.data)
        showSuccess('登录成功')
        closeDialog()
        emit('login-success') // 发送登录成功事件
      } else {
        // 注册
        const email = authForm.email
        await registerService({
          password: authForm.password,
          email,
          code: authForm.captcha,
          uuid: captcha.value!.uuid,
        })
        showSuccess('注册成功，请前往邮箱完成验证')
        closeDialog()
        await router.push({
          path: '/client/RegisterVerify',
          query: {
            email,
            forget: 'false',
          },
        })
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
    captcha.value = undefined
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
        isForgotPassword.value = false
        resetForm()
      }, 300)
    }
  })
</script>
