import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { userId, assetType, amount, note } = await req.json()
    if (!userId || !assetType || !amount || amount <= 0) {
      return NextResponse.json({ error: "User ID, asset type, and valid amount required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const holding = await prisma.holding.findUnique({
      where: { userId_assetType: { userId, assetType } },
    })
    if (!holding || holding.amount < amount) {
      return NextResponse.json({ error: "User has insufficient balance" }, { status: 400 })
    }

    const updated = await prisma.holding.update({
      where: { id: holding.id },
      data: { amount: { decrement: amount } },
    })

    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: "withdrawal",
        assetType,
        amount: -amount,
        fee: 0,
        status: "completed",
        note: note || "Admin withdrawal",
      },
    })

    return NextResponse.json({ holding: updated, transaction: tx })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
