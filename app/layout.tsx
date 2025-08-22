import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "sonner"
import { ErrorOverlay } from "@/components/ui/error-overlay"

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
        <link rel="dns-prefetch" href="//api.supabase.co" />
        
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // J-Safe Global Protection
              (function() {
                // Prevent any global j variable conflicts
                if (typeof window !== 'undefined') {
                  Object.defineProperty(window, 'j', {
                    get: function() {
                      console.warn('Attempted access to global j variable - redirecting to safe alternative');
                      return undefined;
                    },
                    set: function(value) {
                      console.warn('Attempted to set global j variable - preventing to avoid conflicts');
                      return false;
                    },
                    configurable: false,
                    enumerable: false
                  });
                }
                
                // Enhanced error handler
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.includes('Cannot access') && e.message.includes('before initialization')) {
                    console.error('🚨 J INITIALIZATION ERROR DETECTED:', {
                      message: e.message,
                      filename: e.filename,
                      lineno: e.lineno,
                      colno: e.colno,
                      stack: e.error?.stack,
                      timestamp: new Date().toISOString(),
                      userAgent: navigator.userAgent,
                      url: window.location.href
                    });
                    
                    // Try to prevent page crash
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Show user-friendly message
                    const errorDiv = document.createElement('div');
                    errorDiv.innerHTML = \`
                      <div style="position: fixed; top: 20px; right: 20px; background: rgba(239, 68, 68, 0.9); color: white; padding: 16px; border-radius: 8px; max-width: 400px; z-index: 9999; font-family: system-ui;">
                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">⚠️ Initialization Error</h3>
                        <p style="margin: 0 0 12px 0; font-size: 14px;">A JavaScript error occurred. Refreshing the page may help.</p>
                        <button onclick="window.location.reload()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                          Refresh Page
                        </button>
                        <button onclick="this.parentElement.remove()" style="background: transparent; border: none; color: rgba(255,255,255,0.7); padding: 8px; cursor: pointer; float: right; font-size: 16px;">×</button>
                      </div>
                    \`;
                    document.body.appendChild(errorDiv);
                    
                    // Auto-remove after 10 seconds
                    setTimeout(() => {
                      if (errorDiv.parentElement) {
                        errorDiv.remove();
                      }
                    }, 10000);
                  }
                });
                
                // Prevent variable hoisting conflicts
                const originalMap = Array.prototype.map;
                Array.prototype.map = function(callback, thisArg) {
                  return originalMap.call(this, function(element, index, array) {
                    return callback.call(thisArg, element, index, array);
                  });
                };
              })();
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
            {children}
            <Toaster />
            <ErrorOverlay />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}