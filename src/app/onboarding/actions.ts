"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  birthDate: z.string().min(1, "生年月日を入力してください"),
  heightCm: z.coerce.number().min(80, "身長が小さすぎます").max(260, "身長が大きすぎます"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]),
  goalWeightKg: z.coerce.number().min(20).max(400).optional().or(z.literal(NaN).transform(() => undefined)),
  declaration: z.string().max(140, "宣言は140字以内で").optional(),
})

export type OnboardingState = { error?: string } | null

export async function saveOnboarding(_prev: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const user = await requireUser()
  const rawGoal = formData.get("goalWeightKg")
  const parsed = schema.safeParse({
    birthDate: formData.get("birthDate"),
    heightCm: formData.get("heightCm"),
    sex: formData.get("sex"),
    goalWeightKg: rawGoal ? Number(rawGoal) : undefined,
    declaration: (formData.get("declaration") as string) || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  }
  const d = parsed.data
  await prisma.user.update({
    where: { id: user.id },
    data: {
      birthDate: new Date(d.birthDate),
      heightCm: d.heightCm,
      sex: d.sex,
      goalWeightKg: Number.isFinite(d.goalWeightKg) ? d.goalWeightKg : null,
      declaration: d.declaration || null,
    },
  })
  redirect("/dashboard")
}
