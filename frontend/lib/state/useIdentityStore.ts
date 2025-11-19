import { create } from 'zustand'

interface IdentityState {
  isCheckingIdentity: boolean
  lastIdentityCheck: number
  setCheckingIdentity: (checking: boolean) => void
  setLastIdentityCheck: (timestamp: number) => void
  shouldRefreshIdentity: () => boolean
}

export const useIdentityStore = create<IdentityState>((set, get) => ({
  isCheckingIdentity: false,
  lastIdentityCheck: 0,
  setCheckingIdentity: (isCheckingIdentity) => set({ isCheckingIdentity }),
  setLastIdentityCheck: (lastIdentityCheck) => set({ lastIdentityCheck }),
  shouldRefreshIdentity: () => {
    const { lastIdentityCheck } = get()
    const now = Date.now()
    return now - lastIdentityCheck > 30000 // 30 seconds
  },
}))