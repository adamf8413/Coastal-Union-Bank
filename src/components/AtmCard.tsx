"use client"

import { useEffect, useState } from "react"
import { brand as defaultBrand } from "@/lib/brand"

type AtmCardProps = {
  accountNumber?: string | null
  routingNumber?: string | null
  userName?: string | null
}

export function AtmCard({ accountNumber, routingNumber, userName }: AtmCardProps) {
  const [name, setName] = useState(defaultBrand.name)
  const [shortName, setShortName] = useState(defaultBrand.shortName)

  useEffect(() => {
    fetch("/api/brand-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.name) setName(cfg.name)
        if (cfg?.shortName) setShortName(cfg.shortName)
      })
      .catch(() => {})
  }, [])

  const displayNumber = accountNumber
    ? accountNumber.replace(/(.{4})/g, "$1 ").trim().padEnd(19, "·")
    : "···· ···· ···· ····"

  const displayName = userName?.toUpperCase() || "CARDHOLDER"

  return (
    <div
      className="relative w-full max-w-sm rounded-2xl p-6 text-white overflow-hidden select-none"
      style={{
        background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark) 50%, #1e1b4b)",
        boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

      {/* Top row */}
      <div className="flex items-center justify-between mb-8 relative">
        <span className="text-xs font-semibold tracking-wider opacity-80">{shortName}</span>
        {/* Decorative chip */}
        <div className="flex items-center gap-1">
          <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-300 to-yellow-600 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-yellow-200/30 rounded" />
          </div>
        </div>
      </div>

      {/* Card number */}
      <div className="mb-2 relative">
        <p className="text-xl tracking-[6px] font-mono font-light">{displayNumber}</p>
      </div>
      {routingNumber && (
        <div className="mb-6 relative">
          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Routing</p>
          <p className="text-sm font-mono tracking-wider">{routingNumber}</p>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-end justify-between relative">
        <div>
          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Cardholder</p>
          <p className="text-sm font-medium tracking-wide">{displayName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Valid</p>
          <p className="text-sm font-mono">12/28</p>
        </div>
      </div>
    </div>
  )
}
