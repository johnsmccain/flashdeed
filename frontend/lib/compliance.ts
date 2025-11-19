import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, COMPLIANCE_MANAGER_ABI } from './contracts'

export function useCanTransfer(
  token: `0x${string}` | undefined,
  from: `0x${string}` | undefined,
  to: `0x${string}` | undefined,
  amount: bigint | undefined
) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.COMPLIANCE_MANAGER,
    abi: COMPLIANCE_MANAGER_ABI,
    functionName: 'canTransfer',
    args: token && from && to && amount !== undefined ? [token, from, to, amount] : undefined,
    query: {
      enabled: !!(token && from && to && amount !== undefined),
    },
  })
}