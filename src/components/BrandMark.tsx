const appName = process.env.NEXT_PUBLIC_APP_NAME || "Cocoa"

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <rect x="2" y="2" width="36" height="36" rx="12" fill="#a9713a" />
        <path
          d="M13 26c2.5 2 6.5 2 9 0M15 16.5c0 1-.8 1.8-1.8 1.8S11.5 17.5 11.5 16.5s.8-1.8 1.8-1.8S15 15.5 15 16.5ZM28.5 16.5c0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8.8-1.8 1.8-1.8 1.8.8 1.8 1.8Z"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M20 6c1.6 2.2 1.6 3.8 0 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      </svg>
      <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-ink">
        {appName}
      </span>
    </span>
  )
}
