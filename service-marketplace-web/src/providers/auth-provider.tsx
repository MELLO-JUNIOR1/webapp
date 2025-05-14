'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { supabase, getProfile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const AuthContext = createContext({})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setUserRole, setLoading } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getProfile(session.user.id).then(({ data }) => {
          setUserRole(data)
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await getProfile(session.user.id)
        setUserRole(data)
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext) 