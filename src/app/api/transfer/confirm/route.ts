import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { transferId, code } = await req.json()
  if (!transferId || !code) {
    return NextResponse.json({ error: "Transfer ID and code required" }, { status: 400 })
  }

  const tx = await prisma.transaction.findUnique({ where: { id: transferId } })
  if (!tx || tx.userId !== session.user.id) {
    return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
  }
  if (tx.status !== "pending_cop") {
    return NextResponse.json({ error: "Transfer already processed" }, { status: 400 })
  }
  if (tx.cop !== code) {
    return NextResponse.json({ error: "Invalid confirmation code" }, { status: 400 })
  }

  const [senderHolding, recipientHolding] = await Promise.all([
    prisma.holding.findUnique({
      where: { userId_assetType: { userId: tx.userId, assetType: tx.assetType } },
    }),
    prisma.holding.findUnique({
      where: { userId_assetType: { userId: tx.recipientId!, assetType: tx.assetType } },
    }),
  ])

  if (!senderHolding || senderHolding.amount < tx.amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.holding.update({
      where: { id: senderHolding.id },
      data: { amount: { decrement: tx.amount } },
    }),
    recipientHolding
      ? prisma.holding.update({
          where: { id: recipientHolding.id },
          data: { amount: { increment: tx.amount } },
        })
      : prisma.holding.create({
          data: {
            userId: tx.recipientId!,
            assetType: tx.assetType,
            amount: tx.amount,
          },
        }),
    prisma.transaction.update({
      where: { id: tx.id },
      data: { status: "completed", cop: null },
    }),
  ])

  // Create notifications
  const sender = await prisma.user.findUnique({ where: { id: tx.userId }, select: { name: true, username: true } })
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } })
  const txnName = sender?.name || sender?.username || "User"
  await prisma.notification.createMany({
    data: [
      {
        userId: tx.userId,
        title: "Transfer Completed",
        message: `${tx.amount} ${tx.assetType} sent successfully${tx.recipientBank ? " to " + tx.recipientBank : ""}.`,
      },
      ...admins.map(a => ({
        userId: a.id,
        title: "Transfer Completed",
        message: `${tx.amount} ${tx.assetType} sent by ${txnName}${tx.recipientBank ? " to " + tx.recipientBank : ""}.`,
      })),
    ],
  })

  return NextResponse.json({ message: "Transfer completed", transferId: tx.id })
}
