import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role, // This is available if set properly in callbacks
    },
  })
}
