import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESSES, PROPERTY_FACTORY_ABI } from './contracts'
import { usePropertyStore } from './state/usePropertyStore'

export function useDeployedTokens() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_FACTORY,
    abi: PROPERTY_FACTORY_ABI,
    functionName: 'getDeployedTokens',
    query: {
      refetchInterval: 10000,
    },
  })
}

export function useCreateProperty() {
  return useWriteContract()
}

export function usePropertyCreatedEvents() {
  const { setProperties, properties } = usePropertyStore()

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.PROPERTY_FACTORY,
    abi: PROPERTY_FACTORY_ABI,
    eventName: 'PropertyTokenCreated',
    onLogs(logs) {
      logs.forEach((log) => {
        const newProperty = {
          address: log.args.token!,
          name: log.args.name!,
          symbol: log.args.symbol!,
          totalSupply: 0n,
          userBalance: 0n,
          canTransfer: false,
          transferReason: '',
        }
        setProperties([...properties, newProperty])
      })
    },
  })
}