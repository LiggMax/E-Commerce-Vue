<template>
  <v-carousel
    cycle
    height="500"
    interval="5000"
    show-arrows="hover"
  >
    <v-carousel-item
      v-for="(slide, index) in slides"
      :key="index"
      cover
      :src="slide.image"
    >
      <v-container class="fill-height" fluid>
        <v-row align="center" class="fill-height" justify="center">
          <v-col class="text-center text-md-left" cols="12" md="6">
            <div class="hero-content">
              <h1 class="text-h2 text-md-h1 font-weight-bold mb-4 text-white">
                {{ slide.title }}
              </h1>
              <p class="text-h6 text-md-h5 mb-6 text-white opacity-90">
                {{ slide.subtitle }}
              </p>
              <div class="d-flex flex-column flex-md-row gap-4">
                <v-btn
                  color="primary"
                  elevation="4"
                  rounded
                  size="x-large"
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

      <!-- Gradient overlay for better text readability -->
      <div class="hero-overlay" />
    </v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: '夏季大促销',
      subtitle: '精选商品低至3折，限时优惠不容错过',
      primaryAction: {
        text: '立即购买',
        link: '/deals',
      },
      secondaryAction: {
        text: '查看详情',
        link: '/summer-sale',
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      title: '新品上市',
      subtitle: '最新时尚单品，引领潮流趋势',
      primaryAction: {
        text: '探索新品',
        link: '/new-arrivals',
      },
      secondaryAction: {
        text: '了解更多',
        link: '/about-new',
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
      title: '品质保证',
      subtitle: '精选优质商品，为您提供最佳购物体验',
      primaryAction: {
        text: '精品推荐',
        link: '/featured',
      },
      secondaryAction: {
        text: '品质承诺',
        link: '/quality',
      },
    },
  ]
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

.gap-4 {
  gap: 1rem;
}
</style>
