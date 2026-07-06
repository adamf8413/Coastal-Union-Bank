"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const isAdmin = user?.role === "ADMIN"

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [saving, setSaving] = useState(false)
  const [picMsg, setPicMsg] = useState("")
  const [picErr, setPicErr] = useState("")
  const [picSaving, setPicSaving] = useState(false)

  // Password
  const [showPw, setShowPw] = useState(false)
  const [curPw, setCurPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [pwMsg, setPwMsg] = useState("")
  const [pwErr, setPwErr] = useState("")
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    setErr("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg("Profile updated")
        setEditing(false)
        await update()
      } else {
        setErr(data.error)
      }
    } catch {
      setErr("Failed to update profile")
    }
    setSaving(false)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwSaving(true)
    setPwMsg("")
    setPwErr("")
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
      })
      const data = await res.json()
      if (res.ok) {
        setPwMsg("Password changed successfully")
        setCurPw("")
        setNewPw("")
        setShowPw(false)
      } else {
        setPwErr(data.error)
      }
    } catch {
      setPwErr("Failed to change password")
    }
    setPwSaving(false)
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-14 pb-24 md:pt-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          {!isAdmin && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {err && <p className="text-sm text-red-400 mb-4">{err}</p>}
        {msg && <p className="text-sm text-emerald-400 mb-4">{msg}</p>}

        <div className="space-y-6">

          {/* Profile Picture */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            {picErr && <p className="text-sm text-red-400 mb-3">{picErr}</p>}
            {picMsg && <p className="text-sm text-emerald-400 mb-3">{picMsg}</p>}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-3xl text-zinc-500 overflow-hidden flex-shrink-0">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.name || user?.username || "?")[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white text-center" style={{ backgroundColor: "var(--brand-primary)" }}>
                  {picSaving ? "⟳ Uploading..." : "Choose Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={picSaving}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setPicMsg("")
                      setPicErr("")
                      if (file.size > 5 * 1024 * 1024) {
                        setPicErr("Image too large (max 5MB)")
                        return
                      }
                      setPicSaving(true)
                      try {
                        const reader = new FileReader()
                        reader.readAsDataURL(file)
                        reader.onload = async () => {
                          const base64 = reader.result as string
                          const res = await fetch("/api/user/profile", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ profilePicture: base64 }),
                          })
                          const data = await res.json()
                          if (res.ok) {
                            setPicMsg("Profile picture updated")
                            await update()
                          } else {
                            setPicErr(data.error || "Upload failed")
                          }
                          setPicSaving(false)
                        }
                      } catch {
                        setPicErr("Upload failed")
                        setPicSaving(false)
                      }
                    }}
                  />
                </label>
                {user?.profilePicture && (
                  <button
                    onClick={async () => {
                      setPicMsg("")
                      setPicErr("")
                      setPicSaving(true)
                      try {
                        const res = await fetch("/api/user/profile", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ profilePicture: null }),
                        })
                        if (res.ok) {
                          setPicMsg("Profile picture removed")
                          await update()
                        } else {
                          setPicErr("Failed to remove")
                        }
                      } catch {
                        setPicErr("Failed to remove")
                      }
                      setPicSaving(false)
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            {editing ? (
              <form onSubmit={saveProfile} className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 text-zinc-200"
                    style={{ borderColor: "var(--brand-border)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 text-zinc-200"
                    style={{ borderColor: "var(--brand-border)" }}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    {saving ? "⟳ Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setName(user?.name || ""); setEmail(user?.email || ""); setMsg(""); setErr("") }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Full Name</label>
                  <p className="text-zinc-200">{user?.name || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Username</label>
                  <p className="text-zinc-200">{user?.username}</p>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Email</label>
                  <p className="text-zinc-200">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Role</label>
                  <p className="text-zinc-200 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                {isAdmin && (
                  <p className="text-xs text-amber-400 mt-2">Admins cannot edit profile information.</p>
                )}
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Account Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Account Number</label>
                <p className="text-zinc-200 font-mono tracking-wider">{user?.accountNumber || "—"}</p>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Routing Number</label>
                <p className="text-zinc-200 font-mono tracking-wider">{user?.routingNumber || "—"}</p>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">SWIFT Code</label>
                <p className="text-zinc-200 font-mono tracking-wider">{user?.swiftCode || "—"}</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Password</h2>
              {!showPw && (
                <button
                  onClick={() => { setShowPw(true); setPwMsg(""); setPwErr("") }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  Change Password
                </button>
              )}
            </div>
            {pwErr && <p className="text-sm text-red-400 mb-3">{pwErr}</p>}
            {pwMsg && <p className="text-sm text-emerald-400 mb-3">{pwMsg}</p>}
            {showPw && (
              <form onSubmit={changePassword} className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={curPw}
                    onChange={(e) => setCurPw(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 text-zinc-200"
                    style={{ borderColor: "var(--brand-border)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 text-zinc-200"
                    style={{ borderColor: "var(--brand-border)" }}
                    minLength={6}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    {pwSaving ? "⟳ Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPw(false); setCurPw(""); setNewPw(""); setPwMsg(""); setPwErr("") }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sign Out */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Sign Out</h2>
            <p className="text-sm text-zinc-400 mb-4">Sign out of your account on this device.</p>
            <button
              onClick={async () => { await signOut({ redirect: false }); window.location.href = "/" }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "#ef4444" }}
            >
              Sign Out
            </button>
          </div>

        </div>
      </main>
    </>
  )
}
