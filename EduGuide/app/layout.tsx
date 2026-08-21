"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { usePathname } from "next/navigation"
import { AnalysisProvider, useAnalysis } from "@/lib/analysis-context"
import { LoginComponent } from "@/components/login"
import { DashboardLayout } from "@/components/dashboard-layout"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAnalysis()
  const pathname = usePathname()

  // Public route checks
  const isPublicRoute = pathname === "/"

  if (isPublicRoute) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <LoginComponent />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AnalysisProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AnalysisProvider>
        <Analytics />
      </body>
    </html>
  )
}
