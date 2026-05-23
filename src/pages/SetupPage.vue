<template>
  <div class="min-h-screen bg-wa-dark overflow-y-auto py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Logo + Title -->
      <div class="text-center mb-10 animate-fade-up">
        <div class="flex items-center justify-center gap-2.5 mb-4">
          <div class="w-9 h-9 rounded-xl bg-wa-green flex items-center justify-center">
            <svg class="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              <circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="10" r="1.2"/><circle cx="16" cy="10" r="1.2"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-wa-text">ChatPulse</span>
        </div>
        <h1 class="text-2xl font-bold text-wa-text mb-1">Setup Your Connection</h1>
        <p class="text-sm text-wa-text-secondary">Connect your Supabase project in 3 easy steps</p>
      </div>

      <!-- Stepper -->
      <div class="flex items-center justify-center gap-0 mb-10 px-4">
        <div v-for="(s, i) in stepLabels" :key="i" class="flex items-center">
          <div class="flex flex-col items-center">
            <div :class="['stepper-circle', step > i + 1 ? 'completed' : step === i + 1 ? 'active' : 'upcoming']">
              <svg v-if="step > i + 1" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="text-[11px] text-wa-text-secondary mt-2 hidden sm:block">{{ s }}</span>
          </div>
          <div v-if="i < stepLabels.length - 1" :class="['stepper-line mx-3 min-w-[40px] sm:min-w-[60px]', step > i + 1 ? 'bg-wa-green' : 'bg-wa-border']"></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="glass-card p-6 sm:p-8">
        <!-- Step 1: Connect -->
        <div v-if="step === 1">
          <h2 class="text-xl font-semibold text-wa-text mb-2">Connect Your Supabase Project</h2>
          <p class="text-sm text-wa-text-secondary mb-6">Enter your Supabase project URL and API key. Find these in your Supabase dashboard under <strong class="text-wa-text">Settings - API</strong>.</p>

          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Label <span class="text-wa-text-secondary/50">(optional)</span></label>
              <input v-model="form.label" type="text" placeholder="e.g. Production Bot" class="form-input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Supabase Project URL <span class="text-wa-danger">*</span></label>
              <input v-model="form.projectUrl" type="url" required placeholder="https://your-project.supabase.co" class="form-input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Supabase Anon Key <span class="text-wa-danger">*</span></label>
              <textarea v-model="form.anonKey" required placeholder="eyJhbGciOi..." rows="3" class="form-input resize-none font-mono text-xs"></textarea>
            </div>
            <div>
              <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Access Mode</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.accessMode" value="anon" class="accent-wa-green" />
                  <span class="text-sm text-wa-text">Anon Key</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.accessMode" value="service_role" class="accent-wa-green" />
                  <span class="text-sm text-wa-text">Service Role Key</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mt-5 flex items-start gap-2 bg-sky-500/10 border border-sky-500/20 rounded-lg px-3 py-2.5">
            <svg class="w-4 h-4 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p class="text-xs text-sky-400">Go to <strong>app.supabase.com</strong> - Your Project - Settings - API - Copy the Project URL and anon key.</p>
          </div>
        </div>

        <!-- Step 2: Map Schema -->
        <div v-if="step === 2">
          <h2 class="text-xl font-semibold text-wa-text mb-2">Map Your Table Schema</h2>
          <p class="text-sm text-wa-text-secondary mb-6">Tell us where your WhatsApp messages are stored. We pre-filled common defaults - adjust to match your database.</p>

          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Messages Table Name <span class="text-wa-danger">*</span></label>
              <input v-model="form.tableName" type="text" required class="form-input" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Phone Column <span class="text-wa-danger">*</span></label>
                <input v-model="form.phoneColumn" type="text" required class="form-input" />
              </div>
              <div>
                <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Name Column <span class="text-wa-danger">*</span></label>
                <input v-model="form.nameColumn" type="text" required class="form-input" />
              </div>
              <div>
                <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Message Column <span class="text-wa-danger">*</span></label>
                <input v-model="form.messageColumn" type="text" required class="form-input" />
              </div>
              <div>
                <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Sender Column <span class="text-wa-danger">*</span></label>
                <input v-model="form.senderColumn" type="text" required class="form-input" />
              </div>
              <div>
                <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Timestamp Column <span class="text-wa-danger">*</span></label>
                <input v-model="form.timestampColumn" type="text" required class="form-input" />
              </div>
              <div>
                <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Lead Stage Column <span class="text-wa-text-secondary/50">(optional)</span></label>
                <input v-model="form.leadStageColumn" type="text" placeholder="e.g. lead_stage" class="form-input" />
              </div>
            </div>

            <div class="border-t border-wa-border pt-4 mt-2">
              <p class="text-xs font-medium text-wa-text-secondary mb-3">Bot Control <span class="text-wa-text-secondary/50">(optional)</span></p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Bot Status Table</label>
                  <input v-model="form.botStatusTable" type="text" placeholder="e.g. bot_status" class="form-input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Bot Status Column</label>
                  <input v-model="form.botStatusColumn" type="text" placeholder="e.g. is_active" class="form-input" />
                </div>
              </div>
            </div>

            <div class="border-t border-wa-border pt-4 mt-2">
              <button
                type="button"
                @click="showRelationalOptions = !showRelationalOptions"
                class="flex items-center justify-between w-full text-xs font-medium text-wa-text-secondary hover:text-wa-text transition-colors py-1 cursor-pointer"
              >
                <span>Relational / Two-Table Schema Options <span class="text-wa-text-secondary/50">(optional)</span></span>
                <svg
                  :class="['w-4 h-4 transition-transform duration-200', showRelationalOptions ? 'rotate-180' : '']"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="showRelationalOptions" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 animate-fade-in">
                <div>
                  <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Contact Table Name</label>
                  <input v-model="form.contactTableName" type="text" placeholder="e.g. contacts" class="form-input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Message Link Column</label>
                  <input v-model="form.contactIdColumn" type="text" placeholder="e.g. contact_id" class="form-input" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Contact Key Column</label>
                  <input v-model="form.contactJoinColumn" type="text" placeholder="e.g. id" class="form-input" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Test -->
        <div v-if="step === 3">
          <h2 class="text-xl font-semibold text-wa-text mb-2">Test Your Connection</h2>
          <p class="text-sm text-wa-text-secondary mb-6">Let's make sure everything works before saving.</p>

          <!-- Summary -->
          <div class="bg-wa-dark/50 rounded-lg p-4 mb-6">
            <h3 class="text-xs font-semibold text-wa-text-secondary uppercase tracking-wider mb-3">Connection Summary</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span class="text-wa-text-secondary">URL:</span> <span class="text-wa-text ml-1">{{ form.projectUrl?.substring(0, 35) }}{{ form.projectUrl?.length > 35 ? '...' : '' }}</span></div>
              <div><span class="text-wa-text-secondary">Table:</span> <span class="text-wa-text ml-1 font-mono text-xs">{{ form.tableName }}</span></div>
              <div><span class="text-wa-text-secondary">Phone:</span> <span class="text-wa-text ml-1 font-mono text-xs">{{ form.phoneColumn }}</span></div>
              <div><span class="text-wa-text-secondary">Message:</span> <span class="text-wa-text ml-1 font-mono text-xs">{{ form.messageColumn }}</span></div>
              <div><span class="text-wa-text-secondary">Sender:</span> <span class="text-wa-text ml-1 font-mono text-xs">{{ form.senderColumn }}</span></div>
              <div><span class="text-wa-text-secondary">Timestamp:</span> <span class="text-wa-text ml-1 font-mono text-xs">{{ form.timestampColumn }}</span></div>
            </div>
          </div>

          <!-- Test Button -->
          <div v-if="!testResult && !testing" class="text-center">
            <button @click="runTest" class="btn-primary !px-8">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Test Connection
            </button>
          </div>

          <!-- Testing -->
          <div v-if="testing" class="flex flex-col items-center gap-3 py-6">
            <div class="w-8 h-8 border-2 border-wa-green border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-wa-text-secondary">Testing connection...</span>
          </div>

          <!-- Test Result -->
          <div v-if="testResult && !testing">
            <div v-if="testResult.success" class="flex flex-col items-center gap-4 py-4">
              <div class="w-16 h-16 rounded-full bg-wa-green/10 flex items-center justify-center">
                <svg class="w-8 h-8 text-wa-green" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-wa-green">Connection Successful!</p>
                <p class="text-sm text-wa-text-secondary mt-1">Found <strong class="text-wa-text">{{ testResult.rowCount }}</strong> messages in your table.</p>
              </div>
            </div>
            <div v-else class="flex flex-col items-center gap-4 py-4">
              <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-red-400">Connection Failed</p>
                <p class="text-sm text-wa-text-secondary mt-1">{{ testResult.error }}</p>
              </div>
              <button @click="testResult = null" class="btn-ghost text-sm">Try Again</button>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="formError" class="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
          <svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm text-red-400">{{ formError }}</p>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-wa-border">
          <button v-if="step > 1" @click="step--" class="btn-ghost text-sm">Back</button>
          <div v-else></div>

          <button v-if="step < 3" @click="nextStep" class="btn-primary text-sm">
            Next
          </button>
          <button v-else-if="testResult?.success" @click="saveAndGo" :disabled="saving" class="btn-primary text-sm">
            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ saving ? 'Saving...' : 'Save & Go to Dashboard' }}
          </button>
        </div>
      </div>

      <!-- Back link -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-xs text-wa-text-secondary hover:text-wa-text transition-colors">Back to ChatPulse</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/auth.js'
