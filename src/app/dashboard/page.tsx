"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"
import { AtmCard } from "@/components/AtmCard"
import { HoldingCard } from "@/components/HoldingCard"
import { PortfolioChart } from "@/components/PortfolioChart"
import { TransactionList } from "@/components/TransactionList"
import { HeroIllustration } from "@/components/HeroIllustration"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { brand } from "@/lib/brand"

type Holding = {
  id: string
  assetType: string
  amount: number
  value: number
  price: number
  change24h: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [transactions, setTransactions] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const userName = session?.user?.name || (session?.user as any)?.username || ""

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch("/api/portfolio").then((r) => r.json()).then((d) => {
        setHoldings(d.holdings || [])
        setTotalValue(d.totalValue || 0)
      })
      fetch("/api/transactions").then((r) => r.json()).then((d) => {
        setTransactions(d.transactions || [])
      })
    }
  }, [session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  const chartData = holdings.map((h) => ({
    name: h.assetType,
    value: h.value,
    color: h.assetType,
  }))

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden pt-6 md:pt-20 pb-16 md:pb-24">
          <AnimatedBackground />

          <div className="relative mx-auto max-w-6xl px-4" style={{ zIndex: 1 }}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Left: Text */}
              <div className="flex-1 text-center md:text-left" style={{ animation: "fade-in-up 1s ease-out" }}>
                <div
                  className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-4 tracking-wide uppercase"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
                    color: "white",
                  }}
                >
                  {brand.shortName} · Premium Banking
                </div>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-foreground) 0%, var(--brand-primary-light) 50%, var(--brand-accent) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}
                </h1>
                <p className="text-lg text-zinc-400 max-w-md mx-auto md:mx-0 mb-6">
                  Your portfolio is performing well. Track, send, and deposit across USD, EUR, and crypto — all in one place.
                </p>

                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    href="/send"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
                    }}
                  >
                    <span>↑</span> Send Money
                  </Link>
                  <Link
                    href="/deposit"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--brand-border)",
                      color: "var(--brand-foreground)",
                    }}
                  >
                    <span>↓</span> Deposit
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start" style={{ animation: "fade-in-up 1s ease-out 0.3s both" }}>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: "var(--brand-primary-light)" }}>
                      ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">Total Value</div>
                  </div>
                  <div className="w-px bg-zinc-800 hidden sm:block" />
                  <div>
                    <div className="text-2xl font-bold text-zinc-200">{holdings.length}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Assets</div>
                  </div>
                  <div className="w-px bg-zinc-800 hidden sm:block" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">+2.4%</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Today</div>
                  </div>
                </div>
              </div>

              {/* Right: Illustration */}
              <div
                className="flex-shrink-0"
                style={{ animation: "slide-in-right 1s ease-out 0.2s both" }}
              >
                <HeroIllustration size={320} />
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(to top, var(--brand-background), transparent)",
            }}
          />
        </section>

        {/* ── ATM Card ── */}
        <div className="mx-auto max-w-6xl px-4 -mt-12 mb-8 relative" style={{ zIndex: 2, animation: "fade-in-up 1s ease-out 0.35s both" }}>
          <AtmCard
            accountNumber={(session?.user as any)?.accountNumber}
            routingNumber={(session?.user as any)?.routingNumber}
            userName={session?.user?.name || (session?.user as any)?.username}
          />
        </div>

        {/* ── Dashboard Sections ── */}
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid gap-4 md:grid-cols-3 mb-8" style={{ animation: "fade-in-up 1s ease-out 0.4s both" }}>
            <div className="rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
              <div className="text-sm text-zinc-400">Total Portfolio Value</div>
              <div className="text-3xl font-bold mt-1" style={{ color: "var(--brand-foreground)" }}>
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-400 mt-1">
                <span>▲</span> +2.4% today
              </div>
            </div>
            <div className="rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
              <div className="text-sm text-zinc-400">Assets Held</div>
              <div className="text-3xl font-bold mt-1">{holdings.length}</div>
              <div className="text-sm text-zinc-500 mt-1">Across {holdings.length} currencies</div>
            </div>
            <div className="rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
              <div className="text-sm text-zinc-400">Open Transactions</div>
              <div className="text-3xl font-bold mt-1">
                {transactions.filter((t: any) => t.status === "pending" || t.status === "pending_otp").length}
              </div>
              <div className="text-sm text-zinc-500 mt-1">Pending</div>
            </div>
          </div>

          <div className="mb-8" style={{ animation: "fade-in-up 1s ease-out 0.5s both" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Holdings</h2>
              <span className="text-xs text-zinc-500">{holdings.length} assets</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {holdings.map((h) => (
                <HoldingCard key={h.id} {...h} />
              ))}
            </div>
          </div>

          <div className="mb-8" style={{ animation: "fade-in-up 1s ease-out 0.55s both" }}>
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
              <h2 className="text-lg font-semibold mb-4">Portfolio Allocation</h2>
              <PortfolioChart data={chartData} />
            </div>
          </div>

          <div style={{ animation: "fade-in-up 1s ease-out 0.6s both" }}>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <TransactionList transactions={transactions.slice(0, 5)} />
          </div>
        </div>
      </main>
    </>
  )
}
