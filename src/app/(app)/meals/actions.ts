"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { saveImage, deleteImage } from "@/lib/storage"

const MAX_BYTES = 12 * 1024 * 1024

export type MealState = { ok?: boolean; error?: string } | null

export async function uploadMeal(_prev: MealState, formData: FormData): Promise<MealState> {
  const user = await requireUser()
  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) return { error: "写真を選んでください" }
  if (!file.type.startsWith("image/")) return { error: "画像ファイルを選んでください" }
  if (file.size > MAX_BYTES) return { error: "12MB以下の画像にしてください" }

  const caption = z.string().max(140).optional().parse((formData.get("caption") as string) || undefined)
  const share = formData.get("share") === "on"

  const buf = Buffer.from(await file.arrayBuffer())
  const { imagePath, thumbPath } = await saveImage(buf)

  await prisma.mealPhoto.create({
    data: {
      userId: user.id,
      imagePath,
      thumbPath,
      caption: caption || null,
      sharedAt: share ? new Date() : null,
    },
  })
  revalidatePath("/meals")
  revalidatePath("/feed")
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function deleteMeal(id: string): Promise<void> {
  const user = await requireUser()
  const meal = await prisma.mealPhoto.findUnique({ where: { id } })
  if (!meal || meal.userId !== user.id) return
  await prisma.mealPhoto.delete({ where: { id } })
  await deleteImage(meal.imagePath, meal.thumbPath)
  revalidatePath("/meals")
  revalidatePath("/feed")
}

export async function setMealShared(id: string, shared: boolean): Promise<void> {
  const user = await requireUser()
  await prisma.mealPhoto.updateMany({
    where: { id, userId: user.id },
    data: { sharedAt: shared ? new Date() : null },
  })
  revalidatePath("/meals")
  revalidatePath("/feed")
}
