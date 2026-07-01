"use client"

type Method = {
  id: string
  name: string
  type: string
  fee: number
  processingTime: string
  minAmount: number
  maxAmount: number
}

type Props = {
  method: Method
  selected: boolean
  onSelect: () => void
}

export function DepositMethodCard({ method, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        selected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{method.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          method.type === "crypto" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
        }`}>
          {method.type}
        </span>
      </div>
      <div className="flex gap-4 text-sm text-zinc-400">
        <span>Fee: {method.fee === 0 ? "Free" : `${method.fee}%`}</span>
        <span>{method.processingTime}</span>
      </div>
      <div className="text-sm text-zinc-500 mt-1">
        ${method.minAmount.toLocaleString()} - ${method.maxAmount.toLocaleString()}
      </div>
    </button>
  )
}
