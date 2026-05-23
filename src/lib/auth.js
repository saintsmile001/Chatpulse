/**
 * ChatPulse - Auth Composable
 * Wraps Supabase Auth for reactive Vue state management.
 */

import { ref, readonly } from 'vue'
import { platformSupabase } from './supabase.js'

// Singleton reactive state
const user = ref(null)
const session = ref(null)
const loading = ref(true)
const error = ref(null)
let initialized = false

/**
 * Initialize the auth listener. Call once on app mount.
 */
export function initAuth() {
  if (initialized) return
  initialized = true

  // Get initial session
  platformSupabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    user.value = data.session?.user ?? null
    loading.value = false
  })

  // Listen for auth changes
  platformSupabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user ?? null
    loading.value = false
  })
}

/**
 * Sign up with email and password.
 * After signup, auto-creates an organization for the user.
 */
export async function signUp(email, password) {
  error.value = null
  loading.value = true

  try {
    const { data, error: authError } = await platformSupabase.auth.signUp({
      email,
      password
    })

    if (authError) {
      error.value = authError.message
      return { success: false, error: authError.message }
    }

    // Auto-create organization for new user
    if (data.user) {
      const { error: orgError } = await platformSupabase
        .from('organizations')
        .insert({
          name: email.split('@')[0] + "'s Organization",
          owner_id: data.user.id
        })

      if (orgError) {
        console.error('Failed to create organization:', orgError)
      }
    }

    return { success: true, user: data.user, session: data.session }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

/**
 * Sign in with email and password.
 */
export async function signIn(email, password) {
  error.value = null
  loading.value = true

  try {
    const { data, error: authError } = await platformSupabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      error.value = authError.message
      return { success: false, error: authError.message }
    }

    return { success: true, user: data.user, session: data.session }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  error.value = null
  const { error: signOutError } = await platformSupabase.auth.signOut()
  if (signOutError) {
    error.value = signOutError.message
  }
  user.value = null
  session.value = null
}

/**
 * Composable hook for auth state.
 */
export function useAuth() {
  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    error: readonly(error),
    signUp,
    signIn,
    signOut,
    initAuth
  }
}
