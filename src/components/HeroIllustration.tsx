"use client"

export function HeroIllustration({ size = 320 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: "100%", height: "auto" }}>
      {/* Glow behind figure */}
      <ellipse cx="200" cy="220" rx="140" ry="140" fill="var(--brand-hero-glow, #818cf8)" opacity="0.15" />
      <ellipse cx="200" cy="240" rx="100" ry="100" fill="var(--brand-hero-glow, #818cf8)" opacity="0.1" />

      {/* Woman silhouette - hair */}
      <path d="M155 95 C155 60, 180 40, 210 40 C240 40, 260 55, 265 85 C275 75, 285 80, 285 95 C285 105, 275 110, 270 108 C272 118, 268 130, 255 135 C250 110, 235 95, 210 92 C185 95, 170 110, 165 135 C152 130, 148 118, 150 108 C145 110, 135 105, 135 95 C135 80, 145 75, 155 95Z" fill="#1a1a2e" />

      {/* Face */}
      <ellipse cx="210" cy="140" rx="38" ry="42" fill="#f5e6d3" />

      {/* Eyes */}
      <ellipse cx="198" cy="135" rx="4" ry="5" fill="#2d2d2d" />
      <ellipse cx="222" cy="135" rx="4" ry="5" fill="#2d2d2d" />
      <circle cx="199" cy="133" r="1.5" fill="white" opacity="0.8" />
      <circle cx="223" cy="133" r="1.5" fill="white" opacity="0.8" />

      {/* Eyelashes */}
      <path d="M193 130 L191 126" stroke="#2d2d2d" strokeWidth="1" />
      <path d="M196 129 L195 125" stroke="#2d2d2d" strokeWidth="1" />
      <path d="M224 130 L226 126" stroke="#2d2d2d" strokeWidth="1" />
      <path d="M221 129 L222 125" stroke="#2d2d2d" strokeWidth="1" />

      {/* Eyebrows */}
      <path d="M192 128 C196 124, 202 124, 205 127" stroke="#1a1a2e" strokeWidth="1.5" fill="none" />
      <path d="M215 127 C218 124, 224 124, 228 128" stroke="#1a1a2e" strokeWidth="1.5" fill="none" />

      {/* Nose */}
      <path d="M210 138 C212 145, 211 148, 208 150" stroke="#d4b8a3" strokeWidth="1.5" fill="none" />

      {/* Lips */}
      <path d="M202 156 C205 160, 215 160, 218 156" stroke="#d4738a" strokeWidth="2" fill="#e8839a" />
      <path d="M202 156 C205 153, 215 153, 218 156" stroke="#d4738a" strokeWidth="1.5" fill="#f0a0b5" />

      {/* Blush */}
      <circle cx="190" cy="150" r="8" fill="#f0a0b5" opacity="0.3" />
      <circle cx="230" cy="150" r="8" fill="#f0a0b5" opacity="0.3" />

      {/* Neck */}
      <rect x="200" y="178" width="20" height="15" rx="5" fill="#f0dcc8" />

      {/* Blazer/jacket */}
      <path d="M175 190 L175 260 C175 265, 180 270, 185 270 L235 270 C240 270, 245 265, 245 260 L245 190 Z" fill="#4338ca" />
      {/* Lapels */}
      <path d="M200 190 L190 220 L180 190 Z" fill="#3730a3" />
      <path d="M220 190 L230 220 L240 190 Z" fill="#3730a3" />
      {/* Collar - white blouse */}
      <path d="M195 188 L200 200 L210 192 L220 200 L225 188 Z" fill="white" />

      {/* Right arm extending with card */}
      <path d="M245 210 C260 205, 280 200, 295 195" stroke="#4338ca" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="295" cy="195" r="8" fill="#f0dcc8" />

      {/* ATM Card */}
      <g transform="translate(280, 170) rotate(-15)">
        <rect x="0" y="0" width="55" height="35" rx="4" fill="url(#cardGrad)" />
        <rect x="0" y="0" width="55" height="35" rx="4" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <circle cx="42" cy="20" r="5" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
        <rect x="6" y="6" width="20" height="14" rx="2" fill="white" opacity="0.15" />
        <text x="8" y="28" fill="white" fontSize="5" opacity="0.8" fontFamily="monospace">•••• 4582</text>
        <rect x="38" y="5" width="12" height="8" rx="1" fill="var(--brand-hero-card-badge, #f59e0b)" opacity="0.9" />
      </g>

      {/* Left arm */}
      <path d="M175 215 C160 220, 145 230, 135 240" stroke="#4338ca" strokeWidth="12" strokeLinecap="round" fill="none" />
      <circle cx="135" cy="240" r="7" fill="#f0dcc8" />

      {/* Floating decorative elements */}
      <text x="80" y="80" fontSize="18" opacity="0.15" fill="var(--brand-hero-particle, #a5b4fc)" className="animate-float-slow">✦</text>
      <text x="330" y="60" fontSize="14" opacity="0.12" fill="var(--brand-hero-particle, #a5b4fc)" className="animate-float">✦</text>
      <text x="50" y="320" fontSize="12" opacity="0.1" fill="var(--brand-hero-particle, #a5b4fc)" className="animate-float-slow">◇</text>
      <text x="350" y="350" fontSize="20" opacity="0.08" fill="var(--brand-hero-particle, #a5b4fc)" className="animate-float">◇</text>
      <text x="120" y="50" fontSize="10" opacity="0.15" fill="var(--brand-hero-particle, #a5b4fc)" className="animate-float-slow">○</text>
      <text x="310" y="380" fontSize="16" opacity="0.1" fill="var(--brand-hero-particle, #a5b4fc)" className="animate-float">○</text>

      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-primary, #6366f1)" />
          <stop offset="100%" stopColor="var(--brand-accent, #34d399)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
