<template>
  <div class="h-screen w-screen flex flex-col bg-wa-dark theme-transition overflow-hidden">
    <AppNavbar :isDark="isDark" @toggle-theme="toggleTheme" />

    <!-- Loading -->
    <div v-if="loadingContacts && !connectionError" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-2 border-wa-green border-t-transparent rounded-full animate-spin"></div>
        <span class="text-wa-text-secondary text-sm">Loading your dashboard...</span>
      </div>
    </div>

    <!-- Connection Error -->
    <div v-else-if="connectionError" class="flex-1 flex items-center justify-center">
      <div class="text-center max-w-md px-6">
        <div class="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
        </div>
        <p class="text-wa-danger text-lg font-medium mb-2">Connection Error</p>
        <p class="text-wa-text-secondary text-sm mb-6">{{ connectionError }}</p>
        <router-link to="/setup" class="btn-primary">Reconfigure Connection</router-link>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="flex-1 flex overflow-hidden">
      <ContactSidebar
        :class="[activePhone ? 'hidden md:flex' : 'flex', 'w-full md:w-[35%] lg:w-[30%] min-w-[320px] max-w-[420px] border-r border-wa-border bg-wa-sidebar relative z-10']"
        :contacts="contactList"
        :activePhone="activePhone"
        :loading="loadingContacts"
        @select="selectContact"
      />
      <div :class="['flex-1 flex-col h-full overflow-hidden bg-wa-chat-bg relative z-0', !activePhone ? 'hidden md:flex' : 'flex w-full']">
        <ControlHeader :activePhone="activePhone" @back="activePhone = null" />
        <ChatWindow
          :activePhone="activePhone"
          :messages="activeMessages"
          :loading="loadingMessages"
          :has-more-messages="hasMoreMessages"
          :loading-more-messages="loadingMoreMessages"
          @load-older="loadOlderMessages"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { useAuth } from '../lib/auth.js'
import { getOrCreateOrganization, loadFullConnection } from '../lib/connections.js'
import { createCustomerClient } from '../lib/supabase.js'
import AppNavbar from '../components/AppNavbar.vue'
import ContactSidebar from '../components/ContactSidebar.vue'
import ControlHeader from '../components/ControlHeader.vue'
import ChatWindow from '../components/ChatWindow.vue'

const { user } = useAuth()

// State
const activePhone = ref(null)
const allMessages = ref([])
const loadingContacts = ref(true)
const loadingMessages = ref(false)
const loadingMoreMessages = ref(false)
const hasMoreMessages = ref(false)
const connectionError = ref(null)
const connectionData = ref(null)
let customerClient = null
let realtimeChannel = null
let oldestLoadedTimestamp = null
const PAGE_SIZE = 500

// Theme
const isDark = ref(true)

function initTheme() {
  const saved = localStorage.getItem('wa-dashboard-theme')
  if (saved === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light')
  } else {
    isDark.value = true
    document.documentElement.classList.remove('light')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.remove('light')
    localStorage.setItem('wa-dashboard-theme', 'dark')
  } else {
    document.documentElement.classList.add('light')
    localStorage.setItem('wa-dashboard-theme', 'light')
  }
}

// Provide for child components
provide('getCustomerClient', () => customerClient)
provide('getMapping', () => connectionData.value?.mapping)

// Computed
const contactList = computed(() => {
  const phoneMap = new Map()

  for (const msg of allMessages.value) {
    const phone = msg.customer_phone || ''
    if (!phone) continue

    if (!phoneMap.has(phone)) {
      phoneMap.set(phone, {
        phone,
        name: msg.customer_name || '',
        leadStage: msg.lead_stage || 'cold',
        lastMessage: msg.message_text || '',
        lastTime: formatRelativeTime(msg.created_at),
        lastTimestamp: new Date(msg.created_at || 0).getTime(),
        unread: 0
      })
    } else {
      const existing = phoneMap.get(phone)
      const msgTime = new Date(msg.created_at || 0).getTime()
      if (msgTime > existing.lastTimestamp) {
        existing.lastMessage = msg.message_text || ''
        existing.lastTime = formatRelativeTime(msg.created_at)
        existing.lastTimestamp = msgTime
        if (msg.customer_name) existing.name = msg.customer_name
        if (msg.lead_stage) existing.leadStage = msg.lead_stage
      }
    }
  }

  return Array.from(phoneMap.values())
    .sort((a, b) => b.lastTimestamp - a.lastTimestamp)
})

const activeMessages = computed(() => {
  if (!activePhone.value) return []
  return allMessages.value
    .filter(msg => msg.customer_phone === activePhone.value)
    .sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime()
      const timeB = new Date(b.created_at || 0).getTime()
      return timeA - timeB
    })
})

// Lifecycle
onMounted(async () => {
  initTheme()
  await initDashboard()
})

onUnmounted(() => {
  if (realtimeChannel && customerClient) {
    customerClient.removeChannel(realtimeChannel)
  }
})

// Methods
async function initDashboard() {
  loadingContacts.value = true
  connectionError.value = null

  try {
    const org = await getOrCreateOrganization(user.value.id, user.value.email)
    if (!org) {
      connectionError.value = 'No organization found. Please complete setup.'
      return
    }

    const connection = await loadFullConnection(org.id)
    if (!connection || !connection.mapping) {
      connectionError.value = 'No connection configured. Please complete setup.'
      return
    }

    connectionData.value = connection
    customerClient = createCustomerClient(
      connection.dataSource.projectUrl,
      connection.dataSource.anonKey
    )

    await fetchAllMessages()
    subscribeToRealtime()
  } catch (err) {
    console.error('Dashboard init failed:', err)
    connectionError.value = err.message || 'Failed to initialize dashboard.'
  } finally {
    loadingContacts.value = false
  }
}

