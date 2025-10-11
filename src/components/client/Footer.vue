<template>
  <v-footer class="bg-grey-darken-4 text-white pt-12">
    <v-container>
      <!-- Main Footer Content -->
      <v-row>
        <!-- Company Info -->
        <v-col cols="12" md="3">
          <div class="mb-4">
            <v-icon class="mr-2" color="primary" icon="mdi-storefront" size="32" />
            <span class="text-h5 font-weight-bold">ShopVue</span>
          </div>
          <p class="text-body-2 mb-4">
            专业的在线购物平台，为您提供优质商品和贴心服务。我们致力于为每一位顾客创造完美的购物体验。
          </p>
          <v-btn
            v-for="social in socialMedia"
            :key="social.name"
            color="primary"
            :href="social.url"
            :icon="social.icon"
            size="large"
            target="_blank"
            variant="text"
          />
        </v-col>

        <!-- Quick Links -->
        <v-col cols="6" md="2">
          <h3 class="text-h6 font-weight-bold mb-4">快速链接</h3>
          <v-list bg-color="transparent" density="compact">
            <v-list-item
              v-for="link in quickLinks"
              :key="link.text"
              class="px-2 text-body-2 text-white rounded-lg"
              :to="link.to"
            >
              {{ link.text }}
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Categories -->
        <v-col cols="6" md="2">
          <h3 class="text-h6 font-weight-bold mb-4">商品分类</h3>
          <v-list bg-color="transparent" density="compact">
            <v-list-item
              v-for="category in footerCategories"
              :key="category.text"
              class="px-2 text-body-2 text-white rounded-lg"
              :to="category.to"
            >
              {{ category.text }}
            </v-list-item>
          </v-list>
        </v-col>

        <!-- 顾客服务 -->
        <v-col cols="6" md="2">
          <h3 class="text-h6 font-weight-bold mb-4">客户服务</h3>
          <v-list bg-color="transparent" density="compact">
            <v-list-item
              v-for="service in customerServices"
              :key="service.text"
              class="px-2 text-body-2 text-white rounded-lg"
              :to="service.to"
            >
              {{ service.text }}
            </v-list-item>
          </v-list>
        </v-col>

        <!-- 联系信息 -->
        <v-col cols="6" md="3">
          <h3 class="text-h6 font-weight-bold mb-4">联系我们</h3>
          <div class="contact-info">
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" icon="mdi-map-marker" size="small" />
              <span class="text-body-2">广东珠海</span>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" icon="mdi-phone" size="small" />
              <span class="text-body-2">400-888-8888</span>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" icon="mdi-email" size="small" />
              <span class="text-body-2">service@shopvue.com</span>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-3" icon="mdi-clock-outline" size="small" />
              <span class="text-body-2">周一至周日 9:00-22:00</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 订阅 -->
      <v-row class="mt-8">
        <v-col cols="12">
          <v-divider class="mb-6" />
          <div class="text-center mb-6 ">
            <h3 class="text-h6 font-weight-bold mb-2">订阅我们的邮件</h3>
            <p class="text-body-2 mb-4">获取最新优惠信息和新品精选</p>
            <div class="d-flex justify-center align-center">
              <v-text-field
                v-model="email"
                class="mr-2"
                density="compact"
                hide-details
                placeholder="请输入您的邮箱地址"
                style="max-width: 300px;"
                variant="outlined"
              />
              <v-btn
                color="primary"
                @click="subscribe"
              >
                订阅
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 底部栏 -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-divider class="mb-4" />
          <div class="d-flex flex-column flex-md-row justify-space-between align-center">
            <div class="text-body-2  mb-4 mb-md-0 ">
              © {{ new Date().getFullYear() }} ShopVue. 版权所有 |
              <a class="text-decoration-none text-primary" href="/privacy">隐私政策</a> |
              <a class="text-decoration-none text-primary" href="/terms">服务条款</a>
            </div>
            <div class="d-flex align-center">
              <span class="text-body-2  mr-4">支付方式:</span>
              <v-icon
                v-for="payment in paymentMethods"
                :key="payment"
                class="mr-2"
                :icon="payment"
                size="24"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 返回顶部按钮 -->
    <v-fab
      v-show="showBackToTop"
      class="back-to-top"
      color="primary"
      icon="mdi-chevron-up"
      location="bottom end"
      size="small"
      @click="scrollToTop"
    />
  </v-footer>
</template>

<script setup lang="ts">

  import { subscribeServer } from '@/http/client/subscribe.ts'
  import useNotification from '@/utils/notification'

  const email = ref('')
  const showBackToTop = ref(false)

  const socialMedia = [
    { name: 'WeChat', icon: 'mdi-wechat', url: '#' },
    { name: 'Weibo', icon: 'mdi-sina-weibo', url: '#' },
    { name: 'QQ', icon: 'mdi-qqchat', url: '#' },
    { name: 'Douyin', icon: 'mdi-music-note', url: '#' },
    { name: 'GitHub', icon: 'mdi-github', url: '#' },
  ]

  const quickLinks = [
    { text: '关于我们', to: '/about' },
    { text: '新闻动态', to: '/news' },
    { text: '招聘信息', to: '/careers' },
    { text: '合作伙伴', to: '/partners' },
    { text: '投资者关系', to: '/investor' },
  ]

  const footerCategories = [
    { text: '时尚服装', to: '/category/fashion' },
    { text: '数码电子', to: '/category/electronics' },
    { text: '家居用品', to: '/category/home' },
    { text: '运动健身', to: '/category/sports' },
    { text: '美妆护肤', to: '/category/beauty' },
  ]

  const customerServices = [
    { text: '帮助中心', to: '/help' },
    { text: '退换货政策', to: '/returns' },
    { text: '配送信息', to: '/shipping' },
    { text: '支付方式', to: '/payment' },
    { text: '售后服务', to: '/support' },
  ]

  const paymentMethods = [
    'mdi-credit-card',
    'mdi-wallet',
    'mdi-bank',
    'mdi-cellphone',
  ]

  function scrollToTop () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function subscribe () {
    if (!email.value) {
      useNotification.showWarning('内容不能为空')
      return
    }
    if (email.value) {
      console.log('订阅邮箱:', email.value)
      const formData = new FormData()
      formData.append('email', email.value)
      subscribeServer(formData)
      useNotification.showSuccess('订阅成功')
      email.value = ''
    }
  }

  function handleScroll () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    showBackToTop.value = scrollTop > 100
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<style scoped>
/* 返回顶部按钮样式 */
.back-to-top {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 1000;
  transition: all 0.3s ease;
}

</style>
