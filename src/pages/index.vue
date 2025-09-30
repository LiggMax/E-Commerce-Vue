<template>
  <!-- 头部标题导航 -->
  <ECommerceHeader />
  <v-container class="py-1" max-width="1700">
    <v-row align="stretch" no-gutters>
      <!-- 轮播图 -->
      <v-col
        class="d-flex pa-2"
        cols="12"
        lg="8"
      >
        <HeroSection />
      </v-col>

      <!-- 产品分类 -->
      <v-col
        class="d-flex pa-2"
        cols="12"
        lg="4"
      >
        <ProductCategories />
      </v-col>
    </v-row>

    <!-- 热门精选 -->
    <FeaturedProducts class="my-8" />
  </v-container>
  <!-- 页脚 -->
  <ECommerceFooter />
</template>

<script lang="ts" setup>
</script>

<style scoped>
</style>
