<template>
  <header class="h-[56px] min-h-[56px] sticky top-0 z-50 bg-wa-panel border-b border-wa-border flex items-center justify-between px-4">
    <!-- Left: Logo -->
    <router-link to="/dashboard" class="flex items-center gap-2.5 group">
      <div class="w-8 h-8 rounded-lg bg-wa-green flex items-center justify-center group-hover:shadow-lg group-hover:shadow-wa-green/20 transition-all duration-300">
        <svg class="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <circle cx="8" cy="10" r="1.2"/>
          <circle cx="12" cy="10" r="1.2"/>
          <circle cx="16" cy="10" r="1.2"/>
        </svg>
      </div>
      <span class="text-wa-text font-semibold text-[15px] hidden sm:block">ChatPulse</span>
    </router-link>

    <!-- Right: Actions -->
    <div class="flex items-center gap-1.5">
      <!-- Theme Toggle -->
      <button
        @click="$emit('toggle-theme')"
        class="flex items-center justify-center w-9 h-9 rounded-lg text-wa-text-secondary hover:bg-wa-hover hover:text-wa-text transition-colors duration-200 cursor-pointer"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <svg v-if="isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <!-- Settings -->
      <router-link
        to="/settings"
        class="flex items-center justify-center w-9 h-9 rounded-lg text-wa-text-secondary hover:bg-wa-hover hover:text-wa-text transition-colors duration-200"
        title="Settings"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </router-link>

      <!-- User Dropdown -->
      <div class="relative" ref="dropdownContainer">
        <button
          @click="showDropdown = !showDropdown"
          class="flex items-center justify-center w-8 h-8 rounded-full bg-wa-green text-white text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-wa-green-hover hover:ring-offset-1 hover:ring-offset-wa-panel transition-all duration-200"
          :title="userEmail"
        >
          {{ userInitial }}
        </button>

        <transition name="dropdown">
          <div
            v-if="showDropdown"
            class="absolute right-0 top-full mt-2 min-w-[220px] bg-wa-panel border border-wa-border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-wa-border">
              <p class="text-xs text-wa-text-secondary">Signed in as</p>
              <p class="text-sm text-wa-text font-medium truncate mt-0.5">{{ userEmail }}</p>
            </div>
            <div class="py-1">
              <router-link
                to="/settings"
                @click="showDropdown = false"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-wa-text hover:bg-wa-hover transition-colors"
              >
                <svg class="w-4 h-4 text-wa-text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                </svg>
                Settings
              </router-link>
              <button
                @click="handleSignOut"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-wa-danger hover:bg-wa-hover transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../lib/auth.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  isDark: { type: Boolean, default: true }
})

defineEmits(['toggle-theme'])

const router = useRouter()
const { user, signOut } = useAuth()

const showDropdown = ref(false)
const dropdownContainer = ref(null)

const userEmail = computed(() => user.value?.email || '')
const userInitial = computed(() => {
  const email = userEmail.value
  return email ? email.charAt(0).toUpperCase() : '?'
})

function handleClickOutside(e) {
  if (dropdownContainer.value && !dropdownContainer.value.contains(e.target)) {
    showDropdown.value = false
  }
}

async function handleSignOut() {
  showDropdown.value = false
  await signOut()
  router.push('/')
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
