'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/utils'
import { useUserStore } from '@/lib/state/useUserStore'
import { useEffect } from 'react'
import { Wallet, LogOut } from 'lucide-react'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { setAddress, setConnected } = useUserStore()

  useEffect(() => {
    setAddress(address)
    setConnected(isConnected)
  }, [address, isConnected, setAddress, setConnected])

  if (isConnected && address) {
    return (
      <Button 
        variant="outline" 
        onClick={() => disconnect()}
        className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 transition-all"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="hidden sm:inline">{formatAddress(address)}</span>
        <LogOut className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button 
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </Button>
  )
}