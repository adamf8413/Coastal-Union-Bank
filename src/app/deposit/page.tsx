"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { DepositMethodCard } from "@/components/DepositMethodCard"

type Method = {
  id: string
  name: string
  type: string
  fee: number
  processingTime: string
  minAmount: number
  maxAmount: number
}

type UserSummary = { id: string; username: string; name: string | null }

const ASSET_INFO: Record<string, { label: string; icon: string; best: string }> = {
  USD: { label: "US Dollar", icon: "$", best: "Bank Transfer (ACH/Wire)" },
  EUR: { label: "Euro", icon: "€", best: "SEPA Transfer" },
  GBP: { label: "British Pound", icon: "£", best: "UK Faster Payments" },
  BTC: { label: "Bitcoin", icon: "₿", best: "Crypto Wallet" },
  ETH: { label: "Ethereum", icon: "⟠", best: "Crypto Wallet" },
  SOL: { label: "Solana", icon: "◈", best: "Crypto Wallet" },
}

export default function DepositPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const [users, setUsers] = useState<UserSummary[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [methods, setMethods] = useState<Method[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [assetType, setAssetType] = useState("USD")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (!isAdmin) return
    fetch("/api/admin/users").then((r) => r.json()).then((d) => {
      const all = d.users || []
      setUsers(all)
      if (all.length > 0) setSelectedUserId(all[0].id)
    }).catch(() => {})
    fetch("/api/deposits").then((r) => r.json()).then((d) => {
      setMethods(d.methods || [])
      if (d.methods?.length > 0) setSelectedMethod(d.methods[0].id)
    })
  }, [isAdmin])

  const handleDeposit = async () => {
    if (!selectedUserId || !selectedMethod || !amount) return
    setLoading(true)
    setResult(null)

    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUserId, methodId: selectedMethod, assetType, amount: parseFloat(amount) }),
    })

    const data = await res.json()

    if (res.ok) {
      setResult(data.message || `Deposit completed!`)
      setAmount("")
    } else {
      setResult(data.error || "Failed to initiate deposit")
    }
    setLoading(false)
  }

  const selected = methods.find((m) => m.id === selectedMethod)
  const assetInfo = ASSET_INFO[assetType]

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Deposit Funds</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Deposit Into</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900"
              style={{ borderColor: "var(--brand-border)" }}
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username} {u.name ? `(${u.name})` : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Asset</label>
            <div className="flex gap-2 flex-wrap">
              {["USD", "EUR", "GBP", "BTC", "ETH", "SOL"].map((asset) => {
                const info = ASSET_INFO[asset]
                return (
                  <button
                    key={asset}
                    onClick={() => setAssetType(asset)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-colors ${
                      assetType === asset
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{asset}</span>
                  </button>
                )
              })}
            </div>
            {assetInfo && (
              <p className="text-xs text-zinc-500 mt-2">
                {assetInfo.label} · Best via: <span className="text-zinc-300">{assetInfo.best}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Select Deposit Method</label>
            <div className="space-y-2">
              {methods.map((method) => {
                const isBest = assetInfo && (
                  (["USD", "EUR", "GBP"].includes(assetType) && method.type === "bank") ||
                  (["BTC", "ETH", "SOL"].includes(assetType) && method.type === "crypto")
                )
                return (
                  <div key={method.id} className="relative">
                    {isBest && (
                      <span className="absolute -top-2 -right-2 z-10 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                        Best for {assetType}
                      </span>
                    )}
                    <DepositMethodCard
                      method={method}
                      selected={selectedMethod === method.id}
                      onSelect={() => setSelectedMethod(method.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {selected && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Deposit info</span>
                {selected.fee === 0 ? (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">No fees</span>
                ) : (
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">
                    {selected.fee}% fee
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{selected.processingTime}</span>
                <span>{selected.minAmount} - {selected.maxAmount} {assetType}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min={selected?.minAmount || 0}
              max={selected?.maxAmount || 0}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          {result && (
            <div className={`rounded-lg p-3 text-sm ${
              result.includes("Deposited") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}>
              {result}
            </div>
          )}

          {!isAdmin && (
            <div className="rounded-lg border border-dashed border-zinc-700 p-6 text-center">
              <p className="text-zinc-400 text-sm">You can't deposit money into your own account.</p>
              <p className="text-zinc-500 text-xs mt-1">Only the bank can credit your account. Ask an admin to deposit funds for you.</p>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={handleDeposit}
              disabled={loading || !amount}
              className="w-full rounded-lg bg-indigo-600 py-3 font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? <span className="animate-spin-logo text-lg">⟳</span> : "Deposit"}
            </button>
          )}
        </div>
      </main>
    </>
  )
}
