import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyOtp } from "@/lib/otp"

export async function POST(req: Request) {
  try {
    const { username, code } = await req.json()
    if (!username || !code) {
      return NextResponse.json({ error: "Username and code required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const valid = await verifyOtp(user.email, code, "LOGIN")
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
