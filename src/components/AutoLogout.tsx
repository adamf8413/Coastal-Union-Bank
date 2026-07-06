"use client"

import { useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

const INACTIVITY_TIMEOUT = 5 * 60 * 1000

export function AutoLogout() {
  const { data: session } = useSession()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!session?.user) return

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        signOut({ redirect: false })
        window.location.href = "/"
      }, INACTIVITY_TIMEOUT)
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]
    events.forEach((e) => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      if (timer.current) clearTimeout(timer.current)
    }
  }, [session])

  return null
}
