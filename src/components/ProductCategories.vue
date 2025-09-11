<template>
  <v-container class="py-12">
    <v-row>
      <v-col class="text-center mb-8" cols="12">
        <h2 class="text-h3 font-weight-bold mb-4">商品分类</h2>
        <p class="text-h6 text-medium-emphasis">探索我们精心挑选的各类商品</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card
          class="category-card mx-auto"
          elevation="4"
          hover
          max-width="300"
          rounded="lg"
          :to="category.link"
        >
          <v-img
            class="category-image"
            cover
            height="200"
            :src="category.image"
          >
            <div class="category-overlay d-flex align-center justify-center">
              <v-icon
                class="category-icon"
                color="white"
                :icon="category.icon"
                size="48"
              />
            </div>
          </v-img>

          <v-card-title class="text-center pa-4">
            <h3 class="text-h6 font-weight-bold">{{ category.name }}</h3>
          </v-card-title>

          <v-card-subtitle class="text-center pb-4">
            {{ category.description }}
          </v-card-subtitle>

          <v-card-actions class="justify-center pb-4">
            <v-btn
              append-icon="mdi-arrow-right"
              color="primary"
              rounded
              :to="category.link"
              variant="outlined"
            >
              浏览商品
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  const categories = [
    {
      id: 1,
      name: '时尚服装',
      description: '最新潮流服饰，展现个人风格',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-tshirt-crew',
      link: '/category/fashion',
    },
    {
      id: 2,
      name: '数码电子',
      description: '前沿科技产品，智能生活必备',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-laptop',
      link: '/category/electronics',
    },
    {
      id: 3,
      name: '家居用品',
      description: '温馨家居，打造舒适生活空间',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-sofa',
      link: '/category/home',
    },
    {
      id: 4,
      name: '运动健身',
      description: '专业运动装备，助力健康生活',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-dumbbell',
      link: '/category/sports',
    },
    {
      id: 5,
      name: '美妆护肤',
      description: '精选美妆产品，绽放自然美丽',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-lipstick',
      link: '/category/beauty',
    },
    {
      id: 6,
      name: '图书文具',
      description: '知识的海洋，学习的伙伴',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-book-open-page-variant',
      link: '/category/books',
    },
    {
      id: 7,
      name: '食品饮料',
      description: '优质食材，享受美味生活',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-food-apple',
      link: '/category/food',
    },
    {
      id: 8,
      name: '母婴用品',
      description: '安全放心，呵护宝宝成长',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'mdi-baby-face-outline',
      link: '/category/baby',
    },
  ]
</script>

<style scoped>
.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-8px);
}

.category-image {
  position: relative;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.category-icon {
  transform: scale(0);
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1);
}
</style>
