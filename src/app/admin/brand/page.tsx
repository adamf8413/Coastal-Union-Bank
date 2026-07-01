"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { brand as defaultBrand, defaultLogoSvg } from "@/lib/brand"
import type { Brand } from "@/lib/brand"

type ColorGroup = {
  label: string
  key: keyof Brand["colors"]
  keys: (keyof Brand["colors"])[]
}

const groups: ColorGroup[] = [
  { label: "Primary", key: "primary", keys: ["primary", "primaryHover", "primaryLight", "primaryDark"] },
  { label: "Accent", key: "accent", keys: ["accent", "accentHover"] },
  { label: "Surfaces", key: "background", keys: ["background", "foreground", "card", "cardHover", "border"] },
  { label: "Semantic", key: "success", keys: ["success", "warning", "danger", "info", "muted"] },
  { label: "Text", key: "textPrimary", keys: ["textPrimary", "textSecondary", "textMuted"] },
]

const heroKeys = ["gradientFrom", "gradientVia", "gradientTo", "glowColor", "particleColor", "cardBadgeColor"] as const

export default function AdminBrandPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const [config, setConfig] = useState<Brand>(defaultBrand)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && !isAdmin) router.push("/dashboard")
  }, [status, isAdmin, router])

  useEffect(() => {
    fetch("/api/brand-config")
      .then((r) => r.json())
      .then((d) => { setConfig(d); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const updateColor = useCallback((key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }))
  }, [])

  const updateHero = useCallback((key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    const res = await fetch("/api/admin/brand-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colors: config.colors, hero: config.hero, logoSvg: config.logoSvg }),
    })
    if (res.ok) {
      setMessage("Saved! Refresh page to see all changes.")
      document.documentElement.style.setProperty("--brand-primary", config.colors.primary)
    } else {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const handleReset = async () => {
    setConfig(defaultBrand)
    const res = await fetch("/api/admin/brand-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colors: defaultBrand.colors, hero: defaultBrand.hero, logoSvg: defaultLogoSvg }),
    })
    if (res.ok) {
      setMessage("Reset to defaults!")
    } else {
      setMessage("Failed to reset")
    }
  }

  if (status === "loading" || !isAdmin || !loaded) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-2">Brand Settings</h1>
        <p className="text-sm text-zinc-400 mb-6">Customize colors, hero gradient, and more. Changes apply site-wide.</p>

        {/* Color Palette */}
        {groups.map((group) => (
          <div key={group.label} className="mb-6 rounded-xl border p-5" style={{ borderColor: "var(--brand-border)" }}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">{group.label}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.keys.map((key) => (
                <div key={key}>
                  <label className="block text-xs text-zinc-500 mb-1">{key}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors[key]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="h-9 w-9 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.colors[key]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="flex-1 rounded-lg border bg-zinc-900 px-3 py-1.5 text-xs font-mono"
                      style={{ borderColor: "var(--brand-border)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Hero Section */}
        <div className="mb-6 rounded-xl border p-5" style={{ borderColor: "var(--brand-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">Hero / Gradient</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {heroKeys.map((key) => (
              <div key={key}>
                <label className="block text-xs text-zinc-500 mb-1">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(config.hero as any)[key]}
                    onChange={(e) => updateHero(key, e.target.value)}
                    className="h-9 w-9 rounded border border-zinc-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(config.hero as any)[key]}
                    onChange={(e) => updateHero(key, e.target.value)}
                    className="flex-1 rounded-lg border bg-zinc-900 px-3 py-1.5 text-xs font-mono"
                    style={{ borderColor: "var(--brand-border)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Editor */}
        <div className="mb-6 rounded-xl border p-5" style={{ borderColor: "var(--brand-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">Logo (SVG)</h2>
          <div className="flex items-center gap-6 mb-4">
            <div
              className="flex-shrink-0 rounded-xl border p-3"
              style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}
            >
              <div
                className="w-16 h-16"
                dangerouslySetInnerHTML={{
                  __html: config.logoSvg || defaultLogoSvg,
                }}
              />
            </div>
            <div className="text-xs text-zinc-500">
              <p>Paste any valid SVG code above. Recommended size: 64×64 viewBox.</p>
              <p className="mt-1">Use <code className="text-indigo-400">{`{gradientId}`}</code> as a placeholder for dynamic gradient IDs if needed.</p>
            </div>
          </div>
          {logoError && <p className="text-xs text-red-400 mb-2">Invalid SVG — preview may not render correctly</p>}
          <textarea
            value={config.logoSvg}
            onChange={(e) => {
              setConfig((prev) => ({ ...prev, logoSvg: e.target.value }))
              try {
                const p = new DOMParser()
                const doc = p.parseFromString(e.target.value, "image/svg+xml")
                setLogoError(doc.querySelector("parsererror") !== null)
              } catch { setLogoError(true) }
            }}
            className="w-full rounded-lg border bg-zinc-900 px-3 py-2 text-xs font-mono leading-relaxed"
            style={{ borderColor: "var(--brand-border)" }}
            rows={10}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div
          className="mb-6 rounded-xl p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${config.hero.gradientFrom}, ${config.hero.gradientVia}, ${config.hero.gradientTo})`,
          }}
        >
          <p className="text-lg font-bold" style={{ color: config.colors.primary }}>Preview</p>
          <div className="mt-2 flex justify-center gap-4">
            <span
              className="inline-block rounded-full px-4 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: config.colors.primary }}
            >
              {config.colors.primary}
            </span>
            <span
              className="inline-block rounded-full px-4 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: config.colors.accent }}
            >
              {config.colors.accent}
            </span>
          </div>
        </div>

        {message && (
          <p className={`text-sm mb-4 ${message.includes("Failed") ? "text-red-400" : "text-emerald-400"}`}>{message}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg px-6 py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </main>
    </>
  )
}
