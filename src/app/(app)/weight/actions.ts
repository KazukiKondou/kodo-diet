"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { keyToDate } from "@/lib/day"

const schema = z.object({
  date: z.string().min(1),
  weightKg: z.coerce.number().min(20, "軽すぎます").max(400, "重すぎます"),
})

export type WeightState = { ok?: boolean; error?: string } | null

export async function upsertWeight(_prev: WeightState, formData: FormData): Promise<WeightState> {
  const user = await requireUser()
  const parsed = schema.safeParse({ date: formData.get("date"), weightKg: formData.get("weightKg") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  }
  const date = keyToDate(parsed.data.date)
  await prisma.weightEntry.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: { weightKg: parsed.data.weightKg },
    create: { userId: user.id, date, weightKg: parsed.data.weightKg },
  })
  revalidatePath("/weight")
  revalidatePath("/dashboard")
  return { ok: true }
}
