import { create } from 'zustand'

interface UserState {
  address: `0x${string}` | undefined
  isConnected: boolean
  hasValidIdentity: boolean
  identityData: {
    countryCode: number
    accredited: number
    expiry: bigint
    kycHash: string
  } | null
  setAddress: (address: `0x${string}` | undefined) => void
  setConnected: (connected: boolean) => void
  setIdentityStatus: (hasValid: boolean) => void
  setIdentityData: (data: UserState['identityData']) => void
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  address: undefined,
  isConnected: false,
  hasValidIdentity: false,
  identityData: null,
  setAddress: (address) => set({ address }),
  setConnected: (isConnected) => set({ isConnected }),
  setIdentityStatus: (hasValidIdentity) => set({ hasValidIdentity }),
  setIdentityData: (identityData) => set({ identityData }),
  reset: () => set({
    address: undefined,
    isConnected: false,
    hasValidIdentity: false,
    identityData: null,
  }),
}))