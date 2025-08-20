import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ToastProvider } from "@/components/ui/toast"

// Helper function to get the current site URL
function getCurrentSiteUrl(): string {
  // Try to get from environment variable first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // Try to get from Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback to localhost for development
  return "http://localhost:3000"
}

export const metadata: Metadata = {
  title: {
    default: "YukiFiles – Secure, Modern File Sharing",
    template: "%s – YukiFiles",
  },
  description:
    "Upload, share, and manage files with premium themes, resilient anti‑abuse, and easy share links. 2GB free, upgrade any time.",
  metadataBase: new URL(getCurrentSiteUrl()),
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "YukiFiles – Secure, Modern File Sharing",
    description:
      "Upload, share, and manage files with premium themes, resilient anti‑abuse, and easy share links.",
    url: "/",
    siteName: "YukiFiles",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "YukiFiles" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YukiFiles – Secure, Modern File Sharing",
    description: "Share files beautifully. 2GB free.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
}

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head />
      <body style={{ fontFamily: "var(--font-outfit)" }}>
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
