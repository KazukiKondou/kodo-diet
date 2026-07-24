"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { signIn } from "@/auth"

const schema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
})

export type LoginState = { error?: string } | null

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  let ok = true
  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase().trim(),
      password: parsed.data.password,
      redirect: false,
    })
  } catch {
    ok = false
  }
  if (!ok) return { error: "メールアドレスまたはパスワードが違います" }
  redirect("/dashboard")
}
