"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

const ASSETS = ["USD", "EUR", "GBP", "BTC", "ETH", "SOL"]

export default function SendPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [transferType, setTransferType] = useState<"local" | "international">("local")
  const [fullName, setFullName] = useState("")
  const [localAccountNumber, setLocalAccountNumber] = useState("")
  const [country, setCountry] = useState("")
  const [assetType, setAssetType] = useState("USD")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [recipientBank, setRecipientBank] = useState("")
  const [bankAddress, setBankAddress] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [step, setStep] = useState<"form" | "otp" | "done">("form")
  const [transferId, setTransferId] = useState("")
  const [code, setCode] = useState("")
  const [copCode, setCopCode] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/transfer/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientUsername: fullName,
        assetType, amount: parseFloat(amount), note,
        accountNumber: transferType === "local" ? localAccountNumber : undefined,
        routingNumber, swiftCode, recipientBank,
        transferType, accountName: fullName, bankAddress,
        country: transferType === "international" ? country : undefined,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setTransferId(data.transferId)
      if (data.cop) setCopCode(data.cop)
      setStep(data.completed ? "done" : "otp")
    } else {
      setError(data.error || "Something went wrong")
    }
    setLoading(false)
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/transfer/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transferId, code }),
    })

    if (res.ok) {
      setStep("done")
    } else {
      const data = await res.json()
      setError(data.error || "Invalid code")
    }
    setLoading(false)
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-24 md:pt-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6">Send Money</h1>

        {step === "form" && (
          <form onSubmit={handleInitiate} className="space-y-4">
            {/* Transfer Type Toggle */}
            <div className="flex gap-2 rounded-lg border border-zinc-700 p-1">
              <button
                type="button"
                onClick={() => setTransferType("local")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  transferType === "local"
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Local Transfer
              </button>
              <button
                type="button"
                onClick={() => setTransferType("international")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  transferType === "international"
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                International Transfer
              </button>
            </div>

            {/* Both types: Full Name */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                placeholder="Recipient full name"
                required
              />
            </div>

            {/* Local only: Account Number */}
            {transferType === "local" && (
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={localAccountNumber}
                  onChange={(e) => setLocalAccountNumber(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                  placeholder="Recipient account number"
                  required
                />
              </div>
            )}

            {/* Both types: Bank Name */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Bank Name</label>
              <input
                type="text"
                value={recipientBank}
                onChange={(e) => setRecipientBank(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                placeholder="Bank name"
                required
              />
            </div>

            {/* International only: Country */}
            {transferType === "international" && (
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                  placeholder="Recipient country"
                  required
                />
              </div>
            )}

            {/* Both types: Routing / IBAN */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                {transferType === "local" ? "Routing Number" : "Routing Number / IBAN"}
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                placeholder={transferType === "local" ? "Routing number" : "Routing number or IBAN"}
                required
              />
            </div>

            {/* Both types: SWIFT Code */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">SWIFT Code</label>
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                placeholder="SWIFT/BIC code"
                required
              />
            </div>

            {/* Both types: Bank Address */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Bank Address</label>
              <input
                type="text"
                value={bankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                placeholder="Bank address"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Asset</label>
              <div className="flex gap-2 flex-wrap">
                {ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => setAssetType(asset)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                      assetType === asset
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg focus:outline-none focus:border-indigo-500"
                placeholder="0.00"
                min="0"
                step="any"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 focus:outline-none focus:border-indigo-500"
                placeholder="What's this for?"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading || !fullName || !amount}
              className="w-full rounded-lg bg-indigo-600 py-3 font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? <span className="animate-spin-logo text-lg">⟳</span> : `Send ${assetType}`}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              {copCode ? (
                <div className="text-center">
                  <p className="text-zinc-500 mb-2">Confirmation code (COP):</p>
                  <p className="text-2xl tracking-widest font-mono font-bold text-emerald-400">{copCode}</p>
                </div>
              ) : (
                <>
                  <p>Ask the admin for the confirmation code (COP).</p>
                  <p className="text-zinc-500 mt-1">Enter the code below to complete your transfer.</p>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Confirmation Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-indigo-500"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 rounded-lg border border-zinc-700 py-3 font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? <span className="animate-spin-logo text-lg">⟳</span> : "Confirm Transfer"}
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✓</div>
            <h2 className="text-xl font-bold text-emerald-400">Transfer Complete</h2>
            <p className="text-zinc-400">
              {amount} {assetType} sent to <strong>{fullName}</strong>
            </p>
            {note && <p className="text-sm text-zinc-500">Note: {note}</p>}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <button
                onClick={() => router.push(`/receipt/${transferId}`)}
                className="w-full sm:flex-1 rounded-lg bg-indigo-600 py-3 font-medium hover:bg-indigo-500 transition-colors"
              >
                View Receipt
              </button>
              <button
                onClick={() => router.push("/transactions")}
                className="w-full sm:flex-1 rounded-lg border border-zinc-700 py-3 font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                History
              </button>
              <button
                onClick={() => {
                  setStep("form")
                  setFullName("")
                  setTransferType("local")
                  setLocalAccountNumber("")
                  setCountry("")
                  setAmount("")
                  setNote("")
                  setRoutingNumber("")
                  setSwiftCode("")
                  setRecipientBank("")
                  setBankAddress("")
                  setCode("")
                  setError("")
                }}
                className="w-full sm:flex-1 rounded-lg border border-zinc-700 py-3 font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Send Again
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
