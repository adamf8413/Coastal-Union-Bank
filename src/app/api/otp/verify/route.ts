import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyOtp } from "@/lib/otp"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 })
    }

    const valid = await verifyOtp(email, code)
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    })

    return NextResponse.json({ message: "Email verified" })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
