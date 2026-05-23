<template>
  <div class="auth-page bg-wa-dark relative overflow-hidden">
    <!-- Background orbs -->
    <div class="gradient-orb gradient-orb-1"></div>
    <div class="gradient-orb gradient-orb-2"></div>

    <!-- Auth Card -->
    <div class="auth-card glass-card relative z-10 animate-fade-up">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-2.5 mb-8">
        <div class="w-10 h-10 rounded-xl bg-wa-green flex items-center justify-center shadow-lg shadow-wa-green/20">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="10" r="1.2"/><circle cx="16" cy="10" r="1.2"/>
          </svg>
        </div>
        <span class="text-xl font-bold text-wa-text">ChatPulse</span>
      </div>

      <!-- Title -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-wa-text mb-1">{{ isLogin ? 'Welcome back' : 'Create your account' }}</h1>
        <p class="text-sm text-wa-text-secondary">{{ isLogin ? 'Sign in to your dashboard' : 'Start monitoring WhatsApp for free' }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Email -->
        <div>
          <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Email</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wa-text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <input v-model="email" type="email" required placeholder="you@example.com" class="form-input pl-10!" autocomplete="email" />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Password</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wa-text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required minlength="6" placeholder="........" class="form-input pl-10! pr-10!" autocomplete="current-password" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-wa-text-secondary hover:text-wa-text transition-colors cursor-pointer">
              <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div v-if="!isLogin">
          <label class="block text-xs font-medium text-wa-text-secondary mb-1.5">Confirm Password</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wa-text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" required minlength="6" placeholder="........" class="form-input pl-10!" autocomplete="new-password" />
          </div>
        </div>

        <!-- Error -->
        <div v-if="formError" class="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
          <svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm text-red-400">{{ formError }}</p>
        </div>

        <!-- Success -->
        <div v-if="successMessage" class="flex items-start gap-2 bg-wa-green/10 border border-wa-green/20 rounded-lg px-3 py-2.5">
          <svg class="w-4 h-4 text-wa-green shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <p class="text-sm text-wa-green">{{ successMessage }}</p>
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="submitting" class="btn-primary w-full py-3! mt-1">
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {{ submitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account') }}
        </button>
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-3 my-6">
        <div class="flex-1 h-px bg-wa-border"></div>
        <span class="text-xs text-wa-text-secondary">or</span>
        <div class="flex-1 h-px bg-wa-border"></div>
      </div>

      <!-- Switch mode -->
      <p class="text-center text-sm text-wa-text-secondary">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <router-link :to="isLogin ? '/signup' : '/login'" class="text-wa-green hover:text-wa-green-hover font-medium transition-colors ml-1">
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </router-link>
      </p>

      <div class="text-center mt-6">
        <router-link to="/" class="text-xs text-wa-text-secondary hover:text-wa-text transition-colors">Back to ChatPulse</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../lib/auth.js'

const route = useRoute()
const router = useRouter()
const { signIn, signUp } = useAuth()

onMounted(() => {
  const saved = localStorage.getItem('wa-dashboard-theme')
  if (saved === 'light') {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
})

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const formError = ref('')
const successMessage = ref('')

const isLogin = computed(() => route.name === 'Login' || route.path === '/login')

async function handleSubmit() {
  formError.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    formError.value = 'Please fill in all fields.'
    return
  }
  if (password.value.length < 6) {
    formError.value = 'Password must be at least 6 characters.'
    return
  }
  if (!isLogin.value && password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }

  submitting.value = true
  try {
    if (isLogin.value) {
      const result = await signIn(email.value, password.value)
      if (result.success) {
        router.push('/dashboard')
      } else {
        formError.value = result.error || 'Sign in failed. Please try again.'
      }
    } else {
      const result = await signUp(email.value, password.value)
      if (result.success) {
        if (result.session) {
          router.push('/setup')
        } else {
          successMessage.value = 'Account created! Check your email to confirm, then sign in.'
        }
      } else {
        formError.value = result.error || 'Sign up failed. Please try again.'
      }
    }
  } catch (err) {
    formError.value = err.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>
