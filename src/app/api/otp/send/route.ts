import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAndSendOtp } from "@/lib/otp"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const sent = await createAndSendOtp(email)
    if (!sent) {
      return NextResponse.json({ error: "Failed to send code" }, { status: 500 })
    }

    return NextResponse.json({ message: "Code sent" })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
