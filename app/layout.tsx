import React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "sonner"
import { RootErrorBoundary } from "@/components/ui/root-error-boundary"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

function getCurrentSiteUrl() {
  // Try to get from environment variable first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Try to get from Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Default fallback
  return "http://localhost:3000"
}

export const metadata: Metadata = {
  title: "YukiFiles - Secure File Sharing Platform",
  description:
    "Upload, share, and manage files with premium themes, resilient anti‑abuse, and easy share links. 2GB free, upgrade any time.",
  metadataBase: new URL(getCurrentSiteUrl()),
  keywords: ["file sharing", "secure upload", "cloud storage", "file management", "document sharing"],
  authors: [{ name: "YukiFiles Team" }],
  creator: "YukiFiles",
  publisher: "YukiFiles",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "YukiFiles - Secure File Sharing Platform",
    description: "Upload, share, and manage files with premium themes, resilient anti‑abuse, and easy share links.",
    url: getCurrentSiteUrl(),
    siteName: "YukiFiles",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YukiFiles - Secure File Sharing Platform",
    description: "Upload, share, and manage files with premium themes, resilient anti‑abuse, and easy share links.",
    creator: "@yukifiles",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        {/* Đã xóa Supabase DNS prefetch để tránh lỗi */}
        
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // YukiFiles J-Safe Protection System
              console.log('🛡️ YukiFiles J-Safe Protection loading...');
            `
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <RootErrorBoundary>
              {children}
            </RootErrorBoundary>
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}