"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { brand } from "@/lib/brand"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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

    router.push("/login")
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

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="hover:underline" style={{ color: "var(--brand-primary)" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
