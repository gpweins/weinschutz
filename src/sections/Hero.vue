<script setup lang="ts">
</script>

<template>
  <section id="hero" class="relative flex min-h-[calc(100vh-4rem)] items-center px-6">
    <div class="mx-auto w-full max-w-5xl">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-6">
        Senior Software Engineer
      </p>
      <h1 class="text-6xl md:text-8xl font-bold leading-[0.95] -tracking-[0.02em] text-[--color-ink] mb-8">
        Gustavo<br />Weinschütz
      </h1>
      <p class="max-w-xl text-lg text-[--color-ink-muted] leading-relaxed mb-10">
        I build web applications that are fast, scalable, and a pleasure to use.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <a
          href="https://app.cal.com/gpweins/"
          target="_blank"
          rel="noreferrer noopener"
          class="inline-flex items-center justify-center rounded-full bg-[--color-ink] px-7 py-3.5 text-sm font-medium text-[--color-bg] hover:opacity-90 transition-opacity"
        >
          Book a Call
        </a>
        <a
          href="/resume.pdf"
          download
          class="inline-flex items-center justify-center rounded-full border border-[--color-border] px-7 py-3.5 text-sm font-medium text-[--color-ink] hover:border-[--color-accent] transition-colors"
        >
          Download Resume
        </a>
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-[--color-ink-muted]">
      ↓ Scroll
    </div>
  </section>
</template>
