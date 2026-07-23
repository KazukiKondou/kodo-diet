"use client"

import { useActionState } from "react"
import { startLogin, type LoginState } from "./actions"

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(startLogin, null)

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="email">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="input"
        />
      </div>
      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 text-base">
        {pending ? "送信中…" : "ログインリンクを受け取る"}
      </button>
      <p className="text-center text-xs text-muted">
        パスワードはありません。届いたリンクを開くだけでログインできます。
      </p>
    </form>
  )
}
