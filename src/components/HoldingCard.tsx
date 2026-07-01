"use client"

type HoldingCardProps = {
  assetType: string
  amount: number
  value: number
  price: number
  change24h: number
}

const assetColors: Record<string, string> = {
  USD: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  EUR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  GBP: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  BTC: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  ETH: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  SOL: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
}

const assetIcons: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", BTC: "₿", ETH: "Ξ", SOL: "◎",
}

export function HoldingCard({ assetType, amount, value, change24h }: HoldingCardProps) {
  const colorClass = assetColors[assetType] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{assetIcons[assetType] || assetType[0]}</span>
        <span className={`text-xs font-medium ${change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
        </span>
      </div>
      <div className="text-2xl font-bold mb-1">
        {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
      </div>
      <div className="text-sm opacity-70">{assetType}</div>
      <div className="text-sm mt-1">
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  )
}
