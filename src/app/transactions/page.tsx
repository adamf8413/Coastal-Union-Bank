"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { TransactionList } from "@/components/TransactionList"

export default function TransactionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch("/api/transactions").then((r) => r.json()).then((d) => setTransactions(d.transactions || []))
    }
  }, [session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-14 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <TransactionList transactions={transactions} />
      </main>
    </>
  )
}
