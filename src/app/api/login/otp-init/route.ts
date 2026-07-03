import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

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

    return NextResponse.json({ ok: true, direct: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
