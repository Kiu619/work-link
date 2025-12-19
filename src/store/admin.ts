import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TokenResponse } from '../types/admin'

interface AdminState {
    user: TokenResponse | null
    phoneNumber: string | null
    setUser: (user: TokenResponse, phoneNumber: string) => void
    logout: () => void
    isAuthenticated: () => boolean
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
            user: null,
            phoneNumber: null,
            setUser: (user: TokenResponse, phoneNumber: string) => set({ user, phoneNumber }),
            logout: () => set({ user: null, phoneNumber: null }),
            isAuthenticated: () => {
                const state = get()
                return state.user !== null && state.user.accessToken !== null
            },
        }),
        {
            name: 'admin-storage',
        }
    )
)
