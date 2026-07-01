import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  try {
    await requireAdmin()

    const pending = await prisma.transaction.findMany({
      where: { status: "pending_cop", type: "transfer" },
      include: {
        user: { select: { username: true, name: true } },
        recipient: { select: { username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ pending })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
