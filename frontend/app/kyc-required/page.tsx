'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

export default function KYCRequiredPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold">KYC Verification Required</h1>
        <p className="text-muted-foreground">
          You need to complete KYC verification to access FlashDeed features
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Identity Verification Status
            <Badge variant="destructive">Not Verified</Badge>
          </CardTitle>
          <CardDescription>
            FlashDeed uses ERC-3643 compliant tokens that require identity verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Why is KYC required?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>ERC-3643 tokens require identity verification for all holders</li>
              <li>Ensures compliance with regulatory requirements</li>
              <li>Protects against fraud and money laundering</li>
              <li>Enables secure property tokenization</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">What you need:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Government-issued photo ID</li>
              <li>Proof of address (utility bill or bank statement)</li>
              <li>Valid email address</li>
              <li>Phone number for verification</li>
            </ul>
          </div>

          <div className="pt-4">
            <Button className="w-full" disabled>
              Start KYC Process (Coming Soon)
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              KYC verification will be available in the next update
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you have questions about the KYC process or need assistance, 
            please contact our support team.
          </p>
          <Button variant="outline" className="mt-4" disabled>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}