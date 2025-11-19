import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESSES, IDENTITY_REGISTRY_ABI } from './contracts'
import { useUserStore } from './state/useUserStore'
import { useEffect } from 'react'

export function useIdentityStatus(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'hasValidIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000,
    },
  })
}

export function useIdentityData(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'getIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

export function useAttestIdentity() {
  return useWriteContract()
}

export function useIdentityEvents() {
  const { address, setIdentityStatus } = useUserStore()

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    eventName: 'IdentityAttested',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.account === address) {
          setIdentityStatus(true)
        }
      })
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    eventName: 'IdentityRevoked',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.account === address) {
          setIdentityStatus(false)
        }
      })
    },
  })
}