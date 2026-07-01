import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createAndSendOtp } from "@/lib/otp"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    if (user.role === "ADMIN") {
      return NextResponse.json({ ok: true, isAdmin: true, message: "Admin sign in" })
    }

    await createAndSendOtp(user.email, "LOGIN")

    const latestOtp = await prisma.otp.findFirst({
      where: { email: user.email, purpose: "LOGIN", used: false },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ ok: true, message: "Code sent to your email", code: latestOtp?.code })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
