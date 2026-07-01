import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    await prisma.transaction.delete({ where: { id } })
    return NextResponse.json({ message: "Transaction deleted" })
  } catch {
    return NextResponse.json({ error: "Unauthorized or not found" }, { status: 401 })
  }
}
