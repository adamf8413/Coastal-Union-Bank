import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const ALL_ASSETS = ["USD", "EUR", "GBP", "BTC", "ETH", "SOL"]

const prices: Record<string, number> = {
  USD: 1, EUR: 1.08, GBP: 1.25, BTC: 65000, ETH: 3500, SOL: 145,
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const dbHoldings = await prisma.holding.findMany({
    where: { userId },
    orderBy: { assetType: "asc" },
  })

  const holdingMap = new Map(dbHoldings.map(h => [h.assetType, h]))

  const enriched = ALL_ASSETS.map((assetType) => {
    const h = holdingMap.get(assetType)
    const amount = h?.amount || 0
    const price = prices[assetType] || 0
    return {
      id: h?.id || `${assetType}-placeholder`,
      userId,
      assetType,
      amount,
      price,
      value: amount * price,
      change24h: ((Math.random() - 0.5) * 10),
    }
  })

  const totalValue = enriched.reduce((sum, h) => sum + h.value, 0)

  return NextResponse.json({ holdings: enriched, totalValue })
}
