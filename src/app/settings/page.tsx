"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">

          {/* Profile Picture */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-3xl text-zinc-500 overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.name || user?.username || "?")[0].toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-zinc-400">Upload a profile picture</p>
                <p className="text-xs text-zinc-600 mt-1">JPG, PNG, or GIF. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
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
            </div>
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

        </div>
      </main>
    </>
  )
}
