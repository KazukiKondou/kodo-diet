import Link from "next/link"
import { redirect } from "next/navigation"
import { BrandMark } from "@/components/BrandMark"
import { getCurrentUser } from "@/lib/session"

const features = [
  {
    emoji: "🔥",
    title: "続けた日が、色になる",
    body: "運動した日をカレンダーに記録。茶色が濃くなるほど頑張った証。色は好みで選べます。",
  },
  {
    emoji: "⚖️",
    title: "今と理想の“差”がわかる",
    body: "体重を毎日ポチッと。BMI・標準体重・目標との差を自動で計算して見せます。",
  },
  {
    emoji: "🍽️",
    title: "食事は写真でゆるく",
    body: "食べたものを撮るだけ。週末にスライドショーで振り返り。みんなにも見せて、いい意味の緊張感を。",
  },
]

export default async function LandingPage() {
  const user = await getCurrentUser()
  if (user) redirect("/dashboard")

  return (
    <main className="mx-auto flex min-h-full max-w-5xl flex-col px-5 pb-16">
      <header className="flex items-center justify-between py-6">
        <BrandMark />
        <Link href="/login" className="btn-ghost text-sm">
          ログイン
        </Link>
      </header>

      <section className="flex flex-col items-center pt-10 text-center sm:pt-16">
        <span className="chip mb-5">🍫 ジム感ゼロのダイエット記録</span>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-ink sm:text-6xl">
          毎日を、
          <br className="sm:hidden" />
          あたたかく記録する。
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          頑張りすぎないダイエットのための場所。運動・体重・食事を、ゆるく、かわいく、続けていこう。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary px-8 py-3.5 text-base">
            無料ではじめる
          </Link>
          <a href="#features" className="btn-outline px-8 py-3.5 text-base">
            どんなアプリ？
          </a>
        </div>
        <p className="mt-3 text-xs text-muted">メールアドレスだけ。パスワード不要。</p>
      </section>

      <section id="features" className="mt-16 grid gap-4 sm:mt-24 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card">
            <div className="text-3xl">{f.emoji}</div>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-[var(--radius-xl2)] bg-primary/95 px-6 py-12 text-center text-white shadow-[var(--shadow-warm)] sm:mt-24">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
          今日のあなたを、記録しよう。
        </h2>
        <p className="mt-3 text-sm text-white/85">3秒で始められます。</p>
        <Link href="/login" className="btn mt-6 bg-white px-8 py-3 text-primary hover:bg-cream">
          はじめる
        </Link>
      </section>

      <footer className="mt-16 text-center text-xs text-muted">
        © {new Date().getFullYear()} Cocoa
      </footer>
    </main>
  )
}
