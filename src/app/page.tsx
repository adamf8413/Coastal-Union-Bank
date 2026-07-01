"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { brand } from "@/lib/brand"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard")
  }, [status, router])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  if (session) return null
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-background)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--brand-primary)" />
            <path d="M16 6c5.5 0 10 4.5 10 10s-4.5 10-10 10S6 21.5 6 16 10.5 6 16 6z" fill="#fff" opacity="0.2" />
            <path d="M16 10c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" fill="#fff" opacity="0.4" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span className="font-bold text-lg" style={{ color: "var(--brand-foreground)" }}>{brand.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Flying Birds */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="bird bird-1">
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
              <path d="M0 12 Q10 0 20 12 Q30 24 40 12" stroke="var(--brand-primary)" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M0 12 Q10 4 20 12 Q30 20 40 12" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" opacity="0.15" />
            </svg>
          </div>
          <div className="bird bird-2">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
              <path d="M0 10 Q8 2 16 10 Q24 18 32 10" stroke="var(--brand-accent)" strokeWidth="2" fill="none" opacity="0.25" />
            </svg>
          </div>
          <div className="bird bird-3">
            <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
              <path d="M0 8 Q7 0 14 8 Q21 16 28 8" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" opacity="0.2" />
            </svg>
          </div>
          <div className="bird bird-4">
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
              <path d="M0 11 Q9 0 18 11 Q27 22 36 11" stroke="var(--brand-accent)" strokeWidth="1.5" fill="none" opacity="0.15" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl w-full relative z-10">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-4 tracking-wide uppercase"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
                color: "white",
              }}
            >
              {brand.shortName} · Premium Digital Banking
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{
                background: "linear-gradient(135deg, var(--brand-foreground) 0%, var(--brand-primary-light) 50%, var(--brand-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Banking Made Simple
            </h1>
            <p className="text-lg text-zinc-400 max-w-md mx-auto lg:mx-0 mb-8">
              Manage USD, EUR, GBP, and crypto all in one place. Send money, track your portfolio, and grow your wealth securely.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))",
                }}
              >
                Open Free Account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--brand-border)",
                  color: "var(--brand-foreground)",
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right: Lady holding ATM card */}
          <div className="flex-shrink-0 relative">
            <div className="relative" style={{ animation: "float 6s ease-in-out infinite" }}>
              {/* Lady silhouette */}
              <svg width="320" height="380" viewBox="0 0 320 380" fill="none">
                {/* Hair */}
                <ellipse cx="160" cy="80" rx="70" ry="75" fill="var(--brand-primary-dark)" opacity="0.8" />
                {/* Face */}
                <ellipse cx="160" cy="95" rx="38" ry="42" fill="#fcd9b6" />
                {/* Eyes */}
                <circle cx="148" cy="88" r="4" fill="#1a1a2e" />
                <circle cx="172" cy="88" r="4" fill="#1a1a2e" />
                {/* Smile */}
                <path d="M150 102 Q160 112 170 102" stroke="#c4956a" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Body - dress/top */}
                <path d="M128 135 L192 135 L210 260 L110 260 Z" fill="var(--brand-primary)" opacity="0.85" />
                {/* Left arm - pointing at card */}
                <path d="M128 160 Q100 170 85 190 Q75 205 80 210" stroke="#fcd9b6" strokeWidth="14" fill="none" strokeLinecap="round" />
                {/* Right arm - holding card area */}
                <path d="M192 160 Q220 165 235 180 Q245 190 240 200" stroke="#fcd9b6" strokeWidth="14" fill="none" strokeLinecap="round" />
                {/* ATM Card in right hand */}
                <rect x="218" y="185" width="58" height="38" rx="5" fill="#1a1a2e" stroke="#6366f1" strokeWidth="2" transform="rotate(-15, 247, 204)" />
                <rect x="224" y="192" width="46" height="3" rx="1.5" fill="#6366f1" transform="rotate(-15, 247, 204)" />
                <rect x="224" y="199" width="30" height="2" rx="1" fill="#6366f1" opacity="0.5" transform="rotate(-15, 247, 204)" />
                <circle cx="258" cy="214" r="4" fill="#6366f1" opacity="0.6" transform="rotate(-15, 247, 204)" />
                {/* Card glow */}
                <rect x="218" y="185" width="58" height="38" rx="5" fill="none" stroke="var(--brand-primary)" strokeWidth="3" opacity="0.4" transform="rotate(-15, 247, 204)" />
                {/* Neck */}
                <rect x="154" y="130" width="12" height="12" rx="6" fill="#fcd9b6" />
                {/* Skirt */}
                <path d="M110 260 Q90 280 85 310 L235 310 Q230 280 210 260 Z" fill="var(--brand-primary)" opacity="0.6" />
                {/* Ground shadow */}
                <ellipse cx="160" cy="320" rx="90" ry="8" fill="black" opacity="0.15" />
              </svg>
              {/* Sparkle effects around card */}
              <div className="absolute" style={{ top: "165px", right: "30px", animation: "sparkle 2s ease-in-out infinite" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="var(--brand-accent)" opacity="0.6" />
                </svg>
              </div>
              <div className="absolute" style={{ top: "155px", right: "70px", animation: "sparkle 2s ease-in-out 0.7s infinite" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0 L6.5 3.5 L10 5 L6.5 6.5 L5 10 L3.5 6.5 L0 5 L3.5 3.5 Z" fill="var(--brand-primary)" opacity="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Futures & Markets Section */}
      <section className="w-full px-6 py-20" style={{ background: "var(--brand-background)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-4 tracking-wide uppercase"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
                color: "white",
              }}
            >
              Markets & Futures
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, var(--brand-foreground) 0%, var(--brand-primary-light) 50%, var(--brand-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Trade Futures Across Global Markets
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Access crypto, commodity, index, and currency futures with competitive margins and real-time execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - Crypto Futures */}
            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))",
                border: "1px solid var(--brand-border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M12 2V22M2 8.5L22 15.5M22 8.5L2 15.5" stroke="white" strokeWidth="1" opacity="0.5"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand-foreground)" }}>Crypto Futures</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                Trade BTC, ETH, and SOL futures with up to 10x leverage. Deep liquidity and tight spreads around the clock.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--brand-primary)" }}>
                <span>Explore markets</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Card 2 - Commodity Futures */}
            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))",
                border: "1px solid var(--brand-border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, var(--brand-accent), #be185d)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21H21M6 18V10M10 18V6M14 18V9M18 18V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand-foreground)" }}>Commodity Futures</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                Gold, silver, oil, and agricultural commodities. Hedge against inflation with physical delivery options.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--brand-accent)" }}>
                <span>View commodities</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Card 3 - Index Futures */}
            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))",
                border: "1px solid var(--brand-border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12H18L15 21L9 3L6 12H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand-foreground)" }}>Index Futures</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                S&P 500, NASDAQ, FTSE, and Nikkei. Diversify your portfolio with broad market exposure at low cost.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#22c55e" }}>
                <span>Track indices</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Card 4 - Currency Futures */}
            <div
              className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))",
                border: "1px solid var(--brand-border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M12 7V17M8 10H14C14.6667 10 16 10.4 16 12C16 13.6 14.6667 14 14 14H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand-foreground)" }}>Currency Futures</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                EUR/USD, GBP/USD, USD/JPY and more. Benefit from forex liquidity with standardized futures contracts.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#3b82f6" }}>
                <span>See forex pairs</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Market Ticker */}
          <div
            className="mt-14 rounded-2xl p-8 overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))",
              border: "1px solid var(--brand-border)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--brand-foreground)" }}>Live Market Overview</h3>
                <p className="text-sm text-zinc-500">Real-time futures pricing · 24h change</p>
              </div>
              <div
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                ● Live
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-xs text-zinc-500 mb-1">BTC/USD</div>
                <div className="text-sm font-semibold" style={{ color: "var(--brand-foreground)" }}>$68,423</div>
                <div className="text-xs" style={{ color: "#22c55e" }}>+2.4%</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-xs text-zinc-500 mb-1">ETH/USD</div>
                <div className="text-sm font-semibold" style={{ color: "var(--brand-foreground)" }}>$3,852</div>
                <div className="text-xs" style={{ color: "#ef4444" }}>-1.2%</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-xs text-zinc-500 mb-1">S&P 500</div>
                <div className="text-sm font-semibold" style={{ color: "var(--brand-foreground)" }}>5,672.80</div>
                <div className="text-xs" style={{ color: "#22c55e" }}>+0.8%</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-xs text-zinc-500 mb-1">Gold</div>
                <div className="text-sm font-semibold" style={{ color: "var(--brand-foreground)" }}>$2,341</div>
                <div className="text-xs" style={{ color: "#22c55e" }}>+0.5%</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 font-medium text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
              }}
            >
              Start Trading Futures Today
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .bird {
          position: absolute;
          animation: fly linear infinite;
        }
        .bird-1 {
          top: 12%;
          left: -60px;
          animation-duration: 18s;
          animation-delay: 0s;
        }
        .bird-2 {
          top: 25%;
          left: -60px;
          animation-duration: 22s;
          animation-delay: 3s;
        }
        .bird-3 {
          top: 8%;
          left: -60px;
          animation-duration: 15s;
          animation-delay: 7s;
        }
        .bird-4 {
          top: 20%;
          left: -60px;
          animation-duration: 20s;
          animation-delay: 11s;
        }
        @keyframes fly {
          0% { transform: translateX(-60px) scale(1); }
          50% { transform: translateX(calc(100vw + 60px)) scale(0.8); }
          100% { transform: translateX(calc(100vw + 60px)) scale(0.6); }
        }
      `}</style>
    </div>
  )
}
