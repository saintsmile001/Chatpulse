<template>
  <div class="min-h-screen bg-wa-dark flex flex-col">
    <AppNavbar :isDark="isDark" @toggle-theme="toggleTheme" />

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
        <!-- Page Title -->
        <div>
          <h1 class="text-2xl font-bold text-wa-text">Settings</h1>
          <p class="text-sm text-wa-text-secondary mt-1">Manage your connection, schema mappings, and account.</p>
        </div>

        <!-- Connection Section -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-wa-green/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-wa-green" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
              </div>
              <h2 class="text-lg font-semibold text-wa-text">Supabase Connection</h2>
            </div>
            <span v-if="connection" class="inline-flex items-center gap-1.5 bg-wa-green/10 text-wa-green text-xs font-semibold px-3 py-1 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-wa-green pulse-dot"></span>
              Connected
            </span>
            <span v-else class="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
              Not Connected
            </span>
          </div>

          <div v-if="loadingConnection" class="flex items-center gap-2 py-8 justify-center">
            <div class="w-5 h-5 border-2 border-wa-green border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-wa-text-secondary">Loading...</span>
          </div>

          <div v-else-if="connection">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
              <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5">
                <span class="text-wa-text-secondary text-xs block mb-0.5">Label</span>
                <span class="text-wa-text">{{ connection.dataSource.label }}</span>
              </div>
              <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5">
                <span class="text-wa-text-secondary text-xs block mb-0.5">URL</span>
                <span class="text-wa-text font-mono text-xs">{{ connection.dataSource.projectUrl.substring(0, 30) }}...</span>
              </div>
              <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5">
                <span class="text-wa-text-secondary text-xs block mb-0.5">Access Mode</span>
                <span class="text-wa-text capitalize">{{ connection.dataSource.accessMode }}</span>
              </div>
              <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5">
                <span class="text-wa-text-secondary text-xs block mb-0.5">Messages Table</span>
                <span class="text-wa-text font-mono text-xs">{{ connection.mapping?.tableName }}</span>
              </div>
            </div>

            <!-- Column Mappings -->
            <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5 mb-5">
              <span class="text-wa-text-secondary text-xs block mb-2">Column Mappings</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
                <div><span class="text-wa-text-secondary">Phone:</span> <span class="text-wa-text font-mono">{{ connection.mapping?.phoneColumn }}</span></div>
                <div><span class="text-wa-text-secondary">Name:</span> <span class="text-wa-text font-mono">{{ connection.mapping?.nameColumn }}</span></div>
                <div><span class="text-wa-text-secondary">Message:</span> <span class="text-wa-text font-mono">{{ connection.mapping?.messageColumn }}</span></div>
                <div><span class="text-wa-text-secondary">Sender:</span> <span class="text-wa-text font-mono">{{ connection.mapping?.senderColumn }}</span></div>
                <div><span class="text-wa-text-secondary">Timestamp:</span> <span class="text-wa-text font-mono">{{ connection.mapping?.timestampColumn }}</span></div>
                <div><span class="text-wa-text-secondary">Lead Stage:</span> <span class="text-wa-text font-mono">{{ connection.mapping?.leadStageColumn || '-' }}</span></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-3">
              <button @click="runTest" :disabled="testingConnection" class="btn-primary text-sm">
                <svg v-if="testingConnection" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ testingConnection ? 'Testing...' : 'Test Connection' }}
              </button>
              <router-link to="/setup" class="btn-ghost text-sm">Edit Connection</router-link>
            </div>

            <!-- Test Result -->
            <div v-if="testResultMsg" :class="['mt-3 flex items-center gap-2 text-sm px-3 py-2 rounded-lg', testSuccess ? 'bg-wa-green/10 text-wa-green' : 'bg-red-500/10 text-red-400']">
              <svg v-if="testSuccess" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              {{ testResultMsg }}
            </div>
          </div>

          <div v-else class="text-center py-6">
            <p class="text-wa-text-secondary text-sm mb-4">No connection configured.</p>
            <router-link to="/setup" class="btn-primary text-sm">Setup Connection</router-link>
          </div>
        </div>

        <!-- Account Section -->
        <div class="glass-card p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <h2 class="text-lg font-semibold text-wa-text">Account</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
            <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5">
              <span class="text-wa-text-secondary text-xs block mb-0.5">Email</span>
              <span class="text-wa-text">{{ user?.email }}</span>
            </div>
            <div class="bg-wa-dark/40 rounded-lg px-3 py-2.5">
              <span class="text-wa-text-secondary text-xs block mb-0.5">Member Since</span>
              <span class="text-wa-text">{{ user?.created_at ? new Date(user.created_at).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) : '-' }}</span>
            </div>
          </div>

          <button @click="handleSignOut" class="btn-danger text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign Out
          </button>
        </div>

        <!-- Danger Zone -->
        <div class="glass-card p-6 border-red-500/30!">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            </div>
            <h2 class="text-lg font-semibold text-wa-text">Danger Zone</h2>
          </div>

          <div v-if="!showDeleteConfirm">
            <p class="text-sm text-wa-text-secondary mb-4">Permanently delete your Supabase connection and all saved mappings.</p>
            <button @click="showDeleteConfirm = true" class="btn-danger text-sm" :disabled="!connection">
              Delete Connection
            </button>
          </div>

          <div v-else class="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <p class="text-sm text-red-400 font-medium mb-1">Are you sure?</p>
            <p class="text-xs text-wa-text-secondary mb-4">This will remove your Supabase URL, key, and all column mappings. This action cannot be undone.</p>
            <div class="flex gap-3">
              <button @click="showDeleteConfirm = false" class="btn-ghost text-sm">Cancel</button>
              <button @click="handleDelete" :disabled="deleting" class="btn-danger text-sm bg-red-500/20!">
                {{ deleting ? 'Deleting...' : 'Yes, Delete Connection' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/auth.js'
import { getOrCreateOrganization, loadFullConnection, deleteConnection, testConnection } from '../lib/connections.js'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const { user, signOut } = useAuth()

const connection = ref(null)
const loadingConnection = ref(true)
const testingConnection = ref(false)
const testResultMsg = ref('')
const testSuccess = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)

const isDark = ref(true)

function initTheme() {
  const saved = localStorage.getItem('wa-dashboard-theme')
  if (saved === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light')
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

onMounted(async () => {
  initTheme()
  await loadConnection()
})

async function loadConnection() {
  loadingConnection.value = true
  try {
    const org = await getOrCreateOrganization(user.value.id, user.value.email)
    if (org) {
      connection.value = await loadFullConnection(org.id)
    }
  } catch (err) {
    console.error('Failed to load connection:', err)
  } finally {
    loadingConnection.value = false
  }
}

async function runTest() {
  if (!connection.value) return
  testingConnection.value = true
  testResultMsg.value = ''

  try {
    const result = await testConnection(
      connection.value.dataSource.projectUrl,
      connection.value.dataSource.anonKey,
      connection.value.mapping.tableName
    )
    testSuccess.value = result.success
    testResultMsg.value = result.success
      ? `Connection successful! Found ${result.rowCount} messages.`
      : `Connection failed: ${result.error}`
  } catch (err) {
    testSuccess.value = false
    testResultMsg.value = err.message
  } finally {
    testingConnection.value = false
  }
}

async function handleSignOut() {
  await signOut()
  router.push('/')
}

async function handleDelete() {
  if (!connection.value) return
  deleting.value = true
  try {
    await deleteConnection(connection.value.dataSource.id)
    connection.value = null
    showDeleteConfirm.value = false
    router.push('/setup')
  } catch (err) {
    console.error('Failed to delete connection:', err)
  } finally {
    deleting.value = false
  }
}
</script>
