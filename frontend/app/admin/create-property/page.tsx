'use client'

import { useAccount } from 'wagmi'
import { CreatePropertyForm } from '@/components/CreatePropertyForm'
import { usePropertyCreatedEvents } from '@/lib/factory'

export default function CreatePropertyPage() {
  const { isConnected } = useAccount()
  
  usePropertyCreatedEvents()

  if (!isConnected) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Create Property</h1>
        <p className="text-muted-foreground">Please connect your wallet to create properties</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Property</h1>
        <p className="text-muted-foreground">
          Create a new tokenized real estate property with ERC-3643 compliance
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <CreatePropertyForm />
      </div>
    </div>
  )
}