import { getOrCreateOrganization, saveDataSource, saveMessageMapping, testConnection } from '../lib/connections.js'

const router = useRouter()
const { user } = useAuth()

const step = ref(1)
const testing = ref(false)
const saving = ref(false)
const formError = ref('')
const testResult = ref(null)
const showRelationalOptions = ref(false)

const stepLabels = ['Connect', 'Map Schema', 'Test']

const form = reactive({
  label: 'My WhatsApp',
  projectUrl: '',
  anonKey: '',
  accessMode: 'anon',
  tableName: 'whatsapp_messages',
  phoneColumn: 'customer_phone',
  nameColumn: 'customer_name',
  messageColumn: 'message_text',
  senderColumn: 'sender_type',
  timestampColumn: 'created_at',
  leadStageColumn: '',
  botStatusTable: '',
  botStatusColumn: '',
  contactTableName: '',
  contactIdColumn: '',
  contactJoinColumn: ''
})

onMounted(() => {
  const saved = localStorage.getItem('wa-dashboard-theme')
  if (saved === 'light') {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
})

function nextStep() {
  formError.value = ''

  if (step.value === 1) {
    if (!form.projectUrl || !form.anonKey) {
      formError.value = 'Project URL and Anon Key are required.'
      return
    }
    if (!form.projectUrl.startsWith('http')) {
      formError.value = 'Please enter a valid URL starting with https://'
      return
    }
  }

  if (step.value === 2) {
    if (!form.tableName || !form.phoneColumn || !form.messageColumn || !form.senderColumn || !form.timestampColumn) {
      formError.value = 'Please fill in all required fields.'
      return
    }
  }

  step.value++
}

async function runTest() {
  testing.value = true
  formError.value = ''
  testResult.value = null

  try {
    const result = await testConnection(form.projectUrl, form.anonKey, form.tableName)
    testResult.value = result
  } catch (err) {
    testResult.value = { success: false, error: err.message }
  } finally {
    testing.value = false
  }
}

async function saveAndGo() {
  saving.value = true
  formError.value = ''

  try {
    const org = await getOrCreateOrganization(user.value.id, user.value.email)
    if (!org) {
      formError.value = 'Organization not found. Please ensure SQL migration is run.'
      return
    }

    const ds = await saveDataSource(org.id, {
      label: form.label,
      projectUrl: form.projectUrl,
      accessMode: form.accessMode,
      anonKey: form.anonKey
    })

    await saveMessageMapping(ds.id, {
      tableName: form.tableName,
      phoneColumn: form.phoneColumn,
      nameColumn: form.nameColumn,
      messageColumn: form.messageColumn,
      senderColumn: form.senderColumn,
      timestampColumn: form.timestampColumn,
      leadStageColumn: form.leadStageColumn,
      botStatusTable: form.botStatusTable,
      botStatusColumn: form.botStatusColumn,
      contactTableName: form.contactTableName,
      contactIdColumn: form.contactIdColumn,
      contactJoinColumn: form.contactJoinColumn
    })

    router.push('/dashboard')
  } catch (err) {
    formError.value = err.message || 'Failed to save configuration.'
  } finally {
    saving.value = false
  }
}
</script>
