"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

type ChartData = {
  name: string
  value: number
  color: string
}

const COLORS: Record<string, string> = {
  USD: "#22c55e",
  EUR: "#3b82f6",
  GBP: "#ec4899",
  BTC: "#f97316",
  ETH: "#a855f7",
  SOL: "#06b6d4",
}

export function PortfolioChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) return null

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.name] || "#6366f1"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#13131a",
              border: "1px solid #1e1e2e",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            formatter={(value) => [`$${(value as number).toLocaleString()}`, "Value"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
