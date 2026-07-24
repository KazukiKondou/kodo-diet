"use client"

import Link from "next/link"
import { useActionState } from "react"
import { createAccount, type RegisterState } from "./actions"

export function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(createAccount, null)
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="name">ユーザー名</label>
        <input id="name" name="name" required maxLength={30} placeholder="こんどう" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">パスワード（8文字以上）</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="••••••••" className="input" />
      </div>
      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 text-base">
        {pending ? "作成中…" : "アカウントを作成"}
      </button>
      <p className="text-center text-sm text-muted">
        すでに登録済み？ <Link href="/login" className="font-bold text-primary">ログイン</Link>
      </p>
    </form>
  )
}
