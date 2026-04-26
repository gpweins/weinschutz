<script setup lang="ts">
import { skills } from '@/data/skills'
</script>

<template>
  <section id="skills" class="px-6 py-24 md:py-32 bg-[--color-bg-sub]">
    <div class="mx-auto max-w-5xl">
      <header class="mb-12">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Skills
        </p>
        <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
          Tools I reach for
        </h2>
      </header>

      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(group, i) in skills"
          :key="group.name"
          v-motion-fade-visible-once
          :delay="i * 80"
        >
          <h3 class="text-xs font-medium uppercase tracking-[0.16em] text-[--color-accent-2] mb-4">
            {{ group.name }}
          </h3>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="chip in group.chips"
              :key="chip"
              class="rounded-full border border-[--color-border] bg-[--color-bg] px-3 py-1.5 text-xs text-[--color-ink]"
            >
              {{ chip }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
