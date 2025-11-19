'use client'

import { useAccount } from 'wagmi'
import { useTokenBalance } from '@/lib/erc3643'
import { formatBalance } from '@/lib/utils'

interface TokenBalanceProps {
  tokenAddress: `0x${string}`
  className?: string
}

export function TokenBalance({ tokenAddress, className }: TokenBalanceProps) {
  const { address } = useAccount()
  const { data: balance, isLoading } = useTokenBalance(tokenAddress, address)

  if (isLoading) {
    return <span className={className}>Loading...</span>
  }

  if (!balance) {
    return <span className={className}>0</span>
  }

  return (
    <span className={className}>
      {formatBalance(balance)}
    </span>
  )
}