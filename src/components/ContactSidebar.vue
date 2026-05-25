<template>
  
  <aside class="flex flex-col bg-wa-sidebar theme-transition">
    <!-- Sidebar Header -->
    <div class="px-4 py-[14px] flex items-center gap-3 bg-wa-panel">
      <div class="w-10 h-10 rounded-full bg-wa-green flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.522-1.468A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.696-6.281-1.89l-.438-.292-3.092 1.003 1.024-3.042-.32-.468A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
        </svg>
      </div>
      <div class="hidden sm:block">
        <h1 class="text-base font-semibold text-wa-text leading-tight">Chats</h1>
        <p class="text-xs text-wa-text-secondary">{{ contacts.length }} conversations</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="p-2 border-b border-wa-border bg-wa-sidebar">
      <div class="flex items-center bg-wa-search-bg rounded-lg h-[35px] px-3 transition-colors duration-200">
        <svg class="w-4 h-4 text-wa-text-secondary shrink-0 mr-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search or start new chat"
          class="flex-1 bg-transparent text-wa-text text-[15px] placeholder-wa-text-secondary outline-none w-full"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="text-wa-text-secondary hover:text-wa-text transition-colors cursor-pointer shrink-0 ml-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Contact List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col gap-1 p-2">
        <div v-for="i in 8" :key="i" class="flex items-center gap-3 px-3 py-3 rounded-lg">
          <div class="w-12 h-12 rounded-full skeleton shrink-0"></div>
          <div class="flex-1 flex flex-col gap-2">
            <div class="skeleton h-4 w-32"></div>
            <div class="skeleton h-3 w-48"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContacts.length === 0" class="flex flex-col items-center justify-center h-full px-6 text-center">
        <div class="w-16 h-16 rounded-full bg-wa-hover flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-wa-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <p class="text-wa-text-secondary text-sm">
          {{ searchQuery ? 'No contacts match your search' : 'No conversations yet' }}
        </p>
      </div>

      <!-- Contact Items -->
      <div v-else class="flex flex-col gap-2 px-3 pt-3 pb-4">
        <button
          v-for="contact in filteredContacts"
          :key="contact.phone"
          @click="$emit('select', contact.phone)"
          :class="[
            'w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group cursor-pointer',
            activePhone === contact.phone
              ? 'bg-wa-active shadow-sm'
              : 'hover:bg-wa-hover'
          ]"
        >
          <!-- Avatar -->
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-base font-semibold transition-all duration-200',
              activePhone === contact.phone
                ? 'bg-wa-green text-white shadow-md'
                : 'bg-wa-hover text-wa-text-secondary group-hover:bg-wa-green/20 group-hover:text-wa-green'
            ]"
          >
            {{ contact.name ? contact.name.charAt(0).toUpperCase() : getInitials(contact.phone) }}
          </div>

          <!-- Contact Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-[15px] font-medium text-wa-text truncate">
                {{ contact.name || formatPhone(contact.phone) }}
              </span>
              <span class="text-[11px] text-wa-text-secondary shrink-0 ml-2">
                {{ contact.lastTime }}
              </span>
            </div>
            <div v-if="contact.name" class="text-[12px] text-wa-text-secondary truncate mt-[1px]">
              {{ formatPhone(contact.phone) }}
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-[13px] text-wa-text-secondary truncate pr-2">
                {{ contact.lastMessage }}
              </span>
              <span
                v-if="contact.leadStage"
                :class="[
                  'inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[10px] font-bold shrink-0 uppercase tracking-wide',
                  leadStageClass(contact.leadStage)
                ]"
              >
                {{ contact.leadStage }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  contacts: {
    type: Array,
    default: () => []
  },
  activePhone: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])

const searchQuery = ref('')

const filteredContacts = computed(() => {
  if (!searchQuery.value) return props.contacts
  const q = searchQuery.value.toLowerCase()
  return props.contacts.filter(c =>
    c.phone.toLowerCase().includes(q) ||
    (c.name && c.name.toLowerCase().includes(q))
  )
})

function getInitials(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.slice(-2)
}

function formatPhone(phone) {
  if (phone.startsWith('+')) return phone
  if (phone.length >= 10) {
    return `+${phone.slice(0, -10)} ${phone.slice(-10, -7)} ${phone.slice(-7, -4)} ${phone.slice(-4)}`
  }
  return phone
}

function leadStageClass(stage) {
  switch (stage) {
    case 'hot': return 'bg-red-500/20 text-red-400'
    case 'warm': return 'bg-amber-500/20 text-amber-400'
    case 'cold': return 'bg-sky-500/20 text-sky-400'
    case 'converted': return 'bg-emerald-500/20 text-emerald-400'
    default: return 'bg-wa-hover text-wa-text-secondary'
  }
}
</script>
