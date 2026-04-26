<script setup lang="ts">
import { computed } from 'vue'
import { articles as allArticles } from '@/content/articles'

const articles = computed(() => allArticles.slice(0, 3))

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <section id="blog" class="px-6 py-24 md:py-32">
    <div class="mx-auto max-w-5xl">
      <header class="mb-12 flex items-end justify-between gap-6">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
            Writing
          </p>
          <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
            Recent articles
          </h2>
        </div>
        <RouterLink
          to="/blog"
          class="hidden sm:inline text-sm text-[--color-accent-2] hover:underline"
        >
          View all articles →
        </RouterLink>
      </header>

      <ul class="grid gap-6 md:grid-cols-3">
        <li
          v-for="(article, i) in articles"
          :key="article.slug"
          class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6 hover:border-[--color-accent] transition-colors"
          v-motion-fade-visible-once
          :delay="i * 80"
        >
          <RouterLink :to="`/blog/${article.slug}`" class="block">
            <p class="text-xs uppercase tracking-[0.16em] text-[--color-accent] mb-3">
              {{ formatDate(article.date) }}
            </p>
            <h3 class="text-base font-semibold text-[--color-ink] mb-2 line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-sm text-[--color-ink-muted] line-clamp-3">
              {{ article.excerpt }}
            </p>
            <p class="mt-4 text-xs text-[--color-accent-2]">Read →</p>
          </RouterLink>
        </li>
      </ul>

      <p class="mt-8 sm:hidden">
        <RouterLink to="/blog" class="text-sm text-[--color-accent-2] hover:underline">
          View all articles →
        </RouterLink>
      </p>
    </div>
  </section>
</template>
