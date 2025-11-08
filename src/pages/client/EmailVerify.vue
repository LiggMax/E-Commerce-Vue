<template>
  <v-container class="verify-container py-12" fluid>
    <v-row justify="center">
      <v-col cols="12" lg="5" md="7">
        <v-card class="pa-6" elevation="3">
          <v-card-title class="text-h5 font-weight-bold justify-center">
            邮箱验证
          </v-card-title>

          <v-card-text>
            <div class="text-body-2 text-medium-emphasis text-center mb-6">
              <p class="mb-2">
                验证邮件已发送至
                <span class="font-weight-black text-primary">
                  {{ displayEmail }}
                </span>
                ，请前往邮箱查收六位验证码并在下方输入完成注册。
              </p>
              <p>
                请在<span class="font-weight-black text-primary">15</span>分钟内请尽快完成操作，如未收到邮件可尝试重新发送或检查垃圾邮箱。
              </p>
            </div>

            <v-form ref="formRef" v-model="valid">
              <v-text-field
                v-model="verifyCode"
                class="mb-4"
                color="primary"
                label="邮箱验证码"
                maxlength="6"
                prepend-inner-icon="mdi-shield-key"
                :rules="codeRules"
                type="text"
                variant="outlined"
              />

              <v-btn
                block
                color="primary"
                :disabled="!valid"
                :loading="submitting"
                size="large"
                @click="handleSubmit"
              >
                确认验证
              </v-btn>
            </v-form>

            <v-divider class="my-6" />
            <v-btn
              class="d-flex align-center justify-end"
              color="primary"
              :disabled="resending"
              size="large"
              @click="handleResend"
            >
              重新获取验证码
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { verifyEmailService } from '@/http/client/user.ts'
  import { useAppStore } from '@/stores/app.ts'
  import { useNotification } from '@/utils/notification.ts'

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { showInfo, showSuccess, showWarning } = useNotification()

  const formRef = ref()
  const valid = ref(false)
  const verifyCode = ref('')
  const submitting = ref(false)
  const resending = ref(false)

  const codeRules = [
    (v: string) => !!v || '请输入邮箱验证码',
    (v: string) => /^[0-9]{6}$/.test(v) || '验证码需为6位数字',
  ]

  const email = computed(() => (route.query.email as string) || '')
  const type = computed(() => route.query.type === 'true')
  const displayEmail = computed(() => email.value || '')

  onMounted(() => {
    if (!email.value) {
      showWarning('缺少注册邮箱信息，请重新发起注册流程')
      router.replace('/')
    }
  })

  async function handleSubmit () {
    if (!valid.value || submitting.value) return
    if (!email.value) {
      showWarning('缺少注册邮箱信息，请重新发起注册流程')
      return
    }

    submitting.value = true
    try {
      await verifyEmailService({
        email: email.value,
        emailCode: verifyCode.value,
        type: type.value,
      })
      showSuccess('邮箱验证成功，请使用新账号登录')
      await router.replace('/')
      appStore.openAuthDialog()
    } finally {
      submitting.value = false
    }
  }

  async function handleResend () {
    await router.push('/').then(() => {
      appStore.openAuthDialog()
    })
  }
</script>

<style scoped>
.verify-container {
  min-height: 80vh;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(30, 136, 229, 0.08));
}
</style>
