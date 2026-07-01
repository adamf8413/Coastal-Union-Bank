import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can use this endpoint" }, { status: 403 })
    }

    // Use server-side signIn to create the session and get cookies
    const res = await signIn("credentials", { username, password, redirect: false })
    const setCookie = res.headers.get("set-cookie")

    const json = NextResponse.json({ ok: true })
    if (setCookie) {
      const cookies = setCookie.split(/,(?=\s*[a-zA-Z])/)
      for (const cookie of cookies) {
        json.headers.append("Set-Cookie", cookie.trim())
      }
    }

    return json
  } catch (e) {
    console.error("Admin login error:", e)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
