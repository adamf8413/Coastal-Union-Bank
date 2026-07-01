import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const where = userId ? { userId } : {}

    const transactions = await prisma.transaction.findMany({
      where,
      include: { method: true, user: { select: { username: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    const enriched = await Promise.all(
      transactions.map(async (tx) => {
        let recipient: { username: string } | null = null
        if (tx.recipientId) {
          const u = await prisma.user.findUnique({
            where: { id: tx.recipientId },
            select: { username: true },
          })
          recipient = u
        }
        return { ...tx, recipient }
      })
    )

    return NextResponse.json({ transactions: enriched })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin()
    const { id, type, assetType, amount, fee, status, note, createdAt } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const tx = await prisma.transaction.update({
      where: { id },
      data: {
        ...(type !== undefined && { type }),
        ...(assetType !== undefined && { assetType }),
        ...(amount !== undefined && { amount }),
        ...(fee !== undefined && { fee }),
        ...(status !== undefined && { status }),
        ...(note !== undefined && { note }),
        ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
      },
    })

    return NextResponse.json({ transaction: tx })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
