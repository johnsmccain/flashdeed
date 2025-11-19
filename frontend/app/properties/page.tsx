'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PropertyCard } from '@/components/PropertyCard'
import { useDeployedTokens, usePropertyCreatedEvents } from '@/lib/factory'

export default function PropertiesPage() {
  const { data: deployedTokens, isLoading } = useDeployedTokens()
  
  usePropertyCreatedEvents()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="text-muted-foreground">
          Browse all available tokenized real estate properties
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading properties...</p>
        </div>
      ) : deployedTokens && deployedTokens.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployedTokens.map((tokenAddress) => (
            <PropertyCard key={tokenAddress} tokenAddress={tokenAddress} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No properties available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}