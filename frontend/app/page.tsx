import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Shield, Building, Lock, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to FlashDeed
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The first ERC-3643 compliant real estate tokenization platform. 
            Tokenize, trade, and manage property investments with built-in compliance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="border-2">
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">ERC-3643 Compliant</CardTitle>
            <CardDescription className="text-base">
              Built-in KYC and compliance checking for all transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Every token transfer is validated against identity registry and compliance rules
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Real Estate Tokenization</CardTitle>
            <CardDescription className="text-base">
              Convert physical properties into tradeable digital tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Fractional ownership made simple with blockchain technology
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Secure & Transparent</CardTitle>
            <CardDescription className="text-base">
              All transactions recorded on blockchain with full transparency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Immutable records and smart contract automation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600 mt-2">Compliant</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600">24/7</div>
            <div className="text-gray-600 mt-2">Trading</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">0%</div>
            <div className="text-gray-600 mt-2">Platform Fees</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-green-600">∞</div>
            <div className="text-gray-600 mt-2">Possibilities</div>
          </div>
        </div>
      </div>
    </div>
  )
}