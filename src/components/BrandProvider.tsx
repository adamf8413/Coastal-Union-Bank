"use client"

import { useEffect, useState, type ReactNode } from "react"
import { brandConfigToCssVars } from "@/lib/brand-db"
import type { Brand } from "@/lib/brand"

export function BrandProvider({ children, initial }: { children: ReactNode; initial?: Brand }) {
  const [vars, setVars] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/brand-config")
        if (res.ok) {
          const config: Brand = await res.json()
          setVars(brandConfigToCssVars(config))
        }
      } catch {
        // use defaults
      }
    }
    load()
  }, [])

  const resolved = vars ?? (initial ? brandConfigToCssVars(initial) : {})

  return <div style={resolved as React.CSSProperties}>{children}</div>
}
