 "use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { brand } from "@/lib/brand"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const signInResult = await signIn("credentials", { username, password, redirect: false })
    if (signInResult?.error) {
      // Check if user is admin — if so, use admin endpoint as fallback
      const checkRes = await fetch("/api/login/check-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const checkData = await checkRes.json()
      if (checkData.role === "ADMIN") {
        const adminRes = await fetch("/api/login/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
        if (adminRes.ok) {
          window.location.href = "/dashboard"
          return
        }
      }
      setError("Invalid username or password")
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Logo size={48} showText={false} />
            <h1 className="text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>{brand.name}</h1>
          </div>
          <p className="text-zinc-400">Sign in to your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "var(--brand-border)", "--tw-ring-color": "var(--brand-primary)" } as any}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "var(--brand-border)" } as any}
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "var(--brand-primary)" }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--brand-primary-hover)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--brand-primary)"}
          >
            {loading ? <span className="animate-spin-logo text-lg">⟳</span> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          No account?{" "}
          <Link href="/register" className="hover:underline" style={{ color: "var(--brand-primary)" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
