import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Ensure we have correct site URL for auth redirects
  const url = new URL(request.url)
  const host = url.host
  
  // Handle Vercel deployment URLs
  const isVercel = host.includes('.vercel.app') || host.includes('.vercel.app')
  const siteUrl = isVercel ? `https://${host}` : `${url.protocol}//${host}`
  
  // Dynamically set SITE_URL cookie for use in server components
  response.cookies.set({ name: "SITE_URL", value: siteUrl, path: "/" })

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: any) {
        response.cookies.set({
          name,
          value: "",
          ...options,
        })
      },
    },
  })

  // Refresh session if expired
  await supabase.auth.getSession()

  // Protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/")
  const isPublicRoute =
    request.nextUrl.pathname.startsWith("/share/") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/")

  if (!isAuthRoute && !isPublicRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
