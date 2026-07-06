import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"
import { createUniqueAccountNumber, createUniqueSwiftCode, createUniqueRoutingNumber } from "@/lib/account"

export async function GET() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        accountNumber: true,
        swiftCode: true,
        createdAt: true,
        _count: { select: { transactions: true, holdings: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ users })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { username, name, email, password, role, creditAsset, creditAmount, history, profilePicture } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password required" }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })
    if (existing) {
      return NextResponse.json({ error: "Username or email already taken" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const accountNumber = await createUniqueAccountNumber()
    const routingNumber = await createUniqueRoutingNumber()
    const swiftCode = await createUniqueSwiftCode()

    const holdingsData = [
      { assetType: "USD", amount: 0 },
      { assetType: "EUR", amount: 0 },
      { assetType: "GBP", amount: 0 },
      { assetType: "BTC", amount: 0 },
      { assetType: "ETH", amount: 0 },
      { assetType: "SOL", amount: 0 },
    ]

    if (creditAsset && creditAmount && creditAmount > 0) {
      const idx = holdingsData.findIndex(h => h.assetType === creditAsset)
      if (idx !== -1) {
        holdingsData[idx].amount = creditAmount
      } else {
        holdingsData.push({ assetType: creditAsset, amount: creditAmount })
      }
    }

    const user = await prisma.user.create({
      data: {
        username,
        name: name || null,
        email,
        password: hashedPassword,
        role: role || "USER",
        isVerified: true,
        accountNumber,
        routingNumber,
        swiftCode,
        profilePicture: profilePicture || null,
        holdings: { createMany: { data: holdingsData } },
      },
      select: { id: true, username: true, name: true, email: true, role: true, profilePicture: true },
    })

    // Create backdated history transactions
    if (history && Array.isArray(history) && history.length > 0) {
      const txData = history
        .filter((h: any) => h.amount && h.amount > 0)
        .map((h: any) => ({
          userId: user.id,
          type: h.type || "deposit",
          assetType: h.assetType || "USD",
          amount: h.amount,
          fee: 0,
          status: h.status || "completed",
          note: h.note || null,
          createdAt: h.date ? new Date(h.date) : new Date(),
        }))

      for (const tx of txData) {
        await prisma.transaction.create({ data: tx })
      }
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
