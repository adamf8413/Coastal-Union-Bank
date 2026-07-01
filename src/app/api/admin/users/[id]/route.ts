import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

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
