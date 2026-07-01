"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { brand } from "@/lib/brand"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "otp">("form")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpCode, setOtpCode] = useState("")

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/login/otp-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()

    if (res.ok) {
      setStep("otp")
      setOtpCode(data.code || "")
    } else {
      setError(data.error || "Invalid username or password")
    }
    setLoading(false)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/login/otp-finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code }),
    })

    if (res.ok) {
      const signInResult = await signIn("credentials", { username, password, redirect: false })
      if (signInResult?.error) {
        setError("Failed to sign in")
        setLoading(false)
      } else {
        router.push("/dashboard")
      }
    } else {
      const data = await res.json()
      setError(data.error || "Invalid code")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Logo size={48} showText={false} />
            <h1 className="text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>{brand.name}</h1>
          </div>
          <p className="text-zinc-400">
            {step === "otp" ? "Check your email for a code" : "Sign in to your portfolio"}
          </p>
        </div>

        {step === "form" && (
          <form onSubmit={handleInit} className="space-y-4">
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
        )}

        {step === "otp" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-zinc-400">
              A verification code was sent to the email on file for <strong>{username}</strong>
            </p>
            {otpCode && (
              <div className="rounded-lg border border-dashed border-zinc-600 p-3 text-center">
                <p className="text-xs text-zinc-500 mb-1">Dev mode — OTP code:</p>
                <p className="text-2xl tracking-widest font-mono font-bold text-emerald-400">{otpCode}</p>
              </div>
            )}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-2xl tracking-widest focus:outline-none"
                style={{ borderColor: "var(--brand-border)" }}
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 rounded-lg border border-zinc-700 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {loading ? <span className="animate-spin-logo text-lg">⟳</span> : "Verify & Sign In"}
              </button>
            </div>
          </form>
        )}

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
