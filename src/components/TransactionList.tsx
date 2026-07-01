"use client"

import Link from "next/link"

type Tx = {
  id: string
  type: string
  assetType: string
  amount: number
  fee: number
  status: string
  createdAt: string
  method?: { name: string } | null
  recipient?: { username: string } | null
  note?: string | null
}

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  pending_otp: "bg-yellow-500/10 text-yellow-400",
  pending_cop: "bg-purple-500/10 text-purple-400",
  failed: "bg-red-500/10 text-red-400",
}

export function TransactionList({ transactions }: { transactions: Tx[] }) {
  if (transactions.length === 0) {
    return <div className="text-zinc-500 text-center py-8">No transactions yet</div>
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium">
                {tx.type === "deposit" ? "Deposit" : tx.type === "transfer" ? "Transfer" : tx.type} {tx.assetType}
              </div>
              <div className="text-sm text-zinc-500">
                {tx.type === "transfer" && tx.recipient ? `To: ${tx.recipient.username} · ` : ""}
                {new Date(tx.createdAt).toLocaleDateString()}
                {tx.method?.name ? ` via ${tx.method.name}` : ""}
              </div>
              {tx.note && <div className="text-xs text-zinc-600 mt-0.5">{tx.note}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {tx.type === "transfer" ? "-" : "+"}{tx.amount.toLocaleString()} {tx.assetType}
            </div>
            <div className="flex items-center gap-2 justify-end">
              {tx.fee > 0 && <span className="text-xs text-zinc-500">Fee: {tx.fee}</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[tx.status] || ""}`}>
                {tx.status === "pending_otp" ? "pending" : tx.status}
              </span>
              {tx.status === "completed" && (
                <Link href={`/receipt/${tx.id}`} className="text-xs text-indigo-400 hover:text-indigo-300">
                  Receipt
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
