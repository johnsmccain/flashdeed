import { useReadContract, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESSES, FRACTIONALIZER_ABI } from './contracts'

export function useProperty(propertyId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.FRACTIONALIZER,
    abi: FRACTIONALIZER_ABI,
    functionName: 'getProperty',
    args: propertyId !== undefined ? [propertyId] : undefined,
    query: {
      enabled: propertyId !== undefined,
    },
  })
}

export function useRedeemShares() {
  return useWriteContract()
}