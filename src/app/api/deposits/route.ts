import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const methods = await prisma.depositMethod.findMany({
    where: { isActive: true },
    orderBy: { fee: "asc" },
  })

  return NextResponse.json({ methods })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "You can't deposit money to your own account" }, { status: 403 })
  }

  const { userId, methodId, assetType, amount } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const method = await prisma.depositMethod.findUnique({ where: { id: methodId } })
  if (!method) {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 })
  }

  if (amount < method.minAmount || amount > method.maxAmount) {
    return NextResponse.json({ error: `Amount must be between ${method.minAmount} and ${method.maxAmount}` }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const fee = (amount * method.fee) / 100
  const netAmount = amount - fee

  const [tx] = await prisma.$transaction([
    prisma.holding.upsert({
      where: { userId_assetType: { userId, assetType } },
      update: { amount: { increment: netAmount } },
      create: { userId, assetType, amount: netAmount },
    }),
    prisma.transaction.create({
      data: {
        userId,
        type: "deposit",
        assetType,
        amount,
        fee,
        status: "completed",
        methodId,
      },
    }),
  ])

  return NextResponse.json({ transaction: tx, message: `Deposited ${netAmount} ${assetType} to ${user.username}` })
}
