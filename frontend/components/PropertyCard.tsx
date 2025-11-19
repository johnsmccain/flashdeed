'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TokenBalance } from './TokenBalance'
import { ComplianceBadge } from './ComplianceBadge'
import { useTokenInfo } from '@/lib/erc3643'
import { formatBalance } from '@/lib/utils'
import Link from 'next/link'
import { Building, TrendingUp, Eye } from 'lucide-react'

interface PropertyCardProps {
  tokenAddress: `0x${string}`
}

export function PropertyCard({ tokenAddress }: PropertyCardProps) {
  const { name, symbol, totalSupply } = useTokenInfo(tokenAddress)

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {name.data || 'Loading...'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {symbol.data || 'Loading...'}
              </CardDescription>
            </div>
          </div>
          <ComplianceBadge tokenAddress={tokenAddress} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Your Balance:</span>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <TokenBalance tokenAddress={tokenAddress} className="font-mono font-semibold text-gray-900" />
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Total Supply:</span>
            <span className="font-mono font-semibold text-gray-900">
              {totalSupply.data ? formatBalance(totalSupply.data) : 'Loading...'}
            </span>
          </div>
        </div>
        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group">
          <Link href={`/properties/${tokenAddress}`} className="flex items-center justify-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}