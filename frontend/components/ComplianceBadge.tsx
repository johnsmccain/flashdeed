'use client'

import { Badge } from '@/components/ui/badge'
import { useCanTransfer } from '@/lib/compliance'
import { useAccount } from 'wagmi'

interface ComplianceBadgeProps {
  tokenAddress: `0x${string}`
  toAddress?: `0x${string}`
  amount?: bigint
}

export function ComplianceBadge({ tokenAddress, toAddress, amount }: ComplianceBadgeProps) {
  const { address } = useAccount()
  const { data: canTransferData, isLoading } = useCanTransfer(
    tokenAddress,
    address,
    toAddress || address,
    amount || 1n
  )

  if (isLoading) {
    return <Badge variant="outline">Checking...</Badge>
  }

  if (!canTransferData) {
    return <Badge variant="outline">Unknown</Badge>
  }

  const [allowed, reason] = canTransferData

  return (
    <Badge 
      variant={allowed ? "success" : "destructive"}
      title={reason || undefined}
    >
      {allowed ? "Transferable" : "Restricted"}
    </Badge>
  )
}