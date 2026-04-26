<script setup lang="ts">
import { experience, type ExperienceEntry } from '@/data/experience'

function formatRange(entry: ExperienceEntry): string {
  return `${entry.startDate} — ${entry.endDate}`
}
</script>

<template>
  <section id="experience" class="px-6 py-24 md:py-32">
    <div class="mx-auto max-w-5xl">
      <header class="mb-16">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Experience
        </p>
        <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
          15+ years building software
        </h2>
        <p class="mt-3 max-w-xl text-[--color-ink-muted]">
          Healthtech, pharma, finance, logistics, and CRM.
        </p>
      </header>

      <ol class="relative ml-3 border-l border-[--color-border] pl-8 md:ml-6 md:pl-10">
        <li
          v-for="(entry, i) in experience"
          :key="`${entry.company}-${i}`"
          class="relative mb-10 last:mb-0"
        >
          <span
            aria-hidden="true"
            class="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-[--color-accent] md:-left-[45px]"
          />
          <p class="text-xs font-medium uppercase tracking-[0.16em] text-[--color-accent] mb-2">
            {{ formatRange(entry) }}
          </p>
          <article class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6">
            <h3 class="text-lg font-semibold text-[--color-ink]">
              {{ entry.role }}
            </h3>
            <p class="text-sm font-medium text-[--color-accent-2] mb-3">
              {{ entry.company }}<span v-if="entry.location"> · {{ entry.location }}</span>
            </p>
            <p class="text-sm leading-relaxed text-[--color-ink-muted]">
              {{ entry.summary }}
            </p>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
