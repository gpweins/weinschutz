<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <main>
    <h1>Blog Post</h1>
    <p>{{ slug }}</p>
  </main>
</template>
