<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Hero from '@/sections/Hero.vue'
import Experience from '@/sections/Experience.vue'
import Skills from '@/sections/Skills.vue'
import BlogPreview from '@/sections/BlogPreview.vue'
import Contact from '@/sections/Contact.vue'

useHead({
  title: 'Gustavo Weinschütz — Senior Software Engineer',
  meta: [
    {
      name: 'description',
      content:
        'Senior Software Engineer with 15+ years across healthtech, pharma, finance, and logistics. Open to senior backend and full-stack roles.',
    },
    { property: 'og:title', content: 'Gustavo Weinschütz — Senior Software Engineer' },
    {
      property: 'og:description',
      content: 'Senior Software Engineer with 15+ years building scalable backends and full-stack systems.',
    },
    { property: 'og:image', content: 'https://gpweins.github.io/weinschutz/og-image.png' },
    { property: 'og:url', content: 'https://gpweins.github.io/weinschutz/' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [{ rel: 'canonical', href: 'https://gpweins.github.io/weinschutz/' }],
})
</script>

<template>
  <Hero />
  <Experience />
  <Skills />
  <BlogPreview />
  <Contact />
</template>
