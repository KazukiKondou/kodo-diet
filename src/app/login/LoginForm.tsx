"use client"

import Link from "next/link"
import { useActionState } from "react"
import { login, type LoginState } from "./actions"

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null)
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">パスワード</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="input" />
      </div>
      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 text-base">
        {pending ? "確認中…" : "ログイン"}
      </button>
      <p className="text-center text-sm text-muted">
        アカウントがない場合は <Link href="/register" className="font-bold text-primary">新規登録</Link>
      </p>
    </form>
  )
}
