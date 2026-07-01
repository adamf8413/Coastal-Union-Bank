import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email } = await req.json()
    const userId = session.user.id as string
    const userRole = (session.user as any).role

    if (userRole === "ADMIN") {
      return NextResponse.json({ error: "Admins cannot edit their profile" }, { status: 403 })
    }

    const data: any = {}
    if (name !== undefined) data.name = name
    if (email !== undefined) {
      const existing = await prisma.user.findFirst({ where: { email, NOT: { id: userId } } })
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
      data.email = email
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, username: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
