"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

type Txn = {
  id: string
  userId: string
  type: string
  assetType: string
  amount: number
  fee: number
  status: string
  note: string | null
  createdAt: string
  method?: { name: string } | null
  user?: { username: string; name: string | null; email: string }
}

export default function AdminTransactionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [transactions, setTransactions] = useState<Txn[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ type: "", assetType: "", amount: 0, fee: 0, status: "", note: "", createdAt: "" })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && !isAdmin) router.push("/dashboard")
  }, [status, isAdmin, router])

  const load = () => {
    if (isAdmin) {
      fetch("/api/admin/transactions").then((r) => r.json()).then((d) => setTransactions(d.transactions || []))
    }
  }

  useEffect(load, [isAdmin])

  const startEdit = (tx: Txn) => {
    setEditingId(tx.id)
    setEditForm({ type: tx.type, assetType: tx.assetType, amount: tx.amount, fee: tx.fee, status: tx.status, note: tx.note || "", createdAt: tx.createdAt ? new Date(tx.createdAt).toISOString().slice(0, 16) : "" })
  }

  const saveEdit = async () => {
    const res = await fetch("/api/admin/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editForm }),
    })
    if (res.ok) {
      setEditingId(null)
      load()
    }
  }

  const deleteTx = async (id: string) => {
    if (!confirm("Delete this transaction?")) return
    await fetch(`/api/admin/transactions/${id}`, { method: "DELETE" })
    load()
  }

  if (status === "loading" || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  const statusColors: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-yellow-500/10 text-yellow-400",
    failed: "bg-red-500/10 text-red-400",
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Manage Transactions</h1>

        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--brand-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400" style={{ borderBottom: "1px solid var(--brand-border)" }}>
                <th className="p-3">User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Fee</th>
                <th className="p-3">Status</th>
                <th className="p-3">Note</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-900/30" style={{ borderBottom: "1px solid var(--brand-border)" }}>
                  {editingId === tx.id ? (
                    <>
                      <td className="p-3 text-zinc-400">{tx.user?.username || tx.userId.slice(0, 8)}</td>
                      <td className="p-3">
                        <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900" style={{ borderColor: "var(--brand-border)" }}>
                          <option value="deposit">deposit</option>
                          <option value="withdrawal">withdrawal</option>
                          <option value="transfer">transfer</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select value={editForm.assetType} onChange={(e) => setEditForm({ ...editForm, assetType: e.target.value })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900" style={{ borderColor: "var(--brand-border)" }}>
                          {["USD", "EUR", "GBP", "BTC", "ETH", "SOL"].map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900 w-24" style={{ borderColor: "var(--brand-border)" }} />
                      </td>
                      <td className="p-3">
                        <input type="number" value={editForm.fee} onChange={(e) => setEditForm({ ...editForm, fee: parseFloat(e.target.value) || 0 })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900 w-20" style={{ borderColor: "var(--brand-border)" }} />
                      </td>
                      <td className="p-3">
                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900" style={{ borderColor: "var(--brand-border)" }}>
                          <option value="pending">pending</option>
                          <option value="completed">completed</option>
                          <option value="failed">failed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input type="text" value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900 w-28" style={{ borderColor: "var(--brand-border)" }} />
                      </td>
                      <td className="p-3">
                        <input type="datetime-local" value={editForm.createdAt} onChange={(e) => setEditForm({ ...editForm, createdAt: e.target.value })}
                          className="rounded border px-2 py-1 text-xs bg-zinc-900 w-40" style={{ borderColor: "var(--brand-border)" }} />
                      </td>
                      <td className="p-3 flex gap-1">
                        <button onClick={saveEdit} className="text-xs text-emerald-400 hover:underline">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-zinc-500 hover:underline">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 font-medium">{tx.user?.username || tx.userId.slice(0, 8)}</td>
                      <td className="p-3 capitalize">{tx.type}</td>
                      <td className="p-3">{tx.assetType}</td>
                      <td className="p-3">{tx.amount.toLocaleString()}</td>
                      <td className="p-3 text-zinc-500">{tx.fee || "—"}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[tx.status] || ""}`}>{tx.status}</span>
                      </td>
                      <td className="p-3 text-zinc-500 text-xs max-w-[120px] truncate">{tx.note || "—"}</td>
                      <td className="p-3 text-zinc-500 text-xs whitespace-nowrap">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => startEdit(tx)} className="text-xs text-indigo-400 hover:underline">Edit</button>
                        <button onClick={() => deleteTx(tx.id)} className="text-xs text-red-400 hover:underline">Del</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
