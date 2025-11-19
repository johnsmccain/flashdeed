import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers'
import { WalletButton } from '@/components/WalletButton'
import { IdentityStatus } from '@/components/IdentityStatus'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlashDeed - Real Estate Tokenization",
  description: "ERC-3643 compliant real estate tokenization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}
      >
        <Providers>
          <div className="min-h-screen">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-8">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      FlashDeed
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                      <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Dashboard
                      </Link>
                      <Link href="/properties" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Properties
                      </Link>
                      <Link href="/admin/create-property" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        Create Property
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:block">
                      <IdentityStatus />
                    </div>
                    <WalletButton />
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}