/**
 * ChatPulse - Vue Router
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../lib/auth.js'
import { getOrCreateOrganization, loadFullConnection } from '../lib/connections.js'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../pages/LandingPage.vue'),
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/AuthPage.vue'),
    meta: { public: true, guestOnly: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../pages/AuthPage.vue'),
    meta: { public: true, guestOnly: true }
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../pages/SetupPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/DashboardPage.vue'),
    meta: { requiresAuth: true, requiresConnection: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../pages/SettingsPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { user, loading } = useAuth()

  // Wait for auth to initialize
  if (loading.value) {
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (!loading.value) {
          clearInterval(check)
          resolve()
        }
      }, 50)
    })
  }

  const isAuthenticated = !!user.value

  // Guest-only routes (login/signup) - redirect authenticated users
  if (to.meta.guestOnly && isAuthenticated) {
    return next('/dashboard')
  }

  // Protected routes - redirect unauthenticated users
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Routes requiring a connection - check if user has set up their data source
  if (to.meta.requiresConnection && isAuthenticated) {
    try {
      const org = await getOrCreateOrganization(user.value.id, user.value.email)
      if (org) {
        const connection = await loadFullConnection(org.id)
        if (!connection || !connection.mapping) {
          return next('/setup')
        }
      } else {
        return next('/setup')
      }
    } catch (err) {
      console.error('Connection check failed:', err)
      return next('/setup')
    }
  }

  next()
})

export default router
