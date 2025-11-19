'use client'

import { useAccount } from 'wagmi'
import { Badge } from '@/components/ui/badge'
import { useIdentityStatus, useIdentityEvents } from '@/lib/identity'
import { useUserStore } from '@/lib/state/useUserStore'
import { useEffect } from 'react'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

export function IdentityStatus() {
  const { address } = useAccount()
  const { data: hasValidIdentity, isLoading } = useIdentityStatus(address)
  const { setIdentityStatus } = useUserStore()
  
  useIdentityEvents()

  useEffect(() => {
    if (hasValidIdentity !== undefined) {
      setIdentityStatus(hasValidIdentity)
    }
  }, [hasValidIdentity, setIdentityStatus])

  if (!address) return null

  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline">Checking KYC...</span>
      </Badge>
    )
  }

  return (
    <Badge 
      variant={hasValidIdentity ? "success" : "destructive"}
      className={`flex items-center space-x-1 ${
        hasValidIdentity 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-red-100 text-red-800 border-red-200'
      }`}
    >
      {hasValidIdentity ? (
        <Shield className="w-3 h-3" />
      ) : (
        <AlertTriangle className="w-3 h-3" />
      )}
      <span className="hidden sm:inline">
        {hasValidIdentity ? "KYC Verified" : "KYC Required"}
      </span>
    </Badge>
  )
}