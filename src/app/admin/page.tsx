"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"

type UserSummary = { id: string; username: string; name: string | null }

type PendingCotp = {
  id: string
  userId: string
  recipientId: string
  assetType: string
  amount: number
  cop: string
  note: string | null
  createdAt: string
  user: { username: string; name: string | null }
  recipient: { username: string; name: string | null }
  accountNumber: string | null
  routingNumber: string | null
  swiftCode: string | null
  recipientBank: string | null
  transferType: string | null
  accountName: string | null
  bankAddress: string | null
  country: string | null
}

const ASSETS = ["USD", "EUR", "GBP", "BTC", "ETH", "SOL"]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const adminId = (session?.user as any)?.id || ""

  const [users, setUsers] = useState<UserSummary[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [assetType, setAssetType] = useState("USD")
  const [amount, setAmount] = useState("")
  const [creditNote, setCreditNote] = useState("")
  const [creditResult, setCreditResult] = useState<string | null>(null)
  const [creditLoading, setCreditLoading] = useState(false)
  const [error, setError] = useState("")
  const [pendingCotps, setPendingCotps] = useState<PendingCotp[]>([])
  const [copRevealed, setCopRevealed] = useState<Record<string, boolean>>({})
  const [myHoldings, setMyHoldings] = useState<{ assetType: string; amount: number; value: number }[]>([])
  const [myTotalValue, setMyTotalValue] = useState(0)

  const loadCotps = useCallback(() => {
    if (isAdmin) {
      fetch("/api/admin/pending-cop").then((r) => r.json()).then((d) => {
        setPendingCotps(d.pending || [])
      }).catch(() => {})
    }
  }, [isAdmin])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && !isAdmin) router.push("/dashboard")
  }, [status, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/users").then((r) => r.json()).then((d) => {
        const all = d.users || []
        const sorted = [...all].sort((a) => a.id === adminId ? -1 : 1)
        setUsers(sorted)
        if (all.length > 0) setSelectedUserId(adminId || all[0].id)
      }).catch(() => {})
      loadCotps()
      refreshHoldings()
      const interval = setInterval(loadCotps, 5000)
      return () => clearInterval(interval)
    }
  }, [isAdmin, loadCotps, adminId])

  const refreshHoldings = () => {
    fetch("/api/portfolio").then((r) => r.json()).then((d) => {
      setMyHoldings(d.holdings || [])
      setMyTotalValue(d.totalValue || 0)
    }).catch(() => {})
  }

  const handleCredit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !amount) return
    setCreditLoading(true)
    setError("")
    setCreditResult(null)

    const res = await fetch("/api/admin/credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUserId, assetType, amount: parseFloat(amount), note: creditNote }),
    })
    const data = await res.json()

    if (res.ok) {
      const uname = users.find((u) => u.id === selectedUserId)?.username || "User"
      setCreditResult(`Credited ${amount} ${assetType} to ${uname}`)
      setAmount("")
      setCreditNote("")
      refreshHoldings()
    } else {
      setError(data.error || "Failed to credit")
    }
    setCreditLoading(false)
  }

  if (status === "loading" || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Link
            href="/admin/users"
            className="rounded-xl border p-6 transition-colors hover:bg-zinc-900/80"
            style={{ borderColor: "var(--brand-border)" }}
          >
            <div className="text-3xl mb-2">👥</div>
            <h2 className="text-lg font-semibold">Manage Users</h2>
            <p className="text-sm text-zinc-400 mt-1">Onboard new users, view all accounts</p>
          </Link>

          <Link
            href="/admin/transactions"
            className="rounded-xl border p-6 transition-colors hover:bg-zinc-900/80"
            style={{ borderColor: "var(--brand-border)" }}
          >
            <div className="text-3xl mb-2">💳</div>
            <h2 className="text-lg font-semibold">Manage Transactions</h2>
            <p className="text-sm text-zinc-400 mt-1">View and edit any user's transactions</p>
          </Link>

          <Link
            href="/admin/brand"
            className="rounded-xl border p-6 transition-colors hover:bg-zinc-900/80"
            style={{ borderColor: "var(--brand-border)" }}
          >
            <div className="text-3xl mb-2">🎨</div>
            <h2 className="text-lg font-semibold">Brand Settings</h2>
            <p className="text-sm text-zinc-400 mt-1">Customize colors, gradients, and hero</p>
          </Link>

          <Link
            href="/admin/support"
            className="rounded-xl border p-6 transition-colors hover:bg-zinc-900/80"
            style={{ borderColor: "var(--brand-border)" }}
          >
            <div className="text-3xl mb-2">💬</div>
            <h2 className="text-lg font-semibold">Support Chat</h2>
            <p className="text-sm text-zinc-400 mt-1">View and reply to user messages</p>
          </Link>
        </div>

        {/* My Holdings */}
        <div className="rounded-xl border p-6 mb-6" style={{ borderColor: "var(--brand-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Holdings</h2>
            <span className="text-sm" style={{ color: "var(--brand-primary)" }}>
              Total Value: ${myTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          {myHoldings.length === 0 ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {myHoldings.map((h) => (
                <div key={h.assetType} className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
                  <div className="text-lg font-bold">{h.assetType}</div>
                  <div className="text-sm text-zinc-300 font-mono mt-1">
                    {h.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    ${h.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending COP Transfers */}
        <div className="rounded-xl border p-6 mb-6" style={{ borderColor: "var(--brand-border)" }}>
          <h2 className="text-lg font-semibold mb-4">
            Pending Confirmation Codes
            {pendingCotps.length > 0 && (
              <span className="ml-2 text-xs font-normal text-zinc-500">({pendingCotps.length} pending)</span>
            )}
          </h2>
          {pendingCotps.length === 0 ? (
            <p className="text-sm text-zinc-500">No pending transfers waiting for confirmation.</p>
          ) : (
            <div className="space-y-3">
              {pendingCotps.map((p) => (
                <div key={p.id} className="rounded-lg border p-4 text-sm" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p>
                        <strong className="text-zinc-200">{p.user.username}</strong>
                        <span className="text-zinc-500"> → </span>
                        <strong className="text-zinc-200">{p.recipient.username}</strong>
                      </p>
                      <p className="text-zinc-400">
                        {p.amount} {p.assetType}
                        {p.note && <span className="text-zinc-500"> · {p.note}</span>}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {p.transferType === "international" ? "🌍 International" : "📍 Local"}
                        {p.accountName && <span> · {p.accountName}</span>}
                        {p.country && <span> · {p.country}</span>}
                        {p.recipientBank && <span> · {p.recipientBank}</span>}
                        {p.bankAddress && <span> · {p.bankAddress}</span>}
                        {p.routingNumber && <span> · Routing: {p.routingNumber}</span>}
                        {p.swiftCode && <span> · SWIFT: {p.swiftCode}</span>}
                      </p>
                      <p className="text-xs text-zinc-600">{new Date(p.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {copRevealed[p.id] ? (
                        <div>
                          <span className="text-xl tracking-widest font-mono font-bold text-emerald-400">{p.cop}</span>
                          <button
                            onClick={() => setCopRevealed((prev) => ({ ...prev, [p.id]: false }))}
                            className="block text-xs text-zinc-500 hover:text-zinc-300 mt-1 w-full text-right"
                          >
                            Hide
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCopRevealed((prev) => ({ ...prev, [p.id]: true }))}
                          className="rounded-lg px-4 py-2 text-xs font-medium transition-colors"
                          style={{ backgroundColor: "var(--brand-primary)", color: "white" }}
                        >
                          Reveal Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit User */}
        <div className="rounded-xl border p-6" style={{ borderColor: "var(--brand-border)" }}>
          <h2 className="text-lg font-semibold mb-4">Credit a User</h2>
          <form onSubmit={handleCredit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm text-zinc-400">User</label>
                <button
                  type="button"
                  onClick={() => setSelectedUserId(adminId)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                    selectedUserId === adminId
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-zinc-700 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Credit Myself
                </button>
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900"
                style={{ borderColor: "var(--brand-border)" }}
                required
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} {u.name ? `(${u.name})` : ""}{u.id === adminId ? " (you)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Asset</label>
              <div className="flex gap-2">
                {ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => setAssetType(asset)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      assetType === asset
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none focus:border-indigo-500"
                style={{ borderColor: "var(--brand-border)" }}
                placeholder="0.00"
                min="0"
                step="any"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Note (optional)</label>
              <input
                type="text"
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
                style={{ borderColor: "var(--brand-border)" }}
                placeholder="Admin credit"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {creditResult && <p className="text-sm text-emerald-400">{creditResult}</p>}

            <button
              type="submit"
              disabled={creditLoading || !amount}
              className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {creditLoading ? <span className="animate-spin-logo text-lg">⟳</span> : "Credit User"}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
