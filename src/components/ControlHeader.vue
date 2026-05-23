<template>
  <header class="h-[64px] min-h-[64px] bg-wa-panel flex items-center justify-between px-5 theme-transition border-b border-wa-border shadow-sm z-10">
    <!-- Active Contact Info -->
    <div class="flex items-center gap-4 min-w-0">
      <button v-if="activePhone" class="md:hidden text-wa-text-secondary hover:bg-wa-hover p-1.5 -ml-2 rounded-full shrink-0 transition-colors" @click="$emit('back')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      
      <template v-if="activePhone">
        <div class="w-10 h-10 rounded-full bg-wa-green/20 flex items-center justify-center text-wa-green font-semibold text-sm shrink-0">
          {{ getInitials(activePhone) }}
        </div>
        
        <div class="min-w-0">
          <h2 class="text-[15px] font-medium text-wa-text truncate leading-tight">
            {{ formatPhone(activePhone) }}
          </h2>
          <p class="text-xs text-wa-text-secondary flex items-center gap-1.5 truncate mt-0.5">
            <span :class="['inline-block w-1.5 h-1.5 rounded-full shrink-0', isActive ? 'bg-wa-green pulse-dot' : 'bg-wa-danger']"></span>
            {{ isActive ? 'AI Agent is responding' : 'AI Agent paused' }}
          </p>
        </div>
      </template>
      
      <div v-else class="text-wa-text font-medium text-[15px]">ChatPulse Dashboard</div>
    </div>

    <!-- AI Toggle (Always visible) -->
    <div v-if="hasBotControl" class="flex items-center gap-3 shrink-0 ml-4">
      <div class="flex flex-col items-end mr-1 hidden sm:flex">
        <span class="text-[10px] font-semibold text-wa-text-secondary uppercase tracking-wider">AI Agent</span>
        <span
          :class="['text-xs font-semibold transition-colors duration-300', isActive ? 'text-wa-green' : 'text-wa-danger']"
        >
          {{ isActive ? 'Active' : 'Paused' }}
        </span>
      </div>
      <button
        @click="toggleStatus"
        :disabled="toggling"
        class="focus:outline-none disabled:opacity-50 cursor-pointer"
        :title="isActive ? 'Click to pause AI agent' : 'Click to activate AI agent'"
      >
        <div :class="['toggle-track', isActive ? 'active' : 'inactive']">
          <div :class="['toggle-knob', isActive ? 'active' : 'inactive']"></div>
        </div>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

const props = defineProps({
  activePhone: {
    type: String,
    default: null
  }
})

defineEmits(['back'])

// Injected from DashboardPage
const getCustomerClient = inject('getCustomerClient', () => null)
const getMapping = inject('getMapping', () => null)

const isActive = ref(true)
const toggling = ref(false)

const hasBotControl = computed(() => {
  const mapping = getMapping()
  return mapping && mapping.botStatusTable && mapping.botStatusColumn
})

onMounted(async () => {
  if (hasBotControl.value) {
    await fetchStatus()
  }
})

async function fetchStatus() {
  const client = getCustomerClient()
  const mapping = getMapping()
  if (!client || !mapping) return

  try {
    const { data, error } = await client
      .from(mapping.botStatusTable)
      .select(mapping.botStatusColumn)
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching bot status:', error)
      return
    }
    if (data) {
      isActive.value = data[mapping.botStatusColumn]
    }
  } catch (err) {
    console.error('Failed to fetch bot status:', err)
  }
}

async function toggleStatus() {
  const client = getCustomerClient()
  const mapping = getMapping()
  if (!client || !mapping) return

  toggling.value = true
  const newStatus = !isActive.value

  try {
    const { error } = await client
      .from(mapping.botStatusTable)
      .update({ [mapping.botStatusColumn]: newStatus })
      .eq('id', 1)

    if (error) {
      console.error('Error updating bot status:', error)
      return
    }

    isActive.value = newStatus
  } catch (err) {
    console.error('Failed to toggle bot status:', err)
  } finally {
    toggling.value = false
  }
}

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
</script>
