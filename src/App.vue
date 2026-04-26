<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-[--color-bg] focus:px-3 focus:py-2 focus:text-sm focus:text-[--color-ink] focus:shadow"
  >
    Skip to content
  </a>
  <Nav />
  <main id="main" class="pt-16">
    <RouterView />
  </main>
  <Footer />
</template>
