<template>
  <!-- 头部标题导航 -->
  <ECommerceHeader />
  <v-container class="py-1" max-width="1700">
    <v-row align="stretch">
      <!-- 轮播图 -->
      <v-col class="d-flex">
        <HeroSection />
      </v-col>

      <!-- 产品分类 -->
      <v-col class="d-flex">
        <ProductCategories />
      </v-col>
    </v-row>
    <!-- 热门精选 -->
    <FeaturedProducts />
  </v-container>
  <!-- 页脚 -->
  <ECommerceFooter />
</template>

<script lang="ts" setup>
</script>

<style scoped>
</style>
