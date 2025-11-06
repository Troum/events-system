<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-teal-50/50 dark:from-gray-900 dark:via-cyan-950/20 dark:to-teal-950/20 transition-colors duration-300">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
</style>
