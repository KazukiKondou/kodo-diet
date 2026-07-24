import Link from "next/link"
import { redirect } from "next/navigation"
import { BrandMark } from "@/components/BrandMark"
import { getCurrentUser } from "@/lib/session"
import { RegisterForm } from "./RegisterForm"

export const metadata = { title: "新規登録" }

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect("/dashboard")
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-12">
      <Link href="/" className="mx-auto"><BrandMark size={32} /></Link>
      <div className="card mt-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink">アカウント作成</h1>
        <p className="mt-1 text-sm text-muted">メールアドレスとパスワードだけで始められます。</p>
        <RegisterForm />
      </div>
    </main>
  )
}
