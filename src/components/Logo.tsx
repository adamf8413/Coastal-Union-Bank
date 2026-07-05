"use client"

import { useEffect, useState, useId } from "react"
import { brand as defaultBrand } from "@/lib/brand"

type LogoProps = {
  size?: number
  showText?: boolean
  textClass?: string
}

export function Logo({ size = 32, showText = true, textClass = "text-indigo-400" }: LogoProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [name, setName] = useState(defaultBrand.name)
  const uid = useId()

  useEffect(() => {
    fetch("/api/brand-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.logoSvg) setSvg(cfg.logoSvg)
        if (cfg?.name) setName(cfg.name)
      })
      .catch(() => {})
  }, [])

  const svgToRender = svg ?? defaultBrand.logoSvg
  const uniqueSvg = svgToRender
    .replace(/id="/g, `id="${uid}-`)
    .replace(/url\(#/g, `url(#${uid}-`)
    .replace(/\s(width|height)="[^"]*"/g, "")

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-shrink-0"
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: uniqueSvg }}
      />
      {showText && <span className={`font-bold text-lg ${textClass}`}>{name}</span>}
    </div>
  )
}
