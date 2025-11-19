'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRedeemShares } from '@/lib/fractionalizer'
import { FRACTIONALIZER_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts'
import { parseUnits } from 'viem'
import { TokenBalance } from './TokenBalance'

interface RedemptionFormProps {
  propertyId: bigint
  tokenAddress: `0x${string}`
}

export function RedemptionForm({ propertyId, tokenAddress }: RedemptionFormProps) {
  const [shares, setShares] = useState('')
  const { writeContract, isPending } = useRedeemShares()

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shares) return

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.FRACTIONALIZER,
        abi: FRACTIONALIZER_ABI,
        functionName: 'redeemShares',
        args: [propertyId, parseUnits(shares, 18)],
      })
      
      setShares('')
    } catch (error) {
      console.error('Redemption failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redeem Shares</CardTitle>
        <CardDescription>
          Redeem your property shares for the underlying asset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Your Balance: </span>
          <TokenBalance tokenAddress={tokenAddress} className="font-mono" />
        </div>
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Shares to Redeem</label>
            <Input
              type="number"
              placeholder="0.0"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isPending || !shares} className="w-full">
            {isPending ? 'Redeeming...' : 'Redeem Shares'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}