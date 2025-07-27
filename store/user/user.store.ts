import { create } from 'zustand'

interface UserState {
  id: string
  email: string
  name: string
  setUser: (user: Partial<UserState>) => void
}

export const useUserStore = create<UserState>()((set) => ({
  id: '',
  email: '',
  name: '',
  setUser: (user) => set((state) => ({ ...state, ...user })),
}))
