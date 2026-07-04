"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { Logo } from "@/components/Logo"
import { brand } from "@/lib/brand"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◇" },
  { href: "/portfolio", label: "Portfolio", icon: "□" },
  { href: "/send", label: "Send", icon: "↑" },
  { href: "/deposit", label: "Deposit", icon: "↓", adminOnly: true },
  { href: "/transactions", label: "History", icon: "≡" },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [notifs, setNotifs] = useState<{ id: string; title: string; message: string; read: boolean }[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const prevUnread = useRef(0)

  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch {}
  }

  const showBrowserNotification = (title: string, body: string) => {
    if (!("Notification" in window)) return
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icons/icon-192x192.png" } as NotificationOptions)
    }
  }

  const requestNotifPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    if (!session?.user) return
    fetch("/api/notifications").then(r => r.json()).then(d => {
      if (d.notifications) {
        setNotifs(d.notifications)
        prevUnread.current = d.notifications.filter((n: any) => !n.read).length
      }
    }).catch(() => {})
    const interval = setInterval(() => {
      fetch("/api/notifications").then(r => r.json()).then(d => {
        if (d.notifications) {
          setNotifs(d.notifications)
          const newUnread = d.notifications.filter((n: any) => !n.read).length
          if (newUnread > prevUnread.current && newUnread > 0) {
            playNotificationSound()
            const latest = d.notifications.find((n: any) => !n.read)
            if (latest) showBrowserNotification(latest.title, latest.message)
          }
          prevUnread.current = newUnread
        }
      }).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [session])

  const unread = notifs.filter(n => !n.read).length

  const markRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (pathname === "/login" || pathname === "/register") return null

  return (
    <>
      {/* Mobile top bar: Logo + Bank Name */}
      <div className="fixed top-0 left-0 right-0 z-50 glass md:hidden flex items-center justify-center px-4 py-2.5 border-b" style={{ borderColor: "var(--brand-border)" }}>
        <Link href="/dashboard" className="flex items-center no-underline" style={{ gap: "12px" }}>
          <Logo size={24} showText={false} />
          <span className="font-bold text-base" style={{ color: "var(--brand-primary)" }}>{brand.name}</span>
        </Link>
      </div>

      <header className="glass fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="hidden md:flex items-center no-underline group" style={{ gap: "14px" }}>
            <Logo size={28} showText={false} />
            <span className="font-bold text-lg" style={{ color: "var(--brand-primary)" }}>{brand.name}</span>
          </Link>

          <nav className="flex w-full md:w-auto justify-around md:justify-end gap-0 md:gap-1">
          {(session?.user as any)?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-1 px-1 md:px-3 py-1.5 rounded-lg text-[10px] md:text-xs transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="text-sm md:text-base">⚙</span>
              <span className="hidden xs:inline">Admin</span>
            </Link>
          )}
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-1 px-1 md:px-3 py-1.5 rounded-lg text-[10px] md:text-xs transition-colors ${
                pathname === href
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="text-sm md:text-base">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {session?.user && (
          <button onClick={() => setShowMobileMenu(true)} className="md:hidden w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs overflow-hidden">
            <span>{(session.user.name || (session.user as any).username || "?")[0].toUpperCase()}</span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-3">
          {session?.user && (
            <>
              <div className="relative">
                <button onClick={() => { setShowNotifs(!showNotifs); requestNotifPermission() }} className="relative text-zinc-400 hover:text-zinc-200 transition-colors text-xl">
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                  🔔
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-zinc-700 text-xs text-zinc-400 font-medium">Notifications</div>
                    {notifs.length === 0 ? (
                      <div className="p-4 text-sm text-zinc-500 text-center">No notifications</div>
                    ) : (
                      notifs.map(n => (
                        <div key={n.id} className={`p-3 border-b border-zinc-800 text-sm cursor-pointer ${n.read ? 'opacity-50' : ''}`} onClick={() => markRead(n.id)}>
                          <div className="text-zinc-200 font-medium text-xs">{n.title}</div>
                          <div className="text-zinc-400 text-xs mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <Link href="/settings" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs overflow-hidden">
                  {(session.user as any)?.profilePicture ? (
                    <img src={(session.user as any).profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(session.user.name || (session.user as any).username || "?")[0].toUpperCase()}</span>
                  )}
                </div>
                <span>{session.user.name || (session.user as any).username}</span>
              </Link>
              <button
onClick={() => { signOut({ redirect: false }); window.location.href = "/" }}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {showMobileMenu && session?.user && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setShowMobileMenu(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 rounded-t-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid var(--brand-border)" }}>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold overflow-hidden">
                  {(session.user as any)?.profilePicture ? (
                    <img src={(session.user as any).profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{((session.user.name || (session.user as any).username || "?")[0]).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{session.user.name || (session.user as any).username}</div>
                  <div className="text-xs text-zinc-500">{session.user.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/settings" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                  <span className="text-lg">⚙</span> Settings
                </Link>
                <div className="relative">
                  <button onClick={() => { setShowNotifs(!showNotifs); requestNotifPermission() }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <span className="text-lg">🔔</span> Notifications
                    {unread > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{unread > 9 ? "9+" : unread}</span>}
                  </button>
                  {showNotifs && (
                    <div className="mt-1 rounded-lg border border-zinc-700 bg-zinc-800 max-h-64 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <div className="p-3 text-sm text-zinc-500 text-center">No notifications</div>
                      ) : (
                        notifs.map(n => (
                          <div key={n.id} className={`p-3 border-b border-zinc-700 text-sm cursor-pointer ${n.read ? 'opacity-50' : ''}`} onClick={() => markRead(n.id)}>
                            <div className="text-zinc-200 font-medium text-xs">{n.title}</div>
                            <div className="text-zinc-400 text-xs mt-0.5">{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <hr className="border-zinc-700 my-2" />
                <button onClick={() => { signOut({ redirect: false }); window.location.href = "/" }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-zinc-800 transition-colors">
                  <span className="text-lg">↩</span> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
