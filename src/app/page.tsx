import Link from "next/link"
import { brand } from "@/lib/brand"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-background)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="60" height="60" rx="16" fill="var(--brand-primary)" />
            <circle cx="32" cy="16" r="3.5" fill="var(--brand-accent)" />
            <circle cx="32" cy="16" r="5.5" fill="var(--brand-accent)" opacity="0.25" />
            <line x1="14" y1="28" x2="50" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
            <path d="M14 34 Q22 28, 32 34 Q42 40, 50 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M14 41 Q22 35, 32 41 Q42 47, 50 41" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M14 48 Q22 42, 32 48 Q42 54, 50 48" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
          </svg>
          <span className="font-bold text-sm sm:text-lg truncate" style={{ color: "var(--brand-foreground)" }}>{brand.shortName}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Link href="/login" className="text-xs sm:text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-2 sm:px-4 py-1.5 sm:py-2">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-xs sm:text-sm font-medium text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
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

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl w-full relative z-10">
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
            <div className="hidden lg:flex flex-wrap gap-3 justify-center lg:justify-start">
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

          {/* Right: Bank building illustration */}
          <div className="relative max-w-full min-w-0">
            <div className="relative" style={{ animation: "float 6s ease-in-out infinite" }}>
              <svg width="320" height="380" viewBox="0 0 320 380" fill="none" style={{ maxWidth: "100%", height: "auto" }}>
                {/* Ground */}
                <rect x="0" y="290" width="320" height="10" rx="4" fill="var(--brand-primary)" opacity="0.15" />
                <ellipse cx="160" cy="330" rx="140" ry="8" fill="black" opacity="0.08" />

                {/* Bank Building */}
                <rect x="80" y="120" width="160" height="170" rx="8" fill="var(--brand-primary-dark)" opacity="0.9" />
                {/* Bank front highlight */}
                <rect x="88" y="128" width="144" height="162" rx="6" fill="var(--brand-background)" opacity="0.15" />
                {/* Pediment / Triangle roof */}
                <path d="M70 120 L160 65 L250 120 Z" fill="var(--brand-primary)" />
                <path d="M80 120 L160 73 L240 120 Z" fill="var(--brand-primary-dark)" />
                {/* Columns */}
                <rect x="100" y="135" width="14" height="80" rx="3" fill="var(--brand-background)" opacity="0.3" />
                <rect x="152" y="135" width="14" height="80" rx="3" fill="var(--brand-background)" opacity="0.3" />
                <rect x="205" y="135" width="14" height="80" rx="3" fill="var(--brand-background)" opacity="0.3" />
                {/* Column capitals */}
                <rect x="96" y="132" width="22" height="6" rx="2" fill="var(--brand-background)" opacity="0.4" />
                <rect x="148" y="132" width="22" height="6" rx="2" fill="var(--brand-background)" opacity="0.4" />
                <rect x="201" y="132" width="22" height="6" rx="2" fill="var(--brand-background)" opacity="0.4" />
                {/* Door */}
                <rect x="140" y="218" width="40" height="65" rx="20" fill="#1a1a2e" />
                <rect x="145" y="222" width="30" height="58" rx="18" fill="var(--brand-primary)" opacity="0.4" />
                {/* Door handle */}
                <circle cx="170" cy="252" r="3" fill="var(--brand-accent)" opacity="0.8" />
                {/* Windows */}
                <rect x="110" y="150" width="36" height="28" rx="4" fill="#1a1a2e" />
                <rect x="112" y="152" width="32" height="24" rx="3" fill="var(--brand-accent)" opacity="0.15" />
                <rect x="172" y="150" width="36" height="28" rx="4" fill="#1a1a2e" />
                <rect x="174" y="152" width="32" height="24" rx="3" fill="var(--brand-accent)" opacity="0.15" />
                {/* Bank name on building */}
                <text x="160" y="205" textAnchor="middle" fill="var(--brand-foreground)" fontSize="9" fontWeight="bold" fontFamily="sans-serif" opacity="0.6">COASTAL UNION</text>

                {/* Big Round Money Ring - circular arrangement of bills */}
                <g transform="translate(160, 310)">
                  {/* Outer ring glow */}
                  <circle cx="0" cy="0" r="65" fill="none" stroke="var(--brand-primary)" strokeWidth="1" opacity="0.15" />
                  {/* Money bills arranged in a circle */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                    const rad = (angle * Math.PI) / 180
                    const x = Math.cos(rad) * 52
                    const y = Math.sin(rad) * 52
                    const rot = angle + 90
                    return (
                      <g key={angle} transform={`translate(${x}, ${y}) rotate(${rot})`}>
                        <rect x="-10" y="-7" width="20" height="14" rx="2" fill="var(--brand-primary)" opacity="0.7" />
                        <rect x="-8" y="-5" width="16" height="10" rx="1" fill="var(--brand-background)" opacity="0.9" />
                        <ellipse cx="0" cy="0" rx="6" ry="2" fill="var(--brand-primary)" opacity="0.3" />
                      </g>
                    )
                  })}
                  {/* Center coin stack */}
                  <ellipse cx="0" cy="-4" rx="14" ry="6" fill="#fbbf24" opacity="0.8" />
                  <ellipse cx="0" cy="0" rx="14" ry="6" fill="#f59e0b" />
                  <ellipse cx="0" cy="4" rx="14" ry="6" fill="#d97706" />
                  <ellipse cx="0" cy="8" rx="14" ry="6" fill="#f59e0b" opacity="0.9" />
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5" />
                  <text x="0" y="3" textAnchor="middle" fill="#1a1a2e" fontSize="7" fontWeight="bold">$</text>
                  {/* Dollar signs on outer notes */}
                  <text x="-20" y="-30" textAnchor="middle" fill="var(--brand-primary)" fontSize="10" fontWeight="bold" opacity="0.5">$</text>
                  <text x="20" y="-28" textAnchor="middle" fill="var(--brand-primary)" fontSize="7" fontWeight="bold" opacity="0.4">$</text>
                  <text x="0" y="38" textAnchor="middle" fill="var(--brand-primary)" fontSize="8" fontWeight="bold" opacity="0.4">$</text>
                  <text x="-30" y="15" textAnchor="middle" fill="var(--brand-primary)" fontSize="6" fontWeight="bold" opacity="0.3">$</text>
                  <text x="30" y="18" textAnchor="middle" fill="var(--brand-primary)" fontSize="6" fontWeight="bold" opacity="0.3">$</text>
                </g>

                {/* Car parked in front */}
                <g transform="translate(130, 272)">
                  {/* Car body */}
                  <path d="M10 18 L10 10 Q12 4 20 4 L40 4 Q48 4 50 10 L50 18 Z" fill="var(--brand-accent)" opacity="0.85" />
                  {/* Car roof */}
                  <path d="M16 10 L16 8 Q18 4 24 4 L36 4 Q42 4 44 8 L44 10 Z" fill="var(--brand-accent)" opacity="0.6" />
                  {/* Windshield */}
                  <path d="M16 10 L16 8 Q18 5 23 5 L28 5 L28 10 Z" fill="#6366f1" opacity="0.3" />
                  <path d="M32 10 L32 5 L37 5 Q42 5 44 8 L44 10 Z" fill="#6366f1" opacity="0.3" />
                  {/* Wheels */}
                  <circle cx="18" cy="18" r="5" fill="#1a1a2e" />
                  <circle cx="18" cy="18" r="3" fill="#374151" />
                  <circle cx="42" cy="18" r="5" fill="#1a1a2e" />
                  <circle cx="42" cy="18" r="3" fill="#374151" />
                  {/* Headlight */}
                  <circle cx="49" cy="12" r="2" fill="#fbbf24" opacity="0.6" />
                  {/* Tail light */}
                  <circle cx="11" cy="12" r="1.5" fill="#ef4444" opacity="0.5" />
                </g>

                {/* Sparkle effects */}
                <circle cx="260" cy="100" r="3" fill="var(--brand-accent)" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="270" cy="115" r="2" fill="var(--brand-primary)" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="55" cy="130" r="2.5" fill="var(--brand-accent)" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="250" cy="200" r="2" fill="#fbbf24" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Personal Products Section */}
      <section className="w-full px-4 sm:px-6 py-16 sm:py-20" style={{ background: "color-mix(in srgb, var(--brand-background) 97%, var(--brand-primary) 3%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-4 tracking-wide uppercase"
              style={{
                background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
                color: "white",
              }}
            >
              Personal
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2"
              style={{
                background: "linear-gradient(135deg, var(--brand-foreground) 0%, var(--brand-primary-light) 50%, var(--brand-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Products Built for You
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              From everyday checking to premier wealth management — everything you need to manage your money.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Checking */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M2 8H22" stroke="white" strokeWidth="1.5"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Checking</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Everyday accounts with no monthly fees, free ATM access, and mobile banking built in.</p>
            </div>
            {/* Savings & CDs */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(236,72,153,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, var(--brand-accent), #be185d)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L16 8H8L12 2Z" fill="white" opacity="0.5"/><path d="M12 22L8 16H16L12 22Z" fill="white" opacity="0.5"/><rect x="4" y="8" width="16" height="8" rx="2" fill="white"/><rect x="6" y="10" width="12" height="4" rx="1" fill="var(--brand-accent)" opacity="0.4"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Savings & CDs</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Competitive rates on savings accounts and certificates of deposit with flexible terms.</p>
            </div>
            {/* Credit Cards */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M2 10H22" stroke="white" strokeWidth="1.5"/><path d="M7 15H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Credit Cards</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Cash back, travel rewards, and low intro APR cards designed for your lifestyle.</p>
            </div>
            {/* Home Loans */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 4L21 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10V20H19V10" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><rect x="10" y="14" width="4" height="6" fill="white" opacity="0.4"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Home Loans</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Mortgages, refinancing, and HELOCs with competitive rates and low down payments.</p>
            </div>
            {/* Personal Loans */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #a855f7, #7e22ce)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" fill="none"/><path d="M12 7V17M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Personal Loans</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Funds for life events, home improvement, debt consolidation, and unexpected expenses.</p>
            </div>
            {/* Auto Loans */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 18H19C20.1046 18 21 17.1046 21 16V12L19 7H16L14 4H10L8 7H5L3 12V16C3 17.1046 3.89543 18 5 18Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="7" cy="16" r="2" fill="white" opacity="0.5"/><circle cx="17" cy="16" r="2" fill="white" opacity="0.5"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Auto Loans</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">New and used vehicle financing with pre-approval, flexible terms, and low rates.</p>
            </div>
            {/* Premier */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(14,165,233,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Premier</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Premium relationship banking with dedicated advisors, exclusive rates, and VIP benefits.</p>
            </div>
            {/* Education & Tools */}
            <div className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid var(--brand-border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #f43f5e, #be123c)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19.5L12 14L20 19.5V5L12 10L4 5V19.5Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--brand-foreground)" }}>Education & Tools</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Financial calculators, budgeting tools, credit score tracking, and learning resources.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> No monthly fees</span>
            <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> 60k+ fee-free ATMs</span>
            <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Mobile check deposit</span>
            <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> 24/7 fraud protection</span>
            <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> FDIC insured up to $250k</span>
          </div>
        </div>
      </section>

      {/* Futures & Markets Section */}
      <section className="w-full px-4 sm:px-6 py-16 sm:py-20" style={{ background: "var(--brand-background)" }}>
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
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2"
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
