import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  user_id: string
  full_name: string
  avatar_url?: string
  role: 'customer' | 'worker'
  created_at: string
}

export type ServiceRequest = {
  id: string
  title: string
  description: string
  budget: number
  status: 'open' | 'assigned' | 'completed'
  customer_id: string
  worker_id?: string
  created_at: string
}

// Helper functions for auth
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (
  email: string,
  password: string,
  fullName?: string,
  role?: 'customer' | 'worker'
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper functions for profiles
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
  return { data, error }
}

// Helper functions for service requests
export const createServiceRequest = async (request: Omit<ServiceRequest, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert(request)
    .select()
  return { data, error }
}

export const getServiceRequests = async (status?: ServiceRequest['status']) => {
  let query = supabase.from('service_requests').select('*')
  if (status) {
    query = query.eq('status', status)
  }
  const { data, error } = await query
  return { data, error }
}

export const updateServiceRequest = async (id: string, updates: Partial<ServiceRequest>) => {
  const { data, error } = await supabase
    .from('service_requests')
    .update(updates)
    .eq('id', id)
  return { data, error }
} 