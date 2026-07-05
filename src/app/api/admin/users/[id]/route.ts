import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const { password } = await req.json()
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.update({ where: { id }, data: { password: hashed } })

    return NextResponse.json({ success: true, password })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params

    if (id === (admin as any).id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { OR: [{ userId: id }, { recipientId: id }] } }),
      prisma.notification.deleteMany({ where: { userId: id } }),
      prisma.supportMessage.deleteMany({ where: { userId: id } }),
      prisma.holding.deleteMany({ where: { userId: id } }),
      prisma.account.deleteMany({ where: { userId: id } }),
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])

    return NextResponse.json({ success: true, deletedUser: user.username })
  } catch (e) {
    const msg = e instanceof Error && e.message === "Unauthorized" ? "Unauthorized" : "Something went wrong"
    const status = msg === "Unauthorized" ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}
