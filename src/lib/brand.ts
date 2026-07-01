export const defaultLogoSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coastal-grad" x1="0" y1="0" x2="64" y2="64">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <linearGradient id="coastal-accent" x1="0" y1="0" x2="64" y2="64">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#coastal-grad)"/>
  <rect x="2" y="2" width="60" height="60" rx="16" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
  <!-- Beacon / guiding star -->
  <circle cx="32" cy="16" r="3.5" fill="url(#coastal-accent)"/>
  <circle cx="32" cy="16" r="5.5" fill="url(#coastal-accent)" opacity="0.25"/>
  <!-- Horizon line -->
  <line x1="14" y1="28" x2="50" y2="28" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-linecap="round"/>
  <!-- Wave arc 1 -->
  <path d="M14 34 Q22 28, 32 34 Q42 40, 50 34" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Wave arc 2 -->
  <path d="M14 41 Q22 35, 32 41 Q42 47, 50 41" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
  <!-- Wave arc 3 -->
  <path d="M14 48 Q22 42, 32 48 Q42 54, 50 48" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.45"/>
  <!-- Union knot -->
  <circle cx="22" cy="34" r="1.2" fill="white" opacity="0.5"/>
  <circle cx="42" cy="34" r="1.2" fill="white" opacity="0.5"/>
</svg>`

export const brand = {
  name: "Coastal Union Bank",
  shortName: "Coastal Union",
  tagline: "Secure Digital Banking",
  description: "Secure digital banking for USD, EUR, and crypto holdings. Deposit and transfer with confidence.",
  domain: "coastalunionbank.com",
  demoEmail: "demo@coastalunionbank.com",
  demoPassword: "demo1234",

  // Logo SVG — Admin can change this from the Brand Settings page.
  // The `{gradientId}` placeholder will be replaced with a unique id per render.
  logoSvg: defaultLogoSvg,

  colors: {
    primary:       "#6366f1",
    primaryHover:  "#4f46e5",
    primaryLight:  "#e0e7ff",
    primaryDark:   "#3730a3",
    accent:        "#34d399",
    accentHover:   "#10b981",

    background:    "#0a0a0f",
    foreground:    "#e2e8f0",
    card:          "#13131a",
    cardHover:     "#1a1a26",
    border:        "#1e1e2e",

    success:       "#22c55e",
    warning:       "#eab308",
    danger:        "#ef4444",
    info:          "#3b82f6",
    muted:         "#64748b",

    textPrimary:   "#e2e8f0",
    textSecondary: "#64748b",
    textMuted:     "#475569",
  },

  seo: {
    title: "Coastal Union Bank - Secure Digital Banking",
    description: "Secure digital banking for USD, EUR, and crypto holdings. Deposit and transfer with confidence.",
  },

  pwa: {
    cacheName: "coastal-union-bank-v1",
    backgroundColor: "#0a0a0f",
    themeColor: "#6366f1",
  },

  cacheKey: "coastal-union-bank-v1",

  hero: {
    gradientFrom: "#0f172a",
    gradientVia: "#1e1b4b",
    gradientTo: "#0a0a0f",
    glowColor: "#818cf8",
    particleColor: "#a5b4fc",
    cardBadgeColor: "#f59e0b",
  },

  social: {
    twitter: "@coastalunionbank",
  },
}

export type Brand = typeof brand
export type BrandColor = keyof Brand["colors"]
export type BrandLogo = Brand["logoSvg"]
