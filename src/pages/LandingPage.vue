<template>
  <div class="min-h-screen bg-wa-dark text-wa-text overflow-x-hidden relative">
    <!-- Background accents -->
    <div class="gradient-orb gradient-orb-1"></div>
    <div class="gradient-orb gradient-orb-2"></div>
    <div class="gradient-orb gradient-orb-3"></div>

    <!-- Navbar -->
    <nav class="landing-nav fixed top-0 left-0 w-full z-50 border-b border-wa-border/50 bg-wa-dark/90 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-wa-green flex items-center justify-center">
            <svg class="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              <circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="10" r="1.2"/><circle cx="16" cy="10" r="1.2"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-wa-text">ChatPulse</span>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-sm text-wa-text-secondary hover:text-wa-text transition-colors">Features</a>
          <a href="#how-it-works" class="text-sm text-wa-text-secondary hover:text-wa-text transition-colors">How It Works</a>
          <a href="#pricing" class="text-sm text-wa-text-secondary hover:text-wa-text transition-colors">Pricing</a>
        </div>

        <div class="hidden md:flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="flex items-center justify-center w-9 h-9 rounded-lg text-wa-text-secondary hover:bg-wa-hover hover:text-wa-text transition-colors duration-200 cursor-pointer mr-1"
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
          <router-link to="/login" class="btn-ghost text-sm py-2! px-4!">Login</router-link>
          <router-link to="/signup" class="btn-primary text-sm py-2! px-4!">Get Started Free</router-link>
        </div>

        <!-- Mobile Hamburger -->
        <button @click="mobileMenu = !mobileMenu" class="md:hidden text-wa-text-secondary hover:text-wa-text p-2 cursor-pointer">
          <svg v-if="!mobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="dropdown">
        <div v-if="mobileMenu" class="md:hidden border-t border-wa-border bg-wa-dark/95 backdrop-blur-xl">
          <div class="px-4 py-4 flex flex-col gap-3">
            <a href="#features" @click="mobileMenu = false" class="text-sm text-wa-text-secondary hover:text-wa-text py-2">Features</a>
            <a href="#how-it-works" @click="mobileMenu = false" class="text-sm text-wa-text-secondary hover:text-wa-text py-2">How It Works</a>
            <a href="#pricing" @click="mobileMenu = false" class="text-sm text-wa-text-secondary hover:text-wa-text py-2">Pricing</a>
            <div class="flex gap-3 pt-2">
              <router-link to="/login" class="btn-ghost text-sm flex-1 text-center">Login</router-link>
              <router-link to="/signup" class="btn-primary text-sm flex-1 text-center">Get Started</router-link>
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <section class="landing-hero relative px-4">
      <div class="landing-hero-inner mx-auto text-center">
        <div class="animate-fade-up">
          <div class="inline-flex items-center gap-2 bg-wa-green/10 border border-wa-green/20 rounded-full px-4 py-1.5 mb-6">
            <span class="w-2 h-2 rounded-full bg-wa-green animate-pulse"></span>
            <span class="text-xs font-medium text-wa-green-hover">Now in Public Beta - Free for Everyone</span>
          </div>
          <h1 class="hero-title font-bold leading-tight mb-6">
            Your WhatsApp Inbox,<br>
            <span class="gradient-text">Supercharged.</span>
          </h1>
          <p class="text-lg md:text-xl text-wa-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect your Supabase project and monitor every WhatsApp conversation in real-time. 
            AI agent controls, lead tracking, and a beautiful interface - all in one place.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link to="/signup" class="btn-primary text-base px-8! py-3! shadow-lg shadow-wa-green/20">
              Get Started Free
            </router-link>
            <a href="#how-it-works" class="btn-ghost text-base px-8! py-3!">
              See How It Works
            </a>
          </div>
        </div>

        <!-- Dashboard Mockup -->
        <div class="hero-mockup-wrap relative animate-fade-up" style="animation-delay: 0.3s">
          <div class="relative mx-auto max-w-4xl rounded-xl border border-wa-border overflow-hidden shadow-2xl shadow-black/40">
            <div class="bg-wa-panel h-10 flex items-center gap-2 px-4 border-b border-wa-border">
              <div class="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span class="ml-3 text-xs text-wa-text-secondary">ChatPulse Dashboard</span>
            </div>
            <div class="bg-wa-dark flex h-[300px] md:h-[400px]">
              <!-- Fake Sidebar -->
              <div class="w-[35%] border-r border-wa-border bg-wa-sidebar p-3 hidden sm:block">
                <div class="bg-wa-search-bg rounded-lg h-8 mb-3"></div>
                <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-2.5 rounded-lg mb-1" :class="i === 1 ? 'bg-wa-active' : ''">
                  <div class="w-10 h-10 rounded-full shrink-0" :class="i === 1 ? 'bg-wa-green' : 'bg-wa-hover'"></div>
                  <div class="flex-1 min-w-0">
                    <div class="h-3 rounded bg-wa-hover mb-1.5" :style="{ width: (60 + i * 8) + '%' }"></div>
                    <div class="h-2.5 rounded bg-wa-hover/60" :style="{ width: (40 + i * 12) + '%' }"></div>
                  </div>
                </div>
              </div>
              <!-- Fake Chat Area -->
              <div class="flex-1 flex flex-col p-4 sm:p-6">
                <div class="flex items-center gap-3 pb-3 border-b border-wa-border mb-4">
                  <div class="w-8 h-8 rounded-full bg-wa-green/20"></div>
                  <div>
                    <div class="h-3 w-24 rounded bg-wa-hover mb-1"></div>
                    <div class="h-2 w-16 rounded bg-wa-hover/50"></div>
                  </div>
                </div>
                <div class="flex-1 flex flex-col gap-3 justify-end">
                  <div class="self-start bg-wa-incoming rounded-lg px-4 py-2.5 max-w-[70%]">
                    <p class="text-sm text-wa-text">Hi! I'm interested in your product</p>
                    <span class="text-[10px] text-wa-text-secondary mt-1 block text-right">2:34 PM</span>
                  </div>
                  <div class="self-end bg-wa-outgoing rounded-lg px-4 py-2.5 max-w-[70%]">
                    <p class="text-[11px] text-sky-400 font-semibold mb-0.5">AI Bot</p>
                    <p class="text-sm text-wa-text">Thanks for reaching out! I'd love to help. What are you looking for?</p>
                    <span class="text-[10px] text-wa-text-secondary mt-1 block text-right">2:34 PM</span>
                  </div>
                  <div class="self-start bg-wa-incoming rounded-lg px-4 py-2.5 max-w-[70%]">
                    <p class="text-sm text-wa-text">Can you send me the pricing?</p>
                    <span class="text-[10px] text-wa-text-secondary mt-1 block text-right">2:35 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Glow effect -->
          <div class="absolute -inset-4 bg-gradient-to-r from-wa-green/5 via-transparent to-cyan-500/5 rounded-2xl -z-10 blur-xl"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 md:py-28 px-4 relative">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 reveal" ref="featuresTitle">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage<br>WhatsApp at scale</h2>
          <p class="text-wa-text-secondary text-lg max-w-xl mx-auto">Powerful features designed for teams who want complete visibility into their WhatsApp communications.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="(feature, i) in features" :key="i" class="glass-card p-6 hover:border-wa-green/30 transition-all duration-300 group reveal" :ref="el => featureCards[i] = el">
            <div class="w-11 h-11 rounded-lg bg-wa-green/10 flex items-center justify-center mb-4 group-hover:bg-wa-green/20 group-hover:scale-110 transition-all duration-300">
              <div v-html="feature.icon" class="w-5 h-5 text-wa-green-hover"></div>
            </div>
            <h3 class="text-lg font-semibold mb-2 text-wa-text">{{ feature.title }}</h3>
            <p class="text-sm text-wa-text-secondary leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-20 md:py-28 px-4 relative">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16 reveal" ref="howTitle">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Up and running in <span class="gradient-text">3 minutes</span></h2>
          <p class="text-wa-text-secondary text-lg">No complex setup. No code changes. Just connect and go.</p>
        </div>

        <div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 reveal" ref="howSteps">
          <div v-for="(step, i) in steps" :key="i" class="flex-1 flex flex-col items-center text-center relative">
            <div class="w-16 h-16 rounded-full bg-wa-green flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-wa-green/20">
              {{ i + 1 }}
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-sm text-wa-text-secondary max-w-[220px]">{{ step.desc }}</p>
            <!-- Connector line -->
            <div v-if="i < steps.length - 1" class="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-wa-green to-wa-green/30"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-20 md:py-28 px-4 relative">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16 reveal" ref="pricingTitle">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p class="text-wa-text-secondary text-lg">Start free. Scale when you're ready.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 reveal" ref="pricingCards">
          <div v-for="(plan, i) in plans" :key="i"
            :class="['glass-card p-6 flex flex-col relative', plan.popular ? 'pricing-popular' : '']"
          >
            <!-- Beta Badge -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-wa-green text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
              Free During Beta
            </div>
            <div v-if="plan.popular" class="absolute -top-3 right-4 bg-amber-500 text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Popular
            </div>
            <div class="pt-4">
              <h3 class="text-xl font-bold mb-1">{{ plan.name }}</h3>
              <div class="flex items-baseline gap-1 mb-4">
                <span class="text-3xl font-bold gradient-text">{{ plan.price }}</span>
                <span v-if="plan.period" class="text-sm text-wa-text-secondary">{{ plan.period }}</span>
              </div>
              <ul class="flex flex-col gap-2.5 mb-8 flex-1">
                <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-start gap-2 text-sm text-wa-text-secondary">
                  <svg class="w-4 h-4 text-wa-green shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  {{ feat }}
                </li>
              </ul>
              <router-link to="/signup" :class="plan.popular ? 'btn-primary w-full' : 'btn-ghost w-full'">
                Get Started
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-wa-border py-12 px-4">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-wa-green flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
          <span class="text-sm font-semibold">ChatPulse</span>
        </div>
        <div class="flex items-center gap-6 text-sm text-wa-text-secondary">
          <a href="#features" class="hover:text-wa-text transition-colors">Features</a>
          <a href="#pricing" class="hover:text-wa-text transition-colors">Pricing</a>
          <router-link to="/login" class="hover:text-wa-text transition-colors">Login</router-link>
          <router-link to="/signup" class="hover:text-wa-text transition-colors">Sign Up</router-link>
        </div>
        <p class="text-xs text-wa-text-secondary">Built with Supabase - {{ new Date().getFullYear() }} ChatPulse</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const mobileMenu = ref(false)

