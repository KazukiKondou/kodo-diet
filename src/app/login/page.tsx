import Link from "next/link"
import { redirect } from "next/navigation"
import { BrandMark } from "@/components/BrandMark"
import { getCurrentUser } from "@/lib/session"
import { LoginForm } from "./LoginForm"

export const metadata = { title: "ログイン" }

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect("/dashboard")

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-12">
      <Link href="/" className="mx-auto">
        <BrandMark size={32} />
      </Link>
      <div className="card mt-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink">おかえりなさい</h1>
        <p className="mt-1 text-sm text-muted">メールアドレスでログイン / 新規登録できます。</p>
        <LoginForm />
      </div>
    </main>
  )
}
