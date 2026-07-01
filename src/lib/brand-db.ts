import { prisma } from "@/lib/prisma"
import { brand, type Brand } from "@/lib/brand"

const singletonId = "singleton"

export async function getBrandConfig(): Promise<Brand> {
  try {
    const config = await prisma.brandConfig.findUnique({ where: { id: singletonId } })
    if (config?.data) {
      return JSON.parse(config.data) as Brand
    }
  } catch {
    // DB not ready
  }
  return brand
}

export async function updateBrandConfig(data: Partial<Brand>): Promise<Brand> {
  const existing = await getBrandConfig()
  const merged = {
    ...existing,
    ...data,
    logoSvg: data.logoSvg ?? existing.logoSvg,
    colors: { ...existing.colors, ...(data.colors ?? {}) },
    seo: { ...existing.seo, ...(data.seo ?? {}) },
    pwa: { ...existing.pwa, ...(data.pwa ?? {}) },
    hero: { ...existing.hero, ...(data.hero ?? {}) },
    social: { ...existing.social, ...(data.social ?? {}) },
  }

  await prisma.brandConfig.upsert({
    where: { id: singletonId },
    update: { data: JSON.stringify(merged) },
    create: { id: singletonId, data: JSON.stringify(merged) },
  })

  return merged as Brand
}

export function brandConfigToCssVars(config: Brand): Record<string, string> {
  const c = config.colors
  const h = config.hero
  return {
    "--brand-primary": c.primary,
    "--brand-primary-hover": c.primaryHover,
    "--brand-primary-light": c.primaryLight,
    "--brand-primary-dark": c.primaryDark,
    "--brand-accent": c.accent,
    "--brand-accent-hover": c.accentHover,
    "--brand-background": c.background,
    "--brand-foreground": c.foreground,
    "--brand-card": c.card,
    "--brand-card-hover": c.cardHover,
    "--brand-border": c.border,
    "--brand-success": c.success,
    "--brand-warning": c.warning,
    "--brand-danger": c.danger,
    "--brand-info": c.info,
    "--brand-muted": c.muted,
    "--brand-text-primary": c.textPrimary,
    "--brand-text-secondary": c.textSecondary,
    "--brand-text-muted": c.textMuted,
    "--brand-hero-gradient-from": h.gradientFrom,
    "--brand-hero-gradient-via": h.gradientVia,
    "--brand-hero-gradient-to": h.gradientTo,
    "--brand-hero-glow": h.glowColor,
    "--brand-hero-particle": h.particleColor,
    "--brand-hero-card-badge": h.cardBadgeColor,
  }
}
