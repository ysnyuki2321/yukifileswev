import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createCryptoPayment } from "@/lib/services/payment"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { userId, currency, amount } = await request.json()

    // Verify user owns this userId
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("email", user.email)
      .single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await createCryptoPayment(userId, currency, amount)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Crypto create error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
