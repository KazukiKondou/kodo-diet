import { redirect } from "next/navigation"
import type { User } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

/** 未ログインなら /login へ。ログイン済みなら User を返す。 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}

/** 初回プロフィール（身長・性別・生年月日）が未入力か */
export function needsOnboarding(user: Pick<User, "heightCm" | "sex" | "birthDate">): boolean {
  return user.heightCm == null || user.sex == null || user.birthDate == null
}
