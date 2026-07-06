"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { brand } from "@/lib/brand"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo size={48} showText={false} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>{brand.name}</h1>
          <p className="text-zinc-400 mt-2">Create your account</p>
        </div>

        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--brand-foreground)" }}>Account Created!</h2>
            <p className="text-zinc-400 mb-6">Your account has been created successfully. You can now sign in.</p>
            <Link
              href="/login"
              className="inline-block rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Sign In
            </Link>
          </div>
        ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
              style={{ borderColor: "var(--brand-border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
              style={{ borderColor: "var(--brand-border)" }}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
              style={{ borderColor: "var(--brand-border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
              style={{ borderColor: "var(--brand-border)" }}
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {loading ? <span className="animate-spin-logo text-lg">⟳</span> : "Create Account"}
          </button>
        </form>
        )}

        {!done && (
        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="hover:underline" style={{ color: "var(--brand-primary)" }}>
            Sign In
          </Link>
        </p>
        )}
      </div>
    </div>
  )
}
