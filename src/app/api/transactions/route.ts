import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: { method: true },
    orderBy: { createdAt: "desc" },
    take: 50,
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
}
