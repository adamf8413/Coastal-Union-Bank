import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { encode } from "next-auth/jwt"

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

    // Create a JWT token matching NextAuth's format
    const secret = process.env.AUTH_SECRET || "coastal-union-bank-fallback-secret-do-not-use-in-production"
    const token = {
      id: user.id,
      name: user.name,
      email: user.email,
      sub: user.id,
      role: user.role,
      username: user.username,
      accountNumber: user.accountNumber,
      routingNumber: user.routingNumber,
      swiftCode: user.swiftCode,
      profilePicture: user.profilePicture,
    }

    const isSecure = req.url?.startsWith("https") || req.headers.get("x-forwarded-proto") === "https"
    const cookiePrefix = isSecure ? "__Secure-" : ""
    const cookieName = `${cookiePrefix}authjs.session-token`
    const sessionToken = await encode({ token, secret, salt: cookieName, maxAge: 30 * 24 * 60 * 60 })

    const json = NextResponse.json({ ok: true })
    json.headers.set(
      "Set-Cookie",
      `${cookieName}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; ${isSecure ? "Secure; " : ""}Max-Age=${30 * 24 * 60 * 60}`
    )

    return json
  } catch (e) {
    console.error("Admin login error:", e)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
