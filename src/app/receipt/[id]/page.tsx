"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"

type ReceiptTx = {
  id: string
  type: string
  assetType: string
  amount: number
  fee: number
  status: string
  note: string | null
  accountNumber: string | null
  routingNumber: string | null
  swiftCode: string | null
  recipientBank: string | null
  transferType: string | null
  accountName: string | null
  bankAddress: string | null
  country: string | null
  createdAt: string
  user: { username: string; name: string | null }
  recipient: { username: string; name: string | null } | null
}

export default function ReceiptPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [tx, setTx] = useState<ReceiptTx | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return }
    if (!session || !params.id) return
    fetch(`/api/transfer/${params.id}/receipt`)
      .then(r => r.json())
      .then(d => { setTx(d.receipt); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [session, status, params.id, router])

  if (status === "loading" || loading) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  if (!tx) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Receipt not found</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <div className="rounded-xl border p-6 text-center" style={{ borderColor: "var(--brand-border)" }}>
          <div className="text-5xl mb-3">🧾</div>
          <h1 className="text-2xl font-bold mb-1">Transfer Receipt</h1>
          <p className="text-xs text-zinc-500 mb-6">ID: {tx.id}</p>

          <div className="space-y-3 text-left text-sm">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Status</span>
              <span className="text-emerald-400 font-medium">{tx.status}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Type</span>
              <span>{tx.transferType === "international" ? "International Transfer" : "Local Transfer"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Amount</span>
              <span className="font-bold">{tx.amount} {tx.assetType}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Fee</span>
              <span>{tx.fee} {tx.assetType}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Sender</span>
              <span>{tx.user.name || tx.user.username}</span>
            </div>
            {tx.recipient && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Recipient</span>
                <span>{tx.recipient.name || tx.recipient.username}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Bank</span>
              <span>{tx.recipientBank || "N/A"}</span>
            </div>
            {tx.accountName && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Account Name</span>
                <span>{tx.accountName}</span>
              </div>
            )}
            {tx.accountNumber && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Account Number</span>
                <span>{tx.accountNumber}</span>
              </div>
            )}
            {tx.routingNumber && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Routing / IBAN</span>
                <span>{tx.routingNumber}</span>
              </div>
            )}
            {tx.swiftCode && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">SWIFT Code</span>
                <span>{tx.swiftCode}</span>
              </div>
            )}
            {tx.bankAddress && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Bank Address</span>
                <span className="text-right text-xs max-w-[200px]">{tx.bankAddress}</span>
              </div>
            )}
            {tx.country && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Country</span>
                <span>{tx.country}</span>
              </div>
            )}
            {tx.note && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Note</span>
                <span>{tx.note}</span>
              </div>
            )}
            <div className="flex justify-between pb-2">
              <span className="text-zinc-400">Date</span>
              <span>{new Date(tx.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button onClick={() => router.push("/transactions")} className="flex-1 rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              All Transactions
            </button>
            <button onClick={() => window.print()} className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors">
              Print Receipt
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
