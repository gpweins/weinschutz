<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useHead } from '@unhead/vue'
import { articles } from '@/content/articles'

const props = defineProps<{ slug: string }>()

const current = computed(() => articles.find((a) => a.slug === props.slug))
const currentIndex = computed(() => articles.findIndex((a) => a.slug === props.slug))

watchEffect(() => {
  if (!current.value) return
  const url = `https://gpweins.github.io/weinschutz/blog/${current.value.slug}`
  const ogImage = current.value.ogImage
    ? new URL(current.value.ogImage, 'https://gpweins.github.io/weinschutz').href
    : 'https://gpweins.github.io/weinschutz/og-image.png'
  useHead({
    title: `${current.value.title} — Gustavo Weinschütz`,
    meta: [
      { name: 'description', content: current.value.excerpt },
      { property: 'og:title', content: current.value.title },
      { property: 'og:description', content: current.value.excerpt },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
})
const prev = computed(() =>
  currentIndex.value > 0 ? articles[currentIndex.value - 1] : null,
)
const next = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < articles.length - 1
    ? articles[currentIndex.value + 1]
    : null,
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <article class="px-6 py-16 md:py-24" v-if="current">
    <div class="mx-auto max-w-3xl">
      <RouterLink to="/blog" class="text-sm text-[--color-accent-2] hover:underline">
        ← All articles
      </RouterLink>

      <header class="mt-8 mb-12">
        <p class="text-xs uppercase tracking-[0.16em] text-[--color-accent] mb-4">
          {{ formatDate(current.date) }}
        </p>
        <h1 class="text-4xl md:text-5xl font-bold -tracking-[0.02em] text-[--color-ink] leading-tight">
          {{ current.title }}
        </h1>
        <p v-if="current.linkedinUrl" class="mt-4 text-sm">
          <a
            :href="current.linkedinUrl"
            target="_blank"
            rel="noreferrer noopener"
            class="text-[--color-accent-2] hover:underline"
          >
            Originally on LinkedIn →
          </a>
        </p>
      </header>

      <div
        class="prose prose-neutral max-w-none prose-headings:text-[--color-ink] prose-p:text-[--color-ink] prose-strong:text-[--color-ink] prose-a:text-[--color-accent-2] prose-blockquote:border-l-[--color-accent] prose-code:text-[--color-accent]"
        v-html="current.html"
      />

      <nav class="mt-20 grid gap-4 border-t border-[--color-border] pt-10 sm:grid-cols-2">
        <RouterLink
          v-if="prev"
          :to="`/blog/${prev.slug}`"
          class="block rounded-2xl border border-[--color-border] p-5 hover:border-[--color-accent] transition-colors"
        >
          <p class="text-xs uppercase tracking-[0.16em] text-[--color-ink-muted] mb-1">← Previous</p>
          <p class="text-sm font-semibold text-[--color-ink]">{{ prev.title }}</p>
        </RouterLink>
        <span v-else />
        <RouterLink
          v-if="next"
          :to="`/blog/${next.slug}`"
          class="block rounded-2xl border border-[--color-border] p-5 sm:text-right hover:border-[--color-accent] transition-colors"
        >
          <p class="text-xs uppercase tracking-[0.16em] text-[--color-ink-muted] mb-1">Next →</p>
          <p class="text-sm font-semibold text-[--color-ink]">{{ next.title }}</p>
        </RouterLink>
      </nav>
    </div>
  </article>

  <div v-else class="px-6 py-32 text-center">
    <p class="text-[--color-ink-muted]">Article not found.</p>
    <RouterLink to="/blog" class="mt-4 inline-block text-[--color-accent-2] hover:underline">
      ← Back to all articles
    </RouterLink>
  </div>
</template>
