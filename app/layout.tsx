import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DemoAuthProvider } from "@/contexts/demo-auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YukiFiles - Advanced File Management Platform",
  description: "Professional file storage, sharing, and management with enterprise-grade security and analytics.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DemoAuthProvider>
          {children}
        </DemoAuthProvider>
      </body>
    </html>
  )
}