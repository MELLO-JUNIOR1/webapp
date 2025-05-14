import { create } from 'zustand'
import { User } from 'firebase/auth'

interface UserRole {
  id: string
  role: 'customer' | 'worker'
  name: string
  email: string
  profileImage?: string
}

interface AuthStore {
  user: User | null
  userRole: UserRole | null
  loading: boolean
  setUser: (user: User | null) => void
  setUserRole: (role: UserRole | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userRole: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserRole: (userRole) => set({ userRole }),
  setLoading: (loading) => set({ loading }),
}))

interface RequestStore {
  requests: any[]
  activeRequest: any | null
  loading: boolean
  setRequests: (requests: any[]) => void
  setActiveRequest: (request: any | null) => void
  setLoading: (loading: boolean) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  activeRequest: null,
  loading: false,
  setRequests: (requests) => set({ requests }),
  setActiveRequest: (activeRequest) => set({ activeRequest }),
  setLoading: (loading) => set({ loading }),
})) 