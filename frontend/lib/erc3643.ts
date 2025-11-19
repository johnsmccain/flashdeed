import { useReadContract, useWriteContract } from 'wagmi'
import { ERC3643_ABI } from './contracts'

export function useTokenBalance(tokenAddress: `0x${string}` | undefined, account: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: ERC3643_ABI,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    query: {
      enabled: !!(tokenAddress && account),
      refetchInterval: 5000,
    },
  })
}

export function useTokenInfo(tokenAddress: `0x${string}` | undefined) {
  const name = useReadContract({
    address: tokenAddress,
    abi: ERC3643_ABI,
    functionName: 'name',
    query: { enabled: !!tokenAddress },
  })

  const symbol = useReadContract({
    address: tokenAddress,
    abi: ERC3643_ABI,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress },
  })

  const totalSupply = useReadContract({
    address: tokenAddress,
    abi: ERC3643_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddress },
  })

  return { name, symbol, totalSupply }
}

export function useTransferToken() {
  return useWriteContract()
}

export function useMintToken() {
  return useWriteContract()
}

export function useBurnToken() {
  return useWriteContract()
}