const featuresTitle = ref(null)
const featureCards = reactive([])
const howTitle = ref(null)
const howSteps = ref(null)
const pricingTitle = ref(null)
const pricingCards = ref(null)

const features = [
  {
    title: 'Real-time Sync',
    desc: 'Messages stream in live via Supabase Realtime. No polling, no delays.',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
  },
  {
    title: 'Flexible Schema',
    desc: 'Map any table structure. Your column names, our beautiful interface.',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>'
  },
  {
    title: 'AI Bot Control',
    desc: 'Pause or activate your AI agent with a single toggle.',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>'
  },
  {
    title: 'Lead Tracking',
    desc: 'Visualize lead stages - hot, warm, cold, converted - at a glance.',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>'
  },
  {
    title: 'Dark & Light Mode',
    desc: 'Beautiful in any lighting. Switch themes instantly.',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>'
  },
  {
    title: 'Mobile Ready',
    desc: 'Fully responsive design that works on any device.',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'
  }
]

const steps = [
  { title: 'Sign Up', desc: 'Create your free account in seconds. No credit card required.' },
  { title: 'Connect Supabase', desc: 'Enter your project URL and map your table columns.' },
  { title: 'Monitor Chats', desc: 'See every conversation in real-time with a beautiful UI.' }
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    popular: false,
    features: ['1 data source', '1,000 messages/day', 'Real-time sync', 'Community support']
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    popular: true,
    features: ['5 data sources', 'Unlimited messages', 'Priority support', 'Custom branding', 'Advanced analytics']
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    popular: false,
    features: ['Unlimited data sources', 'Unlimited messages', 'Dedicated support', 'SSO & SAML', 'SLA guarantee', 'Custom integrations']
  }
]

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

// Scroll reveal with Intersection Observer
onMounted(() => {
  initTheme()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )

  const revealElements = document.querySelectorAll('.reveal')
  revealElements.forEach(el => observer.observe(el))
})
</script>
