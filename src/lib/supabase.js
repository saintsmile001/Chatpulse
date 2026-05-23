/**
 * ChatPulse - Supabase Client Layer
 *
 * Two types of clients:
 * 1. platformSupabase - connects to OUR Supabase (auth, orgs, data_sources, mappings)
 * 2. createCustomerClient() - factory that creates a client for the USER's Supabase
 */

import { createClient } from '@supabase/supabase-js'

// Platform Client (ours)
const platformUrl = import.meta.env.VITE_PLATFORM_SUPABASE_URL
const platformKey = import.meta.env.VITE_PLATFORM_SUPABASE_ANON_KEY

if (!platformUrl || !platformKey) {
  console.error(
    'Missing platform Supabase environment variables. Set VITE_PLATFORM_SUPABASE_URL and VITE_PLATFORM_SUPABASE_ANON_KEY in your .env file.'
  )
}

export const platformSupabase = createClient(platformUrl, platformKey)

// Customer Client Factory
// Cache customer clients to avoid recreating them on every render
const clientCache = new Map()

/**
 * Create (or retrieve cached) a Supabase client for a customer's project.
 * @param {string} projectUrl - The customer's Supabase project URL
 * @param {string} anonKey - The customer's Supabase anon key
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createCustomerClient(projectUrl, anonKey) {
  const cacheKey = `${projectUrl}::${anonKey}`

  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)
  }

  const client = createClient(projectUrl, anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })

  clientCache.set(cacheKey, client)
  return client
}

/**
 * Clear a cached customer client (e.g., when user disconnects or updates credentials).
 */
export function clearCustomerClient(projectUrl, anonKey) {
  const cacheKey = `${projectUrl}::${anonKey}`
  clientCache.delete(cacheKey)
}