function normalizeRow(row) {
  const m = connectionData.value.mapping
  return {
    id: row.id,
    customer_phone: row[m.phoneColumn] || '',
    customer_name: row[m.nameColumn] || '',
    message_text: row[m.messageColumn] || '',
    sender_type: row[m.senderColumn] || '',
    lead_stage: m.leadStageColumn ? (row[m.leadStageColumn] || '') : '',
    created_at: row[m.timestampColumn] || ''
  }
}

async function resolveContactsAndNormalize(rows) {
  const m = connectionData.value?.mapping
  if (!rows || rows.length === 0 || !m) return []

  if (m.contactTableName && m.contactIdColumn && m.contactJoinColumn) {
    const contactIds = [...new Set(rows.map(msg => msg[m.contactIdColumn]).filter(Boolean))]
    let contactMap = new Map()

    if (contactIds.length > 0) {
      const { data: contacts, error } = await customerClient
        .from(m.contactTableName)
        .select(`${m.contactJoinColumn}, ${m.phoneColumn}, ${m.nameColumn}`)
        .in(m.contactJoinColumn, contactIds)

      if (error) {
        console.error('Failed to fetch contact details for join:', error)
      } else if (contacts) {
        contactMap = new Map(contacts.map(c => [c[m.contactJoinColumn], c]))
      }
    }

    return rows.map(row => {
      const contact = contactMap.get(row[m.contactIdColumn]) || {}
      return {
        id: row.id,
        customer_phone: contact[m.phoneColumn] || '',
        customer_name: contact[m.nameColumn] || '',
        message_text: row[m.messageColumn] || '',
        sender_type: row[m.senderColumn] || '',
        lead_stage: m.leadStageColumn ? (row[m.leadStageColumn] || '') : '',
        created_at: row[m.timestampColumn] || ''
      }
    })
  } else {
    return rows.map(normalizeRow)
  }
}

async function fetchAllMessages() {
  const m = connectionData.value.mapping
  try {
    const { data, error } = await customerClient
      .from(m.tableName)
      .select('*')
      .order(m.timestampColumn, { ascending: false })
      .range(0, PAGE_SIZE - 1)

    if (error) {
      console.error('Error fetching messages:', error)
      connectionError.value = `Failed to query table "${m.tableName}": ${error.message}`
      return
    }

    const rows = data || []
    const normalized = (await resolveContactsAndNormalize(rows)).reverse()
    allMessages.value = normalized
    hasMoreMessages.value = rows.length === PAGE_SIZE
    oldestLoadedTimestamp = normalized[0]?.created_at || null
  } catch (err) {
    console.error('Failed to fetch messages:', err)
    connectionError.value = err.message
  }
}

async function loadOlderMessages() {
  const m = connectionData.value?.mapping
  if (!m || !customerClient || !oldestLoadedTimestamp || loadingMoreMessages.value) return

  loadingMoreMessages.value = true
  try {
    const { data, error } = await customerClient
      .from(m.tableName)
      .select('*')
      .lt(m.timestampColumn, oldestLoadedTimestamp)
      .order(m.timestampColumn, { ascending: false })
      .range(0, PAGE_SIZE - 1)

    if (error) {
      console.error('Error loading older messages:', error)
      connectionError.value = `Failed to load older messages: ${error.message}`
      return
    }

    const rows = data || []
    const olderMessages = (await resolveContactsAndNormalize(rows)).reverse()
    const existingIds = new Set(allMessages.value.map(msg => msg.id))
    const dedupedOlder = olderMessages.filter(msg => !existingIds.has(msg.id))

    allMessages.value = [...dedupedOlder, ...allMessages.value]
    hasMoreMessages.value = rows.length === PAGE_SIZE
    oldestLoadedTimestamp = allMessages.value[0]?.created_at || oldestLoadedTimestamp
  } catch (err) {
    console.error('Failed to load older messages:', err)
    connectionError.value = err.message
  } finally {
    loadingMoreMessages.value = false
  }
}

function subscribeToRealtime() {
  const m = connectionData.value.mapping
  realtimeChannel = customerClient
    .channel('chatpulse-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: m.tableName },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          resolveContactsAndNormalize([payload.new]).then((normalizedList) => {
            const normalized = normalizedList[0]
            if (normalized) {
              const exists = allMessages.value.some(msg => msg.id === normalized.id)
              if (!exists) {
                allMessages.value.push(normalized)
              }
            }
          })
        } else if (payload.eventType === 'UPDATE') {
          resolveContactsAndNormalize([payload.new]).then((normalizedList) => {
            const normalized = normalizedList[0]
            if (normalized) {
              const index = allMessages.value.findIndex(msg => msg.id === normalized.id)
              if (index !== -1) {
                allMessages.value[index] = normalized
              } else {
                allMessages.value.push(normalized)
              }
            }
          })
        } else if (payload.eventType === 'DELETE') {
          const oldId = payload.old?.id
          if (oldId) {
            allMessages.value = allMessages.value.filter(msg => msg.id !== oldId)
          }
        }
      }
    )
    .subscribe((status) => {
      console.log('Realtime subscription status:', status)
    })
}

function selectContact(phone) {
  activePhone.value = phone
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return ''
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
</script>
