"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

type HistoryEntry = { type: string; assetType: string; amount: string; status: string; date: string; note: string }

type User = {
  id: string
  username: string
  name: string | null
  email: string
  role: string
  isVerified: boolean
  accountNumber: string | null
  swiftCode: string | null
  createdAt: string
  _count: { transactions: number; holdings: number }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [users, setUsers] = useState<User[]>([])
  const [showOnboard, setShowOnboard] = useState(false)
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "", role: "USER", creditAsset: "USD", creditAmount: "" })
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addEntry = () => {
    setHistoryEntries([...historyEntries, { type: "deposit", assetType: "USD", amount: "", status: "completed", date: new Date().toISOString().slice(0, 16), note: "" }])
  }

  const updateEntry = (idx: number, field: keyof HistoryEntry, value: string) => {
    const next = [...historyEntries]
    next[idx] = { ...next[idx], [field]: value }
    setHistoryEntries(next)
  }

  const removeEntry = (idx: number) => {
    setHistoryEntries(historyEntries.filter((_, i) => i !== idx))
  }

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && !isAdmin) router.push("/dashboard")
  }, [status, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.users || []))
    }
  }, [isAdmin])

  const onboardUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const payload = {
      ...form,
      creditAmount: form.creditAmount ? parseFloat(form.creditAmount) : undefined,
      history: historyEntries.filter(e => e.amount).map(e => ({ ...e, amount: parseFloat(e.amount), date: e.date ? new Date(e.date).toISOString() : undefined })),
    }
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (res.ok) {
      setUsers((prev) => [data.user, ...prev])
      setShowOnboard(false)
      setForm({ username: "", name: "", email: "", password: "", role: "USER", creditAsset: "USD", creditAmount: "" })
      setHistoryEntries([])
    } else {
      setError(data.error || "Failed to create user")
    }
  }

  const handleDelete = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
    const data = await res.json()
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setDeletingId(null)
    } else {
      alert(data.error || "Failed to delete user")
      setDeletingId(null)
    }
  }

  if (status === "loading" || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <button
            onClick={() => setShowOnboard(!showOnboard)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {showOnboard ? "Cancel" : "Onboard User"}
          </button>
        </div>

        {showOnboard && (
          <form onSubmit={onboardUser} className="rounded-xl border p-4 mb-6 space-y-3" style={{ borderColor: "var(--brand-border)" }}>
            <div className="grid gap-3 md:grid-cols-2">
              <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }} required />
              <input placeholder="Name (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }} />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }} required />
              <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }} required />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <details className="rounded-lg border p-3" style={{ borderColor: "var(--brand-border)" }}>
              <summary className="text-sm text-zinc-400 cursor-pointer">Initial Credit (optional)</summary>
              <div className="flex gap-3 mt-3">
                <select value={form.creditAsset} onChange={(e) => setForm({ ...form, creditAsset: e.target.value })}
                  className="rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }}>
                  {["USD", "EUR", "GBP", "BTC", "ETH", "SOL"].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <input type="number" placeholder="Amount" value={form.creditAmount} onChange={(e) => setForm({ ...form, creditAmount: e.target.value })}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm bg-zinc-900" style={{ borderColor: "var(--brand-border)" }} min="0" step="any" />
              </div>
            </details>
            <details className="rounded-lg border p-3" style={{ borderColor: "var(--brand-border)" }}>
              <summary className="text-sm text-zinc-400 cursor-pointer">Transaction History (optional)</summary>
              <div className="mt-3 space-y-2">
                {historyEntries.map((e, i) => (
                  <div key={i} className="grid grid-cols-2 sm:flex sm:gap-2 items-center text-xs gap-1 p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                    <select value={e.type} onChange={(v) => updateEntry(i, "type", v.target.value)}
                      className="rounded border px-2 py-1 bg-zinc-900 w-full sm:w-24" style={{ borderColor: "var(--brand-border)" }}>
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="transfer">Transfer</option>
                    </select>
                    <select value={e.assetType} onChange={(v) => updateEntry(i, "assetType", v.target.value)}
                      className="rounded border px-2 py-1 bg-zinc-900 w-full sm:w-20" style={{ borderColor: "var(--brand-border)" }}>
                      {["USD", "EUR", "GBP", "BTC", "ETH", "SOL"].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <input type="number" placeholder="Amount" value={e.amount} onChange={(v) => updateEntry(i, "amount", v.target.value)}
                      className="rounded border px-2 py-1 bg-zinc-900 w-full sm:w-24" style={{ borderColor: "var(--brand-border)" }} min="0" step="any" />
                    <select value={e.status} onChange={(v) => updateEntry(i, "status", v.target.value)}
                      className="rounded border px-2 py-1 bg-zinc-900 w-full sm:w-24" style={{ borderColor: "var(--brand-border)" }}>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <input type="datetime-local" value={e.date} onChange={(v) => updateEntry(i, "date", v.target.value)}
                      className="rounded border px-2 py-1 bg-zinc-900 w-full sm:w-40" style={{ borderColor: "var(--brand-border)" }} />
                    <input type="text" placeholder="Note" value={e.note} onChange={(v) => updateEntry(i, "note", v.target.value)}
                      className="rounded border px-2 py-1 bg-zinc-900 w-full sm:w-28" style={{ borderColor: "var(--brand-border)" }} />
                    <button type="button" onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-300 col-span-2 sm:col-auto justify-self-end">✕</button>
                  </div>
                ))}
                <button type="button" onClick={addEntry} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add transaction</button>
              </div>
            </details>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
              Create User {form.creditAmount && parseFloat(form.creditAmount) > 0 ? `& Credit ${form.creditAmount} ${form.creditAsset}` : ""}
              {historyEntries.filter(e => e.amount).length > 0 ? ` + ${historyEntries.filter(e => e.amount).length} history entries` : ""}
            </button>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--brand-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400" style={{ borderBottom: "1px solid var(--brand-border)" }}>
                <th className="p-3">Username</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Account #</th>
                <th className="p-3">SWIFT</th>
                <th className="p-3">Role</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Txns</th>
                <th className="p-3">Joined</th>
                <th className="p-3 w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-900/30" style={{ borderBottom: "1px solid var(--brand-border)" }}>
                  <td className="p-3 font-medium">{u.username}</td>
                  <td className="p-3 text-zinc-400">{u.name || "—"}</td>
                  <td className="p-3 text-zinc-400">{u.email}</td>
                  <td className="p-3 font-mono text-xs text-zinc-400">{u.accountNumber || "—"}</td>
                  <td className="p-3 font-mono text-xs text-zinc-400">{u.swiftCode || "—"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={u.isVerified ? "text-emerald-400" : "text-red-400"}>{u.isVerified ? "Yes" : "No"}</span>
                  </td>
                  <td className="p-3 text-zinc-400">{u._count.transactions}</td>
                  <td className="p-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => setDeletingId(u.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="rounded-xl border p-6 bg-zinc-900 max-w-sm w-full mx-4" style={{ borderColor: "var(--brand-border)" }}>
              <h3 className="text-lg font-semibold mb-2">Delete User</h3>
              <p className="text-sm text-zinc-400 mb-4">Are you sure you want to delete this user? All associated data (transactions, holdings, notifications, messages) will be permanently removed. This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeletingId(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  )
}
