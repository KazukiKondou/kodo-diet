"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { signIn } from "@/auth"

const schema = z.object({ email: z.string().email("メールアドレスの形式が正しくありません") })

export type LoginState = { error?: string } | null

export async function startLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  }
  const email = parsed.data.email.toLowerCase().trim()

  try {
    await signIn("email", { email, redirect: false })
  } catch {
    return { error: "ログインリンクの送信に失敗しました。時間をおいて再度お試しください。" }
  }
  // redirect は try の外（内部的に例外を投げるため）
  redirect(`/login/verify?email=${encodeURIComponent(email)}`)
}
