'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PropertyCard } from '@/components/PropertyCard'
import { useIdentityStatus } from '@/lib/identity'
import { useDeployedTokens, usePropertyCreatedEvents } from '@/lib/factory'
import { Wallet, Building, TrendingUp, Shield } from 'lucide-react'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const { data: hasValidIdentity } = useIdentityStatus(address)
  const { data: deployedTokens, isLoading } = useDeployedTokens()
  
  usePropertyCreatedEvents()

  useEffect(() => {
    if (isConnected && hasValidIdentity === false) {
      router.push('/kyc-required')
    }
  }, [isConnected, hasValidIdentity, router])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
          <p className="text-gray-600 max-w-md">
            Please connect your wallet to view your dashboard and manage your tokenized real estate investments
          </p>
        </div>
      </div>
    )
  }

  if (hasValidIdentity === false) {
    return null // Will redirect to KYC page
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your tokenized real estate investments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Identity Status</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {hasValidIdentity ? 'Verified' : 'Pending'}
            </div>
            <p className="text-xs text-green-600 mt-1">
              KYC verification status
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {deployedTokens?.length || 0}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Available tokenized properties
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Your Holdings</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {deployedTokens?.length || 0}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Properties you own shares in
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">
              $0.00
            </div>
            <p className="text-xs text-indigo-600 mt-1">
              Total investment value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Properties</h2>
          {deployedTokens && deployedTokens.length > 0 && (
            <span className="text-sm text-gray-500">
              {deployedTokens.length} properties
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : deployedTokens && deployedTokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deployedTokens.map((tokenAddress) => (
              <PropertyCard key={tokenAddress} tokenAddress={tokenAddress} />
            ))}
          </div>
        ) : (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first tokenized property</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}