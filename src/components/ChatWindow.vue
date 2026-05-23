<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden theme-transition">
    <!-- No Chat Selected State -->
    <div v-if="!activePhone" class="flex-1 flex flex-col items-center justify-center bg-wa-chat-bg">
      <div class="text-center max-w-md px-6">
        <div class="w-20 h-20 mx-auto rounded-full bg-wa-hover flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-wa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-wa-text mb-2">ChatPulse Dashboard</h2>
        <p class="text-sm text-wa-text-secondary leading-relaxed">
          Select a conversation from the sidebar to view the chat history.
          Messages are streamed in real-time from your Supabase.
        </p>
      </div>
    </div>

    <!-- Chat Messages -->
    <div v-else class="flex-1 flex flex-col overflow-hidden bg-wa-chat-bg relative">
      <!-- Chat BG Pattern -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4='); background-repeat: repeat;"></div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex-1 flex items-center justify-center relative z-10">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-wa-green border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm text-wa-text-secondary">Loading messages...</span>
        </div>
      </div>

      <!-- Messages Area -->
      <div
        v-else
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-8 sm:px-16 md:px-24 lg:px-32 py-6 flex flex-col gap-2 relative z-10"
      >
        <!-- Date Separator -->
        <div class="flex justify-center mb-4">
          <button
            v-if="hasMoreMessages"
            @click="$emit('load-older')"
            :disabled="loadingMoreMessages"
            class="bg-wa-hover hover:bg-wa-active text-wa-text-secondary hover:text-wa-text text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm transition-colors disabled:opacity-60"
          >
            {{ loadingMoreMessages ? 'Loading older messages...' : 'Load older messages' }}
          </button>
          <span v-else class="bg-wa-hover text-wa-text-secondary text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm">
            Conversation History
          </span>
        </div>

        <!-- Message Bubbles -->
        <div
          v-for="(msg, index) in messages"
          :key="msg.id || index"
          :class="[
            'flex w-full animate-fade-in',
            isOutgoing(msg) ? 'justify-end' : 'justify-start'
          ]"
          :style="{ animationDelay: `${Math.min(index * 30, 300)}ms` }"
        >
          <div
            :class="[
              'relative max-w-[75%] md:max-w-[65%] rounded-lg px-[16px] py-[10px] shadow-sm',
              isOutgoing(msg)
                ? 'bg-wa-outgoing bubble-outgoing mr-2'
                : 'bg-wa-incoming bubble-incoming ml-2'
            ]"
          >
            <!-- Sender Label -->
            <div
              v-if="isOutgoing(msg)"
              class="text-[11px] font-semibold mb-0.5"
              :class="msg.sender_type === 'bot' ? 'text-sky-400' : 'text-emerald-400'"
            >
              {{ msg.sender_type === 'bot' ? 'AI Bot' : 'Agent' }}
            </div>

            <!-- Message Body -->
            <p class="text-[14.5px] text-wa-text leading-snug whitespace-pre-wrap break-words mt-0.5">{{ msg.message_text }}</p>

            <!-- Timestamp -->
            <div class="flex items-center justify-end gap-1 mt-1">
              <span class="text-[10px] text-wa-text-secondary">
                {{ formatTime(msg.created_at) }}
              </span>
              <svg v-if="isOutgoing(msg)" class="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Empty Messages State -->
        <div v-if="messages.length === 0 && !loading" class="flex-1 flex items-center justify-center">
          <p class="text-sm text-wa-text-secondary">No messages yet for this contact.</p>
        </div>
      </div>

      <!-- Input Bar (Only shown when not loading) -->
      <div v-if="!loading" class="px-4 py-3 bg-wa-panel border-t border-wa-border flex items-center gap-3 relative z-20">
        <input
          v-model="newMessage"
          @keydown.enter.prevent="sendMessage"
          type="text"
          placeholder="Type a message to reply..."
          class="flex-1 bg-wa-dark text-wa-text text-[15px] placeholder-wa-text-secondary outline-none border border-wa-border rounded-lg px-4 py-2.5 focus:border-wa-green transition-colors"
          :disabled="sending"
        />
        <button
          @click="sendMessage"
          :disabled="sending || !newMessage.trim()"
          class="w-10 h-10 rounded-full bg-wa-green hover:bg-wa-green-hover text-white flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md shadow-wa-green/10"
        >
          <svg v-if="!sending" class="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, inject } from 'vue'

const props = defineProps({
  activePhone: {
    type: String,
    default: null
  },
  messages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMoreMessages: {
    type: Boolean,
    default: false
  },
  loadingMoreMessages: {
    type: Boolean,
    default: false
  }
})

defineEmits(['load-older'])

const getCustomerClient = inject('getCustomerClient', () => null)
const getMapping = inject('getMapping', () => null)

const messagesContainer = ref(null)
const newMessage = ref('')
const sending = ref(false)

// Auto-scroll to bottom when messages change
watch(
  () => props.messages.length,
  async () => {
    if (props.loadingMoreMessages) return
    await nextTick()
    scrollToBottom()
  }
)

watch(
  () => props.activePhone,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return

  const client = getCustomerClient()
  const mapping = getMapping()
  if (!client || !mapping) return

  sending.value = true
  try {
    const contactName = props.messages.find(m => m.customer_name)?.customer_name || ''

    const payload = {
      [mapping.phoneColumn]: props.activePhone,
      [mapping.messageColumn]: text,
      [mapping.senderColumn]: 'human',
    }

    if (mapping.nameColumn && contactName) {
      payload[mapping.nameColumn] = contactName
    }

    const { error } = await client
      .from(mapping.tableName)
      .insert(payload)

    if (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message: ' + error.message)
    } else {
      newMessage.value = ''
    }
  } catch (err) {
    console.error('Failed to send message:', err)
    alert('Failed to send message: ' + err.message)
  } finally {
    sending.value = false
  }
}

function isOutgoing(msg) {
  return msg.sender_type === 'bot' || msg.sender_type === 'human'
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}
</script>
