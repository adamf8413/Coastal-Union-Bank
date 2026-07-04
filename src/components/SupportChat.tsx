"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"

type ChatMsg = { id: string; message: string; role: string; createdAt: string }

export function SupportChat() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  useEffect(() => {
    if (!open || !session?.user) return
    fetch("/api/support/messages").then(r => r.json()).then(d => {
      if (d.messages) setMessages(d.messages)
    }).catch(() => {})
  }, [open, session])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, data.message])
        setInput("")
      }
    } catch {}
    setSending(false)
  }

  if (!session?.user) return null

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: "var(--brand-primary)" }}
          title="Support Chat"
        >
          💬
        </button>
      )}
      {open && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-xl border shadow-2xl flex flex-col"
          style={{ borderColor: "var(--brand-border)", backgroundColor: "var(--brand-card)", maxHeight: "60vh" }}>
          <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: "var(--brand-border)" }}>
            <span className="text-sm font-semibold">Customer Support</span>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-lg">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 200, maxHeight: 350 }}>
            {messages.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-8">Send a message to start chatting with support.</p>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === "admin" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "admin"
                    ? "bg-zinc-800 text-zinc-200"
                    : "text-white"
                }`} style={m.role === "user" ? { backgroundColor: "var(--brand-primary)" } : {}}>
                  <p>{m.message}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t flex gap-2" style={{ borderColor: "var(--brand-border)" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border px-3 py-2 text-sm bg-zinc-900 focus:outline-none"
              style={{ borderColor: "var(--brand-border)" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || sending}
              className="rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
