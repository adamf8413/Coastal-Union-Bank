import type { Metadata, Viewport } from "next"
import { Providers } from "@/components/Providers"
import { BrandProvider } from "@/components/BrandProvider"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import { brand } from "@/lib/brand"
import { getBrandConfig, brandConfigToCssVars } from "@/lib/brand-db"
import "./globals.css"

export const metadata: Metadata = {
  title: brand.seo.title,
  description: brand.seo.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: brand.shortName,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: brand.pwa.themeColor,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brandConfig = await getBrandConfig()
  const cssVars = brandConfigToCssVars(brandConfig)
  const styleContent = `:root{${Object.entries(cssVars).map(([k, v]) => `${k}:${v}`).join(";")}}`
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      </head>
      <body>
        <Providers>
          <BrandProvider initial={brandConfig}>
            <ServiceWorkerRegister />
            {children}
          </BrandProvider>
        </Providers>
      </body>
    </html>
  )
}
