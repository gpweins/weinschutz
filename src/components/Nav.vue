<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const scrolled = ref(false)
const drawerOpen = ref(false)

const links = [
  { href: '/#hero', label: 'Home' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
]

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function closeDrawer() {
  drawerOpen.value = false
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors"
    :class="scrolled ? 'bg-[--color-bg]/85 backdrop-blur border-b border-[--color-border]' : 'bg-transparent'"
  >
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <RouterLink to="/" class="text-sm font-semibold tracking-tight text-[--color-ink]">
        Gustavo Weinschütz
      </RouterLink>

      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-sm text-[--color-ink-muted] hover:text-[--color-ink] transition-colors"
          >
            {{ link.label }}
          </a>
        </li>
        <li><ThemeToggle /></li>
      </ul>

      <div class="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          @click="drawerOpen = !drawerOpen"
          :aria-expanded="drawerOpen"
          aria-label="Toggle navigation"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[--color-border] text-[--color-ink]"
        >
          <svg v-if="!drawerOpen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </nav>

    <div
      v-if="drawerOpen"
      class="md:hidden border-t border-[--color-border] bg-[--color-bg]"
    >
      <ul class="flex flex-col gap-1 px-6 py-4">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            @click="closeDrawer"
            class="block py-2 text-sm text-[--color-ink-muted] hover:text-[--color-ink]"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>
