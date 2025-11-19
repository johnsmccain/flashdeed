'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TokenBalance } from '@/components/TokenBalance'
import { ComplianceBadge } from '@/components/ComplianceBadge'
import { TransferModal } from '@/components/TransferModal'
import { RedemptionForm } from '@/components/RedemptionForm'
import { useTokenInfo, useMintToken, useBurnToken } from '@/lib/erc3643'
import { formatBalance } from '@/lib/utils'
import { ERC3643_ABI } from '@/lib/contracts'
import { parseUnits } from 'viem'
import { useState } from 'react'

interface PropertyDetailPageProps {
  params: {
    address: string
  }
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const tokenAddress = params.address as `0x${string}`
  const { address: userAddress } = useAccount()
  const { name, symbol, totalSupply } = useTokenInfo(tokenAddress)
  const { writeContract: mint, isPending: isMinting } = useMintToken()
  const { writeContract: burn, isPending: isBurning } = useBurnToken()
  
  const [mintAmount, setMintAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('')

  const handleMint = async () => {
    if (!mintAmount || !userAddress) return
    
    try {
      await mint({
        address: tokenAddress,
        abi: ERC3643_ABI,
        functionName: 'mint',
        args: [userAddress, parseUnits(mintAmount, 18)],
      })
      setMintAmount('')
    } catch (error) {
      console.error('Mint failed:', error)
    }
  }

  const handleBurn = async () => {
    if (!burnAmount || !userAddress) return
    
    try {
      await burn({
        address: tokenAddress,
        abi: ERC3643_ABI,
        functionName: 'burn',
        args: [userAddress, parseUnits(burnAmount, 18)],
      })
      setBurnAmount('')
    } catch (error) {
      console.error('Burn failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{name.data || 'Loading...'}</h1>
        <p className="text-muted-foreground">
          Token: {symbol.data || 'Loading...'} • Address: {tokenAddress}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Information</CardTitle>
            <CardDescription>Basic token details and compliance status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{name.data || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span>Symbol:</span>
              <span>{symbol.data || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Supply:</span>
              <span className="font-mono">
                {totalSupply.data ? formatBalance(totalSupply.data) : 'Loading...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Your Balance:</span>
              <TokenBalance tokenAddress={tokenAddress} className="font-mono" />
            </div>
            <div className="flex justify-between">
              <span>Compliance Status:</span>
              <ComplianceBadge tokenAddress={tokenAddress} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Transfer tokens or manage your holdings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TransferModal tokenAddress={tokenAddress}>
              <Button className="w-full">Transfer Tokens</Button>
            </TransferModal>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Amount to mint"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <Button 
                  onClick={handleMint}
                  disabled={!mintAmount || isMinting}
                  size="sm"
                  className="w-full"
                >
                  {isMinting ? 'Minting...' : 'Mint'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Amount to burn"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <Button 
                  onClick={handleBurn}
                  disabled={!burnAmount || isBurning}
                  size="sm"
                  variant="destructive"
                  className="w-full"
                >
                  {isBurning ? 'Burning...' : 'Burn'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RedemptionForm propertyId={1n} tokenAddress={tokenAddress} />
    </div>
  )
}