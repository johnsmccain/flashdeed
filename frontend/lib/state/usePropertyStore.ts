import { create } from 'zustand'

interface Property {
  address: `0x${string}`
  name: string
  symbol: string
  totalSupply: bigint
  userBalance: bigint
  canTransfer: boolean
  transferReason: string
}

interface PropertyState {
  properties: Property[]
  loading: boolean
  setProperties: (properties: Property[]) => void
  updateProperty: (address: `0x${string}`, updates: Partial<Property>) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  loading: false,
  setProperties: (properties) => set({ properties }),
  updateProperty: (address, updates) => set((state) => ({
    properties: state.properties.map(prop => 
      prop.address === address ? { ...prop, ...updates } : prop
    )
  })),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ properties: [], loading: false }),
}))