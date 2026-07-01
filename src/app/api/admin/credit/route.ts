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

    const holding = await prisma.holding.upsert({
      where: { userId_assetType: { userId, assetType } },
      update: { amount: { increment: amount } },
      create: { userId, assetType, amount },
    })

    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: "deposit",
        assetType,
        amount,
        fee: 0,
        status: "completed",
        note: note || "Admin credit",
      },
    })

    return NextResponse.json({ holding, transaction: tx })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
