"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { AtmCard } from "@/components/AtmCard"
import { HoldingCard } from "@/components/HoldingCard"
import { PortfolioChart } from "@/components/PortfolioChart"

type Holding = {
  id: string
  assetType: string
  amount: number
  value: number
  price: number
  change24h: number
}

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [holdings, setHoldings] = useState<Holding[]>([])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch("/api/portfolio").then((r) => r.json()).then((d) => setHoldings(d.holdings || []))
    }
  }, [session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  const chartData = holdings.map((h) => ({ name: h.assetType, value: h.value, color: h.assetType }))

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

        {/* ATM Card */}
        <div className="mb-8">
          <AtmCard
            accountNumber={(session?.user as any)?.accountNumber}
            userName={session?.user?.name || (session?.user as any)?.username}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="text-lg font-semibold mb-4">Allocation</h2>
            <PortfolioChart data={chartData} />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="text-lg font-semibold mb-4">Asset Prices</h2>
            <div className="space-y-3">
              {holdings.map((h) => (
                <div key={h.id} className="flex items-center justify-between">
                  <span className="font-medium">{h.assetType}</span>
                  <span className="text-zinc-400">
                    ${h.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">All Holdings</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {holdings.map((h) => (
            <HoldingCard key={h.id} {...h} />
          ))}
        </div>
      </main>
    </>
  )
}
