<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { articles } from '@/content/articles'

useHead({
  title: 'Articles — Gustavo Weinschütz',
  meta: [
    { name: 'description', content: 'Writing on engineering, leadership, and team communication.' },
    { property: 'og:title', content: 'Articles — Gustavo Weinschütz' },
    { property: 'og:url', content: 'https://weinschutz.com.br/blog' },
  ],
  link: [{ rel: 'canonical', href: 'https://weinschutz.com.br/blog' }],
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="px-6 py-24 md:py-32">
    <div class="mx-auto max-w-3xl">
      <header class="mb-16">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Writing
        </p>
        <h1 class="text-5xl font-bold -tracking-[0.02em] text-[--color-ink]">
          Articles
        </h1>
      </header>

      <ul class="space-y-10">
        <li
          v-for="article in articles"
          :key="article.slug"
          class="border-b border-[--color-border] pb-10 last:border-0"
        >
          <RouterLink :to="`/blog/${article.slug}`" class="block group">
            <p class="text-xs uppercase tracking-[0.16em] text-[--color-accent] mb-3">
              {{ formatDate(article.date) }}
            </p>
            <h2 class="text-2xl font-semibold text-[--color-ink] mb-3 group-hover:text-[--color-accent-2] transition-colors">
              {{ article.title }}
            </h2>
            <p class="text-[--color-ink-muted] leading-relaxed">
              {{ article.excerpt }}
            </p>
            <p class="mt-4 text-sm text-[--color-accent-2]">Read article →</p>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>
