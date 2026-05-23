/**
 * ChatPulse - Connections Composable
 * CRUD operations for data_sources and message_mappings in the platform Supabase.
 * Handles encryption/decryption of Supabase keys.
 */

import { ref } from 'vue'
import { platformSupabase } from './supabase.js'
import { createCustomerClient } from './supabase.js'
import { encryptKey, decryptKey } from './crypto.js'

/**
 * Get or create the user's organization on the fly.
 */
export async function getOrCreateOrganization(userId, email = '') {
  const { data, error } = await platformSupabase
    .from('organizations')
    .select('*')
    .eq('owner_id', userId)
    .limit(1)

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch organization:', error)
  }

  if (data && data.length > 0) {
    return data[0]
  }

  // Create organization on the fly
  const name = email ? (email.split('@')[0] + "'s Organization") : 'My Organization'
  const { data: newOrg, error: createError } = await platformSupabase
    .from('organizations')
    .insert({
      name,
      owner_id: userId
    })
    .select()
    .single()

  if (createError) {
    console.error('Failed to create organization on the fly:', createError)
    return null
  }

  return newOrg
}

export async function getOrganization(userId) {
  return getOrCreateOrganization(userId)
}

/**
 * Save or update a data source (Supabase connection).
 */
export async function saveDataSource(orgId, { label, projectUrl, accessMode, anonKey }) {
  const encrypted = await encryptKey(anonKey)

  // Check if a data source already exists for this org
  const { data: existing } = await platformSupabase
    .from('data_sources')
    .select('id')
    .eq('organization_id', orgId)
    .limit(1)
    .single()

  if (existing) {
    // Update existing
    const { data, error } = await platformSupabase
      .from('data_sources')
      .update({
        label: label || 'My WhatsApp',
        project_url: projectUrl,
        access_mode: accessMode || 'anon',
        encrypted_key: encrypted,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } else {
    // Insert new
    const { data, error } = await platformSupabase
      .from('data_sources')
      .insert({
        organization_id: orgId,
        label: label || 'My WhatsApp',
        provider: 'supabase',
        project_url: projectUrl,
        access_mode: accessMode || 'anon',
        encrypted_key: encrypted
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}

/**
 * Save or update message mappings for a data source.
 */
export async function saveMessageMapping(dataSourceId, mapping) {
  // Check if mapping already exists
  const { data: existing } = await platformSupabase
    .from('message_mappings')
    .select('id')
    .eq('data_source_id', dataSourceId)
    .limit(1)
    .single()

  const payload = {
    data_source_id: dataSourceId,
    table_name: mapping.tableName || 'whatsapp_messages',
    phone_column: mapping.phoneColumn || 'customer_phone',
    name_column: mapping.nameColumn || 'customer_name',
    message_column: mapping.messageColumn || 'message_text',
    sender_column: mapping.senderColumn || 'sender_type',
    timestamp_column: mapping.timestampColumn || 'created_at',
    lead_stage_column: mapping.leadStageColumn || null,
    bot_status_table: mapping.botStatusTable || null,
    bot_status_column: mapping.botStatusColumn || null,
    contact_table_name: mapping.contactTableName || null,
    contact_id_column: mapping.contactIdColumn || null,
    contact_join_column: mapping.contactJoinColumn || null
  }

  if (existing) {
    const { data, error } = await platformSupabase
      .from('message_mappings')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } else {
    const { data, error } = await platformSupabase
      .from('message_mappings')
      .insert(payload)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}

/**
 * Load the full connection (data_source + mapping) for a user's org.
 * Returns null if no connection exists yet.
 */
export async function loadFullConnection(orgId) {
  const { data: dataSource, error: dsError } = await platformSupabase
    .from('data_sources')
    .select('*, message_mappings(*)')
    .eq('organization_id', orgId)
    .limit(1)
    .single()

  if (dsError || !dataSource) {
    return null
  }

  // Decrypt the key
  let decryptedKey = ''
  try {
    decryptedKey = await decryptKey(dataSource.encrypted_key)
  } catch (err) {
    console.error('Failed to decrypt key:', err)
    return null
  }

  const mapping = dataSource.message_mappings?.[0] || null

  return {
    dataSource: {
      id: dataSource.id,
      label: dataSource.label,
      projectUrl: dataSource.project_url,
      accessMode: dataSource.access_mode,
      anonKey: decryptedKey,
      createdAt: dataSource.created_at
    },
    mapping: mapping
      ? {
          id: mapping.id,
          tableName: mapping.table_name,
          phoneColumn: mapping.phone_column,
          nameColumn: mapping.name_column,
          messageColumn: mapping.message_column,
          senderColumn: mapping.sender_column,
          timestampColumn: mapping.timestamp_column,
          leadStageColumn: mapping.lead_stage_column,
          botStatusTable: mapping.bot_status_table,
          botStatusColumn: mapping.bot_status_column,
          contactTableName: mapping.contact_table_name,
          contactIdColumn: mapping.contact_id_column,
          contactJoinColumn: mapping.contact_join_column
        }
      : null
  }
}

/**
 * Delete a data source (cascades to mappings via FK).
 */
export async function deleteConnection(dataSourceId) {
  const { error } = await platformSupabase
    .from('data_sources')
    .delete()
    .eq('id', dataSourceId)

  if (error) throw new Error(error.message)
}

/**
 * Test a connection by querying the customer's Supabase table.
 * Returns { success, rowCount, error }.
 */
export async function testConnection(projectUrl, anonKey, tableName) {
  try {
    const client = createCustomerClient(projectUrl, anonKey)

    const { count, error } = await client
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    if (error) {
      return { success: false, rowCount: 0, error: error.message }
    }

    return { success: true, rowCount: count || 0, error: null }
  } catch (err) {
    return { success: false, rowCount: 0, error: err.message }
  }
}

/**
 * Composable hook for connection management.
 */
export function useConnection() {
  const connectionLoading = ref(false)
  const connectionError = ref(null)

  return {
    connectionLoading,
    connectionError,
    getOrganization,
    getOrCreateOrganization,
    saveDataSource,
    saveMessageMapping,
    loadFullConnection,
    deleteConnection,
    testConnection
  }
}
