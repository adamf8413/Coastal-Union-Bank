"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

type ChatMsg = { id: string; message: string; role: string; createdAt: string; userId: string; user: { username: string; name: string | null } }

export default function AdminSupportPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = (session?.user as any)?.role === "ADMIN"
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && !isAdmin) router.push("/dashboard")
  }, [status, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    const load = () => {
      fetch("/api/support/admin").then(r => r.json()).then(d => {
        if (d.messages) setMessages(d.messages)
      }).catch(() => {})
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [isAdmin])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const userIds = [...new Set(messages.map(m => m.userId))]
  const filtered = selectedUser ? messages.filter(m => m.userId === selectedUser) : messages

  const sendReply = async () => {
    if (!input.trim() || !selectedUser || sending) return
    setSending(true)
    const res = await fetch("/api/support/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, message: input.trim() }),
    })
    if (res.ok) {
      setInput("")
      const load = async () => {
        const r = await fetch("/api/support/admin")
        const d = await r.json()
        if (d.messages) setMessages(d.messages)
      }
      load()
    }
    setSending(false)
  }

  if (status === "loading" || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  const getUserLabel = (uid: string) => {
    const u = messages.find(m => m.userId === uid)?.user
    return u?.name || u?.username || uid
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-14 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Support Messages</h1>

        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setSelectedUser(null)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${!selectedUser ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-zinc-700 text-zinc-400"}`}
          >
            All
          </button>
          {userIds.map(uid => (
            <button
              key={uid}
              onClick={() => setSelectedUser(uid)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${selectedUser === uid ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-zinc-700 text-zinc-400"}`}
            >
              {getUserLabel(uid)}
            </button>
          ))}
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--brand-border)", background: "var(--brand-card)" }}>
          <div className="space-y-2 mb-4" style={{ maxHeight: 400, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-8">No support messages yet.</p>
            )}
            {filtered.map(m => (
              <div key={m.id} className={`flex ${m.role === "admin" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${m.role === "admin" ? "bg-indigo-600/20 text-indigo-300" : "bg-zinc-800 text-zinc-200"}`}>
                  <p className="text-[10px] text-zinc-500 mb-0.5">
                    {m.role === "admin" ? "You" : getUserLabel(m.userId)} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p>{m.message}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {selectedUser && (
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--brand-border)" }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendReply()}
                placeholder={`Reply to ${getUserLabel(selectedUser)}...`}
                className="flex-1 rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
                style={{ borderColor: "var(--brand-border)" }}
              />
              <button
                onClick={sendReply}
                disabled={!input.trim() || sending}
                className="rounded-lg px-4 py-2 text-sm text-white disabled:opacity-50"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
