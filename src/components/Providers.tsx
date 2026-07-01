"use client"

import { SessionProvider } from "next-auth/react"
import { SupportChat } from "./SupportChat"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider><SupportChat />{children}</SessionProvider>
}
