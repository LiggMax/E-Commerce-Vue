<template>
  <v-app>
    <!-- Header Navigation -->
    <ECommerceHeader />
    
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
    
    <!-- Footer -->
    <ECommerceFooter />
  </v-app>
</template>

<script lang="ts" setup>
// Components are auto-imported
</script>
