'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCanTransfer } from '@/lib/compliance'
import { useTransferToken } from '@/lib/erc3643'
import { ERC3643_ABI } from '@/lib/contracts'
import { parseUnits } from 'viem'

interface TransferModalProps {
  tokenAddress: `0x${string}`
  children: React.ReactNode
}

export function TransferModal({ tokenAddress, children }: TransferModalProps) {
  const [open, setOpen] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const { writeContract, isPending } = useTransferToken()

  const parsedAmount = amount ? parseUnits(amount, 18) : 0n
  const { data: canTransferData } = useCanTransfer(
    tokenAddress,
    address,
    toAddress as `0x${string}`,
    parsedAmount
  )

  const handleTransfer = async () => {
    if (!toAddress || !amount || !canTransferData?.[0]) return

    try {
      await writeContract({
        address: tokenAddress,
        abi: ERC3643_ABI,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, parsedAmount],
      })
      setOpen(false)
      setToAddress('')
      setAmount('')
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  const isValidAddress = toAddress.startsWith('0x') && toAddress.length === 42
  const canTransfer = canTransferData?.[0] || false
  const transferReason = canTransferData?.[1] || ''

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Tokens</DialogTitle>
          <DialogDescription>
            Transfer your property tokens to another address
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">To Address</label>
            <Input
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {isValidAddress && amount && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Compliance Status:</span>
              <Badge variant={canTransfer ? "success" : "destructive"}>
                {canTransfer ? "Allowed" : "Denied"}
              </Badge>
              {!canTransfer && transferReason && (
                <span className="text-sm text-muted-foreground">
                  {transferReason}
                </span>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!canTransfer || !isValidAddress || !amount || isPending}
          >
            {isPending ? 'Transferring...' : 'Transfer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}