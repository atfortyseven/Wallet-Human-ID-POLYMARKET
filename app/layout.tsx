import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from "@/components/Providers";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Human DeFi - Professional Whale Tracker',
  description: 'Track whales, copy profits, and dominate DeFi with AI-powered insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
                <ClientLayout>
                    {children}
                </ClientLayout>
                <Toaster position="top-right" />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  )
}
