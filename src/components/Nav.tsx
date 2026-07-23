"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BrandMark } from "./BrandMark"
import { Avatar, type AvatarUser } from "./Avatar"
import { logout } from "@/app/actions"

const TABS: { href: string; label: string; icon: React.ReactNode }[] = [
  { href: "/dashboard", label: "ホーム", icon: <IconHome /> },
  { href: "/workouts", label: "運動", icon: <IconDumbbell /> },
  { href: "/weight", label: "体重", icon: <IconScale /> },
  { href: "/meals", label: "食事", icon: <IconMeal /> },
  { href: "/feed", label: "共有", icon: <IconFeed /> },
]

export function Nav({ user }: { user: AvatarUser }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      {/* トップバー */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/dashboard">
            <BrandMark size={26} />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  isActive(t.href) ? "bg-primary text-white" : "text-ink hover:bg-sand"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full p-0.5 hover:bg-sand"
              aria-label="メニュー"
            >
              <Avatar user={user} size={34} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-warm)]">
                  <MenuLink href="/body" onClick={() => setMenuOpen(false)}>
                    体の記録
                  </MenuLink>
                  <MenuLink href="/settings" onClick={() => setMenuOpen(false)}>
                    設定
                  </MenuLink>
                  <form action={logout}>
                    <button className="w-full px-4 py-3 text-left text-sm font-semibold text-accent hover:bg-sand">
                      ログアウト
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ボトムタブ（モバイル） */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-cream/95 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${
                isActive(t.href) ? "text-primary" : "text-muted"
              }`}
            >
              <span className={isActive(t.href) ? "scale-110 transition" : "transition"}>{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}

function MenuLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block px-4 py-3 text-sm font-semibold text-ink hover:bg-sand">
      {children}
    </Link>
  )
}

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}
function IconDumbbell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11" />
    </svg>
  )
}
function IconScale() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="3" /><path d="M8 8h8M12 8l-2 4a2 2 0 1 0 4 0z" />
    </svg>
  )
}
function IconMeal() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v8M8 3v8M5 11h3M6.5 11v10M17 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM17 12v9" />
    </svg>
  )
}
function IconFeed() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}
