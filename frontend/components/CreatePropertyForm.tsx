'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateProperty } from '@/lib/factory'
import { PROPERTY_FACTORY_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts'
import { parseUnits } from 'viem'

export function CreatePropertyForm() {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [totalShares, setTotalShares] = useState('')
  const { writeContract, isPending } = useCreateProperty()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !symbol || !totalShares) return

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.PROPERTY_FACTORY,
        abi: PROPERTY_FACTORY_ABI,
        functionName: 'createProperty',
        args: [name, symbol, parseUnits(totalShares, 18)],
      })
      
      // Reset form
      setName('')
      setSymbol('')
      setTotalShares('')
    } catch (error) {
      console.error('Property creation failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Property</CardTitle>
        <CardDescription>
          Create a new tokenized property with ERC-3643 compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Property Name</label>
            <Input
              placeholder="e.g., Luxury Apartment NYC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Token Symbol</label>
            <Input
              placeholder="e.g., LANYC"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Total Shares</label>
            <Input
              type="number"
              placeholder="1000"
              value={totalShares}
              onChange={(e) => setTotalShares(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Creating...' : 'Create Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}