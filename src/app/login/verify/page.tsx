import Link from "next/link"
import { BrandMark } from "@/components/BrandMark"
import { emailConfigured, readDevMagicLink } from "@/lib/mailer"

export const metadata = { title: "メールを確認" }

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  const isDev = process.env.NODE_ENV !== "production" && !emailConfigured()
  const devLink = isDev && email ? await readDevMagicLink(email) : null

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-12">
      <Link href="/" className="mx-auto">
        <BrandMark size={32} />
      </Link>
      <div className="card mt-8 text-center">
        <div className="text-4xl">📬</div>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
          メールを確認してください
        </h1>
        <p className="mt-2 text-sm text-muted">
          {email ? <span className="font-semibold text-ink">{email}</span> : "入力したメールアドレス"}
          {" 宛にログインリンクを送りました。リンクを開くとログインできます（15分間有効）。"}
        </p>

        {devLink && (
          <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary-soft/30 p-4 text-left">
            <p className="text-xs font-bold text-primary">開発モード（メール未設定）</p>
            <p className="mt-1 text-xs text-muted">実メールの代わりに、このリンクからログインできます。</p>
            <a href={devLink} className="btn-primary mt-3 w-full py-2.5 text-sm">
              このままログインする →
            </a>
          </div>
        )}

        <Link href="/login" className="btn-ghost mt-6 text-sm">
          ← メールアドレスを入力し直す
        </Link>
      </div>
    </main>
  )
}
