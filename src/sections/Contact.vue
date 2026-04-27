<script setup lang="ts">
import { ref } from 'vue'

const embedFailed = ref(false)

</script>

<template>
  <section id="contact" class="px-6 py-24 md:py-32 bg-[--color-bg-sub]">
    <div class="mx-auto max-w-5xl">
      <header class="mb-10">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Contact
        </p>
        <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
          Let's talk.
        </h2>
        <p class="mt-3 max-w-xl text-[--color-ink-muted]">
          Open to senior backend and full-stack roles. Pick a slot below — or reach out on LinkedIn.
        </p>
      </header>

      <div
        v-if="!embedFailed"
        ref="calRef"
        class="rounded-2xl border border-[--color-border] bg-[--color-bg] overflow-hidden"
        style="min-height: 600px;"
      />
      <div v-else class="rounded-2xl border border-[--color-border] bg-[--color-bg] p-10 text-center">
        <a
          href="https://app.cal.com/gpweins/"
          target="_blank"
          rel="noreferrer noopener"
          class="inline-flex items-center justify-center rounded-full bg-[--color-ink] px-7 py-3 text-sm font-medium text-[--color-bg]"
        >
          Open Cal.com
        </a>
      </div>
    </div>
  </section>
</template>
