"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/auth"

const schema = z.object({
  name: z.string().min(1, "ユーザー名を入力してください").max(30),
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(8, "パスワードは8文字以上にしてください"),
})

export type RegisterState = { error?: string } | null

export async function createAccount(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  const email = parsed.data.email.toLowerCase().trim()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "このメールアドレスは既に登録されています" }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  await prisma.user.create({ data: { email, name: parsed.data.name, passwordHash } })

  let ok = true
  try {
    await signIn("credentials", { email, password: parsed.data.password, redirect: false })
  } catch {
    ok = false
  }
  redirect(ok ? "/onboarding" : "/login")
}
