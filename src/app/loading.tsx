export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--brand-background, #0c0c0f)" }}>
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
        <rect x="2" y="2" width="60" height="60" rx="16" fill="var(--brand-primary, #6366f1)" />
        <circle cx="32" cy="16" r="3.5" fill="var(--brand-accent, #34d399)" />
        <path d="M14 34 Q22 28, 32 34 Q42 40, 50 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M14 41 Q22 35, 32 41 Q42 47, 50 41" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      </svg>
    </div>
  )
}
