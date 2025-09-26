<template>
  <v-carousel
    class="rounded-carousel"
    cycle
    :height="carouselHeight"
    interval="5000"
    show-arrows="hover"
  >
    <v-carousel-item
      v-for="(slide, index) in slidesList"
      :key="index"
      cover
      :src="slide.images.largeImage"
    >
      <v-container class="fill-height" fluid>
        <v-row align="end" class="fill-height" justify="start">
          <v-col class="text-left" cols="12" md="6">
            <div class="hero-content ma-md-7">
              <h1 class="text-h4 text-md-h3 font-weight-bold mb-4 text-white">
                {{ slide.title }}
              </h1>
              <p class="text-h6 text-md-h5 mb-6 text-white opacity-90">
                {{ slide.subtitle }}
              </p>
              <div class="d-flex flex-column flex-md-row ga-4 ">
                <v-btn
                  color="primary"
                  elevation="4"
                  rounded
                  size="large"
                  :to="slide.primaryAction.link"
                >
                  {{ slide.primaryAction.text }}
                  <v-icon end icon="mdi-arrow-right" />
                </v-btn>
                <v-btn
                  color="white"
                  rounded
                  size="large"
                  :to="slide.secondaryAction.link"
                  variant="outlined"
                >
                  {{ slide.secondaryAction.text }}
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- 渐变叠加以提高文本可读性 -->
      <div class="hero-overlay" />
    </v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
// 定义 props
  import { getCarouselServer } from '@/http/client/carousel.ts'

  const props = defineProps({
    height: {
      type: [Number, String],
      default: 600,
    },
  })

  // 响应式高度
  const carouselHeight = ref(Number(props.height))

  // 响应式调整高度的函数
  function updateCarouselHeight () {
    const screenWidth = window.innerWidth
    const baseHeight = Number(props.height)

    if (screenWidth < 600) {
      // 小屏幕设备
      carouselHeight.value = baseHeight * 0.5
    } else if (screenWidth < 960) {
      // 中等屏幕设备
      carouselHeight.value = baseHeight * 0.6
    } else if (screenWidth < 1200) {
      // 中等屏幕设备
      carouselHeight.value = baseHeight * 0.8
    } else {
      // 大屏幕设备
      carouselHeight.value = baseHeight
    }
  }

  interface CarouselItem {
    images: {
      largeImage: string
      smallImage: string
    }
    title: string
    subtitle: string
    primaryAction: {
      text: string
      link: string
    }
    secondaryAction: {
      text: string
      link: string
    }
  }
  const slidesList = ref<CarouselItem[]>([])

  /**
   * 获取轮播图
   */
  async function getCarouselList () {
    try {
      const response = await getCarouselServer()
      // 将获取到的数据映射为组件需要的格式
      slidesList.value = response.data.map((item: any) => ({
        images: item.images,
        title: item.title,
        subtitle: item.subtitle,
        primaryAction: {
          text: item.buttonText,
          link: item.link || '/',
        },
        secondaryAction: {
          text: '了解更多',
          link: item.link || '/',
        },
      }))
    } catch (error) {
      console.error('获取轮播图失败:', error)
    }
  }

  onMounted(() => {
    updateCarouselHeight()
    window.addEventListener('resize', updateCarouselHeight)
    // 获取轮播图数据
    getCarouselList()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateCarouselHeight)
  })
</script>

<style scoped>
.hero-content {
  position: relative;
  z-index: 2;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 1;
}

.rounded-carousel {
  border-radius: 20px;
  overflow: hidden;
  margin-top: 15px;
}
</style>
